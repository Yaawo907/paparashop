import { ShieldCheck, Award, Truck, Star, Wrench, Lightbulb } from "lucide-react";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { COMMITMENTS } from "@/lib/site";

const ICONS = [ShieldCheck, Award, Truck, Star, Wrench, Lightbulb];

export function Commitments({ variant = "light" }: { variant?: "light" | "dark" }) {
  const dark = variant === "dark";
  return (
    <section
      className={
        dark
          ? "gradient-hero py-20 text-white sm:py-24"
          : "bg-secondary/40 py-20 sm:py-24"
      }
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Nos engagements"
          title="Pourquoi choisir PaparaShop"
          invert={dark}
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {COMMITMENTS.map((c, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <article
                key={c.title}
                className={
                  dark
                    ? "rounded-xl border border-white/15 bg-white/5 p-7 backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-accent/60"
                    : "rounded-xl border-2 border-primary/15 bg-white p-7 transition-all hover:-translate-y-1 hover:border-accent hover:shadow-xl"
                }
              >
                <div
                  className={
                    dark
                      ? "mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent/20 text-accent"
                      : "mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary"
                  }
                >
                  <Icon className="h-6 w-6" strokeWidth={1.75} />
                </div>
                <h3
                  className={
                    dark
                      ? "font-display text-lg font-bold text-white"
                      : "font-display text-lg font-bold text-primary"
                  }
                >
                  {c.title}
                </h3>
                <p
                  className={
                    dark
                      ? "mt-3 text-sm leading-relaxed text-white/75"
                      : "mt-3 text-sm leading-relaxed text-muted-foreground"
                  }
                >
                  {c.text}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
