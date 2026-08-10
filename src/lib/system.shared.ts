export type SystemTable = {
  name: string;
  label: string;
  count: number;
  rows: Record<string, string>[];
  error?: string;
};

export const SYSTEM_TABLES: { name: string; label: string; order?: string }[] = [
  { name: "email_send_log", label: "Journal des emails envoyés", order: "created_at" },
  { name: "suppressed_emails", label: "Emails bloqués (bounces / désinscriptions)", order: "created_at" },
  { name: "email_unsubscribe_tokens", label: "Jetons de désinscription", order: "created_at" },
  { name: "email_send_state", label: "Paramètres d'envoi d'emails" },
  { name: "user_roles", label: "Rôles attribués", order: "created_at" },
  { name: "profiles", label: "Comptes clients", order: "created_at" },
  { name: "orders", label: "Commandes (brut)", order: "created_at" },
  { name: "order_items", label: "Lignes de commande", order: "created_at" },
];

/** Colonnes jamais modifiables depuis l'interface. */
export const READONLY_COLUMNS = ["id", "created_at", "updated_at", "user_id", "order_id"];

/** Convertit une valeur saisie en texte vers le type attendu par la base. */
export function coerceValue(value: string): unknown {
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

export function stringifyRow(row: Record<string, unknown>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(row)) {
    out[k] = v === null || v === undefined ? "—" : typeof v === "object" ? JSON.stringify(v) : String(v);
  }
  return out;
}
