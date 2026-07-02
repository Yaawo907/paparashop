import { CATEGORIES, getModelName, getModelUrl } from "@/lib/catalog";
import { ALL_FEATURED } from "@/lib/featured";
import { SITE } from "@/lib/site";

export type SearchResult = {
  id: string;
  kind: "product" | "model" | "brand" | "category";
  title: string;
  subtitle: string;
  image?: string;
  url?: string; // external
  to?: string; // internal route (with hash)
  keywords: string;
};

const INDEX: SearchResult[] = (() => {
  const items: SearchResult[] = [];

  for (const cat of CATEGORIES) {
    items.push({
      id: `cat:${cat.slug}`,
      kind: "category",
      title: cat.title,
      subtitle: cat.tagline,
      to: `/catalogue#${cat.slug}`,
      keywords: `${cat.title} ${cat.tagline} ${cat.description}`.toLowerCase(),
    });

    for (const brand of cat.brands) {
      items.push({
        id: `brand:${cat.slug}:${brand.name}`,
        kind: "brand",
        title: brand.name,
        subtitle: `${cat.title} — marque`,
        image: brand.image,
        url: brand.url,
        to: `/catalogue#${cat.slug}`,
        keywords: `${brand.name} ${cat.title} ${brand.highlights.join(" ")}`.toLowerCase(),
      });

      for (const m of brand.models) {
        const name = getModelName(m);
        const url = getModelUrl(m) || brand.url;
        items.push({
          id: `model:${cat.slug}:${brand.name}:${name}`,
          kind: "model",
          title: `${brand.name} ${name}`,
          subtitle: `${cat.title}`,
          image: brand.image,
          url,
          to: `/catalogue#${cat.slug}`,
          keywords: `${brand.name} ${name} ${cat.title}`.toLowerCase(),
        });
      }
    }
  }

  for (const { item } of ALL_FEATURED) {
    items.push({
      id: `feat:${item.name}`,
      kind: "product",
      title: item.name,
      subtitle: `${item.category} — vedette`,
      image: item.image,
      url: item.url || SITE.catalogUrl,
      keywords: `${item.name} ${item.category} ${item.note}`.toLowerCase(),
    });
  }

  return items;
})();

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function searchAll(query: string, limit = 30): SearchResult[] {
  const q = normalize(query.trim());
  if (!q) return [];
  const tokens = q.split(/\s+/).filter(Boolean);

  const scored: { r: SearchResult; score: number }[] = [];
  for (const r of INDEX) {
    const hay = normalize(`${r.title} ${r.subtitle} ${r.keywords}`);
    let score = 0;
    let ok = true;
    for (const t of tokens) {
      const i = hay.indexOf(t);
      if (i < 0) {
        ok = false;
        break;
      }
      score += i === 0 ? 5 : hay.includes(` ${t}`) ? 3 : 1;
    }
    if (!ok) continue;
    if (normalize(r.title).startsWith(q)) score += 10;
    if (r.kind === "product") score += 2;
    if (r.kind === "model") score += 1;
    scored.push({ r, score });
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.r);
}
