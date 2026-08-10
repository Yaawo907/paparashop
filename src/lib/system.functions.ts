import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type SystemTable = {
  name: string;
  label: string;
  count: number;
  rows: Record<string, unknown>[];
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
          rows: (data as Record<string, unknown>[]) ?? [],
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
