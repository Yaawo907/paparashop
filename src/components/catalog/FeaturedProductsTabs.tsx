import { Sparkles, Flame, Tag, ArrowUpRight } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { SITE } from "@/lib/site";
import {
  NEW_ARRIVALS,
  BESTSELLERS,
  OFFERS,
  type FeaturedItem,
} from "@/lib/featured";

function Grid({ items }: { items: FeaturedItem[] }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((it) => (
        <article
          key={it.name}
          className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:border-accent hover:shadow-lg"
        >
          <div className="aspect-[4/3] w-full overflow-hidden bg-secondary/50">
            <img
              src={it.image}
              alt={`${it.name} — ${it.category}`}
              loading="lazy"
              width={1024}
              height={768}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className="flex flex-1 flex-col p-5">
            <p className="font-display text-[11px] font-semibold uppercase tracking-widest text-accent-foreground/70">
              {it.category}
            </p>
            <h3 className="mt-1 font-display text-lg font-bold text-primary">{it.name}</h3>
            <p className="mt-2 flex-1 text-sm text-muted-foreground">{it.note}</p>
            <a
              href={it.url || SITE.catalogUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-primary hover:text-accent-foreground"
            >
              Voir sur la plateforme
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </article>
      ))}
    </div>
  );
}

export function FeaturedProductsTabs() {
  return (
    <section className="bg-background py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <p className="mb-3 font-display text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            Notre sélection
          </p>
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            Produits vedettes
          </h2>
          <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-primary" />
        </div>

        <Tabs defaultValue="new" className="w-full">
          <TabsList className="mx-auto mb-8 grid w-full max-w-xl grid-cols-3">
            <TabsTrigger value="new" className="gap-1.5">
              <Sparkles className="h-3.5 w-3.5" /> Nouveautés
            </TabsTrigger>
            <TabsTrigger value="best" className="gap-1.5">
              <Flame className="h-3.5 w-3.5" /> Best-sellers
            </TabsTrigger>
            <TabsTrigger value="offers" className="gap-1.5">
              <Tag className="h-3.5 w-3.5" /> Offres
            </TabsTrigger>
          </TabsList>
          <TabsContent value="new"><Grid items={NEW_ARRIVALS} /></TabsContent>
          <TabsContent value="best"><Grid items={BESTSELLERS} /></TabsContent>
          <TabsContent value="offers"><Grid items={OFFERS} /></TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
