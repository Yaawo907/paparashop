import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HeroAdmin } from "@/components/admin/HeroAdmin";
import { ClientsAdmin } from "@/components/admin/ClientsAdmin";
import { CategoriesAdmin } from "@/components/admin/CategoriesAdmin";
import { ProductsAdmin } from "@/components/admin/ProductsAdmin";
import { PromotionsAdmin } from "@/components/admin/PromotionsAdmin";
import { TestimonialsAdmin } from "@/components/admin/TestimonialsAdmin";
import { OrdersAdmin } from "@/components/admin/OrdersAdmin";
import { EmailLogAdmin } from "@/components/admin/EmailLogAdmin";
import { ContentAdmin } from "@/components/admin/ContentAdmin";
import { UsersAdmin } from "@/components/admin/UsersAdmin";
import { SystemAdmin } from "@/components/admin/SystemAdmin";


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
  const [roles, setRoles] = useState<string[]>([]);
  const [email, setEmail] = useState("");
  const [tab, setTab] = useState("categories");

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
      const list = (data ?? []).map((r) => r.role as string);
      setRoles(list);
      setStaff(list.length > 0);
    })();
    return () => {
      active = false;
    };
  }, []);

  const isAdmin = roles.includes("admin");
  const isEditor = isAdmin || roles.includes("editor");
  // commercial : catalogue, produits, promotions, images, commandes
  // éditeur : + textes et témoignages
  // admin : + utilisateurs et tables techniques
  const visibleTabs = [
    { value: "categories", label: "Catalogue" },
    { value: "products", label: "Produits" },
    { value: "promotions", label: "Promotions" },
    { value: "hero", label: "Carrousel accueil" },
    { value: "clients", label: "Clients" },
    { value: "orders", label: "Commandes" },
    { value: "emails", label: "E-mails" },
    ...(isEditor
      ? [
          { value: "testimonials", label: "Témoignages" },
          { value: "content", label: "Textes" },
        ]
      : []),
    ...(isAdmin
      ? [
          { value: "users", label: "Utilisateurs" },
          { value: "system", label: "Système" },
        ]
      : []),
  ];


  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="min-h-screen bg-secondary/30">
      <header className="border-b border-border bg-card">
        <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:px-6 sm:py-4">
          <div className="min-w-0">
            <h1 className="truncate font-display text-base font-bold text-primary sm:text-lg">
              Administration PaparaShop
            </h1>
            <p className="truncate text-xs text-muted-foreground">{email}</p>
          </div>
          <Button variant="outline" size="sm" className="shrink-0" onClick={signOut}>
            <LogOut className="h-4 w-4 sm:mr-1" />
            <span className="hidden sm:inline">Déconnexion</span>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-3 py-6 sm:px-6 sm:py-8">
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
          <Tabs value={tab} onValueChange={setTab}>
            {/* Mobile : sélecteur compact — Desktop : onglets */}
            <div className="md:hidden">
              <Select value={tab} onValueChange={setTab}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Section" />
                </SelectTrigger>
                <SelectContent>
                  {visibleTabs.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <TabsList className="hidden flex-wrap md:flex">
              {visibleTabs.map((t) => (
                <TabsTrigger key={t.value} value={t.value}>
                  {t.label}
                </TabsTrigger>
              ))}
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
            <TabsContent value="hero" className="pt-6">
              <HeroAdmin />
            </TabsContent>
            <TabsContent value="clients" className="pt-6">
              <ClientsAdmin />
            </TabsContent>
            <TabsContent value="orders" className="pt-6">
              <OrdersAdmin />
            </TabsContent>
            <TabsContent value="emails" className="pt-6">
              <EmailLogAdmin />
            </TabsContent>
            {isEditor && (
              <TabsContent value="testimonials" className="pt-6">
                <TestimonialsAdmin />
              </TabsContent>
            )}
            {isEditor && (
              <TabsContent value="content" className="pt-6">
                <ContentAdmin />
              </TabsContent>
            )}
            {isAdmin && (
              <TabsContent value="users" className="pt-6">
                <UsersAdmin />
              </TabsContent>
            )}
            {isAdmin && (
              <TabsContent value="system" className="pt-6">
                <SystemAdmin />
              </TabsContent>
            )}
          </Tabs>
        )}
      </main>
    </div>
  );
}
