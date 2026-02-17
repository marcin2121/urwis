'use client'

import { useEffect, useState } from 'react'
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, ShoppingCart, CheckCircle2, AlertCircle, Package, Lock, ArrowRight, UserPlus } from 'lucide-react'
import Link from 'next/link'

type Reward = {
  id: string
  name: string
  description: string
  cost: number
  stock: number
  image_url: string
}

export default function NagrodyPage() {
  const { profile, session, loading: authLoading, supabase } = useSupabaseAuth()
  const [rewards, setRewards] = useState<Reward[]>([])
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [buyingId, setBuyingId] = useState<string | null>(null)
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null)

  useEffect(() => { setMounted(true) }, [])

  const fetchRewards = async () => {
    const { data, error } = await supabase
      .from('rewards')
      .select('*')
      .gt('stock', 0)
    if (!error) setRewards(data)
    setLoading(false)
  }

  useEffect(() => {
    if (mounted && session) fetchRewards()
    // Jeśli nie ma sesji, też chcemy pobrać nagrody, żeby było je widać za blurem!
    if (mounted && !session) fetchRewards()
  }, [mounted, session])

  const handlePurchase = async (reward: Reward) => {
    if (!profile || profile.points < reward.cost) return
    setBuyingId(reward.id)
    setMessage(null)

    try {
      const { error: userError } = await supabase
        .from('profiles')
        .update({ points: profile.points - reward.cost })
        .eq('id', profile.id)

      if (userError) throw userError

      const { error: stockError } = await supabase
        .from('rewards')
        .update({ stock: reward.stock - 1 })
        .eq('id', reward.id)

      if (stockError) throw stockError

      const { error: claimError } = await supabase
        .from('reward_claims')
        .insert({ user_id: profile.id, reward_id: reward.id, status: 'pending' })

      if (claimError) throw claimError

      setMessage({ text: `Hurra! Kupiono: ${reward.name}. Odbierz u sprzedawcy!`, type: 'success' })
      fetchRewards()
    } catch (err) {
      setMessage({ text: 'Coś poszło nie tak... spróbuj ponownie!', type: 'error' })
    } finally {
      setBuyingId(null)
    }
  }

  if (!mounted || (authLoading && !session)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 font-bold text-zinc-400 uppercase tracking-widest text-xs">
        Wczytywanie skarbca...
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-[#F8F9FC] pt-32 pb-20 px-4">
      
      {/* MODAL DLA NIEZALOGOWANYCH */}
      <AnimatePresence>
        {!session && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[40] flex items-center justify-center p-4 backdrop-blur-[2px] bg-white/10"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl border border-zinc-100 max-w-lg w-full text-center space-y-8"
            >
              <div className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center mx-auto text-white shadow-xl shadow-blue-200">
                <Lock size={32} />
              </div>
              <div className="space-y-3">
                <h2 className="text-3xl font-black text-zinc-900 leading-tight">Skarbiec Urwisa jest zamknięty!</h2>
                <p className="text-zinc-500 font-medium px-4">
                  Tylko zalogowani agenci mogą wymieniać punkty na te wszystkie super fanty. Wejdź do gry!
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/login" 
                  className="flex-1 flex items-center justify-center gap-2 py-4 bg-zinc-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-zinc-800 transition-all shadow-lg"
                >
                  Zaloguj <ArrowRight size={16} />
                </Link>
                <Link 
                  href="/register" 
                  className="flex-1 flex items-center justify-center gap-2 py-4 bg-white border-2 border-zinc-100 text-zinc-900 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-zinc-50 transition-all"
                >
                  Załóż konto <UserPlus size={16} />
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TREŚĆ STRONY - MNIEJSZY BLUR */}
      <div className={`max-w-6xl mx-auto space-y-12 transition-all duration-1000 ${!session ? 'blur-md grayscale opacity-80 pointer-events-none' : ''}`}>
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-8 rounded-[3rem] shadow-sm border border-zinc-100">
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-black text-zinc-900 mb-2">Nagrody 🎁</h1>
            <p className="text-zinc-400 font-bold uppercase tracking-widest text-[10px]">Wymieniaj punkty na co tylko chcesz!</p>
          </div>
          
          <div className="flex items-center gap-4 bg-zinc-900 text-white px-8 py-4 rounded-[2rem] shadow-xl">
            <div className="bg-white/10 p-2 rounded-xl text-yellow-400">
              <Star fill="currentColor" size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase opacity-60 tracking-widest leading-none">Twój Stan</p>
              <p className="text-3xl font-black">{profile?.points || 0} pkt</p>
            </div>
          </div>
        </div>

        {/* SIATKA NAGRÓD */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
             [1,2,3,4,5,6].map(i => <div key={i} className="h-96 bg-white rounded-[3rem] animate-pulse" />)
          ) : rewards.map((reward) => (
            <div key={reward.id} className="bg-white rounded-[3rem] p-6 shadow-sm border border-zinc-100 flex flex-col group">
              <div className="aspect-square bg-zinc-50 rounded-[2.5rem] mb-6 flex items-center justify-center text-7xl group-hover:scale-105 transition-transform duration-500">
                <span className="not-italic">{reward.image_url || '📦'}</span>
              </div>
              
              <div className="flex-1 space-y-2 px-2">
                <h3 className="text-2xl font-black text-zinc-900 group-hover:text-blue-600 transition-colors">{reward.name}</h3>
                <p className="text-zinc-400 text-sm font-medium leading-relaxed">{reward.description}</p>
              </div>

              <div className="mt-8 flex items-center justify-between gap-4 p-2">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Wymień za</span>
                  <span className="text-2xl font-black text-zinc-900">{reward.cost} pkt</span>
                </div>
                
                <button
                  disabled={!profile || profile.points < reward.cost || buyingId !== null}
                  className="flex-1 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center bg-blue-600 text-white shadow-lg shadow-blue-100"
                >
                  Odbieram!
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
