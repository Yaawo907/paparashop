import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowUpRight, MessageCircle, PackageCheck, PackageX } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { AddToCartButton } from "@/components/shop/AddToCartButton";
import { formatXOF } from "@/lib/cart";
import { categoriesQuery, productsQuery } from "@/lib/cms.queries";
import { slugify } from "@/lib/slug";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/marque/$category/$brand")({
  component: BrandPage,
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(categoriesQuery),
      context.queryClient.ensureQueryData(productsQuery),
    ]);
  },
  head: () => ({
    meta: [
      { title: "Articles de la marque — PaparaShop" },
      {
        name: "description",
        content:
          "Découvrez tous les articles disponibles pour cette marque chez PaparaShop : modèles, prix, disponibilité et ajout au panier.",
      },
      { property: "og:title", content: "Articles de la marque — PaparaShop" },
      {
        property: "og:description",
        content: "Modèles référencés, prix et commande en ligne du matériel audiovisuel PaparaShop.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  errorComponent: () => (
    <SiteLayout>
      <div className="mx-auto max-w-3xl px-4 py-20 text-center text-sm text-muted-foreground">
        Impossible de charger cette marque.
      </div>
    </SiteLayout>
  ),
});

function BrandPage() {
  const { category: categorySlug, brand: brandSlug } = Route.useParams();
  const { data: categories } = useSuspenseQuery(categoriesQuery);
  const { data: products } = useSuspenseQuery(productsQuery);

  const category = categories.find((c) => c.slug === categorySlug);
  const brand = category?.brands.find((b) => slugify(b.name) === brandSlug);

  if (!category || !brand) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-3xl px-4 py-20 text-center">
          <h1 className="font-display text-xl font-bold text-primary">Marque introuvable</h1>
          <Link
            to="/catalogue"
            className="mt-5 inline-flex rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            Voir le catalogue
          </Link>
        </div>
      </SiteLayout>
    );
  }

  const needle = brand.name.toLowerCase();
  const brandProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(needle) ||
      (p.subtitle ?? "").toLowerCase().includes(needle),
  );

  const models = brand.models ?? [];
  const orphanModels = models.filter(
    (m) => !brandProducts.some((p) => p.name.toLowerCase().includes(m.name.toLowerCase())),
  );

  return (
    <SiteLayout>
      <section className="bg-primary py-14 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link
            to="/catalogue"
            hash={category.slug}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white/70 hover:text-accent"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour au catalogue
          </Link>
          <p className="mt-6 font-display text-xs font-semibold uppercase tracking-[0.3em] text-accent">
            {category.title}
          </p>
          <h1 className="font-display text-3xl font-bold sm:text-4xl">{brand.name}</h1>
          {brand.highlights?.length ? (
            <ul className="mt-4 flex flex-wrap gap-2">
              {brand.highlights.map((h) => (
                <li
                  key={h}
                  className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/85"
                >
                  {h}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </section>

      <section className="bg-background py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-xl font-bold text-primary">
            Articles disponibles ({brandProducts.length})
          </h2>

          {brandProducts.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">
              Aucun article en ligne pour cette marque pour le moment — consultez les modèles
              référencés ci-dessous ou contactez-nous sur WhatsApp.
            </p>
          ) : (
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {brandProducts.map((p) => (
                <article
                  key={p.id}
                  className="flex flex-col overflow-hidden rounded-xl border-2 border-primary/15 bg-card transition-all hover:-translate-y-1 hover:border-accent hover:shadow-lg"
                >
                  <Link
                    to="/produit/$id"
                    params={{ id: p.id }}
                    className="block aspect-[4/3] w-full overflow-hidden bg-secondary/50"
                  >
                    {p.image_url ? (
                      <img
                        src={p.image_url}
                        alt={`${p.name} — ${brand.name}`}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                        Image indisponible
                      </div>
                    )}
                  </Link>
                  <div className="flex flex-1 flex-col p-5">
                    <Link
                      to="/produit/$id"
                      params={{ id: p.id }}
                      className="font-display text-base font-bold text-primary hover:text-accent-foreground"
                    >
                      {p.name}
                    </Link>
                    {p.subtitle ? (
                      <p className="mt-1 text-xs text-muted-foreground">{p.subtitle}</p>
                    ) : null}

                    <p className="mt-3 font-display text-lg font-bold text-primary">
                      {p.price ? formatXOF(Number(p.price)) : "Prix sur demande"}
                    </p>
                    <p className="mt-1 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider">
                      {(p.stock ?? 0) > 0 ? (
                        <>
                          <PackageCheck className="h-3.5 w-3.5 text-primary" />
                          <span className="text-primary">En stock</span>
                        </>
                      ) : (
                        <>
                          <PackageX className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-muted-foreground">Sur commande</span>
                        </>
                      )}
                    </p>

                    <div className="mt-4 flex flex-col gap-2">
                      <AddToCartButton
                        id={p.id}
                        name={p.name}
                        price={p.price === null ? null : Number(p.price)}
                        image={p.image_url ?? ""}
                        className="w-full"
                      />
                      <Link
                        to="/produit/$id"
                        params={{ id: p.id }}
                        className="inline-flex items-center justify-center gap-1 rounded-md border border-border px-4 py-2 text-xs font-semibold uppercase tracking-wider text-primary hover:bg-secondary/60"
                      >
                        Voir le détail
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {orphanModels.length ? (
            <div className="mt-12">
              <h2 className="font-display text-xl font-bold text-primary">
                Autres modèles référencés
              </h2>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {orphanModels.map((m) => (
                  <li
                    key={m.name}
                    className="flex items-center justify-between gap-3 rounded-md bg-secondary/60 px-3 py-2 text-sm text-foreground"
                  >
                    <span>{m.name}</span>
                    {m.url ? (
                      <a
                        href={m.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                      >
                        Voir
                        <ArrowUpRight className="h-3 w-3" />
                      </a>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="mt-12 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row">
            <a
              href={brand.url || SITE.catalogUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-accent px-5 py-2.5 font-display text-sm font-semibold text-primary shadow-md transition-all hover:-translate-y-0.5"
            >
              Commander sur la plateforme
              <ArrowUpRight className="h-4 w-4" />
            </a>
            <a
              href={`https://wa.me/2290162447474?text=${encodeURIComponent(
                `Bonjour PaparaShop, je souhaite un devis pour ${brand.name} (${category.title}).`,
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-md border-2 border-primary px-5 py-2.5 font-display text-sm font-semibold text-primary transition-all hover:bg-primary hover:text-white"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
