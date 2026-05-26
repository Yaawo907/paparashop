import { cn } from "@/lib/utils";

export function SectionTitle({
  eyebrow,
  title,
  subtitle,
  invert = false,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  invert?: boolean;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mb-12",
        align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl",
        className,
      )}
    >
      {eyebrow && (
        <p
          className={cn(
            "mb-3 font-display text-xs font-semibold uppercase tracking-[0.3em]",
            invert ? "text-accent" : "text-primary",
          )}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          "font-display text-3xl font-bold sm:text-4xl md:text-5xl",
          invert ? "text-white" : "text-foreground",
        )}
      >
        {title}
      </h2>
      <div
        className={cn(
          "mt-5 h-1 w-16 rounded-full",
          align === "center" && "mx-auto",
          invert ? "bg-accent" : "bg-primary",
        )}
      />
      {subtitle && (
        <p
          className={cn(
            "mt-6 text-base leading-relaxed",
            invert ? "text-white/75" : "text-muted-foreground",
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
