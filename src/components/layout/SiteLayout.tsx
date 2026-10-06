import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { WhatsAppFloat } from "@/components/shared/WhatsAppFloat";

export function SiteLayout({ children, studio = false }: { children: ReactNode; studio?: boolean }) {
  return (
    <div className={studio ? "studio-home flex min-h-screen flex-col" : "flex min-h-screen flex-col"}>
      <Header studio={studio} />
      <main className="flex-1 pt-[72px]">{children}</main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
