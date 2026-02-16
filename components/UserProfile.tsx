'use client'
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';

export default function UserProfile() {
  const { profile: user, signOut, updateProfile } = useSupabaseAuth();
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  const avatars = ['🧸', '🎮', '🎨', '⚽', '🎲', '🚀', '🦖', '🦄', '🐶', '🐱', '🦊', '🐼'];

  // Zabezpieczenie przed brakiem użytkownika
  if (!user) return null;

  // Obliczanie paska postępu (zabezpieczenie przed dzieleniem przez 0)
  const maxExp = 100 * user.level * 1.5;
  const progressPercent = maxExp > 0 ? (user.total_exp / maxExp) * 100 : 0;

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowAvatarPicker(!showAvatarPicker)}
            className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-4xl cursor-pointer hover:shadow-xl transition-shadow shadow-md border-4 border-white"
          >
            {user.avatar_url || '🧸'}
          </motion.button>

          {/* User Info */}
          <div>
            <h3 className="text-2xl font-black text-gray-800">{user.username}</h3>
            <p className="text-gray-500 text-sm font-medium">{user.email}</p>
          </div>
        </div>

        {/* Logout */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={signOut}
          className="px-4 py-2 bg-red-50 text-red-500 rounded-xl font-bold hover:bg-red-100 transition-colors text-sm"
        >
          Wyloguj
        </motion.button>
      </div>

      {/* Avatar Picker */}
      <AnimatePresence>
        {showAvatarPicker && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 overflow-hidden"
          >
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <p className="text-sm font-bold text-gray-700 mb-3">Wybierz nowy avatar:</p>
              <div className="grid grid-cols-6 gap-2">
                {avatars.map((avatar) => (
                  <motion.button
                    key={avatar}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={async () => {
                      await updateProfile({ avatar_url: avatar });
                      setShowAvatarPicker(false);
                    }}
                    className={`text-2xl p-2 rounded-xl transition-all flex justify-center items-center aspect-square ${user.avatar_url === avatar
                      ? 'bg-blue-100 ring-2 ring-blue-500'
                      : 'bg-white hover:bg-gray-200'
                      }`}
                  >
                    {avatar}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Level & EXP */}
      <div className="mb-6">
        <div className="flex justify-between items-end mb-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⭐</span>
            <div className="leading-none">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Poziom</span>
              <span className="text-3xl font-black text-gray-800">{user.level}</span>
            </div>
          </div>
          <span className="text-xs font-bold text-gray-500">
            {user.total_exp} / {Math.floor(maxExp)} EXP
          </span>
        </div>

        {/* Progress Bar */}
        <div className="h-4 bg-gray-100 rounded-full overflow-hidden border border-gray-100">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>

        <p className="text-xs text-gray-400 mt-2 text-center font-medium">
          Brakuje tylko <span className="text-purple-600 font-bold">{Math.floor(maxExp - user.total_exp)} EXP</span> do kolejnego poziomu!
        </p>
      </div>

      {/* Level Benefits */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl border border-yellow-100">
          <div className="text-3xl mb-2">🏆</div>
          <div className="font-bold text-sm text-gray-800">Ranga</div>
          <div className="text-xs text-gray-600 font-medium mt-1">
            {user.level < 5 && 'Nowicjusz'}
            {user.level >= 5 && user.level < 10 && 'Odkrywca'}
            {user.level >= 10 && user.level < 20 && 'Ekspert'}
            {user.level >= 20 && user.level < 50 && 'Mistrz'}
            {user.level >= 50 && 'Legenda'}
          </div>
        </div>

        <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border border-blue-100">
          <div className="text-3xl mb-2">🎁</div>
          <div className="font-bold text-sm text-gray-800">Twój Bonus</div>
          <div className="text-xs text-gray-600 font-medium mt-1">
            +{Math.floor(user.level / 5) * 5}% więcej EXP
          </div>
        </div>
      </div>

      {/* Member Since - FIX ZASTOSOWANY TUTAJ */}
      <div className="mt-8 pt-6 border-t border-gray-100 text-center">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
          Karta Gracza
        </p>
        <div className="text-sm text-gray-600 font-medium">
          Jesteś z nami od: <span className="text-gray-900 font-bold">
            {user.created_at ? new Date(user.created_at).toLocaleDateString('pl-PL') : 'Niedawno'}
          </span>
        </div>
      </div>
    </div>
  );
}