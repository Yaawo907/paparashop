import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { formatXOF } from "@/lib/cart";

export const ORDER_STATUSES = [
  { value: "pending", label: "En attente" },
  { value: "processing", label: "Traitement en cours" },
  { value: "invoiced", label: "Facturé" },
  { value: "shipping", label: "Livraison en cours" },
  { value: "delivered", label: "Livré" },
  { value: "closed", label: "Clôturé" },
] as const;

const statusLabel = (value: string) =>
  ORDER_STATUSES.find((s) => s.value === value)?.label ??
  (value === "confirmed" ? "En attente" : value);

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

type ItemRow = {
  id: string;
  order_id: string;
  name: string;
  quantity: number;
  unit_price: number;
};

type EventRow = {
  id: string;
  order_id: string;
  status: string;
  changed_by_email: string | null;
  created_at: string;
};

/** 'confirmed' (ancien statut après paiement) est traité comme "en attente". */
const normalize = (s: string) => (s === "confirmed" ? "pending" : s);

export function OrdersAdmin() {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<string>("all");

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

  const { data: items = [] } = useQuery({
    queryKey: ["admin", "order-items"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("order_items")
        .select("id,order_id,name,quantity,unit_price");
      if (error) throw error;
      return data as ItemRow[];
    },
  });

  const { data: events = [] } = useQuery({
    queryKey: ["admin", "order-status-events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("order_status_events")
        .select("id,order_id,status,changed_by_email,created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as EventRow[];
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("orders").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Statut mis à jour");
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "order-status-events"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const o of orders) {
      const s = normalize(o.status);
      map[s] = (map[s] ?? 0) + 1;
    }
    return map;
  }, [orders]);

  const filtered = useMemo(
    () => (tab === "all" ? orders : orders.filter((o) => normalize(o.status) === tab)),
    [orders, tab],
  );

  const itemsOf = (orderId: string) => items.filter((i) => i.order_id === orderId);
  const lastEvent = (orderId: string) =>
    events.find((e) => e.order_id === orderId) ?? null;

  const ItemList = ({ orderId }: { orderId: string }) => {
    const list = itemsOf(orderId);
    if (list.length === 0)
      return <p className="text-xs text-muted-foreground">Articles non enregistrés.</p>;
    return (
      <ul className="space-y-1 text-xs">
        {list.map((i) => (
          <li key={i.id} className="flex justify-between gap-2">
            <span className="truncate">
              {i.name} × {i.quantity}
            </span>
            <span className="shrink-0 font-medium">
              {formatXOF(Number(i.unit_price) * i.quantity)}
            </span>
          </li>
        ))}
      </ul>
    );
  };

  const StatusSelect = ({ order }: { order: OrderRow }) => (
    <select
      className="w-full rounded-lg border border-border bg-background px-2 py-1 text-xs"
      value={normalize(order.status)}
      disabled={updateStatus.isPending}
      onChange={(e) => updateStatus.mutate({ id: order.id, status: e.target.value })}
    >
      {ORDER_STATUSES.map((s) => (
        <option key={s.value} value={s.value}>
          {s.label}
        </option>
      ))}
    </select>
  );

  const StatusMeta = ({ orderId }: { orderId: string }) => {
    const ev = lastEvent(orderId);
    if (!ev) return null;
    return (
      <p className="mt-1 text-[11px] text-muted-foreground">
        {statusLabel(ev.status)} · {new Date(ev.created_at).toLocaleString("fr-FR")}
        {ev.changed_by_email ? ` · ${ev.changed_by_email}` : ""}
      </p>
    );
  };

  if (isLoading) return <p className="text-sm text-muted-foreground">Chargement…</p>;

  return (
    <div className="space-y-4">
      <h2 className="font-display text-xl font-bold text-primary">Commandes</h2>

      <div className="flex flex-wrap gap-2">
        {[{ value: "all", label: "Tout" }, ...ORDER_STATUSES].map((s) => {
          const count = s.value === "all" ? orders.length : (counts[s.value] ?? 0);
          const active = tab === s.value;
          return (
            <button
              key={s.value}
              type="button"
              onClick={() => setTab(s.value)}
              className={
                active
                  ? "rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
                  : "rounded-full bg-muted px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-muted/70"
              }
            >
              {s.label} ({count})
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground">Aucune commande dans cet état.</p>
      ) : (
        <>
          {/* Mobile : cartes */}
          <div className="space-y-3 md:hidden">
            {filtered.map((o) => (
              <div key={o.id} className="rounded-xl border border-border bg-card p-3">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
                  <p className="truncate font-mono text-xs text-muted-foreground">
                    {o.order_number}
                  </p>
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
                <div className="mt-2 rounded-lg bg-muted/40 p-2">
                  <ItemList orderId={o.id} />
                </div>
                <div className="mt-2">
                  <StatusSelect order={o} />
                  <StatusMeta orderId={o.id} />
                </div>
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
                  <th className="p-3">Articles</th>
                  <th className="p-3">Livraison</th>
                  <th className="p-3">Total</th>
                  <th className="p-3">Paiement</th>
                  <th className="p-3 min-w-[190px]">Statut</th>
                  <th className="p-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((o) => (
                  <tr key={o.id} className="border-t border-border">
                    <td className="p-3 font-mono text-xs">{o.order_number}</td>
                    <td className="p-3">{o.customer_name}</td>
                    <td className="p-3">
                      <div>{o.customer_phone}</div>
                      <div className="text-xs text-muted-foreground">{o.customer_email}</div>
                    </td>
                    <td className="p-3 min-w-[200px]">
                      <ItemList orderId={o.id} />
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
                    <td className="p-3">
                      <StatusSelect order={o} />
                      <StatusMeta orderId={o.id} />
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
