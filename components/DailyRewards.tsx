'use client'
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSupabaseLoyalty } from '@/contexts/SupabaseLoyaltyContext';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import AuthModal from './AuthModal';

// Interfejs dla nagród
interface Reward {
  type: 'points' | 'exp' | 'badge' | 'coupon';
  amount?: number;
  icon: string;
  name?: string;
  code?: string;
}

export default function DailyRewards() {
  const { addPoints } = useSupabaseLoyalty();
  const { profile: user, session } = useSupabaseAuth();
  const isAuthenticated = !!session;
  const [streak, setStreak] = useState(0);
  const [lastVisit, setLastVisit] = useState<string | null>(null);
  const [todayReward, setTodayReward] = useState<any>(null);
  const [showReward, setShowReward] = useState(false);
  const [dailyChallenge, setDailyChallenge] = useState<any>(null);
  const [hiddenItemFound, setHiddenItemFound] = useState(false);
  const [challengeCompleted, setChallengeCompleted] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // ✨ NOWE: Stany dla pop-upów
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalMessage, setModalMessage] = useState({ title: '', description: '', icon: '' });

  // Tablica wyzwań
  const challenges = [
    {
      type: 'quiz',
      icon: '🧠',
      question: 'W którym roku założono Urwisa?',
      options: ['1967', '2026', '2007', '2023'],
      correct: 2,
      reward: 50,
      expReward: 100,
    },
    {
      type: 'trivia',
      icon: '❓',
      question: 'W którym mieście znajduje się Sklep Urwis?',
      options: ['Warszawa', 'Kraków', 'Białobrzegi', 'Radom'],
      correct: 2,
      reward: 50,
      expReward: 100,
    },
    {
      type: 'quiz',
      icon: '📍',
      question: 'Pod jakim adresem znajduje się nasz sklep?',
      options: ['Reymonta 38A', 'Mickiewicza 10', 'Słowackiego 5', 'Piłsudskiego 20'],
      correct: 0,
      reward: 50,
      expReward: 100,
    },
    {
      type: 'math',
      icon: '🔢',
      question: 'Ile to 15 + 27?',
      options: ['18', '42', '43', '67'],
      correct: 1,
      reward: 60,
      expReward: 120,
    },
    {
      type: 'math',
      icon: '➗',
      question: 'Ile to 8 × 7?',
      options: ['54', '56', '58', '60'],
      correct: 1,
      reward: 60,
      expReward: 120,
    },
    {
      type: 'math',
      icon: '➖',
      question: 'Ile to 100 - 33?',
      options: ['61', '63', '67', '69'],
      correct: 2,
      reward: 60,
      expReward: 120,
    },
    {
      type: 'find',
      icon: '🔍',
      task: 'Znajdź ukryty przedmiot na stronie głównej!',
      reward: 75,
      expReward: 150,
    },
    {
      type: 'game',
      icon: '🎮',
      task: 'Zagraj w dowolną grę i zdobądź 100 punktów!',
      reward: 100,
      expReward: 200,
    },
    {
      type: 'share',
      icon: '📢',
      task: 'Podziel się naszą stroną ze znajomymi!',
      reward: 60,
      expReward: 120,
    },

  ];

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setStreak(0);
      setLastVisit(null);
      setTodayReward(null);
      setDailyChallenge(null);
      setChallengeCompleted(false);
      return;
    }

    const today = new Date().toDateString();
    const lastVisitDate = localStorage.getItem(`urwis_last_visit_${user.id}`);
    const storedStreak = parseInt(localStorage.getItem(`urwis_streak_${user.id}`) || '0');

    // Sprawdź czy dzisiaj już odebrał nagrodę
    const claimedToday = localStorage.getItem(`urwis_claimed_${user.id}_${today}`);
    if (claimedToday) {
      const claimedData = JSON.parse(claimedToday);
      setTodayReward(claimedData);
      setStreak(storedStreak);
    } else {
      setTodayReward(null);
    }

    // Logika streak
    if (lastVisitDate) {
      const lastDate = new Date(lastVisitDate);
      const todayDate = new Date(today);
      const diffTime = todayDate.getTime() - lastDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        setStreak(storedStreak);
      } else if (diffDays === 1) {
        const newStreak = storedStreak + 1;
        setStreak(newStreak);
        localStorage.setItem(`urwis_streak_${user.id}`, newStreak.toString());
      } else {
        setStreak(1);
        localStorage.setItem(`urwis_streak_${user.id}`, '1');
      }
    } else {
      setStreak(1);
      localStorage.setItem(`urwis_streak_${user.id}`, '1');
    }

    setLastVisit(lastVisitDate);

    // Daily Challenge
    const challengeCompleted = localStorage.getItem(`urwis_challenge_completed_${user.id}_${today}`);
    setChallengeCompleted(!!challengeCompleted);

    const dayOfYear = getDayOfYear();
    const challengeIndex = dayOfYear % challenges.length;
    setDailyChallenge(challenges[challengeIndex]);

  }, [isAuthenticated, user]);

  const claimDailyReward = () => {
    if (!isAuthenticated || !user) {
      setShowAuthModal(true);
      return;
    }

    const baseReward = 10;
    const streakBonus = Math.min(streak * 5, 100);
    const totalPoints = baseReward + streakBonus;
    const expAmount = 50 + (streak * 10);

    const rewards: Reward[] = [
      { type: 'points', amount: totalPoints, icon: '⭐' },
      { type: 'exp', amount: expAmount, icon: '✨' },
      { type: 'badge', name: `${streak} dni z rzędu!`, icon: '🏆' },
    ];

    if (streak === 7) {
      rewards.push({
        type: 'coupon',
        code: 'WEEK10',
        icon: '🎁',
        name: '10% zniżki'
      } as Reward);
    }
    if (streak === 30) {
      rewards.push({
        type: 'coupon',
        code: 'MONTH20',
        icon: '👑',
        name: '20% zniżki'
      } as Reward);
    }
    if (streak === 100) {
      rewards.push({
        type: 'coupon',
        code: 'LEGEND50',
        icon: '💎',
        name: '50% zniżki'
      } as Reward);
    }

    setTodayReward({ points: totalPoints, exp: expAmount, rewards, streak });

    addPoints(totalPoints, `Codzienna wizyta - dzień ${streak}`);
    addExp(expAmount, `Codzienna nagroda - seria ${streak} dni`);

    const today = new Date().toDateString();
    localStorage.setItem(`urwis_last_visit_${user.id}`, today);
    localStorage.setItem(
      `urwis_claimed_${user.id}_${today}`,
      JSON.stringify({ points: totalPoints, exp: expAmount, rewards, streak })
    );
    setShowReward(true);
  };

  const completeDailyChallenge = (answer?: number) => {
    if (!isAuthenticated || !user) {
      setShowAuthModal(true);
      return;
    }

    if (!dailyChallenge || challengeCompleted) return;

    let success = false;

    if (dailyChallenge.type === 'quiz' || dailyChallenge.type === 'trivia') {
      success = answer === dailyChallenge.correct;
    } else if (dailyChallenge.type === 'find') {
      success = hiddenItemFound;
    } else {
      success = true;
    }

    if (success) {
      addPoints(dailyChallenge.reward, 'Dzienne wyzwanie');
      addExp(dailyChallenge.expReward, `Dzienne wyzwanie: ${dailyChallenge.task || dailyChallenge.question}`);

      const today = new Date().toDateString();
      localStorage.setItem(`urwis_challenge_completed_${user.id}_${today}`, 'true');
      setChallengeCompleted(true);

      // ✨ Ładny pop-up zamiast alert
      setModalMessage({
        title: 'Gratulacje!',
        description: `Zdobyłeś ${dailyChallenge.reward} punktów i ${dailyChallenge.expReward} EXP!`,
        icon: '🎉'
      });
      setShowSuccessModal(true);
    } else {
      // ✨ Ładny pop-up błędu
      setModalMessage({
        title: 'Ups!',
        description: 'Niestety, nieprawidłowa odpowiedź. Spróbuj ponownie jutro!',
        icon: '😢'
      });
      setShowErrorModal(true);
    }
  };

  const getDayOfYear = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <section className="py-24 bg-linear-to-b from-yellow-50 to-orange-50 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl"
            initial={{ y: -100, x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000) }}
            animate={{
              y: (typeof window !== 'undefined' ? window.innerHeight : 1000) + 100,
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          >
            {['🎁', '⭐', '🎮', '🧸', '🎨'][Math.floor(Math.random() * 5)]}
          </motion.div>
        ))}
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-yellow-100 to-orange-100 mb-4">
            <span className="text-2xl">🌟</span>
            <span className="font-bold text-orange-600">Codzienna Przygoda</span>
          </div>

          <h2 className="text-5xl font-black mb-4">
            <span className="bg-linear-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
              Wróć Jutro!
            </span>
          </h2>

          <p className="text-xl text-gray-600">
            Każdego dnia czeka na Ciebie nowa niespodzianka! 🎉
          </p>

          {!isAuthenticated && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-6 bg-linear-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-2xl max-w-md mx-auto"
            >
              <div className="text-5xl mb-3">🎁</div>
              <p className="text-blue-900 font-bold text-lg mb-4">
                Zaloguj się, aby odbierać codzienne nagrody!
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAuthModal(true)}
                className="px-8 py-3 bg-linear-to-r from-blue-500 to-purple-500 text-white rounded-full font-bold shadow-lg"
              >
                👤 Zaloguj się lub Zarejestruj
              </motion.button>
            </motion.div>
          )}
        </motion.div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Daily Reward Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl shadow-2xl p-8"
          >
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">🎁</div>
              <h3 className="text-2xl font-black mb-2">Dzienna Nagroda</h3>
              <p className="text-gray-600">Dzień {getDayOfYear()} w roku</p>
            </div>

            {/* Streak Counter */}
            {isAuthenticated && (
              <div className="bg-linear-to-r from-yellow-100 to-orange-100 rounded-2xl p-6 mb-6">
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-2">Twoja seria</div>
                  <div className="text-5xl font-black text-orange-600 mb-2">
                    {streak} 🔥
                  </div>
                  <div className="text-sm text-gray-600">
                    {streak === 1 ? 'Pierwszy dzień!' : `${streak} dni z rzędu!`}
                  </div>
                </div>

                {/* Streak Progress */}
                <div className="mt-4 flex gap-2 justify-center">
                  {[...Array(7)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${i < streak % 7
                        ? 'bg-linear-to-br from-yellow-400 to-orange-500 text-white'
                        : 'bg-gray-200 text-gray-400'
                        }`}
                    >
                      {i < streak % 7 ? '✓' : i + 1}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Claim Button */}
            {!todayReward ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={claimDailyReward}
                className="w-full py-4 bg-linear-to-r from-yellow-500 to-orange-500 text-white rounded-full font-black text-xl shadow-xl"
              >
                {isAuthenticated ? '🎁 Odbierz Nagrodę!' : '👤 Zaloguj się'}
              </motion.button>
            ) : (
              <div className="text-center p-4 bg-green-100 rounded-2xl">
                <div className="text-2xl mb-2">✅</div>
                <div className="font-bold text-green-700">
                  Dzisiejszą nagrodę już odebrałeś!
                </div>
                <div className="text-sm text-gray-600 mt-2">
                  +{todayReward.points} punktów • +{todayReward.exp} EXP
                </div>
              </div>
            )}

            <div className="mt-4 text-center text-sm text-gray-600">
              💡 Wróć jutro po więcej punktów i EXP!<br />
              Im dłuższa seria, tym większe nagrody!
            </div>
          </motion.div>

          {/* Daily Challenge Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl shadow-2xl p-8"
          >
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">{dailyChallenge?.icon || '🎯'}</div>
              <h3 className="text-2xl font-black mb-2">Dzienne Wyzwanie</h3>
              <p className="text-gray-600">Wykonaj i zdobądź bonus!</p>
            </div>

            {!isAuthenticated && (
              <div className="text-center p-6 bg-gray-50 rounded-2xl">
                <div className="text-4xl mb-3">🔒</div>
                <p className="text-gray-700 mb-4">
                  Zaloguj się, aby zobaczyć dzienne wyzwanie!
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAuthModal(true)}
                  className="px-6 py-3 bg-linear-to-r from-blue-500 to-purple-500 text-white rounded-full font-bold"
                >
                  Zaloguj się
                </motion.button>
              </div>
            )}

            {isAuthenticated && challengeCompleted && (
              <div className="text-center p-4 bg-green-100 rounded-2xl mb-6">
                <div className="text-2xl mb-2">✅</div>
                <div className="font-bold text-green-700">
                  Dzisiejsze wyzwanie ukończone!
                </div>
              </div>
            )}

            {isAuthenticated && dailyChallenge && !challengeCompleted && (
              <div>
                {/* Quiz/Trivia Challenge */}
                {(dailyChallenge.type === 'quiz' || dailyChallenge.type === 'trivia') && (
                  <div>
                    <p className="text-lg font-semibold mb-4 text-center">
                      {dailyChallenge.question}
                    </p>
                    <div className="space-y-3">
                      {dailyChallenge.options.map((option: string, i: number) => (
                        <motion.button
                          key={i}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => completeDailyChallenge(i)}
                          className="w-full p-4 bg-gray-100 hover:bg-linear-to-r hover:from-yellow-100 hover:to-orange-100 rounded-xl font-semibold transition-all"
                        >
                          {option}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Find Challenge */}
                {dailyChallenge.type === 'find' && (
                  <div className="text-center">
                    <p className="text-lg font-semibold mb-6">
                      {dailyChallenge.task}
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setHiddenItemFound(true);
                        completeDailyChallenge();
                      }}
                      className="px-8 py-4 bg-linear-to-r from-yellow-500 to-orange-500 text-white rounded-full font-bold"
                    >
                      Znalazłem! 🔍
                    </motion.button>
                  </div>
                )}

                {/* Other Challenges */}
                {(dailyChallenge.type === 'share' || dailyChallenge.type === 'game') && (
                  <div className="text-center">
                    <p className="text-lg font-semibold mb-6">
                      {dailyChallenge.task}
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => completeDailyChallenge()}
                      className="px-8 py-4 bg-linear-to-r from-yellow-500 to-orange-500 text-white rounded-full font-bold"
                    >
                      Zrobione! ✓
                    </motion.button>
                  </div>
                )}

                <div className="mt-6 text-center p-4 bg-yellow-50 rounded-xl">
                  <div className="text-sm text-gray-600">Nagroda za ukończenie</div>
                  <div className="text-2xl font-black text-orange-600">
                    +{dailyChallenge.reward} punktów
                  </div>
                  <div className="text-lg font-bold text-purple-600">
                    +{dailyChallenge.expReward} EXP ✨
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Coming Tomorrow Teaser */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 max-w-2xl mx-auto bg-linear-to-r from-purple-100 to-pink-100 rounded-3xl p-8 text-center"
        >
          <div className="text-4xl mb-4">👀</div>
          <h3 className="text-2xl font-black mb-2">Jutro czeka na Ciebie...</h3>
          <p className="text-gray-700 mb-4">
            Specjalna niespodzianka dla wszystkich, którzy wrócą jutro!
          </p>
          <div className="flex gap-4 justify-center text-3xl">
            <motion.div animate={{ rotate: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
              🎁
            </motion.div>
            <motion.div animate={{ rotate: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 2, delay: 0.2 }}>
              ⭐
            </motion.div>
            <motion.div animate={{ rotate: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2, delay: 0.4 }}>
              🎮
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Reward Modal */}
      <AnimatePresence>
        {showReward && todayReward && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowReward(false)}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 max-w-md text-center"
            >
              <div className="text-7xl mb-4">🎉</div>
              <h3 className="text-3xl font-black mb-4">Gratulacje!</h3>
              <p className="text-xl mb-2">
                Zdobyłeś <span className="font-black text-orange-600">{todayReward.points}</span> punktów!
              </p>
              <p className="text-lg mb-6">
                i <span className="font-black text-purple-600">{todayReward.exp}</span> EXP! ✨
              </p>

              {todayReward.rewards.map((reward: any, i: number) => (
                <div key={i} className="mb-4 p-4 bg-yellow-50 rounded-xl">
                  <div className="text-3xl mb-2">{reward.icon}</div>
                  <div className="font-bold">
                    {reward.type === 'points' && `${reward.amount} punktów`}
                    {reward.type === 'exp' && `${reward.amount} EXP`}
                    {reward.type === 'badge' && reward.name}
                    {reward.type === 'coupon' && `Kupon: ${reward.code}`}
                  </div>
                </div>
              ))}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowReward(false)}
                className="px-8 py-3 bg-linear-to-r from-yellow-500 to-orange-500 text-white rounded-full font-bold"
              >
                Super! 🎊
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✨ Success Modal (Challenge Completed) */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSuccessModal(false)}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 max-w-md text-center shadow-2xl"
            >
              <motion.div
                className="text-7xl mb-4"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ duration: 0.5 }}
              >
                {modalMessage.icon}
              </motion.div>
              <h3 className="text-3xl font-black mb-4 bg-linear-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {modalMessage.title}
              </h3>
              <p className="text-lg text-gray-700 mb-6">
                {modalMessage.description}
              </p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowSuccessModal(false)}
                className="px-8 py-3 bg-linear-to-r from-green-500 to-emerald-500 text-white rounded-full font-bold shadow-lg"
              >
                Super! 🎊
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✨ Error Modal (Wrong Answer) */}
      <AnimatePresence>
        {showErrorModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowErrorModal(false)}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 max-w-md text-center shadow-2xl"
            >
              <motion.div
                className="text-7xl mb-4"
                animate={{
                  rotate: [0, -10, 10, -10, 0]
                }}
                transition={{ duration: 0.5 }}
              >
                {modalMessage.icon}
              </motion.div>
              <h3 className="text-3xl font-black mb-4 bg-linear-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                {modalMessage.title}
              </h3>
              <p className="text-lg text-gray-700 mb-6">
                {modalMessage.description}
              </p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowErrorModal(false)}
                className="px-8 py-3 bg-linear-to-r from-red-500 to-pink-500 text-white rounded-full font-bold shadow-lg"
              >
                Rozumiem 💪
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </section>
  );
}
