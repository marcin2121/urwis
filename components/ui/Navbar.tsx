"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
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
  Gift
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const { profile, session, signOut } = useSupabaseAuth();
  const isAuthenticated = !!session;

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authView, setAuthView] = useState<"login" | "register">("login");
  const [showNotifications, setShowNotifications] = useState(false);

  // Symulacja stanu powiadomień (np. nagrody do odebrania)
  const [hasUnreadRewards, setHasUnreadRewards] = useState(true);

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Kontakt", href: "/kontakt", icon: Phone },
    { name: "Misje", href: "/misje", icon: Target },
    { name: "Nagrody", href: "/nagrody", icon: Trophy },
    { name: "Gry", href: "/gry", icon: Gamepad2 },
    { name: "Quiz", href: "/quiz", icon: Brain },
  ];

  const handleOpenAuth = (view: "login" | "register") => {
    setAuthView(view);
    setShowAuthModal(true);
  };

  // Komponent powiadomień (Popover)
  const NotificationsPopover = () => (
    <AnimatePresence>
      {showNotifications && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowNotifications(false)}
          />
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-4 w-72 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-black/5 dark:border-white/10 overflow-hidden z-50 p-2"
          >
            <div className="p-3 border-b border-black/5 dark:border-white/10">
              <h3 className="font-semibold text-sm">Powiadomienia</h3>
            </div>
            <div className="p-2">
              {hasUnreadRewards ? (
                <div className="flex gap-3 items-start p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-colors cursor-pointer" onClick={() => setShowNotifications(false)}>
                  <div className="p-2 bg-orange-100 text-orange-600 rounded-full">
                    <Gift size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Nowe nagrody!</p>
                    <p className="text-xs text-zinc-500">Masz nieodebrane nagrody za misje.</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-zinc-500 text-center py-4">Brak nowych powiadomień</p>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {/* DESKTOP NAVBAR & MOBILE TOP BAR */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
        className="fixed top-0 md:top-6 left-0 md:left-1/2 md:-translate-x-1/2 w-full md:w-auto md:min-w-[800px] z-50 px-4 md:px-0"
      >
        <div className="flex items-center justify-between md:justify-start gap-8 bg-white/70 dark:bg-black/70 backdrop-blur-xl md:rounded-full px-6 py-4 md:py-3 shadow-sm md:shadow-[0_8px_32px_rgba(0,0,0,0.08)]">

          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0">
            <Image
              src="/logo.png"
              alt="Logo"
              width={40}
              height={40}
              className="object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${isActive
                      ? "text-black dark:text-white bg-black/5 dark:bg-white/10"
                      : "text-zinc-500 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5"
                    }`}
                >
                  <Icon size={16} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Auth / Profile Area (Desktop & Mobile Top) */}
          <div className="flex items-center gap-3 md:ml-auto relative">
            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-zinc-600 dark:text-zinc-300"
                  >
                    {hasUnreadRewards ? (
                      <BellRing size={20} className="text-orange-500" />
                    ) : (
                      <Bell size={20} />
                    )}
                    {hasUnreadRewards && (
                      <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-orange-500 rounded-full border-2 border-white dark:border-black"></span>
                    )}
                  </button>
                  <NotificationsPopover />
                </div>

                {/* Profile Link */}
                <Link
                  href="/profil"
                  className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-black text-white dark:bg-white dark:text-black hover:opacity-90 transition-opacity text-sm font-medium"
                >
                  <User size={16} />
                  Mój Profil
                </Link>

                {/* Mobile Profile Icon */}
                <Link
                  href="/profil"
                  className="md:hidden p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-zinc-600 dark:text-zinc-300"
                >
                  <User size={20} />
                </Link>

                {/* Logout */}
                <button
                  onClick={signOut}
                  className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-zinc-500 hover:text-red-500 transition-colors"
                  title="Wyloguj się"
                >
                  <LogOut size={20} />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleOpenAuth("login")}
                  className="px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-colors"
                >
                  Zaloguj się
                </button>
                <button
                  onClick={() => handleOpenAuth("register")}
                  className="px-4 py-2 text-sm font-medium bg-black text-white dark:bg-white dark:text-black rounded-full hover:opacity-90 transition-opacity"
                >
                  Załóż konto
                </button>
              </>
            )}
          </div>
        </div>
      </motion.div>

      {/* MOBILE BOTTOM NAVIGATION */}
      <div className="md:hidden fixed bottom-0 left-0 w-full z-50 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-t border-black/5 dark:border-white/10 pb-safe">
        <nav className="flex items-center justify-around px-2 py-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center gap-1 p-2"
              >
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className={`p-1.5 rounded-full ${isActive
                      ? "bg-black/5 dark:bg-white/10 text-black dark:text-white"
                      : "text-zinc-500"
                    }`}
                >
                  <Icon size={20} />
                </motion.div>
                <span
                  className={`text-[10px] font-medium ${isActive ? "text-black dark:text-white" : "text-zinc-500"
                    }`}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Auth Modal */}
      {/* Zakładam, że AuthModal przyjmuje propsy do określenia domyślnego widoku (logowanie/rejestracja) */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultView={authView}
      />
    </>
  );
}