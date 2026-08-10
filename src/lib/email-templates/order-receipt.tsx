import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";
import type { TemplateEntry } from "./registry";

export interface OrderLine {
  name: string;
  quantity: number;
  lineTotal: string;
}

export interface OrderReceiptProps {
  customerName?: string;
  orderNumber?: string;
  total?: string;
  transactionId?: string;
  delivery?: string;
  lines?: OrderLine[];
}

const teal = "#0d9488";

export function OrderReceiptEmail({
  customerName = "Client",
  orderNumber = "CMD-0000",
  total = "0 FCFA",
  transactionId = "-",
  delivery = "",
  lines = [],
}: OrderReceiptProps) {
  return (
    <Html lang="fr">
      <Head />
      <Preview>{`Votre commande ${orderNumber} est confirmée — Papara Shop`}</Preview>
      <Body style={{ backgroundColor: "#ffffff", fontFamily: "Arial, Helvetica, sans-serif" }}>
        <Container style={{ maxWidth: 560, padding: "24px" }}>
          <Text style={{ color: teal, fontSize: 14, fontWeight: "bold", letterSpacing: 1 }}>
            PAPARA SHOP — EQUIPEMENTIER AUDIOVISUEL
          </Text>
          <Heading style={{ color: "#0f172a", fontSize: 22 }}>
            Merci {customerName}, votre commande est confirmée
          </Heading>
          <Text style={{ color: "#334155", fontSize: 15, lineHeight: "22px" }}>
            Nous avons bien reçu votre paiement pour la commande <strong>{orderNumber}</strong>.
            Notre service clientèle vous contacte très prochainement pour organiser la livraison
            de votre matériel.
          </Text>

          <Hr />
          <Section>
            <Text style={{ fontWeight: "bold", color: "#0f172a" }}>Détail de la commande</Text>
            {lines.map((l, i) => (
              <Text key={i} style={{ color: "#334155", fontSize: 14, margin: "4px 0" }}>
                {l.name} × {l.quantity} — {l.lineTotal}
              </Text>
            ))}
            <Hr />
            <Text style={{ fontWeight: "bold", color: teal, fontSize: 16 }}>Total payé : {total}</Text>
            <Text style={{ color: "#64748b", fontSize: 12 }}>Transaction : {transactionId}</Text>
            {delivery ? (
              <Text style={{ color: "#64748b", fontSize: 12 }}>Livraison : {delivery}</Text>
            ) : null}
          </Section>

          <Hr />
          <Text style={{ color: "#64748b", fontSize: 12 }}>
            Une question ? Écrivez-nous à{" "}
            <Link href={`mailto:${supportEmail}`} style={{ color: teal }}>
              {supportEmail}
            </Link>{" "}
            ou contactez-nous sur{" "}
            <Link href={whatsappUrl} style={{ color: teal }}>
              WhatsApp
            </Link>
            .
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export const template = {
  component: OrderReceiptEmail,
  displayName: "Reçu de commande client",
  subject: (data: Record<string, unknown>) =>
    `Commande ${data["orderNumber"] ?? ""} confirmée — Papara Shop`,
  previewData: {
    customerName: "Awo",
    orderNumber: "CMD-1042",
    total: "450 000 FCFA",
    transactionId: "TX-123456",
    delivery: "Godomey Gare, Cotonou, Bénin",
    lines: [{ name: "Canon EOS R5", quantity: 1, lineTotal: "450 000 FCFA" }],
  },
} satisfies TemplateEntry;
