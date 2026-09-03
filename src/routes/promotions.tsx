import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { X, ArrowUpRight, Sparkles } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { GlobalSearch } from "@/components/layout/GlobalSearch";
import { SITE } from "@/lib/site";
import { promotionsQuery, categoriesQuery, productsQuery } from "@/lib/cms.queries";
import type { CmsPromotion } from "@/lib/cms-types";

export const Route = createFileRoute("/promotions")({
  head: () => ({
    meta: [
      { title: "Promotions — PaparaShop" },
      {
        name: "description",
        content:
          "Découvrez les promotions en cours chez PaparaShop : offres spéciales, packs et prix cassés sur l'EQUIPEMENTIER AUDIOVISUEL professionnel.",
      },
      { property: "og:title", content: "Promotions — PaparaShop" },
      {
        property: "og:description",
        content:
          "Offres spéciales et promotions PaparaShop sur l'EQUIPEMENTIER AUDIOVISUEL professionnel.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(promotionsQuery),
      context.queryClient.ensureQueryData(categoriesQuery),
      context.queryClient.ensureQueryData(productsQuery),
    ]);
  },
  errorComponent: ({ error }) => (
    <div role="alert" className="p-10 text-center text-sm text-muted-foreground">
      Impossible de charger les promotions : {error.message}
    </div>
  ),
  notFoundComponent: () => <div className="p-10 text-center">Page introuvable.</div>,
  component: PromotionsPage,
});

function PromotionsPage() {
  const { data: promos } = useSuspenseQuery(promotionsQuery);
  const [active, setActive] = useState<CmsPromotion | null>(null);

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
              Retrouvez toutes nos offres spéciales, packs et prix cassés. Cliquez sur un visuel
              pour l'agrandir, puis commandez directement via WhatsApp ou notre catalogue.
            </p>
          </div>

          {/* Recherche produit */}
          <div className="mx-auto mb-12 max-w-3xl">
            <GlobalSearch className="w-full" />
          </div>

          {promos.length === 0 ? (
            <div className="mx-auto max-w-xl rounded-xl border border-white/10 bg-white/5 p-10 text-center">
              <p className="text-sm text-white/80">
                Aucune promotion n'est publiée pour le moment. Revenez très bientôt !
              </p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {promos.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setActive(p)}
                  className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-accent/60 hover:shadow-2xl hover:shadow-accent/20"
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={p.image_url}
                      alt={p.title || "Promotion PaparaShop"}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  {(p.title || p.description) && (
                    <div className="p-4 text-left">
                      <p className="font-display text-sm font-bold text-white">{p.title}</p>
                      <p className="mt-1 line-clamp-2 text-xs text-white/70">{p.description}</p>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          <div className="mt-14 text-center">
            <a
              href={SITE.catalogUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md bg-accent px-6 py-3 font-display text-sm font-semibold text-primary shadow-lg transition-all hover:-translate-y-0.5"
            >
              Voir le catalogue complet
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {active && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setActive(null)}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            className="absolute right-5 top-5 rounded-full bg-white/10 p-2 text-white"
            onClick={() => setActive(null)}
            aria-label="Fermer"
          >
            <X className="h-5 w-5" />
          </button>
          <img
            src={active.image_url}
            alt={active.title || "Promotion"}
            className="max-h-[85vh] max-w-full rounded-lg object-contain"
          />
        </div>
      )}
    </SiteLayout>
  );
}
