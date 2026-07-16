import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, Camera } from "lucide-react";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";
import { GlobalSearch } from "./GlobalSearch";

const nav = [
  { to: "/", label: "Accueil" },
  { to: "/catalogue", label: "Catalogue" },
  { to: "/promotions", label: "Promotions" },
  { to: "/a-propos", label: "À propos" },
  { to: "/services", label: "Services" },
  { to: "/contact", label: "Contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-primary/95 backdrop-blur-md shadow-lg shadow-primary/20"
          : "bg-primary",
      )}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 text-white" onClick={() => setOpen(false)}>
          <Camera className="h-6 w-6 text-accent" strokeWidth={2} />
          <div className="flex flex-col leading-none">
            <span className="font-display text-lg font-bold tracking-tight">
              PAPARA<span className="text-accent">.SHOP</span>
            </span>
            <span className="mt-0.5 text-[9px] tracking-[0.2em] text-white/70">
              {SITE.tagline.toUpperCase()}
            </span>
          </div>
        </Link>

        <ul className="hidden items-center gap-8 lg:flex">
          {nav.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                className="text-sm font-medium uppercase tracking-wide text-white/85 transition-colors hover:text-accent [&.active]:text-accent"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1 lg:gap-3">
          <GlobalSearch compact />
          <a
            href={SITE.catalogUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-md border-2 border-accent px-5 py-2 font-display text-xs font-semibold text-accent transition-all hover:-translate-y-0.5 hover:bg-accent hover:text-primary hover:shadow-lg hover:shadow-accent/30 lg:inline-flex"
          >
            EXPLORER
          </a>

          <button
            type="button"
            onClick={() => setOpen((s) => !s)}
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            className="rounded-md p-2 text-white lg:hidden"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-white/10 bg-primary lg:hidden">
          <ul className="space-y-1 px-4 py-4">
            {nav.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  activeOptions={{ exact: item.to === "/" }}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-3 py-2 text-sm font-medium uppercase tracking-wide text-white/85 hover:bg-white/10 hover:text-accent [&.active]:text-accent"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <a
                href={SITE.catalogUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-md border-2 border-accent px-4 py-2 text-center font-display text-xs font-semibold text-accent"
              >
                EXPLORER LE CATALOGUE
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
