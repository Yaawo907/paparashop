// ============================================================
// FICHIER : src/components/about/ShopGallery.tsx  (NOUVEAU)
// Galerie "Au cœur de la boutique" — photos réelles de l'intérieur,
// avec agrandissement au clic (lightbox).
//
// AVANT DE COLLER :
// 1. Créer le dossier : src/assets/boutique/
// 2. Y placer 4 à 6 photos réelles nommées :
//    interieur-1.jpg, interieur-2.jpg, interieur-3.jpg, interieur-4.jpg
//    (ajouter/retirer des lignes d'import selon le nombre de photos)
// 3. Adapter les légendes (caption) à ce que montre chaque photo.
// ============================================================
import { useState } from "react";
import { Expand } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { SectionTitle } from "@/components/shared/SectionTitle";

import interieur1 from "@/assets/boutique/interieur-1.jpg";
import interieur2 from "@/assets/boutique/interieur-2.jpg";
import interieur3 from "@/assets/boutique/interieur-3.jpg";
import interieur4 from "@/assets/boutique/interieur-4.jpg";

type Photo = { src: string; caption: string };

// ⬇️ Adapter les légendes aux vraies photos
const PHOTOS: Photo[] = [
  { src: interieur1, caption: "L'espace d'exposition — boîtiers et objectifs" },
  { src: interieur2, caption: "Le comptoir conseil, au service des clients" },
  { src: interieur3, caption: "Rayon éclairage studio et accessoires" },
  { src: interieur4, caption: "La boutique de Godomey, siège de PaparaShop" },
];

export function ShopGallery() {
  const [selected, setSelected] = useState<Photo | null>(null);

  return (
    <section className="bg-secondary/40 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Au cœur de la boutique"
          title="Venez toucher le matériel avant d'acheter"
          subtitle="Contrairement à un simple site de vente, PaparaShop c'est d'abord une vraie boutique physique où notre équipe vous conseille et vous fait tester les équipements."
        />

        {/* Grille : 1 colonne sur mobile, 2 sur tablette, la 1ère photo plus grande sur desktop */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PHOTOS.map((photo, i) => (
            <button
              key={photo.src}
              type="button"
              onClick={() => setSelected(photo)}
              className={`group relative overflow-hidden rounded-2xl border border-border bg-white text-left shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-primary ${
                i === 0 ? "sm:col-span-2 sm:row-span-2 lg:col-span-2" : ""
              }`}
            >
              <img
                src={photo.src}
                alt={photo.caption}
                loading="lazy"
                className="h-full min-h-[220px] w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Dégradé + légende */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-12">
                <p className="text-sm font-medium text-white">{photo.caption}</p>
              </div>
              {/* Icône agrandir */}
              <span className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
                <Expand className="h-4 w-4" aria-hidden />
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox (photo en grand) */}
      <Dialog open={selected !== null} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-4xl border-none bg-transparent p-0 shadow-none">
          {selected && (
            <figure>
              <img
                src={selected.src}
                alt={selected.caption}
                className="max-h-[80vh] w-full rounded-xl object-contain"
              />
              <DialogTitle asChild>
                <figcaption className="mt-3 text-center text-sm font-medium text-white">
                  {selected.caption}
                </figcaption>
              </DialogTitle>
            </figure>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
