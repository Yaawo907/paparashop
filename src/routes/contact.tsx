import { createFileRoute } from "@tanstack/react-router";
import { Phone, Mail, MapPin, Clock, Facebook, Instagram } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "Contact — PaparaShop" },
      {
        name: "description",
        content: `Contactez PaparaShop à ${"Abomey-Calavi"}, Bénin. Téléphone, email, réseaux sociaux : nous vous répondons rapidement.`,
      },
    ],
  }),
});

function ContactPage() {
  return (
    <SiteLayout>
      <section className="bg-primary py-20 text-white sm:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <p className="mb-3 font-display text-xs font-semibold uppercase tracking-[0.3em] text-accent">
            On vous écoute
          </p>
          <h1 className="font-display text-4xl font-bold sm:text-5xl md:text-6xl text-balance">
            Contactez-nous
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-white/80 sm:text-lg">
            Une question sur un produit ? Un conseil avant achat ? Notre équipe est à votre disposition.
          </p>
        </div>
      </section>

      <section className="bg-background py-20 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 md:grid-cols-2 lg:px-8">
          <div>
            <SectionTitle title="Nos coordonnées" align="left" />
            <ul className="space-y-5 text-base">
              <li className="flex items-start gap-4">
                <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <MapPin className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-semibold">Adresse</p>
                  <p className="text-muted-foreground">{SITE.city}, {SITE.country}</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Phone className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-semibold">Téléphone</p>
                  <a href={SITE.phoneHref} className="text-muted-foreground hover:text-primary">
                    {SITE.phone}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Mail className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-semibold">Email</p>
                  <a href={SITE.emailHref} className="text-muted-foreground hover:text-primary">
                    {SITE.email}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Clock className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-semibold">Horaires</p>
                  <p className="text-muted-foreground">{SITE.hours}</p>
                </div>
              </li>
            </ul>

            <div className="mt-8">
              <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Sur les réseaux
              </p>
              <div className="flex gap-3">
                <a
                  href={SITE.socials.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm transition-colors hover:border-primary hover:text-primary"
                >
                  <Facebook className="h-4 w-4" /> Facebook
                </a>
                <a
                  href={SITE.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm transition-colors hover:border-primary hover:text-primary"
                >
                  <Instagram className="h-4 w-4" /> Instagram
                </a>
              </div>
            </div>
          </div>

          <ContactForm />
        </div>
      </section>
    </SiteLayout>
  );
}

function ContactForm() {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const name = String(data.get("name") ?? "");
        const email = String(data.get("email") ?? "");
        const message = String(data.get("message") ?? "");
        const body = `Bonjour PaparaShop,%0D%0A%0D%0A${encodeURIComponent(message)}%0D%0A%0D%0A— ${encodeURIComponent(name)} (${encodeURIComponent(email)})`;
        window.location.href = `${SITE.emailHref}?subject=${encodeURIComponent("Demande depuis le site")}&body=${body}`;
      }}
      className="rounded-xl border border-border bg-card p-8 shadow-sm"
    >
      <h2 className="mb-6 font-display text-xl font-bold">Envoyez-nous un message</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium">Nom</label>
          <input
            id="name"
            name="name"
            required
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="message" className="mb-1.5 block text-sm font-medium">Message</label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-md bg-primary px-6 py-3 font-display text-sm font-semibold text-white transition-all hover:bg-primary-dark"
        >
          Envoyer
        </button>
      </div>
    </form>
  );
}
