import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Search, ArrowUpRight, X, Package, Tag, Layers, Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { buildIndex, searchAll, type SearchResult } from "@/lib/search";
import { categoriesQuery, productsQuery } from "@/lib/cms.queries";
import { toCategories, toFeatured } from "@/lib/cms-adapters";
import { cn } from "@/lib/utils";

const KIND_META: Record<
  SearchResult["kind"],
  { label: string; icon: typeof Package }
> = {
  product: { label: "Produit vedette", icon: Sparkles },
  model: { label: "Modèle", icon: Package },
  brand: { label: "Marque", icon: Tag },
  category: { label: "Catégorie", icon: Layers },
};

type Props = {
  className?: string;
  compact?: boolean;
  variant?: "dark" | "light";
};

export function GlobalSearch({ className, compact = false, variant = "dark" }: Props) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const { data: cmsCategories } = useQuery(categoriesQuery);
  const { data: cmsProducts } = useQuery(productsQuery);
  const index = useMemo(() => {
    const featured = ["new", "bestseller", "offer", "accessory"].flatMap((g) =>
      toFeatured(cmsProducts ?? [], g).map((item) => ({ item })),
    );
    return buildIndex(toCategories(cmsCategories ?? []), featured);
  }, [cmsCategories, cmsProducts]);
  const results = useMemo(() => searchAll(index, query, 40), [index, query]);
  const open = focused && query.trim().length > 0;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "Escape") setFocused(false);
    };
    const onClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setFocused(false);
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, []);

  const close = () => {
    setFocused(false);
    setQuery("");
  };

  const handleInternal = (to: string) => {
    close();
    const [path, hash] = to.split("#");
    navigate({ to: path, hash: hash || undefined });
  };

  return (
    <div ref={containerRef} className={cn("relative", compact ? "w-40 sm:w-56 lg:w-72" : "w-full", className)}>
      <div className="flex items-center gap-2 rounded-md border border-white/20 bg-white/10 px-3 focus-within:border-accent">
        <Search className="h-4 w-4 shrink-0 text-white/70" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          aria-label="Rechercher un article"
          placeholder="Rechercher un produit…"
          className="h-9 w-full bg-transparent text-sm text-white outline-none placeholder:text-white/60"
        />
        {query && (
          <button
            type="button"
            onClick={close}
            aria-label="Effacer"
            className="rounded p-1 text-white/70 hover:text-white"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-[min(90vw,32rem)] overflow-hidden rounded-lg border border-border bg-popover shadow-xl">
          <div className="max-h-[60vh] overflow-y-auto">
            {results.length === 0 && (
              <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                Aucun résultat pour <span className="font-medium">« {query} »</span>.
                <div className="mt-3">
                  <Link
                    to="/catalogue"
                    onClick={close}
                    className="text-primary underline underline-offset-4 hover:text-accent-foreground"
                  >
                    Parcourir tout le catalogue
                  </Link>
                </div>
              </div>
            )}

            {results.length > 0 && (
              <ul className="divide-y divide-border">
                {results.map((r) => {
                  const Icon = KIND_META[r.kind].icon;
                  const content = (
                    <>
                      {r.image ? (
                        <img
                          src={r.image}
                          alt=""
                          className="h-10 w-10 shrink-0 rounded-md object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                          <Icon className="h-4 w-4" />
                        </span>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-display text-sm font-semibold text-primary">
                          {r.title}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          <span className="font-medium text-accent-foreground/70">
                            {KIND_META[r.kind].label}
                          </span>{" "}
                          · {r.subtitle}
                        </p>
                      </div>
                      {r.url ? (
                        <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                      ) : null}
                    </>
                  );

                  const baseCls =
                    "flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-secondary/60";

                  if (r.url) {
                    return (
                      <li key={r.id}>
                        <a
                          href={r.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={close}
                          className={baseCls}
                        >
                          {content}
                        </a>
                      </li>
                    );
                  }

                  return (
                    <li key={r.id}>
                      <button
                        type="button"
                        onClick={() => r.to && handleInternal(r.to)}
                        className={baseCls}
                      >
                        {content}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
