import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CategoriesAdmin } from "@/components/admin/CategoriesAdmin";
import { ProductsAdmin } from "@/components/admin/ProductsAdmin";
import { PromotionsAdmin } from "@/components/admin/PromotionsAdmin";
import { TestimonialsAdmin } from "@/components/admin/TestimonialsAdmin";
import { OrdersAdmin } from "@/components/admin/OrdersAdmin";
import { ContentAdmin } from "@/components/admin/ContentAdmin";
import { UsersAdmin } from "@/components/admin/UsersAdmin";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminPage,
  head: () => ({
    meta: [
      { title: "Tableau de bord — PaparaShop" },
      { name: "description", content: "Gestion du catalogue, des promotions et des contenus." },
      { name: "robots", content: "noindex" },
    ],
  }),
});

function AdminPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [staff, setStaff] = useState<boolean | null>(null);
  const [email, setEmail] = useState("");

  useEffect(() => {
    let active = true;
    void (async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!active) return;
      setEmail(userData.user?.email ?? "");
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userData.user?.id ?? "");
      if (!active) return;
      setStaff((data ?? []).length > 0);
    })();
    return () => {
      active = false;
    };
  }, []);

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="min-h-screen bg-secondary/30">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <div>
            <h1 className="font-display text-lg font-bold text-primary">
              Administration PaparaShop
            </h1>
            <p className="text-xs text-muted-foreground">{email}</p>
          </div>
          <Button variant="outline" size="sm" onClick={signOut}>
            <LogOut className="mr-1 h-4 w-4" /> Déconnexion
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {staff === null && <p className="text-sm text-muted-foreground">Vérification des accès…</p>}
        {staff === false && (
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-display text-lg font-bold text-primary">Accès non autorisé</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Votre compte n'a pas encore le rôle administrateur ou éditeur. Demandez à un
              administrateur de vous l'attribuer.
            </p>
          </div>
        )}
        {staff && (
          <Tabs defaultValue="categories">
            <TabsList className="flex-wrap">
              <TabsTrigger value="categories">Catalogue</TabsTrigger>
              <TabsTrigger value="products">Produits</TabsTrigger>
              <TabsTrigger value="promotions">Promotions</TabsTrigger>
              <TabsTrigger value="testimonials">Témoignages</TabsTrigger>
              <TabsTrigger value="orders">Commandes</TabsTrigger>
              <TabsTrigger value="content">Textes</TabsTrigger>
              <TabsTrigger value="users">Utilisateurs</TabsTrigger>
            </TabsList>
            <TabsContent value="categories" className="pt-6">
              <CategoriesAdmin />
            </TabsContent>
            <TabsContent value="products" className="pt-6">
              <ProductsAdmin />
            </TabsContent>
            <TabsContent value="promotions" className="pt-6">
              <PromotionsAdmin />
            </TabsContent>
            <TabsContent value="testimonials" className="pt-6">
              <TestimonialsAdmin />
            </TabsContent>
            <TabsContent value="orders" className="pt-6">
              <OrdersAdmin />
            </TabsContent>
            <TabsContent value="content" className="pt-6">
              <ContentAdmin />
            </TabsContent>
            <TabsContent value="users" className="pt-6">
              <UsersAdmin />
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
}
