import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowUpRight, PackageCheck, PackageX } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { AddToCartButton } from "@/components/shop/AddToCartButton";
import { formatXOF } from "@/lib/cart";
import { productsQuery } from "@/lib/cms.queries";
import { LOCATIONS, SITE } from "@/lib/site";

export const Route = createFileRoute("/produit/$id")({
  component: ProductPage,
  head: () => ({
    meta: [
      { title: "Fiche produit — Papara Shop" },
      {
        name: "description",
        content:
          "Détails, prix et disponibilité d'un équipement photo, vidéo ou audio distribué par Papara Shop au Bénin, Togo et Burkina Faso.",
      },
      { property: "og:title", content: "Fiche produit — Papara Shop" },
      {
        property: "og:description",
        content: "Caractéristiques, prix et commande en ligne de votre matériel audiovisuel.",
      },
      { property: "og:type", content: "product" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  errorComponent: () => (
    <SiteLayout>
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="text-muted-foreground">Impossible de charger ce produit.</p>
      </div>
    </SiteLayout>
  ),
  notFoundComponent: () => (
    <SiteLayout>
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="text-muted-foreground">Produit introuvable.</p>
      </div>
    </SiteLayout>
  ),
});

function ProductPage() {
  const { id } = Route.useParams();
  const { data: products, isLoading } = useQuery(productsQuery);
  const product = (products ?? []).find((p) => p.id === id);

  return (
    <SiteLayout>
      <div className="mx-auto max-w-5xl px-4 py-10 sm:py-14">
        <Link
          to="/catalogue"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour au catalogue
        </Link>

        {isLoading && !product ? (
          <p className="mt-10 text-sm text-muted-foreground">Chargement…</p>
        ) : !product ? (
          <div className="mt-10 rounded-xl border border-border bg-card p-8 text-center">
            <h1 className="font-display text-xl font-bold text-primary">Produit introuvable</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Cet article n'est plus disponible. Parcourez le catalogue pour trouver un équivalent.
            </p>
            <Link
              to="/catalogue"
              className="mt-5 inline-flex rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              Voir le catalogue
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid gap-8 md:grid-cols-2">
            <ProductMedia
              name={product.name}
              subtitle={product.subtitle}
              image={product.image_url}
              gallery={product.gallery_urls ?? []}
              video={product.video_url}
            />

            <div className="flex flex-col">
              <p className="font-display text-[11px] font-semibold uppercase tracking-widest text-accent-foreground/70">
                {product.subtitle}
              </p>
              <h1 className="mt-1 font-display text-2xl font-bold text-primary sm:text-3xl">
                {product.name}
              </h1>
              {product.note ? (
                <p className="mt-3 text-sm text-muted-foreground">{product.note}</p>
              ) : null}

              {product.price ? (
                <p className="mt-5 font-display text-2xl font-bold text-primary">
                  {formatXOF(Number(product.price))}
                </p>
              ) : (
                <p className="mt-5 text-sm font-semibold text-muted-foreground">
                  Prix sur demande
                </p>
              )}

              <p className="mt-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider">
                {(product.stock ?? 0) > 0 ? (
                  <>
                    <PackageCheck className="h-4 w-4 text-primary" />
                    <span className="text-primary">En stock</span>
                  </>
                ) : (
                  <>
                    <PackageX className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Sur commande</span>
                  </>
                )}
              </p>

              {product.sku ? (
                <p className="mt-2 font-mono text-xs text-muted-foreground">Réf. {product.sku}</p>
              ) : null}

              <AddToCartButton
                id={product.id}
                name={product.name}
                price={product.price === null ? null : Number(product.price)}
                image={product.image_url ?? ""}
                className="mt-6 w-full"
              />

              <a
                href={LOCATIONS[0]?.whatsappHref ?? SITE.catalogUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-semibold text-primary hover:bg-secondary/60"
              >
                Demander un conseil sur WhatsApp
              </a>

              {product.url ? (
                <a
                  href={product.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-primary hover:text-accent-foreground"
                >
                  Voir sur la plateforme
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </SiteLayout>
  );
}

/** Galerie multi-images + vidéo de présentation de l'article. */
function ProductMedia({
  name,
  subtitle,
  image,
  gallery,
  video,
}: {
  name: string;
  subtitle: string;
  image: string | null;
  gallery: string[];
  video: string | null;
}) {
  const images = [image, ...gallery].filter((u): u is string => !!u);
  const [active, setActive] = useState(0);
  const embed = toEmbedUrl(video);

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-2xl border border-border bg-secondary/40">
        {images[active] ? (
          <img
            src={images[active]}
            alt={`${name} — ${subtitle}`}
            className="h-full w-full object-cover"
            width={1024}
            height={768}
          />
        ) : (
          <div className="flex aspect-[4/3] items-center justify-center text-sm text-muted-foreground">
            Image indisponible
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {images.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setActive(i)}
              className={`h-16 w-16 overflow-hidden rounded-lg border ${
                i === active ? "border-primary" : "border-border"
              }`}
              aria-label={`Voir l'image ${i + 1}`}
            >
              <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
            </button>
          ))}
        </div>
      )}

      {video ? (
        <div className="overflow-hidden rounded-2xl border border-border bg-black">
          {embed ? (
            <iframe
              src={embed}
              title={`Vidéo de présentation — ${name}`}
              className="aspect-video w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <video src={video} controls className="aspect-video w-full" />
          )}
        </div>
      ) : null}
    </div>
  );
}

function toEmbedUrl(url: string | null) {
  if (!url) return null;
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([\w-]{6,})/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return null;
}
