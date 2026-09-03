import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  ChevronsUpDown,
  Download,
  Eye,
  EyeOff,
  Search,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

export type AdminColumn<T> = {
  /** Identifiant unique de la colonne. */
  key: string;
  header: string;
  /** Valeur brute : sert au tri et à l'export CSV. */
  value?: (row: T) => string | number | null | undefined;
  /** Rendu personnalisé (sinon la valeur brute est affichée). */
  render?: (row: T) => ReactNode;
  /** Classe appliquée aux cellules (utile pour masquer en mobile). */
  className?: string;
  sortable?: boolean;
};

type Props<T> = {
  rows: T[];
  columns: AdminColumn<T>[];
  getId: (row: T) => string;
  /** Champs pris en compte par la recherche. */
  searchFields: (row: T) => (string | number | null | undefined)[];
  searchPlaceholder?: string;
  noun?: string;
  renderExpanded: (row: T) => ReactNode;
  /** Actions en lot facultatives. */
  onBulkVisibility?: (ids: string[], visible: boolean) => void;
  onBulkDelete?: (ids: string[]) => void;
  csvName?: string;
  pageSize?: number;
  /** Filtres additionnels affichés à côté de la recherche. */
  toolbar?: ReactNode;
  emptyLabel?: string;
};

function toCsvCell(v: unknown) {
  const s = v === null || v === undefined ? "" : String(v);
  return `"${s.replace(/"/g, '""')}"`;
}

export function AdminDataTable<T>({
  rows,
  columns,
  getId,
  searchFields,
  searchPlaceholder = "Rechercher…",
  noun = "élément",
  renderExpanded,
  onBulkVisibility,
  onBulkDelete,
  csvName = "export",
  pageSize = 20,
  toolbar,
  emptyLabel = "Aucun résultat ne correspond à la recherche.",
}: Props<T>) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [openId, setOpenId] = useState<string | null>(null);
  const [selected, setSelected] = useState<string[]>([]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) =>
      searchFields(r).some((v) => (v === null || v === undefined ? false : String(v).toLowerCase().includes(q))),
    );
  }, [rows, search, searchFields]);

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    const col = columns.find((c) => c.key === sortKey);
    if (!col?.value) return filtered;
    const dir = sortDir === "asc" ? 1 : -1;
    return [...filtered].sort((a, b) => {
      const av = col.value!(a);
      const bv = col.value!(b);
      if (typeof av === "number" && typeof bv === "number") return (av - bv) * dir;
      return String(av ?? "").localeCompare(String(bv ?? ""), "fr", { numeric: true }) * dir;
    });
  }, [filtered, sortKey, sortDir, columns]);

  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
  useEffect(() => {
    setPage(1);
  }, [search, sortKey, sortDir, rows.length]);
  const current = Math.min(page, pageCount);
  const visible = sorted.slice((current - 1) * pageSize, current * pageSize);
  const visibleIds = visible.map(getId);
  const allChecked = visibleIds.length > 0 && visibleIds.every((id) => selected.includes(id));

  const toggleSort = (key: string) => {
    if (sortKey === key) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const exportCsv = () => {
    const source = selected.length
      ? sorted.filter((r) => selected.includes(getId(r)))
      : sorted;
    const header = columns.map((c) => toCsvCell(c.header)).join(";");
    const lines = source.map((r) =>
      columns.map((c) => toCsvCell(c.value ? c.value(r) : "")).join(";"),
    );
    const blob = new Blob(["\ufeff" + [header, ...lines].join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${csvName}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {toolbar}
        <Button variant="outline" size="sm" onClick={exportCsv}>
          <Download className="mr-1 h-4 w-4" /> CSV
        </Button>
      </div>

      {selected.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-3 py-2">
          <span className="text-xs font-semibold text-primary">
            {selected.length} sélectionné{selected.length > 1 ? "s" : ""}
          </span>
          {onBulkVisibility && (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onBulkVisibility(selected, true)}
              >
                <Eye className="mr-1 h-4 w-4" /> Afficher
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onBulkVisibility(selected, false)}
              >
                <EyeOff className="mr-1 h-4 w-4" /> Masquer
              </Button>
            </>
          )}
          {onBulkDelete && (
            <Button
              size="sm"
              variant="destructive"
              onClick={() => {
                if (confirm(`Supprimer ${selected.length} ${noun}(s) ?`)) {
                  onBulkDelete(selected);
                  setSelected([]);
                }
              }}
            >
              <Trash2 className="mr-1 h-4 w-4" /> Supprimer
            </Button>
          )}
          <Button size="sm" variant="ghost" onClick={() => setSelected([])}>
            Annuler
          </Button>
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/50 text-left text-xs text-muted-foreground">
              <th className="w-8 px-2 py-2">
                <Checkbox
                  checked={allChecked}
                  onCheckedChange={(v) =>
                    setSelected((s) =>
                      v
                        ? Array.from(new Set([...s, ...visibleIds]))
                        : s.filter((id) => !visibleIds.includes(id)),
                    )
                  }
                  aria-label="Tout sélectionner"
                />
              </th>
              <th className="w-8 px-2 py-2" />
              {columns.map((c) => (
                <th key={c.key} className={cn("px-3 py-2", c.className)}>
                  {c.sortable !== false && c.value ? (
                    <button
                      type="button"
                      onClick={() => toggleSort(c.key)}
                      className="inline-flex items-center gap-1 hover:text-primary"
                    >
                      {c.header}
                      {sortKey === c.key ? (
                        sortDir === "asc" ? (
                          <ArrowUp className="h-3 w-3" />
                        ) : (
                          <ArrowDown className="h-3 w-3" />
                        )
                      ) : (
                        <ChevronsUpDown className="h-3 w-3 opacity-50" />
                      )}
                    </button>
                  ) : (
                    c.header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length + 2}
                  className="px-3 py-8 text-center text-muted-foreground"
                >
                  {emptyLabel}
                </td>
              </tr>
            )}
            {visible.map((row) => {
              const id = getId(row);
              const open = openId === id;
              return (
                <>
                  <tr
                    key={id}
                    className="cursor-pointer border-b border-border transition-colors hover:bg-secondary/40"
                    onClick={() => setOpenId(open ? null : id)}
                  >
                    <td className="px-2 py-2" onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selected.includes(id)}
                        onCheckedChange={(v) =>
                          setSelected((s) => (v ? [...s, id] : s.filter((x) => x !== id)))
                        }
                        aria-label="Sélectionner la ligne"
                      />
                    </td>
                    <td className="px-2 py-2 text-muted-foreground">
                      {open ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </td>
                    {columns.map((c) => (
                      <td key={c.key} className={cn("px-3 py-2", c.className)}>
                        {c.render ? c.render(row) : (c.value?.(row) ?? "—")}
                      </td>
                    ))}
                  </tr>
                  {open && (
                    <tr key={`${id}-x`} className="border-b border-border bg-secondary/20">
                      <td colSpan={columns.length + 2} className="px-3 py-4">
                        {renderExpanded(row)}
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          {sorted.length} {noun}
          {sorted.length > 1 ? "s" : ""} · page {current}/{pageCount}
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={current <= 1}
            onClick={() => setPage(current - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={current >= pageCount}
            onClick={() => setPage(current + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
