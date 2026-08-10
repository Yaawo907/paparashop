import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  READONLY_COLUMNS,
  SYSTEM_TABLES,
  coerceValue,
  stringifyRow,
  type SystemTable,
} from "@/lib/system.shared";

export type { SystemTable };

/** Lecture des tables techniques, réservée aux administrateurs. Aucune valeur de secret n'est renvoyée. */
export const getSystemTables = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<SystemTable[]> => {
    const { data: roles } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId);
    const isAdmin = (roles ?? []).some((r: { role: string }) => r.role === "admin");
    if (!isAdmin) throw new Response("Forbidden", { status: 403 });

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const admin = supabaseAdmin as unknown as {
      from: (t: string) => {
        select: (
          s: string,
          o?: { count?: "exact" },
        ) => {
          order: (
            c: string,
            o?: { ascending?: boolean },
          ) => {
            limit: (n: number) => Promise<{ data: unknown; count: number | null; error: unknown }>;
          };
          limit: (n: number) => Promise<{ data: unknown; count: number | null; error: unknown }>;
        };
      };
    };

    const out: SystemTable[] = [];
    for (const t of SYSTEM_TABLES) {
      try {
        const base = admin.from(t.name).select("*", { count: "exact" });
        const q = t.order ? base.order(t.order, { ascending: false }).limit(50) : base.limit(50);
        const { data, count, error } = await q;
        out.push({
          name: t.name,
          label: t.label,
          count: count ?? (Array.isArray(data) ? data.length : 0),
          rows: ((data as Record<string, unknown>[]) ?? []).map(stringifyRow),
          ...(error ? { error: String((error as { message?: string }).message ?? error) } : {}),
        });
      } catch (e) {
        out.push({ name: t.name, label: t.label, count: 0, rows: [], error: (e as Error).message });
      }
    }
    return out;
  });

/** Liste des noms de secrets configurés (jamais les valeurs). */
export const getSecretNames = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<string[]> => {
    const { data: roles } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId);
    const isAdmin = (roles ?? []).some((r: { role: string }) => r.role === "admin");
    if (!isAdmin) throw new Response("Forbidden", { status: 403 });

    const known = [
      "KKIAPAY_PUBLIC_KEY",
      "KKIAPAY_PRIVATE_KEY",
      "KKIAPAY_SECRET",
      "ORDER_ALERT_EMAIL",
      "ORDER_ALERT_WHATSAPP",
      "LOVABLE_API_KEY",
      "SUPABASE_URL",
      "SUPABASE_ANON_KEY",
      "SUPABASE_SERVICE_ROLE_KEY",
      "SUPABASE_DB_URL",
    ];
    return known.filter((k) => Boolean(process.env[k]));
  });

/** Mise à jour d'une ligne d'une table technique (admin uniquement). */
export const updateSystemRow = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { table: string; id: string; patch: Record<string, string> }) => input)
  .handler(async ({ data, context }) => {
    const { data: roles } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId);
    if (!(roles ?? []).some((r: { role: string }) => r.role === "admin")) {
      throw new Response("Forbidden", { status: 403 });
    }
    if (!SYSTEM_TABLES.some((t) => t.name === data.table)) throw new Error("Table non autorisée");

    const patch: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(data.patch)) {
      if (READONLY_COLUMNS.includes(k)) continue;
      patch[k] = coerceValue(v);
    }
    if (Object.keys(patch).length === 0) return { ok: true };

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await (supabaseAdmin as unknown as {
      from: (t: string) => {
        update: (p: Record<string, unknown>) => {
          eq: (c: string, v: string) => Promise<{ error: { message: string } | null }>;
        };
      };
    })
      .from(data.table)
      .update(patch)
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/** Suppression d'une ligne d'une table technique (admin uniquement). */
export const deleteSystemRow = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { table: string; id: string }) => input)
  .handler(async ({ data, context }) => {
    const { data: roles } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId);
    if (!(roles ?? []).some((r: { role: string }) => r.role === "admin")) {
      throw new Response("Forbidden", { status: 403 });
    }
    if (!SYSTEM_TABLES.some((t) => t.name === data.table)) throw new Error("Table non autorisée");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await (supabaseAdmin as unknown as {
      from: (t: string) => {
        delete: () => { eq: (c: string, v: string) => Promise<{ error: { message: string } | null }> };
      };
    })
      .from(data.table)
      .delete()
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
