import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type SystemTable = {
  name: string;
  label: string;
  count: number;
  rows: Record<string, string>[];
  error?: string;
};

const TABLES: { name: string; label: string; order?: string }[] = [
  { name: "email_send_log", label: "Journal des emails envoyés", order: "created_at" },
  { name: "suppressed_emails", label: "Emails bloqués (bounces / désinscriptions)", order: "created_at" },
  { name: "email_unsubscribe_tokens", label: "Jetons de désinscription", order: "created_at" },
  { name: "email_send_state", label: "Paramètres d'envoi d'emails" },
  { name: "user_roles", label: "Rôles attribués", order: "created_at" },
  { name: "profiles", label: "Comptes clients", order: "created_at" },
  { name: "orders", label: "Commandes (brut)", order: "created_at" },
  { name: "order_items", label: "Lignes de commande", order: "created_at" },
];

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
    for (const t of TABLES) {
      try {
        const base = admin.from(t.name).select("*", { count: "exact" });
        const q = t.order ? base.order(t.order, { ascending: false }).limit(50) : base.limit(50);
        const { data, count, error } = await q;
        out.push({
          name: t.name,
          label: t.label,
          count: count ?? (Array.isArray(data) ? data.length : 0),
          rows: ((data as Record<string, unknown>[]) ?? []).map(stringify),
          ...(error ? { error: String((error as { message?: string }).message ?? error) } : {}),
        });
      } catch (e) {
        out.push({ name: t.name, label: t.label, count: 0, rows: [], error: (e as Error).message });
      }
    }
    return out;
  });

function stringify(row: Record<string, unknown>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(row)) {
    out[k] = v === null || v === undefined ? "—" : typeof v === "object" ? JSON.stringify(v) : String(v);
  }
  return out;
}

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

/** Colonnes jamais modifiables depuis l'interface. */
export const READONLY_COLUMNS = ["id", "created_at", "updated_at", "user_id", "order_id"];

const EDITABLE_TABLES = new Set(TABLES.map((t) => t.name));

async function assertAdmin(context: { supabase: any; userId: string }) {
  const { data: roles } = await context.supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", context.userId);
  const isAdmin = (roles ?? []).some((r: { role: string }) => r.role === "admin");
  if (!isAdmin) throw new Response("Forbidden", { status: 403 });
}

/** Convertit une valeur saisie en texte vers le type attendu par la base. */
function coerce(value: string): unknown {
  const v = value.trim();
  if (v === "" || v === "—" || v.toLowerCase() === "null") return null;
  if (v === "true") return true;
  if (v === "false") return false;
  if (/^-?\d+(\.\d+)?$/.test(v)) return Number(v);
  if ((v.startsWith("{") && v.endsWith("}")) || (v.startsWith("[") && v.endsWith("]"))) {
    try {
      return JSON.parse(v);
    } catch {
      return v;
    }
  }
  return v;
}

/** Mise à jour d'une ligne d'une table technique (admin uniquement). */
export const updateSystemRow = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { table: string; id: string; patch: Record<string, string> }) => input)
  .handler(async ({ data, context }) => {
    await assertAdmin(context as any);
    if (!EDITABLE_TABLES.has(data.table)) throw new Error("Table non autorisée");

    const patch: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(data.patch)) {
      if (READONLY_COLUMNS.includes(k)) continue;
      patch[k] = coerce(v);
    }
    if (Object.keys(patch).length === 0) return { ok: true };

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await (supabaseAdmin as any).from(data.table).update(patch).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/** Suppression d'une ligne d'une table technique (admin uniquement). */
export const deleteSystemRow = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { table: string; id: string }) => input)
  .handler(async ({ data, context }) => {
    await assertAdmin(context as any);
    if (!EDITABLE_TABLES.has(data.table)) throw new Error("Table non autorisée");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await (supabaseAdmin as any).from(data.table).delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
