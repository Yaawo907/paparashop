import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SiteLayout } from "@/components/layout/SiteLayout";

export const Route = createFileRoute("/reset-password")({
  ssr: false,
  component: ResetPasswordPage,
  head: () => ({
    meta: [
      { title: "Nouveau mot de passe — PaparaShop" },
      {
        name: "description",
        content: "Définissez un nouveau mot de passe pour votre compte PaparaShop après réinitialisation.",
      },
      { property: "og:title", content: "Nouveau mot de passe — PaparaShop" },
      { property: "og:description", content: "Définissez un nouveau mot de passe sécurisé." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [valid, setValid] = useState(false);
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") {
        setValid(true);
        setReady(true);
      }
    });
    void (async () => {
      const { data } = await supabase.auth.getSession();
      if (!active) return;
      if (data.session) setValid(true);
      setReady(true);
    })();
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== password2) {
      toast.error("Les deux mots de passe ne correspondent pas.");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success("Mot de passe mis à jour.");
      navigate({ to: "/admin", replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Échec de la mise à jour");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SiteLayout>
      <section className="flex min-h-[70vh] items-center justify-center bg-secondary/40 px-4 py-16">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-lg">
          <h1 className="font-display text-2xl font-bold text-primary">Nouveau mot de passe</h1>

          {!ready ? (
            <p className="mt-4 text-sm text-muted-foreground">Vérification du lien…</p>
          ) : valid ? (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pw">Nouveau mot de passe</Label>
                <Input
                  id="pw"
                  type="password"
                  required
                  minLength={8}
                  maxLength={72}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pw2">Confirmer le mot de passe</Label>
                <Input
                  id="pw2"
                  type="password"
                  required
                  minLength={8}
                  maxLength={72}
                  value={password2}
                  onChange={(e) => setPassword2(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Enregistrement…" : "Enregistrer le mot de passe"}
              </Button>
            </form>
          ) : (
            <div className="mt-4 space-y-4 text-sm text-muted-foreground">
              <p>Lien invalide ou expiré. Demandez un nouveau lien de réinitialisation.</p>
              <Link to="/mot-de-passe-oublie" className="underline">
                Renvoyer un lien
              </Link>
            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
