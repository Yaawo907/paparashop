import { useState } from "react";
import { ArrowUpRight, Eye, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { ExternalCatalogCTA } from "@/components/shared/ExternalCatalogCTA";
import { SITE } from "@/lib/site";
import productCanon from "@/assets/product-canon.jpg";
import productSony from "@/assets/product-sony.jpg";
import productNikon from "@/assets/product-nikon.jpg";
import productLed from "@/assets/product-led.jpg";

type Product = {
  name: string;
  category: string;
  price: string;
  image: string;
  description: string;
  specs: { label: string; value: string }[];
  highlights: string[];
};

const products: Product[] = [
  {
    name: "Canon EOS R5",
    category: "Reflex plein format",
    price: "À partir de 4M FCFA",
    image: productCanon,
    description:
      "Le hybride plein format Canon pensé pour la photo haute résolution et la vidéo 8K. Une polyvalence rare pour les professionnels.",
    specs: [
      { label: "Capteur", value: "Plein format CMOS 45 Mpx" },
      { label: "Vidéo", value: "8K RAW / 4K 120p" },
      { label: "Stabilisation", value: "IBIS 5 axes — jusqu'à 8 stops" },
      { label: "Autofocus", value: "Dual Pixel CMOS AF II — 1053 zones" },
      { label: "Rafale", value: "20 i/s obturateur électronique" },
      { label: "Connectique", value: "Wi-Fi 5GHz, Bluetooth, USB-C" },
    ],
    highlights: [
      "Boîtier tropicalisé magnésium",
      "Double slot CFexpress + SD UHS-II",
      "Viseur OLED 5,76 Mpts",
    ],
  },
  {
    name: "Sony A6700",
    category: "Mirrorless APS-C",
    price: "À partir de 2,8M FCFA",
    image: productSony,
    description:
      "Le mirrorless APS-C polyvalent de Sony pour les créateurs hybrides photo / vidéo recherchant l'IA et la compacité.",
    specs: [
      { label: "Capteur", value: "APS-C Exmor R 26 Mpx" },
      { label: "Vidéo", value: "4K 120p 10-bit 4:2:2" },
      { label: "Stabilisation", value: "IBIS 5 axes — 5 stops" },
      { label: "Autofocus", value: "AI AF — sujet humain, animal, véhicule" },
      { label: "Rafale", value: "11 i/s avec suivi AF/AE" },
      { label: "Écran", value: "Tactile orientable multi-angle" },
    ],
    highlights: [
      "Processeur BIONZ XR",
      "Profil S-Cinetone & S-Log3",
      "Port micro + casque",
    ],
  },
  {
    name: "Nikon Z9",
    category: "Flagship professionnel",
    price: "À partir de 5,2M FCFA",
    image: productNikon,
    description:
      "Le vaisseau amiral hybride Nikon : sport, reportage et cinéma 8K dans un boîtier sans obturateur mécanique.",
    specs: [
      { label: "Capteur", value: "Plein format empilé 45,7 Mpx" },
      { label: "Vidéo", value: "8K 60p N-RAW interne" },
      { label: "Stabilisation", value: "IBIS 5 axes — 6 stops" },
      { label: "Autofocus", value: "493 collimateurs Deep Learning" },
      { label: "Rafale", value: "30 i/s RAW / 120 i/s JPEG" },
      { label: "Construction", value: "Magnésium pro tropicalisé" },
    ],
    highlights: [
      "Sans obturateur mécanique",
      "Viseur Real-Live 3 Mpts",
      "Double CFexpress Type B",
    ],
  },
  {
    name: "Kit LED Studio",
    category: "Éclairage professionnel",
    price: "À partir de 500K FCFA",
    image: productLed,
    description:
      "Kit lumière complet pour studios photo et vidéo : panneaux LED bicolores, softbox et trépieds robustes.",
    specs: [
      { label: "Type", value: "Panneaux LED COB bicolores" },
      { label: "Température", value: "3200K à 5600K réglable" },
      { label: "Puissance", value: "2 × 100W équivalent halogène" },
      { label: "CRI / TLCI", value: "≥ 96 — rendu fidèle peau" },
      { label: "Alimentation", value: "Secteur + batterie V-mount" },
      { label: "Accessoires", value: "Softbox 60cm, grilles nid d'abeille" },
    ],
    highlights: [
      "Pieds 2,5m charge 5kg",
      "Télécommande sans fil",
      "Sac de transport inclus",
    ],
  },
];

export function FeaturedProducts() {
  const [active, setActive] = useState<Product | null>(null);

  return (
    <section className="gradient-hero py-20 text-white sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle eyebrow="Sélection" title="Produits phares" invert />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <article
              key={p.name}
              className="group glass overflow-hidden rounded-xl transition-all duration-300 hover:-translate-y-2 hover:border-accent/60 hover:shadow-2xl hover:shadow-accent/20"
            >
              <div className="aspect-[4/3] overflow-hidden bg-white/5">
                <img
                  src={p.image}
                  alt={p.name}
                  loading="lazy"
                  width={800}
                  height={640}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5 text-center">
                <h3 className="font-display text-base font-bold text-white">{p.name}</h3>
                <p className="mt-1 text-xs uppercase tracking-wider text-accent">{p.category}</p>
                <p className="mt-3 font-display text-base font-bold text-accent">{p.price}</p>
                <div className="mt-4 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => setActive(p)}
                    className="inline-flex items-center justify-center gap-2 rounded-md border border-accent/60 bg-accent/10 px-4 py-2 text-xs font-semibold text-accent transition-all hover:bg-accent hover:text-primary"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    Voir les caractéristiques
                  </button>
                  <a
                    href={SITE.catalogUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1 text-xs text-white/70 transition-colors hover:text-accent"
                  >
                    Commander <ArrowUpRight className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-14 text-center">
          <ExternalCatalogCTA />
        </div>
      </div>

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-w-2xl border-primary/20 bg-card p-0 text-foreground sm:rounded-xl">
          {active && (
            <div className="overflow-hidden">
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
                <img
                  src={active.image}
                  alt={active.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                    {active.category}
                  </p>
                  <h3 className="font-display text-2xl font-bold text-white">{active.name}</h3>
                </div>
              </div>
              <div className="p-6">
                <DialogHeader className="space-y-1 text-left">
                  <DialogTitle className="sr-only">{active.name}</DialogTitle>
                  <DialogDescription className="text-sm leading-relaxed text-muted-foreground">
                    {active.description}
                  </DialogDescription>
                </DialogHeader>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {active.specs.map((s) => (
                    <div
                      key={s.label}
                      className="rounded-lg border border-border bg-secondary/40 p-3"
                    >
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                        {s.label}
                      </p>
                      <p className="mt-1 text-sm font-medium text-foreground">{s.value}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {active.highlights.map((h) => (
                    <span
                      key={h}
                      className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                    >
                      {h}
                    </span>
                  ))}
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-border pt-5">
                  <p className="font-display text-lg font-bold text-primary">{active.price}</p>
                  <a
                    href={SITE.catalogUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-primary shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    Commander <ArrowUpRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
