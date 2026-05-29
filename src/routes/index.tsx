import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { Specialties } from "@/components/home/Specialties";
import { Stats } from "@/components/home/Stats";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { Accessories } from "@/components/home/Accessories";
import { TrustedBy } from "@/components/home/TrustedBy";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "PaparaShop — Appareils photo, caméras & studio à Abomey-Calavi" },
      {
        name: "description",
        content:
          "Découvrez PaparaShop : appareils photo Canon, Nikon, Sony, caméras 4K, éclairage studio et accessoires pros à Abomey-Calavi, Bénin.",
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
    address: {
      "@type": "PostalAddress",
      addressLocality: SITE.city,
      addressCountry: "BJ",
    },
    sameAs: [SITE.socials.facebook, SITE.socials.instagram, SITE.socials.tiktok],
  };
  return (
    <SiteLayout>
      <HeroCarousel />
      <Specialties />
      <Stats />
      <FeaturedProducts />
      <Accessories />
      <TrustedBy />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </SiteLayout>
  );
}
