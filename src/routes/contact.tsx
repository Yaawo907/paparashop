import { createFileRoute } from "@tanstack/react-router";
import { Mail, Facebook, Instagram } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { CountryCard } from "@/components/contact/CountryCard";
import { SITE, LOCATIONS } from "@/lib/site";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "Contact — PaparaShop | Bénin, Burkina Faso, Togo" },
      {
        name: "description",
        content:
          "Contactez PaparaShop dans nos boutiques du Bénin, Burkina Faso et Togo. Téléphone, WhatsApp, email — notre équipe vous répond rapidement.",
      },
      { property: "og:title", content: "Contact — PaparaShop" },
      {
        property: "og:description",
        content: "Nos 3 points de vente en Afrique de l'Ouest et le formulaire de contact.",
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
            Nous trouver dans{" "}
            <span className="text-accent">3 pays d'Afrique de l'Ouest</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-white/80 sm:text-lg">
            Bénin (siège), Burkina Faso et Togo — un conseil expert près de chez vous.
          </p>
        </div>
      </section>

      <section className="bg-background py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle
            eyebrow="Nos boutiques"
            title="Rejoignez-nous en boutique ou à distance"
          />
          <div className="grid gap-6 md:grid-cols-3">
            {LOCATIONS.map((loc) => (
              <CountryCard key={loc.slug} loc={loc} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-secondary/40 py-20 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 md:grid-cols-2 lg:px-8">
          <div>
            <SectionTitle title="Une question ? Écrivez-nous" align="left" />
            <p className="text-base leading-relaxed text-muted-foreground">
              Un modèle spécifique à commander, un devis pour votre entreprise, un besoin de
              conseil avant achat ? Notre équipe vous répond sous 24 h ouvrées.
            </p>

            <div className="mt-8 rounded-xl border border-border bg-white p-6">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Mail className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-semibold">Email général</p>
                  <a href={SITE.emailHref} className="text-sm text-muted-foreground hover:text-primary">
                    {SITE.email}
                  </a>
                </div>
              </div>
              <div className="mt-6">
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
        const country = String(data.get("country") ?? "");
        const message = String(data.get("message") ?? "");
        const body = `Bonjour PaparaShop,%0D%0A%0D%0APays : ${encodeURIComponent(country)}%0D%0A%0D%0A${encodeURIComponent(message)}%0D%0A%0D%0A— ${encodeURIComponent(name)} (${encodeURIComponent(email)})`;
        window.location.href = `${SITE.emailHref}?subject=${encodeURIComponent("Demande depuis le site")}&body=${body}`;
      }}
      className="rounded-xl border border-border bg-card p-8 shadow-sm"
    >
      <h2 className="mb-6 font-display text-xl font-bold">Envoyez-nous un message</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium">Nom</label>
          <input id="name" name="name" required className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none" />
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium">Email</label>
          <input id="email" name="email" type="email" required className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none" />
        </div>
        <div>
          <label htmlFor="country" className="mb-1.5 block text-sm font-medium">Pays concerné</label>
          <select id="country" name="country" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none">
            {LOCATIONS.map((l) => (
              <option key={l.slug} value={l.country}>{l.country}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="message" className="mb-1.5 block text-sm font-medium">Message</label>
          <textarea id="message" name="message" required rows={5} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none" />
        </div>
        <button type="submit" className="w-full rounded-md bg-primary px-6 py-3 font-display text-sm font-semibold text-white transition-all hover:bg-primary-dark">
          Envoyer
        </button>
      </div>
    </form>
  );
}
