import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { ExternalCatalogCTA } from "@/components/shared/ExternalCatalogCTA";
import heroCameras from "@/assets/hero-cameras.jpg";
import heroVideo from "@/assets/hero-video.jpg";
import heroStudio from "@/assets/hero-studio.jpg";
import heroLenses from "@/assets/hero-lenses.jpg";
import productCanon from "@/assets/product-canon.jpg";
import productSony from "@/assets/product-sony.jpg";
import productNikon from "@/assets/product-nikon.jpg";
import productLed from "@/assets/product-led.jpg";

export const Route = createFileRoute("/catalogue")({
  component: CataloguePage,
  head: () => ({
    meta: [
      { title: "Catalogue — PaparaShop" },
      {
        name: "description",
        content:
          "Parcourez le catalogue PaparaShop : appareils photo, caméras vidéo, accessoires et matériel studio. Consultez les prix sur notre plateforme.",
      },
    ],
  }),
});

type Item = { title: string; category: string; image: string };

const categories: { name: string; items: Item[] }[] = [
  {
    name: "Appareils photo",
    items: [
      { title: "Canon EOS R5", category: "Reflex plein format", image: productCanon },
      { title: "Sony A6700", category: "Mirrorless APS-C", image: productSony },
      { title: "Nikon Z9", category: "Flagship pro", image: productNikon },
      { title: "Boîtiers & Reflex", category: "Sélection complète", image: heroCameras },
    ],
  },
  {
    name: "Caméras vidéo",
    items: [
      { title: "Caméscope 4K", category: "Cinéma & broadcast", image: heroVideo },
      { title: "Caméra streaming", category: "Live & contenu", image: heroVideo },
      { title: "Stabilisateurs", category: "Gimbal & supports", image: heroVideo },
      { title: "Audio & micros", category: "Captation pro", image: heroVideo },
    ],
  },
  {
    name: "Studio",
    items: [
      { title: "Kit LED Studio", category: "Éclairage continu", image: productLed },
      { title: "Softbox & parapluies", category: "Diffusion lumière", image: heroStudio },
      { title: "Fonds & toiles", category: "Décors studio", image: heroStudio },
      { title: "Trépieds pro", category: "Stabilisation", image: heroStudio },
    ],
  },
  {
    name: "Accessoires",
    items: [
      { title: "Objectifs premium", category: "Toutes focales", image: heroLenses },
      { title: "Cartes mémoire", category: "Stockage rapide", image: heroLenses },
      { title: "Sacs & protections", category: "Transport sécurisé", image: heroLenses },
      { title: "Batteries & chargeurs", category: "Autonomie pro", image: heroLenses },
    ],
  },
];

function CataloguePage() {
  return (
    <SiteLayout>
      <section className="bg-primary py-20 text-white sm:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <p className="mb-3 font-display text-xs font-semibold uppercase tracking-[0.3em] text-accent">
            Notre offre
          </p>
          <h1 className="font-display text-4xl font-bold sm:text-5xl md:text-6xl text-balance">
            Le catalogue <span className="text-accent">PaparaShop</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-white/80 sm:text-lg">
            Découvrez nos catégories phares. Pour les prix détaillés, la disponibilité
            et la commande, consultez notre plateforme dédiée.
          </p>
          <div className="mt-8">
            <ExternalCatalogCTA label="Consulter les prix et commander" />
          </div>
        </div>
      </section>

      {categories.map((cat, idx) => (
        <section
          key={cat.name}
          className={idx % 2 === 0 ? "bg-background py-16 sm:py-20" : "bg-secondary/40 py-16 sm:py-20"}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionTitle title={cat.name} align="left" />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {cat.items.map((item) => (
                <article
                  key={item.title}
                  className="group overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-muted">
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-base font-bold text-foreground">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-xs uppercase tracking-wider text-primary">
                      {item.category}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      ))}

      <section className="gradient-hero py-20 text-center text-white">
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            Prêt à découvrir notre <span className="text-accent">catalogue complet</span> ?
          </h2>
          <p className="mt-4 text-white/75">
            Consultez les prix actualisés, les fiches détaillées et passez commande directement.
          </p>
          <div className="mt-8">
            <ExternalCatalogCTA />
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
