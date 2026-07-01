import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { Specialties } from "@/components/home/Specialties";
import { Commitments } from "@/components/home/Commitments";
import { Stats } from "@/components/home/Stats";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { Accessories } from "@/components/home/Accessories";
import { TrustedBy } from "@/components/home/TrustedBy";
import { Testimonials } from "@/components/home/Testimonials";
import { SITE, LOCATIONS } from "@/lib/site";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "PaparaShop — Photo, vidéo & audiovisuel pro | Bénin, Burkina, Togo" },
      {
        name: "description",
        content:
          "Depuis 2017 : la seule boutique spécialisée d'Afrique de l'Ouest francophone dédiée au matériel photo & audiovisuel professionnel. Canon, Sony, Nikon, DJI, Rode, Godox, Aputure…",
      },
      { property: "og:title", content: "PaparaShop — Photo & audiovisuel pro" },
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
      <Specialties />
      <Commitments />
      <Stats />
      <FeaturedProducts />
      <Accessories />
      <Testimonials />
      <TrustedBy />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </SiteLayout>
  );
}

