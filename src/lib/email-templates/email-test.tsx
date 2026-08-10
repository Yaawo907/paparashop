import { Body, Container, Head, Heading, Html, Preview, Text } from "@react-email/components";
import * as React from "react";
import type { TemplateEntry } from "./registry";

export interface EmailTestProps {
  recipientName?: string;
  sentAt?: string;
}

const teal = "#0d9488";

export function EmailTestEmail({
  recipientName = "",
  sentAt = new Date().toLocaleString("fr-FR"),
}: EmailTestProps) {
  return (
    <Html lang="fr">
      <Head />
      <Preview>Test de délivrabilité — Papara Shop</Preview>
      <Body style={{ backgroundColor: "#ffffff", fontFamily: "Arial, Helvetica, sans-serif" }}>
        <Container style={{ maxWidth: 560, padding: "24px" }}>
          <Text style={{ color: teal, fontSize: 14, fontWeight: "bold", letterSpacing: 1 }}>
            PAPARA SHOP — EQUIPEMENTIER AUDIOVISUEL
          </Text>
          <Heading style={{ color: "#0f172a", fontSize: 22 }}>
            E-mail de test envoyé avec succès
          </Heading>
          <Text style={{ color: "#334155", fontSize: 15, lineHeight: "22px" }}>
            Bonjour {recipientName || "cher client"},
          </Text>
          <Text style={{ color: "#334155", fontSize: 15, lineHeight: "22px" }}>
            Cet e-mail a été envoyé depuis <strong>notify.paparashop.net</strong> pour vérifier que
            votre configuration d’envoi fonctionne correctement.
          </Text>
          <Text style={{ color: "#334155", fontSize: 15, lineHeight: "22px" }}>
            Si vous le recevez dans votre boîte principale (et non dans les indésirables), la
            délivrabilité est bonne.
          </Text>
          <Text style={{ color: "#64748b", fontSize: 12 }}>Envoyé le : {sentAt}</Text>
        </Container>
      </Body>
    </Html>
  );
}

export const template = {
  component: EmailTestEmail,
  displayName: "E-mail de test",
  subject: "Test de délivrabilité — Papara Shop",
  previewData: {
    recipientName: "Awo",
    sentAt: "10/08/2026 10:49",
  },
} satisfies TemplateEntry;
