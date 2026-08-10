import type { Category } from "@/lib/catalog";
import type { FeaturedItem } from "@/lib/featured";
import type { CmsCategory, CmsProduct } from "@/lib/cms-types";
import { getIcon } from "@/lib/icons";
import { SITE } from "@/lib/site";

/** Convertit les catégories de la base au format attendu par les composants du site. */
export function toCategories(cms: CmsCategory[]): Category[] {
  return cms.map((c) => ({
    slug: c.slug,
    icon: getIcon(c.icon),
    title: c.title,
    tagline: c.tagline,
    description: c.description,
    brands: c.brands.map((b) => ({
      name: b.name,
      image: b.image_url ?? undefined,
      url: b.url ?? undefined,
      highlights: b.highlights ?? [],
      models: (b.models ?? []).map((m) => (m.url ? { name: m.name, url: m.url } : m.name)),
    })),
  }));
}

/** Convertit les produits d'un groupe (nouveautés, best-sellers, offres, accessoires). */
export function toFeatured(products: CmsProduct[], group: string): FeaturedItem[] {
  return products
    .filter((p) => p.group_key === group)
    .map((p) => ({
      id: p.id,
      price: p.price === null || p.price === undefined ? null : Number(p.price),
      stock: p.stock ?? null,
      name: p.name,
      category: p.subtitle,
      note: p.note,
      image: p.image_url ?? "",
      url: p.url ?? SITE.catalogUrl,
    }));
}
