'use client'
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { X, Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultView?: 'login' | 'register'; // Zmieniłem na defaultView by pasowało do Navbara
}

export default function AuthModal({ isOpen, onClose, defaultView = 'login' }: AuthModalProps) {
  const { login, register } = useSupabaseAuth();

  // Stan widoku (logowanie vs rejestracja)
  const [view, setView] = useState<'login' | 'register'>(defaultView);

  // Pola formularza
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState(''); // Tylko dla rejestracji
  const [password, setPassword] = useState('');

  // Stany UI
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Synchronizacja: Jak Navbar każe otworzyć "Rejestrację", to ustawiamy rejestrację
  useEffect(() => {
    if (isOpen) {
      setView(defaultView);
      setError(null);
      // Opcjonalnie: czyść formularz przy otwarciu
      // setEmail(''); setPassword(''); setUsername('');
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
        // Zakładam, że register zwraca { error } lub rzuca błąd, 
        // jeśli Twoja funkcja zwraca boolean, dostosuj ten warunek.
        await register(email, username, password);
        onClose(); // Zamknij po sukcesie
      } else {
        await login(email, password);
        onClose(); // Zamknij po sukcesie
      }
    } catch (err: any) {
      // Tutaj obsługa błędu z Supabase
      setError(err.message || 'Wystąpił błąd. Spróbuj ponownie.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
      >
        {/* Modal Card */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-zinc-900 w-full max-w-[420px] rounded-3xl shadow-2xl overflow-hidden relative"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors z-10"
          >
            <X size={20} />
          </button>

          <div className="p-8 pt-10">
            {/* Header / Tabs */}
            <div className="flex items-center justify-center gap-1 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-full mb-8">
              <button
                onClick={() => setView('login')}
                className={`flex-1 py-2 text-sm font-bold rounded-full transition-all ${view === 'login'
                    ? 'bg-white dark:bg-zinc-700 shadow-sm text-black dark:text-white'
                    : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                  }`}
              >
                Zaloguj się
              </button>
              <button
                onClick={() => setView('register')}
                className={`flex-1 py-2 text-sm font-bold rounded-full transition-all ${view === 'register'
                    ? 'bg-white dark:bg-zinc-700 shadow-sm text-black dark:text-white'
                    : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                  }`}
              >
                Załóż konto
              </button>
            </div>

            {/* Title & Emoji */}
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">
                {view === 'login' ? '👋' : '🚀'}
              </div>
              <h2 className="text-2xl font-bold text-black dark:text-white">
                {view === 'login' ? 'Witaj ponownie!' : 'Dołącz do nas'}
              </h2>
              <p className="text-sm text-zinc-500 mt-1">
                {view === 'login'
                  ? 'Zaloguj się, aby kontynuować misje.'
                  : 'Stwórz konto i odbierz nagrody na start.'}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 flex items-center gap-2">
                  <span>⚠️</span> {error}
                </div>
              )}

              {view === 'register' && (
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" size={18} />
                  <input
                    type="text"
                    placeholder="Nazwa użytkownika"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all text-sm font-medium"
                  />
                </div>
              )}

              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" size={18} />
                <input
                  type="email"
                  placeholder="Adres e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all text-sm font-medium"
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" size={18} />
                <input
                  type="password"
                  placeholder="Hasło"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all text-sm font-medium"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-black dark:bg-white text-white dark:text-black py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-2"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <>
                    {view === 'login' ? 'Zaloguj się' : 'Stwórz konto'}
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            {/* Benefits (Register Mode Only) */}
            <AnimatePresence>
              {view === 'register' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800">
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3 text-center">
                      Co na Ciebie czeka?
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                      <div className="flex items-center gap-1.5 bg-zinc-50 dark:bg-zinc-800/50 p-2 rounded-lg">
                        <span className="text-orange-500">🏆</span> Rankingi
                      </div>
                      <div className="flex items-center gap-1.5 bg-zinc-50 dark:bg-zinc-800/50 p-2 rounded-lg">
                        <span className="text-blue-500">🎮</span> Gry
                      </div>
                      <div className="flex items-center gap-1.5 bg-zinc-50 dark:bg-zinc-800/50 p-2 rounded-lg">
                        <span className="text-green-500">🎁</span> Nagrody
                      </div>
                      <div className="flex items-center gap-1.5 bg-zinc-50 dark:bg-zinc-800/50 p-2 rounded-lg">
                        <span className="text-purple-500">⚡</span> Wyzwania
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