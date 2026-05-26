import { createFileRoute } from "@tanstack/react-router";
import { Award, Heart, Users, Facebook, Instagram } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { SITE } from "@/lib/site";
import heroGear from "@/assets/hero-gear.jpg";

export const Route = createFileRoute("/a-propos")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "À propos — PaparaShop" },
      {
        name: "description",
        content:
          "Découvrez PaparaShop, votre spécialiste de la photographie et de l'audiovisuel à Abomey-Calavi, Bénin. Notre histoire, nos valeurs et notre engagement.",
      },
    ],
  }),
});

const values = [
  {
    icon: Award,
    title: "Professionnalisme",
    text: "Une exigence de qualité sur chaque produit et chaque conseil prodigué à nos clients.",
  },
  {
    icon: Heart,
    title: "Passion",
    text: "L'amour de l'image guide chacune de nos sélections, du capteur à l'éclairage studio.",
  },
  {
    icon: Users,
    title: "Service client",
    text: "Un accompagnement humain, avant, pendant et après votre achat, pour vous aider à progresser.",
  },
];

function AboutPage() {
  return (
    <SiteLayout>
      <section className="bg-primary py-20 text-white sm:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <p className="mb-3 font-display text-xs font-semibold uppercase tracking-[0.3em] text-accent">
            Qui sommes-nous
          </p>
          <h1 className="font-display text-4xl font-bold sm:text-5xl md:text-6xl text-balance">
            La passion de l'image, <span className="text-accent">au cœur du Bénin</span>
          </h1>
        </div>
      </section>

      <section className="bg-background py-20 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 md:grid-cols-2 md:items-center lg:px-8">
          <div className="overflow-hidden rounded-xl">
            <img
              src={heroGear}
              alt="Équipement photographique professionnel chez PaparaShop"
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <SectionTitle eyebrow="Notre histoire" title="Une référence de la photo à Abomey-Calavi" align="left" />
            <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                Né d'une passion pour la photographie et l'audiovisuel, <strong>{SITE.fullName}</strong> est
                devenu une référence pour les photographes, vidéastes et créateurs à {SITE.city}.
              </p>
              <p>
                Nous sélectionnons rigoureusement chaque appareil, chaque objectif et chaque accessoire
                pour vous garantir un matériel à la hauteur de vos ambitions — du débutant au studio
                professionnel.
              </p>
              <p>
                Plus de 5 000 clients nous ont déjà fait confiance. Vous êtes au bon endroit.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-secondary/40 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle eyebrow="Nos engagements" title="Nos valeurs" />
          <div className="grid gap-6 sm:grid-cols-3">
            {values.map(({ icon: Icon, title, text }) => (
              <article
                key={title}
                className="rounded-xl border border-border bg-card p-8 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="h-7 w-7" strokeWidth={1.75} />
                </div>
                <h3 className="font-display text-lg font-bold">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary py-16 text-center text-white">
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Suivez-nous</h2>
          <p className="mt-3 text-white/75">
            Rejoignez la communauté PaparaShop sur les réseaux sociaux pour découvrir nos nouveautés
            et inspirations photo.
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
