"use client";
import React, { useState, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import AuthModal from '@/components/AuthModal';

type NavItem = {
  name: string;
  href: string;
  icon: string;
};

const navItems: NavItem[] = [
  { name: "Strona główna", href: "/", icon: "🏠" },
  { name: "Kontakt", href: "/kontakt", icon: "📞" },
  { name: "Misje", href: "/misje", icon: "🎯" },
  { name: "Nagrody", href: "/nagrody", icon: "🏆" },
  { name: "Gry", href: "/gry", icon: "🎮" },
  { name: "Quiz", href: "/quiz", icon: "🧠" },
];

const Navbar = memo(() => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const { profile, session } = useSupabaseAuth();

  const handleAuthClick = useCallback(() => {
    setShowAuthModal(true);
    setIsOpen(false);
  }, []);

  const closeMenu = useCallback(() => setIsOpen(false), []);

  const toggleNotifications = useCallback(() => setNotificationsOpen(prev => !prev), []);

  return (
    <>
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-4 left-4 right-4 z-50"
      >
        <div className="bg-gradient-to-r from-[#E94444] via-[#1473E6] to-[#FFBE0B] rounded-3xl p-4 shadow-2xl backdrop-blur-xl border border-white/20">
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-4 shadow-inner">
            <div className="flex items-center justify-between gap-4">

              <Link href="/" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/50 transition-all group flex-shrink-0">
                <motion.div
                  className="w-12 h-12 relative"
                  whileHover={{ scale: 1.1, rotate: 10 }}
                >
                  <div className="w-full h-full bg-gradient-to-br from-red-500 to-orange-500 rounded-xl shadow-2xl border-4 border-white flex items-center justify-center">
                    <span className="text-2xl font-black">🦸</span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#FFBE0B] rounded-full border-3 border-white shadow-lg text-xs font-black text-gray-900 flex items-center justify-center">
                    U
                  </div>
                </motion.div>
                <div className="hidden md:block">
                  <div className="text-xl font-black text-gray-900 tracking-tight">URWIS</div>
                  <div className="text-xs font-bold text-[#E94444] uppercase tracking-wider">Białobrzegi</div>
                </div>
              </Link>

              <div className="hidden xl:flex items-center gap-2 flex-1 justify-center max-w-2xl">
                {navItems.map((item, index) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group relative px-4 py-3 text-sm font-bold text-gray-800 rounded-xl hover:bg-gradient-to-r hover:from-red-100 hover:to-blue-100 hover:shadow-lg transition-all flex items-center gap-2 whitespace-nowrap"
                  >
                    <span aria-hidden>{item.icon}</span>
                    <span>{item.name}</span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-[#E94444] to-[#1473E6] rounded-xl opacity-0 group-hover:opacity-10"
                      layoutId={`nav-item-${index}`}
                      aria-hidden
                    />
                  </Link>
                ))}
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">

                <motion.div
                  className="relative p-3 rounded-xl bg-gradient-to-br from-[#FFBE0B] to-orange-500 text-white shadow-xl hover:shadow-2xl cursor-pointer transition-all"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleNotifications}
                >
                  <span className="text-xl relative z-10">🔔</span>
                  <motion.div
                    className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full border-3 border-white shadow-lg text-xs font-bold flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    3
                  </motion.div>

                  <AnimatePresence>
                    {notificationsOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        className="absolute top-full right-0 mt-2 w-80 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100 py-4 px-4 z-50"
                      >
                        <h3 className="font-black text-lg mb-4 flex items-center gap-2 text-gray-800 border-b border-gray-200 pb-3">
                          🔔 Powiadomienia
                          <span className="text-sm text-red-500 bg-red-100 px-2 py-1 rounded-full font-bold">(3 nowe)</span>
                        </h3>
                        <div className="space-y-3 max-h-64 overflow-y-auto">
                          <div className="p-4 bg-blue-50 rounded-xl border-l-4 border-blue-500 hover:bg-blue-100 transition-colors">
                            <div className="font-bold text-sm mb-1">🎯 Nowa misja "Super Sprzedawca"!</div>
                            <div className="text-xs text-gray-600">5 minut temu</div>
                          </div>
                          <div className="p-4 bg-green-50 rounded-xl border-l-4 border-green-500 hover:bg-green-100 transition-colors">
                            <div className="font-bold text-sm mb-1">🏆 Zdobyłeś odznakę "Punktarz"!</div>
                            <div className="text-xs text-gray-600">2 godziny temu</div>
                          </div>
                          <div className="p-4 bg-yellow-50 rounded-xl border-l-4 border-yellow-500 hover:bg-yellow-100 transition-colors">
                            <div className="font-bold text-sm mb-1">💎 Dzienna nagroda czeka!</div>
                            <div className="text-xs text-gray-600 font-bold text-yellow-800">Zbierz teraz</div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {session && profile ? (
                  <Link
                    href="/profil"
                    className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-[#E94444] to-[#1473E6] text-white shadow-xl hover:shadow-2xl transition-all group"
                  >
                    <div className="w-10 h-10 bg-white/30 rounded-xl flex items-center justify-center shadow-md">
                      <span className="text-xl">🦸‍♂️</span>
                    </div>
                    <div className="hidden md:block min-w-0">
                      <div className="font-bold text-sm truncate" title={profile.username || 'Profil'}>
                        {profile.username || 'Gracz'}
                      </div>
                      <div className="text-xs opacity-90">Lv. {profile.level ?? 1}</div>
                    </div>
                  </Link>
                ) : (
                  <motion.button
                    onClick={handleAuthClick}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold shadow-xl hover:shadow-2xl hover:from-emerald-600 hover:to-emerald-700 transition-all whitespace-nowrap"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    👤 Załóż konto
                  </motion.button>
                )}
              </div>

              <motion.button
                className="xl:hidden p-3 rounded-xl bg-white/80 backdrop-blur shadow-lg hover:shadow-xl hover:bg-white transition-all"
                onClick={() => setIsOpen(!isOpen)}
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.1 }}
                aria-label="Menu"
              >
                <motion.div
                  animate={{ rotate: isOpen ? 90 : 0 }}
                  className="w-6 h-6 flex flex-col justify-center items-center gap-1"
                >
                  <motion.span className="w-full h-0.5 bg-gray-800 rounded origin-center" animate={{ rotate: isOpen ? 45 : 0, y: isOpen ? 1 : 0 }} transition={{ duration: 0.2 }} />
                  <motion.span className="w-full h-0.5 bg-gray-800 rounded origin-center" animate={{ opacity: isOpen ? 0 : 1 }} />
                  <motion.span className="w-full h-0.5 bg-gray-800 rounded origin-center" animate={{ rotate: isOpen ? -45 : 0, y: isOpen ? -1 : 0 }} transition={{ duration: 0.2 }} />
                </motion.div>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm xl:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMenu}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="fixed inset-0 z-50 xl:hidden flex items-end justify-center p-8"
            >
              <motion.div
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                exit={{ y: 100 }}
                className="w-full max-w-md max-h-[85vh] overflow-hidden"
              >
                <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border-4 border-white/30 h-full flex flex-col">

                  {session && profile && (
                    <Link href="/profil" onClick={closeMenu} className="mb-8 p-6 bg-gradient-to-r from-[#E94444] to-[#1473E6] text-white rounded-2xl shadow-2xl hover:shadow-3xl transition-all flex items-center gap-4 group">
                      <div className="w-16 h-16 bg-white/30 rounded-2xl flex items-center justify-center shadow-lg">
                        <span className="text-2xl">🦸‍♂️</span>
                      </div>
                      <div>
                        <div className="text-xl font-black">{profile.username || 'Gracz'}</div>
                        <div className="text-lg font-bold text-yellow-400">Lv. {profile.level ?? 1}</div>
                      </div>
                    </Link>
                  )}

                  <div className="space-y-4 flex-1 overflow-y-auto pb-8">
                    {navItems.map((item, index) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={closeMenu}
                        className="flex items-center gap-4 p-6 rounded-2xl text-xl font-black text-gray-800 hover:bg-gradient-to-r hover:from-red-100 hover:to-blue-100 hover:shadow-xl transition-all shadow-md group border border-transparent hover:border-red-200"
                      >
                        <span className="text-3xl flex-shrink-0">{item.icon}</span>
                        <span className="flex-1 font-bold">{item.name}</span>
                        <motion.span
                          className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full ml-auto opacity-0 group-hover:opacity-100 shadow-lg"
                          layoutId={`mobile-arrow-${index}`}
                          initial={{ scale: 0 }}
                          whileHover={{ scale: 1.3 }}
                        />
                      </Link>
                    ))}
                  </div>

                  <div className="pt-8 mt-8 border-t-4 border-[#FFBE0B]/50 pt-6">
                    {session && profile ? (
                      <Link
                        href="/profil"
                        onClick={closeMenu}
                        className="block w-full p-6 rounded-2xl bg-gradient-to-r from-[#E94444] to-[#1473E6] text-white font-black text-xl shadow-2xl hover:shadow-3xl hover:scale-[1.02] transition-all text-center border-4 border-transparent hover:border-white/50"
                      >
                        👤 Mój Profil
                      </Link>
                    ) : (
                      <motion.button
                        onClick={handleAuthClick}
                        className="w-full p-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-black text-xl shadow-2xl hover:shadow-3xl hover:scale-[1.02] hover:from-emerald-600 hover:to-emerald-700 transition-all border-4 border-transparent hover:border-white/50"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        👤 Załóż konto GRATIS
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
          </AnimatePresence>

        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </>
      );
});

      Navbar.displayName = 'Navbar';
      export default Navbar;
