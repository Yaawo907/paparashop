/** Paramètres modifiables depuis l'admin (priorité base de données, sinon variable d'environnement). */

export const EDITABLE_SETTINGS = [
  { key: "KKIAPAY_PUBLIC_KEY", label: "KKiaPay — clé publique", secret: false },
  { key: "KKIAPAY_PRIVATE_KEY", label: "KKiaPay — clé privée", secret: true },
  { key: "KKIAPAY_SECRET", label: "KKiaPay — secret", secret: true },
  { key: "KKIAPAY_WEBHOOK_SECRET", label: "KKiaPay — secret du webhook", secret: true },

  { key: "ORDER_ALERT_EMAIL", label: "E-mail d'alerte commandes", secret: false },
  { key: "ORDER_ALERT_WHATSAPP", label: "WhatsApp d'alerte commandes", secret: false },
] as const;

export type EditableSettingKey = (typeof EDITABLE_SETTINGS)[number]["key"];

export function isEditableSetting(key: string): key is EditableSettingKey {
  return EDITABLE_SETTINGS.some((s) => s.key === key);
}

/** Masque une valeur sensible pour l'affichage (jamais la valeur complète). */
export function maskValue(value: string, secret: boolean) {
  if (!value) return "";
  if (!secret) return value;
  return `${value.slice(0, 4)}••••${value.slice(-4)}`;
}
