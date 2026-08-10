import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

type AppRole = "admin" | "editor" | "commercial";

const ROLES: { value: AppRole; label: string; hint: string }[] = [
  { value: "admin", label: "Admin", hint: "Accès total, gestion des rôles" },
  { value: "commercial", label: "Commercial", hint: "Commandes et catalogue" },
  { value: "editor", label: "Éditeur", hint: "Contenus et catalogue" },
];

type Row = {
  id: string;
  email: string | null;
  full_name: string | null;
  roles: AppRole[];
};

export function UsersAdmin() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [meId, setMeId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    let active = true;
    void (async () => {
      const { data: userData } = await supabase.auth.getUser();
      const uid = userData.user?.id ?? null;
      if (!active) return;
      setMeId(uid);
      if (!uid) return setIsAdmin(false);
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", uid);
      if (!active) return;
      setIsAdmin((data ?? []).some((r) => r.role === "admin"));
    })();
    return () => {
      active = false;
    };
  }, []);

  const usersQuery = useQuery({
    queryKey: ["admin", "users"],
    enabled: isAdmin === true,
    queryFn: async (): Promise<Row[]> => {
      const [{ data: profiles, error: pErr }, { data: roles, error: rErr }] = await Promise.all([
        supabase.from("profiles").select("id, email, full_name").order("created_at"),
        supabase.from("user_roles").select("user_id, role"),
      ]);
      if (pErr) throw pErr;
      if (rErr) throw rErr;
      return (profiles ?? []).map((p) => ({
        id: p.id,
        email: p.email,
        full_name: p.full_name,
        roles: (roles ?? [])
          .filter((r) => r.user_id === p.id)
          .map((r) => r.role as AppRole),
      }));
    },
  });

  const toggleRole = useMutation({
    mutationFn: async ({ userId, role, has }: { userId: string; role: AppRole; has: boolean }) => {
      if (has) {
        const { error } = await supabase
          .from("user_roles")
          .delete()
          .eq("user_id", userId)
          .eq("role", role);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("user_roles").insert({ user_id: userId, role });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success("Rôles mis à jour");
      void qc.invalidateQueries({ queryKey: ["admin", "users"] });
    },
    onError: (e: unknown) =>
      toast.error(e instanceof Error ? e.message : "Impossible de modifier le rôle"),
  });

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = usersQuery.data ?? [];
    if (!q) return list;
    return list.filter(
      (r) =>
        (r.email ?? "").toLowerCase().includes(q) ||
        (r.full_name ?? "").toLowerCase().includes(q),
    );
  }, [usersQuery.data, search]);

  if (isAdmin === null) {
    return <p className="text-sm text-muted-foreground">Vérification des accès…</p>;
  }

  if (!isAdmin) {
    return (
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="font-display text-base font-bold text-primary">Réservé aux administrateurs</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Seuls les comptes administrateurs peuvent attribuer ou retirer des rôles.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un compte (email ou nom)…"
          className="w-full sm:max-w-sm"
        />
        <p className="text-xs text-muted-foreground">
          {rows.length} compte{rows.length > 1 ? "s" : ""}
        </p>
      </div>

      {usersQuery.isLoading && (
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Chargement des comptes…
        </p>
      )}
      {usersQuery.error && (
        <p className="text-sm text-destructive">Erreur de chargement des comptes.</p>
      )}

      {/* Mobile : cartes */}
      <div className="space-y-3 md:hidden">
        {rows.map((u) => (
          <div key={u.id} className="rounded-xl border border-border bg-card p-3">
            <p className="truncate font-medium text-foreground">
              {u.full_name || "—"}
              {u.id === meId && (
                <span className="ml-1 text-[11px] text-muted-foreground">(vous)</span>
              )}
            </p>
            <p className="truncate text-xs text-muted-foreground">{u.email ?? u.id}</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {u.roles.length === 0 ? (
                <span className="text-xs text-muted-foreground">Client</span>
              ) : (
                u.roles.map((r) => (
                  <Badge key={r} variant="secondary" className="gap-1">
                    <ShieldCheck className="h-3 w-3" />
                    {ROLES.find((x) => x.value === r)?.label ?? r}
                  </Badge>
                ))
              )}
            </div>
            <div className="mt-3 grid grid-cols-1 gap-2 xs:grid-cols-2">
              {ROLES.map((role) => {
                const has = u.roles.includes(role.value);
                const selfDemote = u.id === meId && role.value === "admin" && has;
                return (
                  <Button
                    key={role.value}
                    size="sm"
                    className="w-full"
                    variant={has ? "default" : "outline"}
                    disabled={selfDemote || toggleRole.isPending}
                    onClick={() => toggleRole.mutate({ userId: u.id, role: role.value, has })}
                  >
                    {has ? `Retirer ${role.label}` : role.label}
                  </Button>
                );
              })}
            </div>
          </div>
        ))}
        {!usersQuery.isLoading && rows.length === 0 && (
          <p className="text-sm text-muted-foreground">Aucun compte trouvé.</p>
        )}
      </div>

      <div className="hidden overflow-hidden rounded-xl border border-border bg-card md:block">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50 text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Compte</th>
              <th className="px-4 py-3">Rôles actuels</th>
              <th className="px-4 py-3">Attribuer / retirer</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((u) => (
              <tr key={u.id} className="border-t border-border align-top">
                <td className="px-4 py-3">
                  <p className="font-medium text-foreground">{u.full_name || "—"}</p>
                  <p className="text-xs text-muted-foreground">{u.email ?? u.id}</p>
                  {u.id === meId && (
                    <span className="text-[11px] text-muted-foreground">(vous)</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {u.roles.length === 0 ? (
                    <span className="text-xs text-muted-foreground">Client</span>
                  ) : (
                    <div className="flex flex-wrap gap-1">
                      {u.roles.map((r) => (
                        <Badge key={r} variant="secondary" className="gap-1">
                          <ShieldCheck className="h-3 w-3" />
                          {ROLES.find((x) => x.value === r)?.label ?? r}
                        </Badge>
                      ))}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    {ROLES.map((role) => {
                      const has = u.roles.includes(role.value);
                      const selfDemote = u.id === meId && role.value === "admin" && has;
                      return (
                        <Button
                          key={role.value}
                          size="sm"
                          variant={has ? "default" : "outline"}
                          disabled={selfDemote || toggleRole.isPending}
                          title={selfDemote ? "Vous ne pouvez pas retirer votre propre rôle admin" : role.hint}
                          onClick={() =>
                            toggleRole.mutate({ userId: u.id, role: role.value, has })
                          }
                        >
                          {has ? `Retirer ${role.label}` : role.label}
                        </Button>
                      );
                    })}
                  </div>
                </td>
              </tr>
            ))}
            {!usersQuery.isLoading && rows.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-sm text-muted-foreground">
                  Aucun compte trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
