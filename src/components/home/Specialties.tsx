import { Camera, Video, Aperture, Lightbulb } from "lucide-react";
import { SectionTitle } from "@/components/shared/SectionTitle";

const items = [
  {
    icon: Camera,
    title: "Appareils Photo",
    items: ["Canon • Nikon", "Sony • Fujifilm", "Reflex & Mirrorless"],
    tagline: "Neuf & Occasion",
  },
  {
    icon: Video,
    title: "Caméras Vidéo",
    items: ["4K • Full HD", "Caméscopes Pro", "Cinéma & Streaming"],
    tagline: "Réalisation vidéo",
  },
  {
    icon: Aperture,
    title: "Accessoires",
    items: ["Objectifs • Trépieds", "Sacs • Filtres", "Cartes mémoire"],
    tagline: "Équipement complet",
  },
  {
    icon: Lightbulb,
    title: "Studio",
    items: ["Éclairage LED", "Softbox • Réflecteurs", "Toile & Fond"],
    tagline: "Configuration complète",
  },
];

export function Specialties() {
  return (
    <section id="specialties" className="bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle eyebrow="Notre expertise" title="Nos spécialités" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ icon: Icon, title, items, tagline }) => (
            <article
              key={title}
              className="group relative overflow-hidden rounded-xl border-2 border-primary/20 bg-white p-8 text-center transition-all duration-300 hover:-translate-y-2 hover:border-accent hover:shadow-2xl hover:shadow-primary/15"
            >
              <div className="absolute inset-x-0 top-0 h-1.5 gradient-teal-gold" />
              <div className="mx-auto mb-5 inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-accent/20 group-hover:text-primary-dark">
                <Icon className="h-7 w-7" strokeWidth={1.75} />
              </div>
              <h3 className="font-display text-lg font-bold text-primary">{title}</h3>
              <ul className="mt-4 space-y-1 text-sm leading-relaxed text-muted-foreground">
                {items.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
              <p className="mt-4 text-xs italic text-muted-foreground/80">{tagline}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
