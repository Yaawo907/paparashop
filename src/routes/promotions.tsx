import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { X, ArrowUpRight, Sparkles } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { SITE } from "@/lib/site";

// Auto-load all images from src/assets/promotions
const modules = import.meta.glob(
  "/src/assets/promotions/*.{png,jpg,jpeg,webp,gif,PNG,JPG,JPEG,WEBP,GIF}",
  { eager: true, query: "?url", import: "default" },
) as Record<string, string>;

// Also support .asset.json pointers (CDN-hosted)
const assetJsons = import.meta.glob(
  "/src/assets/promotions/*.asset.json",
  { eager: true },
) as Record<string, { default: { url: string; original_filename?: string } }>;

type Promo = { src: string; name: string };

const promos: Promo[] = [
  ...Object.entries(modules).map(([path, src]) => ({
    src,
    name: path.split("/").pop() || "promotion",
  })),
  ...Object.entries(assetJsons).map(([path, mod]) => ({
    src: mod.default.url,
    name: mod.default.original_filename || path.split("/").pop() || "promotion",
  })),
].sort((a, b) => a.name.localeCompare(b.name));

export const Route = createFileRoute("/promotions")({
  head: () => ({
    meta: [
      { title: "Promotions — PaparaShop" },
      {
        name: "description",
        content:
          "Découvrez les promotions en cours chez PaparaShop : offres spéciales, packs et prix cassés sur le matériel photo et audiovisuel.",
      },
      { property: "og:title", content: "Promotions — PaparaShop" },
      {
        property: "og:description",
        content:
          "Offres spéciales et promotions PaparaShop sur le matériel photo et audiovisuel.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: PromotionsPage,
});

function PromotionsPage() {
  const [active, setActive] = useState<Promo | null>(null);

  return (
    <SiteLayout>
      <section className="gradient-hero pb-20 pt-32 text-white sm:pt-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent">
              <Sparkles className="h-3.5 w-3.5" /> Offres en cours
            </span>
            <h1 className="mt-4 font-display text-4xl font-bold sm:text-5xl">
              Promotions PaparaShop
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm text-white/75 sm:text-base">
              Retrouvez toutes nos offres spéciales, packs et prix cassés. Cliquez
              sur une visuel pour l'agrandir, puis commandez directement via
              WhatsApp ou notre catalogue.
            </p>
          </div>

          {promos.length === 0 ? (
            <div className="mx-auto max-w-xl rounded-xl border border-white/10 bg-white/5 p-10 text-center">
              <p className="text-sm text-white/80">
                Aucune promotion n'est publiée pour le moment. Revenez très
                bientôt !
              </p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {promos.map((p) => (
                <button
                  key={p.src}
                  type="button"
                  onClick={() => setActive(p)}
                  className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-accent/60 hover:shadow-2xl hover:shadow-accent/20"
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={p.src}
                      alt={p.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/70 to-transparent p-3">
                    <span className="text-xs font-semibold text-white">
                      Voir la promo
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-accent" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {active && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
          onClick={() => setActive(null)}
        >
          <button
            type="button"
            onClick={() => setActive(null)}
            aria-label="Fermer"
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </button>
          <div
            className="relative max-h-[90vh] max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={active.src}
              alt={active.name}
              className="max-h-[80vh] w-auto rounded-lg object-contain"
            />
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <a
                href={SITE.catalogUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-primary shadow-md transition-all hover:-translate-y-0.5"
              >
                Voir le catalogue <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      )}
    </SiteLayout>
  );
}
