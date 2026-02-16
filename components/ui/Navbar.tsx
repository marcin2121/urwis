"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Phone,
  Target,
  Trophy,
  Gamepad2,
  Brain,
  Bell,
  LogOut,
  User,
  PlusCircle,
  LogIn
} from "lucide-react";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import AuthModal from "@/components/AuthModal";
import { cn } from "@/lib/utils"; // Zakładam, że masz util z shadcn, jeśli nie - użyj clsx/tailwind-merge ręcznie

// --- KONFIGURACJA ---
const NAV_ITEMS = [
  { name: "Home", href: "/", icon: Home },
  { name: "Kontakt", href: "/kontakt", icon: Phone },
  { name: "Misje", href: "/misje", icon: Target },
  { name: "Nagrody", href: "/nagrody", icon: Trophy },
  { name: "Gry", href: "/gry", icon: Gamepad2 },
  { name: "Quiz", href: "/quiz", icon: Brain },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user, profile, signOut, isAuthenticated } = useSupabaseAuth();

  // Modal State
  const [showAuthModal, setShowAuthModal] = useState(false);
  // Jeśli Twój AuthModal obsługuje tryb startowy (np. login vs register), możesz tu dodać stan:
  // const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Notification State
  const [isNotifyOpen, setIsNotifyOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false); // Mock stanu powiadomień

  // Mock sprawdzenia osiągnięć/powiadomień
  useEffect(() => {
    // Tutaj normalnie byłoby zapytanie do Supabase o nieodebrane nagrody
    if (isAuthenticated) {
      setHasUnread(true); // Symulacja: Użytkownik ma powiadomienie
    }
  }, [isAuthenticated]);

  const handleLogout = async () => {
    await signOut();
    // Opcjonalnie: router.push('/')
  };

  return (
    <>
      {/* ================= DESKTOP NAVBAR (Dynamic Island) ================= */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="hidden md:flex fixed top-6 left-0 right-0 justify-center z-50 pointer-events-none"
      >
        <div className="pointer-events-auto relative flex items-center gap-6 px-4 py-3 bg-white/70 backdrop-blur-xl border border-white/20 shadow-lg shadow-black/5 rounded-full ring-1 ring-black/5">

          {/* Logo */}
          <Link href="/" className="relative flex-shrink-0 group">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Image
                src="/logo.png"
                alt="Logo"
                width={42}
                height={42}
                className="object-contain"
                priority
              />
            </motion.div>
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1 bg-gray-100/50 p-1.5 rounded-full border border-black/5">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ease-out",
                    isActive
                      ? "text-white shadow-md"
                      : "text-gray-600 hover:text-gray-900 hover:bg-white"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-[#E94444] to-[#1473E6]"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <Icon size={16} />
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* User & Actions Area */}
          <div className="flex items-center gap-3 pl-2 border-l border-gray-200">
            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsNotifyOpen(!isNotifyOpen)}
                    className="p-2.5 rounded-full bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all text-gray-600 hover:text-[#E94444]"
                  >
                    <Bell size={20} />
                    {hasUnread && (
                      <span className="absolute top-2 right-2.5 w-2 h-2 bg-[#E94444] rounded-full ring-2 ring-white animate-pulse" />
                    )}
                  </motion.button>

                  {/* Custom Popover for Notifications */}
                  <AnimatePresence>
                    {isNotifyOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute top-full right-0 mt-4 w-80 p-4 bg-white rounded-2xl shadow-xl border border-gray-100 ring-1 ring-black/5 z-50 origin-top-right"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold text-gray-900">Powiadomienia</h4>
                          <span className="text-xs text-gray-500">Ostatnie</span>
                        </div>
                        <div className="space-y-2">
                          {/* Mock powiadomienia */}
                          <div className="flex items-start gap-3 p-3 rounded-xl bg-blue-50/50 hover:bg-blue-50 transition-colors cursor-pointer">
                            <div className="p-2 bg-blue-100 text-[#1473E6] rounded-full">
                              <Trophy size={16} />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-800">Odbierz nagrodę!</p>
                              <p className="text-xs text-gray-500">Awansowałeś na poziom {profile?.level || 1}</p>
                            </div>
                          </div>
                          {!hasUnread && <p className="text-center text-sm text-gray-400 py-4">Brak nowych powiadomień</p>}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Profile Link */}
                <Link href="/profil">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center gap-3 pr-1 pl-1 cursor-pointer"
                  >
                    <div className="flex flex-col items-end hidden lg:flex">
                      <span className="text-sm font-bold text-gray-900 leading-none">
                        {profile?.username || user?.email?.split('@')[0]}
                      </span>
                      <span className="text-[10px] text-[#1473E6] font-medium">
                        Lvl {profile?.level || 1}
                      </span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E94444] to-[#1473E6] p-[2px]">
                      <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                        {profile?.avatar_url ? (
                          <Image src={profile.avatar_url} width={36} height={36} alt="Avatar" />
                        ) : (
                          <span className="text-lg">🦸‍♂️</span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </Link>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  title="Wyloguj"
                >
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              // Logged Out State
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="px-5 py-2.5 rounded-full text-sm font-bold bg-gray-100 text-gray-900 hover:bg-gray-200 transition-all"
                >
                  Zaloguj
                </button>
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="px-5 py-2.5 rounded-full text-sm font-bold text-white bg-gradient-to-r from-[#E94444] to-[#E94444]/80 hover:shadow-lg transition-all flex items-center gap-2"
                >
                  Załóż konto
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.header>


      {/* ================= MOBILE INTERFACE ================= */}

      {/* 1. Mobile Top Bar (Logo + Auth/Profile Status) */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 px-4 py-3 flex justify-between items-center bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <Link href="/">
          <Image src="/logo.png" width={40} height={40} alt="Logo" className="drop-shadow-sm" />
        </Link>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              {/* Mobile Notification */}
              <button
                onClick={() => setIsNotifyOpen(!isNotifyOpen)}
                className="relative p-2 text-gray-700"
              >
                <Bell size={24} />
                {hasUnread && <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#E94444] rounded-full border border-white" />}
              </button>
              {/* Mobile Profile Avatar -> Redirects to profile */}
              <Link href="/profil">
                <div className="w-9 h-9 rounded-full bg-gradient-to-r from-[#E94444] to-[#1473E6] p-[2px]">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-lg overflow-hidden">
                    {profile?.avatar_url ? (
                      <Image src={profile.avatar_url} width={36} height={36} alt="Avatar" />
                    ) : (
                      '🦸'
                    )}
                  </div>
                </div>
              </Link>
            </>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="flex items-center gap-2 text-sm font-bold text-[#1473E6]"
            >
              <LogIn size={18} />
              Zaloguj
            </button>
          )}
        </div>
      </div>

      {/* 2. Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 pb-safe pt-2 px-2 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
        <div className="flex justify-around items-center w-full max-w-md mx-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center w-full py-2 transition-all duration-300",
                  isActive ? "text-[#E94444]" : "text-gray-400"
                )}
              >
                <div className={cn(
                  "relative p-1.5 rounded-xl transition-all duration-300",
                  isActive ? "bg-red-50 -translate-y-2 shadow-sm" : ""
                )}>
                  <Icon size={isActive ? 24 : 22} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className={cn(
                  "text-[10px] font-medium transition-all duration-300",
                  isActive ? "opacity-100 translate-y-[-4px]" : "opacity-0 h-0 hidden"
                )}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Mobile Notification Popover (Full screen or bottom sheet simulation usually, but simple absolute here) */}
      <AnimatePresence>
        {isNotifyOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsNotifyOpen(false)}
              className="fixed inset-0 bg-black/20 z-[60] backdrop-blur-sm md:hidden"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="fixed bottom-0 left-0 right-0 bg-white z-[70] rounded-t-3xl p-6 shadow-2xl md:hidden"
            >
              <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6" />
              <h3 className="text-xl font-bold mb-4">Powiadomienia</h3>
              {/* Treść powiadomień mobilnych */}
              <div className="space-y-3">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="text-2xl">🏆</div>
                  <div>
                    <div className="font-bold text-gray-900">Nagroda czeka!</div>
                    <div className="text-sm text-gray-500">Odbierz nagrodę za aktywność.</div>
                  </div>
                </div>
                <button
                  onClick={() => setIsNotifyOpen(false)}
                  className="w-full py-4 mt-4 bg-gray-900 text-white font-bold rounded-xl"
                >
                  Zamknij
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Global Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
}