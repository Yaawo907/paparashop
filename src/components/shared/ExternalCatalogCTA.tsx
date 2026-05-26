import { ArrowUpRight } from "lucide-react";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

export function ExternalCatalogCTA({
  label = "Voir le catalogue complet",
  variant = "accent",
  className,
}: {
  label?: string;
  variant?: "accent" | "outline";
  className?: string;
}) {
  return (
    <a
      href={SITE.catalogUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center gap-2 rounded-md px-7 py-3 font-display text-sm font-semibold tracking-wide transition-all hover:-translate-y-0.5",
        variant === "accent"
          ? "bg-accent text-primary shadow-lg shadow-accent/30 hover:shadow-xl hover:shadow-accent/40"
          : "border-2 border-accent text-accent hover:bg-accent hover:text-primary",
        className,
      )}
    >
      {label}
      <ArrowUpRight className="h-4 w-4" />
    </a>
  );
}
