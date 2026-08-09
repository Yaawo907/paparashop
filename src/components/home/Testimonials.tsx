import { useState } from "react";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { Quote, Star } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { LOCATIONS } from "@/lib/site";
import { testimonialsQuery } from "@/lib/cms.queries";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const REVIEW_MESSAGE = "Bonjour PaparaShop 👋, voici mon avis sur mon achat : ";

const reviewSchema = z.object({
  name: z.string().trim().min(2, "Nom trop court").max(80),
  role: z.string().trim().max(80),
  location: z.string().trim().max(80),
  rating: z.number().min(1).max(5),
  content: z.string().trim().min(10, "Avis trop court").max(1000),
});

function Stars({ value }: { value: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`Note : ${value} sur 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`h-4 w-4 ${n <= value ? "fill-accent text-accent" : "text-muted-foreground/30"}`}
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
  const { data: testimonials } = useSuspenseQuery(testimonialsQuery);
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

        {testimonials.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">
            Soyez le premier à partager votre expérience.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t) => (
              <article
                key={t.id}
                className="group relative flex flex-col rounded-2xl border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <Quote className="absolute right-5 top-5 h-8 w-8 text-primary/10" aria-hidden />
                <Stars value={t.rating} />
                <p className="mt-4 flex-1 text-sm leading-relaxed text-foreground/85">
                  "{t.content}"
                </p>
                <div className="mt-6 flex items-center gap-3 border-t pt-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-sm font-semibold text-primary-foreground">
                    {initials(t.name)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold leading-tight">{t.name}</p>
                    {(t.role || t.location) && (
                      <p className="text-xs text-muted-foreground">
                        {[t.role, t.location].filter(Boolean).join(" — ")}
                      </p>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="mt-12 flex flex-col items-center gap-3">
          <p className="text-sm text-muted-foreground">
            Vous avez acheté chez PaparaShop ? Partagez votre expérience :
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <ReviewDialog />
            <a
              href={reviewHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border-2 border-primary px-6 py-3 font-display text-sm font-semibold text-primary transition-all hover:bg-primary hover:text-primary-foreground"
            >
              Écrire sur WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function ReviewDialog() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", role: "", location: "", rating: 5, content: "" });

  const submit = useMutation({
    mutationFn: async () => {
      const parsed = reviewSchema.parse(form);
      const { error } = await supabase.from("testimonials").insert({
        ...parsed,
        is_approved: false,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Merci ! Votre avis sera publié après validation.");
      setForm({ name: "", role: "", location: "", rating: 5, content: "" });
      setOpen(false);
      qc.invalidateQueries({ queryKey: ["cms", "testimonials"] });
    },
    onError: (e: Error) =>
      toast.error(e instanceof z.ZodError ? "Vérifiez les champs" : e.message),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg">Laisser un avis</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Votre avis</DialogTitle>
          <DialogDescription>
            Publié après validation par notre équipe.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="rev-name">Nom</Label>
            <Input
              id="rev-name"
              maxLength={80}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="rev-role">Activité</Label>
              <Input
                id="rev-role"
                maxLength={80}
                placeholder="Photographe…"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rev-loc">Ville</Label>
              <Input
                id="rev-loc"
                maxLength={80}
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Note</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  aria-label={`${n} étoiles`}
                  onClick={() => setForm({ ...form, rating: n })}
                >
                  <Star
                    className={`h-6 w-6 ${n <= form.rating ? "fill-accent text-accent" : "text-muted-foreground/30"}`}
                  />
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="rev-content">Votre message</Label>
            <Textarea
              id="rev-content"
              rows={4}
              maxLength={1000}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
            />
          </div>
          <Button
            className="w-full"
            disabled={submit.isPending}
            onClick={() => submit.mutate()}
          >
            {submit.isPending ? "Envoi…" : "Envoyer mon avis"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
