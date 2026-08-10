import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/layout/SiteLayout";

export const Route = createFileRoute("/unsubscribe")({
  component: UnsubscribePage,
  head: () => ({
    meta: [
      { title: "Désinscription des e-mails — Papara Shop" },
      {
        name: "description",
        content: "Gérez vos préférences et désinscrivez-vous des e-mails envoyés par Papara Shop.",
      },
      { property: "og:title", content: "Désinscription des e-mails — Papara Shop" },
      {
        property: "og:description",
        content: "Désinscrivez-vous des e-mails Papara Shop en un clic.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

function UnsubscribePage() {
  const [state, setState] = useState<"loading" | "ready" | "done" | "error">("loading");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("token") ?? "";
    setToken(t);
    if (!t) {
      setState("error");
      return;
    }
    fetch(`/email/unsubscribe?token=${encodeURIComponent(t)}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("invalid");
        const data = (await res.json()) as { email?: string };
        setEmail(data.email ?? "");
        setState("ready");
      })
      .catch(() => setState("error"));
  }, []);

  const confirm = async () => {
    try {
      const res = await fetch("/email/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      setState(res.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  };

  return (
    <SiteLayout>
      <section className="mx-auto max-w-lg px-4 py-32 text-center">
        <h1 className="font-display text-2xl font-bold text-primary">Désinscription</h1>
        {state === "loading" && <p className="mt-4 text-muted-foreground">Vérification du lien…</p>}
        {state === "ready" && (
          <>
            <p className="mt-4 text-muted-foreground">
              Confirmez la désinscription de {email || "cette adresse"} des e-mails Papara Shop.
            </p>
            <button
              onClick={confirm}
              className="mt-6 rounded-md bg-accent px-6 py-3 font-display text-sm font-bold uppercase tracking-wider text-primary"
            >
              Confirmer la désinscription
            </button>
          </>
        )}
        {state === "done" && (
          <p className="mt-4 text-muted-foreground">
            C'est fait, vous ne recevrez plus d'e-mails de notre part.
          </p>
        )}
        {state === "error" && (
          <p className="mt-4 text-muted-foreground">
            Ce lien de désinscription est invalide ou a déjà été utilisé.
          </p>
        )}
      </section>
    </SiteLayout>
  );
}
