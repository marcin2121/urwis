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
  { name: "🏠 Strona główna", href: "/", icon: "🏠" },
  { name: "📞 Kontakt", href: "/kontakt", icon: "📞" },
  { name: "🎯 Misje", href: "/misje", icon: "🎯" },
  { name: "🏆 Nagrody", href: "/nagrody", icon: "🏆" },
  { name: "🎮 Gry", href: "/gry", icon: "🎮" },
  { name: "🧠 Quiz", href: "/quiz", icon: "🧠" },
];

interface ProfileButtonProps {
  profile: any;
  session: any;
  onAuthClick: () => void;
  onSignOut: () => void;
  className?: string;
  isMobile?: boolean;
}

const ProfileButton = memo(({
  profile,
  session,
  onAuthClick,
  onSignOut,
  className = "",
  isMobile = false
}: ProfileButtonProps) => {
  const isLoading = session === undefined;
  const baseClass = "flex items-center gap-2";
  const mobileClass = isMobile
    ? "flex-col gap-4 w-full [&>a]:w-full [&>button]:w-full text-lg"
    : "";

  if (isLoading) {
    return (
      <div className={`${baseClass} ${mobileClass} ${className}`}>
        <div className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 animate-pulse w-full" />
      </div>
    );
  }

  return (
    <div className={`${baseClass} ${mobileClass} ${className}`}>
      {session && profile ? (
        <>
          <Link
            href="/profil"
            className="flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#E94444] to-[#1473E6] text-white font-black shadow-xl hover:shadow-2xl transition-all"
          >
            <span className="text-xl sm:hidden">👤</span>
            <div className="hidden sm:block">
              <div className="text-sm font-bold leading-tight">{profile.username}</div>
              <div className="text-xs">Lv.{profile.level}</div>
            </div>
          </Link>
          <motion.button
            onClick={onSignOut}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-3 py-3 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 text-white font-black shadow-xl hover:shadow-2xl hover:from-red-600 hover:to-red-700 transition-all"
            aria-label="Wyloguj się"
          >
            🚪
          </motion.button>
        </>
      ) : (
        <motion.button
          onClick={onAuthClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-black shadow-xl hover:shadow-2xl hover:from-emerald-600 hover:to-emerald-700 transition-all"
          aria-label="Załóż konto lub zaloguj się"
        >
          👤 Konto
        </motion.button>
      )}
    </div>
  );
});

ProfileButton.displayName = 'ProfileButton';

const Navbar = memo(() => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { profile, session, signOut } = useSupabaseAuth();

  const handleAuthClick = useCallback(() => {
    setShowAuthModal(true);
    setIsOpen(false);
  }, []);

  const handleSignOut = useCallback(async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Wylogowanie nieudane:', error);
    }
    setIsOpen(false);
  }, [signOut]);

  const closeMenu = useCallback(() => setIsOpen(false), []);

  return (
    <>
      {/* DESKTOP NAVBAR */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="fixed top-0 left-0 w-full z-50 shadow-2xl"
      >
        <div className="relative bg-gradient-to-r from-[#E94444] via-[#1473E6] to-[#FFBE0B] p-2 rounded-b-3xl mx-4 mt-2 shadow-[0_20px_40px_rgba(233,68,68,0.3)] backdrop-blur-xl">
          <div className="bg-white/95 backdrop-blur-3xl rounded-3xl p-3 shadow-inner">
            <nav className="flex items-center justify-between px-6" role="navigation">

              {/* LOGO */}
              <Link
                href="/"
                className="flex items-center gap-3 group p-2 -m-2 rounded-2xl hover:bg-white/50 transition-all"
                aria-label="Urwis - Strona główna"
              >
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

              {/* DESKTOP MENU + NOTIFICATIONS */}
              <div className="hidden lg:flex items-center gap-4">
                <div className="flex items-center gap-1 min-w-[400px]">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="group relative px-5 py-3 text-sm font-black text-gray-800 hover:text-[#E94444] transition-all rounded-xl hover:bg-gradient-to-r hover:from-[#E94444]/10 hover:to-[#1473E6]/10 hover:shadow-lg flex-1"
                      aria-label={item.name}
                    >
                      <span className="flex items-center gap-1.5">{item.name}</span>
                      <motion.div
                        className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#E94444] to-[#1473E6] opacity-0 group-hover:opacity-[0.15]"
                        layoutId="nav-hover"
                      />
                    </Link>
                  ))}
                </div>

                {/* 🔔 Notifications */}
                <motion.div
                  className="relative p-3 rounded-2xl bg-gradient-to-br from-[#FFBE0B] to-orange-500 text-white shadow-xl hover:shadow-2xl hover:scale-110 transition-all cursor-pointer"
                  whileHover={{ rotate: 360 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Powiadomienia (3 nowe)"
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

                <ProfileButton
                  profile={profile}
                  session={session}
                  onAuthClick={handleAuthClick}
                  onSignOut={handleSignOut}
                />
              </div>

              {/* ☰ MOBILE HAMBURGER */}
              <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-3 rounded-2xl bg-white/80 backdrop-blur shadow-lg hover:shadow-xl hover:bg-white transition-all"
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.1 }}
                aria-label={isOpen ? "Zamknij menu" : "Otwórz menu"}
                aria-expanded={isOpen}
              >
                <motion.div
                  animate={{ rotate: isOpen ? 90 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-7 h-7 flex flex-col justify-center items-center gap-0.5"
                >
                  <motion.span
                    className="w-6 h-0.5 bg-
