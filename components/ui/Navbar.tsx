"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import AuthModal from '@/components/AuthModal';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { profile, session, signOut } = useSupabaseAuth();
  const isAuthenticated = !!session;

  const navItems = [
    { name: "🏠 Strona główna", href: "/" },
    { name: "📞 Kontakt", href: "/kontakt" },
    { name: "🎯 Misje", href: "/misje" },
    { name: "🏆 Nagrody", href: "/nagrody" },
    { name: "🎮 Gry", href: "/gry" },
    { name: "🧠 Quiz", href: "/quiz" },
  ];

  return (
    <>
      {/* FIXED TOP Navbar */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="fixed top-0 left-0 w-full z-50 shadow-2xl"
      >
        <div className="relative bg-gradient-to-r from-[#E94444] via-[#1473E6] to-[#FFBE0B] p-2 rounded-b-3xl mx-4 mt-2 shadow-[0_20px_40px_rgba(233,68,68,0.3)] backdrop-blur-xl">
          <div className="bg-white/95 backdrop-blur-3xl rounded-3xl p-3 shadow-inner">
            <nav className="flex items-center justify-between px-6">

              {/* LOGO */}
              <Link href="/" className="flex items-center gap-3 group p-2 -m-2 rounded-2xl hover:bg-white/50 transition-all">
                <motion.div
                  whileHover={{ scale: 1.15, rotate: 360 }}
                  transition={{ duration: 0.6, type: "spring" }}
                  className="relative"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-3xl shadow-2xl flex items-center justify-center border-4 border-white drop-shadow-xl">
                    <span className="text-3xl">🦸‍♂️</span>
                  </div>
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-[#FFBE0B] rounded-full border-3 border-white shadow-lg flex items-center justify-center text-xs font-black">
                    U
                  </span>
                </motion.div>
                <div className="hidden sm:block">
                  <div className="text-xl font-black text-gray-900 drop-shadow-sm">URWIS</div>
                  <div className="text-xs font-bold text-gray-700 uppercase tracking-wider">Białobrzegi</div>
                </div>
              </Link>

              {/* DESKTOP NAV */}
              <div className="hidden lg:flex items-center gap-1">
                {navItems.map((item, idx) => (
                  <Link
                    key={idx}
                    href={item.href}
                    className="relative px-4 py-3 text-sm font-black text-gray-800 hover:text-[#E94444] transition-all group rounded-2xl hover:bg-gradient-to-r hover:from-[#E94444]/10 hover:to-[#1473E6]/10"
                  >
                    <span className="flex items-center gap-2">
                      <span>{item.icon}</span>
                      <span className="hidden sm:inline">{item.name.split(' ')[1]}</span>
                    </span>
                  </Link>
                ))}
              </div>

              {/* 🔥 USER SECTION – JEDNOLITY STYL! */}
              <div className="flex items-center gap-2">

                {/* Notifications */}
                <motion.div
                  className="p-3 rounded-2xl bg-gradient-to-br from-[#FFBE0B] to-orange-500 shadow-xl cursor-pointer hover:shadow-2xl hover:scale-110 transition-all relative"
                  whileHover={{ rotate: 360 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-2xl z-10 relative">🔔</span>
                  <motion.div
                    className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full text-xs text-white font-black flex items-center justify-center shadow-lg"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    3
                  </motion.div>
                </motion.div>

                {/* 🔥 LOGGED IN – JEDEN STYL! */}
                {isAuthenticated && profile ? (
                  <>
                    {/* Profil Button */}
                    <Link href="/profil">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#E94444] to-[#1473E6] text-white font-black shadow-xl hover:shadow-2xl transition-all flex items-center gap-3"
                      >
                        <span className="text-2xl">{profile.avatar_url ? '👤' : '🦸‍♂️'}</span>
                        <div className="hidden sm:block text-right">
                          <div className="text-sm font-bold">{profile.username}</div>
                          <div className="text-xs">Lv.{profile.level}</div>
                        </div>
                        <span className="sm:hidden text-lg">👤</span>
                      </motion.div>
                    </Link>

                    {/* Wyloguj – TEN SAM STYL! */}
                    <motion.button
                      onClick={signOut}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 text-white font-black shadow-xl hover:shadow-2xl hover:from-red-600 hover:to-red-700 transition-all"
                    >
                      🚪
                    </motion.button>
                  </>
                ) : (
                  /* 🔥 NIEZALOGOWANY – Załóż konto! */
                  <motion.button
                    onClick={() => setShowAuthModal(true)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-black shadow-xl hover:shadow-2xl hover:from-emerald-600 hover:to-emerald-700 transition-all"
                  >
                    <span className="hidden sm:inline">Załóż konto</span>
                    <span className="sm:hidden">👤</span>
                  </motion.button>
                )}
              </div>

              {/* MOBILE HAMBURGER */}
              <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-2 rounded-2xl bg-white/80 backdrop-blur shadow-lg hover:shadow-xl"
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.1 }}
              >
                <motion.div
                  animate={{ rotate: isOpen ? 90 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-8 h-8 flex flex-col justify-center items-center gap-1"
                >
                  <motion.span
                    className="w-6 h-0.5 bg-gray-800 rounded-full origin-center"
                    animate={{ rotate: isOpen ? 45 : 0, y: isOpen ? 2 : 0 }}
                  />
                  <motion.span
                    className="w-6 h-0.5 bg-gray-800 rounded-full origin-center"
                    animate={{ opacity: isOpen ? 0 : 1 }}
                  />
                  <motion.span
                    className="w-6 h-0.5 bg-gray-800 rounded-full origin-center"
                    animate={{ rotate: isOpen ? -45 : 0, y: isOpen ? -2 : 0 }}
                  />
                </motion.div>
              </motion.button>
            </nav>
          </div>
        </div>
      </motion.div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 lg:hidden"
              style={{
                backdropFilter: 'blur(20px)',
                backgroundColor: 'rgba(255,255,255,0.95)',
              }}
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 20 }}
              className="fixed bottom-6 left-1/2 -translate-x-1/2 w-11/12 max-w-md z-50 lg:hidden"
            >
              <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/50 max-h-[70vh] overflow-y-auto">
                <div className="space-y-4">

                  {/* Profile Card */}
                  {isAuthenticated && profile && (
                    <Link href="/profil" onClick={() => setIsOpen(false)}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-6 bg-gradient-to-r from-[#E94444] to-[#1473E6] text-white rounded-3xl shadow-2xl cursor-pointer hover:shadow-3xl hover:scale-[1.02] transition-all flex items-center gap-4"
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
                          <span className="text-3xl">🦸‍♂️</span>
                        </div>
                        <div>
                          <div className="text-xl font-black">{profile.username}</div>
                          <div className="text-lg font-bold">Lv. {profile.level}</div>
                          <div className="text-sm opacity-90">{profile.total_exp ?? 0} EXP</div>
                        </div>
                      </motion.div>
                    </Link>
                  )}

                  {/* Nav */}
                  {navItems.map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * idx }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-4 p-4 rounded-2xl text-xl font-black text-gray-800 hover:text-[#E94444] hover:bg-gradient-to-r hover:from-[#E94444]/10 hover:shadow-lg transition-all group"
                      >
                        <span className="text-2xl">{item.icon}</span>
                        <span>{item.name}</span>
                      </Link>
                    </motion.div>
                  ))}

                  {/* Buttons – JEDEN STYL! */}
                  <div className="pt-6 space-y-3 border-t-4 border-[#FFBE0B]/50">
                    {isAuthenticated ? (
                      <>
                        <Link href="/profil" onClick={() => setIsOpen(false)}>
                          <motion.button
                            className="w-full p-5 rounded-2xl bg-gradient-to-r from-[#E94444] to-[#1473E6] text-white font-black text-lg shadow-2xl hover:shadow-3xl hover:scale-[1.02] transition-all"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            👤 Profil
                          </motion.button>
                        </Link>
                        <motion.button
                          onClick={() => {
                            signOut()
                            setIsOpen(false)
                          }}
                          className="w-full p-5 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 text-white font-black text-lg shadow-2xl hover:shadow-3xl hover:scale-[1.02] hover:from-red-600 hover:to-red-700 transition-all"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          🚪 Wyloguj
                        </motion.button>
                      </>
                    ) : (
                      <motion.button
                        onClick={() => {
                          setShowAuthModal(true)
                          setIsOpen(false)
                        }}
                        className="w-full p-5 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-black text-lg shadow-2xl hover:shadow-3xl hover:scale-[1.02] transition-all"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        👤 Załóż konto
                      </motion.button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          </AnimatePresence>

        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </>
      );
}
