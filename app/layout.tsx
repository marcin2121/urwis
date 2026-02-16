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
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const inter = Inter({ subsets: ["latin"] });

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    }
  }
})

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
        <QueryClientProvider client={queryClient}>
          <SupabaseAuthProvider>
            <SupabaseLoyaltyProvider>
              <LeaderboardProvider>
                <AchievementsProvider>
                  <StreakProvider>
                    <EventsProvider>
                      <NotificationProvider>
                        <MissionTracker />
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
        </QueryClientProvider>
      </body>
    </html>
  );
}
