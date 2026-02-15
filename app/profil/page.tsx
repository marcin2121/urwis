function ProfileTab({ user, updateAvatar }: any) {
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const avatars = ['🦸‍♂️', '🎮', '🎨', '⚽', '🎲', '🚀', '🦖', '🦄', '🐶', '🐱', '🦊', '🐼', '🐨', '🐯', '🦁', '🐸'];

  // ✅ Calculate EXP
  const expToNextLevel = user.level * 100;
  const currentExp = user.total_exp % expToNextLevel || 0;
  const progressPercent = (currentExp / expToNextLevel) * 100;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl shadow-xl p-8">
        <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
          {/* Avatar */}
          <motion.button
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAvatarPicker(!showAvatarPicker)}
            className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-7xl cursor-pointer hover:shadow-2xl transition-shadow relative"
          >
            {user.avatar_url || '🦸‍♂️'}
            <div className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-full flex items-center justify-center text-xl shadow-lg">
              ✏️
            </div>
          </motion.button>

          {/* User Info */}
          <div className="text-center md:text-left flex-1">
            <h2 className="text-4xl font-black text-gray-900 mb-2">{user.username}</h2>
            <p className="text-gray-600 mb-4">{user.email}</p>

            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <div className="px-4 py-2 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-full border-2 border-yellow-300">
                <span className="text-sm font-bold text-orange-700">⭐ Poziom {user.level}</span>
              </div>
              <div className="px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full border-2 border-blue-300">
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
              className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border-2 border-blue-200"
            >
              <p className="text-sm font-bold text-gray-700 mb-4 text-center">Wybierz swój avatar:</p>
              <div className="grid grid-cols-8 gap-3">
                {avatars.map((avatar) => (
                  <motion.button
                    key={avatar}
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      updateAvatar({ avatar_url: avatar });  // ✅ POPRAWIONE
                      setShowAvatarPicker(false);
                    }}
                    className={`text-4xl p-4 rounded-2xl transition-all ${user.avatar_url === avatar  // ✅ POPRAWIONE
                        ? 'bg-gradient-to-br from-blue-400 to-purple-500 ring-4 ring-blue-400 shadow-xl'
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
              {currentExp} / {expToNextLevel} EXP  {/* ✅ POPRAWIONE */}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="h-6 bg-gray-200 rounded-full overflow-hidden shadow-inner">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 flex items-center justify-end pr-2"
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
            Jeszcze {expToNextLevel - currentExp} EXP do poziomu {user.level + 1}!  {/* ✅ POPRAWIONE */}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border-2 border-yellow-200 text-center">
            <div className="text-3xl mb-2">🎯</div>
            <div className="text-2xl font-black text-orange-600">{user.level}</div>
            <div className="text-xs text-gray-600">Poziom</div>
          </div>

          <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 text-center">
            <div className="text-3xl mb-2">⭐</div>
            <div className="text-2xl font-black text-blue-600">{user.total_exp}</div>  {/* ✅ POPRAWIONE */}
            <div className="text-xs text-gray-600">Doświadczenie</div>
          </div>

          <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 text-center">
            <div className="text-3xl mb-2">🏆</div>
            <div className="text-2xl font-black text-purple-600">
              {parseInt(localStorage.getItem(`urwis_streak_${user.id}`) || '0')}
            </div>
            <div className="text-xs text-gray-600">Seria dni</div>
          </div>

          <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 text-center">
            <div className="text-3xl mb-2">📅</div>
            <div className="text-2xl font-black text-green-600">
              {user.created_at   {/* ✅ POPRAWIONE */}
              ? Math.floor((Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24))
              : 0
              }
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
            {user.created_at  {/* ✅ POPRAWIONE */}
            ? new Date(user.created_at).toLocaleDateString('pl-PL', {
              day: 'numeric',
            month: 'long',
            year: 'numeric'
                })
            : 'Niedawno'
            }
          </span>
        </p>
      </div>
    </div>
  );
}
