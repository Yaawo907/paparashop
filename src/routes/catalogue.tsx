import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { ExternalCatalogCTA } from "@/components/shared/ExternalCatalogCTA";
import { CategorySection } from "@/components/catalog/CategorySection";
import { FeaturedProductsTabs } from "@/components/catalog/FeaturedProductsTabs";
import { CatalogueSidebar } from "@/components/catalog/CatalogueSidebar";
import { Commitments } from "@/components/home/Commitments";
import { GlobalSearch } from "@/components/layout/GlobalSearch";

import { categoriesQuery, productsQuery } from "@/lib/cms.queries";
import { toCategories } from "@/lib/cms-adapters";

export const Route = createFileRoute("/catalogue")({
  component: CataloguePage,
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(categoriesQuery),
      context.queryClient.ensureQueryData(productsQuery),
    ]);
  },
  errorComponent: ({ error }) => (
    <div role="alert" className="p-10 text-center text-sm text-muted-foreground">
      Impossible de charger le catalogue : {error.message}
    </div>
  ),
  notFoundComponent: () => <div className="p-10 text-center">Catalogue introuvable.</div>,
  head: () => ({
    meta: [
      { title: "Catalogue — PaparaShop | 8 catégories, 40+ marques" },
      {
        name: "description",
        content:
          "Catalogue PaparaShop : appareils photo & vidéo, audio, éclairage studio, tournage, moniteurs, casques, câbles/batteries, streaming — Canon, Sony, Nikon, DJI, Rode, Godox, Aputure et plus.",
      },
      { property: "og:title", content: "Catalogue PaparaShop — 8 catégories, 40+ marques" },
      {
        property: "og:description",
        content:
          "Toutes nos catégories : boîtiers, caméras, audio, éclairage, tournage, moniteurs, casques, accessoires et broadcast.",
      },
    ],
  }),
});

function CataloguePage() {
  const { data } = useSuspenseQuery(categoriesQuery);
  const CATEGORIES = toCategories(data);

  return (
    <SiteLayout>
      <section className="bg-primary py-20 text-white sm:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <p className="mb-3 font-display text-xs font-semibold uppercase tracking-[0.3em] text-accent">
            Notre catalogue
          </p>
          <h1 className="font-display text-4xl font-bold sm:text-5xl md:text-6xl text-balance">
            8 catégories, <span className="text-accent">40+ marques référencées</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-white/80 sm:text-lg">
            Seule boutique spécialisée d'Afrique de l'Ouest francophone en EQUIPEMENTIER AUDIOVISUEL professionnel — sourcé en circuit officiel, garanti jusqu'à 2 ans.
          </p>
          <div className="mt-8">
            <ExternalCatalogCTA label="Consulter les prix et commander" />
          </div>
        </div>
      </section>

      {/* Grille des catégories (navigation rapide) */}
      <section className="bg-secondary/40 py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="mb-8 text-center font-display text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            Nos 8 catégories
          </p>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {CATEGORIES.map((c) => {
              const Icon = c.icon;
              return (
                <a
                  key={c.slug}
                  href={`#${c.slug}`}
                  className="group flex items-center gap-3 rounded-xl border border-border bg-white p-4 transition-all hover:-translate-y-1 hover:border-accent hover:shadow-lg"
                >
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-accent/20">
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-display text-sm font-bold text-primary">
                      {c.title}
                    </p>
                    <p className="truncate text-[11px] text-muted-foreground">
                      {c.brands.length} marques
                    </p>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-start gap-8">
          <CatalogueSidebar categories={CATEGORIES} className="lg:w-64 shrink-0" />
          <div className="min-w-0 flex-1">
            {CATEGORIES.map((cat, idx) => (
              <CategorySection key={cat.slug} category={cat} index={idx} />
            ))}
          </div>
        </div>
      </div>


      <FeaturedProductsTabs />

      <Commitments />


      <section className="gradient-hero py-20 text-center text-white">
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            Prêt à passer commande sur notre{" "}
            <span className="text-accent">plateforme</span> ?
          </h2>
          <p className="mt-4 text-white/75">
            Consultez les prix actualisés, la disponibilité en temps réel et commandez en ligne
            avec livraison Bénin / Burkina Faso / Togo.
          </p>
          <div className="mt-8">
            <ExternalCatalogCTA />
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
