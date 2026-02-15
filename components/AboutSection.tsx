"use client";
import React from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

export default function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const features = [
    {
      icon: "🎮",
      title: "Ponad 1000 produktów",
      description: "Zabawki, gry planszowe i karciane dla każdego",
      color: "from-red-500 to-orange-500",
      delay: 0.2
    },
    {
      icon: "🎁",
      title: "Doświadczenie od 2007",
      description: `${new Date().getFullYear() - 2007} lat pasji i zaufania klientów`,
      color: "from-orange-500 to-yellow-500",
      delay: 0.3
    },
    {
      icon: "⚡",
      title: "Ekspresowa wysyłka",
      description: "Zamówienie dzisiaj, zabawa jutro",
      color: "from-blue-500 to-purple-500",
      delay: 0.4
    },
    {
      icon: "❤️",
      title: "100% satysfakcji",
      description: "Zadowoleni klienci to nasz priorytet",
      color: "from-pink-500 to-red-500",
      delay: 0.5
    }
  ];

  return (
    <section
      id="o-nas"
      ref={ref}
      className="relative py-32 overflow-hidden bg-linear-to-br from-orange-50 via-white to-red-50"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.05, 0.1, 0.05]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 left-10 w-96 h-96 bg-linear-to-br from-red-400 to-orange-400 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
            opacity: [0.05, 0.1, 0.05]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear", delay: 5 }}
          className="absolute bottom-20 right-10 w-96 h-96 bg-linear-to-br from-blue-400 to-purple-400 rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={isInView ? { scale: 1, rotate: 0 } : {}}
            transition={{ duration: 0.8, type: "spring", bounce: 0.5 }}
            className="inline-block mb-6"
          >
            <div className="relative">
              <Image
                src="/logo.png"
                alt="Urwis Logo"
                width={120}
                height={120}
                className="drop-shadow-2xl"
              />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-4 bg-gradient-to-r from-red-500 via-orange-500 to-blue-500 rounded-full blur-xl opacity-30"
              />
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-black mb-6"
            style={{ paddingBottom: '0.1em' }}
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-orange-500 to-blue-600">
              O nas
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-xl sm:text-2xl text-gray-700 max-w-3xl mx-auto font-medium leading-relaxed"
            style={{ paddingBottom: '0.2em' }}
          >
            Jesteśmy <span className="font-black text-red-600">lokalnym sklepem z pasją</span> do
            dostarczania radości dzieciom i dorosłym w Białobrzegach i okolicach! 🎉
          </motion.p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{
                duration: 0.6,
                delay: feature.delay,
                type: "spring",
                bounce: 0.4
              }}
              whileHover={{
                scale: 1.05,
                y: -10,
                transition: { duration: 0.2 }
              }}
              className="relative group"
            >
              <div
                className="relative h-full p-8 rounded-3xl backdrop-blur-xl border-2 border-white shadow-2xl overflow-hidden"
                style={{
                  background: 'rgba(255, 255, 255, 0.7)',
                }}
              >
                {/* Animated gradient background */}
                <motion.div
                  className={`absolute inset-0 bg-linear-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                />

                {/* Floating icon */}
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: idx * 0.2
                  }}
                  className="text-7xl mb-6 relative z-10"
                >
                  {feature.icon}
                </motion.div>

                <h3 className="text-2xl font-black text-gray-900 mb-3 relative z-10" style={{ paddingBottom: '0.05em' }}>
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-lg font-medium relative z-10" style={{ paddingBottom: '0.1em' }}>
                  {feature.description}
                </p>

                {/* Shine effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Story Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="relative max-w-5xl mx-auto"
        >
          <div
            className="relative p-12 rounded-[3rem] backdrop-blur-xl border-2 border-white shadow-2xl overflow-hidden"
            style={{
              background: 'rgba(255, 255, 255, 0.8)',
            }}
          >
            {/* Animated corner decorations */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute top-0 right-0 w-40 h-40 bg-linear-to-br from-red-500 to-orange-500 opacity-20 rounded-full blur-2xl"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute bottom-0 left-0 w-40 h-40 bg-linear-to-br from-blue-500 to-purple-500 opacity-20 rounded-full blur-2xl"
            />

            <div className="relative z-10">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="mb-8"
              >
                <h3 className="text-4xl sm:text-5xl font-black text-gray-900 mb-6" style={{ paddingBottom: '0.1em' }}>
                  Nasza <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">Historia</span>
                </h3>
                <div className="w-24 h-2 bg-gradient-to-r from-red-500 via-orange-500 to-blue-500 rounded-full" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="space-y-6 text-lg sm:text-xl text-gray-700 leading-relaxed"
                style={{ paddingBottom: '0.2em' }}
              >
                <p className="font-medium">
                  <span className="text-2xl font-black text-red-600">Sklep Urwis</span> to <span className="font-bold">rodzinny biznes</span>,
                  który powstał z <span className="font-bold text-orange-600">miłości do dziecięcej radości</span> i pasji do gier.
                </p>
                <p className="font-medium">
                  Od <span className="font-black text-blue-600">2007 roku</span> dostarczamy najlepsze zabawki, gry planszowe i karciane
                  mieszkańcom Białobrzegów i okolic. Nasza <span className="font-bold">lokalna obecność</span> to gwarancja
                  <span className="font-bold text-red-600"> szybkiej obsługi</span> i <span className="font-bold text-orange-600">osobistego podejścia</span>.
                </p>
                <p className="font-medium">
                  Każdy produkt wybieramy z <span className="font-black text-purple-600">dbałością o jakość</span> i
                  <span className="font-bold"> bezpieczeństwo</span>. Wierzymy, że zabawa to nie tylko rozrywka,
                  ale też <span className="font-bold text-blue-600">nauka i rozwój</span>! ✨
                </p>
              </motion.div>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 1 }}
                className="mt-10 flex flex-wrap gap-6 justify-center sm:justify-start"
              >
                <motion.a
                  href="/kontakt"
                  className="group relative px-10 py-5 rounded-full text-white text-lg font-black shadow-2xl overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, #BF2024 0%, #0055ff 100%)',
                  }}
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="relative z-10 flex items-center gap-3">
                    📍 Odwiedź nas
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-orange-500 via-red-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />
                </motion.a>

                <motion.a
                  href="tel:+48604208193"
                  className="px-10 py-5 rounded-full text-gray-900 text-lg font-black border-4 border-gray-900 hover:bg-gray-900 hover:text-white transition-all shadow-xl"
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  📞 Zadzwoń
                </motion.a>
              </motion.div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
