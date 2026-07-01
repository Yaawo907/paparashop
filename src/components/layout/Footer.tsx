import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Mail, MapPin, Camera, Globe2 } from "lucide-react";
import { SITE, LOCATIONS } from "@/lib/site";

// Lucide doesn't ship TikTok yet — small inline glyph
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.51a8.16 8.16 0 0 0 4.77 1.52V6.6a4.85 4.85 0 0 1-1.84.09Z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="bg-gradient-to-b from-primary to-primary-dark text-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <div className="mb-4 flex items-center gap-2">
            <Camera className="h-6 w-6 text-accent" />
            <span className="font-display text-xl font-bold">
              PAPARA<span className="text-accent">.SHOP</span>
            </span>
          </div>
          <p className="mb-4 max-w-xs text-sm leading-relaxed text-white/75">
            Depuis {SITE.foundedYear} : votre spécialiste photo & audiovisuel professionnel en Afrique de l'Ouest francophone.
          </p>
          <p className="mb-6 flex items-center gap-2 text-xs text-white/60">
            <Globe2 className="h-3.5 w-3.5 text-accent" /> Bénin • Burkina Faso • Togo
          </p>
          <div className="flex gap-3">
            <a
              href={SITE.socials.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="rounded-full border border-white/20 p-2 transition-colors hover:border-accent hover:text-accent"
            >
              <Facebook className="h-4 w-4" />
            </a>
            <a
              href={SITE.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="rounded-full border border-white/20 p-2 transition-colors hover:border-accent hover:text-accent"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              href={SITE.socials.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="rounded-full border border-white/20 p-2 transition-colors hover:border-accent hover:text-accent"
            >
              <TikTokIcon className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-accent">
            Navigation
          </h3>
          <ul className="space-y-2 text-sm">
            {[
              { to: "/", label: "Accueil" },
              { to: "/catalogue", label: "Catalogue" },
              { to: "/a-propos", label: "À propos" },
              { to: "/services", label: "Nos services" },
              { to: "/contact", label: "Contact" },
            ].map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-white/75 transition-colors hover:text-accent">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-accent">
            Contact
          </h3>
          <ul className="space-y-3 text-sm text-white/85">
            {LOCATIONS.map((l) => (
              <li key={l.slug} className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span>
                  <span className="font-semibold text-white">{l.country}</span>
                  {l.isHQ && <span className="ml-1 text-[10px] uppercase tracking-widest text-accent">Siège</span>}
                  <br />
                  <a href={l.phoneHref} className="text-white/70 hover:text-accent">{l.phone}</a>
                </span>
              </li>
            ))}
            <li className="flex items-start gap-3 pt-2 border-t border-white/10">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <a href={SITE.emailHref} className="hover:text-accent">{SITE.email}</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-6 text-center text-xs text-white/60 sm:px-6 lg:px-8">
          © {new Date().getFullYear()} {SITE.fullName} — Équipement photographique professionnel.
        </div>
      </div>
    </footer>
  );
}
