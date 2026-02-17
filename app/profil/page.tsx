'use client'

import { useEffect, useState } from 'react'
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Star, Trophy, Zap, ShieldCheck, Settings, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function ProfilPage() {
  const { profile, session, loading } = useSupabaseAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !loading && !session) {
      router.push('/login')
    }
  }, [mounted, loading, session, router])

  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-zinc-400 font-bold animate-pulse uppercase tracking-widest text-xs">
        Weryfikacja agenta...
      </div>
    )
  }

  if (!profile) return null

  const isAdmin = profile.role === 'admin'

  return (
    <div className="min-h-screen bg-[#F8F9FC] pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* KARTA PROFILU */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-zinc-100 relative overflow-hidden"
        >
          {/* Przycisk Ustawień */}
          <div className="absolute top-0 right-0 p-6">
            <button className="p-3 bg-zinc-50 rounded-2xl text-zinc-400 hover:text-black transition-colors">
              <Settings size={20} />
            </button>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-32 h-32 bg-blue-100 rounded-[2rem] flex items-center justify-center text-5xl shadow-inner">
              {profile.avatar_url || '🐱'}
            </div>
            
            <div className="text-center md:text-left space-y-2">
              <div className="flex items-center justify-center md:justify-start gap-3">
                <h1 className="text-4xl font-black text-zinc-900">{profile.username}</h1>
                {isAdmin && (
                  <span className="px-3 py-1 bg-red-100 text-red-600 text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-1">
                    <ShieldCheck size={12} /> Admin
                  </span>
                )}
              </div>
              <p className="text-zinc-400 font-bold uppercase tracking-widest text-sm">Agent Poziomu {profile.level}</p>
            </div>
          </div>

          {/* STATYSTYKI */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
            <div className="bg-blue-50/50 p-6 rounded-[2rem] border border-blue-100/50">
              <div className="flex items-center gap-2 text-blue-500 mb-1">
                <Star size={14} fill="currentColor" />
                <span className="text-[10px] font-black uppercase tracking-wider">Twoje Punkty</span>
              </div>
              <div className="text-4xl font-black text-blue-600">{profile.points}</div>
            </div>

            <div className="bg-orange-50/50 p-6 rounded-[2rem] border border-orange-100/50">
              <div className="flex items-center gap-2 text-orange-500 mb-1">
                <Zap size={14} fill="currentColor" />
                <span className="text-[10px] font-black uppercase tracking-wider">Doświadczenie</span>
              </div>
              <div className="text-4xl font-black text-orange-600">{profile.xp} <span className="text-sm">XP</span></div>
            </div>

            <div className="bg-zinc-900 p-6 rounded-[2rem] text-white">
              <div className="flex items-center gap-2 text-zinc-400 mb-1">
                <Trophy size={14} fill="currentColor" />
                <span className="text-[10px] font-black uppercase tracking-wider">Ranking</span>
              </div>
              <div className="text-4xl font-black">#1</div>
            </div>
          </div>

          {/* SEKRETY ADMINA - POJAWIA SIĘ TYLKO DLA ADMINA */}
          {isAdmin && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-8 pt-8 border-t border-zinc-100"
            >
              <Link 
                href="/admin"
                className="group flex items-center justify-between p-6 bg-zinc-900 rounded-[2rem] text-white hover:bg-black transition-all shadow-lg shadow-zinc-200"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-blue-400">
                    <ShieldCheck size={28} />
                  </div>
                  <div>
                    <div className="font-black text-lg">Panel Zarządzania</div>
                    <div className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Edytuj punkty i misje urwisów</div>
                  </div>
                </div>
                <ArrowRight className="text-zinc-500 group-hover:text-white group-hover:translate-x-2 transition-all" />
              </Link>
            </motion.div>
          )}
        </motion.div>

        {/* DODATKOWE WIDŻETY */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-zinc-300 font-bold italic">
            <div className="bg-white p-12 rounded-[2.5rem] border border-zinc-100 text-center">
               Twoje aktywne misje...
            </div>
            <div className="bg-white p-12 rounded-[2.5rem] border border-zinc-100 text-center">
               Twoje nagrody...
            </div>
        </div>

      </div>
    </div>
  )
}
