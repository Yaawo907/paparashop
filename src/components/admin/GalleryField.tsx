import { Plus, X } from "lucide-react";
import { ImageField } from "@/components/admin/ImageField";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

/** Galerie d'images supplémentaires (style Alibaba : plusieurs visuels par article). */
export function GalleryField({
  value,
  onChange,
  folder = "products",
  min = 3,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  folder?: string;
  min?: number;
}) {
  const items = value.length ? value : Array.from({ length: min }, () => "");

  const setAt = (i: number, url: string) => {
    const next = [...items];
    next[i] = url;
    onChange(next);
  };

  return (
    <div className="space-y-3 rounded-xl border border-dashed border-border p-3">
      <div className="flex items-center justify-between">
        <Label>Images supplémentaires ({items.filter(Boolean).length})</Label>
        <Button type="button" size="sm" variant="outline" onClick={() => onChange([...items, ""])}>
          <Plus className="mr-1 h-4 w-4" /> Ajouter une image
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Prévoyez au moins {min} visuels (angles, détails, contenu de la boîte).
      </p>
      {items.map((url, i) => (
        <div key={i} className="flex items-start gap-2">
          <div className="flex-1">
            <ImageField
              label={`Image ${i + 2}`}
              folder={folder}
              value={url}
              onChange={(u) => setAt(i, u)}
            />
          </div>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="mt-7"
            onClick={() => onChange(items.filter((_, j) => j !== i))}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}
