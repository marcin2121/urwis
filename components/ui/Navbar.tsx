"use client";
import React, { useState, useCallback, memo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import AuthModal from '@/components/AuthModal';

type NavItem = {
  name: string;
  href: string;
  icon: string;
};

type Profile = {
  username: string;
  level?: number;
};

type Session = {
  // Dodaj typy dla sesji jeśli potrzebne
};

const navItems: NavItem[] = [
  { name: "Home", href: "/", icon: "🏠" },
  { name: "Kontakt", href: "/kontakt", icon: "📞" },
  { name: "Misje", href: "/misje", icon: "🎯" },
  { name: "Nagrody", href: "/nagrody", icon: "🏆" },
  { name: "Gry", href: "/gry", icon: "🎮" },
  { name: "Quiz", href: "/quiz", icon: "🧠" },
];

const Navbar = memo(() => {
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [notificationsOpen, setNotificationsOpen] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

  const { profile, session, signOut, isLoading } = useSupabaseAuth() as {
    profile: Profile | null;
    session: Session | null;
    signOut: () => Promise<void>;
    isLoading: boolean;
  };

  const toggleMobile = useCallback(() => setMobileOpen(prev => !prev), []);
  const closeMobile = useCallback(() => setMobileOpen(false), []);
  const toggleNotifications = useCallback(() => setNotificationsOpen(prev => !prev), []);

  const handleAuthClick = useCallback(() => {
    setShowAuthModal(true);
  }, []);

  const handleSignOut = useCallback(async () => {
    await signOut();
  }, [signOut]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileOpen(false);
        setNotificationsOpen(false);
        setShowAuthModal(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <>
      {/* Dynamiczna wyspa z backdrop-blur tylko pod navbar */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-6 left-1/2 -translate-x-1/2 z-50"
      >
        {/* Podkładka blur tylko pod navbar */}
        <motion.div
          className="absolute inset-0 -top-2 -bottom-2 backdrop-blur-xl bg-white/20 dark:bg-black/20 rounded-3xl -z-10"
          style={{
            maskImage: 'radial-gradient(circle at center, black 60%, transparent 70%)',
            WebkitMaskImage: 'radial-gradient(circle at center, black 60%, transparent 70%)'
          }}
        />

        <div className="relative bg-white/95 dark:bg-gray-900/95 backdrop-blur-3xl shadow-2xl border border-white/30 dark:border-gray-800/40 rounded-3xl p-4 md:p-6 max-w-5xl w-full mx-4 xl:mx-0">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-3 group p-3 -m-3 rounded-2xl hover:bg-gradient-to-r hover:from-red-500/10 hover:to-blue-500/10 transition-all duration-300 flex-shrink-0 flex-0"
              aria-label="Urwis - Strona główna"
            >
              <motion.div
                className="relative w-14 h-14 flex-shrink-0"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <div className="w-full h-full bg-gradient-to-br from-[#E94444] to-[#1473E6] rounded-2xl shadow-xl border-4 border-white/80 dark:border-gray-200/50 flex items-center justify-center">
                  <span className="text-3xl font-black drop-shadow-md">🦸</span>
                </div>
                <div className="absolute -top-1 -right-1 w-7 h-7 bg-[#FFBE0B] rounded-full border-4 border-white shadow-lg flex items-center justify-center text-xs font-black text-gray-900">
                  U
                </div>
              </motion.div>
              <div className="hidden lg:block">
                <h1 className="text-2xl font-black bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text leading-tight">URWIS</h1>
                <p className="text-xs font-bold uppercase tracking-widest text-[#E94444]">Białobrzegi</p>
              </div>
            </Link>

            {/* Desktop Navigation - skraca się gdy mało miejsca */}
            <div className="hidden xl:flex items-center gap-2 md:gap-3 flex-1 justify-center max-w-4xl min-w-0">
              {navItems.map((item, idx) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group relative px-3 md:px-4 lg:px-6 py-3 text-sm lg:text-base font-bold text-gray-800 hover:text-[#E94444] rounded-2xl hover:bg-gradient-to-r hover:from-[#E94444]/5 hover:to-[#1473E6]/5 transition-all duration-300 flex items-center gap-2 md:gap-3 shadow-sm hover:shadow-md whitespace-nowrap flex-shrink-0"
                  aria-label={item.name}
                >
                  <span aria-hidden className="text-xl md:text-2xl opacity-75 group-hover:opacity-100 transition-opacity flex-shrink-0">{item.icon}</span>
                  <span className="hidden xl:inline">{item.name}</span>
                  <motion.div
                    layoutId={`desktop-nav-${idx}`}
                    className="absolute inset-0 bg-gradient-to-r from-[#E94444]/10 to-[#1473E6]/10 rounded-2xl opacity-0 group-hover:opacity-100"
                  />
                </Link>
              ))}
            </div>

            {/* Right side - ograniczona szerokość */}
            <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-shrink-0">
              {/* Notifications */}
              <motion.div
                className="relative p-2 md:p-3 rounded-2xl bg-gradient-to-br from-[#FFBE0B] to-orange-500 text-white shadow-xl hover:shadow-2xl cursor-pointer transition-all duration-300 flex-shrink-0"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleNotifications}
                aria-label="Powiadomienia"
              >
                <span className="text-xl md:text-2xl relative z-10">🔔</span>
                <motion.span
                  className="absolute -top-0.5 md:-top-1 -right-0.5 md:-right-1 w-5 md:w-7 h-5 md:h-7 bg-red-500 rounded-full border-2 md:border-3 border-white shadow-lg text-xs font-black flex items-center justify-center"
                  initial={{ scale: 0, y: -5 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 500 }}
                >
                  3
                </motion.span>

                <AnimatePresence>
                  {notificationsOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 8 }}
                      className="absolute top-full right-0 mt-2 md:mt-3 w-80 md:w-96 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 py-4 px-5 z-50"
                      style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
                    >
                      {/* Zawartość powiadomień bez zmian */}
                      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-200/50 dark:border-gray-700/50">
                        <span className="text-2xl">🔔</span>
                        <div>
                          <h3 className="font-black text-xl text-gray-900 dark:text-white">Powiadomienia</h3>
                          <span className="text-sm font-bold text-red-500 bg-red-100/50 dark:bg-red-900/30 px-3 py-1 rounded-full">
                            3 nowe
                          </span>
                        </div>
                      </div>
                      <div className="space-y-3 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                        <div className="group p-4 rounded-xl hover:bg-blue-50/50 dark:hover:bg-blue-900/20 border-l-4 border-blue-400 transition-all cursor-pointer">
                          <div className="flex items-start gap-3">
                            <span className="text-2xl flex-shrink-0 mt-0.5">🎯</span>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-sm text-gray-900 dark:text-white leading-tight">
                                Nowa misja "Super Sprzedawca" dostępna!
                              </p>
                              <p className="text-xs text-gray-500 mt-1">5 minut temu</p>
                            </div>
                          </div>
                        </div>
                        <div className="group p-4 rounded-xl hover:bg-green-50/50 dark:hover:bg-green-900/20 border-l-4 border-green-400 transition-all cursor-pointer">
                          <div className="flex items-start gap-3">
                            <span className="text-2xl flex-shrink-0 mt-0.5">🏆</span>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-sm text-gray-900 dark:text-white leading-tight">
                                Zdobyłeś odznakę "Punktarz"!
                              </p>
                              <p className="text-xs text-gray-500 mt-1">2 godziny temu</p>
                            </div>
                          </div>
                        </div>
                        <div className="group p-4 rounded-xl hover:bg-yellow-50/50 dark:hover:bg-yellow-900/20 border-l-4 border-yellow-400 transition-all cursor-pointer">
                          <div className="flex items-start gap-3">
                            <span className="text-2xl flex-shrink-0 mt-0.5">💎</span>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-sm text-gray-900 dark:text-white leading-tight">
                                Dzienna nagroda czeka na ciebie!
                              </p>
                              <p className="text-xs text-gray-500 font-bold mt-1">Zbierz teraz</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Profile/Login button - responsywny */}
              <div className="flex-shrink-0 min-w-0">
                {isLoading ? (
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-200/50 dark:bg-gray-700/50 rounded-2xl animate-pulse shadow-lg flex-shrink-0" />
                ) : session && profile ? (
                  <div className="flex items-center gap-2 md:gap-3 p-2 md:p-4 rounded-2xl bg-gradient-to-r from-[#E94444] to-[#1473E6] text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] flex-shrink-0">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-white/30 rounded-xl flex items-center justify-center shadow-lg backdrop-blur-sm flex-shrink-0">
                      <span className="text-lg md:text-xl">👤</span>
                    </div>
                    <div className="hidden md:block min-w-0 flex-1 max-w-32">
                      <div className="font-bold text-xs md:text-sm truncate" title={profile.username}>
                        {profile.username}
                      </div>
                      <div className="text-xs opacity-90">Lv. {profile.level ?? 1}</div>
                    </div>
                  </div>
                ) : (
                  <motion.button
                    onClick={handleAuthClick}
                    className="px-4 py-2 md:px-6 md:py-3 md:px-8 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold text-xs md:text-sm shadow-xl hover:shadow-2xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 whitespace-nowrap flex-shrink-0 max-w-[140px] md:max-w-none"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    👤 Załóż konto
                  </motion.button>
                )}
              </div>

              {/* Mobile menu button */}
              <motion.button
                className="xl:hidden p-2 md:p-3 rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur shadow-lg hover:shadow-xl transition-all duration-300 flex-shrink-0"
                onClick={toggleMobile}
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.1 }}
                aria-label="Otwórz menu"
                aria-expanded={mobileOpen}
              >
                <motion.div
                  className="w-5 h-5 md:w-6 md:h-6 flex flex-col justify-center gap-1 md:gap-1.5"
                  animate={{ rotate: mobileOpen ? 90 : 0 }}
                >
                  <motion.span
                    className="h-0.5 w-full bg-gray-800 rounded-full origin-center"
                    animate={{ rotate: mobileOpen ? 45 : 0, y: mobileOpen ? 1.5 : 0 }}
                    transition={{ duration: 0.2 }}
                  />
                  <motion.span
                    className="h-0.5 w-full bg-gray-800 rounded-full origin-center"
                    animate={{ opacity: mobileOpen ? 0 : 1 }}
                  />
                  <motion.span
                    className="h-0.5 w-full bg-gray-800 rounded-full origin-center"
                    animate={{ rotate: mobileOpen ? -45 : 0, y: mobileOpen ? -1.5 : 0 }}
                    transition={{ duration: 0.2 }}
                  />
                </motion.div>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu - bez zmian */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm xl:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobile}
            />
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 30 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 xl:hidden w-[calc(100%-2rem)] max-w-md max-h-[85vh]"
            >
              <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 dark:border-gray-800/50 overflow-hidden flex flex-col h-full">
                {session && profile && !isLoading && (
                  <Link
                    href="/profil"
                    onClick={closeMobile}
                    className="p-8 border-b border-gray-200/50 dark:border-gray-700/50 hover:bg-gradient-to-r hover:from-red-500/5 hover:to-blue-500/5 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 bg-gradient-to-br from-[#E94444] to-[#1473E6] rounded-2xl flex items-center justify-center shadow-2xl flex-shrink-0">
                        <span className="text-3xl">🦸‍♂️</span>
                      </div>
                      <div>
                        <h2 className="text-2xl font-black text-gray-900 dark:text-white">{profile.username}</h2>
                        <div className="text-xl font-bold text-yellow-500 bg-yellow-100/50 dark:bg-yellow-900/30 px-4 py-1 rounded-full inline-block mt-1">
                          Lv. {profile.level ?? 1}
                        </div>
                      </div>
                    </div>
                  </Link>
                )}

                <div className="flex-1 overflow-y-auto py-8 px-6 space-y-4">
                  {navItems.map((item, idx) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeMobile}
                      className="flex items-center gap-4 p-6 rounded-2xl text-xl font-bold text-gray-800 dark:text-gray-200 hover:bg-gradient-to-r hover:from-[#E94444]/10 hover:to-[#1473E6]/10 shadow-sm hover:shadow-lg border border-transparent hover:border-[#E94444]/30 transition-all duration-300 group"
                    >
                      <span className="text-3xl flex-shrink-0">{item.icon}</span>
                      <span className="flex-1">{item.name}</span>
                      <motion.span
                        className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full ml-auto shadow-lg opacity-0 group-hover:opacity-100"
                        layoutId={`mobile-nav-${idx}`}
                        initial={{ scale: 0 }}
                        whileHover={{ scale: 1.3 }}
                      />
                    </Link>
                  ))}
                </div>

                <div className="p-8 pt-0 border-t border-gray-200/50 dark:border-gray-700/50">
                  {isLoading ? (
                    <div className="flex items-center gap-3 p-6 rounded-2xl bg-gray-100/50 dark:bg-gray-800/50 animate-pulse">
                      <div className="w-12 h-12 bg-white/50 dark:bg-gray-700 rounded-xl animate-pulse" />
                      <div className="flex-1 space-y-2">
                        <div className="h-5 bg-white/30 dark:bg-gray-600 rounded-full animate-pulse w-3/4" />
                        <div className="h-4 bg-white/20 dark:bg-gray-700 rounded-full animate-pulse w-1/2" />
                      </div>
                    </div>
                  ) : session && profile ? (
                    <Link
                      href="/profil"
                      onClick={closeMobile}
                      className="block w-full p-6 rounded-2xl bg-gradient-to-r from-[#E94444] to-[#1473E6] text-white font-black text-xl shadow-2xl hover:shadow-3xl hover:scale-[1.02] transition-all text-center border-2 border-transparent hover:border-white"
                    >
                      👤 Mój Profil
                    </Link>
                  ) : (
                    <motion.button
                      onClick={handleAuthClick}
                      className="w-full p-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-black text-xl shadow-2xl hover:shadow-3xl hover:scale-[1.02] hover:from-emerald-600 hover:to-emerald-700 transition-all border-2 border-transparent hover:border-white"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      👤 Załóż konto GRATIS
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
});

Navbar.displayName = 'Navbar';
export default Navbar;
