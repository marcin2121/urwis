'use client'
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { X, ArrowRight, Loader2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultView?: 'login' | 'register';
}

export default function AuthModal({ isOpen, onClose, defaultView = 'login' }: AuthModalProps) {
  const { login, register } = useSupabaseAuth();

  const [view, setView] = useState<'login' | 'register'>(defaultView);

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setView(defaultView);
      setError(null);
    }
  }, [isOpen, defaultView]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (view === 'register') {
        if (password.length < 6) {
          throw new Error('Hasło musi mieć minimum 6 znaków.');
        }
        await register(email, username, password);
        onClose();
      } else {
        await login(email, password);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Wystąpił błąd. Spróbuj ponownie.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-zinc-900 w-full max-w-[420px] rounded-3xl shadow-2xl overflow-hidden relative"
        >
          {/* Przycisk Zamknij */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors z-10"
          >
            <X size={20} />
          </button>

          <div className="p-8 pt-10">
            {/* Przełącznik Zakładek */}
            <div className="flex items-center justify-center gap-1 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-full mb-8">
              <button
                onClick={() => setView('login')}
                className={`flex-1 py-2 text-sm font-bold rounded-full transition-all ${view === 'login'
                  ? 'bg-white dark:bg-zinc-700 shadow-sm text-black dark:text-white'
                  : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                  }`}
              >
                Logowanie
              </button>
              <button
                onClick={() => setView('register')}
                className={`flex-1 py-2 text-sm font-bold rounded-full transition-all ${view === 'register'
                  ? 'bg-white dark:bg-zinc-700 shadow-sm text-black dark:text-white'
                  : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                  }`}
              >
                Rejestracja
              </button>
            </div>

            {/* Nagłówek */}
            <div className="text-center mb-6">
              <div className="text-4xl mb-3 animate-bounce">
                {view === 'login' ? '👋' : '🚀'}
              </div>
              <h2 className="text-2xl font-black text-black dark:text-white tracking-tight">
                {view === 'login' ? 'Witaj Urwisie!' : 'Dołącz do ekipy'}
              </h2>
              <p className="text-sm text-zinc-500 mt-1 font-medium">
                {view === 'login'
                  ? 'Gotowy na kolejne wyzwania?'
                  : 'Załóż konto i ruszaj do zabawy.'}
              </p>
            </div>

            {/* Formularz */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 flex items-center gap-2 font-medium animate-pulse">
                  <span>⚠️</span> {error}
                </div>
              )}

              {/* INPUT: Nazwa użytkownika */}
              {view === 'register' && (
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl filter grayscale group-focus-within:grayscale-0 transition-all duration-300">
                    👤
                  </span>
                  <input
                    type="text"
                    placeholder="Twoja ksywka"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all text-sm font-bold text-zinc-800 dark:text-white placeholder:font-normal"
                  />
                </div>
              )}

              {/* INPUT: Email */}
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl filter grayscale group-focus-within:grayscale-0 transition-all duration-300">
                  📧
                </span>
                <input
                  type="email"
                  placeholder="Adres e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all text-sm font-bold text-zinc-800 dark:text-white placeholder:font-normal"
                />
              </div>

              {/* INPUT: Hasło */}
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl filter grayscale group-focus-within:grayscale-0 transition-all duration-300">
                  🔑
                </span>
                <input
                  type="password"
                  placeholder="Hasło"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all text-sm font-bold text-zinc-800 dark:text-white placeholder:font-normal"
                />
              </div>

              {/* Przycisk Submit */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full bg-black dark:bg-white text-white dark:text-black py-4 rounded-xl font-black text-base flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-4"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    {view === 'login' ? 'Wchodzę do gry' : 'Zakładam konto'}
                    <ArrowRight size={20} strokeWidth={3} />
                  </>
                )}
              </motion.button>
            </form>

            {/* Stopka z korzyściami (Tylko rejestracja) */}
            <AnimatePresence>
              {view === 'register' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-800/50 p-2.5 rounded-xl border border-zinc-100 dark:border-zinc-700">
                        <span className="text-lg">🏆</span>
                        <span className="text-xs font-bold text-zinc-600 dark:text-zinc-300">Rankingi</span>
                      </div>
                      <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-800/50 p-2.5 rounded-xl border border-zinc-100 dark:border-zinc-700">
                        <span className="text-lg">🎁</span>
                        <span className="text-xs font-bold text-zinc-600 dark:text-zinc-300">Nagrody</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}