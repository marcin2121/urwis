"use client";

import React, { useState, useRef } from "react";
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
  Shield,
  ChevronDown,
  ShoppingBag,
  Percent,
  Sparkles,
  Grid
} from "lucide-react";

// Definicja struktury nawigacji
const NAV_STRUCTURE = [
  { 
    name: "Home", 
    href: "/", 
    icon: Home, 
    type: "link" 
  },
  {
    name: "Sklep",
    icon: ShoppingBag,
    type: "dropdown",
    items: [
      { name: "Pełna Oferta", href: "/oferta", icon: Grid },
      { name: "Promocje", href: "/oferta/promocje", icon: Percent, highlight: true },
    ]
  },
  {
    name: "Klub Urwisa",
    icon: Gamepad2,
    type: "dropdown",
    items: [
      { name: "Misje", href: "/misje", icon: Target },
      { name: "Nagrody", href: "/nagrody", icon: Trophy },
      { name: "Gry", href: "/gry", icon: Sparkles },
      { name: "Quiz", href: "/quiz", icon: Brain },
    ]
  },
  { 
    name: "Kontakt", 
    href: "/kontakt", 
    icon: Phone, 
    type: "link" 
  }
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { profile, session, signOut } = useSupabaseAuth();
  const isAuthenticated = !!session;

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authView, setAuthView] = useState<"login" | "register">("login");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  // Timer do opóźniania zamknięcia
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Powiadomienia
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasUnreadRewards, setHasUnreadRewards] = useState(false); 

  // --- LOGIKA "LEPKIEGO" MENU ---
  const handleMouseEnter = (name: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setActiveDropdown(name);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 300);
  };
  // -----------------------------

  const handleOpenAuth = (view: "login" | "register") => {
    setAuthView(view);
    setShowAuthModal(true);
  };

  const handleSignOut = async () => {
    await signOut();
    router.refresh();
    router.push('/');
  };

  const handleNotificationClick = (path: string) => {
    setShowNotifications(false); 
    router.push(path); 
  };

  const NavItem = ({ item }: { item: any }) => {
    const isDropdown = item.type === "dropdown";
    const isActive = isDropdown 
      ? item.items.some((sub: any) => pathname === sub.href)
      : pathname === item.href;
    
    const isOpen = activeDropdown === item.name;

    if (isDropdown) {
      return (
        <div 
          className="relative group h-full flex items-center"
          onMouseEnter={() => handleMouseEnter(item.name)}
          onMouseLeave={handleMouseLeave}
        >
          <button
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
              isActive || isOpen
                ? "bg-black text-white shadow-md"
                : "text-zinc-500 hover:text-black hover:bg-black/5"
            }`}
          >
            <item.icon size={16} strokeWidth={2.5} />
            {item.name}
            <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: 5, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 5, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-1/2 -translate-x-1/2 pt-6 -mt-2 w-56 z-50"
              >
                <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-black/5 overflow-hidden p-2">
                  {item.items.map((subItem: any) => (
                    <Link
                      key={subItem.href}
                      href={subItem.href}
                      onClick={() => setActiveDropdown(null)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                        pathname === subItem.href
                          ? "bg-black/5 text-black font-bold"
                          : "text-zinc-500 hover:text-black hover:bg-zinc-50"
                      } ${subItem.highlight ? "text-[#BF2024]" : ""}`}
                    >
                      <div className={`p-1.5 rounded-lg ${subItem.highlight ? "bg-red-50 text-red-600" : "bg-zinc-100 text-zinc-500"}`}>
                        <subItem.icon size={16} />
                      </div>
                      <span className="text-sm">{subItem.name}</span>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    }

    return (
      <Link
        href={item.href}
        className={`px-4 py-2.5 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
          isActive
            ? "bg-black text-white shadow-md transform scale-105"
            : "text-zinc-500 hover:text-black hover:bg-black/5"
        }`}
      >
        <item.icon size={16} strokeWidth={2.5} />
        {item.name}
      </Link>
    );
  };

  return (
    <>
      {/* --- DESKTOP NAVBAR --- */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
        className="fixed top-0 md:top-6 left-0 md:left-1/2 md:-translate-x-1/2 w-full md:w-auto md:min-w-[850px] z-50 px-4 md:px-0 font-body"
      >
        {/* Usunięto dark:bg-black/80, teraz jest zawsze biały/jasny */}
        <div className="flex items-center justify-between gap-6 bg-white/80 backdrop-blur-xl md:rounded-full px-6 py-3 shadow-lg border border-white/20">

          <Link href="/" className="flex items-center shrink-0 hover:scale-105 transition-transform">
            <Image
              src="/logo.png"
              alt="Urwis Logo"
              width={42}
              height={42}
              className="object-contain"
            />
          </Link>

          <nav className="hidden md:flex items-center gap-1 font-heading">
            {NAV_STRUCTURE.map((item, index) => (
              <NavItem key={index} item={item} />
            ))}
          </nav>

          <div className="flex items-center gap-3 md:ml-auto">
            {isAuthenticated ? (
              <>
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
                      <Bell size={20} className="text-zinc-600" />
                    )}
                  </button>
                  
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
                          className="absolute top-full right-0 mt-4 w-80 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-black/5 overflow-hidden z-50"
                        >
                          <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                            <h3 className="font-black text-sm uppercase tracking-wider text-gray-600">
                              Centrum Akcji
                            </h3>
                            {hasUnreadRewards && (
                              <span className="text-[10px] bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-bold">
                                Nowe!
                              </span>
                            )}
                          </div>
                          <div className="p-2 space-y-1">
                            {!hasUnreadRewards ? (
                              <div className="text-center py-6 px-4">
                                <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400">
                                  <Bell size={20} />
                                </div>
                                <p className="text-sm font-bold text-gray-500">Wszystko na bieżąco!</p>
                                <p className="text-xs text-gray-400 mt-1">Brak nowych powiadomień.</p>
                              </div>
                            ) : (
                              <div 
                                onClick={() => handleNotificationClick('/misje')}
                                className="group flex gap-3 items-start p-3 hover:bg-orange-50 rounded-xl transition-all cursor-pointer border border-transparent hover:border-orange-100"
                              >
                                <div className="p-2 bg-orange-100 text-orange-600 rounded-full shrink-0 group-hover:scale-110 transition-transform">
                                  <Target size={18} />
                                </div>
                                <div>
                                  <p className="text-sm font-black text-gray-800">Odbiór Misji</p>
                                  <p className="text-xs text-gray-500 leading-tight mt-0.5">
                                    Nowe zadania czekają. Kliknij, aby sprawdzić.
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>

                <Link
                  href="/profil"
                  className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-900 text-white hover:bg-black hover:shadow-lg transition-all text-sm font-bold tracking-wide"
                >
                  {profile?.role === 'admin' ? <Shield size={16} /> : <User size={16} />}
                  {profile?.username || "Profil"}
                </Link>

                <button
                  onClick={handleSignOut}
                  className="p-2.5 rounded-full text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer z-50 relative"
                  title="Wyloguj się"
                >
                  <LogOut size={20} />
                </button>
              </>
            ) : (
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
      <div className="md:hidden fixed bottom-0 left-0 w-full z-40 bg-white/95 backdrop-blur-xl border-t border-black/5 pb-safe safe-area-bottom">
        <nav className="flex items-center justify-around px-2 py-2">
          <Link href="/" className="flex flex-col items-center gap-1 p-2 w-16">
            <div className={`p-1.5 rounded-2xl transition-all ${pathname === '/' ? "bg-black text-white" : "text-zinc-400"}`}>
              <Home size={20} strokeWidth={pathname === '/' ? 2.5 : 2} />
            </div>
            <span className={`text-[10px] font-bold ${pathname === '/' ? "text-black" : "text-zinc-400"}`}>Home</span>
          </Link>

          <Link href="/oferta" className="flex flex-col items-center gap-1 p-2 w-16">
            <div className={`p-1.5 rounded-2xl transition-all ${pathname.startsWith('/oferta') ? "bg-black text-white" : "text-zinc-400"}`}>
              <ShoppingBag size={20} strokeWidth={pathname.startsWith('/oferta') ? 2.5 : 2} />
            </div>
            <span className={`text-[10px] font-bold ${pathname.startsWith('/oferta') ? "text-black" : "text-zinc-400"}`}>Sklep</span>
          </Link>

          <Link href="/gry" className="flex flex-col items-center gap-1 p-2 w-16">
            <div className={`p-1.5 rounded-2xl transition-all ${['/gry', '/misje', '/nagrody'].includes(pathname) ? "bg-black text-white" : "text-zinc-400"}`}>
              <Gamepad2 size={20} strokeWidth={['/gry', '/misje', '/nagrody'].includes(pathname) ? 2.5 : 2} />
            </div>
            <span className={`text-[10px] font-bold ${['/gry', '/misje', '/nagrody'].includes(pathname) ? "text-black" : "text-zinc-400"}`}>Klub</span>
          </Link>

          {isAuthenticated ? (
            <Link href="/profil" className="flex flex-col items-center gap-1 p-2 w-16">
              <div className={`p-1.5 rounded-2xl transition-all ${pathname === '/profil' ? "bg-blue-600 text-white" : "text-zinc-400"}`}>
                <User size={20} />
              </div>
              <span className={`text-[10px] font-bold ${pathname === '/profil' ? "text-black" : "text-zinc-400"}`}>Profil</span>
            </Link>
          ) : (
            <button onClick={() => handleOpenAuth("login")} className="flex flex-col items-center gap-1 p-2 w-16">
              <div className="p-1.5 rounded-2xl text-zinc-400">
                <User size={20} />
              </div>
              <span className="text-[10px] font-bold text-zinc-400">Zaloguj</span>
            </button>
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
