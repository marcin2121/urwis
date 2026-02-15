'use client'
import { motion, AnimatePresence } from 'framer-motion';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function HiddenUrwis() {
  const { user, isAuthenticated } = useSupabaseAuth();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [shouldShow, setShouldShow] = useState(false);
  const [position, setPosition] = useState({ top: '50%', left: '50%' });

  useEffect(() => {
    // ❌ USUŃ TYMCZASOWE ZAWSZE POKAZYWANIE
    const today = new Date().toDateString();
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
    );

    const challengeIndex = dayOfYear % 20;
    const isFindDay = challengeIndex === 14; // Prawdziwa logika!

    if (!isFindDay) {
      console.log('❌ Dzisiaj nie ma wyzwania "find Urwisa"');
      return;
    }

    // ✅ NIE POKAZUJJ BEZ LOGOWANIA
    if (!user || !isAuthenticated) {
      console.log('🔒 HiddenUrwis: Niezalogowany - nie pokazuję');
      return;
    }

    // Sprawdź czy już znalazł dzisiaj
    const found = localStorage.getItem(`urwis_hidden_found_${user.id}_${today}`);
    if (found) {
      console.log('✅ Już znalazłeś dzisiaj!');
      return;
    }

    // Losowa pozycja (unikaj intro/header)
    const randomTop = Math.random() * 40 + 50; // 50-90% (dół strony)
    const randomLeft = Math.random() * 60 + 20; // 20-80%

    setPosition({
      top: `${randomTop}%`,
      left: `${randomLeft}%`
    });

    setShouldShow(true);
    console.log('🦸‍♂️ HiddenUrwis pokazany!');
  }, [user, isAuthenticated]);

  const handleClick = () => {
    if (!isAuthenticated || !user) {
      setShowLoginModal(true);
      return;
    }

    const today = new Date().toDateString();
    localStorage.setItem(`urwis_hidden_found_${user.id}_${today}`, 'true');
    setShouldShow(false);
    setShowSuccessModal(true);
  };

  if (!shouldShow) return null;

  return (
    <>
      {/* Ukryta Ikonka Urwisa - NIŻSZY zIndex */}
      <motion.div
        onClick={handleClick}
        initial={{ scale: 0, rotate: -360, opacity: 0 }}
        animate={{
          scale: 1,
          rotate: 0,
          opacity: 1,
          y: [0, -10, 0]
        }}
        transition={{
          scale: { duration: 0.8, delay: 3 },
          rotate: { duration: 0.8, delay: 3 },
          opacity: { duration: 0.5, delay: 3 },
          y: { repeat: Infinity, duration: 2, delay: 3.8 }
        }}
        whileHover={{ scale: 1.2, rotate: 15 }}
        whileTap={{ scale: 0.9 }}
        className="fixed w-24 h-24 cursor-pointer"
        style={{
          top: position.top,
          left: position.left,
          zIndex: 50,  // ✅ ZMNIEJSZONY z 9999 na 50 (pod intro)
          transform: 'translate(-50%, -50%)'
        }}
        title="Ukryty Urwis! Kliknij mnie!"
      >
        {/* reszta bez zmian */}
        <div className="absolute inset-0 bg-yellow-400 rounded-full blur-xl opacity-60 animate-pulse" />
        <div className="relative w-full h-full bg-white rounded-full shadow-2xl border-4 border-yellow-400 flex items-center justify-center overflow-hidden">
          <Image
            src="/urwis-icon.svg"
            alt="Schowany Urwis"
            width={80}
            height={80}
            className="w-16 h-16 object-contain"
          />
        </div>
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-yellow-400"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.8, 0, 0.8]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
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
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4"
            style={{ zIndex: 10000 }}
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
                🎉
              </motion.div>
              <h3 className="text-3xl font-black mb-4 bg-linear-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                Znalazłeś Urwisa!
              </h3>
              <p className="text-lg text-gray-700 mb-6">
                Gratulacje! Znalazłeś ukrytego Urwisa! 🧸<br />
                <span className="text-sm text-gray-600 mt-2 block">
                  Wróć do sekcji <strong>"Dzienne Wyzwania"</strong> i kliknij <strong>"Znalazłem!"</strong> aby odebrać nagrodę!
                </span>
              </p>

              <div className="flex gap-3 justify-center">
                <Link href="/challenges">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-linear-to-r from-yellow-500 to-orange-500 text-white rounded-full font-bold shadow-lg"
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
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4"
            style={{ zIndex: 10000 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 max-w-md text-center shadow-2xl"
            >
              <div className="text-7xl mb-4">🔒</div>
              <h3 className="text-3xl font-black mb-4 bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
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
                    className="px-6 py-3 bg-linear-to-r from-blue-500 to-purple-500 text-white rounded-full font-bold shadow-lg"
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
