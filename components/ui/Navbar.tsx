"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import AuthModal from '../AuthModal';
import { Edu_SA_Beginner } from "next/font/google";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user: profile, session, signOut } = useSupabaseAuth();
  const isAuthenticated = !!session;

  const navItems = [
    { name: "Strona główna", icon: "🏠", href: "/" },
    { name: "Kontakt", icon: "📞", href: "/kontakt" },
    { name: "Misje", icon: "🎯", href: "/misje" },
    { name: "Nagrody", icon: "🏆", href: "/nagrody" },
    { name: "Gry", icon: "🎮", href: "/gry" },
 // NOWE
  ];
  

  return (
    <>
      {/* Ultra Frosted Glass Navbar */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-8 left-1/2 -translate-x-1/2 w-[96%] max-w-6xl z-50"
      >
        <div 
          className="relative rounded-full border border-gray-200 shadow-[0_8px_40px_rgba(0,0,0,0.12)] px-8 py-5 overflow-hidden"
          style={{
            backdropFilter: 'blur(40px) saturate(180%)',
            WebkitBackdropFilter: 'blur(40px) saturate(180%)',
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
          }}
        >
          <nav className="relative flex justify-between items-center">
            
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group z-10">
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6, type: "spring" }}
                className="relative w-10 h-10"
              >
                <Image 
                  src="/logo.png" 
                  alt="Sklep Urwis"
                  width={50}
                  height={50}
                  loading="eager"
                  priority
                  className="object-contain drop-shadow-lg"
                />
              </motion.div>

            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8 z-10">
              {navItems.map((item, idx) => (
                <Link
                  key={idx}
                  href={item.href}
                  className="relative text-base font-bold text-gray-900 hover:text-[#BF2024] transition-colors group"
                >
                  {item.name}
                  <span 
                    className="absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300 rounded-full"
                    style={{
                      background: 'linear-gradient(90deg, #BF2024 0%, #0055ff 100%)',
                    }}
                  />
                </Link>
              ))}
            </div>

            {/* Right Side - User Profile or Login */}
            <div className="hidden md:flex items-center gap-4 z-10">
              {isAuthenticated && profile ? (
                <>
                  {/* User Profile Button */}
                  <Link href="/profil">
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="flex items-center gap-3 px-4 py-2 rounded-full border-2 border-gray-200 hover:border-blue-300 transition-all cursor-pointer"
    style={{
      background: 'linear-gradient(135deg, rgba(191, 32, 36, 0.05), rgba(0, 85, 255, 0.05))',
    }}
  >
    <span className="text-2xl">{profile.avatar_url || '🧸'}</span>
    <div className="text-left">
      <div className="text-sm font-bold text-gray-900">{profile.username}</div>
      <div className="text-xs text-gray-600">Poziom {profile.level}</div>
    </div>
  </motion.div>
</Link>

                  {/* Logout Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={signOut}
                    className="px-4 py-2 rounded-full bg-red-100 text-red-600 font-bold hover:bg-red-200 transition-colors"
                  >
                    Wyloguj
                  </motion.button>
                </>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAuthModal(true)}
                  className="px-6 py-3 rounded-full text-white text-base font-bold shadow-xl transition-all overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, #BF2024 0%, #0055ff 100%)',
                  }}
                >
                  <span className="flex items-center gap-2">
                    <span>👤</span>
                    <span>Zaloguj się</span>
                  </span>
                </motion.button>
              )}

              {/* Call Button */}
              <motion.a
                href="tel:+48123456789"
                className="flex items-center gap-2 px-6 py-3 rounded-full border-2 border-gray-200 text-gray-900 text-base font-bold hover:border-[#BF2024] hover:text-[#BF2024] transition-all"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>📞</span>
                <span>Zadzwoń</span>
              </motion.a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden relative w-12 h-12 flex flex-col justify-center items-center z-10"
              aria-label="Toggle menu"
            >
              <motion.span
                animate={isOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                className="w-6 h-0.5 bg-gray-900 rounded-full"
              />
              <motion.span
                animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
                className="w-6 h-0.5 bg-gray-900 rounded-full mt-2"
              />
              <motion.span
                animate={isOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
                className="w-6 h-0.5 bg-gray-900 rounded-full mt-2"
              />
            </button>

          </nav>
        </div>
      </motion.div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-30 md:hidden"
              style={{
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
              }}
              onClick={() => setIsOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-28 left-1/2 -translate-x-1/2 w-[92%] max-w-lg z-40 md:hidden"
            >
              <div 
                className="rounded-3xl border border-gray-200 shadow-2xl p-6 overflow-hidden"
                style={{
                  backdropFilter: 'blur(40px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(40px) saturate(180%)',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                }}
              >
                <div className="flex flex-col space-y-4">
                  {/* User Profile (Mobile) */}
                  {isAuthenticated && profile && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-3 p-4 rounded-2xl mb-2"
                      style={{
                        background: 'linear-gradient(135deg, rgba(191, 32, 36, 0.1), rgba(0, 85, 255, 0.1))',
                      }}
                    >
                      <span className="text-3xl">{profile.avatar_url || '🧸'}</span>
                      <div>
                        <div className="font-bold text-gray-900">{profile.username}</div>
                        <div className="text-sm text-gray-600">Poziom {profile.level} • {profile.total_exp} EXP</div>
                      </div>
                    </motion.div>
                  )}

              {navItems.map((item, idx) => (
  <Link
    key={idx}
    href={item.href}
    className="relative px-3 py-2 text-sm font-bold text-gray-900 hover:text-[#BF2024] transition-colors group whitespace-nowrap flex items-center gap-1"
  >
    <span>{item.icon}</span>
    <span>{item.name}</span>
    <span 
      className="absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300 rounded-full"
      style={{
        background: 'linear-gradient(90deg, #BF2024 0%, #0055ff 100%)',
      }}
    />
  </Link>
))}
                  
                  {/* Mobile Login/Logout */}
                  {isAuthenticated ? (
                    <motion.button
                      onClick={() => {
                        signOut();
                        setIsOpen(false);
                      }}
                      className="w-full px-7 py-5 rounded-2xl text-white text-base font-bold shadow-xl transition-all bg-red-500 hover:bg-red-600"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Wyloguj się
                    </motion.button>
                  ) : (
                    <motion.button
                      onClick={() => {
                        setShowAuthModal(true);
                        setIsOpen(false);
                      }}
                      className="flex items-center justify-center gap-3 px-7 py-5 rounded-2xl text-white text-base font-bold shadow-xl transition-all overflow-hidden"
                      style={{
                        background: 'linear-gradient(135deg, #BF2024 0%, #0055ff 100%)',
                      }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="text-2xl">👤</span>
                      <span>Zaloguj się</span>
                    </motion.button>
                  )}

                  {/* Mobile CTA */}
                  <motion.a
                    href="tel:+48123456789"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-3 px-7 py-5 rounded-2xl border-2 border-gray-200 text-gray-900 text-base font-bold hover:border-[#BF2024] transition-all"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="text-2xl">📞</span>
                    <span>Zadzwoń do nas</span>
                  </motion.a>

                  {/* Quick Info */}
                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-200">
                    <div className="text-center p-4 rounded-xl border border-gray-200 bg-gray-50">
                      <div className="text-3xl mb-2">📍</div>
                      <div className="text-xs font-bold text-gray-900">
                        ul. Reymonta 38A
                      </div>
                    </div>
                    <div className="text-center p-4 rounded-xl border border-gray-200 bg-gray-50">
                      <div className="text-3xl mb-2">🕐</div>
                      <div className="text-xs font-bold text-gray-900">
                        Pn-Pt 8:00-18:00
                      </div>
                    </div>
                  </div>
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
}
