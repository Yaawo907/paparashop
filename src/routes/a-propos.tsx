import { createFileRoute } from "@tanstack/react-router";
import { Facebook, Instagram } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Timeline } from "@/components/about/Timeline";
import { InstitutionalClients } from "@/components/about/InstitutionalClients";
import { Commitments } from "@/components/home/Commitments";
import { Stats } from "@/components/home/Stats";
import { SITE, LOCATIONS } from "@/lib/site";

export const Route = createFileRoute("/a-propos")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "À propos — PaparaShop | Depuis 2017 au Bénin, Burkina & Togo" },
      {
        name: "description",
        content:
          "Depuis 2017, PaparaShop est la seule boutique spécialisée d'Afrique de l'Ouest francophone dédiée au matériel photo & audiovisuel professionnel. Bénin, Burkina Faso et Togo.",
      },
      { property: "og:title", content: "À propos — PaparaShop" },
      {
        property: "og:description",
        content:
          "Notre histoire : de la fondation à Abomey-Calavi en 2017 à l'expansion Togo 2025.",
      },
    ],
  }),
});

function AboutPage() {
  const years = new Date().getFullYear() - SITE.foundedYear;
  return (
    <SiteLayout>
      <section className="bg-primary py-20 text-white sm:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <p className="mb-3 font-display text-xs font-semibold uppercase tracking-[0.3em] text-accent">
            Qui sommes-nous
          </p>
          <h1 className="font-display text-4xl font-bold sm:text-5xl md:text-6xl text-balance">
            {years}+ ans au service de{" "}
            <span className="text-accent">l'image professionnelle</span> en Afrique de l'Ouest
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-white/80 sm:text-lg">
            Fondé en {SITE.foundedYear} au Bénin, PaparaShop est aujourd'hui présent dans
            {" "}{LOCATIONS.length} pays : Bénin, Burkina Faso et Togo.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-background py-20 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <p className="mb-3 font-display text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            Notre mission
          </p>
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            Rendre accessible du matériel <span className="text-primary">authentique et garanti</span>
          </h2>
          <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-primary" />
          <div className="mt-8 space-y-4 text-base leading-relaxed text-muted-foreground">
            <p>
              Le marché ouest-africain a longtemps été inondé de matériel reconditionné importé
              du Nigeria, revendu au prix du neuf, sans garantie ni service après-vente.
              PaparaShop est né du refus de cette réalité.
            </p>
            <p>
              Nous sélectionnons chaque produit en circuit officiel, appliquons les standards
              qualité européens et offrons une garantie pouvant aller jusqu'à 2 ans.
              Notre équipe conseille aussi bien un particulier qu'une agence, une chaîne
              de télévision ou une ONG internationale.
            </p>
          </div>
        </div>
      </section>

      <Timeline />

      <Stats />

      <Commitments />

      <InstitutionalClients />

      <section className="bg-primary py-16 text-center text-white">
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Suivez-nous</h2>
          <p className="mt-3 text-white/75">
            Rejoignez la communauté PaparaShop pour découvrir nos nouveautés, tutos et
            inspirations photo/vidéo.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <a
              href={SITE.socials.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border-2 border-accent px-5 py-2 text-sm font-semibold text-accent transition-all hover:bg-accent hover:text-primary"
            >
              <Facebook className="h-4 w-4" /> Facebook
            </a>
            <a
              href={SITE.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border-2 border-accent px-5 py-2 text-sm font-semibold text-accent transition-all hover:bg-accent hover:text-primary"
            >
              <Instagram className="h-4 w-4" /> Instagram
            </a>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
