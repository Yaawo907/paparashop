import { useState } from "react";
import { useRows, useSaveRow } from "@/components/admin/useCrud";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type ContentRow = {
  id: string;
  key: string;
  value: Record<string, string>;
};

export function ContentAdmin() {
  const { data: rows = [], isLoading } = useRows<ContentRow>("site_content", "key");
  const save = useSaveRow("site_content");

  if (isLoading) return <p className="text-sm text-muted-foreground">Chargement…</p>;

  return (
    <div className="space-y-6">
      <h2 className="font-display text-xl font-bold text-primary">Textes du site</h2>
      {rows.map((row) => (
        <ContentBlock key={row.id} row={row} onSave={(v) => save.mutate(v)} />
      ))}
    </div>
  );
}

function ContentBlock({
  row,
  onSave,
}: {
  row: ContentRow;
  onSave: (v: Partial<ContentRow>) => void;
}) {
  const [value, setValue] = useState<Record<string, string>>(row.value ?? {});

  return (
    <div className="space-y-4 rounded-xl border border-border bg-card p-4">
      <p className="font-display text-sm font-bold uppercase tracking-wider text-primary">
        {row.key}
      </p>
      {Object.entries(value).map(([field, text]) => (
        <div key={field} className="space-y-2">
          <Label>{field}</Label>
          <Textarea
            rows={2}
            value={text}
            onChange={(e) => setValue((v) => ({ ...v, [field]: e.target.value }))}
          />
        </div>
      ))}
      <Button size="sm" onClick={() => onSave({ id: row.id, value })}>
        Enregistrer
      </Button>
    </div>
  );
}
