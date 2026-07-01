import { Users, Globe2, Award, Calendar } from "lucide-react";
import { SITE } from "@/lib/site";

const years = new Date().getFullYear() - SITE.foundedYear;

const stats = [
  { icon: Calendar, value: `${years}+`, label: "Années d'expertise" },
  { icon: Globe2, value: "3 pays", label: "Bénin • Burkina • Togo" },
  { icon: Users, value: "5 000+", label: "Clients accompagnés" },
  { icon: Award, value: "2 ans", label: "Garantie maximale" },
];

export function Stats() {
  return (
    <section className="bg-primary py-16">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:grid-cols-2 lg:grid-cols-4 sm:px-6 lg:px-8">
        {stats.map(({ icon: Icon, value, label }) => (
          <div key={label} className="flex flex-col items-center text-center text-white">
            <Icon className="mb-3 h-8 w-8 text-accent" strokeWidth={1.75} />
            <div className="font-display text-3xl font-bold text-accent sm:text-4xl">{value}</div>
            <div className="mt-1 text-sm uppercase tracking-wider text-white/75">{label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
