import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { ShopByCategory } from "@/components/home/ShopByCategory";
import { FeaturedProductsTabs } from "@/components/catalog/FeaturedProductsTabs";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { Accessories } from "@/components/home/Accessories";
import { Stats } from "@/components/home/Stats";
import { TrustedBy } from "@/components/home/TrustedBy";
import { Testimonials } from "@/components/home/Testimonials";
import { ExternalCatalogCTA } from "@/components/shared/ExternalCatalogCTA";
import { GlobalSearch } from "@/components/layout/GlobalSearch";
import { SITE, LOCATIONS } from "@/lib/site";
import { categoriesQuery, productsQuery, testimonialsQuery } from "@/lib/cms.queries";

export const Route = createFileRoute("/")({
  component: Index,
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(categoriesQuery),
      context.queryClient.ensureQueryData(productsQuery),
      context.queryClient.ensureQueryData(testimonialsQuery),
    ]);
  },
  errorComponent: ({ error }) => (
    <div role="alert" className="p-10 text-center text-sm text-muted-foreground">
      Impossible de charger la page : {error.message}
    </div>
  ),
  notFoundComponent: () => <div className="p-10 text-center">Page introuvable.</div>,
  head: () => ({
    meta: [
      { title: "PaparaShop — Équipements & audiovisuel pro | Bénin, Burkina, Togo" },
      {
        name: "description",
        content:
          "Depuis 2017 : la seule boutique spécialisée d'Afrique de l'Ouest francophone en équipements & audiovisuel professionnels. Canon, Sony, Nikon, DJI, Rode, Godox, Aputure…",
      },
      { property: "og:title", content: "PaparaShop — Équipements & audiovisuel pro" },
      {
        property: "og:description",
        content:
          "Matériel authentique, garanti jusqu'à 2 ans — Bénin (siège), Burkina Faso et Togo.",
      },
    ],
  }),
});

function Index() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: SITE.fullName,
    image: "/og.jpg",
    telephone: SITE.phone,
    email: SITE.email,
    url: SITE.catalogUrl,
    foundingDate: `${SITE.foundedYear}-01-01`,
    address: LOCATIONS.map((l) => ({
      "@type": "PostalAddress",
      addressLocality: l.city,
      addressCountry: l.countryCode,
    })),
    areaServed: LOCATIONS.map((l) => l.country),
    sameAs: [SITE.socials.facebook, SITE.socials.instagram, SITE.socials.tiktok],
  };
  return (
    <SiteLayout>
      <HeroCarousel />
      <section className="bg-muted/50 border-b border-border py-6">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <label htmlFor="landing-search" className="sr-only">
            Rechercher un article
          </label>
          <GlobalSearch variant="light" className="w-full" />
        </div>
      </section>
      <ShopByCategory />
      <FeaturedProductsTabs />
      <FeaturedProducts />
      <Accessories />

      <section className="gradient-hero py-16 text-center text-white">
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            Prix, stock et commande sur notre{" "}
            <span className="text-accent">plateforme</span>
          </h2>
          <p className="mt-4 text-white/75">
            Consultez les prix actualisés et commandez en ligne — livraison Bénin, Burkina Faso et Togo.
          </p>
          <div className="mt-8">
            <ExternalCatalogCTA />
          </div>
        </div>
      </section>

      <Testimonials />
      <TrustedBy />
      <Stats />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </SiteLayout>
  );
}
