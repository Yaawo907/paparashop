import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { type Category, getModelName } from "@/lib/catalog";
import { slugify } from "@/lib/slug";
import { Reveal } from "@/components/shared/Reveal";

export function CategorySection({
  category,
  index,
  productCount,
  brandCounts = {},
}: {
  category: Category;
  index: number;
  productCount: number;
  brandCounts?: Record<string, number>;
}) {
  const Icon = category.icon;

  return (
    <section
      id={category.slug}
      className={
        index % 2 === 0
          ? "scroll-mt-24 bg-background py-16 sm:py-20"
          : "scroll-mt-24 bg-secondary/40 py-16 sm:py-20"
      }
    >
      <div className="max-w-none">
        <header className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon className="h-7 w-7" strokeWidth={1.75} />
            </span>
            <div>
              <p className="font-display text-xs font-semibold uppercase tracking-[0.25em] text-accent-foreground/70">
                {category.tagline}
              </p>
              <h2 className="font-display text-2xl font-bold text-primary sm:text-3xl">
                {category.title}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {category.description}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-white shadow-sm">
              {productCount} article{productCount > 1 ? "s" : ""}
            </span>
            <span className="rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
              {category.brands.length} marques référencées
            </span>
          </div>
        </header>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {category.brands.map((brand, brandIdx) => {
            const brandCount = brandCounts[`${category.slug}::${brand.name}`] ?? 0;
            return (
            <Reveal key={brand.name} delay={(brandIdx % 9) * 60} className="h-full">
            <Link
              to="/marque/$category/$brand"
              params={{ category: category.slug, brand: slugify(brand.name) }}
              className="group flex h-full flex-col overflow-hidden rounded-xl border-2 border-primary/15 bg-white text-left transition-all hover:-translate-y-1 hover:border-accent hover:shadow-lg"
            >
              {brand.image ? (
                <div className="aspect-[4/3] w-full overflow-hidden bg-secondary/50">
                  <img
                    src={brand.image}
                    alt={`${brand.name} — ${category.title}`}
                    loading="lazy"
                    width={1024}
                    height={768}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              ) : null}
              <div className="flex flex-1 flex-col p-6">
                <p className="font-display text-lg font-bold text-primary">{brand.name}</p>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                  {brand.models.slice(0, 3).map(getModelName).join(" • ")}
                  {brand.models.length > 3 && "…"}
                </p>
                <div className="mt-4 flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-primary transition-colors group-hover:text-accent-foreground">
                    <span className="rounded-full bg-primary px-2 py-0.5 text-[11px] font-semibold text-white shadow-sm">
                      {brandCount} article{brandCount > 1 ? "s" : ""}
                    </span>
                    Voir les articles
                    <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </div>
            </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
