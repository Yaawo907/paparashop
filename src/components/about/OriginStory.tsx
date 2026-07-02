import { Quote } from "lucide-react";

export function OriginStory() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-primary/90 py-20 text-white sm:py-24">
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.4) 0, transparent 40%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.3) 0, transparent 40%)",
        }}
        aria-hidden
      />
      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[auto_1fr] lg:items-center lg:gap-16 lg:px-8">
        <div className="flex flex-col items-center lg:items-start">
          <span className="font-display text-[10px] font-semibold uppercase tracking-[0.4em] text-accent">
            Notre origine
          </span>
          <p className="mt-2 font-display text-7xl font-bold leading-none text-accent sm:text-8xl">
            2017
          </p>
          <p className="mt-3 font-display text-sm uppercase tracking-widest text-white/70">
            Abomey-Calavi, Bénin
          </p>
        </div>
        <div className="relative">
          <Quote className="absolute -left-2 -top-4 h-10 w-10 text-accent/40" strokeWidth={1.5} />
          <blockquote className="pl-6 font-display text-xl leading-relaxed text-white/95 sm:text-2xl">
            "En Afrique de l'Ouest, le matériel photo et vidéo pro était trop souvent
            du reconditionné importé du Nigeria, revendu au prix du neuf, sans garantie
            ni SAV. Nous avons créé PaparaShop pour offrir enfin une alternative
            <span className="text-accent"> authentique, garantie et conseillée</span> —
            au même niveau d'exigence que les grands revendeurs européens."
          </blockquote>
          <p className="mt-5 pl-6 text-sm uppercase tracking-widest text-white/60">
            — L'équipe fondatrice
          </p>
        </div>
      </div>
    </section>
  );
}
