import { useMemo, useState } from "react";
import { ChevronDown, ChevronRight, Plus, Search, Trash2 } from "lucide-react";
import type { CmsProduct } from "@/lib/cms-types";
import { useDeleteRow, useRows, useSaveRow } from "@/components/admin/useCrud";
import { ImageField } from "@/components/admin/ImageField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const GROUPS = [
  { key: "new", label: "Nouveautés" },
  { key: "bestseller", label: "Best-sellers" },
  { key: "offer", label: "Offres" },
  { key: "accessory", label: "Accessoires" },
];

function groupLabel(key: string) {
  return GROUPS.find((g) => g.key === key)?.label ?? key;
}

export function ProductsAdmin() {
  const { data: products = [], isLoading } = useRows<CmsProduct>("products");
  const save = useSaveRow("products");
  const remove = useDeleteRow("products");
  const [search, setSearch] = useState("");
  const [group, setGroup] = useState("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const [draftGroup, setDraftGroup] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      if (group !== "all" && p.group_key !== group) return false;
      if (!q) return true;
      return [p.name, p.subtitle, p.note, p.sku]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q));
    });
  }, [products, search, group]);

  if (isLoading) return <p className="text-sm text-muted-foreground">Chargement…</p>;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-xl font-bold text-primary">Produits</h2>
        <Button size="sm" onClick={() => setDraftGroup("new")}>
          <Plus className="mr-1 h-4 w-4" /> Ajouter un produit
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Rechercher par nom, catégorie, description, référence…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={group} onValueChange={setGroup}>
          <SelectTrigger className="w-full sm:w-52">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les groupes</SelectItem>
            {GROUPS.map((g) => (
              <SelectItem key={g.key} value={g.key}>
                {g.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {draftGroup && (
        <ProductForm
          value={{
            name: "",
            subtitle: "",
            note: "",
            group_key: draftGroup,
            position: 99,
            is_active: true,
          }}
          onCancel={() => setDraftGroup(null)}
          onSave={(v) => save.mutate(v, { onSuccess: () => setDraftGroup(null) })}
        />
      )}

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/50 text-left text-xs text-muted-foreground">
              <th className="w-8 px-2 py-2" />
              <th className="px-3 py-2">Produit</th>
              <th className="hidden px-3 py-2 md:table-cell">Catégorie</th>
              <th className="hidden px-3 py-2 lg:table-cell">Groupe</th>
              <th className="hidden px-3 py-2 text-right sm:table-cell">Prix</th>
              <th className="hidden px-3 py-2 text-right sm:table-cell">Stock</th>
              <th className="hidden px-3 py-2 text-center md:table-cell">Visible</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-3 py-8 text-center text-muted-foreground">
                  Aucun produit ne correspond à la recherche.
                </td>
              </tr>
            )}
            {filtered.map((p) => (
              <ProductRow
                key={p.id}
                product={p}
                open={openId === p.id}
                onToggle={() => setOpenId(openId === p.id ? null : p.id)}
                onSave={(v) => save.mutate(v, { onSuccess: () => setOpenId(null) })}
                onDelete={() => {
                  if (confirm(`Supprimer « ${p.name} » ?`)) remove.mutate(p.id);
                }}
              />
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted-foreground">
        {filtered.length} produit{filtered.length > 1 ? "s" : ""} affiché
        {filtered.length > 1 ? "s" : ""} sur {products.length}.
      </p>
    </div>
  );
}

function ProductRow({
  product,
  open,
  onToggle,
  onSave,
  onDelete,
}: {
  product: CmsProduct;
  open: boolean;
  onToggle: () => void;
  onSave: (v: Partial<CmsProduct>) => void;
  onDelete: () => void;
}) {
  return (
    <>
      <tr
        onClick={onToggle}
        className="cursor-pointer border-b border-border transition-colors hover:bg-secondary/40"
      >
        <td className="px-2 py-2 text-muted-foreground">
          {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </td>
        <td className="px-3 py-2">
          <div className="flex items-center gap-3">
            {product.image_url && (
              <img
                src={product.image_url}
                alt=""
                className="h-9 w-9 rounded-md object-cover"
                loading="lazy"
              />
            )}
            <span className="font-medium text-primary">{product.name}</span>
          </div>
        </td>
        <td className="hidden px-3 py-2 text-muted-foreground md:table-cell">
          {product.subtitle || "—"}
        </td>
        <td className="hidden px-3 py-2 text-muted-foreground lg:table-cell">
          {groupLabel(product.group_key)}
        </td>
        <td className="hidden px-3 py-2 text-right sm:table-cell">
          {product.price ? `${product.price.toLocaleString("fr-FR")} F` : "—"}
        </td>
        <td className="hidden px-3 py-2 text-right sm:table-cell">{product.stock ?? 0}</td>
        <td className="hidden px-3 py-2 text-center md:table-cell">
          {product.is_active ? "✓" : "—"}
        </td>
      </tr>
      {open && (
        <tr className="border-b border-border bg-secondary/20">
          <td colSpan={7} className="px-3 py-4">
            <ProductForm value={product} onSave={onSave} onDelete={onDelete} />
          </td>
        </tr>
      )}
    </>
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
        <Label>Groupe d'affichage</Label>
        <Select value={form.group_key ?? "new"} onValueChange={(v) => set({ group_key: v })}>
          <SelectTrigger className="w-full sm:w-64">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {GROUPS.map((g) => (
              <SelectItem key={g.key} value={g.key}>
                {g.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
