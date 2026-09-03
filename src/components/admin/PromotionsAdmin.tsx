import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import type { CmsPromotion } from "@/lib/cms-types";
import { useDeleteRow, useRows, useSaveRow } from "@/components/admin/useCrud";
import { ImageField } from "@/components/admin/ImageField";
import { AdminSearch } from "@/components/admin/AdminSearch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function PromotionsAdmin() {
  const { data: promos = [], isLoading } = useRows<CmsPromotion>("promotions");
  const save = useSaveRow("promotions");
  const remove = useDeleteRow("promotions");
  const [draft, setDraft] = useState<Partial<CmsPromotion> | null>(null);
  const [search, setSearch] = useState("");

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return promos;
    return promos.filter((p) =>
      [p.title, p.description, p.url].some((v) => (v ?? "").toLowerCase().includes(q)),
    );
  }, [promos, search]);

  if (isLoading) return <p className="text-sm text-muted-foreground">Chargement…</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-primary">Promotions</h2>
        <Button
          size="sm"
          onClick={() =>
            setDraft({ title: "", description: "", image_url: "", position: 99, is_active: true })
          }
        >
          <Plus className="mr-1 h-4 w-4" /> Nouvelle promotion
        </Button>
      </div>

      <AdminSearch
        value={search}
        onChange={setSearch}
        placeholder="Rechercher une promotion…"
        count={rows.length}
        noun="promotion"
      />

      {draft && (
        <PromoForm
          value={draft}
          onCancel={() => setDraft(null)}
          onSave={(v) => save.mutate(v, { onSuccess: () => setDraft(null) })}
        />
      )}

      {rows.length === 0 && (
        <p className="text-sm text-muted-foreground">Aucune promotion trouvée.</p>
      )}

      <Accordion type="multiple" className="space-y-3">
        {rows.map((p) => (
          <AccordionItem
            key={p.id}
            value={p.id}
            className="rounded-xl border border-border bg-card px-4"
          >
            <AccordionTrigger className="text-left">
              <span className="flex min-w-0 items-center gap-3">
                {p.image_url && (
                  <img
                    src={p.image_url}
                    alt=""
                    className="h-9 w-9 shrink-0 rounded object-cover"
                  />
                )}
                <span className="truncate font-semibold text-primary">{p.title || "Sans titre"}</span>
              </span>
              <span className="ml-auto mr-3 text-xs text-muted-foreground">
                {p.is_active ? "Visible" : "Masquée"} · #{p.position}
              </span>
            </AccordionTrigger>
            <AccordionContent className="pb-6">
              <PromoForm
                value={p}
                onSave={(v) => save.mutate(v)}
                onDelete={() => {
                  if (confirm("Supprimer cette promotion ?")) remove.mutate(p.id);
                }}
              />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

function PromoForm({
  value,
  onSave,
  onDelete,
  onCancel,
}: {
  value: Partial<CmsPromotion>;
  onSave: (v: Partial<CmsPromotion>) => void;
  onDelete?: () => void;
  onCancel?: () => void;
}) {
  const [form, setForm] = useState<Partial<CmsPromotion>>(value);
  const set = (patch: Partial<CmsPromotion>) => setForm((f) => ({ ...f, ...patch }));

  return (
    <div className="space-y-4 rounded-xl border border-border bg-background p-4">
      <div className="space-y-2">
        <Label>Titre</Label>
        <Input value={form.title ?? ""} onChange={(e) => set({ title: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          rows={2}
          value={form.description ?? ""}
          onChange={(e) => set({ description: e.target.value })}
        />
      </div>
      <ImageField
        label="Visuel promotionnel"
        folder="promotions"
        value={form.image_url ?? ""}
        onChange={(url) => set({ image_url: url })}
      />
      <div className="space-y-2">
        <Label>Lien (optionnel)</Label>
        <Input value={form.url ?? ""} onChange={(e) => set({ url: e.target.value })} />
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
