'use client'
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register';
}

export default function AuthModal({ isOpen, onClose, defaultMode = 'login' }: AuthModalProps) {
  const { login, register } = useSupabaseAuth();
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (mode === 'register') {
      if (password !== confirmPassword) {
        alert('Hasła nie pasują do siebie!');
        setIsLoading(false);
        return;
      }

      if (password.length < 6) {
        alert('Hasło musi mieć minimum 6 znaków!');
        setIsLoading(false);
        return;
      }

      const success = await register(email, username, password);
      if (success) {
        onClose();
      }
    } else {
      const success = await login(email, password);
      if (success) {
        onClose();
      }
    }

    setIsLoading(false);
  };

  const resetForm = () => {
    setEmail('');
    setUsername('');
    setPassword('');
    setConfirmPassword('');
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    resetForm();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-black">
              {mode === 'login' ? 'Zaloguj się' : 'Zarejestruj się'}
            </h2>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-2xl font-bold"
            >
              ×
            </motion.button>
          </div>

          {/* Icon */}
          <div className="text-center mb-6">
            <div className="text-6xl mb-2">
              {mode === 'login' ? '👋' : '🎉'}
            </div>
            <p className="text-gray-600">
              {mode === 'login'
                ? 'Witaj z powrotem w Klubie Urwisa!'
                : 'Dołącz do Klubu Urwisa i zdobywaj nagrody!'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Nazwa użytkownika
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Podaj swoją nazwę"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="twoj@email.com"
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Hasło
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Potwierdź hasło
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            )}

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-linear-to-r from-blue-500 to-red-500 text-white rounded-xl font-bold text-lg shadow-lg disabled:opacity-50"
            >
              {isLoading
                ? '⏳ Przetwarzanie...'
                : mode === 'login' ? '🔓 Zaloguj się' : '🎉 Zarejestruj się'}
            </motion.button>
          </form>

          {/* Switch Mode */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {mode === 'login' ? 'Nie masz konta?' : 'Masz już konto?'}
              {' '}
              <button
                onClick={switchMode}
                className="text-blue-600 font-bold hover:underline"
              >
                {mode === 'login' ? 'Zarejestruj się' : 'Zaloguj się'}
              </button>
            </p>
          </div>

          {/* Benefits (tylko dla rejestracji) */}
          {mode === 'register' && (
            <div className="mt-6 p-4 bg-linear-to-r from-blue-50 to-red-50 rounded-xl">
              <h4 className="font-bold text-sm mb-2 text-center">Co zyskujesz?</h4>
              <ul className="text-sm space-y-1 text-gray-700">
                <li>✅ Codzienne nagrody i bonusy</li>
                <li>✅ System levelowania</li>
                <li>✅ Ekskluzywne kupony rabatowe</li>
                <li>✅ Odznaki i osiągnięcia</li>
              </ul>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
