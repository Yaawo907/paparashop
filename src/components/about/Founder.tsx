// ============================================================
// FICHIER : src/components/about/Founder.tsx  (NOUVEAU)
// Section "Le fondateur" — photo réelle + citation signée.
//
// AVANT DE COLLER :
// 1. Ajouter la photo du fondateur dans : src/assets/fondateur.jpg
//    (portrait vertical de préférence, min. 800px de large)
// 2. Remplacer FOUNDER_NAME et FOUNDER_TITLE ci-dessous.
// ============================================================
import { Quote, MapPin, Calendar } from "lucide-react";
import founderImg from "@/assets/fondateur.jpg";
import { SITE } from "@/lib/site";

// ⬇️ À REMPLACER par les vraies informations du client
const FOUNDER_NAME = "Rama A. DANDJINOU";
const FOUNDER_TITLE = "CEO & Fondateur de PaparaShop";

export function Founder() {
  return (
    <section className="bg-background py-20 sm:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[420px_1fr] lg:gap-16 lg:px-8">
        {/* --- Photo du fondateur --- */}
        <div className="relative mx-auto w-full max-w-md lg:mx-0">
          {/* Cadre décoratif or, décalé derrière la photo */}
          <div
            className="absolute -bottom-4 -right-4 h-full w-full rounded-2xl border-2 border-accent"
            aria-hidden
          />
          <img
            src={founderImg}
            alt={`${FOUNDER_NAME}, ${FOUNDER_TITLE}`}
            className="relative aspect-[4/5] w-full rounded-2xl object-cover shadow-2xl"
            loading="lazy"
          />
          {/* Badge sur la photo */}
          <div className="absolute bottom-4 left-4 right-4 rounded-xl bg-white/95 p-4 shadow-lg backdrop-blur">
            <p className="font-display text-base font-bold text-foreground">{FOUNDER_NAME}</p>
            <p className="text-xs uppercase tracking-wider text-primary">{FOUNDER_TITLE}</p>
          </div>
        </div>

        {/* --- Texte + citation --- */}
        <div>
          <p className="mb-3 font-display text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            Le fondateur
          </p>
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
            L'homme derrière <span className="text-primary">PaparaShop</span>
          </h2>
          <div className="mt-5 h-1 w-16 rounded-full bg-primary" />

          <div className="relative mt-8">
            <Quote
              className="absolute -left-1 -top-3 h-9 w-9 text-accent/50"
              strokeWidth={1.5}
              aria-hidden
            />
            <blockquote className="pl-8 text-lg leading-relaxed text-foreground/85 sm:text-xl">
              "En Afrique de l'Ouest, le matériel photo et vidéo pro était trop souvent du
              reconditionné importé, revendu au prix du neuf, sans garantie ni SAV. J'ai créé
              PaparaShop en {SITE.foundedYear} pour offrir enfin une alternative{" "}
              <span className="font-semibold text-primary">
                authentique, garantie et conseillée
              </span>{" "}
              — au même niveau d'exigence que les grands revendeurs européens."
            </blockquote>
            <p className="mt-4 pl-8 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
              — {FOUNDER_NAME}
            </p>
          </div>

          {/* Deux repères factuels */}
          <div className="mt-8 flex flex-wrap gap-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 text-primary" aria-hidden />
              Fondé en {SITE.foundedYear}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 text-primary" aria-hidden />
              Godomey, Abomey-Calavi — Bénin
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
