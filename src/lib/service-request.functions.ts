import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";

const schema = z.object({
  type: z.enum(["sav", "commande"]),
  name: z.string().trim().min(1).max(100),
  contact: z.string().trim().min(3).max(255),
  product: z.string().trim().min(1).max(255),
  message: z.string().trim().max(2000).default(""),
});

/** Envoie la demande SAV / commande spéciale au service clientèle par e-mail. */
export const sendServiceRequest = createServerFn({ method: "POST" })
  .inputValidator((data) => schema.parse(data))
  .handler(async ({ data }) => {
    const { getSetting } = await import("@/lib/app-settings.server");
    const { SITE } = await import("@/lib/site");

    const staffEmail = (await getSetting("ORDER_ALERT_EMAIL")) || SITE.email;
    const requestType =
      data.type === "sav"
        ? "Demande SAV / Assistance technique"
        : "Commande spéciale (importation 10 jours)";

    const origin = new URL(getRequest().url).origin;
    const base = origin || process.env["SITE_URL"] || "https://paparashop.net";

    const idempotencyKey = `svc-${data.type}-${Date.now()}-${data.contact.slice(-6)}`;
    const res = await fetch(`${base}/lovable/email/transactional/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env["SUPABASE_SERVICE_ROLE_KEY"] ?? ""}`,
      },
      body: JSON.stringify({
        templateName: "service-request",
        recipientEmail: staffEmail,
        idempotencyKey,
        templateData: {
          requestType,
          customerName: data.name,
          customerContact: data.contact,
          product: data.product,
          details: data.message,
        },
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error(`[service-request] ${res.status} ${body}`);
      try {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        await (supabaseAdmin as any).from("email_send_log").insert({
          message_id: idempotencyKey,
          template_name: "service-request",
          recipient_email: staffEmail,
          status: "failed",
          error_message: `HTTP ${res.status} — ${body}`.slice(0, 1000),
        });
      } catch (e) {
        console.error("[service-request] journalisation impossible", e);
      }
      throw new Error("L'envoi de la demande a échoué. Réessayez ou utilisez WhatsApp.");
    }

    return { ok: true };
  });
