// ============================================================
// FICHIER : src/components/home/Testimonials.tsx  (REMPLACE l'existant)
//
// Pourquoi ce remplacement :
// - L'ancienne version affichait des avis INVENTÉS (données "SEED")
//   et le formulaire enregistrait dans le localStorage : un avis
//   publié n'était visible que par son propre auteur, sur son
//   propre navigateur. Trompeur et inutile.
// - Cette version affiche de VRAIS avis (issus des captures
//   WhatsApp de satisfaction fournies par le client) + un bouton
//   pour laisser un avis directement sur WhatsApp.
//
// AVANT DE COLLER :
// Remplacer le contenu de TESTIMONIALS ci-dessous par les vrais
// avis. Recopier fidèlement le message (corriger juste
// l'orthographe), avec l'ACCORD du client concerné, et utiliser
// prénom + initiale ("Aïcha K.") pour protéger sa vie privée.
// ============================================================
import { Quote, Star } from "lucide-react";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { LOCATIONS } from "@/lib/site";

type Testimonial = {
  name: string; // Prénom + initiale du nom : "Aïcha K."
  role?: string; // Métier ou contexte : "Photographe mariage", "Vidéaste, Cotonou"
  rating: number; // Note sur 5
  message: string; // Le texte de l'avis (issu de la capture WhatsApp)
};

// ⬇️⬇️ REMPLACER PAR LES VRAIS AVIS CLIENTS ⬇️⬇️
const TESTIMONIALS: Testimonial[] = [
  {
    name: "Prénom N.",
    role: "Photographe, Cotonou",
    rating: 5,
    message:
      "[Coller ici le texte du 1er avis WhatsApp, avec l'accord du client]",
  },
  {
    name: "Prénom N.",
    role: "Vidéaste",
    rating: 5,
    message:
      "[Coller ici le texte du 2e avis WhatsApp]",
  },
  {
    name: "Prénom N.",
    role: "Créateur de contenu",
    rating: 5,
    message:
      "[Coller ici le texte du 3e avis WhatsApp]",
  },
];
// ⬆️⬆️ FIN DE LA ZONE À REMPLACER ⬆️⬆️

const REVIEW_MESSAGE =
  "Bonjour PaparaShop 👋, voici mon avis sur mon achat : ";

function Stars({ value }: { value: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`Note : ${value} sur 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`h-4 w-4 ${
            n <= value ? "fill-accent text-accent" : "text-muted-foreground/30"
          }`}
          aria-hidden
        />
      ))}
    </div>
  );
}

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function Testimonials() {
  const hq = LOCATIONS.find((l) => l.isHQ) ?? LOCATIONS[0];
  const number = (hq.whatsapp ?? hq.phone).replace(/[^0-9]/g, "");
  const reviewHref = `https://wa.me/${number}?text=${encodeURIComponent(REVIEW_MESSAGE)}`;

  return (
    <section className="bg-background py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Ils nous font confiance"
          title="Ce que disent nos clients"
          subtitle="Des avis authentiques, reçus de photographes, vidéastes et créateurs que nous équipons au quotidien."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <article
              key={t.name + t.message.slice(0, 12)}
              className="group relative flex flex-col rounded-2xl border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <Quote className="absolute right-5 top-5 h-8 w-8 text-primary/10" aria-hidden />
              <Stars value={t.rating} />
              <p className="mt-4 flex-1 text-sm leading-relaxed text-foreground/85">
                "{t.message}"
              </p>
              <div className="mt-6 flex items-center gap-3 border-t pt-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-sm font-semibold text-primary-foreground">
                  {initials(t.name)}
                </div>
                <div>
                  <p className="text-sm font-semibold leading-tight">{t.name}</p>
                  {t.role && <p className="text-xs text-muted-foreground">{t.role}</p>}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Invitation à laisser un avis — via WhatsApp, le canal réel des clients */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            Vous avez acheté chez PaparaShop ? Partagez votre expérience :
          </p>
          <a
            href={reviewHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 font-display text-sm font-semibold text-primary-foreground transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/30"
          >
            Laisser un avis sur WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
