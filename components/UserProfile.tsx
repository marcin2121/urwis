'use client'

import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext'
import { motion } from 'framer-motion'
import { LogOut, Trophy, Star, Shield, Calendar, Edit2, User as UserIcon } from 'lucide-react'
import { useState } from 'react'
import Image from 'next/image'

export default function UserProfile() {
  const { user, profile, signOut } = useSupabaseAuth()
  const [isHovered, setIsHovered] = useState(false)

  if (!user || !profile) return null

  // Obliczanie procentu do następnego poziomu
  // Zakładamy prosty system: level * 1000 XP
  const nextLevelXp = profile.level * 1000
  const progressPercent = Math.min(100, (profile.total_exp / nextLevelXp) * 100)

  return (
    <div className="w-full max-w-sm mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-purple-100">
      {/* Header z tłem */}
      <div className="relative h-32 bg-linear-to-r from-purple-500 to-indigo-600">
        <div className="absolute top-4 right-4">
          <button
            onClick={() => signOut()}
            className="p-2 bg-white/20 hover:bg-white/40 backdrop-blur-xs rounded-full text-white transition-colors"
            title="Wyloguj się"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>

      {/* Avatar i Info */}
      <div className="relative px-6 pb-6">
        <div className="relative -mt-12 mb-4 flex justify-center">
          <div className="relative">
            <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-100 overflow-hidden shadow-md flex items-center justify-center">
              {/* Placeholder Avatara lub obrazek jeśli jest */}
              <span className="text-4xl">🧸</span>
            </div>
            {/* Badge poziomu */}
            <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-yellow-900 text-xs font-black px-2 py-1 rounded-full border-2 border-white shadow-xs">
              Lvl {profile.level}
            </div>
          </div>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-black text-gray-800 flex items-center justify-center gap-2">
            {profile.username || user.email?.split('@')[0]}
            {profile.role === 'admin' && <Shield size={16} className="text-blue-500" />}
          </h2>
          <p className="text-sm text-gray-500 font-medium">{user.email}</p>
        </div>

        {/* Statystyki */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-purple-50 p-3 rounded-2xl border border-purple-100 text-center">
            <div className="flex items-center justify-center gap-1 text-purple-600 mb-1">
              <Star size={16} fill="currentColor" />
              <span className="text-xs font-bold uppercase">XP</span>
            </div>
            <div className="text-xl font-black text-gray-800">{profile.total_exp}</div>
          </div>
          <div className="bg-blue-50 p-3 rounded-2xl border border-blue-100 text-center">
            <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
              <Trophy size={16} />
              <span className="text-xs font-bold uppercase">Ranking</span>
            </div>
            <div className="text-xl font-black text-gray-800">#42</div>
          </div>
        </div>

        {/* Pasek postępu */}
        <div className="mb-6">
          <div className="flex justify-between text-xs font-bold text-gray-500 mb-1">
            <span>Postęp poziomu</span>
            <span>{Math.floor(progressPercent)}%</span>
          </div>
          <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              className="h-full bg-linear-to-r from-yellow-400 to-orange-500 rounded-full"
            />
          </div>
          <p className="text-xs text-center mt-1 text-gray-400">
            {nextLevelXp - profile.total_exp} XP do następnego poziomu
          </p>
        </div>

        {/* Member Since - POPRAWIONA LINIA */}
        <div className="mt-6 text-center text-xs text-gray-500">
          Członek od: {user.created_at ? new Date(user.created_at).toLocaleDateString('pl-PL') : '-'}
        </div>

      </div>
    </div>
  )
}