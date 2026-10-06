import { useCallback, useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { heroSlidesQuery } from "@/lib/cms.queries";
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play, Lightbulb, Video, ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { GlobalSearch } from "@/components/layout/GlobalSearch";
import studioShowcase from "@/assets/studio-showcase.jpg";
import audioImage from "@/assets/audio/rode.jpg";

import heroCameras from "@/assets/hero-cameras.jpg";
import heroVideo from "@/assets/hero-video.jpg";
import heroStudio from "@/assets/hero-studio.jpg";
import heroLenses from "@/assets/hero-lenses.jpg";
import heroGear from "@/assets/hero-gear.jpg";


type Slide = {
  title: string;
  subtitle: string;
  image: string;
  ctaLabel: string;
  ctaUrl: string;
};

const FALLBACK_IMAGES = [heroCameras, heroVideo, heroStudio, heroLenses, heroGear];

const defaultSlides: Slide[] = [
  { title: "Appareils Photo Pro", subtitle: "Canon, Nikon, Sony • Reflex & Mirrorless", image: studioShowcase, ctaLabel: "Découvrir le catalogue", ctaUrl: "/catalogue" },
  { title: "Caméras Vidéo 4K", subtitle: "Caméscopes professionnels • Full HD & Ultra HD", image: heroVideo, ctaLabel: "Découvrir le catalogue", ctaUrl: "/catalogue" },
  { title: "Accessoires Studio", subtitle: "Éclairage LED • Softbox • Réflecteurs", image: heroStudio, ctaLabel: "Découvrir le catalogue", ctaUrl: "/catalogue" },
  { title: "Objectifs & Lentilles", subtitle: "Objectifs premium • Trépieds professionnels", image: heroLenses, ctaLabel: "Découvrir le catalogue", ctaUrl: "/catalogue" },
  { title: "Équipement Complet", subtitle: "Solutions intégrées pour photographes pros", image: heroGear, ctaLabel: "Découvrir le catalogue", ctaUrl: "/catalogue" },
];

const AUTOPLAY_MS = 5500;

export function HeroCarousel() {
  const { data: rows = [] } = useQuery(heroSlidesQuery);
  const slides: Slide[] =
    rows.length > 0
      ? rows.map((r, i) => ({
          title: r.title,
          subtitle: r.subtitle,
          image: r.image_url || FALLBACK_IMAGES[i % FALLBACK_IMAGES.length],
          ctaLabel: r.cta_label || "Découvrir le catalogue",
          ctaUrl: r.cta_url || "/catalogue",
        }))
      : defaultSlides;

  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);

  const count = slides.length;
  const next = useCallback(() => setIndex((i) => (i + 1) % count), [count]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + count) % count), [count]);
  const active = slides[Math.min(index, count - 1)];

  useEffect(() => {
    if (!playing || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(next, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [playing, next]);

  return (
    <section aria-label="PaparaShop — sélection audiovisuelle" className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 sm:pt-8 lg:px-8">
      <div className="studio-showcase grid grid-cols-1 gap-4 md:grid-cols-12">
        <div className="group relative min-h-[410px] overflow-hidden rounded-lg border border-studio-line bg-studio md:col-span-8 md:row-span-2">
          {slides.map((slide, i) => (
            <img key={`${slide.title}-${i}`} src={/logo/i.test(slide.image) ? studioShowcase : slide.image} alt="Matériel audiovisuel professionnel" width={1536} height={1024} loading={i === 0 ? "eager" : "lazy"} fetchPriority={i === 0 ? "high" : "auto"} aria-hidden={i !== index} className={`studio-hero-photo absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${i === index ? "opacity-100" : "opacity-0"}`} />
          ))}
          <div className="absolute inset-0 bg-studio/25" />
          <div className="relative flex h-full flex-col justify-end p-6 pb-20 text-studio-foreground sm:p-10 sm:pb-20">
            <span className="mb-5 w-fit bg-accent px-3 py-1.5 text-xs font-bold uppercase text-studio-ink">PaparaShop · Depuis 2017</span>
            <h1 className="max-w-lg font-display text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-6xl">{active.title}</h1>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-studio-foreground sm:text-base">{active.subtitle}</p>
            <Button asChild className="mt-7 h-auto w-fit whitespace-normal bg-studio-foreground px-6 py-4 text-left font-bold text-studio-ink hover:bg-accent">
              {active.ctaUrl.startsWith("http") ? <a href={active.ctaUrl} target="_blank" rel="noopener noreferrer">{active.ctaLabel}<ArrowRight /></a> : <Link to={active.ctaUrl}>{active.ctaLabel}<ArrowRight /></Link>}
            </Button>
          </div>
          <div className="absolute inset-x-6 bottom-5 flex items-center justify-between text-studio-foreground sm:inset-x-10">
            <span className="text-xs font-medium tabular-nums">{String(index + 1).padStart(2, "0")} <span className="text-studio-muted">/ {String(count).padStart(2, "0")}</span></span>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" onClick={prev} aria-label="Slide précédente"><ChevronLeft /></Button>
              <Button variant="ghost" size="icon" onClick={() => setPlaying((p) => !p)} aria-label={playing ? "Mettre en pause" : "Lecture"}>{playing ? <Pause /> : <Play />}</Button>
              <Button variant="ghost" size="icon" onClick={next} aria-label="Slide suivante"><ChevronRight /></Button>
            </div>
          </div>
        </div>
        <div className="studio-search-panel relative z-30 flex min-h-[200px] flex-col justify-center rounded-lg bg-studio-search p-6 text-center text-studio-ink md:col-span-4 sm:p-8">
          <h2 className="mb-6 font-display text-2xl font-bold underline decoration-primary decoration-4 underline-offset-8">Trouvez votre matériel</h2>
          <GlobalSearch variant="light" />
        </div>
        <Link to="/catalogue" hash="audio-micros" className="group relative min-h-[240px] overflow-hidden rounded-lg border border-studio-line md:col-span-4">
          <img src={audioImage} alt="Microphone professionnel" width={600} height={600} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-studio/35" />
          <div className="relative flex h-full min-h-[240px] flex-col justify-between p-7 text-studio-foreground">
            <span className="text-xs font-bold uppercase text-accent">Audio & micros</span>
            <div className="flex items-end justify-between gap-3"><h2 className="font-display text-2xl font-bold">Capturer le<br />son parfait</h2><ArrowRight className="h-5 w-5 shrink-0" /></div>
          </div>
        </Link>
        <Link to="/catalogue" hash="eclairage-studio" className="group flex min-h-[160px] flex-col justify-between rounded-lg bg-primary p-6 text-primary-foreground transition-colors hover:bg-primary/90 md:col-span-3">
          <Lightbulb className="h-9 w-9" strokeWidth={1.5} />
          <div className="mt-5 flex items-end justify-between"><div><p className="text-xs uppercase opacity-75">Studio</p><h2 className="font-display text-xl font-bold">Éclairage</h2></div><ArrowUpRight className="h-5 w-5" /></div>
        </Link>
        <Link to="/catalogue" hash="tournage-production" className="group flex min-h-[160px] flex-col justify-between rounded-lg bg-accent p-6 text-studio-ink transition-colors hover:bg-accent/90 md:col-span-3">
          <Video className="h-9 w-9" strokeWidth={1.5} />
          <div className="mt-5 flex items-end justify-between"><div><p className="text-xs uppercase opacity-60">Production</p><h2 className="font-display text-xl font-bold">Tournage</h2></div><ArrowUpRight className="h-5 w-5" /></div>
        </Link>
        <div className="flex min-h-[160px] flex-col items-start justify-center gap-5 rounded-lg border border-studio-line bg-studio-foreground/5 p-6 text-studio-foreground md:col-span-6 sm:flex-row sm:items-center">
          <div className="flex-1"><h2 className="font-display text-xl font-bold">Besoin d’aide ?</h2><p className="mt-2 text-sm leading-relaxed text-studio-muted">Nos experts vous accompagnent dans vos projets.</p></div>
          <Button asChild variant="outline" className="shrink-0 border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground"><Link to="/contact">Contactez-nous <ArrowUpRight /></Link></Button>
        </div>
      </div>
    </section>
  );
}
