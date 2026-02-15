'use client'
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import DailyCalendar from '@/components/DailyCalendar';
import DailyChallenge from '@/components/DailyChallenge';
import MissionsPanel from '@/components/MissionsPanel';
import AchievementsPanel from '@/components/AchievementsPanel';

export default function DailyChallenges() {
  const { profile: user, session } = useSupabaseAuth();
  const isAuthenticated = !!session;
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <div className="min-h-screen bg-linear-to-b from-yellow-50 to-orange-50 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
  {typeof window !== 'undefined' && [...Array(20)].map((_, i) => ( // ← DODAJ CHECK
    <motion.div
      key={i}
      className="absolute text-4xl"
      initial={{ 
        y: -100, 
        x: Math.random() * window.innerWidth 
      }}
      animate={{
        y: window.innerHeight + 100,
        x: Math.random() * window.innerWidth,
      }}
      transition={{
        duration: Math.random() * 10 + 10,
        repeat: Infinity,
        delay: Math.random() * 5,
      }}
    >
      {['🎁', '⭐', '🎮', '🏆', '🎯'][Math.floor(Math.random() * 5)]}
    </motion.div>
  ))}
</div>

      <div className="container mx-auto px-6 pt-32 pb-12 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-yellow-100 to-orange-100 mb-4">
            <span className="text-2xl">🌟</span>
            <span className="font-bold text-orange-600">Codzienne Wyzwania</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-black mb-4">
            <span className="bg-linear-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
              Twoje Misje
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Wykonuj codzienne zadania, zdobywaj EXP i odblokowuj nagrody! 🎉
          </p>

          {!isAuthenticated && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-6 bg-linear-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-2xl max-w-md mx-auto"
            >
              <div className="text-5xl mb-3">🔒</div>
              <p className="text-blue-900 font-bold text-lg mb-4">
                Zaloguj się, aby zobaczyć swoje misje!
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAuthModal(true)}
                className="px-8 py-3 bg-linear-to-r from-blue-500 to-purple-500 text-white rounded-full font-bold shadow-lg"
              >
                👤 Zaloguj się
              </motion.button>
            </motion.div>
          )}
        </motion.div>

        {isAuthenticated && (
          <>
            {/* Sekcja 1: Kalendarz & Dzienne Wyzwanie */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* Kalendarz Nagród */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="bg-white rounded-3xl shadow-2xl p-8 h-full">
                  <div className="text-center mb-6">
                    <div className="text-6xl mb-4">📅</div>
                    <h3 className="text-2xl font-black mb-2">Kalendarz Nagród</h3>
                    <p className="text-gray-600">Odbieraj codziennie i buduj serię!</p>
                  </div>
                  
                  <DailyCalendar />
                </div>
              </motion.div>

              {/* Dzienne Wyzwanie */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <DailyChallenge />
              </motion.div>
            </div>

            {/* Sekcja 2: Twoje Misje */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-12"
            >
              <MissionsPanel />
            </motion.div>

            {/* Sekcja 3: Osiągnięcia */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <AchievementsPanel />
            </motion.div>
          </>
        )}

        {/* Coming Tomorrow Teaser */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 max-w-2xl mx-auto bg-linear-to-r from-purple-100 to-pink-100 rounded-3xl p-8 text-center"
        >
          <div className="text-4xl mb-4">👀</div>
          <h3 className="text-2xl font-black mb-2">Jutro czeka na Ciebie...</h3>
          <p className="text-gray-700 mb-4">
            Nowe wyzwania, nagrody i niespodzianki!
          </p>
          <div className="flex gap-4 justify-center text-3xl">
            <motion.div 
              animate={{ rotate: [0, 10, 0] }} 
              transition={{ repeat: Infinity, duration: 2 }}
            >
              🎁
            </motion.div>
            <motion.div 
              animate={{ rotate: [0, -10, 0] }} 
              transition={{ repeat: Infinity, duration: 2, delay: 0.2 }}
            >
              ⭐
            </motion.div>
            <motion.div 
              animate={{ rotate: [0, 10, 0] }} 
              transition={{ repeat: Infinity, duration: 2, delay: 0.4 }}
            >
              🎮
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Auth Modal (jeśli potrzebny) */}
      {showAuthModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowAuthModal(false)}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-8 max-w-md text-center"
          >
            <div className="text-7xl mb-4">🔒</div>
            <h3 className="text-3xl font-black mb-4">Zaloguj się</h3>
            <p className="text-gray-600 mb-6">
              Musisz być zalogowany, aby móc wykonywać misje!
            </p>
            <a href="/profil">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-linear-to-r from-blue-500 to-purple-500 text-white rounded-full font-bold"
              >
                Przejdź do logowania
              </motion.button>
            </a>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
