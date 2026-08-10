import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Pencil, Trash2, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

import {
  deleteSystemRow,
  getAppSettings,
  getSecretNames,
  getSystemTables,
  setAppSetting,
  updateSystemRow,
  type SettingEntry,
} from "@/lib/system.functions";
import { READONLY_COLUMNS, type SystemTable } from "@/lib/system.shared";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type EditState = { table: string; label: string; row: Record<string, string> } | null;
type DeleteState = { table: string; id: string } | null;

export function SystemAdmin() {
  const fetchTables = useServerFn(getSystemTables);
  const fetchSecrets = useServerFn(getSecretNames);
  const fetchSettings = useServerFn(getAppSettings);
  const saveSetting = useServerFn(setAppSetting);
  const saveRow = useServerFn(updateSystemRow);
  const removeRow = useServerFn(deleteSystemRow);
  const qc = useQueryClient();

  const [edit, setEdit] = useState<EditState>(null);
  const [confirmDelete, setConfirmDelete] = useState<DeleteState>(null);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [testEmail, setTestEmail] = useState("");

  const testEmailMutation = useMutation({
    mutationFn: async (recipientEmail: string) => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) throw new Error("Session expirée");
      const res = await fetch("/lovable/email/transactional/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          templateName: "email-test",
          recipientEmail,
          idempotencyKey: `admin-test-${crypto.randomUUID()}`,
          templateData: {
            recipientName: "",
            sentAt: new Date().toLocaleString("fr-FR"),
          },
        }),
      });
      const json = await res.json().catch(() => ({ error: "Réponse invalide" }));
      if (!res.ok) throw new Error(json.error || `Erreur ${res.status}`);
      return json;
    },
    onSuccess: () => {
      toast.success("E-mail de test envoyé — vérifiez la boîte de réception");
      setTestEmail("");
    },
    onError: (e: Error) => toast.error(e.message || "Échec de l'envoi"),
  });



  const tables = useQuery({
    queryKey: ["admin", "system-tables"],
    queryFn: () => fetchTables({}) as Promise<SystemTable[]>,
  });
  const secrets = useQuery({
    queryKey: ["admin", "secrets"],
    queryFn: () => fetchSecrets({}) as Promise<string[]>,
  });
  const settings = useQuery({
    queryKey: ["admin", "app-settings"],
    queryFn: () => fetchSettings({}) as Promise<SettingEntry[]>,
  });

  const settingMutation = useMutation({
    mutationFn: (v: { key: string; value: string }) => saveSetting({ data: v }),
    onSuccess: (_r, v) => {
      toast.success("Paramètre enregistré");
      setDrafts((d) => ({ ...d, [v.key]: "" }));
      qc.invalidateQueries({ queryKey: ["admin", "app-settings"] });
    },
    onError: (e: Error) => toast.error(e.message || "Échec de l'enregistrement"),
  });


  const updateMutation = useMutation({
    mutationFn: (v: { table: string; id: string; patch: Record<string, string> }) =>
      saveRow({ data: v }),
    onSuccess: () => {
      toast.success("Ligne mise à jour");
      setEdit(null);
      qc.invalidateQueries({ queryKey: ["admin", "system-tables"] });
    },
    onError: (e: Error) => toast.error(e.message || "Échec de la mise à jour"),
  });

  const deleteMutation = useMutation({
    mutationFn: (v: { table: string; id: string }) => removeRow({ data: v }),
    onSuccess: () => {
      toast.success("Ligne supprimée");
      setConfirmDelete(null);
      qc.invalidateQueries({ queryKey: ["admin", "system-tables"] });
    },
    onError: (e: Error) => toast.error(e.message || "Échec de la suppression"),
  });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-xl font-bold text-primary">Clés & paramètres</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Modifiez ici vos clés KKiaPay et les destinataires d'alerte. Les valeurs sont stockées côté
          serveur et n'apparaissent jamais en clair : seules les 4 premiers et derniers caractères
          sont affichés.
        </p>

        <div className="mt-3 space-y-3">
          {settings.isLoading && <p className="text-sm text-muted-foreground">Chargement…</p>}
          {(settings.data ?? []).map((s) => (
            <div
              key={s.key}
              className="rounded-xl border border-border bg-card p-3 sm:flex sm:items-end sm:gap-3"
            >
              <div className="min-w-0 flex-1">
                <Label htmlFor={`set-${s.key}`} className="text-xs">
                  {s.label}
                </Label>
                <p className="truncate font-mono text-[11px] text-muted-foreground">
                  {s.key} · {s.masked || "non défini"} ·{" "}
                  {s.source === "db" ? "modifié ici" : s.source === "env" ? "valeur plateforme" : "vide"}
                </p>
                <Input
                  id={`set-${s.key}`}
                  className="mt-2"
                  type={s.secret ? "password" : "text"}
                  autoComplete="off"
                  placeholder="Nouvelle valeur…"
                  value={drafts[s.key] ?? ""}
                  onChange={(e) => setDrafts((d) => ({ ...d, [s.key]: e.target.value }))}
                />
              </div>
              <Button
                className="mt-2 w-full sm:mt-0 sm:w-auto"
                disabled={!((drafts[s.key] ?? "").trim()) || settingMutation.isPending}
                onClick={() =>
                  settingMutation.mutate({ key: s.key, value: (drafts[s.key] ?? "").trim() })
                }
              >
                Enregistrer
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {(secrets.data ?? []).map((name) => (
            <span
              key={name}
              className="rounded-full border border-border bg-card px-3 py-1 font-mono text-[11px] text-muted-foreground"
            >
              {name} · ••••••
            </span>
          ))}
        </div>
      </div>

      <div>
        <h2 className="font-display text-xl font-bold text-primary">Test d’e-mail</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Envoyez un e-mail de test depuis <strong>notify.paparashop.net</strong> pour vérifier la
          délivrabilité. L’e-mail partira depuis <code>noreply@paparashop.net</code>.
        </p>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <Label htmlFor="test-email" className="text-xs">
              Adresse de test
            </Label>
            <Input
              id="test-email"
              type="email"
              placeholder="vous@exemple.com"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
            />
          </div>
          <Button
            onClick={() => testEmailMutation.mutate(testEmail.trim())}
            disabled={!testEmail.trim() || testEmailMutation.isPending}
          >
            <Send className="mr-2 h-4 w-4" />
            {testEmailMutation.isPending ? "Envoi…" : "Envoyer un test"}
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="font-display text-xl font-bold text-primary">Tables techniques</h2>

        <p className="-mt-4 text-xs text-muted-foreground">
          Modification directe en base : à utiliser avec prudence. Les colonnes techniques (id, dates,
          liens) restent en lecture seule.
        </p>
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
                      <th className="px-2 py-1" />
                      {Object.keys(t.rows[0]).map((c) => (
                        <th key={c} className="whitespace-nowrap px-2 py-1 font-semibold text-primary">
                          {c}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {t.rows.map((row, i) => (
                      <tr key={row["id"] ?? i} className="border-t border-border/60">
                        <td className="whitespace-nowrap px-2 py-1">
                          <div className="flex gap-1">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7"
                              aria-label="Modifier la ligne"
                              onClick={() => setEdit({ table: t.name, label: t.label, row })}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            {row["id"] && (
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7 text-destructive"
                                aria-label="Supprimer la ligne"
                                onClick={() =>
                                  setConfirmDelete({ table: t.name, id: row["id"] as string })
                                }
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            )}
                          </div>
                        </td>
                        {Object.keys(t.rows[0]).map((c) => (
                          <td
                            key={c}
                            className="max-w-[220px] truncate px-2 py-1 text-muted-foreground"
                            title={row[c]}
                          >
                            {row[c]}
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

      <Dialog open={Boolean(edit)} onOpenChange={(o) => !o && setEdit(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Modifier — {edit?.label}</DialogTitle>
            <DialogDescription className="font-mono text-xs">{edit?.table}</DialogDescription>
          </DialogHeader>
          {edit && (
            <form
              className="space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                const id = edit.row["id"];
                if (!id) {
                  toast.error("Cette ligne n'a pas d'identifiant modifiable");
                  return;
                }
                const patch: Record<string, string> = {};
                for (const [k, v] of Object.entries(edit.row)) {
                  if (!READONLY_COLUMNS.includes(k)) patch[k] = v;
                }
                updateMutation.mutate({ table: edit.table, id, patch });
              }}
            >
              {Object.entries(edit.row).map(([col, val]) => {
                const readonly = READONLY_COLUMNS.includes(col);
                return (
                  <div key={col} className="space-y-1">
                    <Label htmlFor={`f-${col}`} className="font-mono text-xs">
                      {col}
                      {readonly && <span className="ml-1 text-muted-foreground">(lecture seule)</span>}
                    </Label>
                    <Input
                      id={`f-${col}`}
                      value={val}
                      readOnly={readonly}
                      disabled={readonly}
                      onChange={(e) =>
                        setEdit((prev) =>
                          prev ? { ...prev, row: { ...prev.row, [col]: e.target.value } } : prev,
                        )
                      }
                    />
                  </div>
                );
              })}
              <DialogFooter className="gap-2 sm:gap-0">
                <Button type="button" variant="outline" onClick={() => setEdit(null)}>
                  Annuler
                </Button>
                <Button type="submit" disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? "Enregistrement…" : "Enregistrer"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={Boolean(confirmDelete)} onOpenChange={(o) => !o && setConfirmDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cette ligne ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est définitive et s'applique directement à la base de données.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => confirmDelete && deleteMutation.mutate(confirmDelete)}
              disabled={deleteMutation.isPending}
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
