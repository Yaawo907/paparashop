import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getSecretNames, getSystemTables } from "@/lib/system.functions";

export function SystemAdmin() {
  const fetchTables = useServerFn(getSystemTables);
  const fetchSecrets = useServerFn(getSecretNames);

  const tables = useQuery({ queryKey: ["admin", "system-tables"], queryFn: () => fetchTables({}) });
  const secrets = useQuery({ queryKey: ["admin", "secrets"], queryFn: () => fetchSecrets({}) });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-xl font-bold text-primary">Secrets configurés</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Les valeurs ne sont jamais affichées ni transmises au navigateur.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {secrets.isLoading && <p className="text-sm text-muted-foreground">Chargement…</p>}
          {(secrets.data ?? []).map((name) => (
            <span
              key={name}
              className="rounded-full border border-border bg-card px-3 py-1 font-mono text-xs text-primary"
            >
              {name} · ••••••
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="font-display text-xl font-bold text-primary">Tables techniques</h2>
        {tables.isLoading && <p className="text-sm text-muted-foreground">Chargement…</p>}
        {(tables.data ?? []).map((t) => (
          <div key={t.name} className="rounded-xl border border-border bg-card p-4">
            <p className="font-display text-sm font-bold text-primary">
              {t.label}{" "}
              <span className="font-mono text-xs font-normal text-muted-foreground">
                {t.name} · {t.count} ligne(s)
              </span>
            </p>
            {t.error && <p className="mt-2 text-xs text-destructive">{t.error}</p>}
            {t.rows.length === 0 ? (
              <p className="mt-2 text-sm text-muted-foreground">Aucune donnée.</p>
            ) : (
              <div className="mt-3 max-h-80 overflow-auto">
                <table className="w-full text-left text-xs">
                  <thead className="sticky top-0 bg-card">
                    <tr>
                      {Object.keys(t.rows[0]).map((c) => (
                        <th key={c} className="whitespace-nowrap px-2 py-1 font-semibold text-primary">
                          {c}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {t.rows.map((row, i) => (
                      <tr key={i} className="border-t border-border/60">
                        {Object.keys(t.rows[0]).map((c) => (
                          <td
                            key={c}
                            className="max-w-[220px] truncate px-2 py-1 text-muted-foreground"
                            title={fmt(row[c])}
                          >
                            {fmt(row[c])}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function fmt(v: unknown) {
  if (v === null || v === undefined) return "—";
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}
