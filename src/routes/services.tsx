import { createFileRoute } from "@tanstack/react-router";
import { Camera, Video, Lightbulb, Headphones, Compass, Wrench } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { SavAndSpecialOrder } from "@/components/services/SavAndSpecialOrder";
import { ExternalCatalogCTA } from "@/components/shared/ExternalCatalogCTA";


export const Route = createFileRoute("/services")({
  component: ServicesPage,
  head: () => ({
    meta: [
      { title: "Nos services — PaparaShop" },
      {
        name: "description",
        content:
          "Vente d'appareils photo et caméras, accessoires studio, conseil expert, service après-vente — découvrez tous les services PaparaShop.",
      },
    ],
  }),
});

const services = [
  {
    icon: Camera,
    title: "Vente d'appareils photo",
    text: "Reflex, mirrorless, hybrides — neuf et occasion garantie chez les grandes marques (Canon, Nikon, Sony, Fujifilm).",
  },
  {
    icon: Video,
    title: "Caméras vidéo professionnelles",
    text: "Caméscopes 4K, caméras cinéma et solutions broadcast pour vos productions exigeantes.",
  },
  {
    icon: Lightbulb,
    title: "Matériel studio",
    text: "Éclairage LED, softbox, réflecteurs, fonds et toiles pour équiper votre studio photo ou vidéo.",
  },
  {
    icon: Compass,
    title: "Conseil & accompagnement",
    text: "Notre équipe vous guide pour choisir le matériel adapté à votre niveau, votre usage et votre budget.",
  },
  {
    icon: Headphones,
    title: "Audio & captation",
    text: "Microphones, enregistreurs, accessoires son : la qualité d'image mérite une qualité sonore.",
  },
  {
    icon: Wrench,
    title: "Service après-vente",
    text: "Un suivi attentif après votre achat — diagnostic, conseils d'usage et solutions techniques.",
  },
];

function ServicesPage() {
  return (
    <SiteLayout>
      <section className="bg-primary py-20 text-white sm:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <p className="mb-3 font-display text-xs font-semibold uppercase tracking-[0.3em] text-accent">
            Ce que nous faisons
          </p>
          <h1 className="font-display text-4xl font-bold sm:text-5xl md:text-6xl text-balance">
            Nos <span className="text-accent">services</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-white/80 sm:text-lg">
            De la vente à l'accompagnement, PaparaShop vous apporte une expertise complète
            sur l'ensemble de votre matériel audiovisuel.
          </p>
        </div>
      </section>

      <section className="bg-background py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map(({ icon: Icon, title, text }) => (
              <article
                key={title}
                className="group rounded-xl border border-border bg-card p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-xl"
              >
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-accent/20">
                  <Icon className="h-6 w-6" strokeWidth={1.75} />
                </div>
                <h3 className="font-display text-lg font-bold">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <SavAndSpecialOrder />


      <section className="gradient-hero py-16 text-center text-white">
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">
            Un projet, une question ?
          </h2>
          <p className="mt-3 text-white/75">
            Explorez notre catalogue ou contactez-nous : notre équipe se fera un plaisir de vous orienter.
          </p>
          <div className="mt-6">
            <ExternalCatalogCTA />
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
