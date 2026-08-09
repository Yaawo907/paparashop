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
  | "site_content";

type Row = Record<string, unknown> & { id?: string };

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
  return useMutation({
    mutationFn: async (row: Row) => {
      const { id, ...rest } = row;
      const { error } = id
        ? await db.from(table).update(rest).eq("id", id)
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
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await db.from(table).delete().eq("id", id);
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
