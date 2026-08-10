import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import type { CmsProduct } from "@/lib/cms-types";
import { useDeleteRow, useRows, useSaveRow } from "@/components/admin/useCrud";
import { ImageField } from "@/components/admin/ImageField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const GROUPS = [
  { key: "new", label: "Nouveautés" },
  { key: "bestseller", label: "Best-sellers" },
  { key: "offer", label: "Offres" },
  { key: "accessory", label: "Accessoires" },
];

export function ProductsAdmin() {
  const { data: products = [], isLoading } = useRows<CmsProduct>("products");
  const save = useSaveRow("products");
  const remove = useDeleteRow("products");
  const [draftGroup, setDraftGroup] = useState<string | null>(null);

  if (isLoading) return <p className="text-sm text-muted-foreground">Chargement…</p>;

  return (
    <div className="space-y-6">
      <h2 className="font-display text-xl font-bold text-primary">Produits</h2>
      <Tabs defaultValue="new">
        <TabsList>
          {GROUPS.map((g) => (
            <TabsTrigger key={g.key} value={g.key}>
              {g.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {GROUPS.map((g) => (
          <TabsContent key={g.key} value={g.key} className="space-y-4 pt-4">
            <Button size="sm" onClick={() => setDraftGroup(g.key)}>
              <Plus className="mr-1 h-4 w-4" /> Ajouter dans « {g.label} »
            </Button>
            {draftGroup === g.key && (
              <ProductForm
                value={{
                  name: "",
                  subtitle: "",
                  note: "",
                  group_key: g.key,
                  position: 99,
                  is_active: true,
                }}
                onCancel={() => setDraftGroup(null)}
                onSave={(v) => save.mutate(v, { onSuccess: () => setDraftGroup(null) })}
              />
            )}
            {products
              .filter((p) => p.group_key === g.key)
              .map((p) => (
                <ProductForm
                  key={p.id}
                  value={p}
                  onSave={(v) => save.mutate(v)}
                  onDelete={() => {
                    if (confirm(`Supprimer « ${p.name} » ?`)) remove.mutate(p.id);
                  }}
                />
              ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

const NEW_CATEGORY = "__new__";

function ProductForm({
  value,
  onSave,
  onDelete,
  onCancel,
}: {
  value: Partial<CmsProduct>;
  onSave: (v: Partial<CmsProduct>) => void;
  onDelete?: () => void;
  onCancel?: () => void;
}) {
  const [form, setForm] = useState<Partial<CmsProduct>>(value);
  const set = (patch: Partial<CmsProduct>) => setForm((f) => ({ ...f, ...patch }));

  const { data: categories = [] } = useRows<{ id: string; title: string }>("categories");
  const { data: allProducts = [] } = useRows<CmsProduct>("products");
  const options = Array.from(
    new Set([
      ...categories.map((c) => c.title),
      ...allProducts.map((p) => p.subtitle).filter((s): s is string => !!s),
    ]),
  ).sort((a, b) => a.localeCompare(b));

  const current = form.subtitle ?? "";
  const [custom, setCustom] = useState(!!current && !options.includes(current));

  const pickCategory = (title: string) => {
    const match = categories.find((c) => c.title === title);
    set({ subtitle: title, category_id: match ? match.id : null });
  };

  return (
    <div className="space-y-4 rounded-xl border border-border bg-card p-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Nom</Label>
          <Input value={form.name ?? ""} onChange={(e) => set({ name: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Catégorie</Label>
          <Select
            value={custom ? NEW_CATEGORY : current}
            onValueChange={(v) => {
              if (v === NEW_CATEGORY) {
                setCustom(true);
                set({ subtitle: "", category_id: null });
              } else {
                setCustom(false);
                pickCategory(v);
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choisir une catégorie" />
            </SelectTrigger>
            <SelectContent>
              {options.map((o) => (
                <SelectItem key={o} value={o}>
                  {o}
                </SelectItem>
              ))}
              <SelectItem value={NEW_CATEGORY}>＋ Nouvelle catégorie…</SelectItem>
            </SelectContent>
          </Select>
          {custom && (
            <Input
              autoFocus
              placeholder="Nom de la nouvelle catégorie"
              value={current}
              onChange={(e) => set({ subtitle: e.target.value, category_id: null })}
            />
          )}
        </div>

      </div>
      <div className="space-y-2">
        <Label>Description courte</Label>
        <Textarea rows={2} value={form.note ?? ""} onChange={(e) => set({ note: e.target.value })} />
      </div>
      <ImageField
        folder="products"
        value={form.image_url ?? ""}
        onChange={(url) => set({ image_url: url })}
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label>Prix (FCFA) — 0 = non vendable en ligne</Label>
          <Input
            type="number"
            min={0}
            value={form.price ?? 0}
            onChange={(e) => set({ price: Number(e.target.value) })}
          />
        </div>
        <div className="space-y-2">
          <Label>Stock</Label>
          <Input
            type="number"
            min={0}
            value={form.stock ?? 0}
            onChange={(e) => set({ stock: Number(e.target.value) })}
          />
        </div>
        <div className="space-y-2">
          <Label>Référence (SKU)</Label>
          <Input value={form.sku ?? ""} onChange={(e) => set({ sku: e.target.value })} />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Lien produit externe</Label>
        <Input
          value={form.url ?? ""}
          onChange={(e) => set({ url: e.target.value })}
          placeholder="https://…"
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
