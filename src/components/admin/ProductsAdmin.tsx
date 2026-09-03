import { useCallback, useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import type { CmsProduct } from "@/lib/cms-types";
import {
  useBulkDelete,
  useBulkUpdate,
  useDeleteRow,
  useRows,
  useSaveRow,
} from "@/components/admin/useCrud";
import { ImageField } from "@/components/admin/ImageField";
import { GalleryField } from "@/components/admin/GalleryField";
import { AdminDataTable, type AdminColumn } from "@/components/admin/AdminDataTable";
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
  const bulkUpdate = useBulkUpdate("products");
  const bulkDelete = useBulkDelete("products");
  const [group, setGroup] = useState("all");
  const [draftGroup, setDraftGroup] = useState<string | null>(null);

  const rows = useMemo(
    () => (group === "all" ? products : products.filter((p) => p.group_key === group)),
    [products, group],
  );

  const columns: AdminColumn<CmsProduct>[] = useMemo(
    () => [
      {
        key: "name",
        header: "Produit",
        value: (p) => p.name,
        render: (p) => (
          <div className="flex items-center gap-3">
            {p.image_url && (
              <img
                src={p.image_url}
                alt=""
                className="h-9 w-9 rounded-md object-cover"
                loading="lazy"
              />
            )}
            <span className="font-medium text-primary">{p.name}</span>
          </div>
        ),
      },
      {
        key: "subtitle",
        header: "Catégorie",
        value: (p) => p.subtitle || "",
        className: "hidden md:table-cell text-muted-foreground",
      },
      {
        key: "group",
        header: "Groupe",
        value: (p) => groupLabel(p.group_key),
        className: "hidden lg:table-cell text-muted-foreground",
      },
      {
        key: "price",
        header: "Prix",
        value: (p) => Number(p.price ?? 0),
        render: (p) => (p.price ? `${Number(p.price).toLocaleString("fr-FR")} F` : "—"),
        className: "hidden sm:table-cell text-right",
      },
      {
        key: "stock",
        header: "Stock",
        value: (p) => Number(p.stock ?? 0),
        className: "hidden sm:table-cell text-right",
      },
      {
        key: "is_active",
        header: "Visible",
        value: (p) => (p.is_active ? "Oui" : "Non"),
        render: (p) => (p.is_active ? "✓" : "—"),
        className: "hidden md:table-cell text-center",
      },
    ],
    [],
  );

  const searchFields = useCallback(
    (p: CmsProduct) => [p.name, p.subtitle, p.note, p.sku, p.price, groupLabel(p.group_key)],
    [],
  );

  if (isLoading) return <p className="text-sm text-muted-foreground">Chargement…</p>;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-xl font-bold text-primary">Produits</h2>
        <Button size="sm" onClick={() => setDraftGroup("new")}>
          <Plus className="mr-1 h-4 w-4" /> Ajouter un produit
        </Button>
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

      <AdminDataTable
        rows={rows}
        columns={columns}
        getId={(p) => p.id}
        searchFields={searchFields}
        searchPlaceholder="Rechercher par nom, catégorie, description, référence…"
        noun="produit"
        csvName="produits"
        onBulkVisibility={(ids, visible) => bulkUpdate.mutate({ ids, patch: { is_active: visible } })}
        onBulkDelete={(ids) => bulkDelete.mutate(ids)}
        toolbar={
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
        }
        emptyLabel="Aucun produit ne correspond à la recherche."
        renderExpanded={(p) => (
          <ProductForm
            value={p}
            onSave={(v) => save.mutate(v)}
            onDelete={() => {
              if (confirm(`Supprimer « ${p.name} » ?`)) remove.mutate(p.id);
            }}
          />
        )}
      />
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
        label="Image principale"
        folder="products"
        value={form.image_url ?? ""}
        onChange={(url) => set({ image_url: url })}
      />
      <GalleryField
        value={form.gallery_urls ?? []}
        onChange={(urls) => set({ gallery_urls: urls })}
      />
      <div className="space-y-2">
        <Label>Vidéo de présentation (YouTube, Vimeo ou lien MP4)</Label>
        <Input
          value={form.video_url ?? ""}
          onChange={(e) => set({ video_url: e.target.value })}
          placeholder="https://www.youtube.com/watch?v=…"
        />
      </div>
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
          <Button size="sm" onClick={() => onSave(cleanProduct(form))}>
            Enregistrer
          </Button>
        </div>
      </div>
    </div>
  );
}

/** Retire les entrées vides de la galerie avant enregistrement. */
function cleanProduct(form: Partial<CmsProduct>): Partial<CmsProduct> {
  return {
    ...form,
    gallery_urls: (form.gallery_urls ?? []).filter((u) => !!u && u.trim() !== ""),
    video_url: form.video_url?.trim() ? form.video_url.trim() : null,
  };
}
