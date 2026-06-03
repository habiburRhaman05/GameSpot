import type { ReactNode } from "react";

import { Footer } from "@/components/shared/footer";
import { Header } from "@/components/shared/header";
import { Newsletter } from "@/components/shared/newsletter";
import { PageTransition } from "@/components/shared/PageTransition";
import LenisProvider from "@/providers/lenis-provider";

export default function CommonLayout({ children }: { children: ReactNode }) {
  return (
    <LenisProvider>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <PageTransition>{children}</PageTransition>
        </main>
        <Newsletter />
        <Footer />
      </div>
    </LenisProvider>
  );
}
