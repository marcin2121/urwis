"use client";
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { 
  MapPin, 
  Phone, 
  Clock, 
  Heart, 
  PackageOpen, 
  History, 
  Navigation 
} from "lucide-react";

export default function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  // Obliczanie lat doświadczenia
  const yearsOfExperience = new Date().getFullYear() - 2007;

  const features = [
    {
      icon: PackageOpen,
      title: "Magazyn Skarbów",
      description: "Tysiące zabawek i gier dostępnych od ręki na półkach.",
      color: "#BF2024", // Czerwony
      delay: 0.2
    },
    {
      icon: History,
      title: `Działamy od ${yearsOfExperience} lat`,
      description: "Lokalna firma z tradycjami i zaufaniem pokoleń.",
      color: "#f59e0b", // Pomarańczowy
      delay: 0.3
    },
    {
      icon: Clock,
      title: "Zabawa Natychmiast",
      description: "Nie czekaj na kuriera. Wpadnij, wybierz i baw się dziś!",
      color: "#0055ff", // Niebieski
      delay: 0.4
    },
    {
      icon: Heart,
      title: "Doradzamy z Sercem",
      description: "Nie wiesz co wybrać? Pomożemy znaleźć prezent idealny.",
      color: "#ec4899", // Różowy
      delay: 0.5
    }
  ];

  return (
    <section
      id="o-nas"
      ref={ref}
      className="relative py-24 md:py-32 overflow-hidden bg-white"
    >
      {/* Tło dekoracyjne (subtelne) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, 45, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-gradient-to-br from-red-100 to-orange-100 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, -45, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear", delay: 2 }}
          className="absolute top-1/2 -right-20 w-[400px] h-[400px] bg-gradient-to-br from-blue-100 to-purple-100 rounded-full blur-[100px]"
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">

        {/* --- HEADER SEKCJI --- */}
        <div className="text-center mb-20">
          {/* Logo Animation */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={isInView ? { scale: 1, rotate: 0 } : {}}
            transition={{ duration: 0.8, type: "spring", bounce: 0.5 }}
            className="inline-block mb-8 relative"
          >
            <div className="relative z-10">
              <Image
                src="/logo.png"
                alt="Urwis Logo"
                width={100}
                height={100}
                className="drop-shadow-2xl"
              />
            </div>
            {/* Glow za logo */}
            <motion.div
              animate={{ rotate: 360, scale: [1, 1.1, 1] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 bg-gradient-to-r from-[#BF2024] to-[#0055ff] rounded-full blur-2xl opacity-40 -z-10"
            />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            className="text-5xl md:text-7xl font-black mb-6 font-heading text-gray-900"
          >
            KIM SĄ <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0055ff] to-[#bf2024]">URWISY?</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto font-body leading-relaxed"
          >
            Jesteśmy <span className="font-bold text-gray-900">lokalną drużyną</span> z Białobrzegów. 
            Od lat łączymy pokolenia przy wspólnej zabawie, dostarczając emocji małym i dużym!
          </motion.p>
        </div>

        {/* --- FEATURES GRID (KAFELKI) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: feature.delay, duration: 0.5 }}
              whileHover={{ y: -10 }}
              className="group relative bg-white rounded-[2rem] p-8 border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg group-hover:scale-110 transition-transform duration-300"
                style={{ backgroundColor: feature.color }}
              >
                <feature.icon size={32} strokeWidth={2.5} />
              </div>

              <h3 className="text-xl font-black text-gray-900 mb-3 font-heading">
                {feature.title}
              </h3>
              <p className="text-gray-500 font-body leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* --- STORY & CTA (DOLNA CZĘŚĆ) --- */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="relative max-w-5xl mx-auto"
        >
          <div className="relative p-8 md:p-12 rounded-[3rem] bg-white border border-gray-100 shadow-2xl overflow-hidden">
            
            {/* Tło gradientowe wewnątrz karty */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#BF2024]/10 to-orange-500/10 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-[#0055ff]/10 to-purple-500/10 rounded-full blur-3xl -z-10" />

            <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
              
              {/* Lewa strona: Tekst */}
              <div className="flex-1 space-y-6">
                <h3 className="text-3xl md:text-4xl font-black text-gray-900 font-heading">
                  Więcej niż sklep. <br />
                  <span className="text-[#BF2024]">To Centrum Rozrywki.</span>
                </h3>
                <div className="w-20 h-2 bg-gradient-to-r from-[#BF2024] to-[#0055ff] rounded-full" />
                
                <div className="space-y-4 text-lg text-gray-600 font-body">
                  <p>
                    <span className="font-bold text-gray-900">Sklep Urwis</span> to nie algorytm. 
                    To ludzie, którzy znają się na klockach lepiej niż na Excelu. 
                  </p>
                  <p>
                    Wierzymy, że najlepsze zakupy to te, których można dotknąć. 
                    Dlatego zapraszamy Cię do naszego świata w Białobrzegach – miejsca, 
                    gdzie <span className="font-bold text-[#0055ff]">każdy czuje się jak dziecko</span> (nawet jeśli ma brodę).
                  </p>
                </div>
              </div>

              {/* Prawa strona: Przyciski CTA */}
              <div className="flex flex-col gap-4 w-full md:w-auto shrink-0">
                <motion.a
                  href="/kontakt"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative px-8 py-4 bg-gray-900 text-white rounded-2xl font-black text-center shadow-lg overflow-hidden flex items-center justify-center gap-3"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#BF2024] to-[#0055ff] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative z-10 flex items-center gap-2">
                    <Navigation size={20} /> Jak dojechać?
                  </span>
                </motion.a>

                <motion.a
                  href="tel:+48604208193"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white text-gray-900 border-2 border-gray-200 rounded-2xl font-black text-center hover:border-gray-900 transition-all flex items-center justify-center gap-3"
                >
                  <Phone size={20} /> Zadzwoń do nas
                </motion.a>
              </div>

            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
