import { useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { MessageCircle } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { CategorySection } from "@/components/catalog/CategorySection";
import { ProductsList } from "@/components/catalog/ProductsList";
import { CatalogueSidebar } from "@/components/catalog/CatalogueSidebar";
import { Commitments } from "@/components/home/Commitments";
import { GlobalSearch } from "@/components/layout/GlobalSearch";

import { categoriesQuery, productsQuery } from "@/lib/cms.queries";
import { toCategories } from "@/lib/cms-adapters";
import { LOCATIONS } from "@/lib/site";

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
      Impossible de charger le catalogue : {error instanceof Error ? error.message : "Veuillez réessayer."}
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
  const { data: products } = useSuspenseQuery(productsQuery);
  const CATEGORIES = toCategories(data);

  // Nombre d'articles actifs par catégorie (via category_id des produits)
  const productCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const cat of data) {
      counts[cat.slug] = products.filter(
        (p) => p.is_active && p.category_id === cat.id,
      ).length;
    }
    return counts;
  }, [data, products]);

  // Nombre d'articles actifs par marque (produits rattachés à la catégorie
  // dont le nom mentionne la marque — ex. "Sony A7 IV" pour la marque Sony)
  const brandCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    const norm = (s: string) =>
      s
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
    // Même règle que la page /marque : nom OU sous-titre contient la marque
    for (const cat of data) {
      for (const brand of cat.brands) {
        const nb = norm(brand.name);
        counts[`${cat.slug}::${brand.name}`] = nb
          ? products.filter(
              (p) =>
                norm(p.name).includes(nb) || norm(p.subtitle ?? "").includes(nb),
            ).length
          : 0;
      }
    }
    return counts;
  }, [data, products]);

  return (
    <SiteLayout>
      <section className="hero-dots relative overflow-hidden bg-primary py-20 text-white md:py-32">
        <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-full max-w-2xl -translate-x-1/2 rounded-full bg-white/5 blur-[120px]" />
        <div className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6">
          <p className="mb-6 font-display text-sm font-bold uppercase tracking-[0.3em] text-accent md:text-base">
            Notre catalogue
          </p>
          <h1 className="mx-auto max-w-4xl font-display text-5xl font-bold leading-[1.1] tracking-tight text-white sm:text-6xl md:text-7xl">
            8 catégories,{" "}
            <span className="relative inline-block text-accent">
              40+ marques
              <svg
                className="absolute -bottom-2 left-0 h-2 w-full text-accent/30"
                viewBox="0 0 200 8"
                fill="none"
                aria-hidden="true"
              >
                <path d="M2 6C60 2 140 2 198 6" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </span>{" "}
            référencées
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-background/90 md:text-xl">
            Seule boutique spécialisée d'Afrique de l'Ouest francophone en{" "}
            <strong className="font-bold uppercase text-white">équipementier audiovisuel</strong>{" "}
            professionnel — sourcé en circuit officiel, garanti jusqu'à 2 ans.
          </p>
          <div className="mt-10 flex justify-center">
            <a
              href={LOCATIONS[0]?.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 rounded-lg bg-accent px-8 py-4 font-display text-lg font-bold text-studio-ink shadow-[0_15px_30px_-5px_rgba(255,215,0,0.3)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-5px_rgba(255,215,0,0.4)]"
            >
              <MessageCircle className="h-6 w-6 transition-transform group-hover:scale-110" />
              Consulter les prix et commander
            </a>
          </div>
        </div>
        <div className="absolute bottom-0 right-0 hidden h-32 w-32 border-b-4 border-r-4 border-accent/20 lg:mb-12 lg:mr-12 lg:block" />
        <div className="absolute left-0 top-0 hidden h-32 w-32 border-l-4 border-t-4 border-accent/20 lg:ml-12 lg:mt-12 lg:block" />
      </section>

      {/* Recherche produit */}
      <section className="border-b border-border bg-muted/50 py-6">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <GlobalSearch variant="light" className="w-full" />
        </div>
      </section>


      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-start gap-8">
          <CatalogueSidebar categories={CATEGORIES} className="lg:w-64 shrink-0" />
          <div className="min-w-0 flex-1">
            {CATEGORIES.map((cat, idx) => (
              <CategorySection
                key={cat.slug}
                category={cat}
                index={idx}
                productCount={productCounts[cat.slug] ?? 0}
                brandCounts={brandCounts}
              />
            ))}
          </div>
        </div>
      </div>


      <ProductsList />

      <Commitments />


      <section className="gradient-hero py-20 text-center text-white">
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            Prêt à passer <span className="text-accent">commande</span> ?
          </h2>
          <p className="mt-4 text-white/75">
            Ajoutez vos articles au panier et commandez en ligne — livraison Bénin / Burkina Faso / Togo.
            Une question ? Notre équipe vous répond sur WhatsApp.
          </p>
          <div className="mt-8">
            <a
              href={LOCATIONS[0]?.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md bg-accent px-7 py-3 font-display text-sm font-semibold tracking-wide text-primary shadow-lg shadow-accent/30 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-accent/40"
            >
              <MessageCircle className="h-4 w-4" />
              Discuter avec un conseiller
            </a>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
