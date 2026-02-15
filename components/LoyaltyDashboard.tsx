'use client'
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSupabaseLoyalty } from '@/contexts/SupabaseLoyaltyContext';

export default function LoyaltyDashboard() {
  const { points, level, badges, addPoints, redeemPoints, pointsHistory } = useSupabaseLoyalty();
  const [showRewards, setShowRewards] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const levels = [
    { name: 'Brązowy', min: 0, max: 99, color: 'from-amber-700 to-amber-900', icon: '🥉' },
    { name: 'Srebrny', min: 100, max: 499, color: 'from-gray-400 to-gray-600', icon: '🥈' },
    { name: 'Złoty', min: 500, max: 999, color: 'from-yellow-400 to-yellow-600', icon: '🥇' },
    { name: 'Platynowy', min: 1000, max: 1999, color: 'from-cyan-400 to-blue-600', icon: '💎' },
    { name: 'Diamentowy', min: 2000, max: 9999, color: 'from-purple-400 to-pink-600', icon: '👑' },
  ];

  const currentLevel = levels.find(l => l.name === level) || levels[0];
  const nextLevel = levels[levels.indexOf(currentLevel) + 1];
  const progress = nextLevel
    ? ((points - currentLevel.min) / (nextLevel.min - currentLevel.min)) * 100
    : 100;

  const rewards = [
    { id: 1, name: '10% Rabatu', points: 100, code: 'LOYALTY10', icon: '🎁' },
    { id: 2, name: '15% Rabatu', points: 250, code: 'LOYALTY15', icon: '🎉' },
    { id: 3, name: '20% Rabatu', points: 500, code: 'LOYALTY20', icon: '🏆' },
    { id: 4, name: 'Darmowa Dostawa', points: 150, code: 'FREESHIP', icon: '🚚' },
    { id: 5, name: 'Prezent Niespodzianka', points: 300, code: 'GIFT300', icon: '🎁' },
    { id: 6, name: '50zł Voucher', points: 1000, code: 'VOUCHER50', icon: '💰' },
  ];

  const badgesList = [
    { id: 'first_100', name: 'Pierwsze 100', icon: '🌟', description: 'Zdobądź 100 punktów' },
    { id: 'collector', name: 'Kolekcjoner', icon: '💎', description: 'Zdobądź 500 punktów' },
    { id: 'master', name: 'Mistrz', icon: '👑', description: 'Zdobądź 1000 punktów' },
    { id: 'regular', name: 'Stały Klient', icon: '❤️', description: '10 transakcji' },
  ];

  const handleRedeem = (reward: typeof rewards[0]) => {
    if (redeemPoints(reward.points)) {
      alert(`Gratulacje! Twój kod rabatowy: ${reward.code}`);
    } else {
      alert('Masz za mało punktów!');
    }
  };

  // Demo - przyznaj punkty (usuń w produkcji)
  const demoActions = [
    { label: 'Zakup za 100zł', points: 10, reason: 'Zakup w sklepie' },
    { label: 'Polecenie znajomemu', points: 50, reason: 'Program poleceń' },
    { label: 'Udostępnienie w social media', points: 15, reason: 'Udostępnienie' },
    { label: 'Gra w mini-gry', points: 20, reason: 'Mini-gra' },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-purple-50 to-pink-50">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 mb-4">
            <span className="text-2xl">👑</span>
            <span className="font-bold text-purple-600">Program Lojalnościowy</span>
          </div>

          <h2 className="text-5xl font-black mb-4">
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Klub Urwisa
            </span>
          </h2>

          <p className="text-xl text-gray-600">
            Zbieraj punkty i wymieniaj na ekskluzywne nagrody!
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">
          {/* Left - Current Status */}
          <div className="lg:col-span-2 space-y-6">
            {/* Points Card */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl shadow-2xl p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-3xl font-black text-gray-800">Twoje Punkty</h3>
                  <p className="text-gray-600">Poziom: {level}</p>
                </div>
                <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${currentLevel.color} flex items-center justify-center text-4xl`}>
                  {currentLevel.icon}
                </div>
              </div>

              <div className="text-6xl font-black text-center mb-6">
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {points}
                </span>
              </div>

              {/* Progress Bar */}
              {nextLevel && (
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>{currentLevel.name}</span>
                    <span>{nextLevel.name}</span>
                  </div>
                  <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full bg-gradient-to-r ${currentLevel.color}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                  <p className="text-center text-sm text-gray-600 mt-2">
                    Jeszcze {nextLevel.min - points} punktów do {nextLevel.name}!
                  </p>
                </div>
              )}
            </motion.div>

            {/* Badges */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl shadow-2xl p-8"
            >
              <h3 className="text-2xl font-black mb-6">Twoje Odznaki</h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {badgesList.map((badge) => {
                  const isUnlocked = badges.includes(badge.id);
                  return (
                    <motion.div
                      key={badge.id}
                      whileHover={isUnlocked ? { scale: 1.05 } : {}}
                      className={`p-4 rounded-2xl text-center ${isUnlocked
                        ? 'bg-gradient-to-br from-yellow-100 to-orange-100 border-2 border-yellow-400'
                        : 'bg-gray-100 opacity-50'
                        }`}
                    >
                      <div className="text-4xl mb-2 filter"
                        style={{ filter: isUnlocked ? 'none' : 'grayscale(100%)' }}
                      >
                        {badge.icon}
                      </div>
                      <div className="text-xs font-bold text-gray-800">{badge.name}</div>
                      <div className="text-xs text-gray-600">{badge.description}</div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Demo Actions (usuń w produkcji) */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-3xl p-8"
            >
              <h3 className="text-xl font-black mb-4">🎮 Demo - Zdobądź punkty:</h3>
              <div className="grid grid-cols-2 gap-3">
                {demoActions.map((action, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => addPoints(action.points, action.reason)}
                    className="p-4 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all"
                  >
                    <div className="font-bold text-sm mb-1">{action.label}</div>
                    <div className="text-green-600 font-black">+{action.points} pkt</div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right - Rewards & History */}
          <div className="space-y-6">
            {/* Rewards */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl shadow-2xl p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-black">Nagrody</h3>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setShowRewards(!showRewards)}
                  className="text-sm text-purple-600 font-bold"
                >
                  {showRewards ? 'Zwiń' : 'Rozwiń'}
                </motion.button>
              </div>

              <AnimatePresence>
                {showRewards && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="space-y-3"
                  >
                    {rewards.map((reward) => (
                      <div
                        key={reward.id}
                        className={`p-4 rounded-xl border-2 ${points >= reward.points
                          ? 'border-green-400 bg-green-50'
                          : 'border-gray-200 bg-gray-50'
                          }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-3xl">{reward.icon}</span>
                            <div>
                              <div className="font-bold text-sm">{reward.name}</div>
                              <div className="text-xs text-gray-600">{reward.points} pkt</div>
                            </div>
                          </div>

                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleRedeem(reward)}
                            disabled={points < reward.points}
                            className={`px-3 py-1 rounded-full text-xs font-bold ${points >= reward.points
                              ? 'bg-green-500 text-white hover:bg-green-600'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              }`}
                          >
                            Wymień
                          </motion.button>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* History */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl shadow-2xl p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-black">Historia</h3>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setShowHistory(!showHistory)}
                  className="text-sm text-purple-600 font-bold"
                >
                  {showHistory ? 'Zwiń' : 'Rozwiń'}
                </motion.button>
              </div>

              <AnimatePresence>
                {showHistory && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="space-y-2 max-h-96 overflow-y-auto"
                  >
                    {pointsHistory.length === 0 ? (
                      <p className="text-center text-gray-500 text-sm py-4">
                        Brak historii
                      </p>
                    ) : (
                      pointsHistory.map((entry) => (
                        <div
                          key={entry.id}
                          className="p-3 rounded-lg bg-gray-50 border border-gray-200"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="text-sm font-semibold">{entry.reason}</div>
                              <div className="text-xs text-gray-500">
                                {new Date(entry.date).toLocaleDateString('pl-PL')}
                              </div>
                            </div>
                            <div className={`font-black ${entry.type === 'earned' ? 'text-green-600' : 'text-red-600'
                              }`}>
                              {entry.type === 'earned' ? '+' : ''}{entry.amount}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
