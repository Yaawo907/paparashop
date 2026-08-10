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

export type KkiapayVerification =
  | { verified: true; status: KkiapayStatus }
  /** Vérification impossible (clés API refusées / API injoignable) : on n'échoue pas la commande. */
  | { verified: false; reason: string };

const KKIAPAY_HOSTS = ["https://api.kkiapay.me", "https://api-sandbox.kkiapay.me"];

/** Vérifie une transaction auprès de KKiaPay. */
export async function verifyKkiapayTransaction(
  transactionId: string,
): Promise<KkiapayVerification> {
  let lastError = "";

  const { getSetting } = await import("@/lib/app-settings.server");
  const [publicKey, privateKey, secret] = await Promise.all([
    getSetting("KKIAPAY_PUBLIC_KEY"),
    getSetting("KKIAPAY_PRIVATE_KEY"),
    getSetting("KKIAPAY_SECRET"),
  ]);

  for (const host of KKIAPAY_HOSTS) {
    try {
      const res = await fetch(`${host}/api/v1/transactions/status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": publicKey,
          "x-private-key": privateKey,
          "x-secret-key": secret,
        },

        body: JSON.stringify({ transactionId }),
      });
      const text = await res.text();

      if (res.ok) {
        try {
          return { verified: true, status: JSON.parse(text) as KkiapayStatus };
        } catch {
          lastError = `Réponse inattendue: ${text.slice(0, 200)}`;
          continue;
        }
      }

      lastError = `[${res.status}] ${text.slice(0, 200)}`;
      // 401/403 = clés refusées sur cet environnement : on tente l'autre host.
      if (res.status !== 401 && res.status !== 403) break;
    } catch (err) {
      lastError = err instanceof Error ? err.message : String(err);
    }
  }

  console.error(`[kkiapay] vérification impossible (${transactionId}): ${lastError}`);
  return { verified: false, reason: lastError };
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
