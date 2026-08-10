import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatXOF } from "@/lib/cart";

type OrderRow = {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  country: string;
  city: string;
  address: string;
  total: number;
  status: string;
  payment_status: string;
  transaction_id: string | null;
  created_at: string;
};

export function OrdersAdmin() {
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["admin", "orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as OrderRow[];
    },
  });

  if (isLoading) return <p className="text-sm text-muted-foreground">Chargement…</p>;

  return (
    <div className="space-y-4">
      <h2 className="font-display text-xl font-bold text-primary">Commandes</h2>
      {orders.length === 0 ? (
        <p className="text-sm text-muted-foreground">Aucune commande pour le moment.</p>
      ) : (
        <>
        {/* Mobile : cartes */}
        <div className="space-y-3 md:hidden">
          {orders.map((o) => (
            <div key={o.id} className="rounded-xl border border-border bg-card p-3">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
                <p className="truncate font-mono text-xs text-muted-foreground">{o.order_number}</p>
                <span
                  className={
                    o.payment_status === "paid"
                      ? "shrink-0 rounded-full bg-primary/10 px-2 py-1 text-[11px] font-semibold text-primary"
                      : "shrink-0 rounded-full bg-muted px-2 py-1 text-[11px] font-semibold text-muted-foreground"
                  }
                >
                  {o.payment_status}
                </span>
              </div>
              <p className="mt-1 truncate font-semibold text-foreground">{o.customer_name}</p>
              <p className="truncate text-xs text-muted-foreground">
                {o.customer_phone} · {o.customer_email}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {[o.address, o.city, o.country].filter(Boolean).join(", ")}
              </p>
              <div className="mt-2 flex items-center justify-between gap-2">
                <span className="font-semibold text-primary">{formatXOF(Number(o.total))}</span>
                <span className="text-[11px] text-muted-foreground">
                  {new Date(o.created_at).toLocaleString("fr-FR")}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="hidden overflow-x-auto rounded-xl border border-border md:block">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="p-3">N°</th>
                <th className="p-3">Client</th>
                <th className="p-3">Contact</th>
                <th className="p-3">Livraison</th>
                <th className="p-3">Total</th>
                <th className="p-3">Paiement</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-t border-border">
                  <td className="p-3 font-mono text-xs">{o.order_number}</td>
                  <td className="p-3">{o.customer_name}</td>
                  <td className="p-3">
                    <div>{o.customer_phone}</div>
                    <div className="text-xs text-muted-foreground">{o.customer_email}</div>
                  </td>
                  <td className="p-3 text-xs">
                    {[o.address, o.city, o.country].filter(Boolean).join(", ")}
                  </td>
                  <td className="p-3 font-semibold">{formatXOF(Number(o.total))}</td>
                  <td className="p-3">
                    <span
                      className={
                        o.payment_status === "paid"
                          ? "rounded-full bg-primary/10 px-2 py-1 text-xs font-semibold text-primary"
                          : "rounded-full bg-muted px-2 py-1 text-xs font-semibold text-muted-foreground"
                      }
                    >
                      {o.payment_status}
                    </span>
                  </td>
                  <td className="p-3 text-xs text-muted-foreground">
                    {new Date(o.created_at).toLocaleString("fr-FR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </>
      )}
    </div>
  );
}
