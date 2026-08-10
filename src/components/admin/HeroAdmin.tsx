import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import type { CmsHeroSlide } from "@/lib/cms-types";
import { useDeleteRow, useRows, useSaveRow } from "@/components/admin/useCrud";
import { ImageField } from "@/components/admin/ImageField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export function HeroAdmin() {
  const { data: slides = [], isLoading } = useRows<CmsHeroSlide>("hero_slides");
  const save = useSaveRow("hero_slides");
  const remove = useDeleteRow("hero_slides");
  const [draft, setDraft] = useState<Partial<CmsHeroSlide> | null>(null);

  if (isLoading) return <p className="text-sm text-muted-foreground">Chargement…</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-xl font-bold text-primary">Carrousel accueil</h2>
        <Button
          size="sm"
          onClick={() =>
            setDraft({
              title: "",
              subtitle: "",
              cta_label: "Découvrir le catalogue",
              cta_url: "/catalogue",
              position: 99,
              is_active: true,
            })
          }
        >
          <Plus className="mr-1 h-4 w-4" /> Nouvelle slide
        </Button>
      </div>

      {draft && (
        <SlideForm
          value={draft}
          onCancel={() => setDraft(null)}
          onSave={(v) => save.mutate(v, { onSuccess: () => setDraft(null) })}
        />
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {slides.map((s) => (
          <SlideForm
            key={s.id}
            value={s}
            onSave={(v) => save.mutate(v)}
            onDelete={() => {
              if (confirm(`Supprimer « ${s.title} » ?`)) remove.mutate(s.id);
            }}
          />
        ))}
      </div>
    </div>
  );
}

function SlideForm({
  value,
  onSave,
  onDelete,
  onCancel,
}: {
  value: Partial<CmsHeroSlide>;
  onSave: (v: Partial<CmsHeroSlide>) => void;
  onDelete?: () => void;
  onCancel?: () => void;
}) {
  const [form, setForm] = useState<Partial<CmsHeroSlide>>(value);
  const set = (patch: Partial<CmsHeroSlide>) => setForm((f) => ({ ...f, ...patch }));

  return (
    <div className="space-y-4 rounded-xl border border-border bg-card p-4">
      <div className="space-y-2">
        <Label>Titre</Label>
        <Input value={form.title ?? ""} onChange={(e) => set({ title: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label>Sous-titre</Label>
        <Input value={form.subtitle ?? ""} onChange={(e) => set({ subtitle: e.target.value })} />
      </div>
      <ImageField
        label="Image de fond"
        folder="hero"
        value={form.image_url ?? ""}
        onChange={(url) => set({ image_url: url })}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Texte du bouton</Label>
          <Input
            value={form.cta_label ?? ""}
            onChange={(e) => set({ cta_label: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Lien du bouton (interne « /catalogue » ou https://…)</Label>
          <Input value={form.cta_url ?? ""} onChange={(e) => set({ cta_url: e.target.value })} />
        </div>
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
