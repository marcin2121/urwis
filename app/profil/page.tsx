'use client'
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useLoyalty } from '@/contexts/LoyaltyContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, isAuthenticated, logout, updateAvatar } = useAuth();
  const { points, level, badges, pointsHistory } = useLoyalty();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');

  // Redirect jeśli nie zalogowany
  if (typeof window !== 'undefined' && !isAuthenticated) {
    router.push('/');
    return null;
  }

  if (!user) return null;

const tabs = [
  { id: 'profile', name: 'Profil', icon: '👤' },
  { id: 'loyalty', name: 'Program Lojalnościowy', icon: '🏆' },
  { id: 'challenges', name: 'Wyzwania', icon: '🎯' },
  { id: 'stats', name: 'Statystyki', icon: '📊' },
  { id: 'urwis-hunter', name: 'Łowca Urwisa', icon: '🧸' }, // 🆕 NOWY TAB
  { id: 'rewards', name: 'Nagrody', icon: '🎁' },
  { id: 'games', name: 'Historia Gier', icon: '🎮' },
  { id: 'settings', name: 'Ustawienia', icon: '⚙️' },
];


  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      
      <div className="container mx-auto px-6 pt-32 pb-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-5xl font-black mb-2">
            <span className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Mój Profil
            </span>
          </h1>
          <p className="text-gray-600 text-lg">
            Witaj z powrotem, <span className="font-bold text-gray-900">{user.username}</span>! 👋
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar - Tabs */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-3xl shadow-xl p-6 sticky top-32">
              <div className="space-y-2">
                {tabs.map((tab) => (
                  <motion.button
                    key={tab.id}
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-left transition-all ${
                      activeTab === tab.id
                        ? 'bg-linear-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-2xl">{tab.icon}</span>
                    <span className="text-sm">{tab.name}</span>
                  </motion.button>
                ))}
              </div>

              {/* Logout */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={logout}
                className="w-full mt-6 px-4 py-3 bg-red-50 text-red-600 rounded-xl font-semibold hover:bg-red-100 transition-colors"
              >
                🚪 Wyloguj się
              </motion.button>
            </div>
          </motion.div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === 'profile' && <ProfileTab user={user} updateAvatar={updateAvatar} />}
                {activeTab === 'loyalty' && <LoyaltyTab points={points} level={level} badges={badges} />}
                {activeTab === 'challenges' && <ChallengesTab user={user} />}
                {activeTab === 'stats' && <StatsTab user={user} />}
                {activeTab === 'urwis-hunter' && <UrwisHunterTab user={user} />} {/* ← DODAJ */}
                {activeTab === 'rewards' && <RewardsTab user={user} />}
                {activeTab === 'games' && <GamesTab user={user} />}
                {activeTab === 'settings' && <SettingsTab user={user} />}
                
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== TAB COMPONENTS =====

// 1. Profile Tab
function ProfileTab({ user, updateAvatar }: any) {
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const avatars = ['🧸', '🎮', '🎨', '⚽', '🎲', '🚀', '🦖', '🦄', '🐶', '🐱', '🦊', '🐼', '🐨', '🐯', '🦁', '🐸'];

  const progressPercent = (user.exp / user.expToNextLevel) * 100;

  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <div className="bg-white rounded-3xl shadow-xl p-8">
        <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
          {/* Avatar */}
          <motion.button
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAvatarPicker(!showAvatarPicker)}
            className="w-32 h-32 rounded-full bg-linear-to-br from-blue-400 to-purple-500 flex items-center justify-center text-7xl cursor-pointer hover:shadow-2xl transition-shadow relative"
          >
            {user.avatar}
            <div className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-full flex items-center justify-center text-xl shadow-lg">
              ✏️
            </div>
          </motion.button>

          {/* User Info */}
          <div className="text-center md:text-left flex-1">
            <h2 className="text-4xl font-black text-gray-900 mb-2">{user.username}</h2>
            <p className="text-gray-600 mb-4">{user.email}</p>
            
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <div className="px-4 py-2 bg-linear-to-r from-yellow-100 to-orange-100 rounded-full border-2 border-yellow-300">
                <span className="text-sm font-bold text-orange-700">⭐ Poziom {user.level}</span>
              </div>
              <div className="px-4 py-2 bg-linear-to-r from-blue-100 to-purple-100 rounded-full border-2 border-blue-300">
                <span className="text-sm font-bold text-purple-700">
                  {user.level < 5 && '🥉 Nowicjusz'}
                  {user.level >= 5 && user.level < 10 && '🥈 Doświadczony'}
                  {user.level >= 10 && user.level < 20 && '🥇 Ekspert'}
                  {user.level >= 20 && user.level < 50 && '💎 Mistrz'}
                  {user.level >= 50 && '👑 Legenda'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Avatar Picker */}
        <AnimatePresence>
          {showAvatarPicker && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 p-6 bg-linear-to-r from-blue-50 to-purple-50 rounded-2xl border-2 border-blue-200"
            >
              <p className="text-sm font-bold text-gray-700 mb-4 text-center">Wybierz swój avatar:</p>
              <div className="grid grid-cols-8 gap-3">
                {avatars.map((avatar) => (
                  <motion.button
                    key={avatar}
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      updateAvatar(avatar);
                      setShowAvatarPicker(false);
                    }}
                    className={`text-4xl p-4 rounded-2xl transition-all ${
                      user.avatar === avatar
                        ? 'bg-linear-to-br from-blue-400 to-purple-500 ring-4 ring-blue-400 shadow-xl'
                        : 'bg-white hover:bg-gray-100 shadow-md hover:shadow-lg'
                    }`}
                  >
                    {avatar}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Level & EXP */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <span className="text-3xl">✨</span>
              <span className="text-xl font-black text-gray-800">
                Poziom {user.level}
              </span>
            </div>
            <span className="text-lg font-semibold text-gray-600">
              {user.exp} / {user.expToNextLevel} EXP
            </span>
          </div>

          {/* Progress Bar */}
          <div className="h-6 bg-gray-200 rounded-full overflow-hidden shadow-inner">
            <motion.div
              className="h-full bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 flex items-center justify-end pr-2"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            >
              <span className="text-xs font-bold text-white">
                {Math.round(progressPercent)}%
              </span>
            </motion.div>
          </div>

          <p className="text-sm text-gray-500 mt-2 text-center">
            Jeszcze {user.expToNextLevel - user.exp} EXP do poziomu {user.level + 1}!
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-linear-to-br from-yellow-50 to-orange-50 rounded-xl border-2 border-yellow-200 text-center">
            <div className="text-3xl mb-2">🎯</div>
            <div className="text-2xl font-black text-orange-600">{user.level}</div>
            <div className="text-xs text-gray-600">Poziom</div>
          </div>
          
          <div className="p-4 bg-linear-to-br from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 text-center">
            <div className="text-3xl mb-2">⭐</div>
            <div className="text-2xl font-black text-blue-600">{user.exp}</div>
            <div className="text-xs text-gray-600">Doświadczenie</div>
          </div>
          
          <div className="p-4 bg-linear-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 text-center">
            <div className="text-3xl mb-2">🏆</div>
            <div className="text-2xl font-black text-purple-600">
              {parseInt(localStorage.getItem(`urwis_streak_${user.id}`) || '0')}
            </div>
            <div className="text-xs text-gray-600">Seria dni</div>
          </div>
          
          <div className="p-4 bg-linear-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 text-center">
            <div className="text-3xl mb-2">📅</div>
            <div className="text-2xl font-black text-green-600">
              {Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))}
            </div>
            <div className="text-xs text-gray-600">Dni z nami</div>
          </div>
        </div>
      </div>

      {/* Member Since */}
      <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
        <p className="text-gray-600">
          Członek Klubu Urwisa od{' '}
          <span className="font-bold text-gray-900">
            {new Date(user.createdAt).toLocaleDateString('pl-PL', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </span>
        </p>
      </div>
    </div>
  );
}

// 2. Loyalty Tab
function LoyaltyTab({ points, level, badges }: any) {
  const badgesList = [
    { id: 'first_100', name: 'Pierwsze 100', icon: '🌟', description: 'Zdobądź 100 punktów' },
    { id: 'collector', name: 'Kolekcjoner', icon: '💎', description: 'Zdobądź 500 punktów' },
    { id: 'master', name: 'Mistrz', icon: '👑', description: 'Zdobądź 1000 punktów' },
    { id: 'regular', name: 'Stały Klient', icon: '❤️', description: '10 transakcji' },
  ];

  return (
    <div className="space-y-6">
      {/* Points Card */}
      <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
        <div className="text-7xl mb-4">💰</div>
        <h3 className="text-3xl font-black mb-2">Twoje Punkty</h3>
        <div className="text-6xl font-black bg-linear-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent mb-4">
          {points}
        </div>
        <p className="text-gray-600">Poziom: {level}</p>
      </div>

      {/* Badges */}
      <div className="bg-white rounded-3xl shadow-xl p-8">
        <h3 className="text-2xl font-black mb-6 text-center">Twoje Odznaki</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {badgesList.map((badge) => {
            const isUnlocked = badges.includes(badge.id);
            return (
              <motion.div
                key={badge.id}
                whileHover={isUnlocked ? { scale: 1.05, rotate: 5 } : {}}
                className={`p-6 rounded-2xl text-center transition-all ${
                  isUnlocked 
                    ? 'bg-linear-to-br from-yellow-100 to-orange-100 border-4 border-yellow-400 shadow-xl'
                    : 'bg-gray-100 opacity-50 border-2 border-gray-300'
                }`}
              >
                <div className="text-5xl mb-3 filter"
                  style={{ filter: isUnlocked ? 'none' : 'grayscale(100%)' }}
                >
                  {badge.icon}
                </div>
                <div className="text-sm font-bold text-gray-800 mb-1">{badge.name}</div>
                <div className="text-xs text-gray-600">{badge.description}</div>
                {isUnlocked && (
                  <div className="mt-2 text-xs font-bold text-green-600">✓ Odblokowane</div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// 3. Challenges Tab
function ChallengesTab({ user }: any) {
  const streak = parseInt(localStorage.getItem(`urwis_streak_${user.id}`) || '0');
  
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
        <div className="text-7xl mb-4">🔥</div>
        <h3 className="text-3xl font-black mb-2">Twoja Seria</h3>
        <div className="text-6xl font-black bg-linear-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-4">
          {streak} dni
        </div>
        <p className="text-gray-600">Nie przerywaj serii - wróć jutro!</p>
      </div>

      {/* Streak Milestones */}
      <div className="bg-white rounded-3xl shadow-xl p-8">
        <h3 className="text-2xl font-black mb-6">Kamienie Milowe</h3>
        <div className="space-y-4">
          {[
            { days: 7, reward: 'WEEK10', icon: '🎁', unlocked: streak >= 7 },
            { days: 30, reward: 'MONTH20', icon: '👑', unlocked: streak >= 30 },
            { days: 100, reward: 'LEGEND50', icon: '💎', unlocked: streak >= 100 },
          ].map((milestone) => (
            <div
              key={milestone.days}
              className={`p-4 rounded-xl border-2 ${
                milestone.unlocked
                  ? 'bg-green-50 border-green-400'
                  : 'bg-gray-50 border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{milestone.icon}</span>
                  <div>
                    <div className="font-bold">{milestone.days} dni z rzędu</div>
                    <div className="text-sm text-gray-600">Kupon: {milestone.reward}</div>
                  </div>
                </div>
                {milestone.unlocked ? (
                  <span className="text-2xl">✅</span>
                ) : (
                  <span className="text-sm text-gray-500">🔒</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 4. Stats Tab
function StatsTab({ user }: any) {
  const expHistory = JSON.parse(localStorage.getItem(`urwis_exp_history_${user.id}`) || '[]');
  
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl shadow-xl p-8">
        <h3 className="text-2xl font-black mb-6">Historia EXP</h3>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {expHistory.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Brak historii</p>
          ) : (
            expHistory.map((entry: any, i: number) => (
              <div
                key={i}
                className="p-4 bg-linear-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-bold text-gray-900">{entry.reason}</div>
                    <div className="text-sm text-gray-600">
                      {new Date(entry.date).toLocaleDateString('pl-PL')} • Poziom {entry.level}
                    </div>
                  </div>
                  <div className="text-xl font-black text-purple-600">
                    +{entry.amount} EXP
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// 5. Rewards Tab
function RewardsTab({ user }: any) {
  const claimedRewards = Object.keys(localStorage)
    .filter(key => key.startsWith(`urwis_claimed_${user.id}_`))
    .map(key => JSON.parse(localStorage.getItem(key) || '{}'));

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl shadow-xl p-8">
        <h3 className="text-2xl font-black mb-6">Zdobyte Nagrody</h3>
        <div className="space-y-3">
          {claimedRewards.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Brak zdobytych nagród</p>
          ) : (
            claimedRewards.reverse().slice(0, 20).map((reward: any, i: number) => (
              <div
                key={i}
                className="p-4 bg-linear-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-bold">Codzienna nagroda - Dzień {reward.streak}</div>
                    <div className="text-sm text-gray-600">
                      {reward.points} punktów • {reward.exp} EXP
                    </div>
                  </div>
                  <div className="text-3xl">🎁</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// 6. Games Tab
function GamesTab({ user }: any) {
  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
      <div className="text-7xl mb-4">🎮</div>
      <h3 className="text-2xl font-black mb-4">Historia Gier</h3>
      <p className="text-gray-600">Wkrótce! Ta funkcja będzie dostępna już niedługo.</p>
    </div>
  );
}

// 7. Settings Tab
function SettingsTab({ user }: any) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      alert('Nowe hasła nie pasują do siebie!');
      return;
    }

    if (newPassword.length < 6) {
      alert('Hasło musi mieć minimum 6 znaków!');
      return;
    }

    // Pobierz użytkowników
    const users = JSON.parse(localStorage.getItem('urwis_users') || '[]');
    const userIndex = users.findIndex((u: any) => u.id === user.id);

    if (userIndex === -1) {
      alert('Błąd: Nie znaleziono użytkownika');
      return;
    }

    // Sprawdź stare hasło
    if (users[userIndex].password !== oldPassword) {
      alert('Nieprawidłowe stare hasło!');
      return;
    }

    // Zmień hasło
    users[userIndex].password = newPassword;
    localStorage.setItem('urwis_users', JSON.stringify(users));

    alert('✅ Hasło zostało zmienione!');
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="space-y-6">
      {/* Change Password */}
      <div className="bg-white rounded-3xl shadow-xl p-8">
        <h3 className="text-2xl font-black mb-6">🔐 Zmiana Hasła</h3>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Stare hasło
            </label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Nowe hasło
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Potwierdź nowe hasło
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-4 bg-linear-to-r from-blue-500 to-purple-500 text-white rounded-xl font-bold shadow-lg"
          >
            Zmień hasło
          </motion.button>
        </form>
      </div>

      {/* Account Info */}
      <div className="bg-white rounded-3xl shadow-xl p-8">
        <h3 className="text-2xl font-black mb-6">📧 Informacje o Koncie</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
            <div className="px-4 py-3 bg-gray-50 rounded-xl border-2 border-gray-200">
              {user.email}
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Nazwa użytkownika</label>
            <div className="px-4 py-3 bg-gray-50 rounded-xl border-2 border-gray-200">
              {user.username}
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">ID użytkownika</label>
            <div className="px-4 py-3 bg-gray-50 rounded-xl border-2 border-gray-200 text-xs text-gray-600">
              {user.id}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
// 8. Urwis Hunter Tab
function UrwisHunterTab({ user }: any) {
  // Policz ile razy znalazł
  const urwisFindsCount = (() => {
    let count = 0;
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(`urwis_hidden_found_${user.id}_`)) {
        count++;
      }
    });
    return count;
  })();

  // Historia znalezień
  const urwisHistory = (() => {
    const history: { date: string; found: boolean }[] = [];
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(`urwis_hidden_found_${user.id}_`)) {
        const dateStr = key.replace(`urwis_hidden_found_${user.id}_`, '');
        history.push({ date: dateStr, found: true });
      }
    });
    return history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  })();

  // Odznaki
  const badges = [
    { id: 'first_find', name: 'Pierwszy Urwis', icon: '🎉', requirement: 1, description: 'Znajdź Urwisa pierwszy raz' },
    { id: 'hunter', name: 'Łowca', icon: '🔍', requirement: 5, description: 'Znajdź Urwisa 5 razy' },
    { id: 'expert', name: 'Ekspert', icon: '🎯', requirement: 10, description: 'Znajdź Urwisa 10 razy' },
    { id: 'master', name: 'Mistrz', icon: '👑', requirement: 30, description: 'Znajdź Urwisa 30 razy' },
    { id: 'legend', name: 'Legenda', icon: '💎', requirement: 100, description: 'Znajdź Urwisa 100 razy!' },
  ];

  return (
    <div className="space-y-6">
      {/* Główna karta z licznikiem */}
      <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
        <div className="text-7xl mb-4">🧸</div>
        <h3 className="text-3xl font-black mb-2">Łowca Urwisa</h3>
        <div className="text-6xl font-black bg-linear-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent mb-4">
          {urwisFindsCount}
        </div>
        <p className="text-gray-600">
          {urwisFindsCount === 0 && 'Jeszcze nie znalazłeś Urwisa!'}
          {urwisFindsCount === 1 && 'Znalazłeś Urwisa raz!'}
          {urwisFindsCount > 1 && urwisFindsCount < 5 && `Znalazłeś Urwisa ${urwisFindsCount} razy!`}
          {urwisFindsCount >= 5 && urwisFindsCount < 10 && 'Jesteś na dobrej drodze!'}
          {urwisFindsCount >= 10 && urwisFindsCount < 30 && 'Prawdziwy łowca!'}
          {urwisFindsCount >= 30 && 'Niesamowite! Jesteś legendą!'}
        </p>
      </div>

      {/* Odznaki */}
      <div className="bg-white rounded-3xl shadow-xl p-8">
        <h3 className="text-2xl font-black mb-6 text-center">Odznaki Łowcy</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {badges.map((badge) => {
            const isUnlocked = urwisFindsCount >= badge.requirement;
            return (
              <motion.div
                key={badge.id}
                whileHover={isUnlocked ? { scale: 1.05, rotate: 5 } : {}}
                className={`p-6 rounded-2xl text-center transition-all ${
                  isUnlocked 
                    ? 'bg-linear-to-br from-yellow-100 to-orange-100 border-4 border-yellow-400 shadow-xl'
                    : 'bg-gray-100 opacity-50 border-2 border-gray-300'
                }`}
              >
                <div className="text-5xl mb-3 filter"
                  style={{ filter: isUnlocked ? 'none' : 'grayscale(100%)' }}
                >
                  {badge.icon}
                </div>
                <div className="text-sm font-bold text-gray-800 mb-1">{badge.name}</div>
                <div className="text-xs text-gray-600 mb-2">{badge.description}</div>
                {isUnlocked ? (
                  <div className="text-xs font-bold text-green-600">✓ Odblokowane</div>
                ) : (
                  <div className="text-xs text-gray-500">{badge.requirement} znalezień</div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Historia znalezień */}
      <div className="bg-white rounded-3xl shadow-xl p-8">
        <h3 className="text-2xl font-black mb-6">Historia Znalezień</h3>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {urwisHistory.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Jeszcze nie znalazłeś Urwisa!</p>
          ) : (
            urwisHistory.map((entry, i) => (
              <div
                key={i}
                className="p-4 bg-linear-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-bold text-gray-900">Urwis znaleziony! 🧸</div>
                    <div className="text-sm text-gray-600">
                      {new Date(entry.date).toLocaleDateString('pl-PL', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                  <div className="text-3xl">✅</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Dzisiejszy status */}
      <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
        <h3 className="text-2xl font-black mb-4">Dzisiaj</h3>
        {(() => {
          const today = new Date().toDateString();
          const foundToday = localStorage.getItem(`urwis_hidden_found_${user.id}_${today}`);
          
          return foundToday ? (
            <div>
              <div className="text-5xl mb-4">🎉</div>
              <p className="text-lg font-bold text-green-600 mb-2">
                Gratulacje! Już znalazłeś dzisiaj Urwisa!
              </p>
              <p className="text-sm text-gray-600">
                Wróć jutro po kolejne wyzwanie!
              </p>
            </div>
          ) : (
            <div>
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-lg font-bold text-gray-900 mb-2">
                Urwis czeka na odkrycie!
              </p>
              <p className="text-sm text-gray-600 mb-4">
                Sprawdź różne zakładki - może się gdzieś ukrywa?
              </p>
              <Link href="/">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-linear-to-r from-yellow-500 to-orange-500 text-white rounded-full font-bold"
                >
                  Zacznij szukać! 🔎
                </motion.button>
              </Link>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
