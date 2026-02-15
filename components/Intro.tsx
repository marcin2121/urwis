'use client'
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import LoadingScreen from '@/components/LoadingScreen';
import confetti from 'canvas-confetti';

// Typing effect component
function TypewriterText({ text, className, delay, onComplete }: {
  text: string;
  className: string;
  delay: number;
  onComplete?: () => void;
}) {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    let i = 0;
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        if (i < text.length) {
          setDisplayText(text.slice(0, i + 1));
          i++;
        } else {
          clearInterval(interval);
          if (onComplete) onComplete();
        }
      }, 90); // 100ms -> 90ms = 10% szybciej
      return () => clearInterval(interval);
    }, delay * 1000 * 0.9); // delay też 10% szybciej

    return () => clearTimeout(timer);
  }, [text, delay, onComplete]);

  return (
    <h1 className={className}>
      {displayText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.72, repeat: Infinity }} // 0.8s -> 0.72s = 10% szybciej
      >
        |
      </motion.span>
    </h1>
  );
}

export default function UrwisIntro({ children }: { children: React.ReactNode }) {
  const [shouldShowIntro, setShouldShowIntro] = useState(false);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [step, setStep] = useState<'loading' | 'video' | 'text' | 'done'>('loading');
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasEndedRef = useRef(false);
  const textTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sprawdź czy pokazać intro (tylko raz na sesję)
  useEffect(() => {
    const introShown = sessionStorage.getItem('urwis_intro_shown');
    if (!introShown) {
      setShouldShowIntro(true);
    } else {
      // Jeśli intro było pokazane, pomiń wszystko
      setStep('done');
      setLoadingComplete(true);
    }
  }, []);

  // Canvas-confetti effects
  const fireConfetti = () => {
    const duration = 2700; // 3000ms -> 2700ms = 10% szybciej
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 10000 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 225); // 250ms -> 225ms = 10% szybciej
  };

  // Emoji confetti
  const fireEmojiConfetti = () => {
    const scalar = 2;
    const emoji = confetti.shapeFromText({ text: '🎈', scalar });
    const emoji2 = confetti.shapeFromText({ text: '🎁', scalar });
    const emoji3 = confetti.shapeFromText({ text: '⭐', scalar });
    const emoji4 = confetti.shapeFromText({ text: '🎉', scalar });

    const defaults = {
      spread: 360,
      ticks: 90, // 100 -> 90 = 10% szybciej
      gravity: 0.8,
      decay: 0.94,
      startVelocity: 30,
      shapes: [emoji, emoji2, emoji3, emoji4],
      scalar,
      zIndex: 10000
    };

    function shoot() {
      confetti({
        ...defaults,
        particleCount: 30
      });

      confetti({
        ...defaults,
        particleCount: 20,
        scalar: scalar / 1.5,
      });

      confetti({
        ...defaults,
        particleCount: 15,
        scalar: scalar / 2,
      });
    }

    setTimeout(shoot, 0);
    setTimeout(shoot, 90); // 100ms -> 90ms
    setTimeout(shoot, 180); // 200ms -> 180ms
    setTimeout(shoot, 270); // 300ms -> 270ms
  };

  // Fireworks effect
  const fireFireworks = () => {
    const duration = 2700; // 3000ms -> 2700ms = 10% szybciej
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 10000 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.9), y: randomInRange(0.1, 0.5) },
        colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff']
      });
    }, 270); // 300ms -> 270ms = 10% szybciej
  };

  useEffect(() => {
    if (!loadingComplete || !shouldShowIntro) return;

    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => {
      if (hasEndedRef.current) return;
      setStep('video');

      // Ustaw prędkość odtwarzania na 110% (10% szybciej)
      video.playbackRate = 1.1;

      video.play().catch(console.error);
    };

    const handleEnded = () => {
      if (hasEndedRef.current) return;
      hasEndedRef.current = true;
      video.pause();
      setTimeout(() => setStep('text'), 180); // 200ms -> 180ms = 10% szybciej
    };

    video.addEventListener('canplaythrough', handleCanPlay);
    video.addEventListener('loadeddata', handleCanPlay);
    video.addEventListener('ended', handleEnded);

    const fallback = setTimeout(() => {
      if (!hasEndedRef.current) {
        handleCanPlay();
      }
    }, 1800); // 2000ms -> 1800ms = 10% szybciej

    return () => {
      clearTimeout(fallback);
      video.removeEventListener('canplaythrough', handleCanPlay);
      video.removeEventListener('loadeddata', handleCanPlay);
      video.removeEventListener('ended', handleEnded);
    };
  }, [loadingComplete, shouldShowIntro]);

  useEffect(() => {
    if (step === 'text') {
      textTimerRef.current = setTimeout(() => {
        setStep('done');
        // Zapisz do sessionStorage po zakończeniu intro
        sessionStorage.setItem('urwis_intro_shown', 'true');
      }, 4500); // 5000ms -> 4500ms = 10% szybciej
    }
    return () => {
      if (textTimerRef.current) {
        clearTimeout(textTimerRef.current);
        textTimerRef.current = null;
      }
    };
  }, [step]);

  const handleClick = () => {
    if (textTimerRef.current) {
      clearTimeout(textTimerRef.current);
      textTimerRef.current = null;
    }

    if (step === 'loading' || step === 'video') {
      hasEndedRef.current = true;

      const video = videoRef.current;
      if (video) {
        video.pause();
        video.currentTime = 0;
      }

      setStep('text');
    } else if (step === 'text') {
      setStep('done');
      // Zapisz do sessionStorage przy pomijaniu
      sessionStorage.setItem('urwis_intro_shown', 'true');
    }
  };

  const handleTypingComplete = () => {
    setTimeout(() => fireEmojiConfetti(), 180); // 200ms -> 180ms
    setTimeout(() => fireConfetti(), 360); // 400ms -> 360ms
    setTimeout(() => fireFireworks(), 720); // 800ms -> 720ms
  };

  // Jeśli intro już było pokazane, renderuj tylko children
  if (!shouldShowIntro) {
    return <>{children}</>;
  }

  return (
    <div onClick={handleClick} style={{ cursor: 'pointer' }}>
      {!loadingComplete && (
        <LoadingScreen onComplete={() => setLoadingComplete(true)} />
      )}

      {loadingComplete && (
        <motion.div
          animate={{ opacity: step !== 'done' ? 1 : 0 }}
          transition={{ duration: 0.72 }} // 0.8s -> 0.72s = 10% szybciej
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: '#FFFFFF',
            pointerEvents: step !== 'done' ? 'all' : 'none'
          }}
        >
          <video
            ref={videoRef}
            playsInline
            muted
            poster="/poster-70.webp"
            preload="auto"
            loop={false}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100vw',
              height: '100vh',
              objectFit: 'cover',
              opacity: step === 'video' ? 1 : 0,
              transition: 'opacity 0.45s'
            }}
          >
            {/* WebM pierwszy - mniejszy rozmiar */}
            <source src="/urwisintro.webm" type="video/webm" />

            {/* MP4 fallback - dla starszych Safari */}
            <source src="/urwisintro.mp4" type="video/mp4" />

            {/* Tekst dla przeglądarek bez wsparcia video */}
            Twoja przeglądarka nie wspiera video HTML5.
          </video>

          {step === 'video' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                position: 'absolute',
                bottom: '2rem',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(0,0,0,0.7)',
                backdropFilter: 'blur(20px)',
                color: 'white',
                padding: '1rem 2.5rem',
                borderRadius: '50px',
                fontSize: '1.1rem',
                fontWeight: '600',
                zIndex: 10
              }}
            >
              Kliknij aby pominąć
            </motion.div>
          )}

          {/* Typing Effect + Canvas Confetti - PEŁNY EKRAN Z EFEKTAMI */}
          {step === 'text' && (
            <div className="fixed inset-0 bg-linear-to-br from-orange-50 via-white to-red-50 flex flex-col items-center justify-center overflow-visible z-50 pb-12">

              {/* Animated Background Orbs - 10% szybciej */}
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360],
                  opacity: [0.1, 0.2, 0.1]
                }}
                transition={{ duration: 13.5, repeat: Infinity, ease: "linear" }} // 15s -> 13.5s
                className="absolute top-20 left-10 w-96 h-96 bg-linear-to-br from-red-400 to-orange-400 rounded-full blur-3xl pointer-events-none"
              />
              <motion.div
                animate={{
                  scale: [1, 1.3, 1],
                  rotate: [360, 180, 0],
                  opacity: [0.1, 0.2, 0.1]
                }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear" }} // 20s -> 18s
                className="absolute bottom-20 right-10 w-96 h-96 bg-linear-to-br from-blue-400 to-purple-400 rounded-full blur-3xl pointer-events-none"
              />
              <motion.div
                animate={{
                  scale: [1, 1.15, 1],
                  x: [-50, 50, -50],
                  opacity: [0.05, 0.15, 0.05]
                }}
                transition={{ duration: 16.2, repeat: Infinity, ease: "easeInOut" }} // 18s -> 16.2s
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-linear-to-br from-orange-300 to-yellow-300 rounded-full blur-3xl pointer-events-none"
              />

              {/* Logo entrance with glow */}
              <div className="relative z-10 mb-16">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3.6, repeat: Infinity, ease: "linear" }} // 4s -> 3.6s
                  className="absolute -inset-8 bg-linear-to-r from-red-500 via-orange-500 via-yellow-500 via-blue-500 to-purple-500 rounded-full blur-2xl opacity-40"
                />

                <motion.img
                  src="/logo.png"
                  alt="Urwis"
                  className="relative w-56 h-56 sm:w-64 sm:h-64 lg:w-80 lg:h-80 drop-shadow-2xl"
                  initial={{ scale: 0, rotate: -180, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  transition={{
                    duration: 0.9, // 1s -> 0.9s = 10% szybciej
                    ease: [0.34, 1.56, 0.64, 1],
                    type: "spring",
                    bounce: 0.6
                  }}
                />

                {/* Orbiting stars - 10% szybciej */}
                {[0, 1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    className="absolute text-4xl"
                    style={{
                      top: '50%',
                      left: '50%',
                    }}
                    animate={{
                      x: [0, Math.cos(i * Math.PI / 2) * 180, 0],
                      y: [0, Math.sin(i * Math.PI / 2) * 180, 0],
                      rotate: [0, 360],
                      scale: [0.8, 1.2, 0.8],
                    }}
                    transition={{
                      duration: 2.7, // 3s -> 2.7s = 10% szybciej
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.18, // 0.2s -> 0.18s
                    }}
                  >
                    {['⭐', '✨', '🎉', '🎈'][i]}
                  </motion.div>
                ))}
              </div>

              {/* Typing text with enhanced effects */}
              <div className="text-center px-6 pb-16 relative z-10">

                {/* Main Title */}
                <div
                  className="relative"
                  style={{
                    paddingBottom: '0.4em',
                    lineHeight: '1.15',
                    overflow: 'visible'
                  }}
                >
                  {/* Text glow effect - 10% szybciej */}
                  <motion.div
                    animate={{
                      opacity: [0.3, 0.6, 0.3],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }} // 2s -> 1.8s
                    className="absolute inset-0 bg-linear-to-r from-red-600 via-orange-500 to-blue-600 blur-3xl opacity-40 -z-10"
                  />

                  <TypewriterText
                    text="Sklep Urwis"
                    className="text-7xl sm:text-8xl lg:text-9xl xl:text-[11rem] font-black text-transparent bg-clip-text bg-linear-to-r from-red-600 via-orange-500 to-blue-600 drop-shadow-2xl"
                    delay={0.45} // 0.5s -> 0.45s = 10% szybciej
                    onComplete={handleTypingComplete}
                  />
                </div>

                {/* Animated divider - 10% szybciej */}
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: '100%', opacity: 1 }}
                  transition={{ delay: 1.8, duration: 0.72, ease: "easeOut" }} // 2s, 0.8s -> 1.8s, 0.72s
                  className="flex justify-center my-8"
                >
                  <motion.div
                    animate={{
                      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                    }}
                    transition={{ duration: 2.7, repeat: Infinity, ease: "linear" }} // 3s -> 2.7s
                    className="h-2 w-64 rounded-full"
                    style={{
                      background: 'linear-gradient(90deg, #BF2024, #FF6B35, #0055ff, #BF2024)',
                      backgroundSize: '200% 100%'
                    }}
                  />
                </motion.div>

                {/* Subtitle with particles */}
                <motion.div
                  className="relative"
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    delay: 2.25, // 2.5s -> 2.25s = 10% szybciej
                    duration: 0.72, // 0.8s -> 0.72s
                    type: "spring",
                    bounce: 0.4
                  }}
                >
                  {/* Floating particles around text - 10% szybciej */}
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute text-2xl sm:text-3xl"
                      style={{
                        left: `${20 + i * 12}%`,
                        top: i % 2 === 0 ? '-2rem' : '4rem'
                      }}
                      animate={{
                        y: [0, -20, 0],
                        rotate: [0, 360],
                        opacity: [0.4, 0.8, 0.4],
                      }}
                      transition={{
                        duration: (2 + i * 0.3) * 0.9, // 10% szybciej
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: (2.5 + i * 0.2) * 0.9, // 10% szybciej
                      }}
                    >
                      {['✨', '🎈', '⭐', '🎁', '🎉', '💫'][i]}
                    </motion.div>
                  ))}

                  <div
                    className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black relative"
                    style={{
                      paddingBottom: '0.4em',
                      lineHeight: '1.5',
                      overflow: 'visible'
                    }}
                  >
                    <motion.span
                      animate={{
                        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                      }}
                      transition={{ duration: 4.5, repeat: Infinity, ease: "linear" }} // 5s -> 4.5s
                      className="text-transparent bg-clip-text"
                      style={{
                        background: 'linear-gradient(90deg, #BF2024, #FF6B35, #FFD700, #0055ff, #BF2024)',
                        backgroundSize: '200% 100%',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                      }}
                    >
                      Witaj w magicznym świecie Urwisa!
                    </motion.span>

                    <motion.span
                      className="inline-block ml-3 text-4xl sm:text-5xl"
                      animate={{
                        rotate: [0, 15, -15, 0],
                        scale: [1, 1.2, 1]
                      }}
                      transition={{
                        duration: 1.35, // 1.5s -> 1.35s = 10% szybciej
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 2.7 // 3s -> 2.7s
                      }}
                    >
                      ✨
                    </motion.span>
                  </div>

                  {/* Pulsing glow under subtitle - 10% szybciej */}
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.2, 0.4, 0.2]
                    }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }} // 2s -> 1.8s
                    className="absolute inset-0 bg-linear-to-r from-orange-400 to-red-400 blur-2xl -z-10"
                  />
                </motion.div>

                {/* Skip hint - 10% szybciej */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{
                    duration: 1.8, // 2s -> 1.8s = 10% szybciej
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 3.15 // 3.5s -> 3.15s
                  }}
                  className="mt-12 text-gray-500 text-lg font-medium"
                >
                  Kliknij gdziekolwiek aby kontynuować
                </motion.div>
              </div>

            </div>
          )}
        </motion.div>
      )}

      <motion.main
        animate={{ opacity: step === 'done' ? 1 : 0 }}
        transition={{ duration: 0.72 }} // 0.8s -> 0.72s = 10% szybciej
        style={{ pointerEvents: step === 'done' ? 'auto' : 'none' }}
      >
        {children}
      </motion.main>
    </div>
  );
}
