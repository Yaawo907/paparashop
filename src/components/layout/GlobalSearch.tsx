import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Search, ArrowUpRight, X, Package, Tag, Layers, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { searchAll, type SearchResult } from "@/lib/search";
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
  triggerClassName?: string;
  compact?: boolean;
};

export function GlobalSearch({ triggerClassName, compact = false }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const results = useMemo(() => searchAll(query, 40), [query]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const handleInternal = (to: string) => {
    setOpen(false);
    const [path, hash] = to.split("#");
    navigate({ to: path, hash: hash || undefined });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Rechercher un article"
        className={cn(
          "inline-flex items-center gap-2 rounded-md text-white/85 transition-colors hover:text-accent",
          compact ? "p-2" : "px-3 py-2",
          triggerClassName,
        )}
      >
        <Search className="h-5 w-5" strokeWidth={2} />
        {!compact && (
          <>
            <span className="hidden text-sm font-medium xl:inline">Rechercher…</span>
            <span className="hidden rounded border border-white/20 px-1.5 py-0.5 font-mono text-[10px] text-white/60 xl:inline">
              Ctrl K
            </span>
          </>
        )}
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl gap-0 overflow-hidden p-0">
          <DialogTitle className="sr-only">Recherche globale</DialogTitle>
          <DialogDescription className="sr-only">
            Rechercher un produit, une marque ou une catégorie sur PaparaShop
          </DialogDescription>

          <div className="flex items-center gap-2 border-b px-4">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un produit, une marque, une catégorie…"
              className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Effacer"
                className="rounded p-1 text-muted-foreground hover:bg-secondary"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="max-h-[60vh] overflow-y-auto">
            {!query && (
              <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                Tapez le nom d'un boîtier, d'une marque (Canon, Sony, RØDE…) ou d'une catégorie.
              </div>
            )}

            {query && results.length === 0 && (
              <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                Aucun résultat pour <span className="font-medium">« {query} »</span>.
                <div className="mt-3">
                  <Link
                    to="/catalogue"
                    onClick={() => setOpen(false)}
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
                          className="h-12 w-12 shrink-0 rounded-md object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                          <Icon className="h-5 w-5" />
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
                    "flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-secondary/60";

                  if (r.url) {
                    return (
                      <li key={r.id}>
                        <a
                          href={r.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setOpen(false)}
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

          <div className="border-t bg-secondary/40 px-4 py-2 text-[11px] text-muted-foreground">
            Astuce : ouvrez la recherche avec{" "}
            <kbd className="rounded border bg-background px-1 py-0.5 font-mono">Ctrl</kbd> +{" "}
            <kbd className="rounded border bg-background px-1 py-0.5 font-mono">K</kbd>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
