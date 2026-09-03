import { useCallback, useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import type { CmsTrustedClient } from "@/lib/cms-types";
import {
  useBulkDelete,
  useBulkUpdate,
  useDeleteRow,
  useRows,
  useSaveRow,
} from "@/components/admin/useCrud";
import { ImageField } from "@/components/admin/ImageField";
import { AdminDataTable, type AdminColumn } from "@/components/admin/AdminDataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export function ClientsAdmin() {
  const { data: clients = [], isLoading } = useRows<CmsTrustedClient>("trusted_clients");
  const save = useSaveRow("trusted_clients");
  const remove = useDeleteRow("trusted_clients");
  const bulkUpdate = useBulkUpdate("trusted_clients");
  const bulkDelete = useBulkDelete("trusted_clients");
  const [draft, setDraft] = useState<Partial<CmsTrustedClient> | null>(null);

  const columns: AdminColumn<CmsTrustedClient>[] = useMemo(
    () => [
      {
        key: "name",
        header: "Client",
        value: (c) => c.name,
        render: (c) => (
          <div className="flex items-center gap-3">
            {c.logo_url && (
              <img src={c.logo_url} alt="" className="h-9 w-9 rounded object-contain" loading="lazy" />
            )}
            <span className="font-medium text-primary">{c.name}</span>
          </div>
        ),
      },
      {
        key: "sector",
        header: "Secteur",
        value: (c) => c.sector || "",
        className: "hidden md:table-cell text-muted-foreground",
      },
      {
        key: "position",
        header: "Ordre",
        value: (c) => c.position,
        className: "hidden sm:table-cell text-right",
      },
      {
        key: "is_active",
        header: "Visible",
        value: (c) => (c.is_active ? "Oui" : "Non"),
        render: (c) => (c.is_active ? "✓" : "—"),
        className: "text-center",
      },
    ],
    [],
  );

  const searchFields = useCallback((c: CmsTrustedClient) => [c.name, c.sector, c.url], []);

  if (isLoading) return <p className="text-sm text-muted-foreground">Chargement…</p>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-xl font-bold text-primary">Ils nous font confiance</h2>
        <Button
          size="sm"
          onClick={() =>
            setDraft({ name: "", sector: "", logo_url: "", url: "", position: 99, is_active: true })
          }
        >
          <Plus className="mr-1 h-4 w-4" /> Nouveau client
        </Button>
      </div>

      {draft && (
        <ClientForm
          value={draft}
          onCancel={() => setDraft(null)}
          onSave={(v) => save.mutate(v, { onSuccess: () => setDraft(null) })}
        />
      )}

      <AdminDataTable
        rows={clients}
        columns={columns}
        getId={(c) => c.id}
        searchFields={searchFields}
        searchPlaceholder="Rechercher un client (nom, secteur)…"
        noun="client"
        csvName="clients"
        onBulkVisibility={(ids, visible) => bulkUpdate.mutate({ ids, patch: { is_active: visible } })}
        onBulkDelete={(ids) => bulkDelete.mutate(ids)}
        emptyLabel="Aucun client trouvé."
        renderExpanded={(c) => (
          <ClientForm
            value={c}
            onSave={(v) => save.mutate(v)}
            onDelete={() => {
              if (confirm(`Supprimer « ${c.name} » ?`)) remove.mutate(c.id);
            }}
          />
        )}
      />
    </div>
  );
}

function ClientForm({
  value,
  onSave,
  onDelete,
  onCancel,
}: {
  value: Partial<CmsTrustedClient>;
  onSave: (v: Partial<CmsTrustedClient>) => void;
  onDelete?: () => void;
  onCancel?: () => void;
}) {
  const [form, setForm] = useState<Partial<CmsTrustedClient>>(value);
  const set = (patch: Partial<CmsTrustedClient>) => setForm((f) => ({ ...f, ...patch }));

  return (
    <div className="space-y-4 rounded-xl border border-border bg-background p-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Nom</Label>
          <Input value={form.name ?? ""} onChange={(e) => set({ name: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Secteur</Label>
          <Input value={form.sector ?? ""} onChange={(e) => set({ sector: e.target.value })} />
        </div>
      </div>
      <ImageField
        label="Logo"
        folder="clients"
        value={form.logo_url ?? ""}
        onChange={(url) => set({ logo_url: url })}
      />
      <div className="space-y-2">
        <Label>Site web (ouvert au clic)</Label>
        <Input
          value={form.url ?? ""}
          placeholder="https://…"
          onChange={(e) => set({ url: e.target.value })}
        />
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Label>Ordre</Label>
          <Input
            type="number"
            className="w-20"
            value={form.position ?? 0}
            onChange={(e) => set({ position: Number(e.target.value) })}
          />
        </div>
        <div className="flex items-center gap-2">
          <Switch checked={form.is_active ?? true} onCheckedChange={(v) => set({ is_active: v })} />
          <Label>Visible</Label>
        </div>
        <div className="ml-auto flex gap-2">
          {onCancel && (
            <Button variant="ghost" size="sm" onClick={onCancel}>
              Annuler
            </Button>
          )}
          {onDelete && (
            <Button variant="destructive" size="sm" onClick={onDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
          <Button size="sm" onClick={() => onSave(form)}>
            Enregistrer
          </Button>
        </div>
      </div>
    </div>
  );
}
