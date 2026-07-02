import { useState } from "react";
import { Wrench, PackageSearch, Clock, ShieldCheck, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SITE } from "@/lib/site";

export function SavAndSpecialOrder() {
  const [type, setType] = useState<"sav" | "commande">("commande");
  const [form, setForm] = useState({
    name: "",
    contact: "",
    product: "",
    message: "",
  });

  const buildMessage = () => {
    const header =
      type === "sav"
        ? "Demande SAV / Assistance technique"
        : "Commande spéciale (importation 10 jours)";
    return `${header}
Nom : ${form.name}
Contact : ${form.contact}
Produit / modèle : ${form.product}
Détails : ${form.message}`;
  };

  const openWhatsApp = () => {
    const url = `https://wa.me/22962447474?text=${encodeURIComponent(buildMessage())}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const openMail = () => {
    const subject =
      type === "sav" ? "Demande SAV — PaparaShop" : "Commande spéciale — PaparaShop";
    window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(buildMessage())}`;
  };

  const canSubmit = form.name.trim() && form.contact.trim() && form.product.trim();

  return (
    <section id="sav" className="bg-secondary/40 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <p className="mb-3 font-display text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            SAV & Commande spéciale
          </p>
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            Un modèle absent du stock ? Un souci technique ?
          </h2>
          <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-primary" />
          <p className="mx-auto mt-5 max-w-2xl text-muted-foreground">
            Deux services dédiés pour aller au-delà de la vente : importation sur mesure
            en 10 jours ouvrés et assistance technique post-vente.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <article className="rounded-xl border-2 border-primary/15 bg-white p-6">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <PackageSearch className="h-6 w-6" strokeWidth={1.75} />
            </div>
            <h3 className="font-display text-xl font-bold text-primary">
              Commande spéciale — 10 jours ouvrés
            </h3>
            <p className="mt-3 text-sm text-muted-foreground">
              Un modèle particulier, une configuration précise, un accessoire rare ?
              Nous l'importons en circuit officiel en 10 jours ouvrés maximum, avec
              garantie constructeur.
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-accent-foreground" />
                Délai maximum : 10 jours ouvrés
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent-foreground" />
                Garantie constructeur incluse
              </li>
            </ul>
          </article>

          <article className="rounded-xl border-2 border-primary/15 bg-white p-6">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Wrench className="h-6 w-6" strokeWidth={1.75} />
            </div>
            <h3 className="font-display text-xl font-bold text-primary">
              SAV & assistance technique
            </h3>
            <p className="mt-3 text-sm text-muted-foreground">
              Diagnostic, prise en charge sous garantie, conseils d'utilisation,
              entretien : notre équipe reste disponible bien après votre achat.
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent-foreground" />
                Garantie jusqu'à 2 ans selon catégorie
              </li>
              <li className="flex items-start gap-2">
                <Wrench className="mt-0.5 h-4 w-4 shrink-0 text-accent-foreground" />
                Diagnostic technique en boutique
              </li>
            </ul>
          </article>
        </div>

        <div className="mt-10 rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
          <h3 className="font-display text-xl font-bold text-primary">
            Formuler votre demande
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Remplissez le formulaire ci-dessous, nous vous répondons dans les 24 h.
          </p>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="type">Type de demande</Label>
              <Select value={type} onValueChange={(v) => setType(v as "sav" | "commande")}>
                <SelectTrigger id="type" className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="commande">Commande spéciale (10 jours)</SelectItem>
                  <SelectItem value="sav">SAV / Assistance technique</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="name">Votre nom</Label>
              <Input
                id="name"
                className="mt-1.5"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="contact">Téléphone ou email</Label>
              <Input
                id="contact"
                className="mt-1.5"
                value={form.contact}
                onChange={(e) => setForm({ ...form, contact: e.target.value })}
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="product">
                {type === "sav" ? "Produit concerné" : "Modèle recherché"}
              </Label>
              <Input
                id="product"
                className="mt-1.5"
                placeholder={
                  type === "sav" ? "Ex : Canon EOS R6 acheté en 2024" : "Ex : Sony FX3, DJI RS 4 Pro…"
                }
                value={form.product}
                onChange={(e) => setForm({ ...form, product: e.target.value })}
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="message">Détails</Label>
              <Textarea
                id="message"
                className="mt-1.5"
                rows={4}
                placeholder={
                  type === "sav"
                    ? "Décrivez le problème rencontré…"
                    : "Configuration, accessoires, budget approximatif…"
                }
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button
              type="button"
              onClick={openWhatsApp}
              disabled={!canSubmit}
              className="flex-1 bg-accent text-primary hover:bg-accent/90"
            >
              <Send className="h-4 w-4" /> Envoyer via WhatsApp
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={openMail}
              disabled={!canSubmit}
              className="flex-1"
            >
              Envoyer par email
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
