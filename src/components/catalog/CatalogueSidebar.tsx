import { useEffect, useState } from "react";
import { List } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { Category } from "@/lib/catalog";

type CatalogueSidebarProps = {
  categories: Category[];
  className?: string;
};

function CategoryList({
  categories,
  activeSlug,
  onSelect,
}: {
  categories: Category[];
  activeSlug: string | null;
  onSelect: (slug: string) => void;
}) {
  return (
    <nav aria-label="Catégories du catalogue">
      <ul className="space-y-1">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const active = activeSlug === cat.slug;
          return (
            <li key={cat.slug}>
              <button
                type="button"
                onClick={() => onSelect(cat.slug)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors",
                  active
                    ? "bg-primary/10 font-semibold text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                <span className="line-clamp-1">{cat.title}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function CatalogueSidebar({ categories, className }: CatalogueSidebarProps) {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) return;

    const sections = categories
      .map((c) => document.getElementById(c.slug))
      .filter(Boolean) as HTMLElement[];

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length > 0) {
          setActiveSlug(visible[0].target.id);
        }
      },
      {
        rootMargin: "-20% 0px -60% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [categories]);

  const scrollTo = (slug: string) => {
    const el = document.getElementById(slug);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setOpen(false);
  };

  return (
    <>
      {/* Mobile / tablet: floating trigger that opens a sheet */}
      <div className="lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              size="sm"
              className="fixed bottom-6 right-6 z-50 rounded-full shadow-lg"
              aria-label="Ouvrir la navigation des catégories"
            >
              <List className="h-4 w-4" />
              <span className="ml-2">Catégories</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] p-4">
            <SheetHeader className="mb-4">
              <SheetTitle>Navigation</SheetTitle>
            </SheetHeader>
            <CategoryList categories={categories} activeSlug={activeSlug} onSelect={scrollTo} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop: sticky sidebar */}
      <aside
        className={cn(
          "sticky top-28 z-30 hidden self-start lg:block",
          className,
        )}
      >
        <div className="max-h-[calc(100vh-8rem)] overflow-y-auto rounded-xl border border-border bg-white p-4 shadow-lg">
          <p className="mb-3 font-display text-xs font-semibold uppercase tracking-widest text-primary">
            Navigation
          </p>
          <CategoryList categories={categories} activeSlug={activeSlug} onSelect={scrollTo} />
        </div>
      </aside>
    </>
  );
}
