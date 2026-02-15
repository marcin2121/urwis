'use client'
import UrwisIntro from '@/components/Intro';
import Particles from "@/components/Particles";
import { RibbonsBg } from "@/components/Ribbons";
import HeroSection from '@/components/Hero';
import PoznajUrwisa from '@/components/PoznajUrwisa';
import AboutSection from '@/components/AboutSection';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <UrwisIntro>
      <main style={{ position: 'relative', backgroundColor: '#FFFFFF', minHeight: '100vh', overflow: 'hidden' }}>
        {/* Warstwa 1: Particles (tło) */}
        <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
          <Particles
            particleCount={1000}
            particleColors={["#bf2024", "#0055ff"]}
            alphaParticles
            particleBaseSize={100}
            speed={0.1}
            sizeRandomness={1}
            particleSpread={10}
          />
        </div>

        {/* Warstwa 2: Ribbons (ślady za kursorem) */}
        <div style={{ position: 'fixed', inset: 0, zIndex: 11, pointerEvents: 'none' }}>
          <RibbonsBg colors={["#bf2024", "#0055ff"]} />
        </div>

        {/* Hero Section */}
        <HeroSection />

        {/* Sekcja Poznaj Urwisa */}
        <PoznajUrwisa />

        {/* Sekcja O nas */}
        <AboutSection />

        {/* Quick Links - Sekcja z linkami do podstron */}
        <QuickLinksSection />

      </main>
    </UrwisIntro>
  );
}

// Komponent z linkami do podstron
function QuickLinksSection() {
  const links = [
    {
      title: 'Dzienne Wyzwania',
      description: 'Wykonuj codzienne misje i zdobywaj EXP!',
      icon: '🎯',
      href: '/challenges',
      gradient: 'from-blue-500 to-purple-500',
      bgGradient: 'from-blue-50 to-purple-50'
    },
    {
      title: 'Program Lojalnościowy',
      description: 'Zbieraj punkty i wymieniaj na nagrody!',
      icon: '🏆',
      href: '/loyalty',
      gradient: 'from-yellow-500 to-orange-500',
      bgGradient: 'from-yellow-50 to-orange-50'
    },
    {
      title: 'Mini Gry',
      description: 'Zagraj w gry i zdobądź dodatkowe punkty!',
      icon: '🎮',
      href: '/games',
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-50 to-emerald-50'
    },
    {
      title: 'Mój Profil',
      description: 'Zobacz swoje osiągnięcia i statystyki!',
      icon: '👤',
      href: '/profile',
      gradient: 'from-pink-500 to-red-500',
      bgGradient: 'from-pink-50 to-red-50'
    },
  ];

  return (
    <section className="py-24 relative z-10">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-black mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Odkryj Klub Urwisa
            </span>
          </h2>
          <p className="text-xl text-gray-600">
            Wybierz sekcję i zacznij przygodę!
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {links.map((link, index) => (
            <Link key={index} href={link.href}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -10 }}
                whileTap={{ scale: 0.95 }}
                className={`bg-gradient-to-br ${link.bgGradient} rounded-3xl p-8 shadow-xl cursor-pointer border-2 border-white hover:shadow-2xl transition-all`}
              >
                <div className="text-6xl mb-4 text-center">{link.icon}</div>
                <h3 className="text-xl font-black text-gray-900 mb-2 text-center">
                  {link.title}
                </h3>
                <p className="text-sm text-gray-700 text-center mb-4">
                  {link.description}
                </p>
                <div className={`w-full py-2 bg-gradient-to-r ${link.gradient} text-white rounded-xl font-bold text-center text-sm`}>
                  Przejdź →
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
