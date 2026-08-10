import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SiteLayout } from "@/components/layout/SiteLayout";

export const Route = createFileRoute("/mot-de-passe-oublie")({
  component: ForgotPasswordPage,
  head: () => ({
    meta: [
      { title: "Mot de passe oublié — PaparaShop" },
      {
        name: "description",
        content: "Réinitialisez le mot de passe de votre compte PaparaShop en recevant un lien sécurisé par e-mail.",
      },
      { property: "og:title", content: "Mot de passe oublié — PaparaShop" },
      { property: "og:description", content: "Recevez un lien de réinitialisation par e-mail." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setSent(true);
      toast.success("Si un compte existe, un e-mail de réinitialisation vient d'être envoyé.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Envoi impossible");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SiteLayout>
      <section className="flex min-h-[70vh] items-center justify-center bg-secondary/40 px-4 py-16">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-lg">
          <h1 className="font-display text-2xl font-bold text-primary">Mot de passe oublié</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Saisissez votre adresse e-mail : vous recevrez un lien pour définir un nouveau mot de passe.
          </p>

          {sent ? (
            <p className="mt-6 rounded-lg bg-secondary p-4 text-sm">
              E-mail envoyé. Pensez à vérifier vos spams, puis suivez le lien reçu.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  maxLength={255}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Envoi…" : "Envoyer le lien"}
              </Button>
            </form>
          )}

          <Link to="/auth" className="mt-6 block text-center text-sm text-muted-foreground underline">
            Retour à la connexion
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}
