import { Link } from "@tanstack/react-router";
import { CATEGORIES } from "@/lib/catalog";

export function ShopByCategory() {
  return (
    <section className="bg-background py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <p className="mb-3 font-display text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            Acheter par catégorie
          </p>
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            Trouvez votre matériel en un clic
          </h2>
          <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-accent" />
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {CATEGORIES.map((c) => {
            const Icon = c.icon;
            const cover = c.brands.find((b) => b.image)?.image;
            return (
              <Link
                key={c.slug}
                to="/catalogue"
                hash={c.slug}
                className="group overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:border-accent hover:shadow-lg"
              >
                <div className="aspect-square w-full overflow-hidden bg-secondary/50">
                  {cover ? (
                    <img
                      src={cover}
                      alt={c.title}
                      loading="lazy"
                      width={600}
                      height={600}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center text-primary">
                      <Icon className="h-10 w-10" strokeWidth={1.5} />
                    </span>
                  )}
                </div>
                <div className="p-4 text-center">
                  <p className="font-display text-sm font-bold text-primary">{c.title}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    {c.brands.length} marques
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
