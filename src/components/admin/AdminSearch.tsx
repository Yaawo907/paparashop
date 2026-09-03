import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function AdminSearch({
  value,
  onChange,
  placeholder,
  count,
  noun = "élément",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  count: number;
  noun?: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative w-full sm:max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="pl-9"
        />
      </div>
      <p className="text-xs text-muted-foreground">
        {count} {noun}
        {count > 1 ? "s" : ""}
      </p>
    </div>
  );
}
