'use client'
import { motion, AnimatePresence } from 'framer-motion';  // ✅ DODANE AnimatePresence
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function HiddenUrwis() {
  const { user, isAuthenticated } = useSupabaseAuth();  // ✅ DODANE isAuthenticated
  const [foundToday, setFoundToday] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);  // ✅ DODANE
  const [showLoginModal, setShowLoginModal] = useState(false);      // ✅ DODANE
  const [position, setPosition] = useState({ top: '50%', left: '50%' });

  // SEEDOWANA losowa pozycja dla wszystkich (ten sam dzień = ta sama pozycja)
  const getDailyPosition = useCallback(() => {
    const now = new Date();
    const seed = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();

    const hash = seed.toString().split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);

    const top = 15 + (Math.abs(hash % 70)); // 15-85%
    const left = 10 + (Math.abs((hash * 31) % 80)); // 10-90%

    return { top: `${top}%`, left: `${left}%` };
  }, []);

  useEffect(() => {
    const todayKey = `urwis_hidden_${new Date().toDateString()}`;

    // Sprawdź czy już znaleziony dzisiaj
    const found = localStorage.getItem(todayKey);
    if (found) {
      setFoundToday(true);
      return;
    }

    // Ustaw codzienną pozycję (taka sama dla wszystkich)
    const pos = getDailyPosition();
    setPosition(pos);
  }, [getDailyPosition]);

  const handleClick = () => {
    if (!isAuthenticated || !user) {
      setShowLoginModal(true);
      return;
    }

    const todayKey = `urwis_hidden_${new Date().toDateString()}`;
    localStorage.setItem(todayKey, 'true');

    // Nagroda!
    setShowSuccessModal(true);
    setFoundToday(true);
  };

  if (foundToday) return null;

  return (
    <>
      {/* SAM OBRAZEK Urwisa */}
      <motion.div
        onClick={handleClick}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{
          opacity: 0.9,
          scale: 1,
          rotate: [0, 5, -5, 0]
        }}
        transition={{
          opacity: { duration: 1, delay: 2 },
          scale: { duration: 1, delay: 2 },
          rotate: { duration: 3, repeat: Infinity, ease: "easeInOut" }
        }}
        whileHover={{ scale: 1.3, opacity: 1 }}
        whileTap={{ scale: 0.8 }}
        className="fixed w-16 h-16 cursor-pointer select-none pointer-events-auto z-40"
        style={{
          top: position.top,
          left: position.left,
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'auto'
        }}
        title="🦸‍♂️ Ukryty Urwis! Kliknij!"
      >
        <Image
          src="/urwis-icon.svg"
          alt="🦸‍♂️ Ukryty Urwis"
          width={64}
          height={64}
          className="w-full h-full object-contain drop-shadow-lg hover:drop-shadow-2xl transition-all duration-200"
          priority={false}
        />
      </motion.div>

      {/* ✨ Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSuccessModal(false)}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[10000]"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 max-w-md text-center shadow-2xl max-h-[90vh] overflow-auto"
            >
              <motion.div
                className="text-7xl mb-4"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ duration: 0.5 }}
              >
                🎉
              </motion.div>
              <h3 className="text-3xl font-black mb-4 bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                Znalazłeś Urwisa!
              </h3>
              <p className="text-lg text-gray-700 mb-6">
                Gratulacje! Znalazłeś ukrytego Urwisa! 🦸‍♂️<br />
                <span className="text-sm text-gray-600 mt-2 block">
                  Wróć do sekcji <strong>"Dzienne Wyzwania"</strong> i kliknij <strong>"Znalazłem!"</strong> aby odebrać nagrodę!
                </span>
              </p>

              <div className="flex gap-3 justify-center">
                <Link href="/challenges">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-full font-bold shadow-lg"
                  >
                    Odbierz Nagrodę! 🎁
                  </motion.button>
                </Link>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowSuccessModal(false)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-full font-bold"
                >
                  Później
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✨ Login Modal */}
      <AnimatePresence>
        {showLoginModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowLoginModal(false)}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[10000]"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 max-w-md text-center shadow-2xl max-h-[90vh] overflow-auto"
            >
              <div className="text-7xl mb-4">🔒</div>
              <h3 className="text-3xl font-black mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Zaloguj się
              </h3>
              <p className="text-lg text-gray-700 mb-6">
                Musisz być zalogowany, aby zbierać nagrody i uczestniczyć w wyzwaniach!
              </p>

              <div className="flex gap-3 justify-center">
                <Link href="/profil">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full font-bold shadow-lg"
                  >
                    Zaloguj się 👤
                  </motion.button>
                </Link>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowLoginModal(false)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-full font-bold"
                >
                  Anuluj
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
