'use client'

import { motion } from 'framer-motion'
import { 
  Gamepad2, 
  Backpack, 
  PartyPopper, 
  Puzzle, 
  BookOpen, 
  ChevronRight 
} from 'lucide-react'
import Link from 'next/link'

const categories = [
  {
    title: "Świat Zabawek",
    desc: "Najlepsze klocki, lalki i figurki, które pobudzają wyobraźnię.",
    icon: Puzzle,
    color: "#BF2024",
    size: "lg", // Duży kafelek
    href: "/oferta/"
  },
  {
    title: "Wyprawka Szkolna",
    desc: "Plecaki i przybory dla małych geniuszy.",
    icon: Backpack,
    color: "#0055ff",
    size: "md",
    href: "/oferta/"
  },
  {
    title: "Akcesoria Imprezowe",
    desc: "Balony i dekoracje na epickie urodziny.",
    icon: PartyPopper,
    color: "#f59e0b",
    size: "md",
    href: "/oferta/"
  },
  {
    title: "Gry Planszowe",
    desc: "Rodzinne wieczory pełne emocji.",
    icon: Gamepad2,
    color: "#22c55e",
    size: "sm",
    href: "/oferta/"
  },
  {
    title: "Kreatywny Kącik",
    desc: "Plastyka i nauka przez zabawę.",
    icon: BookOpen,
    color: "#a855f7",
    size: "sm",
    href: "/oferta/"
  }
]

export default function OfertaGrid() {
  return (
    <section id="oferta" className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        
        {/* Nagłówek Sekcji */}
        <div className="mb-16 text-center lg:text-left">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl lg:text-6xl font-black font-heading text-gray-900 mb-4"
          >
            WIĘCEJ NIŻ <span className="text-[#BF2024]">ZABAWKI</span>
          </motion.h2>
          <p className="text-gray-600 max-w-2xl font-body text-lg">
            Od klocków po wyprawki – w Urwisie znajdziesz wszystko, czego potrzebuje Twój mały bohater do codziennych przygód.
          </p>
        </div>

        {/* Grid Kategorii */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[200px]">
          {categories.map((cat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              className={`
                group relative rounded-[2rem] p-8 overflow-hidden cursor-pointer border-2 border-transparent hover:border-gray-100 transition-all shadow-sm hover:shadow-2xl
                ${cat.size === 'lg' ? 'md:col-span-2 md:row-span-2' : ''}
                ${cat.size === 'md' ? 'md:col-span-2 md:row-span-1' : ''}
                ${cat.size === 'sm' ? 'md:col-span-1 md:row-span-1' : ''}
              `}
              style={{ backgroundColor: `${cat.color}08` }} // 8% opacity tła w kolorze kategorii
            >
              {/* Ikona w tle (duża, lekko widoczna) */}
              <cat.icon 
                className="absolute -right-4 -bottom-4 opacity-[0.05] group-hover:scale-110 transition-transform duration-500" 
                size={180} 
                style={{ color: cat.color }}
              />

              <div className="relative z-10 h-full flex flex-col">
                <div 
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: cat.color }}
                >
                  <cat.icon className="text-white" size={24} />
                </div>

                <h3 className="text-2xl font-black font-heading text-gray-900 mb-2">
                  {cat.title}
                </h3>
                <p className="text-gray-600 font-body text-sm mb-6 flex-1">
                  {cat.desc}
                </p>

                <Link 
                  href={cat.href}
                  className="inline-flex items-center gap-2 font-black text-xs uppercase tracking-widest transition-all group-hover:gap-4"
                  style={{ color: cat.color }}
                >
                  Sprawdź ofertę <ChevronRight size={14} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
