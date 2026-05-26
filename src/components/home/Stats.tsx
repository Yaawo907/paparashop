import { Users, Camera, Award } from "lucide-react";

const stats = [
  { icon: Users, value: "5 105+", label: "Clients satisfaits" },
  { icon: Camera, value: "Studio", label: "Photo équipé" },
  { icon: Award, value: "Pro", label: "Matériel haut de gamme" },
];

export function Stats() {
  return (
    <section className="bg-primary py-16">
      <div className="mx-auto grid max-w-5xl gap-8 px-4 sm:grid-cols-3 sm:px-6 lg:px-8">
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
