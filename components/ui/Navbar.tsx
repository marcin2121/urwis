"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
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
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="fixed top-0 left-0 w-full z-50 shadow-2xl"
      >
        <div className="relative bg-gradient-to-r from-[#E94444] via-[#1473E6] to-[#FFBE0B] p-2 rounded-b-3xl mx-4 mt-2 shadow-[0_20px_40px_rgba(233,68,68,0.3)] backdrop-blur-xl">
          <div className="bg-white/95 backdrop-blur-3xl rounded-3xl p-3 shadow-inner">
            <nav className="flex items-center justify-between px-6">

              <Link href="/" className="flex items-center gap-3 group p-2 -m-2 rounded-2xl hover:bg-white/50 transition-all">
                <motion.div
                  whileHover={{ scale: 1.15, rotate: 360 }}
                  transition={{ duration: 0.6, type: "spring" }}
                  className="relative w-14 h-14"
                >
                  <div className="w-full h-full bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl shadow-2xl flex items-center justify-center border-4 border-white drop-shadow-2xl">
                    <span className="text-3xl font-black">🦸</span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#FFBE0B] rounded-full border-3 border-white shadow-lg flex items-center justify-center text-xs font-black text-gray-900">
                    U
                  </div>
                </motion.div>
                <div className="hidden sm:block">
                  <div className="text-xl font-black bg-gradient-to-r from-gray-900 to-gray-800 bg-clip-text">URWIS</div>
                  <div className="text-xs font-bold uppercase tracking-widest text-[#E94444]">Białobrzegi</div>
                </div>
              </Link>

              <div className="hidden lg:flex items-center gap-1">
                {navItems.map((item, idx) => (
                  <Link
                    key={idx}
                    href={item.href}
                    className="group relative px-5 py-3 text-sm font-black text-gray-800 hover:text-[#E94444] transition-all rounded-xl hover:bg-gradient-to-r hover:from-[#E94444]/10 hover:to-[#1473E6]/10 hover:shadow-lg"
                  >
                    <span className="flex items-center gap-1.5">{item.name}</span>
                    <motion.div
                      className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#E94444] to-[#1473E6] opacity-0 group-hover:opacity-[0.15]"
                      layoutId="nav-hover"
                    />
                  </Link>
                ))}

                <div className="flex items-center gap-2">

                  <motion.div
                    className="relative p-3 rounded-2xl bg-gradient-to-br from-[#FFBE0B] to-orange-500 text-white shadow-xl hover:shadow-2xl hover:scale-110 transition-all cursor-pointer"
                    whileHover={{ rotate: 360 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="text-2xl z-10 relative block">🔔</span>
                    <motion.span
                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs font-black flex items-center justify-center shadow-lg"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    >
                      3
                    </motion.span>
                  </motion.div>


                  {isAuthenticated && profile ? (
                    <>

                      <Link href="/profil">
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#E94444] to-[#1473E6] text-white font-black shadow-xl hover:shadow-2xl transition-all flex items-center gap-2.5"
                        >
                          <span className="text-xl">👤</span>
                          <div className="hidden sm:block">
                            <div className="text-sm font-bold leading-tight">{profile.username}</div>
                            <div className="text-xs opacity-90">Lv.{profile.level}</div>
                          </div>
                        </motion.div>
                      </Link>


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

                    <motion.button
                      onClick={() => setShowAuthModal(true)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-black shadow-xl hover:shadow-2xl hover:from-emerald-600 hover:to-emerald-700 transition-all"
                    >
                      👤 Załóż konto
                    </motion.button>
                  )}
                </div>


                <motion.button
                  onClick={() => setIsOpen(!isOpen)}
                  className="lg:hidden p-3 rounded-2xl bg-white/80 backdrop-blur shadow-lg hover:shadow-xl hover:bg-white/100"
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.1 }}
                >
                  <motion.div
                    animate={{ rotate: isOpen ? 90 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-7 h-7 flex flex-col justify-center items-center gap-0.5"
                  >
                    <motion.span
                      className="w-6 h-0.5 bg-gray-800 rounded-full origin-center"
                      animate={{ rotate: isOpen ? 45 : 0, y: isOpen ? 1.5 : 0 }}
                      transition={{ duration: 0.2 }}
                    />
                    <motion.span
                      className="w-6 h-0.5 bg-gray-800 rounded-full origin-center"
                      animate={{ opacity: isOpen ? 0 : 1 }}
                    />
                    <motion.span
                      className="w-6 h-0.5 bg-gray-800 rounded-full origin-center"
                      animate={{ rotate: isOpen ? -45 : 0, y: isOpen ? -1.5 : 0 }}
                      transition={{ duration: 0.2 }}
                    />
                  </motion.div>
                </motion.button>
            </nav>
          </div>
        </div>
      </motion.div>


      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 lg:hidden bg-black/20 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[95vw] max-w-md z-50 lg:hidden max-h-[80vh] overflow-hidden"
            >
              <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border-4 border-white/50">
                <div className="space-y-6 overflow-y-auto max-h-[60vh]">

                  {isAuthenticated && profile && (
                    <Link href="/profil" onClick={() => setIsOpen(false)}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-6 bg-gradient-to-r from-[#E94444] to-[#1473E6] text-white rounded-3xl shadow-2xl cursor-pointer hover:shadow-3xl hover:scale-[1.02] transition-all flex items-center gap-4"
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-lg">
                          <span className="text-3xl">🦸‍♂️</span>
                        </div>
                        <div>
                          <div className="text-xl font-black">{profile.username}</div>
                          <div className="text-lg font-bold text-yellow-300">Lv. {profile.level}</div>
                          <div className="text-sm opacity-90">{profile.total_exp ?? 0} EXP</div>
                        </div>
                      </motion.div>
                    </Link>
                  )}


                  {navItems.map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * idx }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-4 p-5 rounded-2xl text-xl font-black text-gray-800 hover:text-[#E94444] hover:bg-gradient-to-r hover:from-[#E94444]/20 hover:to-[#1473E6]/20 hover:shadow-xl transition-all shadow-md"
                      >
                        <span className="text-2xl">{item.icon}</span>
                        <span className="flex-1">{item.name}</span>
                        <motion.div
                          className="w-2 h-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                          layoutId="menu-arrow"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                        />
                      </Link>
                    </motion.div>
                  ))}

                  <div className="pt-6 space-y-4 border-t-4 border-gradient-to-r border-[#FFBE0B]/50 from-[#FFBE0B] to-orange-500 rounded-xl p-4 bg-gradient-to-r from-yellow-50 to-orange-50">
                    {isAuthenticated ? (
                      <>
                        <Link href="/profil" onClick={() => setIsOpen(false)}>
                          <motion.button
                            className="w-full p-6 rounded-2xl bg-gradient-to-r from-[#E94444] to-[#1473E6] text-white font-black text-lg shadow-2xl hover:shadow-3xl hover:scale-[1.02] transition-all"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            👤 Mój Profil
                          </motion.button>
                        </Link>
                        <motion.button
                          onClick={() => {
                            signOut()
                            setIsOpen(false)
                          }}
                          className="w-full p-6 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 text-white font-black text-lg shadow-2xl hover:shadow-3xl hover:scale-[1.02] hover:from-red-600 hover:to-red-700 transition-all"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          🚪 Wyloguj się
                        </motion.button>
                      </>
                    ) : (
                      <motion.button
                        onClick={() => {
                          setShowAuthModal(true)
                          setIsOpen(false)
                        }}
                        className="w-full p-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-black text-lg shadow-2xl hover:shadow-3xl hover:scale-[1.02] transition-all"
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


        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      </>
      );
}
