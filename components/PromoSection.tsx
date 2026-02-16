'use client'

import { motion } from 'framer-motion';
import { Tag, ArrowRight, Flame, ShoppingBag, Timer } from 'lucide-react';
import Link from 'next/link';

// DANE TESTOWE (W przyszłości podmienimy to na fetch z Supabase)
const promoHighlights = [
  {
    id: 1,
    title: "LEGO Technic Monster Jam",
    oldPrice: "89.99",
    newPrice: "64.99",
    badge: "-25%",
    color: "#BF2024", // Czerwony Urwisa
    endsIn: "2 dni"
  },
  {
    id: 2,
    title: "Plecak CoolPack Gradient",
    oldPrice: "219.00",
    newPrice: "169.00",
    badge: "HIT CENOWY",
    color: "#0055ff", // Niebieski
    endsIn: "Do wyczerpania"
  },
  {
    id: 3,
    title: "Gra Planszowa Wsiąść do Pociągu",
    oldPrice: "159.99",
    newPrice: "129.99",
    badge: "SUPER OKAZJA",
    color: "#22c55e", // Zielony
    endsIn: "Ostatnie sztuki"
  }
];

export default function PromoSection() {
  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        
        {/* --- NAGŁÓWEK SEKCJI --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-red-100 text-[#BF2024] px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2 animate-pulse">
                <Flame size={14} fill="currentColor" /> Gorące strzały
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black font-heading text-gray-900 tracking-tight leading-none">
              OKAZJE <br className="md:hidden" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#BF2024] to-[#0055ff]">
                TYGODNIA
              </span>
            </h2>
          </div>
          
          <Link 
            href="/oferta/promocje" 
            className="group flex items-center gap-2 px-6 py-3 bg-gray-100 rounded-full text-sm font-black uppercase tracking-widest text-gray-600 hover:bg-black hover:text-white transition-all"
          >
            Zobacz wszystkie <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* --- GRID KAFELKÓW --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {promoHighlights.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -8 }}
              className="group relative bg-white rounded-[2.5rem] p-4 border-2 border-gray-100 hover:border-[#BF2024]/30 hover:shadow-2xl hover:shadow-red-500/10 transition-all duration-300 cursor-pointer"
            >
              {/* Badge (np. -25%) */}
              <div 
                className="absolute top-6 left-6 z-20 px-4 py-1.5 rounded-xl text-xs font-black text-white shadow-lg transform -rotate-3 group-hover:rotate-0 transition-transform"
                style={{ backgroundColor: item.color }}
              >
                {item.badge}
              </div>

              {/* Górna część - Obrazek (Placeholder) */}
              <div className="relative aspect-[4/3] bg-gray-50 rounded-[2rem] overflow-hidden mb-4">
                {/* Tutaj w przyszłości wstawisz <Image /> */}
                <div className="absolute inset-0 flex items-center justify-center text-gray-200">
                  <ShoppingBag size={64} />
                </div>
                
                {/* Overlay przy hover */}
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Dolna część - Treść */}
              <div className="px-2 pb-2">
                {/* Timer / Info */}
                <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">
                  <Timer size={14} /> {item.endsIn}
                </div>

                <h3 className="text-lg font-black text-gray-900 leading-tight mb-3 font-heading group-hover:text-[#BF2024] transition-colors line-clamp-2 min-h-[3rem]">
                  {item.title}
                </h3>

                <div className="flex items-center justify-between bg-gray-50 rounded-2xl p-3 group-hover:bg-gray-100 transition-colors">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-400 line-through font-bold">{item.oldPrice} zł</span>
                    <span className="text-xl font-black text-gray-900">{item.newPrice} zł</span>
                  </div>
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md transform group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: item.color }}
                  >
                    <ArrowRight size={20} />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* --- PASEK INFORMACYJNY NA DOLE --- */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 mx-auto max-w-4xl py-4 px-8 bg-zinc-900 rounded-2xl text-white flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 text-center shadow-xl"
        >
          <div className="flex items-center gap-2">
            <span className="text-xl">🎈</span>
            <p className="text-xs md:text-sm font-bold tracking-wider uppercase font-heading">
              Pompujemy balony helem
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
