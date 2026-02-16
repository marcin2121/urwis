import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/ui/Navbar";
import { AppProviders } from "@/components/providers/AppProviders"; // <--- Nowy import
import HiddenUrwis from "@/components/HiddenUrwis";
import MissionTracker from "@/components/MissionTracker";
import UrwisNotifications from "@/components/ui/UrwisNotifications";
import GamificationListener from "@/components/systems/GamificationListener";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sklep Urwis 🧸",
  description: "Twój lokalny sklep w Białobrzegach",
};

export const viewport = {
  colorScheme: 'light',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl" suppressHydrationWarning>
      <body suppressHydrationWarning className={inter.className}>
        <AppProviders>
          {/* Logika i UI Grywalizacji */}
          <GamificationListener />
          <MissionTracker />
          <UrwisNotifications />

          {/* UI Strony */}
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <HiddenUrwis />
        </AppProviders>
      </body>
    </html>
  );
}