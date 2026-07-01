import { MapPin } from "lucide-react";
import { LOCATIONS } from "@/lib/site";

const STORY = [
  {
    year: 2017,
    country: "Bénin",
    title: "La genèse à Abomey-Calavi",
    text: "Face à un marché ouest-africain saturé de matériel reconditionné importé du Nigeria — souvent vendu au prix du neuf — Papara SHOP est fondé pour offrir une alternative crédible : du matériel authentique, garanti, et un vrai conseil expert.",
  },
  {
    year: 2021,
    country: "Burkina Faso",
    title: "Expansion à Ouagadougou",
    text: "Fort du succès béninois, PaparaShop ouvre son second point de vente au Burkina Faso pour rapprocher les créateurs, agences et institutions burkinabè d'un service premium jusque-là inaccessible localement.",
  },
  {
    year: 2025,
    country: "Togo",
    title: "Nouvelle antenne à Lomé",
    text: "PaparaShop s'implante au Togo, consolidant sa position de seule boutique spécialisée et crédible d'Afrique de l'Ouest francophone dédiée au matériel photo et audiovisuel professionnel.",
  },
];

export function Timeline() {
  return (
    <section className="bg-background py-20 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <p className="mb-3 font-display text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            Notre parcours
          </p>
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            Depuis {LOCATIONS[0].since}, une vision claire
          </h2>
          <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-primary" />
        </div>

        <div className="relative">
          <div
            className="absolute left-4 top-2 bottom-2 w-0.5 bg-gradient-to-b from-primary via-accent to-primary/30 md:left-1/2 md:-translate-x-1/2"
            aria-hidden
          />

          <ol className="space-y-10">
            {STORY.map((s, i) => (
              <li
                key={s.year}
                className={`relative pl-14 md:grid md:grid-cols-2 md:gap-12 md:pl-0 ${
                  i % 2 === 1 ? "md:[&>*:first-child]:col-start-2" : ""
                }`}
              >
                <span
                  className="absolute left-0 top-2 flex h-8 w-8 items-center justify-center rounded-full border-4 border-background bg-accent text-primary shadow-md md:left-1/2 md:-translate-x-1/2"
                  aria-hidden
                >
                  <MapPin className="h-4 w-4" strokeWidth={2.5} />
                </span>
                <div
                  className={`rounded-xl border border-border bg-card p-6 shadow-sm ${
                    i % 2 === 1 ? "md:col-start-1 md:row-start-1 md:text-right" : ""
                  }`}
                >
                  <p className="font-display text-xs font-semibold uppercase tracking-widest text-accent-foreground/70">
                    {s.year} — {s.country}
                  </p>
                  <h3 className="mt-1 font-display text-xl font-bold text-primary">
                    {s.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {s.text}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
