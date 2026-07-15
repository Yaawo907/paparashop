import { MapPin, Phone, Clock, MessageCircle, Star } from "lucide-react";
import type { Location } from "@/lib/site";

export function CountryCard({ loc }: { loc: Location }) {
  return (
    <article className="relative flex h-full flex-col overflow-hidden rounded-xl border-2 border-primary/15 bg-card p-7 shadow-sm transition-all hover:-translate-y-1 hover:border-accent hover:shadow-xl">
      <div className="absolute inset-x-0 top-0 h-1.5 gradient-teal-gold" />
      {loc.image && (
        <div className="-mx-7 -mt-7 mb-5 h-40 overflow-hidden">
          <img src={loc.image} alt={loc.imageAlt ?? loc.country} className="h-full w-full object-cover" loading="lazy" />
        </div>
      )}
      <div className="mb-4 flex items-start justify-between">
        <div>
          <p className="font-display text-xs font-semibold uppercase tracking-widest text-accent-foreground/70">
            Depuis {loc.since}
          </p>
          <h3 className="mt-1 font-display text-2xl font-bold text-primary">
            {loc.country}
          </h3>
          <p className="text-sm text-muted-foreground">{loc.city}</p>
        </div>
        {loc.isHQ && (
          <span className="inline-flex items-center gap-1 rounded-full bg-accent/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary-dark">
            <Star className="h-3 w-3" strokeWidth={2.5} /> Siège
          </span>
        )}
      </div>

      <ul className="mt-2 space-y-3 text-sm">
        <li className="flex items-start gap-3">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <span className="text-muted-foreground">{loc.address}</span>
        </li>
        <li className="flex items-start gap-3">
          <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <a href={loc.phoneHref} className="text-muted-foreground hover:text-primary">
            {loc.phone}
          </a>
        </li>
        {loc.whatsappHref && (
          <li className="flex items-start gap-3">
            <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <a
              href={loc.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary"
            >
              WhatsApp : {loc.whatsapp}
            </a>
          </li>
        )}
        {loc.whatsapp2Href && (
          <li className="flex items-start gap-3">
            <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <a
              href={loc.whatsapp2Href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary"
            >
              WhatsApp : {loc.whatsapp2}
            </a>
          </li>
        )}
        <li className="flex items-start gap-3">
          <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <span className="text-muted-foreground">{loc.hours}</span>
        </li>
      </ul>
    </article>
  );
}
