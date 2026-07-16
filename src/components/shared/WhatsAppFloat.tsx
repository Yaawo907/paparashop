// ============================================================
// FICHIER : src/components/shared/WhatsAppFloat.tsx
// Bouton WhatsApp flottant, visible sur toutes les pages.
// Au clic, affiche un sélecteur des 3 boutiques (Bénin, Burkina, Togo).
// ============================================================
import { useState } from "react";
import { LOCATIONS } from "@/lib/site";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Message pré-rempli quand le client clique (modifiable librement)
const PREFILLED_MESSAGE =
  "Bonjour PaparaShop, je vous contacte depuis votre site web. J'aimerais avoir des informations sur un produit.";

// Icône officielle WhatsApp (lucide-react ne fournit pas les logos de marques)
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="currentColor" className={className} aria-hidden="true">
      <path d="M16.02 3C9.4 3 4.02 8.37 4.02 15c0 2.11.55 4.17 1.6 5.99L4 29l8.2-1.56A11.9 11.9 0 0 0 16.02 27C22.64 27 28 21.63 28 15S22.64 3 16.02 3Zm0 21.82c-1.78 0-3.52-.47-5.04-1.37l-.36-.21-4.87.93.98-4.74-.24-.38A9.7 9.7 0 0 1 6.2 15c0-5.42 4.4-9.82 9.82-9.82 5.4 0 9.8 4.4 9.8 9.82 0 5.42-4.4 9.82-9.8 9.82Zm5.38-7.35c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.66.15-.2.29-.76.95-.93 1.15-.17.2-.34.22-.64.07-.29-.15-1.24-.46-2.37-1.46-.87-.78-1.46-1.74-1.64-2.03-.17-.3-.02-.45.13-.6.14-.13.3-.34.44-.51.15-.17.2-.3.3-.49.1-.2.05-.37-.03-.52-.07-.15-.66-1.58-.9-2.17-.24-.57-.48-.5-.66-.5h-.56c-.2 0-.51.07-.78.36-.27.3-1.02 1-1.02 2.43s1.05 2.82 1.2 3.01c.14.2 2.06 3.15 5 4.42.7.3 1.24.48 1.67.62.7.22 1.34.19 1.84.11.56-.08 1.75-.71 2-1.4.24-.7.24-1.29.17-1.41-.07-.13-.27-.2-.56-.35Z" />
    </svg>
  );
}

// Emoji drapeau à partir du code pays ISO (BJ, BF, TG…)
function flagEmoji(code: string) {
  return code
    .toUpperCase()
    .replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0)));
}

function waLink(number: string) {
  const digits = number.replace(/[^0-9]/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(PREFILLED_MESSAGE)}`;
}

type ShopOption = {
  key: string;
  country: string;
  countryCode: string;
  city: string;
  label: string;
  href: string;
};

export function WhatsAppFloat() {
  const [open, setOpen] = useState(false);

  // Une entrée par numéro WhatsApp disponible (Bénin en a deux)
  const options: ShopOption[] = LOCATIONS.flatMap((loc) => {
    const list: ShopOption[] = [];
    if (loc.whatsapp) {
      list.push({
        key: `${loc.slug}-1`,
        country: loc.country,
        countryCode: loc.countryCode,
        city: loc.city,
        label: loc.whatsapp,
        href: waLink(loc.whatsapp),
      });
    }
    if (loc.whatsapp2) {
      list.push({
        key: `${loc.slug}-2`,
        country: loc.country,
        countryCode: loc.countryCode,
        city: loc.city,
        label: loc.whatsapp2,
        href: waLink(loc.whatsapp2),
      });
    }
    return list;
  });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Discuter avec PaparaShop sur WhatsApp"
          className="group fixed bottom-5 right-5 z-50 flex items-center gap-0 sm:bottom-6 sm:right-6"
        >
          {/* Étiquette (visible au survol sur grand écran) */}
          <span className="pointer-events-none mr-3 hidden max-w-0 overflow-hidden whitespace-nowrap rounded-full bg-white px-0 py-2 text-sm font-semibold text-[#1B8A8A] opacity-0 shadow-lg transition-all duration-300 group-hover:max-w-xs group-hover:px-4 group-hover:opacity-100 lg:block">
            Commander sur WhatsApp
          </span>

          {/* Bouton rond */}
          <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl shadow-[#25D366]/40 transition-transform duration-300 group-hover:scale-110">
            {!open && (
              <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-40 motion-safe:animate-ping motion-reduce:hidden" />
            )}
            <WhatsAppIcon className="relative h-7 w-7" />
          </span>
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        side="top"
        sideOffset={12}
        className="z-50 w-[19rem] rounded-2xl p-0 shadow-2xl"
      >
        <div className="rounded-t-2xl bg-[#25D366] px-4 py-3 text-white">
          <div className="flex items-center gap-2">
            <WhatsAppIcon className="h-5 w-5" />
            <div className="text-sm font-semibold">Choisissez une boutique</div>
          </div>
          <p className="mt-1 text-xs text-white/85">
            Nous vous répondons sur WhatsApp du lundi au samedi.
          </p>
        </div>

        <ul className="divide-y divide-border">
          {options.map((opt) => (
            <li key={opt.key}>
              <a
                href={opt.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted"
              >
                <span className="text-2xl leading-none" aria-hidden="true">
                  {flagEmoji(opt.countryCode)}
                </span>
                <span className="flex-1">
                  <span className="block text-sm font-semibold text-foreground">
                    PaparaShop {opt.country}
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    {opt.city} • {opt.label}
                  </span>
                </span>
                <WhatsAppIcon className="h-5 w-5 text-[#25D366]" />
              </a>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
