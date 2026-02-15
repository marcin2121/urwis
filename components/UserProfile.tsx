'use client'
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';

export default function UserProfile() {
  const { profile: user, signOut, updateProfile } = useSupabaseAuth();
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  const avatars = ['🧸', '🎮', '🎨', '⚽', '🎲', '🚀', '🦖', '🦄', '🐶', '🐱', '🦊', '🐼'];

  if (!user) return null;

  const progressPercent = (user.total_exp / (100 * user.level * 1.5)) * 100;

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
            className="w-20 h-20 rounded-full bg-linear-to-br from-blue-400 to-purple-500 flex items-center justify-center text-4xl cursor-pointer hover:shadow-xl transition-shadow"
          >
            {user.avatar}
          </motion.button>

          {/* User Info */}
          <div>
            <h3 className="text-2xl font-black text-gray-800">{user.username}</h3>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>

        {/* Logout */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={logout}
          className="px-4 py-2 bg-red-100 text-red-600 rounded-xl font-bold hover:bg-red-200 transition-colors"
        >
          Wyloguj
        </motion.button>
      </div>

      {/* Avatar Picker */}
      {showAvatarPicker && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-6 p-4 bg-gray-50 rounded-2xl"
        >
          <p className="text-sm font-bold text-gray-700 mb-3">Wybierz avatar:</p>
          <div className="grid grid-cols-6 gap-2">
            {avatars.map((avatar) => (
              <motion.button
                key={avatar}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  updateProfile({ avatar_url: avatar });
                  setShowAvatarPicker(false);
                }}
                className={`text-3xl p-3 rounded-xl transition-all ${user.avatar_url === avatar
                  ? 'bg-blue-200 ring-2 ring-blue-500'
                  : 'bg-white hover:bg-gray-100'
                  }`}
              >
                {avatar}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Level & EXP */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⭐</span>
            <span className="text-xl font-black text-gray-800">
              Poziom {user.level}
            </span>
          </div>
          <span className="text-sm font-semibold text-gray-600">
            {user.total_exp} / {100 * user.level * 1.5} EXP
          </span>
        </div>

        {/* Progress Bar */}
        <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-linear-to-r from-blue-500 to-purple-500"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>

        <p className="text-xs text-gray-500 mt-1 text-center">
          Jeszcze {100 * user.level * 1.5 - user.total_exp} EXP do poziomu {user.level + 1}!
        </p>
      </div>

      {/* Level Benefits */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-linear-to-br from-yellow-50 to-orange-50 rounded-xl border-2 border-yellow-200">
          <div className="text-3xl mb-2">🏆</div>
          <div className="font-bold text-sm text-gray-700">Poziom {user.level}</div>
          <div className="text-xs text-gray-600">
            {user.level < 5 && 'Nowicjusz'}
            {user.level >= 5 && user.level < 10 && 'Doświadczony'}
            {user.level >= 10 && user.level < 20 && 'Ekspert'}
            {user.level >= 20 && user.level < 50 && 'Mistrz'}
            {user.level >= 50 && 'Legenda'}
          </div>
        </div>

        <div className="p-4 bg-linear-to-br from-blue-50 to-purple-50 rounded-xl border-2 border-blue-200">
          <div className="text-3xl mb-2">🎁</div>
          <div className="font-bold text-sm text-gray-700">Bonusy</div>
          <div className="text-xs text-gray-600">
            +{Math.floor(user.level / 5) * 5}% EXP
          </div>
        </div>
      </div>

      {/* Member Since */}
      <div className="mt-6 text-center text-xs text-gray-500">
        Członek od: {new Date(user.created_at).toLocaleDateString('pl-PL')}
      </div>
    </div>
  );
}
