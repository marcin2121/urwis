'use client'
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useLoyalty } from '@/contexts/LoyaltyContext';

interface Challenge {
  type: string;
  icon: string;
  question?: string;
  options?: string[];
  correct?: number;
  task?: string;
  reward: number;
  expReward: number;
}

export default function DailyChallenge() {
  const { user, isAuthenticated, addExp } = useAuth();
  const { addPoints } = useLoyalty();
  const [dailyChallenge, setDailyChallenge] = useState<Challenge | null>(null);
  const [challengeCompleted, setChallengeCompleted] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalMessage, setModalMessage] = useState({ title: '', description: '', icon: '' });

  const challenges: Challenge[] = [
    // ===== QUIZ (wiedza o sklepie) =====
    {
      type: 'quiz',
      icon: '🧠',
      question: 'Ile lat ma Sklep Urwis?',
      options: ['2 lata', '5 lat', '10 lat', '20 lat'],
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
      type: 'trivia',
      icon: '⏰',
      question: 'Kiedy sklep jest otwarty w sobotę?',
      options: ['Nieczynne', '8:00-15:00', '8:00-18:00', '10:00-14:00'],
      correct: 1,
      reward: 50,
      expReward: 100,
    },

    // ===== MATH (proste matematyka) =====
    {
      type: 'math',
      icon: '🔢',
      question: 'Ile to 15 + 27?',
      options: ['40', '41', '42', '43'],
      correct: 2,
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
      question: 'Ile to 100 - 37?',
      options: ['61', '62', '63', '64'],
      correct: 2,
      reward: 60,
      expReward: 120,
    },

    // ===== RIDDLES (zagadki) =====
    {
      type: 'riddle',
      icon: '🤔',
      question: 'Co ma głowę i ogon, ale nie ma ciała?',
      options: ['Wąż', 'Moneta', 'Rzeka', 'Strzała'],
      correct: 1,
      reward: 70,
      expReward: 140,
    },
    {
      type: 'riddle',
      icon: '💡',
      question: 'Co zawsze przychodzi, ale nigdy nie przychodzi?',
      options: ['Jutro', 'Wczoraj', 'Dziś', 'Wieczór'],
      correct: 0,
      reward: 70,
      expReward: 140,
    },
    {
      type: 'riddle',
      icon: '🎭',
      question: 'Im więcej mnie zabierasz, tym większy się staję. Co to?',
      options: ['Balon', 'Dziura', 'Ciasto', 'Chmura'],
      correct: 1,
      reward: 70,
      expReward: 140,
    },

    // ===== EMOJI QUIZ =====
    {
      type: 'emoji',
      icon: '🎬',
      question: 'Jaki film? 🦁👑',
      options: ['Król Lew', 'Madagaskar', 'Shrek', 'Aladyn'],
      correct: 0,
      reward: 65,
      expReward: 130,
    },
    {
      type: 'emoji',
      icon: '🍕',
      question: 'Co to za jedzenie? 🍅🧀🥖',
      options: ['Hamburger', 'Pizza', 'Kanapka', 'Hot dog'],
      correct: 1,
      reward: 65,
      expReward: 130,
    },

    // ===== TRUE/FALSE =====
    {
      type: 'truefalse',
      icon: '✅',
      question: 'Sklep Urwis jest otwarty w niedzielę',
      options: ['Prawda', 'Fałsz'],
      correct: 1,
      reward: 40,
      expReward: 80,
    },
    {
      type: 'truefalse',
      icon: '❌',
      question: 'W sklepie można płacić kartą',
      options: ['Prawda', 'Fałsz'],
      correct: 0,
      reward: 40,
      expReward: 80,
    },

    // ===== FIND URWIS =====
    {
      type: 'find',
      icon: '🔍',
      task: 'Znajdź ukrytego Urwisa na stronie!',
      reward: 75,
      expReward: 150,
    },

    // ===== INTERACTIVE =====
    {
      type: 'visit',
      icon: '👀',
      task: 'Odwiedź 3 różne sekcje strony!',
      reward: 50,
      expReward: 100,
    },

    // ===== MEMORY =====
    {
      type: 'memory',
      icon: '🧩',
      question: 'Jaką maskotkę ma Sklep Urwis?',
      options: ['Miś', 'Pies', 'Kot', 'Królik'],
      correct: 0,
      reward: 55,
      expReward: 110,
    },

    // ===== SEASONAL =====
    {
      type: 'seasonal',
      icon: '🎄',
      question: 'Które święto jest w grudniu?',
      options: ['Wielkanoc', 'Boże Narodzenie', 'Halloween', 'Walentynki'],
      correct: 1,
      reward: 45,
      expReward: 90,
    },
    {
      type: 'seasonal',
      icon: '❤️',
      question: 'Kiedy są Walentynki?',
      options: ['14 stycznia', '14 lutego', '14 marca', '14 kwietnia'],
      correct: 1,
      reward: 45,
      expReward: 90,
    },
  ];

  useEffect(() => {
    if (!user) return;

    const today = new Date().toDateString();
    
    // Sprawdź czy dzisiaj już wykonał wyzwanie
    const completed = localStorage.getItem(`urwis_challenge_completed_${user.id}_${today}`);
    setChallengeCompleted(!!completed);

    // Wybierz dzisiejsze wyzwanie (deterministyczne)
    const dayOfYear = getDayOfYear();
    const challengeIndex = dayOfYear % challenges.length;
    setDailyChallenge(challenges[challengeIndex]);

  }, [user]);

  const getDayOfYear = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  const completeDailyChallenge = (answer?: number) => {
    if (!user || !dailyChallenge) return;

    let success = false;

    // Sprawdź odpowiedź
    if (dailyChallenge.type === 'quiz' || 
        dailyChallenge.type === 'trivia' || 
        dailyChallenge.type === 'math' || 
        dailyChallenge.type === 'riddle' ||
        dailyChallenge.type === 'emoji' ||
        dailyChallenge.type === 'truefalse' ||
        dailyChallenge.type === 'memory' ||
        dailyChallenge.type === 'seasonal') {
      success = answer === dailyChallenge.correct;
    } else if (dailyChallenge.type === 'find') {
      // Sprawdź czy znalazł Urwisa
      const today = new Date().toDateString();
      const found = localStorage.getItem(`urwis_hidden_found_${user.id}_${today}`);
      success = !!found;
    } else if (dailyChallenge.type === 'visit') {
      // Auto-weryfikacja w MissionTracker (część 3)
      success = true;
    }

    if (success) {
      // Dodaj nagrody
      addPoints(dailyChallenge.reward, 'Dzienne wyzwanie');
      addExp(dailyChallenge.expReward, `Dzienne wyzwanie: ${dailyChallenge.task || dailyChallenge.question}`);
      
      // Zapisz ukończenie
      const today = new Date().toDateString();
      localStorage.setItem(`urwis_challenge_completed_${user.id}_${today}`, 'true');
      setChallengeCompleted(true);
      console.log('✅ Challenge completed and tracked');


      // ✨ DODAJ - Trigger mission check dla weekly challenge
    window.dispatchEvent(new CustomEvent('missionProgress', {
        detail: { type: 'challenges_completed', value: 1 }
      }));

      // Pokaż modal sukcesu
      setModalMessage({
        title: 'Gratulacje!',
        description: `Zdobyłeś ${dailyChallenge.reward} punktów i ${dailyChallenge.expReward} EXP!`,
        icon: '🎉'
      });
      setShowSuccessModal(true);
    } else {
      // Pokaż modal błędu
      setModalMessage({
        title: 'Ups!',
        description: 'Niestety, nieprawidłowa odpowiedź. Spróbuj ponownie jutro!',
        icon: '😢'
      });
      setShowErrorModal(true);
    }
  };

  if (!dailyChallenge) return null;

  return (
    <>
      <div className="bg-white rounded-3xl shadow-2xl p-8 h-full flex flex-col">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">{dailyChallenge.icon}</div>
          <h3 className="text-2xl font-black mb-2">Dzienne Wyzwanie</h3>
          <p className="text-gray-600">Wykonaj i zdobądź bonus!</p>
        </div>

        {challengeCompleted ? (
          // Już ukończone
          <div className="text-center p-6 bg-green-50 rounded-2xl border-2 border-green-300 flex-1 flex flex-col justify-center">
            <div className="text-5xl mb-3">✅</div>
            <div className="font-bold text-green-700 text-lg mb-2">
              Dzisiejsze wyzwanie ukończone!
            </div>
            <div className="text-sm text-gray-600">
              Wróć jutro po nowe wyzwanie!
            </div>
          </div>
        ) : (
          // Do wykonania
          <div className="flex-1 flex flex-col">
            {/* Quiz/Trivia/Math/Riddles/Emoji/TrueFalse/Memory/Seasonal */}
            {(dailyChallenge.type === 'quiz' || 
              dailyChallenge.type === 'trivia' || 
              dailyChallenge.type === 'math' ||
              dailyChallenge.type === 'riddle' ||
              dailyChallenge.type === 'emoji' ||
              dailyChallenge.type === 'truefalse' ||
              dailyChallenge.type === 'memory' ||
              dailyChallenge.type === 'seasonal') && (
              <div className="flex-1 flex flex-col">
                <p className="text-lg font-semibold mb-4 text-center">
                  {dailyChallenge.question}
                </p>
                <div className="space-y-3 flex-1">
                  {dailyChallenge.options?.map((option: string, i: number) => (
                    <motion.button
                      key={i}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => completeDailyChallenge(i)}
                      className="w-full p-4 bg-gray-100 hover:bg-linear-to-r hover:from-yellow-100 hover:to-orange-100 rounded-xl font-semibold transition-all text-left"
                    >
                      {option}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Find Urwis */}
            {dailyChallenge.type === 'find' && (
              <div className="text-center flex-1 flex flex-col justify-center">
                <p className="text-lg font-semibold mb-6">
                  {dailyChallenge.task}
                </p>
                
                {(() => {
                  const today = new Date().toDateString();
                  const found = localStorage.getItem(`urwis_hidden_found_${user?.id}_${today}`);
                  
                  return found ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => completeDailyChallenge()}
                      className="px-8 py-4 bg-linear-to-r from-yellow-500 to-orange-500 text-white rounded-full font-bold shadow-xl"
                    >
                      Znalazłem! 🔍
                    </motion.button>
                  ) : (
                    <div className="p-4 bg-yellow-50 rounded-xl border-2 border-yellow-300">
                      <p className="text-sm text-gray-700 mb-2">
                        💡 Wskazówka: Szukaj świecącego Urwisa na różnych stronach!
                      </p>
                      <a 
                        href="/"
                        className="text-blue-600 font-bold hover:underline"
                      >
                        → Zacznij szukać
                      </a>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Visit Pages */}
            {dailyChallenge.type === 'visit' && (
              <div className="text-center flex-1 flex flex-col justify-center">
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

            {/* Nagroda */}
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
      </div>

      {/* Success Modal */}
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

      {/* Error Modal */}
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
    </>
  );
}
