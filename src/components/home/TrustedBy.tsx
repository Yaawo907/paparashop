import { SectionTitle } from "@/components/shared/SectionTitle";

const brands = [
  { name: "Canon", domain: "canon.com" },
  { name: "Nikon", domain: "nikon.com" },
  { name: "Sony", domain: "sony.com" },
  { name: "Fujifilm", domain: "fujifilm.com" },
  { name: "Panasonic", domain: "panasonic.com" },
  { name: "Sigma", domain: "sigma-global.com" },
  { name: "GoPro", domain: "gopro.com" },
  { name: "DJI", domain: "dji.com" },
  { name: "Ulanzi", domain: "ulanzi.com" },
  { name: "Godox", domain: "godox.com" },
];

export function TrustedBy() {
  return (
    <section className="bg-secondary/30 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Partenaires"
          title="Ils nous font confiance"
        />

        <div className="relative overflow-hidden">
          {/* Edge fade */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-secondary/60 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-secondary/60 to-transparent" />

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
            {brands.map((b) => (
              <div
                key={b.name}
                className="group flex aspect-[3/2] items-center justify-center rounded-xl border border-border bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
                title={b.name}
              >
                <img
                  src={`https://logo.clearbit.com/${b.domain}?size=200`}
                  alt={`Logo ${b.name}`}
                  loading="lazy"
                  width={160}
                  height={80}
                  className="max-h-12 w-auto object-contain opacity-70 grayscale transition-all duration-300 group-hover:opacity-100 group-hover:grayscale-0"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.style.display = "none";
                    const fallback = target.nextElementSibling as HTMLElement | null;
                    if (fallback) fallback.style.display = "block";
                  }}
                />
                <span
                  className="hidden font-display text-sm font-bold text-primary"
                  aria-hidden="true"
                >
                  {b.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
