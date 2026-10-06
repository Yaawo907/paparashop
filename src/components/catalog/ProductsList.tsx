import { Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowUpRight, Camera } from "lucide-react";
import type { CmsProduct } from "@/lib/cms-types";
import { productsQuery } from "@/lib/cms.queries";
import { AddToCartButton } from "@/components/shop/AddToCartButton";
import { formatXOF } from "@/lib/cart";
import { Reveal } from "@/components/shared/Reveal";

function ProductCard({ product }: { product: CmsProduct }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:border-accent hover:shadow-lg">
      <Link
        to="/produit/$id"
        params={{ id: product.id }}
        className="block aspect-[4/3] w-full overflow-hidden bg-secondary/50"
      >
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            loading="lazy"
            width={1024}
            height={768}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-muted-foreground/40">
            <Camera className="h-10 w-10" strokeWidth={1.25} />
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        {product.subtitle ? (
          <p className="font-display text-[11px] font-semibold uppercase tracking-widest text-accent-foreground/70">
            {product.subtitle}
          </p>
        ) : null}
        <h3 className="mt-1 font-display text-lg font-bold text-primary">
          <Link to="/produit/$id" params={{ id: product.id }} className="hover:text-accent-foreground">
            {product.name}
          </Link>
        </h3>
        {product.note ? (
          <p className="mt-2 flex-1 text-sm text-muted-foreground">{product.note}</p>
        ) : (
          <div className="flex-1" />
        )}
        {product.price ? (
          <p className="mt-3 font-display text-lg font-bold text-primary">
            {formatXOF(product.price)}
          </p>
        ) : null}
        {product.stock !== null && product.stock <= 0 ? (
          <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Rupture de stock — sur commande
          </p>
        ) : null}
        <AddToCartButton
          id={product.id}
          name={product.name}
          price={product.price}
          image={product.image_url ?? ""}
          className="mt-3 w-full"
        />
        <Link
          to="/produit/$id"
          params={{ id: product.id }}
          className="mt-4 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-primary hover:text-accent-foreground"
        >
          Voir le détail
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </article>
  );
}

export function ProductsList() {
  const { data: products } = useSuspenseQuery(productsQuery);

  return (
    <section className="bg-background py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <p className="mb-3 font-display text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            Notre sélection
          </p>
          <h2 className="font-display text-3xl font-bold sm:text-4xl">Nos produits</h2>
          <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-primary" />
          <p className="mt-4 text-sm text-muted-foreground">
            {products.length} article{products.length > 1 ? "s" : ""} disponible
            {products.length > 1 ? "s" : ""} — prix et stock mis à jour en continu.
          </p>
        </div>

        {products.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">
            Aucun article pour le moment.
          </p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p, i) => (
              <Reveal key={p.id} delay={(i % 9) * 60} className="h-full">
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
