'use client'

import { motion } from 'framer-motion'
import { 
  Gamepad2, 
  Trophy, 
  Target, 
  Zap, 
  Crown,
  ChevronRight,
  Star,
  Users
} from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext'

export default function KlubUrwisaSection() {
  const { session, supabase } = useSupabaseAuth()
  
  const [stats, setStats] = useState({ users: 0, rewards: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true;
    let channel: any = null;
  
    async function fetchLiveStats() {
      if (!supabase || !isMounted) return;
      try {
        const [usersRes, rewardsRes] = await Promise.all([
          supabase.from('profiles').select('*', { count: 'exact', head: true }),
          supabase.from('claimed_rewards').select('*', { count: 'exact', head: true })
        ]);
  
        if (isMounted) {
          setStats({
            users: usersRes.count || 0,
            rewards: rewardsRes.count || 0
          });
          setLoading(false);
        }
      } catch (error) {
        console.error("Błąd statystyk:", error);
        if (isMounted) setLoading(false);
      }
    }
  
    fetchLiveStats();
  
    // --- POPRAWIONY REALTIME ---
    if (supabase) {
      channel = supabase
        .channel('klub_stats_changes') // unikalna nazwa kanału
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'profiles' },
          () => fetchLiveStats()
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'claimed_rewards' },
          () => fetchLiveStats()
        )
        .subscribe((status: string) => {
          // Loguj błędy tylko jeśli faktycznie wystąpią po próbie połączenia
          if (status === 'CHANNEL_ERROR') {
            console.warn('Realtime channel error - próbuję połączyć ponownie...');
          }
        });
    }
  
    return () => {
      isMounted = false;
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [supabase]);
  const cards = [
    {
      title: "Codzienne Wyzwania",
      subtitle: "Wbijaj EXP za zadania",
      icon: Target,
      href: "/misje",
      color: "text-blue-600",
      bgIcon: "bg-blue-100",
      border: "hover:border-blue-200",
      xp: "+500 XP"
    },
    {
      title: "Odbieraj Nagrody",
      subtitle: "Punkty = Darmowe Zabawki",
      icon: Trophy,
      href: "/nagrody",
      color: "text-yellow-600",
      bgIcon: "bg-yellow-100",
      border: "hover:border-yellow-200",
      xp: "Sklep"
    },
    {
      title: "Strefa Gier",
      subtitle: "Bij rekordy i wygrywaj",
      icon: Gamepad2,
      href: "/gry",
      color: "text-purple-600",
      bgIcon: "bg-purple-100",
      border: "hover:border-purple-200",
      xp: "Ranking"
    }
  ]

  return (
    <section className="relative py-24 bg-gray-50 overflow-hidden">
      {/* Tło */}
      <div className="absolute inset-0 opacity-[0.4]" 
           style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Tekst */}
          <div className="lg:w-1/2 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-200 text-gray-500 font-bold text-xs uppercase tracking-widest mb-6 shadow-sm">
                <Zap size={14} className="text-yellow-500 fill-yellow-500" /> 
                Dołącz do gry
              </div>

              <h2 className="text-5xl md:text-6xl font-black font-heading text-gray-900 mb-6 leading-tight">
                ODKRYJ <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#BF2024] to-[#0055ff]">
                  KLUB URWISA
                </span>
              </h2>

              <p className="text-lg text-gray-600 font-body leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0">
                W naszym sklepie zakupy to dopiero początek przygody! 
                Dołącz do darmowego klubu i wymieniaj punkty na 
                <span className="font-bold text-gray-900 ml-1">prawdziwe nagrody</span>.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                {!session ? (
                  <Link 
                    href="/profil"
                    className="group relative px-8 py-4 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest overflow-hidden hover:scale-105 transition-transform shadow-xl hover:shadow-2xl"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#BF2024] to-[#0055ff] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="relative z-10 flex items-center gap-2">
                       Zarejestruj się <Crown size={20} className="text-yellow-400" />
                    </span>
                  </Link>
                ) : (
                  <Link 
                    href="/profil"
                    className="px-8 py-4 bg-white text-gray-900 border-2 border-gray-200 rounded-2xl font-black uppercase tracking-widest hover:border-gray-900 transition-all flex items-center justify-center gap-2"
                  >
                    Twój Profil <Star size={20} />
                  </Link>
                )}
              </div>

              {/* Social Proof LIVE (Bez +124) */}
              <motion.div 
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  transition={{ delay: 0.5 }}
  className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-6 border-t border-gray-100 pt-8"
>
  {/* Klubowicze */}
  <div className="flex items-center gap-2">
    <div className="flex items-center justify-center w-9 h-9 rounded-full bg-blue-50 text-blue-600 border border-blue-100 shadow-sm">
      <Users size={18} />
    </div>
    <div className="text-left min-w-[80px]">
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Klubowicze</p>
      {loading ? (
        <div className="h-4 w-16 bg-gray-200 animate-pulse rounded" />
      ) : (
        <motion.p 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          className="text-sm font-black text-gray-900 leading-tight"
        >
          {stats.users} Urwisów
        </motion.p>
      )}
    </div>
  </div>

  <div className="h-6 w-px bg-gray-200 hidden sm:block" />

  {/* Status Live */}
  <div className="flex items-center gap-3">
    <div className="relative flex h-3 w-3">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
    </div>
    <p className="text-xs font-bold text-gray-600 uppercase tracking-tight">
      System <span className="text-green-600 font-black">Live</span>
    </p>
  </div>

  <div className="h-6 w-px bg-gray-200 hidden sm:block" />

  {/* Nagrody */}
  <div className="flex items-center gap-2">
    <div className="flex items-center justify-center w-9 h-9 rounded-full bg-orange-50 text-orange-600 border border-orange-100 shadow-sm">
      <Trophy size={18} />
    </div>
    <div className="text-left min-w-[80px]">
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Odebrano</p>
      {loading ? (
        <div className="h-4 w-20 bg-gray-200 animate-pulse rounded" />
      ) : (
        <motion.p 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          className="text-sm font-black text-gray-900 leading-tight"
        >
          {stats.rewards} nagród
        </motion.p>
      )}
    </div>
  </div>
</motion.div>
            </motion.div>
          </div>

          {/* Karty */}
          <div className="lg:w-1/2 w-full">
             <div className="space-y-4">
               {cards.map((card, i) => (
                 <Link href={card.href} key={i}>
                   <motion.div
                     initial={{ opacity: 0, x: 50 }}
                     whileInView={{ opacity: 1, x: 0 }}
                     viewport={{ once: true }}
                     transition={{ delay: i * 0.15 }}
                     whileHover={{ scale: 1.02, x: -5 }}
                     className={`group relative bg-white p-6 rounded-[2rem] border-2 border-transparent ${card.border} shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-6 cursor-pointer`}
                   >
                     <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${card.bgIcon} ${card.color} shadow-sm shrink-0 group-hover:scale-110 transition-transform`}>
                       <card.icon size={32} strokeWidth={2.5} />
                     </div>
                     <div className="flex-1 text-left">
                       <h3 className="text-xl font-black font-heading text-gray-900 mb-1">{card.title}</h3>
                       <p className="text-gray-500 text-sm font-body font-medium">{card.subtitle}</p>
                     </div>
                     <div className="flex flex-col items-end justify-center gap-2">
                        <span className="px-3 py-1 bg-gray-100 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:bg-black group-hover:text-white transition-colors">
                          {card.xp}
                        </span>
                        <ChevronRight className="text-gray-300 group-hover:text-black transition-colors" />
                     </div>
                   </motion.div>
                 </Link>
               ))}
             </div>
          </div>

        </div>
      </div>
    </section>
  )
}
