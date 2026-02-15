'use client'
import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import Image from 'next/image';
import GradualBlur from '@/components/GradualBlur';

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  
  const y = useSpring(useTransform(scrollYProgress, [0, 1], [0, 300]), springConfig);
  const opacity = useSpring(useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0]), springConfig);
  const scale = useSpring(useTransform(scrollYProgress, [0, 1], [1, 0.95]), springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const scrollToNext = () => {
    document.getElementById('poznaj-urwisa')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section 
      ref={containerRef} 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      
      {/* Background */}
      <motion.div 
        style={{ opacity }}
        className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-blue-50"
      >
        {/* Animated Gradient Blobs */}
        <motion.div 
          style={{ y: useTransform(scrollYProgress, [0, 1], [0, -100]) }}
          className="absolute inset-0 opacity-40"
        >
          <div 
            className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full blur-3xl transition-transform duration-300"
            style={{
              background: `radial-gradient(circle, #BF2024 0%, transparent 70%)`,
              transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
            }}
          />
          <div 
            className="absolute bottom-0 left-0 w-[700px] h-[700px] rounded-full blur-3xl transition-transform duration-300"
            style={{
              background: `radial-gradient(circle, #0055ff 0%, transparent 70%)`,
              transform: `translate(${-mousePosition.x * 0.03}px, ${-mousePosition.y * 0.03}px)`,
            }}
          />
        </motion.div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03]" 
          style={{
            backgroundImage: `linear-gradient(#BF2024 1px, transparent 1px), linear-gradient(90deg, #BF2024 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />

        {/* GradualBlur overlay na bottom */}
        <GradualBlur
          position="bottom"
          strength={3}
          height="20rem"
          animated="scroll"
          curve="ease-out"
          divCount={8}
        />
      </motion.div>

      {/* Main Content */}
      <motion.div 
        style={{ 
          y, 
          opacity,
          scale,
        }}
        className="relative z-10 container mx-auto px-6 lg:px-12 text-center"
      >
        
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center gap-3 px-6 py-3 mb-8 rounded-full border-2 shadow-xl backdrop-blur-sm"
          style={{
            background: 'linear-gradient(135deg, rgba(191, 32, 36, 0.1), rgba(0, 85, 255, 0.1))',
            borderColor: '#BF2024',
          }}
        >
          <div className="relative">
            <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: '#BF2024' }} />
            <div className="absolute inset-0 w-3 h-3 rounded-full animate-ping" style={{ backgroundColor: '#BF2024' }} />
          </div>
          <span className="text-sm font-bold uppercase tracking-wider" style={{ color: '#BF2024' }}>
            Otwarte Pn-Pt 9:00-17:00
          </span>
        </motion.div>

        {/* Main Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-8"
        >
          <h1 className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-black leading-[0.9] tracking-tight mb-6">
            <span className="block text-gray-900">Witaj w</span>
            <span 
              className="block mt-4 text-transparent bg-clip-text"
              style={{
                backgroundImage: 'linear-gradient(135deg, #BF2024 0%, #0055ff 100%)',
                WebkitTextStroke: '2px transparent',
              }}
            >
              Sklepie Urwis
            </span>
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-xl sm:text-2xl lg:text-3xl text-gray-700 font-medium max-w-4xl mx-auto mb-12 leading-relaxed"
        >
          Twoje ulubione miejsce na <span className="font-bold" style={{ color: '#BF2024' }}>zabawki</span> i <span className="font-bold" style={{ color: '#0055ff' }}>gry</span> w Białobrzegach
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="flex flex-wrap justify-center gap-4 mb-16"
        >
          <motion.a
            href="#oferta"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="group relative px-8 py-4 rounded-full text-white font-bold text-lg shadow-2xl overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #BF2024 0%, #0055ff 100%)',
            }}
          >
            <span className="relative z-10 flex items-center gap-3">
              Zobacz ofertę
              <motion.svg
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </motion.svg>
            </span>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: 'linear-gradient(135deg, #0055ff 0%, #BF2024 100%)',
              }}
            />
          </motion.a>

          <motion.a
            href="tel:+48123456789"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-4 rounded-full font-bold text-lg border-2 backdrop-blur-sm shadow-xl transition-all"
            style={{
              borderColor: '#BF2024',
              color: '#BF2024',
              background: 'rgba(255, 255, 255, 0.8)',
            }}
          >
            📞 Zadzwoń do nas
          </motion.a>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="flex flex-wrap justify-center gap-8 text-sm font-semibold"
        >
          <div className="flex items-center gap-2 px-5 py-3 rounded-full bg-white/80 backdrop-blur-sm shadow-lg border border-gray-200">
            <span className="text-2xl">⭐</span>
            <div className="text-left">
              <div className="flex items-center gap-1">
                <span style={{ color: '#BF2024' }}>5.0</span>
                <span className="text-gray-600">Ocena</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 px-5 py-3 rounded-full bg-white/80 backdrop-blur-sm shadow-lg border border-gray-200">
            <span className="text-2xl">📍</span>
            <div className="text-left">
              <div className="text-gray-800">ul. Rzemieślnicza 38A</div>
            </div>
          </div>

          <div className="flex items-center gap-2 px-5 py-3 rounded-full bg-white/80 backdrop-blur-sm shadow-lg border border-gray-200">
            <span className="text-2xl">❤️</span>
            <div className="text-left">
              <div className="flex items-center gap-1">
                <span style={{ color: '#0055ff' }}>Od 2007</span>
                <span className="text-gray-600">roku</span>
              </div>
            </div>
          </div>
        </motion.div>

      </motion.div>

      {/* Floating Elements */}
      <motion.div 
        style={{ y: useTransform(scrollYProgress, [0, 1], [0, 200]) }}
        className="absolute inset-0 pointer-events-none overflow-hidden"
      >
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-32 left-[10%] w-24 h-24 bg-white/10 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 flex items-center justify-center text-5xl"
        >
          🎮
        </motion.div>
        <motion.div
          animate={{ 
            y: [0, 20, 0],
            rotate: [0, -5, 0]
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute top-48 right-[12%] w-28 h-28 bg-white/10 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 flex items-center justify-center text-6xl"
        >
          🧸
        </motion.div>
        <motion.div
          animate={{ 
            y: [0, -15, 0],
            rotate: [0, 8, 0]
          }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-32 left-[15%] w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 flex items-center justify-center text-4xl"
        >
          🎁
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        style={{ 
          opacity: useTransform(scrollYProgress, [0, 0.3], [1, 0])
        }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 cursor-pointer group z-20"
        onClick={scrollToNext}
      >
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="relative"
        >
          <div className="absolute -inset-4 rounded-full blur-xl opacity-50"
            style={{ background: 'linear-gradient(135deg, #BF2024 0%, #0055ff 100%)' }}
          />
          
          <div className="relative px-8 py-4 bg-white rounded-full shadow-2xl border-2 group-hover:scale-105 transition-transform"
            style={{ borderColor: '#BF2024' }}
          >
            <div className="flex items-center gap-3">
              <span className="text-base font-black uppercase tracking-wider" style={{ color: '#BF2024' }}>
                Poznaj Urwisa
              </span>
              <motion.span 
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="text-2xl"
              >
                👇
              </motion.span>
            </div>
          </div>
        </motion.div>
      </motion.div>

    </section>
  );
}
