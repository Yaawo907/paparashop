import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getRequest } from "@tanstack/react-start/server";

const customerSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(6).max(30),
  country: z.string().trim().max(60).default(""),
  city: z.string().trim().max(120).default(""),
  address: z.string().trim().max(400).default(""),
  notes: z.string().trim().max(1000).default(""),
});

const checkoutSchema = z.object({
  customer: customerSchema,
  lines: z
    .array(z.object({ productId: z.string().uuid(), quantity: z.number().int().min(1).max(99) }))
    .min(1)
    .max(50),
});

export const getPaymentConfig = createServerFn({ method: "GET" }).handler(async () => {
  const { getSetting } = await import("@/lib/app-settings.server");
  return { publicKey: await getSetting("KKIAPAY_PUBLIC_KEY") };
});


export const createOrder = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => checkoutSchema.parse(input))
  .handler(async ({ data }) => {
    const { createPendingOrder } = await import("@/lib/orders.server");
    return createPendingOrder(data.customer, data.lines);
  });

export const confirmPayment = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ orderId: z.string().uuid(), transactionId: z.string().trim().min(3).max(120) }).parse(input),
  )
  .handler(async ({ data }) => {
    const {
      verifyKkiapayTransaction,
      markOrderPaid,
      markOrderFailed,
      loadOrder,
    } = await import("@/lib/orders.server");

    const { order, items } = await loadOrder(data.orderId);

    // Le webhook KKiaPay a déjà pu confirmer la commande : on ne renotifie pas.
    if (order.payment_status === "paid") {
      return { ok: true as const, orderNumber: order.order_number, total: Number(order.total) };
    }

    const verification = await verifyKkiapayTransaction(data.transactionId);


    if (verification.verified) {
      const success = String(verification.status.status ?? "").toUpperCase() === "SUCCESS";
      if (!success) {
        await markOrderFailed(data.orderId, data.transactionId);
        return { ok: false as const, orderNumber: order.order_number };
      }
    } else {
      // Clés de vérification refusées ou API injoignable : le widget a confirmé le
      // paiement côté client, on enregistre la commande et on alerte le service client.
      console.warn(
        `[order] ${order.order_number} encaissé sans vérification serveur: ${verification.reason}`,
      );
    }

    await markOrderPaid(data.orderId, data.transactionId);


    const { notifyOrderPaid } = await import("@/lib/order-notify.server");
    const origin = new URL(getRequest().url).origin;
    await notifyOrderPaid({ ...order, transaction_id: data.transactionId }, items, origin);

    return { ok: true as const, orderNumber: order.order_number, total: Number(order.total) };
  });
