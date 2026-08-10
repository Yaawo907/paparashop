import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SiteLayout } from "@/components/layout/SiteLayout";

export const Route = createFileRoute("/_authenticated/profil")({
  component: ProfilPage,
  head: () => ({
    meta: [
      { title: "Mon profil — PaparaShop" },
      { name: "description", content: "Mettez à jour vos informations personnelles et votre mot de passe PaparaShop." },
      { property: "og:title", content: "Mon profil — PaparaShop" },
      { property: "og:description", content: "Gestion de votre compte PaparaShop." },
      { name: "robots", content: "noindex" },
    ],
  }),
});

function ProfilPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [email, setEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [pwSaving, setPwSaving] = useState(false);

  useEffect(() => {
    let active = true;
    void (async () => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;
      if (!active || !user) return;
      setEmail(user.email ?? "");
      setNewEmail(user.email ?? "");
      const { data } = await supabase
        .from("profiles")
        .select("full_name, phone, avatar_url")
        .eq("id", user.id)
        .maybeSingle();
      if (!active) return;
      setFullName(data?.full_name ?? "");
      setPhone(data?.phone ?? "");
      setAvatarUrl(data?.avatar_url ?? "");
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;
      if (!user) throw new Error("Session expirée");

      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        email: user.email ?? null,
        full_name: fullName.trim() || null,
        phone: phone.trim() || null,
        avatar_url: avatarUrl.trim() || null,
      });
      if (error) throw error;

      if (newEmail.trim() && newEmail.trim() !== email) {
        const { error: mailErr } = await supabase.auth.updateUser(
          { email: newEmail.trim() },
          { emailRedirectTo: `${window.location.origin}/profil` },
        );
        if (mailErr) throw mailErr;
        toast.success("Profil enregistré. Confirmez le changement d'e-mail via le lien reçu.");
      } else {
        toast.success("Profil mis à jour.");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Échec de la mise à jour");
    } finally {
      setSaving(false);
    }
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    if (password !== password2) {
      toast.error("Les deux mots de passe ne correspondent pas.");
      return;
    }
    setPwSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setPassword("");
      setPassword2("");
      toast.success("Mot de passe modifié.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Échec du changement de mot de passe");
    } finally {
      setPwSaving(false);
    }
  }

  return (
    <SiteLayout>
      <section className="bg-secondary/40 px-4 py-12">
        <div className="mx-auto w-full max-w-2xl space-y-6">
          <div className="flex items-center justify-between gap-4">
            <h1 className="font-display text-2xl font-bold text-primary">Mon profil</h1>
            <Link to="/admin" className="text-sm text-muted-foreground underline">
              Tableau de bord
            </Link>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="font-display text-lg font-semibold">Informations personnelles</h2>
            <form onSubmit={saveProfile} className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Nom complet</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  maxLength={100}
                  disabled={loading}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone / WhatsApp</Label>
                <Input
                  id="phone"
                  value={phone}
                  maxLength={30}
                  disabled={loading}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="avatarUrl">Photo de profil (URL)</Label>
                <Input
                  id="avatarUrl"
                  type="url"
                  value={avatarUrl}
                  maxLength={500}
                  disabled={loading}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Adresse e-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={newEmail}
                  maxLength={255}
                  disabled={loading}
                  onChange={(e) => setNewEmail(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Un changement d'e-mail doit être confirmé par un lien envoyé à la nouvelle adresse.
                </p>
              </div>
              <Button type="submit" disabled={saving || loading}>
                {saving ? "Enregistrement…" : "Enregistrer"}
              </Button>
            </form>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="font-display text-lg font-semibold">Changer de mot de passe</h2>
            <form onSubmit={changePassword} className="mt-4 space-y-4">
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
              <Button type="submit" disabled={pwSaving}>
                {pwSaving ? "Modification…" : "Modifier le mot de passe"}
              </Button>
            </form>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
