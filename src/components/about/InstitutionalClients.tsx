import { Building2 } from "lucide-react";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { INSTITUTIONAL_CLIENTS } from "@/lib/site";

export function InstitutionalClients() {
  return (
    <section className="bg-secondary/40 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Ils nous ont fait confiance"
          title="Nos références institutionnelles"
          subtitle="Des entreprises, ONG et institutions qui équipent leurs équipes chez PaparaShop."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {INSTITUTIONAL_CLIENTS.map((c) => (
            <article
              key={c.name}
              className="group flex flex-col items-center rounded-xl border-2 border-primary/15 bg-white p-6 text-center transition-all hover:-translate-y-1 hover:border-accent hover:shadow-lg"
            >
              <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-accent/20">
                <Building2 className="h-6 w-6" strokeWidth={1.75} />
              </span>
              <p className="font-display text-sm font-bold uppercase tracking-wide text-primary">
                {c.name}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{c.sector}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
