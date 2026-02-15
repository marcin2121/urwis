'use client'
import { motion, AnimatePresence } from 'framer-motion';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function HiddenUrwis() {
  const { user, isAuthenticated } = useSupabaseAuth();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [shouldShow, setShouldShow] = useState(false);
  const [position, setPosition] = useState({ top: '50%', left: '50%' });
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    // 🔒 Pokazuj dopiero po 3 sekundach i przewinięciu strony
    const handleScroll = () => {
      if (window.scrollY > 300) { // Minimum 300px scrolla
        setHasScrolled(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // ✅ TYLKO DLA ZALOGOWANYCH
    if (!isAuthenticated || !user || !hasScrolled) return;

    // Sprawdź czy dzisiaj jest wyzwanie "find"
    const today = new Date().toDateString();
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
    );

    const isFindDay = true; // TYMCZASOWO dla testów

    if (!isFindDay) return;

    // Sprawdź czy już znalazł dzisiaj
    const found = localStorage.getItem(`urwis_hidden_found_${user.id}_${today}`);
    if (found) {
      setShouldShow(false);
      return;
    }

    // 🎯 LOSOWA POZYCJA (narożniki i krawędzie)
    const zones = [
      { top: 15, left: 10 },   // Lewy górny róg
      { top: 15, left: 85 },   // Prawy górny róg
      { top: 80, left: 10 },   // Lewy dolny róg
      { top: 80, left: 85 },   // Prawy dolny róg
      { top: 45, left: 5 },    // Lewa krawędź
      { top: 45, left: 90 },   // Prawa krawędź
    ];

    const randomZone = zones[Math.floor(Math.random() * zones.length)];
    const randomOffset = () => (Math.random() - 0.5) * 10;

    setPosition({
      top: `${randomZone.top + randomOffset()}%`,
      left: `${randomZone.left + randomOffset()}%`
    });

    // 🕐 Opóźnienie pokazania (3-8 sekund po scrollu)
    const delay = 3000 + Math.random() * 5000;
    const timer = setTimeout(() => {
      setShouldShow(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [hasScrolled, user, isAuthenticated]);

  const handleClick = () => {
    const today = new Date().toDateString();
    localStorage.setItem(`urwis_hidden_found_${user!.id}_${today}`, 'true');
    setShouldShow(false);
    setShowSuccessModal(true);
  };

  if (!shouldShow) return null;

  return (
    <>
      {/* 🦸‍♂️ Ukryta Ikonka Urwisa - CZYSTY OBRAZEK */}
      <motion.div
        onClick={handleClick}
        initial={{ scale: 0, rotate: -360, opacity: 0 }}
        animate={{
          scale: 1,
          rotate: 0,
          opacity: 0.6,
          y: [0, -8, 0]
        }}
        transition={{
          scale: { duration: 1.2, delay: 0 },
          rotate: { duration: 1.2, delay: 0 },
          opacity: { duration: 0.8, delay: 0 },
          y: { repeat: Infinity, duration: 3, delay: 1.2 }
        }}
        whileHover={{
          scale: 1.2,
          rotate: 15,
          opacity: 1,
          transition: { duration: 0.3 }
        }}
        whileTap={{ scale: 0.9 }}
        className="fixed w-24 h-24 cursor-pointer"
        style={{
          top: position.top,
          left: position.left,
          zIndex: 40,
          transform: 'translate(-50%, -50%)'
        }}
        title="🤫"
      >
        {/* ✅ TYLKO OBRAZEK - BEZ RAMKI I GLOW */}
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Użyj swojej ikonki: */}
          <span className="text-6xl">🦸‍♂️</span>

          {/* LUB obrazek: */}
          {/* <Image
            src="/urwis-icon.svg"
            alt="?"
            width={96}
            height={96}
            className="w-full h-full object-contain"
          /> */}
        </div>
      </motion.div>

      {/* ✨ Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSuccessModal(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            style={{ zIndex: 10000 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 max-w-md text-center shadow-2xl border-4 border-yellow-400"
            >
              <motion.div
                className="text-7xl mb-4"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ duration: 0.5, repeat: 3 }}
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
    </>
  );
}
