import { useState } from "react";
import { Trash2, Plus } from "lucide-react";
import type { CmsBrand, CmsCategory } from "@/lib/cms-types";
import { ICON_NAMES } from "@/lib/icons";
import { useDeleteRow, useRows, useSaveRow } from "@/components/admin/useCrud";
import { ImageField } from "@/components/admin/ImageField";
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

type CategoryRow = Omit<CmsCategory, "brands">;
type BrandRow = CmsBrand;

const EMPTY_CATEGORY: Partial<CategoryRow> = {
  slug: "",
  title: "",
  tagline: "",
  description: "",
  icon: "Package",
  position: 99,
  is_active: true,
};

export function CategoriesAdmin() {
  const { data: categories = [], isLoading } = useRows<CategoryRow>("categories");
  const { data: brands = [] } = useRows<BrandRow>("brands");
  const saveCategory = useSaveRow("categories");
  const deleteCategory = useDeleteRow("categories");
  const [draft, setDraft] = useState<Partial<CategoryRow> | null>(null);

  if (isLoading) return <p className="text-sm text-muted-foreground">Chargement…</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-primary">Catégories</h2>
        <Button size="sm" onClick={() => setDraft({ ...EMPTY_CATEGORY })}>
          <Plus className="mr-1 h-4 w-4" /> Nouvelle catégorie
        </Button>
      </div>

      {draft && (
        <CategoryForm
          value={draft}
          onCancel={() => setDraft(null)}
          onSave={(v) => {
            saveCategory.mutate(v, { onSuccess: () => setDraft(null) });
          }}
        />
      )}

      <Accordion type="multiple" className="space-y-3">
        {categories.map((c) => (
          <AccordionItem
            key={c.id}
            value={c.id}
            className="rounded-xl border border-border bg-card px-4"
          >
            <AccordionTrigger className="text-left">
              <span className="font-semibold text-primary">{c.title}</span>
              <span className="ml-auto mr-3 text-xs text-muted-foreground">
                {brands.filter((b) => b.category_id === c.id).length} marques
              </span>
            </AccordionTrigger>
            <AccordionContent className="space-y-6 pb-6">
              <CategoryForm
                value={c}
                onSave={(v) => saveCategory.mutate(v)}
                onDelete={() => {
                  if (confirm(`Supprimer la catégorie « ${c.title} » et ses marques ?`)) {
                    deleteCategory.mutate(c.id);
                  }
                }}
              />
              <BrandsAdmin categoryId={c.id} brands={brands.filter((b) => b.category_id === c.id)} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

function CategoryForm({
  value,
  onSave,
  onDelete,
  onCancel,
}: {
  value: Partial<CategoryRow>;
  onSave: (v: Partial<CategoryRow>) => void;
  onDelete?: () => void;
  onCancel?: () => void;
}) {
  const [form, setForm] = useState<Partial<CategoryRow>>(value);
  const set = (patch: Partial<CategoryRow>) => setForm((f) => ({ ...f, ...patch }));

  return (
    <div className="space-y-4 rounded-xl border border-border bg-background p-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Titre</Label>
          <Input value={form.title ?? ""} onChange={(e) => set({ title: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Slug (URL)</Label>
          <Input value={form.slug ?? ""} onChange={(e) => set({ slug: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Accroche</Label>
          <Input value={form.tagline ?? ""} onChange={(e) => set({ tagline: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Icône</Label>
          <select
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            value={form.icon ?? "Package"}
            onChange={(e) => set({ icon: e.target.value })}
          >
            {ICON_NAMES.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
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
        label="Image de couverture (optionnelle)"
        folder="categories"
        value={form.image_url ?? ""}
        onChange={(url) => set({ image_url: url })}
      />
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
          <Switch
            checked={form.is_active ?? true}
            onCheckedChange={(v) => set({ is_active: v })}
          />
          <Label>Visible sur le site</Label>
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

function BrandsAdmin({ categoryId, brands }: { categoryId: string; brands: BrandRow[] }) {
  const save = useSaveRow("brands");
  const remove = useDeleteRow("brands");
  const [draft, setDraft] = useState<Partial<BrandRow> | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-sm font-bold uppercase tracking-wider text-primary">
          Marques & modèles
        </h3>
        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            setDraft({
              category_id: categoryId,
              name: "",
              highlights: [],
              models: [],
              position: 99,
              is_active: true,
            })
          }
        >
          <Plus className="mr-1 h-4 w-4" /> Ajouter une marque
        </Button>
      </div>

      {draft && (
        <BrandForm
          value={draft}
          onCancel={() => setDraft(null)}
          onSave={(v) => save.mutate(v, { onSuccess: () => setDraft(null) })}
        />
      )}

      {brands.map((b) => (
        <BrandForm
          key={b.id}
          value={b}
          onSave={(v) => save.mutate(v)}
          onDelete={() => {
            if (confirm(`Supprimer la marque « ${b.name} » ?`)) remove.mutate(b.id);
          }}
        />
      ))}
    </div>
  );
}

function BrandForm({
  value,
  onSave,
  onDelete,
  onCancel,
}: {
  value: Partial<BrandRow>;
  onSave: (v: Partial<BrandRow>) => void;
  onDelete?: () => void;
  onCancel?: () => void;
}) {
  const [form, setForm] = useState<Partial<BrandRow>>(value);
  const set = (patch: Partial<BrandRow>) => setForm((f) => ({ ...f, ...patch }));

  const modelsText = (form.models ?? [])
    .map((m) => (m.url ? `${m.name} | ${m.url}` : m.name))
    .join("\n");

  return (
    <div className="space-y-4 rounded-xl border border-border bg-background p-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Nom de la marque</Label>
          <Input value={form.name ?? ""} onChange={(e) => set({ name: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Lien catalogue externe</Label>
          <Input
            value={form.url ?? ""}
            onChange={(e) => set({ url: e.target.value })}
            placeholder="https://…"
          />
        </div>
      </div>
      <ImageField
        folder="brands"
        value={form.image_url ?? ""}
        onChange={(url) => set({ image_url: url })}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Points forts (une ligne par point)</Label>
          <Textarea
            rows={4}
            value={(form.highlights ?? []).join("\n")}
            onChange={(e) =>
              set({ highlights: e.target.value.split("\n").filter((l) => l.trim()) })
            }
          />
        </div>
        <div className="space-y-2">
          <Label>Modèles — « Nom | lien » (une ligne par modèle)</Label>
          <Textarea
            rows={4}
            defaultValue={modelsText}
            onChange={(e) =>
              set({
                models: e.target.value
                  .split("\n")
                  .map((l) => l.trim())
                  .filter(Boolean)
                  .map((l) => {
                    const [name, url] = l.split("|").map((p) => p.trim());
                    return url ? { name: name!, url } : { name: name! };
                  }),
              })
            }
          />
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
