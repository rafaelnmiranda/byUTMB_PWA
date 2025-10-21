import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/Header";
import ServiceWorkerBootstrap from "./components/PwaBootstrap";
import TabMenu from "./components/TabMenu";
import WhatsAppButton from "./components/WhatsAppButton";
import { LanguageProvider } from "./hooks/useLanguage";
import { ThemeProvider } from "./hooks/useTheme";

export const metadata: Metadata = {
  title: "byUTMB • Paraty Brazil 2025",
  description:
    "Progressive Web App for Paraty Brazil by UTMB — agenda, routes, partners, media, and live updates for athletes and visitors.",
  manifest: "/manifest.json",
  themeColor: "#00C4B3",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <body className="font-body antialiased text-primary">
        <ThemeProvider>
          <LanguageProvider>
            <ServiceWorkerBootstrap />
            <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col">
              <Header />
              <main className="flex-1 w-full px-5 pb-[calc(var(--tab-bar-height)+32px)] pt-6">
                {children}
              </main>
              <TabMenu />
              <WhatsAppButton />
            </div>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
