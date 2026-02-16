'use client'

import { motion } from 'framer-motion'
import { 
  Gamepad2, 
  Trophy, 
  Target, 
  Zap, 
  Crown,
  ChevronRight,
  Star
} from 'lucide-react'
import Link from 'next/link'
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext'

export default function KlubUrwisaSection() {
  const { session } = useSupabaseAuth()

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
      
      {/* Tło Dekoracyjne (Subtelne kropki) */}
      <div className="absolute inset-0 opacity-[0.4]" 
           style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
      </div>

      {/* Dekoracyjne Bloby (Jasne) */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-b from-blue-100/40 to-transparent rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-t from-red-100/40 to-transparent rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* LEWA KOLUMNA: Tekst */}
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
                Dołącz do darmowego klubu, zbieraj punkty za aktywność 
                i wymieniaj je na <span className="font-bold text-gray-900">prawdziwe nagrody</span>.
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

              {/* Social Proof */}
              <div className="mt-8 flex items-center justify-center lg:justify-start gap-4 text-sm font-bold text-gray-400">
                <div className="flex -space-x-3">
                   {[1,2,3].map(i => (
                     <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white" />
                   ))}
                </div>
                <span>Dołącz do ekipy Urwisów!</span>
              </div>
            </motion.div>
          </div>

          {/* PRAWA KOLUMNA: Karty (Jasne, z cieniem) */}
          <div className="lg:w-1/2 w-full perspective-1000">
             <div className="space-y-4">
               {cards.map((card, i) => (
                 <Link href={card.href} key={i}>
                   <motion.div
                     initial={{ opacity: 0, x: 50 }}
                     whileInView={{ opacity: 1, x: 0 }}
                     viewport={{ once: true }}
                     transition={{ delay: i * 0.15 }}
                     whileHover={{ scale: 1.02, translateX: -5 }}
                     className={`group relative bg-white p-6 rounded-[2rem] border-2 border-transparent ${card.border} shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-6 cursor-pointer`}
                   >
                     {/* Ikona z tłem */}
                     <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${card.bgIcon} ${card.color} shadow-sm shrink-0 group-hover:scale-110 transition-transform`}>
                       <card.icon size={32} strokeWidth={2.5} />
                     </div>

                     {/* Tekst */}
                     <div className="flex-1">
                       <h3 className="text-xl font-black font-heading text-gray-900 mb-1">
                         {card.title}
                       </h3>
                       <p className="text-gray-500 text-sm font-body font-medium">
                         {card.subtitle}
                       </p>
                     </div>

                     {/* Badge / Strzałka */}
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
