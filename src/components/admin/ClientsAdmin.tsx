import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import type { CmsTrustedClient } from "@/lib/cms-types";
import { useDeleteRow, useRows, useSaveRow } from "@/components/admin/useCrud";
import { ImageField } from "@/components/admin/ImageField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export function ClientsAdmin() {
  const { data: clients = [], isLoading } = useRows<CmsTrustedClient>("trusted_clients");
  const save = useSaveRow("trusted_clients");
  const remove = useDeleteRow("trusted_clients");
  const [draft, setDraft] = useState<Partial<CmsTrustedClient> | null>(null);

  if (isLoading) return <p className="text-sm text-muted-foreground">Chargement…</p>;

  return (
    <div className="space-y-6">
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

      <div className="grid gap-4 md:grid-cols-2">
        {clients.map((c) => (
          <ClientForm
            key={c.id}
            value={c}
            onSave={(v) => save.mutate(v)}
            onDelete={() => {
              if (confirm(`Supprimer « ${c.name} » ?`)) remove.mutate(c.id);
            }}
          />
        ))}
      </div>
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
    <div className="space-y-4 rounded-xl border border-border bg-card p-4">
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
