import { ArrowUpRight } from "lucide-react";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { ExternalCatalogCTA } from "@/components/shared/ExternalCatalogCTA";
import { SITE } from "@/lib/site";
import productCanon from "@/assets/product-canon.jpg";
import productSony from "@/assets/product-sony.jpg";
import productNikon from "@/assets/product-nikon.jpg";
import productLed from "@/assets/product-led.jpg";

const products = [
  { name: "Canon EOS R5", category: "Reflex plein format", price: "À partir de 4M FCFA", image: productCanon },
  { name: "Sony A6700", category: "Mirrorless APS-C", price: "À partir de 2,8M FCFA", image: productSony },
  { name: "Nikon Z9", category: "Flagship professionnel", price: "À partir de 5,2M FCFA", image: productNikon },
  { name: "Kit LED Studio", category: "Éclairage professionnel", price: "À partir de 500K FCFA", image: productLed },
];

export function FeaturedProducts() {
  return (
    <section className="gradient-hero py-20 text-white sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle eyebrow="Sélection" title="Produits phares" invert />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <a
              key={p.name}
              href={SITE.catalogUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group glass rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:border-accent/60 hover:shadow-2xl hover:shadow-accent/20"
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
                <span className="mt-3 inline-flex items-center gap-1 text-xs text-white/70 group-hover:text-accent">
                  Voir <ArrowUpRight className="h-3 w-3" />
                </span>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-14 text-center">
          <ExternalCatalogCTA />
        </div>
      </div>
    </section>
  );
}
