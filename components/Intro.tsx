'use client'
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import Image from 'next/image'; // ✅ Używamy next/image dla wydajności
import confetti from 'canvas-confetti';

export default function AnimatedTextIntro({ onComplete }: { onComplete?: () => void }) {
  
  useEffect(() => {
    // Konfetti startuje idealnie w momencie uderzenia grafiki (0.6s)
    const timer = setTimeout(() => {
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.5 }, // Wybuch ze środka
        zIndex: 10000,
        colors: ['#BF2024', '#0055ff', '#FFD700', '#ffffff']
      });
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: 'blur(40px)' }}
      className="fixed inset-0 z-[9998] bg-white flex flex-col items-center justify-center overflow-hidden cursor-pointer w-screen h-screen"
      onClick={onComplete}
    >
      {/* --- TŁO: CIEPŁA POŚWIATA --- */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.1, 1] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-100/50 via-white to-white"
        />
      </div>

      {/* --- GŁÓWNA GRAFIKA POWITALNA --- */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0, filter: 'blur(20px)' }}
        animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
        transition={{ 
          type: "spring", 
          stiffness: 120, 
          damping: 20, 
          delay: 0.2 
        }}
        className="relative z-10 mb-8 p-4"
      >
        {/* Poświata za obrazkiem */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#BF2024] to-[#0055ff] blur-[60px] opacity-20 rounded-full transform scale-75" />
        
        <Image
          src="/urwis-welcome.webp" 
          alt="Witaj w świecie Urwisa"
          width={600}  // Dostosuj do rzeczywistych proporcji obrazka
          height={600} // Dostosuj do rzeczywistych proporcji obrazka
          priority     // ✅ Kluczowe dla intro (LCP)
          className="relative w-auto h-[40vh] md:h-[50vh] object-contain drop-shadow-2xl"
        />
      </motion.div>

      {/* --- NAPISY (Jeśli grafika ich nie zawiera) --- */}
      <div className="text-center relative z-10 space-y-4">
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="text-4xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#BF2024] to-[#0055ff] tracking-tight"
          style={{ textShadow: '0 10px 30px rgba(0,0,0,0.05)' }}
        >
          Witaj w Bazie!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-zinc-400 font-bold uppercase tracking-[0.4em] text-[10px] md:text-sm"
        >
          Twój Magiczny Świat Zabawy
        </motion.p>
      </div>

      {/* --- ORBITUJĄCE DETALE --- */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-2xl md:text-4xl pointer-events-none opacity-30"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 3 + i, 
            repeat: Infinity, 
            delay: i * 0.5 
          }}
          style={{
            top: `${20 + Math.random() * 60}%`,
            left: `${10 + Math.random() * 80}%`,
          }}
        >
          {['✨', '🎈', '🎮', '🚀'][i % 4]}
        </motion.div>
      ))}

      {/* Hint na dole */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ repeat: Infinity, duration: 2, delay: 2.5 }}
        className="absolute bottom-8 text-zinc-300 font-black text-[10px] uppercase tracking-widest"
      >
        Kliknij ekran, aby wejść
      </motion.div>
    </motion.div>
  );
}
