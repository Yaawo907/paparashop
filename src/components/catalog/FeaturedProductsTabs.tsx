import { Sparkles, Flame, Tag, ArrowUpRight } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { SITE } from "@/lib/site";

type FeaturedItem = {
  name: string;
  category: string;
  note: string;
};

const NEW_ARRIVALS: FeaturedItem[] = [
  { name: "Canon EOS R5 Mark II", category: "Hybride plein format", note: "45 MP, vidéo 8K RAW — flagship photo + vidéo" },
  { name: "Sony A7 IV", category: "Hybride plein format", note: "33 MP, 4K 60p — polyvalence pro" },
  { name: "DJI RS 4 Pro", category: "Stabilisation", note: "Gimbal cinéma jusqu'à 4,5 kg" },
  { name: "Aputure Amaran 200x S", category: "Éclairage LED", note: "Bicolore 200W, silencieux" },
  { name: "RØDE Wireless PRO", category: "Micro sans-fil", note: "Dual channel + timecode" },
  { name: "DJI Mic 2", category: "Micro sans-fil", note: "Enregistrement interne 32-bit float" },
];

const BESTSELLERS: FeaturedItem[] = [
  { name: "Canon EOS 250D", category: "Reflex débutant", note: "Le meilleur premier reflex pour créateurs" },
  { name: "Sony ZV-1", category: "Compact vlog", note: "Best-seller créateurs de contenu" },
  { name: "Godox SL-60W", category: "LED studio", note: "L'entrée de gamme incontournable" },
  { name: "RØDE VideoMic Go II", category: "Micro shotgun", note: "Le micro caméra le plus vendu" },
  { name: "Zhiyun Crane M3", category: "Gimbal", note: "Ultra compact et polyvalent" },
  { name: "Hollyland Lark M2", category: "Micro sans-fil", note: "Discret, portée 300 m" },
];

const OFFERS: FeaturedItem[] = [
  { name: "Pack studio créateur", category: "Bundle", note: "Éclairage + fond + micro — offre limitée" },
  { name: "Canon EOS M50 Mark II + 15-45mm", category: "Kit hybride", note: "Prix promo -15%" },
  { name: "Bundle podcast RØDECaster Duo + 2 PodMic", category: "Bundle audio", note: "Économisez sur le pack complet" },
  { name: "Godox AD200 Pro", category: "Flash portable", note: "Offre déstockage" },
];

function Grid({ items }: { items: FeaturedItem[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((it) => (
        <article
          key={it.name}
          className="flex flex-col rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-accent hover:shadow-lg"
        >
          <p className="font-display text-[11px] font-semibold uppercase tracking-widest text-accent-foreground/70">
            {it.category}
          </p>
          <h3 className="mt-1 font-display text-lg font-bold text-primary">{it.name}</h3>
          <p className="mt-2 flex-1 text-sm text-muted-foreground">{it.note}</p>
          <a
            href={SITE.catalogUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-primary hover:text-accent-foreground"
          >
            Voir sur la plateforme
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
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
