import { useCallback, useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { heroSlidesQuery } from "@/lib/cms.queries";
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

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
  { title: "Appareils Photo Pro", subtitle: "Canon, Nikon, Sony • Reflex & Mirrorless", image: heroCameras, ctaLabel: "Découvrir le catalogue", ctaUrl: "/catalogue" },
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
    if (!playing) return;
    const id = window.setInterval(next, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [playing, next]);

  return (
    <section className="relative h-[42vh] min-h-[300px] max-h-[420px] w-full overflow-hidden bg-primary-dark">
      {slides.map((slide, i) => (
        <div
          key={`${slide.title}-${i}`}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            i === index ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
          aria-hidden={i !== index}
        >
          <img
            src={slide.image}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            style={{ filter: "brightness(0.45) blur(2px)" }}
            loading={i === 0 ? "eager" : "lazy"}
            fetchPriority={i === 0 ? "high" : "auto"}
            width={1920}
            height={1280}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/60 via-primary-dark/50 to-black/80" />
          <div className="absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full bg-accent/10 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-[400px] w-[400px] rounded-full bg-white/5 blur-3xl" />
        </div>
      ))}

      {/* Content (positioned by current slide) */}
      <div className="relative z-10 flex h-full items-center justify-center px-6">
        <div key={index} className="max-w-3xl text-center text-white animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="font-display text-2xl font-bold leading-tight text-accent sm:text-3xl md:text-4xl text-balance">
            {active.title}
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-white/85 sm:text-base">
            {active.subtitle}
          </p>
          {active.ctaUrl.startsWith("http") ? (
            <a
              href={active.ctaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-md bg-accent px-6 py-3 font-display text-sm font-bold uppercase tracking-wider text-primary shadow-2xl shadow-accent/30 transition-all hover:-translate-y-1 hover:bg-accent/90 hover:shadow-accent/50"
            >
              {active.ctaLabel}
              <ArrowRight className="h-4 w-4" />
            </a>
          ) : (
            <Link
              to={active.ctaUrl}
              className="mt-5 inline-flex items-center gap-2 rounded-md bg-accent px-6 py-3 font-display text-sm font-bold uppercase tracking-wider text-primary shadow-2xl shadow-accent/30 transition-all hover:-translate-y-1 hover:bg-accent/90 hover:shadow-accent/50"
            >
              {active.ctaLabel}
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}

        </div>
      </div>

      {/* Prev/Next */}
      <button
        onClick={prev}
        aria-label="Slide précédente"
        className="absolute left-4 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-all hover:scale-110 hover:bg-white/20 sm:flex md:left-8"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={next}
        aria-label="Slide suivante"
        className="absolute right-4 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-all hover:scale-110 hover:bg-white/20 sm:flex md:right-8"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Counter */}
      <div className="absolute right-4 top-4 z-20 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur-md md:right-8">
        {String(index + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
      </div>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-3">
        {slides.map((s, i) => (
          <button
            key={`${s.title}-${i}`}
            onClick={() => setIndex(i)}
            aria-label={`Aller à la slide ${i + 1}`}
            className={`h-2.5 rounded-full transition-all ${
              i === index ? "w-8 bg-accent shadow-lg shadow-accent/50" : "w-2.5 bg-white/40 hover:bg-white/60"
            }`}
          />
        ))}
      </div>

      {/* Play/Pause */}
      <button
        onClick={() => setPlaying((p) => !p)}
        aria-label={playing ? "Mettre en pause" : "Lecture"}
        className="absolute bottom-3 right-4 z-20 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur-md transition-all hover:bg-white/20 md:right-8"
      >
        {playing ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
        {playing ? "PAUSE" : "LECTURE"}
      </button>
    </section>
  );
}
