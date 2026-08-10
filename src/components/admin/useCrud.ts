/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export type CrudTable =
  | "categories"
  | "brands"
  | "products"
  | "promotions"
  | "testimonials"
  | "site_content"
  | "hero_slides"
  | "trusted_clients";

type Row = Record<string, unknown> & { id?: string };

/** Certaines tables n'ont pas de colonne "id" : leur clé primaire est différente. */
const PRIMARY_KEY: Partial<Record<CrudTable, string>> = {
  site_content: "key",
};

function pkOf(table: CrudTable) {
  return PRIMARY_KEY[table] ?? "id";
}

const db = supabase as unknown as { from: (table: string) => any };

export function useRows<T extends Row>(table: CrudTable, orderBy = "position") {
  return useQuery({
    queryKey: ["admin", table],
    queryFn: async () => {
      const { data, error } = await db.from(table).select("*").order(orderBy);
      if (error) throw error;
      return (data ?? []) as T[];
    },
  });
}

export function useSaveRow(table: CrudTable) {
  const qc = useQueryClient();
  const pk = pkOf(table);
  return useMutation({
    mutationFn: async (row: Row) => {
      const keyValue = row[pk] as string | undefined;
      const rest = { ...row };
      delete rest[pk];
      const { error } = keyValue
        ? await db.from(table).update(rest).eq(pk, keyValue)
        : await db.from(table).insert(rest);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Enregistré");
      qc.invalidateQueries({ queryKey: ["admin", table] });
      qc.invalidateQueries({ queryKey: ["cms"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useDeleteRow(table: CrudTable) {
  const qc = useQueryClient();
  const pk = pkOf(table);
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await db.from(table).delete().eq(pk, id);
      if (error) throw error;
    },

    onSuccess: () => {
      toast.success("Supprimé");
      qc.invalidateQueries({ queryKey: ["admin", table] });
      qc.invalidateQueries({ queryKey: ["cms"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });
}
