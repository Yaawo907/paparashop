import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Text,
} from "@react-email/components";
import * as React from "react";
import type { TemplateEntry } from "./registry";
import type { OrderLine } from "./order-receipt";

export interface OrderAlertProps {
  orderNumber?: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  delivery?: string;
  notes?: string;
  total?: string;
  transactionId?: string;
  whatsappLink?: string;
  lines?: OrderLine[];
}

export function OrderAlertEmail({
  orderNumber = "CMD-0000",
  customerName = "",
  customerPhone = "",
  customerEmail = "",
  delivery = "",
  notes = "",
  total = "0 FCFA",
  transactionId = "-",
  whatsappLink = "",
  lines = [],
}: OrderAlertProps) {
  return (
    <Html lang="fr">
      <Head />
      <Preview>{`Nouvelle commande payée ${orderNumber}`}</Preview>
      <Body style={{ backgroundColor: "#ffffff", fontFamily: "Arial, Helvetica, sans-serif" }}>
        <Container style={{ maxWidth: 560, padding: "24px" }}>
          <Heading style={{ color: "#0f172a", fontSize: 20 }}>
            Nouvelle commande payée — {orderNumber}
          </Heading>
          <Text style={{ color: "#334155", fontSize: 14 }}>
            {customerName} · {customerPhone} · {customerEmail}
          </Text>
          {delivery ? (
            <Text style={{ color: "#334155", fontSize: 14 }}>Livraison : {delivery}</Text>
          ) : null}
          {notes ? <Text style={{ color: "#334155", fontSize: 14 }}>Notes : {notes}</Text> : null}
          <Hr />
          {lines.map((l, i) => (
            <Text key={i} style={{ color: "#334155", fontSize: 14, margin: "4px 0" }}>
              {l.name} × {l.quantity} — {l.lineTotal}
            </Text>
          ))}
          <Hr />
          <Text style={{ fontWeight: "bold", color: "#0d9488", fontSize: 16 }}>Total : {total}</Text>
          <Text style={{ color: "#64748b", fontSize: 12 }}>Transaction : {transactionId}</Text>
          {whatsappLink ? (
            <Text style={{ fontSize: 14 }}>
              <Link href={whatsappLink} style={{ color: "#0d9488" }}>
                Ouvrir WhatsApp pour contacter le client
              </Link>
            </Text>
          ) : null}
        </Container>
      </Body>
    </Html>
  );
}

export const template = {
  component: OrderAlertEmail,
  displayName: "Alerte commande service clientèle",
  subject: (data: Record<string, unknown>) =>
    `Nouvelle commande payée ${data["orderNumber"] ?? ""}`,
  previewData: {
    orderNumber: "CMD-1042",
    customerName: "Awo",
    customerPhone: "+229 01 62 44 74 74",
    customerEmail: "client@example.com",
    total: "450 000 FCFA",
    lines: [{ name: "Canon EOS R5", quantity: 1, lineTotal: "450 000 FCFA" }],
  },
} satisfies TemplateEntry;
