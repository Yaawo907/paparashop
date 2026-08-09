import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowUpRight, Package } from "lucide-react";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { ExternalCatalogCTA } from "@/components/shared/ExternalCatalogCTA";
import { SITE } from "@/lib/site";
import { productsQuery } from "@/lib/cms.queries";
import { toFeatured } from "@/lib/cms-adapters";

export function Accessories() {
  const { data: products } = useSuspenseQuery(productsQuery);
  const accessories = toFeatured(products, "accessory");

  if (accessories.length === 0) return null;

  return (
    <section className="bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle eyebrow="Accessoires" title="Tout l'équipement complémentaire" />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {accessories.map((item) => (
            <a
              key={item.name}
              href={item.url || SITE.catalogUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-2 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10"
            >
              {item.image ? (
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    width={800}
                    height={600}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground shadow-md">
                    <Package className="h-3 w-3" />
                    Accessoire
                  </span>
                </div>
              ) : null}
              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-display text-lg font-bold text-foreground transition-colors group-hover:text-primary">
                  {item.name}
                </h3>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-accent-foreground/70">
                  {item.category}
                </p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {item.note}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary transition-colors group-hover:text-accent-foreground">
                  Voir sur le catalogue
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-14 text-center">
          <ExternalCatalogCTA label="Voir tous les accessoires" />
        </div>
      </div>
    </section>
  );
}
