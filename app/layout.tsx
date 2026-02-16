import type { Metadata } from "next";
// 1. Importujemy nowe fonty
import { Fredoka, Outfit } from "next/font/google";
import "./globals.css";
// ... reszta importów

// 2. Konfigurujemy fonty
const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-heading",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-body",
});

// ... metadata ...

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        // 3. Dodajemy zmienne CSS do body
        className={`${fredoka.variable} ${outfit.variable} font-body antialiased bg-slate-50 text-slate-900 overflow-x-hidden`}
      >
        {/* ... reszta providerów ... */}
      </body>
    </html>
  );
}