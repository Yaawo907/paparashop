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
        <div className="grid gap-5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
          {INSTITUTIONAL_CLIENTS.map((c) => (
            <article
              key={c.name}
              className="group flex flex-col items-center rounded-xl border-2 border-primary/15 bg-white p-6 text-center transition-all hover:-translate-y-1 hover:border-accent hover:shadow-lg"
              title={c.name}
            >
              <div className="flex h-20 w-full items-center justify-center">
                <img
                  src={c.logo}
                  alt={`Logo ${c.name}`}
                  loading="lazy"
                  className="max-h-16 w-auto object-contain"
                />
              </div>
              <p className="mt-4 font-display text-sm font-bold uppercase tracking-wide text-primary">
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
