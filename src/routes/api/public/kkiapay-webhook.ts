import { createFileRoute } from "@tanstack/react-router";
import { createHmac, timingSafeEqual } from "crypto";
import { z } from "zod";

const payloadSchema = z.object({
  transactionId: z.string().trim().min(3).max(120).optional(),
  transaction_id: z.string().trim().min(3).max(120).optional(),
  state: z.string().trim().max(40).optional(),
  status: z.string().trim().max(40).optional(),
  data: z.union([z.string(), z.record(z.string(), z.unknown())]).optional(),
  amount: z.union([z.number(), z.string()]).optional(),
});

function safeEqual(a: string, b: string) {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

/** Extrait la référence de commande transmise au widget (`data`). */
function extractRef(data: unknown): string | null {
  if (!data) return null;
  if (typeof data === "object") {
    const o = data as Record<string, unknown>;
    const v = o["orderId"] ?? o["orderNumber"] ?? o["order_number"];
    return typeof v === "string" ? v : null;
  }
  if (typeof data !== "string") return null;
  const raw = data.trim();
  if (!raw) return null;
  try {
    return extractRef(JSON.parse(raw));
  } catch {
    return raw;
  }
}

export const Route = createFileRoute("/api/public/kkiapay-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = await request.text();

        const { getSetting } = await import("@/lib/app-settings.server");
        const secret = (await getSetting("KKIAPAY_WEBHOOK_SECRET")).trim();
        if (!secret) {
          console.error("[kkiapay-webhook] KKIAPAY_WEBHOOK_SECRET non configuré");
          return new Response("Webhook not configured", { status: 503 });
        }

        // KKiaPay envoie soit le secret partagé en clair, soit une signature HMAC du corps brut.
        const headerSecret =
          request.headers.get("x-kkiapay-secret") ?? request.headers.get("x-secret-key") ?? "";
        const headerSignature =
          request.headers.get("x-kkiapay-signature") ?? request.headers.get("x-signature") ?? "";
        const expectedSignature = createHmac("sha256", secret).update(body).digest("hex");

        const authorized =
          (headerSecret !== "" && safeEqual(headerSecret, secret)) ||
          (headerSignature !== "" && safeEqual(headerSignature.toLowerCase(), expectedSignature));

        if (!authorized) {
          return new Response("Invalid signature", { status: 401 });
        }

        let parsed: z.infer<typeof payloadSchema>;
        try {
          parsed = payloadSchema.parse(JSON.parse(body));
        } catch {
          return new Response("Invalid payload", { status: 400 });
        }

        const transactionId = parsed.transactionId ?? parsed.transaction_id ?? "";
        const state = String(parsed.state ?? parsed.status ?? "").toUpperCase();
        const ref = extractRef(parsed.data);

        if (!transactionId || !ref) {
          return new Response("Missing transaction reference", { status: 400 });
        }

        const { findOrderByReference, markOrderPaid, markOrderFailed, loadOrder } = await import(
          "@/lib/orders.server"
        );

        const order = await findOrderByReference(ref);
        if (!order) return new Response("Order not found", { status: 404 });

        const success = state === "SUCCESS" || state === "COMPLETED" || state === "PAID";
        if (!success) {
          await markOrderFailed(order.id, transactionId);
          return Response.json({ ok: true, handled: "failed" });
        }

        // Idempotence : une notification déjà traitée ne renvoie pas d'e-mail.
        if (order.payment_status === "paid") {
          return Response.json({ ok: true, handled: "already-paid" });
        }

        await markOrderPaid(order.id, transactionId);

        try {
          const { order: fresh, items } = await loadOrder(order.id);
          const { notifyOrderPaid } = await import("@/lib/order-notify.server");
          await notifyOrderPaid(fresh, items, new URL(request.url).origin);
        } catch (err) {
          console.error("[kkiapay-webhook] notification échouée", err);
        }

        return Response.json({ ok: true, handled: "paid" });
      },
    },
  },
});
