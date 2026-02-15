import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/ui/Navbar";
import { SupabaseAuthProvider } from "@/contexts/SupabaseAuthContext";
import { SupabaseLoyaltyProvider } from "@/contexts/SupabaseLoyaltyContext";
import { LeaderboardProvider } from "@/contexts/LeaderboardContext";
import { AchievementsProvider } from "@/contexts/AchievementsContext";
import { StreakProvider } from "@/contexts/StreakContext";
import { EventsProvider } from "@/contexts/EventsContext";
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
          <SupabaseLoyaltyProvider>
            <LeaderboardProvider>
              <AchievementsProvider>
                <StreakProvider>
                  <EventsProvider>
                    <NotificationProvider>
                      <MissionTracker /> {/* ← MUSI BYĆ TUTAJ! */}
                      <Navbar />
                      {children}
                      <HiddenUrwis />
                    </NotificationProvider>
                  </EventsProvider>
                </StreakProvider>
              </AchievementsProvider>
            </LeaderboardProvider>
          </SupabaseLoyaltyProvider>
        </SupabaseAuthProvider>
      </body>
    </html>
  );
}
