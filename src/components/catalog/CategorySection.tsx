import { useState } from "react";
import { ChevronRight } from "lucide-react";
import type { Brand, Category } from "@/lib/catalog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

export function CategorySection({
  category,
  index,
}: {
  category: Category;
  index: number;
}) {
  const Icon = category.icon;
  const [openBrand, setOpenBrand] = useState<Brand | null>(null);

  return (
    <section
      id={category.slug}
      className={
        index % 2 === 0
          ? "scroll-mt-24 bg-background py-16 sm:py-20"
          : "scroll-mt-24 bg-secondary/40 py-16 sm:py-20"
      }
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
          <span className="rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
            {category.brands.length} marques référencées
          </span>
        </header>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {category.brands.map((brand) => (
            <Dialog
              key={brand.name}
              open={openBrand?.name === brand.name}
              onOpenChange={(v) => setOpenBrand(v ? brand : null)}
            >
              <DialogTrigger asChild>
                <button
                  type="button"
                  className="group flex flex-col rounded-xl border-2 border-primary/15 bg-white p-6 text-left transition-all hover:-translate-y-1 hover:border-accent hover:shadow-lg"
                >
                  <p className="font-display text-lg font-bold text-primary">
                    {brand.name}
                  </p>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                    {brand.models.slice(0, 3).join(" • ")}
                    {brand.models.length > 3 && "…"}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-primary transition-colors group-hover:text-accent-foreground">
                    Voir les modèles
                    <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle className="font-display text-2xl text-primary">
                    {brand.name}
                  </DialogTitle>
                  <DialogDescription>
                    Sélection {category.title.toLowerCase()} disponible chez PaparaShop
                  </DialogDescription>
                </DialogHeader>
                <div className="mt-2 space-y-5">
                  <div>
                    <p className="mb-2 font-display text-xs font-semibold uppercase tracking-widest text-primary">
                      Modèles référencés
                    </p>
                    <ul className="grid gap-1.5 sm:grid-cols-2">
                      {brand.models.map((m) => (
                        <li
                          key={m}
                          className="rounded-md bg-secondary/60 px-3 py-1.5 text-sm text-foreground"
                        >
                          {m}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="mb-2 font-display text-xs font-semibold uppercase tracking-widest text-primary">
                      Points clés
                    </p>
                    <ul className="space-y-1.5">
                      {brand.highlights.map((h) => (
                        <li
                          key={h}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                          {h}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </div>
    </section>
  );
}
