import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getEmailLog, type EmailLogRow } from "@/lib/email-log.functions";
import { Button } from "@/components/ui/button";

const LABELS: Record<string, string> = {
  sent: "Envoyé",
  pending: "En file",
  failed: "En échec",
  dlq: "Abandonné",
  suppressed: "Bloqué (bounce/désinscrit)",
  bounced: "Bounce",
  complained: "Plainte",
};

const TEMPLATE_LABELS: Record<string, string> = {
  "order-receipt": "Reçu client",
  "order-alert": "Alerte commande (staff)",
  "email-test": "Test",
};

function badgeClass(status: string) {
  if (status === "sent") return "bg-primary/10 text-primary";
  if (status === "pending") return "bg-muted text-muted-foreground";
  if (status === "suppressed" || status === "bounced" || status === "complained")
    return "bg-amber-500/15 text-amber-700 dark:text-amber-400";
  return "bg-destructive/10 text-destructive";
}

const FILTERS = [
  { value: "all", label: "Tous" },
  { value: "orders", label: "Commandes" },
  { value: "sent", label: "Envoyés" },
  { value: "failed", label: "En échec" },
  { value: "suppressed", label: "Bloqués" },
];

export function EmailLogAdmin() {
  const fetchLog = useServerFn(getEmailLog);
  const [filter, setFilter] = useState("all");

  const { data = [], isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ["admin", "email-log"],
    queryFn: () => fetchLog({}) as Promise<EmailLogRow[]>,
  });

  const rows = useMemo(() => {
    if (filter === "all") return data;
    if (filter === "orders") return data.filter((r) => r.templateName.startsWith("order-"));
    if (filter === "failed")
      return data.filter((r) => ["failed", "dlq", "bounced", "complained"].includes(r.status));
    return data.filter((r) => r.status === filter);
  }, [data, filter]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-bold text-primary">Journal des e-mails</h2>
          <p className="text-xs text-muted-foreground">
            Reçus clients, alertes commandes et tests — statut et horodatage.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
          Actualiser
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            className={
              filter === f.value
                ? "rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground"
                : "rounded-full border border-border px-3 py-1 text-xs font-semibold text-muted-foreground"
            }
          >
            {f.label}
          </button>
        ))}
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Chargement…</p>}
      {error && <p className="text-sm text-destructive">{(error as Error).message}</p>}
      {!isLoading && rows.length === 0 && (
        <p className="text-sm text-muted-foreground">Aucun envoi enregistré pour ce filtre.</p>
      )}

      {rows.length > 0 && (
        <div className="space-y-2">
          {rows.map((r) => (
            <div key={r.id} className="rounded-xl border border-border bg-card p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-semibold text-foreground">
                  {TEMPLATE_LABELS[r.templateName] ?? r.templateName}
                </span>
                <span
                  className={`rounded-full px-2 py-1 text-[11px] font-semibold ${badgeClass(r.status)}`}
                >
                  {LABELS[r.status] ?? r.status}
                </span>
              </div>
              <p className="mt-1 break-all text-xs text-muted-foreground">{r.recipientEmail}</p>
              <p className="text-[11px] text-muted-foreground">
                {new Date(r.createdAt).toLocaleString("fr-FR")}
              </p>
              {r.errorMessage && (
                <p className="mt-2 break-all rounded-lg bg-destructive/5 p-2 text-[11px] text-destructive">
                  {r.errorMessage}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
