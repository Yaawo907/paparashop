import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Loader2, ShieldCheck, ShoppingCart } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { formatXOF, useCart } from "@/lib/cart";
import { confirmPayment, createOrder, getPaymentConfig } from "@/lib/orders.functions";

export const Route = createFileRoute("/panier")({
  component: PanierPage,
  head: () => ({
    meta: [
      { title: "Panier & paiement — Papara Shop" },
      {
        name: "description",
        content:
          "Finalisez votre commande d'équipement audiovisuel Papara Shop et payez en ligne en toute sécurité (Mobile Money, carte bancaire).",
      },
      { property: "og:title", content: "Panier & paiement — Papara Shop" },
      {
        property: "og:description",
        content: "Commandez votre matériel photo, vidéo et audio et payez en ligne en sécurité.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  notFoundComponent: () => <div className="p-10 text-center">Page introuvable.</div>,
});

declare global {
  interface Window {
    openKkiapayWidget?: (opts: Record<string, unknown>) => void;
    addSuccessListener?: (cb: (res: { transactionId: string }) => void) => void;
    addFailedListener?: (cb: (res: unknown) => void) => void;
  }
}

function useKkiapayScript() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (window.openKkiapayWidget) {
      setReady(true);
      return;
    }
    const s = document.createElement("script");
    s.src = "https://cdn.kkiapay.me/k.js";
    s.async = true;
    s.onload = () => setReady(true);
    document.body.appendChild(s);
  }, []);
  return ready;
}

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  country: "Bénin",
  city: "",
  address: "",
  notes: "",
};

function PanierPage() {
  const { lines, total, clear } = useCart();
  const scriptReady = useKkiapayScript();
  const createOrderFn = useServerFn(createOrder);
  const confirmPaymentFn = useServerFn(confirmPayment);
  const [form, setForm] = useState(emptyForm);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const orderRef = useRef<{ id: string; number: string } | null>(null);

  const { data: config } = useQuery({
    queryKey: ["payment", "config"],
    queryFn: () => getPaymentConfig(),
  });

  useEffect(() => {
    if (!scriptReady) return;
    window.addSuccessListener?.(async (res) => {
      const order = orderRef.current;
      if (!order) return;
      try {
        const result = await confirmPaymentFn({
          data: { orderId: order.id, transactionId: res.transactionId },
        });
        if (result.ok) {
          clear();
          setDone(result.orderNumber);
          toast.success("Paiement confirmé, merci !");
        } else {
          toast.error("Paiement non confirmé par l'opérateur.");
        }
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Vérification du paiement impossible.");
      } finally {
        setBusy(false);
      }
    });
    window.addFailedListener?.(() => {
      setBusy(false);
      toast.error("Le paiement a échoué ou a été annulé.");
    });
  }, [scriptReady, confirmPaymentFn, clear]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lines.length === 0) return;
    setBusy(true);
    try {
      const order = await createOrderFn({
        data: {
          customer: form,
          lines: lines.map((l) => ({ productId: l.id, quantity: l.quantity })),
        },
      });
      orderRef.current = { id: order.orderId, number: order.orderNumber };

      if (!config?.publicKey || !window.openKkiapayWidget) {
        setBusy(false);
        toast.error("Le module de paiement n'est pas disponible pour le moment.");
        return;
      }

      window.openKkiapayWidget({
        amount: order.total,
        key: config.publicKey,
        sandbox: false,
        position: "center",
        theme: "#0d9488",
        name: form.name,
        email: form.email,
        phone: form.phone,
        data: order.orderNumber,
      });
    } catch (err) {
      setBusy(false);
      toast.error(err instanceof Error ? err.message : "Commande impossible.");
    }
  };

  if (done) {
    return (
      <SiteLayout>
        <section className="mx-auto max-w-2xl px-4 py-32 text-center">
          <ShieldCheck className="mx-auto h-14 w-14 text-primary" />
          <h1 className="mt-6 font-display text-3xl font-bold text-primary">Commande confirmée</h1>
          <p className="mt-3 text-muted-foreground">
            Votre paiement a bien été reçu. Référence&nbsp;: <strong>{done}</strong>. Le service
            clientèle vous contacte très vite pour la livraison.
          </p>
        </section>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <section className="mx-auto max-w-6xl px-4 py-28 sm:px-6 lg:px-8">
        <h1 className="font-display text-3xl font-bold text-primary sm:text-4xl">
          Panier &amp; paiement
        </h1>

        {lines.length === 0 ? (
          <p className="mt-8 flex items-center gap-2 text-muted-foreground">
            <ShoppingCart className="h-5 w-5" /> Votre panier est vide.
          </p>
        ) : (
          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px]">
            <form onSubmit={submit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Nom complet" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required maxLength={120} />
                <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required maxLength={255} />
                <Field label="Téléphone / WhatsApp" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} required maxLength={30} />
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Pays
                  </label>
                  <select
                    value={form.country}
                    onChange={(e) => setForm({ ...form, country: e.target.value })}
                    className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  >
                    <option>Bénin</option>
                    <option>Burkina Faso</option>
                    <option>Togo</option>
                    <option>Autre</option>
                  </select>
                </div>
                <Field label="Ville" value={form.city} onChange={(v) => setForm({ ...form, city: v })} maxLength={120} />
                <Field label="Adresse de livraison" value={form.address} onChange={(v) => setForm({ ...form, address: v })} maxLength={400} />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Notes (optionnel)
                </label>
                <textarea
                  value={form.notes}
                  maxLength={1000}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  rows={3}
                  className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={busy}
                className="inline-flex items-center gap-2 rounded-md bg-accent px-6 py-3 font-display text-sm font-bold uppercase tracking-wider text-primary disabled:opacity-60"
              >
                {busy && <Loader2 className="h-4 w-4 animate-spin" />}
                Payer {formatXOF(total)}
              </button>
              <p className="text-xs text-muted-foreground">
                Paiement sécurisé par KKiaPay — Mobile Money &amp; carte bancaire.
              </p>
            </form>

            <aside className="h-fit rounded-2xl border border-border bg-card p-6">
              <h2 className="font-display text-lg font-bold text-primary">Récapitulatif</h2>
              <ul className="mt-4 space-y-3">
                {lines.map((l) => (
                  <li key={l.id} className="flex justify-between gap-3 text-sm">
                    <span className="text-muted-foreground">
                      {l.name} × {l.quantity}
                    </span>
                    <span className="font-semibold">{formatXOF(l.price * l.quantity)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex justify-between border-t border-border pt-4 font-display text-lg font-bold text-primary">
                <span>Total</span>
                <span>{formatXOF(total)}</span>
              </div>
            </aside>
          </div>
        )}
      </section>
    </SiteLayout>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
  maxLength,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  maxLength?: number;
}) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </label>
      <input
        type={type}
        value={value}
        required={required}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
      />
    </div>
  );
}
