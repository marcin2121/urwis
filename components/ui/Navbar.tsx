"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import AuthModal from "@/components/AuthModal";
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
  Gift,
  Menu,
  X
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { profile, session, signOut } = useSupabaseAuth();
  const isAuthenticated = !!session;

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authView, setAuthView] = useState<"login" | "register">("login");
  
  // --- SEKCJA POWIADOMIEŃ ---
  const [showNotifications, setShowNotifications] = useState(false);
  // Zmieniamy na FALSE, żeby dzwonek nie świecił się bez powodu
  const [hasUnreadRewards, setHasUnreadRewards] = useState(false); 

  const handleOpenAuth = (view: "login" | "register") => {
    setAuthView(view);
    setShowAuthModal(true);
  };

  // Funkcja nawigacji z powiadomień
  const handleNotificationClick = (path: string) => {
    setShowNotifications(false); // Zamknij dymek
    router.push(path); // Przekieruj
  };

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Kontakt", href: "/kontakt", icon: Phone },
    { name: "Misje", href: "/misje", icon: Target },
    { name: "Nagrody", href: "/nagrody", icon: Trophy },
    { name: "Gry", href: "/gry", icon: Gamepad2 },
    { name: "Quiz", href: "/quiz", icon: Brain },
  ];

  // Komponent Dymka Powiadomień
  const NotificationsPopover = () => (
    <AnimatePresence>
      {showNotifications && (
        <>
          {/* Tło zamykające dymek po kliknięciu poza nim */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowNotifications(false)}
          />
          
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-4 w-80 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl rounded-2xl shadow-xl border border-black/5 dark:border-white/10 overflow-hidden z-50"
          >
            <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-black/20 flex justify-between items-center">
              <h3 className="font-black text-sm uppercase tracking-wider text-gray-600 dark:text-gray-300">
                Centrum Akcji
              </h3>
              {hasUnreadRewards && (
                <span className="text-[10px] bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-bold">
                  Nowe!
                </span>
              )}
            </div>

            <div className="p-2 space-y-1">
              {/* Jeśli nie ma powiadomień - pokaż pusty stan (ale pozwól testować) */}
              {!hasUnreadRewards ? (
                <div className="text-center py-6 px-4">
                  <div className="bg-gray-100 dark:bg-gray-800 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400">
                    <Bell size={20} />
                  </div>
                  <p className="text-sm font-bold text-gray-500">Wszystko na bieżąco!</p>
                  <p className="text-xs text-gray-400 mt-1">Brak nowych powiadomień.</p>
                  
                  {/* Przycisk TYLKO DO TESTÓW (możesz go usunąć później) */}
                  <button 
                    onClick={() => setHasUnreadRewards(true)}
                    className="mt-4 text-[10px] text-blue-500 underline hover:text-blue-600"
                  >
                    (Test: Symuluj otrzymanie nagrody)
                  </button>
                </div>
              ) : (
                <>
                  {/* Kafel 1: Misje */}
                  <div 
                    onClick={() => handleNotificationClick('/misje')}
                    className="group flex gap-3 items-start p-3 hover:bg-orange-50 dark:hover:bg-orange-900/10 rounded-xl transition-all cursor-pointer border border-transparent hover:border-orange-100"
                  >
                    <div className="p-2 bg-orange-100 text-orange-600 rounded-full shrink-0 group-hover:scale-110 transition-transform">
                      <Target size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-black text-gray-800 dark:text-gray-200">Odbiór Misji</p>
                      <p className="text-xs text-gray-500 leading-tight mt-0.5">
                        Nowe zadania czekają na realizację. Kliknij, aby sprawdzić.
                      </p>
                    </div>
                  </div>

                  {/* Kafel 2: Profil */}
                  <div 
                    onClick={() => handleNotificationClick('/profil')}
                    className="group flex gap-3 items-start p-3 hover:bg-blue-50 dark:hover:bg-blue-900/10 rounded-xl transition-all cursor-pointer border border-transparent hover:border-blue-100"
                  >
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-full shrink-0 group-hover:scale-110 transition-transform">
                      <Trophy size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-black text-gray-800 dark:text-gray-200">Twój Status</p>
                      <p className="text-xs text-gray-500 leading-tight mt-0.5">
                        Zobacz swój postęp i odblokowane medale w profilu.
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {/* --- DESKTOP NAVBAR --- */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
        className="fixed top-0 md:top-6 left-0 md:left-1/2 md:-translate-x-1/2 w-full md:w-auto md:min-w-[850px] z-50 px-4 md:px-0 font-body"
      >
        <div className="flex items-center justify-between gap-6 bg-white/80 dark:bg-black/80 backdrop-blur-xl md:rounded-full px-6 py-3 shadow-lg border border-white/20">

          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0 hover:scale-105 transition-transform">
            <Image
              src="/logo.png"
              alt="Urwis Logo"
              width={42}
              height={42}
              className="object-contain"
            />
          </Link>

          {/* Desktop Links */}
          <nav className="hidden md:flex items-center gap-1 font-heading">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-4 py-2.5 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
                    isActive
                      ? "bg-black text-white dark:bg-white dark:text-black shadow-md transform scale-105"
                      : "text-zinc-500 hover:text-black dark:hover:text-white hover:bg-black/5"
                  }`}
                >
                  <Icon size={16} strokeWidth={2.5} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User Actions */}
          <div className="flex items-center gap-3 md:ml-auto">
            {isAuthenticated ? (
              <>
                {/* Dzwonek Powiadomień */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className={`p-2.5 rounded-full transition-all duration-300 ${
                      showNotifications ? 'bg-black/10' : 'hover:bg-black/5'
                    }`}
                  >
                    {hasUnreadRewards ? (
                      <div className="relative">
                        <BellRing size={20} className="text-orange-500 animate-[wiggle_1s_ease-in-out_infinite]" />
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
                        </span>
                      </div>
                    ) : (
                      <Bell size={20} className="text-zinc-600 dark:text-zinc-300" />
                    )}
                  </button>
                  <NotificationsPopover />
                </div>

                {/* Profil Desktop */}
                <Link
                  href="/profil"
                  className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-black hover:bg-black hover:shadow-lg transition-all text-sm font-bold tracking-wide"
                >
                  <User size={16} />
                  {profile?.username || "Profil"}
                </Link>

                {/* Wyloguj */}
                <button
                  onClick={signOut}
                  className="p-2.5 rounded-full text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  title="Wyloguj się"
                >
                  <LogOut size={20} />
                </button>
              </>
            ) : (
              // Widok niezalogowany
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenAuth("login")}
                  className="hidden sm:block px-5 py-2.5 text-sm font-bold text-zinc-600 hover:text-black transition-colors"
                >
                  Zaloguj
                </button>
                <button
                  onClick={() => handleOpenAuth("register")}
                  className="px-6 py-2.5 text-sm font-bold bg-black text-white rounded-full hover:bg-zinc-800 hover:scale-105 transition-all shadow-md"
                >
                  Dołącz
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* --- MOBILE BOTTOM NAV --- */}
      <div className="md:hidden fixed bottom-0 left-0 w-full z-40 bg-white/90 dark:bg-black/90 backdrop-blur-xl border-t border-black/5 pb-safe safe-area-bottom">
        <nav className="flex items-center justify-around px-2 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center gap-1 p-2 w-16"
              >
                <div
                  className={`p-1.5 rounded-2xl transition-all ${
                    isActive
                      ? "bg-black text-white shadow-md transform -translate-y-1"
                      : "text-zinc-400"
                  }`}
                >
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span
                  className={`text-[10px] font-bold tracking-tight ${
                    isActive ? "text-black dark:text-white" : "text-zinc-400"
                  }`}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}
          {/* Dodatkowy przycisk Profilu na mobile */}
          {isAuthenticated && (
             <Link
             href="/profil"
             className="flex flex-col items-center gap-1 p-2 w-16"
           >
             <div className={`p-1.5 rounded-2xl text-zinc-400 ${pathname === '/profil' ? 'bg-blue-600 text-white' : ''}`}>
               <User size={20} />
             </div>
             <span className="text-[10px] font-bold text-zinc-400">Profil</span>
           </Link>
          )}
        </nav>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultView={authView}
      />
    </>
  );
}
