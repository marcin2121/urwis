'use client'
import { motion } from 'framer-motion';

export default function AnimatedTextIntro() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9998,
        backgroundColor: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'clamp(1.5rem, 4vw, 3rem)'
      }}
    >
      {/* Logo */}
      <motion.div
        initial={{ 
          opacity: 0, 
          scale: 0.9 
        }}
        animate={{ 
          opacity: 1, 
          scale: 1 
        }}
        transition={{
          duration: 0.8,
          delay: 0.2,
          ease: [0.25, 0.46, 0.45, 0.94] // easeOutCubic
        }}
      >
        <img 
          src="/logo.png" 
          alt="Urwis Logo" 
          style={{
            height: 'clamp(5rem, 16vw, 14rem)',
            width: 'auto',
            filter: 'drop-shadow(0 10px 40px rgba(191,32,36,0.3))'
          }}
        />
      </motion.div>

      {/* Teksty */}
      <div 
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'flex-start',
          gap: 0
        }}
      >
        {/* "Sklep" */}
        <motion.div
          initial={{
            opacity: 0,
            y: 30,
            filter: 'blur(10px)'
          }}
          animate={{
            opacity: 1,
            y: 0,
            filter: 'blur(0px)'
          }}
          transition={{
            duration: 0.8,
            delay: 0.2,
            ease: [0.25, 0.46, 0.45, 0.94] // easeOutCubic
          }}
          style={{
            fontSize: 'clamp(3rem, 12vw, 9rem)',
            fontWeight: 900,
            lineHeight: 1,
            letterSpacing: '-0.03em',
            color: '#bf2024',
            marginBottom: '-1rem'
          }}
        >
          Sklep
        </motion.div>

        {/* "Urwis" */}
        <motion.div
          initial={{
            opacity: 0,
            y: 30,
            filter: 'blur(10px)'
          }}
          animate={{
            opacity: 1,
            y: 0,
            filter: 'blur(0px)'
          }}
          transition={{
            duration: 0.8,
            delay: 0.45, // 0.2 + 0.25 = 0.45s
            ease: [0.25, 0.46, 0.45, 0.94] // easeOutCubic
          }}
          style={{
            fontSize: 'clamp(2rem, 8vw, 6rem)',
            fontWeight: 900,
            lineHeight: 1,
            letterSpacing: '-0.02em',
            color: '#0055ff'
          }}
        >
          Urwis
        </motion.div>
      </div>
    </div>
  );
}
