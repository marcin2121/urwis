'use client'
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext'; // ← DODAJ
import { trackGamePlayed } from '@/utils/missionTracking'; // ← DODAJ
import MemoryGame from './games/MemoryGame';
import SpinTheWheel from './games/SpinTheWheel';
import ClickerGame from './games/ClickerGame';
import PuzzleSlider from './games/PuzzleSlider';

export default function MiniGamesSection() {
  const { profile: user } = useSupabaseAuth(); // ← DODAJ
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  // ← DODAJ tracking przy otwarciu gry
  useEffect(() => {
    if (selectedGame && user) {
      const game = games.find(g => g.id === selectedGame);
      if (game) {
        console.log('🎮 Tracking game start:', game.title);
        trackGamePlayed(user.id, game.id);
      }
    }
  }, [selectedGame, user]);

  const games = [
    {
      id: 'memory',
      title: 'Memory - Zabawki',
      description: 'Znajdź pary zabawek i zdobądź 10% zniżki!',
      icon: '🧠',
      color: 'from-purple-500 to-pink-500',
      component: MemoryGame,
      difficulty: 'Łatwe'
    },
    {
      id: 'wheel',
      title: 'Koło Fortuny',
      description: 'Zakręć kołem i wygraj kupony!',
      icon: '🎡',
      color: 'from-blue-500 to-cyan-500',
      component: SpinTheWheel,
      difficulty: 'Szczęście'
    },
    {
      id: 'clicker',
      title: 'Złap Prezenty',
      description: 'Klikaj spadające prezenty na czas!',
      icon: '🎁',
      color: 'from-red-500 to-orange-500',
      component: ClickerGame,
      difficulty: 'Średnie'
    },
    {
      id: 'puzzle',
      title: 'Puzzle Układanka',
      description: 'Ułóż obrazek i odbierz nagrodę',
      icon: '🧩',
      color: 'from-green-500 to-emerald-500',
      component: PuzzleSlider,
      difficulty: 'Trudne'
    }
  ] as const;

  return (
    <section className="py-24 bg-linear-to-b from-white to-gray-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-purple-100 to-pink-100 mb-4">
            <span className="text-2xl">🎮</span>
            <span className="font-bold text-purple-600">Strefa Rozrywki</span>
          </div>

          <h2 className="text-5xl font-black mb-4 bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Zagraj i Wygraj!
          </h2>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Wybierz swoją ulubioną grę, pobaw się i zdobądź ekskluzywne kupony rabatowe
          </p>
        </motion.div>

        {/* Games Grid */}
        {!selectedGame && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {games.map((game, index) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                onClick={() => setSelectedGame(game.id)}
                className="cursor-pointer"
              >
                <div className="relative bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all border-2 border-transparent hover:border-purple-300 overflow-hidden group">
                  {/* Gradient background */}
                  <div className={`absolute inset-0 bg-linear-to-br ${game.color} opacity-0 group-hover:opacity-10 transition-opacity`} />

                  {/* Content */}
                  <div className="relative z-10">
                    <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform">
                      {game.icon}
                    </div>

                    <h3 className="text-xl font-bold mb-2 text-gray-800">
                      {game.title}
                    </h3>

                    <p className="text-gray-600 text-sm mb-4">
                      {game.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-gray-100 text-gray-600">
                        {game.difficulty}
                      </span>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-4 py-2 rounded-full bg-linear-to-r ${game.color} text-white font-bold text-sm shadow-lg`}
                      >
                        Graj →
                      </motion.button>
                    </div>
                  </div>

                  {/* Corner decoration */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-linear-to-br from-yellow-400 to-orange-500 opacity-0 group-hover:opacity-20 rounded-bl-full transition-opacity" />
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Game Modal */}
        <AnimatePresence>
          {selectedGame && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedGame(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-3xl font-bold">
                    {games.find(g => g.id === selectedGame)?.title}
                  </h3>

                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedGame(null)}
                    className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-2xl font-bold"
                  >
                    ×
                  </motion.button>
                </div>

                {/* Game Component */}
                {(() => {
                  const game = games.find(g => g.id === selectedGame);
                  if (!game) return null;
                  const GameComponent = game.component;
                  return <GameComponent onComplete={() => setSelectedGame(null)} />;
                })()}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats/Leaderboard teaser */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-8 px-8 py-4 bg-white rounded-full shadow-lg">
            <div className="text-center">
              <div className="text-3xl font-black text-purple-600">1,234</div>
              <div className="text-xs text-gray-600">Graczy dziś</div>
            </div>
            <div className="w-px h-12 bg-gray-200" />
            <div className="text-center">
              <div className="text-3xl font-black text-pink-600">567</div>
              <div className="text-xs text-gray-600">Zdobytych kuponów</div>
            </div>
            <div className="w-px h-12 bg-gray-200" />
            <div className="text-center">
              <div className="text-3xl font-black text-blue-600">89%</div>
              <div className="text-xs text-gray-600">Wskaźnik wygranych</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
