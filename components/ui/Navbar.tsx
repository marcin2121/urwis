"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import AuthModal from "@/components/AuthModal";
// IMPORTUJEMY urwisToast i typy, aby Navbar wiedział co się dzieje
import { urwisToast, UrwisNotification } from "@/components/ui/UrwisNotifications"; 
import {
  Home,
  Phone,
  Target,
  Trophy,
  Gamepad2,
  Brain,
  Bell,
  BellRing,
  LogOut,
  User,
  Gift
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { profile, session, signOut } = useSupabaseAuth();
  const isAuthenticated = !!session;

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authView, setAuthView] = useState<"login" | "register">("login");
  const [showNotifications, setShowNotifications] = useState(false);

  // --- KLUCZOWA ZMIANA: Dynamiczne powiadomienia w Navbarze ---
  const [activeNotifications, setActiveNotifications] = useState<UrwisNotification[]>([]);
  const hasUnread = activeNotifications.length > 0;

  // Nasłuchiwanie na nowe powiadomienia, aby dzwonek o nich wiedział
  useEffect(() => {
    const handleNewNotification = (e: any) => {
      // Zakładamy, że system powiadomień wysyła event 'urwis-new-note'
      // Dla uproszczenia na razie reagujemy na sam fakt istnienia nieodebranych rzeczy
    };
    // Jeśli chcesz, by dzwonek pokazywał historię, tutaj będziemy pobierać dane z Supabase.
    // Na ten moment ustawiamy na false, żeby nie "kłamał".
  }, []);

  const handleOpenAuth = (view: "login" | "register") => {
    setAuthView(view);
    setShowAuthModal(true);
  };

  // Obsługa kliknięcia (Zamyka popover i przekierowuje)
  const handleNav = (path: string) => {
    setShowNotifications(false);
    router.push(path);
  };

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Kontakt", href: "/kontakt", icon: Phone },
    { name: "Misje", href: "/misje", icon: Target },
    { name: "Nagrody", href: "/nagrody", icon: Trophy },
    { name: "Gry", href: "/gry", icon: Gamepad2 },
    { name: "Quiz", href: "/quiz", icon: Brain },
  ];

  const NotificationsPopover = () => (
    <AnimatePresence>
      {showNotifications && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full right-0 mt-4 w-72 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl rounded-2xl shadow-xl border border-black/5 z-50 p-2"
          >
            <div className="p-3 border-b border-black/5 dark:border-white/10">
              <h3 className="font-bold text-sm">Centrum Akcji</h3>
            </div>
            <div className="p-2 space-y-2">
              {/* Odbiór Misji -> /misje */}
              <div 
                onClick={() => handleNav('/misje')}
                className="flex gap-3 items-start p-3 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-xl transition-colors cursor-pointer group"
              >
                <div className="p-2 bg-orange-100 text-orange-600 rounded-full group-hover:scale-110 transition-transform">
                  <Target size={18} />
                </div>
                <div>
                  <p className="text-sm font-black">ODBIÓR MISJI</p>
                  <p className="text-[11px] text-zinc-500">Sprawdź nowe zadania i odbierz nagrody.</p>
                </div>
              </div>

              {/* Awans Poziomu -> /profil */}
              <div 
                onClick={() => handleNav('/profil')}
                className="flex gap-3 items-start p-3 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-colors cursor-pointer group"
              >
                <div className="p-2 bg-blue-100 text-blue-600 rounded-full group-hover:scale-110 transition-transform">
                  <User size={18} />
                </div>
                <div>
                  <p className="text-sm font-black">TWÓJ PROFIL</p>
                  <p className="text-[11px] text-zinc-500">Zobacz swój poziom i odblokowane bonusy.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 md:top-6 left-0 md:left-1/2 md:-translate-x-1/2 w-full md:w-auto md:min-w-[800px] z-50 px-4 md:px-0"
      >
        <div className="flex items-center justify-between md:justify-start gap-8 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl md:rounded-full px-6 py-4 md:py-3 shadow-2xl border border-white/20">
          
          <Link href="/" className="shrink-0 hover:scale-105 transition-transform">
            <Image src="/logo.png" alt="Urwis" width={40} height={40} />
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 rounded-full text-sm font-black flex items-center gap-2 transition-all ${
                    isActive ? "bg-black text-white dark:bg-white dark:text-black" : "text-zinc-500 hover:bg-black/5"
                  }`}
                >
                  <Icon size={16} /> {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3 md:ml-auto">
            {isAuthenticated ? (
              <>
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2 rounded-full hover:bg-black/5 transition-relative"
                  >
                    {/* Dzwonek świeci tylko jeśli faktycznie coś jest (hasUnread) */}
                    {hasUnread ? <BellRing className="text-orange-500 animate-bounce" size={22} /> : <Bell size={22} />}
                  </button>
                  <NotificationsPopover />
                </div>

                <Link href="/profil" className="hidden md:flex items-center gap-2 px-5 py-2 rounded-full bg-zinc-900 text-white text-sm font-black hover:bg-black transition-all">
                  <User size={16} /> {profile?.username || "Profil"}
                </Link>

                <button onClick={signOut} className="p-2 text-zinc-400 hover:text-red-500 transition-colors">
                  <LogOut size={20} />
                </button>
              </>
            ) : (
              <button onClick={() => handleOpenAuth("login")} className="px-6 py-2 bg-black text-white rounded-full font-black text-sm">
                Zaloguj się
              </button>
            )}
          </div>
        </div>
      </motion.div>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} defaultView={authView} />
    </>
  );
}
