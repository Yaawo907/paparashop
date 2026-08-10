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
export function buildStaffWhatsAppLink(order: Order, items: OrderItem[]) {
  const number = (process.env["ORDER_ALERT_WHATSAPP"] ?? "").replace(/\D/g, "");
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
export async function notifyOrderPaid(order: Order, items: OrderItem[]) {
  const waLink = buildStaffWhatsAppLink(order, items);
  const staffEmail = process.env["ORDER_ALERT_EMAIL"];
  const receipt = buildReceiptText(order, items);

  console.log(`[order-paid] ${order.order_number}\n${receipt}\nWhatsApp: ${waLink ?? "n/a"}`);

  const send = async (to: string, subject: string, body: string) => {
    const base = process.env["SITE_URL"] ?? "";
    if (!base) return;
    const res = await fetch(`${base}/lovable/email/transactional/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env["LOVABLE_API_KEY"] ?? ""}`,
      },
      body: JSON.stringify({
        templateName: "order-receipt",
        recipientEmail: to,
        idempotencyKey: `${order.id}-${to}`,
        templateData: { subject, body, orderNumber: order.order_number },
      }),
    });
    if (!res.ok) console.error(`[order-email] ${res.status} ${await res.text()}`);
  };

  try {
    await send(order.customer_email, `Reçu de votre commande ${order.order_number}`, receipt);
    if (staffEmail) {
      await send(
        staffEmail,
        `Nouvelle commande payée ${order.order_number}`,
        `${receipt}\n\nRépondre au client : ${waLink ?? ""}`,
      );
    }
  } catch (err) {
    console.error("[order-email] envoi impossible", err);
  }

  return { whatsappLink: waLink };
}
