import { Check, Trash2, X } from "lucide-react";
import type { CmsTestimonial } from "@/lib/cms-types";
import { useDeleteRow, useRows, useSaveRow } from "@/components/admin/useCrud";
import { Button } from "@/components/ui/button";

export function TestimonialsAdmin() {
  const { data: items = [], isLoading } = useRows<CmsTestimonial>("testimonials", "created_at");
  const save = useSaveRow("testimonials");
  const remove = useDeleteRow("testimonials");

  if (isLoading) return <p className="text-sm text-muted-foreground">Chargement…</p>;

  return (
    <div className="space-y-6">
      <h2 className="font-display text-xl font-bold text-primary">Témoignages</h2>
      <div className="space-y-3">
        {items.length === 0 && (
          <p className="text-sm text-muted-foreground">Aucun témoignage pour le moment.</p>
        )}
        {items.map((t) => (
          <div
            key={t.id}
            className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-start"
          >
            <div className="flex-1">
              <p className="font-semibold text-primary">
                {t.name}{" "}
                <span className="text-xs font-normal text-muted-foreground">
                  {t.role} — {t.location} · {t.rating}/5
                </span>
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{t.content}</p>
              <p className="mt-1 text-xs">
                {t.is_approved ? (
                  <span className="text-emerald-600">Publié</span>
                ) : (
                  <span className="text-amber-600">En attente de modération</span>
                )}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={t.is_approved ? "outline" : "default"}
                onClick={() => save.mutate({ id: t.id, is_approved: !t.is_approved })}
              >
                {t.is_approved ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => {
                  if (confirm("Supprimer ce témoignage ?")) remove.mutate(t.id);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
