import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Text,
} from "@react-email/components";
import * as React from "react";
import type { TemplateEntry } from "./registry";

export interface ServiceRequestProps {
  requestType?: string;
  customerName?: string;
  customerContact?: string;
  product?: string;
  details?: string;
}

export function ServiceRequestEmail({
  requestType = "Commande spéciale",
  customerName = "",
  customerContact = "",
  product = "",
  details = "",
}: ServiceRequestProps) {
  return (
    <Html lang="fr">
      <Head />
      <Preview>{`${requestType} — ${customerName}`}</Preview>
      <Body style={{ backgroundColor: "#ffffff", fontFamily: "Arial, Helvetica, sans-serif" }}>
        <Container style={{ maxWidth: 560, padding: "24px" }}>
          <Heading style={{ color: "#0f172a", fontSize: 20 }}>
            {requestType} — PaparaShop
          </Heading>
          <Text style={{ color: "#334155", fontSize: 14 }}>
            Client : {customerName}
          </Text>
          <Text style={{ color: "#334155", fontSize: 14 }}>
            Contact : {customerContact}
          </Text>
          <Hr />
          <Text style={{ color: "#334155", fontSize: 14 }}>
            Produit / modèle : {product}
          </Text>
          {details ? (
            <Text style={{ color: "#334155", fontSize: 14, whiteSpace: "pre-wrap" }}>
              Détails : {details}
            </Text>
          ) : null}
          <Hr />
          <Text style={{ color: "#64748b", fontSize: 12 }}>
            Demande envoyée depuis la page Services de paparashop.net.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export const template = {
  component: ServiceRequestEmail,
  displayName: "Demande SAV / commande spéciale",
  subject: (data: Record<string, unknown>) =>
    `${data["requestType"] ?? "Demande"} — ${data["customerName"] ?? ""}`,
  previewData: {
    requestType: "Commande spéciale (importation 10 jours)",
    customerName: "Awo Mensah",
    customerContact: "+229 01 62 44 74 74",
    product: "Sony FX3",
    details: "Avec cage et carte CFexpress.",
  },
} satisfies TemplateEntry;
