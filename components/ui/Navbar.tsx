'use client'

import Link from 'next/link'
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext'
import { motion } from 'framer-motion'
import { LogIn, Gamepad2, Home, Trophy, ShoppingBag } from 'lucide-react'
import { usePathname } from 'next/navigation'
import AuthModal from '@/components/AuthModal'
import { useState } from 'react'

export default function Navbar() {
  const { user, profile } = useSupabaseAuth()
  const pathname = usePathname()
  const [isAuthModalOpen, setAuthModalOpen] = useState(false)

  const navLinks = [
    { href: '/', label: 'Start', icon: Home },
    { href: '/gry', label: 'Strefa Gier', icon: Gamepad2 },
    { href: '/misje', label: 'Misje', icon: Trophy },
    { href: 'https://sklep-urwis.pl', label: 'Sklep', icon: ShoppingBag, external: true },
  ]

  return (
    <>
      <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          // Zmiana cienia na niebieskawy
          className="pointer-events-auto bg-white/80 backdrop-blur-xl border border-white/40 shadow-lg shadow-blue-900/5 rounded-full px-2 py-2 flex items-center gap-1 md:gap-2 max-w-4xl w-full justify-between"
        >
          {/* LEWA STRONA - Logo */}
          <Link href="/" className="flex items-center gap-2 pl-4 pr-2 group">
            {/* ZMIANA: Gradient czerwono-niebieski */}
            <div className="bg-linear-to-br from-red-600 to-blue-600 text-white font-black font-heading rounded-lg w-8 h-8 flex items-center justify-center text-lg shadow-md group-hover:scale-110 transition-transform">
              U
            </div>
            <span className="font-heading font-bold text-gray-800 hidden md:block">Urwis</span>
          </Link>

          {/* ŚRODEK - Linki */}
          <div className="flex items-center bg-gray-100/50 rounded-full p-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              const Icon = link.icon

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  target={link.external ? '_blank' : undefined}
                  className={`
                    relative px-3 py-2 rounded-full transition-all duration-300 flex items-center gap-2
                    ${isActive ? 'text-blue-700' : 'text-gray-500 hover:text-gray-900 hover:bg-white'} 
                  `}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-white shadow-sm rounded-full"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  {/* ZMIANA: Kolor ikony aktywnej na niebieski */}
                  <span className={`relative z-10 flex items-center gap-2 text-sm font-bold ${isActive ? 'text-blue-600' : ''}`}>
                    <Icon size={18} />
                    <span className="hidden sm:block">{link.label}</span>
                  </span>
                </Link>
              )
            })}
          </div>

          {/* PRAWA STRONA - Profil / Login */}
          <div className="pl-2 pr-2">
            {user ? (
              <Link href="/profil">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  // ZMIANA: Tło na ciemny granat
                  className="flex items-center gap-3 bg-slate-900 text-white pl-1 pr-4 py-1 rounded-full shadow-lg cursor-pointer border border-slate-800"
                >
                  {/* ZMIANA: Badge levelu na żółto-czerwony */}
                  <div className="w-8 h-8 bg-linear-to-br from-yellow-400 to-red-500 rounded-full flex items-center justify-center text-xs font-black text-white border-2 border-slate-900">
                    {profile?.level || 1}
                  </div>
                  <div className="flex flex-col leading-none">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Poziom</span>
                    <span className="text-sm font-bold truncate max-w-[80px]">
                      {profile?.username || 'Gracz'}
                    </span>
                  </div>
                </motion.div>
              </Link>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setAuthModalOpen(true)}
                // ZMIANA: Przycisk "Dołącz" na czerwony (akcja!)
                className="flex items-center gap-2 bg-linear-to-r from-red-600 to-red-500 text-white px-5 py-2.5 rounded-full font-bold shadow-lg shadow-red-500/30 hover:shadow-red-500/50 transition-all"
              >
                <LogIn size={18} />
                <span className="hidden sm:inline">Dołącz</span>
              </motion.button>
            )}
          </div>
        </motion.nav>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </>
  )
}