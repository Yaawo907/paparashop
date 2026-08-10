import { isEditableSetting } from "@/lib/app-settings.shared";

type Row = { key: string; value: string };

let cache: { at: number; map: Record<string, string> } | null = null;
const TTL_MS = 30_000;

async function loadAll(): Promise<Record<string, string>> {
  if (cache && Date.now() - cache.at < TTL_MS) return cache.map;
  const map: Record<string, string> = {};
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data } = await (supabaseAdmin as unknown as {
      from: (t: string) => { select: (s: string) => Promise<{ data: Row[] | null }> };
    })
      .from("app_settings")
      .select("key, value");
    for (const r of data ?? []) map[r.key] = r.value;
  } catch (err) {
    console.error("[app-settings] lecture impossible", err);
  }
  cache = { at: Date.now(), map };
  return map;
}

/** Invalide le cache après une écriture. */
export function invalidateSettingsCache() {
  cache = null;
}

/** Valeur d'un paramètre : base de données en priorité, sinon variable d'environnement. */
export async function getSetting(key: string): Promise<string> {
  const fallback = (process.env[key] ?? "").trim();
  if (!isEditableSetting(key)) return fallback;
  const map = await loadAll();
  const dbValue = (map[key] ?? "").trim();
  return dbValue || fallback;
}
