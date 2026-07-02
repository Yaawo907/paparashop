import { Sparkles, Flame, Tag, ArrowUpRight } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { SITE } from "@/lib/site";
import canonR5m2 from "@/assets/featured/canon-r5m2.jpg";
import sonyA7iv from "@/assets/featured/sony-a7iv.jpg";
import djiRs4Pro from "@/assets/featured/dji-rs4pro.jpg";
import aputure200xs from "@/assets/featured/aputure-200xs.jpg";
import rodeWirelessPro from "@/assets/featured/rode-wireless-pro.jpg";
import djiMic2 from "@/assets/featured/dji-mic2.jpg";
import canon250d from "@/assets/featured/canon-250d.jpg";
import sonyZv1 from "@/assets/featured/sony-zv1.jpg";
import godoxSl60w from "@/assets/featured/godox-sl60w.jpg";
import rodeVideomicGoii from "@/assets/featured/rode-videomic-goii.jpg";
import zhiyunCraneM3 from "@/assets/featured/zhiyun-crane-m3.jpg";
import hollylandLarkM2 from "@/assets/featured/hollyland-lark-m2.jpg";
import packStudio from "@/assets/featured/pack-studio.jpg";
import canonM50Kit from "@/assets/featured/canon-m50-kit.jpg";
import rodePodcastBundle from "@/assets/featured/rode-podcast-bundle.jpg";
import godoxAd200 from "@/assets/featured/godox-ad200.jpg";

type FeaturedItem = {
  name: string;
  category: string;
  note: string;
  image: string;
  url?: string;
};

const NEW_ARRIVALS: FeaturedItem[] = [
  { name: "Canon EOS R5 Mark II", category: "Hybride plein format", note: "45 MP, vidéo 8K RAW — flagship photo + vidéo", image: canonR5m2 },
  { name: "Sony A7 IV", category: "Hybride plein format", note: "33 MP, 4K 60p — polyvalence pro", image: sonyA7iv },
  { name: "DJI RS 4 Pro", category: "Stabilisation", note: "Gimbal cinéma jusqu'à 4,5 kg", image: djiRs4Pro },
  { name: "Aputure Amaran 200x S", category: "Éclairage LED", note: "Bicolore 200W, silencieux", image: aputure200xs },
  { name: "RØDE Wireless PRO", category: "Micro sans-fil", note: "Dual channel + timecode", image: rodeWirelessPro },
  { name: "DJI Mic 2", category: "Micro sans-fil", note: "Enregistrement interne 32-bit float", image: djiMic2 },
];

const BESTSELLERS: FeaturedItem[] = [
  { name: "Canon EOS 250D", category: "Reflex débutant", note: "Le meilleur premier reflex pour créateurs", image: canon250d },
  { name: "Sony ZV-1", category: "Compact vlog", note: "Best-seller créateurs de contenu", image: sonyZv1 },
  { name: "Godox SL-60W", category: "LED studio", note: "L'entrée de gamme incontournable", image: godoxSl60w },
  { name: "RØDE VideoMic Go II", category: "Micro shotgun", note: "Le micro caméra le plus vendu", image: rodeVideomicGoii },
  { name: "Zhiyun Crane M3", category: "Gimbal", note: "Ultra compact et polyvalent", image: zhiyunCraneM3 },
  { name: "Hollyland Lark M2", category: "Micro sans-fil", note: "Discret, portée 300 m", image: hollylandLarkM2 },
];

const OFFERS: FeaturedItem[] = [
  { name: "Pack studio créateur", category: "Bundle", note: "Éclairage + fond + micro — offre limitée", image: packStudio },
  { name: "Canon EOS M50 Mark II + 15-45mm", category: "Kit hybride", note: "Prix promo -15%", image: canonM50Kit },
  { name: "Bundle podcast RØDECaster Duo + 2 PodMic", category: "Bundle audio", note: "Économisez sur le pack complet", image: rodePodcastBundle },
  { name: "Godox AD200 Pro", category: "Flash portable", note: "Offre déstockage", image: godoxAd200 },
];

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
              href={SITE.catalogUrl}
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
