import { Camera, Video, Aperture, Lightbulb, Check } from "lucide-react";
import { SectionTitle } from "@/components/shared/SectionTitle";

const items = [
  {
    icon: Camera,
    title: "Appareils Photo",
    tagline: "Neuf & Occasion",
    description:
      "Une sélection rigoureuse de boîtiers reflex et hybrides, calibrés et garantis pour photographes amateurs comme professionnels.",
    features: [
      "Canon EOS, Nikon Z, Sony Alpha, Fujifilm X",
      "Reflex plein format et APS-C",
      "Hybrides mirrorless dernière génération",
      "Garantie revendeur 6 à 24 mois",
    ],
  },
  {
    icon: Video,
    title: "Caméras Vidéo",
    tagline: "4K • Full HD • Cinéma",
    description:
      "Équipement vidéo pour créateurs de contenu, mariages, documentaires et productions broadcast : du caméscope au cinéma numérique.",
    features: [
      "Caméscopes 4K Sony, Panasonic, Canon",
      "Caméras cinéma & rigs pro",
      "Setup streaming et live multi-cam",
      "Micros, capture audio & monitoring",
    ],
  },
  {
    icon: Aperture,
    title: "Accessoires",
    tagline: "Équipement complet",
    description:
      "Tout ce qu'il faut autour du boîtier : optiques, supports, stockage et protection pour ne jamais manquer la scène.",
    features: [
      "Objectifs Sigma, Tamron et constructeur",
      "Trépieds, monopodes & stabilisateurs",
      "Cartes SD/CFexpress haute vitesse",
      "Sacs, filtres ND/UV, batteries longue durée",
    ],
  },
  {
    icon: Lightbulb,
    title: "Studio",
    tagline: "Configuration complète",
    description:
      "Solutions d'éclairage et de mise en scène pour studios photo et vidéo, du portrait au plateau publicitaire.",
    features: [
      "Panneaux LED Godox, VIJIM, Ulanzi",
      "Softbox, parapluies & beauty dish",
      "Fonds vinyle, papier & supports",
      "Réflecteurs, flags et accessoires lumière",
    ],
  },
];

export function Specialties() {
  return (
    <section id="specialties" className="bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle eyebrow="Notre expertise" title="Nos spécialités" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ icon: Icon, title, description, features, tagline }) => (
            <article
              key={title}
              className="group relative flex flex-col overflow-hidden rounded-xl border-2 border-primary/20 bg-white p-7 transition-all duration-300 hover:-translate-y-2 hover:border-accent hover:shadow-2xl hover:shadow-primary/15"
            >
              <div className="absolute inset-x-0 top-0 h-1.5 gradient-teal-gold" />
              <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-accent/20 group-hover:text-primary-dark">
                <Icon className="h-7 w-7" strokeWidth={1.75} />
              </div>
              <h3 className="font-display text-lg font-bold text-primary">{title}</h3>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-accent-foreground/70">
                {tagline}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
              <ul className="mt-5 space-y-2 border-t border-border/60 pt-4 text-sm text-foreground/85">
                {features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={2.5} />
                    <span className="leading-snug">{f}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
