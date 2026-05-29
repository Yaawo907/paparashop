import { SectionTitle } from "@/components/shared/SectionTitle";
import { ExternalCatalogCTA } from "@/components/shared/ExternalCatalogCTA";
import { SITE } from "@/lib/site";
import { ArrowUpRight, Mic, Radio, HardDrive, SprayCan, Sun, Lightbulb } from "lucide-react";
import shotgunMic from "@/assets/acc-shotgun-mic.jpg";
import lavalierMic from "@/assets/acc-lavalier-mic.jpg";
import memoryCards from "@/assets/acc-memory-cards.jpg";
import cleaningKit from "@/assets/acc-cleaning-kit.jpg";
import softbox from "@/assets/acc-softbox.jpg";
import ledPanel from "@/assets/acc-led-panel.jpg";

const accessories = [
  {
    title: "Micros Shotgun",
    brand: "Rode • Sennheiser • Ulanzi",
    description: "Captation directionnelle pro pour interviews, reportages et vidéos YouTube.",
    icon: Mic,
    badge: "Audio pro",
    image: shotgunMic,
  },
  {
    title: "Micros Cravate sans fil",
    brand: "DJI Mic • Hollyland • Boya",
    description: "Système 2.4 GHz longue portée avec récepteur double canal et anti-bruit.",
    icon: Radio,
    badge: "Sans fil",
    image: lavalierMic,
  },
  {
    title: "Cartes Mémoire",
    brand: "SanDisk • Lexar • Sony Tough",
    description: "SD UHS-II, microSD et CFexpress jusqu'à 1700 Mo/s pour la 8K et le burst RAW.",
    icon: HardDrive,
    badge: "Stockage",
    image: memoryCards,
  },
  {
    title: "Kit Nettoyage Ulanzi",
    brand: "Ulanzi Camera Cleaning",
    description: "Soufflette, pinceaux antistatiques, microfibres et solution pour optiques et capteurs.",
    icon: SprayCan,
    badge: "Entretien",
    image: cleaningKit,
  },
  {
    title: "Softbox Studio",
    brand: "Godox • Aputure • Neewer",
    description: "Octa, strip et rectangulaires avec grilles nid d'abeille et adaptateurs Bowens.",
    icon: Sun,
    badge: "Studio",
    image: softbox,
  },
  {
    title: "Panneaux LED VIJIM",
    brand: "VIJIM • Ulanzi • Godox",
    description: "Lumières bicolores et RGB compactes sur batterie, parfaites en run-and-gun.",
    icon: Lightbulb,
    badge: "Éclairage",
    image: ledPanel,
  },
];

export function Accessories() {
  return (
    <section className="bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Accessoires"
          title="Tout l'équipement complémentaire"
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {accessories.map(({ title, brand, description, icon: Icon, badge, image }) => (
            <a
              key={title}
              href={SITE.catalogUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-2 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                <img
                  src={image}
                  alt={title}
                  loading="lazy"
                  width={800}
                  height={600}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground shadow-md">
                  <Icon className="h-3 w-3" />
                  {badge}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-display text-lg font-bold text-foreground transition-colors group-hover:text-primary">
                  {title}
                </h3>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-accent-foreground/70">
                  {brand}
                </p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {description}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary transition-colors group-hover:text-accent-foreground">
                  Voir sur le catalogue
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-14 text-center">
          <ExternalCatalogCTA label="Voir tous les accessoires" />
        </div>
      </div>
    </section>
  );
}
