import type { Database } from "@/integrations/supabase/types";

type Order = Database["public"]["Tables"]["orders"]["Row"];
type OrderItem = Database["public"]["Tables"]["order_items"]["Row"];

function fmt(n: number) {
  return `${new Intl.NumberFormat("fr-FR").format(Math.round(n))} FCFA`;
}

export function buildReceiptText(order: Order, items: OrderItem[]) {
  const lines = items
    .map((i) => `- ${i.name} x${i.quantity} : ${fmt(Number(i.unit_price) * i.quantity)}`)
    .join("\n");
  return [
    `Commande ${order.order_number}`,
    `Client : ${order.customer_name} (${order.customer_phone})`,
    `Email : ${order.customer_email}`,
    `Livraison : ${[order.address, order.city, order.country].filter(Boolean).join(", ")}`,
    order.notes ? `Notes : ${order.notes}` : "",
    "",
    lines,
    "",
    `Total payé : ${fmt(Number(order.total))}`,
    `Transaction : ${order.transaction_id ?? "-"}`,
  ]
    .filter(Boolean)
    .join("\n");
}

/** Lien WhatsApp pré-rempli vers le service clientèle. */
export async function buildStaffWhatsAppLink(order: Order, items: OrderItem[]) {
  const { getSetting } = await import("@/lib/app-settings.server");
  const number = (await getSetting("ORDER_ALERT_WHATSAPP")).replace(/\D/g, "");
  if (!number) return null;
  return `https://wa.me/${number}?text=${encodeURIComponent(
    `NOUVELLE COMMANDE PAYÉE\n\n${buildReceiptText(order, items)}`,
  )}`;
}

/**
 * Notifie le service clientèle et le client après un paiement confirmé.
 * L'envoi d'email utilise l'infrastructure email du projet ; tant que le
 * domaine d'envoi n'est pas vérifié, l'échec est journalisé sans bloquer
 * la confirmation de la commande.
 */
export async function notifyOrderPaid(order: Order, items: OrderItem[], baseUrl = "") {
  const { getSetting } = await import("@/lib/app-settings.server");
  const waLink = await buildStaffWhatsAppLink(order, items);
  const staffEmail = await getSetting("ORDER_ALERT_EMAIL");
  const receipt = buildReceiptText(order, items);


  console.log(`[order-paid] ${order.order_number}\n${receipt}\nWhatsApp: ${waLink ?? "n/a"}`);

  const lines = items.map((i) => ({
    name: i.name,
    quantity: i.quantity,
    lineTotal: fmt(Number(i.unit_price) * i.quantity),
  }));
  const delivery = [order.address, order.city, order.country].filter(Boolean).join(", ");
  const common = {
    orderNumber: order.order_number,
    total: fmt(Number(order.total)),
    transactionId: order.transaction_id ?? "-",
    delivery,
    lines,
  };

  /** Trace un échec dans le journal des e-mails pour qu'il soit visible en admin. */
  const logFailure = async (to: string, templateName: string, message: string) => {
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      await (supabaseAdmin as any).from("email_send_log").insert({
        message_id: `${order.id}-${templateName}`,
        template_name: templateName,
        recipient_email: to,
        status: "failed",
        error_message: message.slice(0, 1000),
        metadata: { order_number: order.order_number },
      });
    } catch (e) {
      console.error("[order-email] journalisation impossible", e);
    }
  };

  const send = async (
    to: string,
    templateName: string,
    templateData: Record<string, unknown>,
  ) => {
    const base =
      baseUrl || process.env["SITE_URL"] || "https://paparashop.net";
    try {
      const res = await fetch(`${base}/lovable/email/transactional/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env["SUPABASE_SERVICE_ROLE_KEY"] ?? ""}`,
        },
        body: JSON.stringify({
          templateName,
          recipientEmail: to,
          idempotencyKey: `${order.id}-${templateName}`,
          templateData,
        }),
      });
      if (!res.ok) {
        const body = await res.text();
        console.error(`[order-email] ${res.status} ${body}`);
        await logFailure(to, templateName, `HTTP ${res.status} — ${body}`);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error("[order-email] envoi impossible", message);
      await logFailure(to, templateName, message);
    }
  };

  const { SITE, LOCATIONS } = await import("@/lib/site");
  const hq = LOCATIONS.find((l) => l.isHQ) ?? LOCATIONS[0];
  await send(order.customer_email, "order-receipt", {
    ...common,
    customerName: order.customer_name,
    supportEmail: SITE.email,
    whatsappUrl: hq?.whatsappHref ?? SITE.emailHref,
  });
  if (staffEmail) {
    await send(staffEmail, "order-alert", {
      ...common,
      customerName: order.customer_name,
      customerPhone: order.customer_phone,
      customerEmail: order.customer_email,
      notes: order.notes ?? "",
      whatsappLink: waLink ?? "",
    });
  }

  return { whatsappLink: waLink };
}

