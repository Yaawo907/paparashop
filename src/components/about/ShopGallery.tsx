// ============================================================
// FICHIER : src/components/about/ShopGallery.tsx
// Galerie "Au cœur de la boutique" — photos réelles de l'intérieur,
// avec agrandissement au clic (lightbox).
//
// FONCTIONNEMENT AUTOMATIQUE :
// Déposez simplement vos photos dans le dossier src/assets/boutique/
// → elles s'affichent toutes, quel que soit leur nom ou leur format
//   (.jpg, .jpeg, .png, .webp, .gif).
// L'ordre d'affichage suit l'ordre alphabétique des noms de fichiers :
// nommez par exemple 01-exposition.jpeg, 02-comptoir.png… pour
// contrôler l'ordre. La PREMIÈRE image s'affiche en grand.
//
// LÉGENDES (facultatif) : ajoutez une entrée dans CAPTIONS ci-dessous
// avec le nom du fichier pour afficher un texte sur la photo.
// ============================================================
import { useState } from "react";
import { Expand } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { SectionTitle } from "@/components/shared/SectionTitle";

// Charge automatiquement toutes les images du dossier boutique
const modules = import.meta.glob(
  "/src/assets/boutique/*.{png,jpg,jpeg,webp,gif,PNG,JPG,JPEG,WEBP,GIF}",
  { eager: true, query: "?url", import: "default" },
) as Record<string, string>;

// Légendes facultatives, par nom de fichier exact
const CAPTIONS: Record<string, string> = {
  // "01-exposition.jpeg": "L'espace d'exposition — boîtiers et objectifs",
  // "02-comptoir.png": "Le comptoir conseil, au service des clients",
};

type Photo = { src: string; name: string; caption?: string };

const PHOTOS: Photo[] = Object.entries(modules)
  .map(([path, src]) => {
    const name = path.split("/").pop() || "";
    return { src, name, caption: CAPTIONS[name] };
  })
  .sort((a, b) => a.name.localeCompare(b.name));

export function ShopGallery() {
  const [selected, setSelected] = useState<Photo | null>(null);

  // Si le dossier est vide, la section ne s'affiche pas du tout
  if (PHOTOS.length === 0) return null;

  return (
    <section className="bg-secondary/40 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Au cœur de la boutique"
          title="Venez toucher le matériel avant d'acheter"
          subtitle="Contrairement à un simple site de vente, PaparaShop c'est d'abord une vraie boutique physique où notre équipe vous conseille et vous fait tester les équipements."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PHOTOS.map((photo, i) => (
            <button
              key={photo.src}
              type="button"
              onClick={() => setSelected(photo)}
              aria-label={photo.caption || "Agrandir la photo de la boutique"}
              className={`group relative overflow-hidden rounded-2xl border border-border bg-white text-left shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-primary ${
                i === 0 ? "sm:col-span-2 sm:row-span-2 lg:col-span-2" : ""
              }`}
            >
              <img
                src={photo.src}
                alt={photo.caption || "Intérieur de la boutique PaparaShop"}
                loading="lazy"
                className="h-full min-h-[220px] w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {photo.caption && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-12">
                  <p className="text-sm font-medium text-white">{photo.caption}</p>
                </div>
              )}
              <span className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
                <Expand className="h-4 w-4" aria-hidden />
              </span>
            </button>
          ))}
        </div>
      </div>

      <Dialog open={selected !== null} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-4xl border-none bg-transparent p-0 shadow-none">
          {selected && (
            <figure>
              <img
                src={selected.src}
                alt={selected.caption || "Intérieur de la boutique PaparaShop"}
                className="max-h-[80vh] w-full rounded-xl object-contain"
              />
              <DialogTitle asChild>
                <figcaption className="mt-3 text-center text-sm font-medium text-white">
                  {selected.caption || "Boutique PaparaShop"}
                </figcaption>
              </DialogTitle>
            </figure>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
