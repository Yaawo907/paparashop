import { useQuery } from "@tanstack/react-query";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { trustedClientsQuery } from "@/lib/cms.queries";

export function TrustedBy() {
  const { data: clients = [] } = useQuery(trustedClientsQuery);

  if (clients.length === 0) return null;

  return (
    <section className="bg-secondary/30 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Nos clients"
          title="Ils nous font confiance"
          subtitle="Entreprises, ONG et institutions qui équipent leurs équipes chez PaparaShop."
        />

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {clients.map((c) => {
            const card = (
              <div
                className="group flex aspect-[3/2] items-center justify-center rounded-xl border border-border bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
                title={c.url ? `${c.name} — ${c.url}` : c.name}
              >
                {c.logo_url && (
                  <img
                    src={c.logo_url}
                    alt={`Logo ${c.name}`}
                    loading="lazy"
                    className="max-h-16 w-auto object-contain transition-all duration-300 group-hover:scale-105"
                  />
                )}
              </div>
            );
            return c.url ? (
              <a key={c.id} href={c.url} target="_blank" rel="noopener noreferrer">
                {card}
              </a>
            ) : (
              <div key={c.id}>{card}</div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
