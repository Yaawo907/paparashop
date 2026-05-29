import { useEffect, useMemo, useState } from "react";
import { Quote, Star, Plus, Send } from "lucide-react";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

type Testimonial = {
  id: string;
  name: string;
  role?: string;
  rating: number;
  message: string;
  createdAt: number;
};

const STORAGE_KEY = "paparashop:testimonials";

const SEED: Testimonial[] = [
  {
    id: "seed-1",
    name: "Aïcha K.",
    role: "Photographe mariage",
    rating: 5,
    message:
      "Un service au top ! Mon Canon EOS R6 a été livré le jour même à Cotonou. L'équipe connaît vraiment le matériel.",
    createdAt: Date.now() - 86400000 * 12,
  },
  {
    id: "seed-2",
    name: "Marc D.",
    role: "Vidéaste freelance",
    rating: 5,
    message:
      "Pack studio Godox + softbox VIJIM parfait pour mes shoots produits. Conseils précis et tarifs honnêtes.",
    createdAt: Date.now() - 86400000 * 30,
  },
  {
    id: "seed-3",
    name: "Fatou S.",
    role: "Créatrice de contenu",
    rating: 4,
    message:
      "J'ai acheté mon micro Ulanzi et une carte SanDisk. Tout fonctionne nickel, je recommande PaparaShop !",
    createdAt: Date.now() - 86400000 * 45,
  },
];

function loadStored(): Testimonial[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? "")
    .join("");
}

function Stars({ value, onChange }: { value: number; onChange?: (n: number) => void }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type={onChange ? "button" : undefined}
          onClick={() => onChange?.(n)}
          className={onChange ? "cursor-pointer transition-transform hover:scale-110" : "cursor-default"}
          aria-label={`${n} étoile${n > 1 ? "s" : ""}`}
          disabled={!onChange}
        >
          <Star
            className={
              n <= value
                ? "h-4 w-4 fill-accent text-accent"
                : "h-4 w-4 text-muted-foreground/40"
            }
          />
        </button>
      ))}
    </div>
  );
}

export function Testimonials() {
  const [custom, setCustom] = useState<Testimonial[]>([]);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setCustom(loadStored());
  }, []);

  const all = useMemo(
    () => [...custom, ...SEED].sort((a, b) => b.createdAt - a.createdAt),
    [custom],
  );

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const trimmedName = name.trim().slice(0, 60);
    const trimmedMsg = message.trim().slice(0, 400);
    if (trimmedName.length < 2) {
      toast.error("Merci d'indiquer votre nom.");
      return;
    }
    if (trimmedMsg.length < 10) {
      toast.error("Votre témoignage doit contenir au moins 10 caractères.");
      return;
    }
    const next: Testimonial = {
      id: `local-${Date.now()}`,
      name: trimmedName,
      role: role.trim().slice(0, 60) || undefined,
      rating,
      message: trimmedMsg,
      createdAt: Date.now(),
    };
    const updated = [next, ...custom];
    setCustom(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
    toast.success("Merci pour votre témoignage !");
    setName("");
    setRole("");
    setRating(5);
    setMessage("");
    setOpen(false);
  }

  return (
    <section id="temoignages" className="bg-muted/30 py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center">
          <SectionTitle
            eyebrow="Ils nous font confiance"
            title="Témoignages clients"
            subtitle="Photographes, vidéastes et créateurs partagent leur expérience PaparaShop."
          />

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="mb-12 gap-2">
                <Plus className="h-4 w-4" />
                Laisser un témoignage
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Partagez votre expérience</DialogTitle>
                <DialogDescription>
                  Votre avis aide d'autres clients à choisir PaparaShop.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={submit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Nom *</label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={60}
                    placeholder="Votre nom"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Métier / Rôle</label>
                  <Input
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    maxLength={60}
                    placeholder="Ex. Photographe, Vidéaste…"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Note</label>
                  <Stars value={rating} onChange={setRating} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Votre message *</label>
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    maxLength={400}
                    rows={4}
                    placeholder="Racontez votre expérience…"
                  />
                  <p className="text-right text-xs text-muted-foreground">
                    {message.length}/400
                  </p>
                </div>
                <DialogFooter>
                  <Button type="submit" className="gap-2">
                    <Send className="h-4 w-4" />
                    Publier
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {all.map((t) => (
            <article
              key={t.id}
              className="group relative flex flex-col rounded-2xl border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <Quote className="absolute right-5 top-5 h-8 w-8 text-primary/10" />
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
                  {t.role && (
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
