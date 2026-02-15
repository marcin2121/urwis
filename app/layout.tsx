import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/ui/Navbar";
import { SupabaseAuthProvider } from "@/contexts/SupabaseAuthContext";
import { LoyaltyProvider } from "@/contexts/LoyaltyContext";
import { NotificationProvider } from "@/contexts/NotificationContext"; 
import HiddenUrwis from "@/components/HiddenUrwis";
import MissionTracker from "@/components/MissionTracker";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sklep Urwis",
  description: "Twój lokalny sklep w Białobrzegach",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl" suppressHydrationWarning>
      <body suppressHydrationWarning className="relative">
        <SupabaseAuthProvider>
          <LoyaltyProvider>
            <NotificationProvider>
              <MissionTracker /> {/* ← MUSI BYĆ TUTAJ! */}
              <Navbar />
              {children}
              <HiddenUrwis />
            </NotificationProvider>
          </LoyaltyProvider>
        </SupabaseAuthProvider>
      </body>
    </html>
  );
}
