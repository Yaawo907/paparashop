import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export type CheckoutLineInput = { productId: string; quantity: number };

export type CustomerInput = {
  name: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  address: string;
  notes: string;
};

function adminClient() {
  const url = process.env["SUPABASE_URL"]!;
  const key = process.env["SUPABASE_SERVICE_ROLE_KEY"]!;
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
          h.delete("Authorization");
        }
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

/**
 * Crée une commande en recalculant les prix depuis la base (jamais depuis le client).
 */
export async function createPendingOrder(customer: CustomerInput, lines: CheckoutLineInput[]) {
  const supabase = adminClient();
  const ids = [...new Set(lines.map((l) => l.productId))];
  const { data: products, error: prodErr } = await supabase
    .from("products")
    .select("id,name,image_url,price,is_active")
    .in("id", ids);
  if (prodErr) throw new Error(prodErr.message);

  const resolved = lines
    .map((l) => {
      const p = (products ?? []).find((x) => x.id === l.productId);
      if (!p || !p.is_active || !p.price || Number(p.price) <= 0) return null;
      const quantity = Math.max(1, Math.min(99, Math.floor(l.quantity)));
      return {
        product_id: p.id,
        name: p.name,
        image_url: p.image_url,
        unit_price: Number(p.price),
        quantity,
      };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  if (resolved.length === 0) throw new Error("Aucun article valide dans le panier.");

  const total = resolved.reduce((n, l) => n + l.unit_price * l.quantity, 0);

  const { data: order, error } = await supabase
    .from("orders")
    .insert({
      customer_name: customer.name,
      customer_email: customer.email,
      customer_phone: customer.phone,
      country: customer.country,
      city: customer.city,
      address: customer.address,
      notes: customer.notes,
      total,
    })
    .select("id,order_number,total")
    .single();
  if (error) throw new Error(error.message);

  const { error: itemsErr } = await supabase
    .from("order_items")
    .insert(resolved.map((l) => ({ ...l, order_id: order.id })));
  if (itemsErr) throw new Error(itemsErr.message);

  return { orderId: order.id, orderNumber: order.order_number, total: Number(order.total) };
}

type KkiapayStatus = { status?: string; amount?: number; transactionId?: string };

/** Vérifie une transaction auprès de KKiaPay. */
export async function verifyKkiapayTransaction(transactionId: string): Promise<KkiapayStatus> {
  const res = await fetch("https://api.kkiapay.me/api/v1/transactions/status", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env["KKIAPAY_PUBLIC_KEY"]!,
      "x-private-key": process.env["KKIAPAY_PRIVATE_KEY"]!,
      "x-secret-key": process.env["KKIAPAY_SECRET"]!,
    },
    body: JSON.stringify({ transactionId }),
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`KKiaPay [${res.status}]: ${text}`);
  }
  try {
    return JSON.parse(text) as KkiapayStatus;
  } catch {
    throw new Error(`Réponse KKiaPay inattendue: ${text}`);
  }
}

export async function loadOrder(orderId: string) {
  const supabase = adminClient();
  const { data: order, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .single();
  if (error) throw new Error(error.message);
  const { data: items } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", orderId);
  return { order, items: items ?? [] };
}

export async function markOrderPaid(orderId: string, transactionId: string) {
  const supabase = adminClient();
  const { error } = await supabase
    .from("orders")
    .update({
      payment_status: "paid",
      status: "confirmed",
      transaction_id: transactionId,
      paid_at: new Date().toISOString(),
    })
    .eq("id", orderId);
  if (error) throw new Error(error.message);
}

export async function markOrderFailed(orderId: string, transactionId: string | null) {
  const supabase = adminClient();
  await supabase
    .from("orders")
    .update({ payment_status: "failed", transaction_id: transactionId })
    .eq("id", orderId);
}
