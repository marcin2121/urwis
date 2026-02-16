import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { motion } from 'framer-motion'

async function getLeaderboard() {
  const supabase = await createClient()
  return supabase.from('quiz_leaderboard').select('*').limit(20)
}

async function getCategories() {
  const supabase = await createClient()
  return supabase.from('trivia_questions')
    .select('category')
    .eq('is_active', true)  // ✅ Twoja kolumna!
    .order('category', { ascending: true })
}

export default async function QuizDashboard() {
  const [{ data: leaderboard }, { data: categories }] = await Promise.all([
    getLeaderboard(),
    getCategories()
  ])

  const modes = ['single', 'duel', 'challenge', 'party']

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-12 space-y-12">
      {/* 🔥 Hero */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-20 bg-gradient-to-br from-red-500 via-blue-500 to-purple-500 rounded-3xl text-white shadow-2xl"
      >
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-7xl mb-6"
        >
          🧠
        </motion.div>
        <h1 className="text-6xl md:text-7xl font-black mb-6 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
          QUIZ URWIS
        </h1>
        <p className="text-2xl opacity-90 mb-8 max-w-2xl mx-auto">
          65 pytań • {categories?.length || 0} kategorii • Graj i zdobywaj EXP! 🏆
        </p>
      </motion.div>

      {/* 4 Tryby – Superhero Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <Link href="/quiz/single" className="group">
          <motion.div
            whileHover={{ scale: 1.05, rotateY: 10 }}
            className="h-64 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-8 text-white shadow-2xl group-hover:shadow-3xl cursor-pointer border-4 border-emerald-300/50 hover:border-emerald-200/50"
          >
            <div className="text-6xl mb-6">🎯</div>
            <h3 className="text-3xl font-black mb-4">Single Player</h3>
            <p className="text-xl opacity-90 mb-6">Spokojna gra solo<br />Bez limitu czasu</p>
            <span className="px-6 py-2 bg-white/20 rounded-2xl font-bold text-lg">GRAJ TERAZ</span>
          </motion.div>
        </Link>

        <Link href="/quiz/duel/new" className="group">
          <motion.div whileHover={{ scale: 1.05 }} className="h-64 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl p-8 text-white shadow-2xl group-hover:shadow-3xl cursor-pointer border-4 border-blue-300/50">
            <div className="text-6xl mb-6">⚔️</div>
            <h3 className="text-3xl font-black mb-4">Duel Party</h3>
            <p className="text-xl opacity-90 mb-6">2-8 graczy live!<br />Share link z ziomkami</p>
            <span className="px-6 py-2 bg-white/20 rounded-2xl font-bold text-lg">UTWÓRZ POKÓJ</span>
          </motion.div>
        </Link>

        <Link href="/quiz/challenge/new" className="group">
          <motion.div whileHover={{ scale: 1.05 }} className="h-64 bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl p-8 text-white shadow-2xl group-hover:shadow-3xl cursor-pointer border-4 border-orange-400/50">
            <div className="text-6xl mb-6">🥊</div>
            <h3 className="text-3xl font-black mb-4">Challenge 1v1</h3>
            <p className="text-xl opacity-90 mb-6">10s/pytanie<br />Async – wyślij wyzwanie!</p>
            <span className="px-6 py-2 bg-white/20 rounded-2xl font-bold text-lg">WYŚLIJ CHALLENGE</span>
          </motion.div>
        </Link>

        <Link href="/quiz/party/new" className="group">
          <motion.div whileHover={{ scale: 1.05 }} className="h-64 bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl p-8 text-white shadow-2xl group-hover:shadow-3xl cursor-pointer border-4 border-purple-400/50">
            <div className="text-6xl mb-6">👑</div>
            <h3 className="text-3xl font-black mb-4">Party Master</h3>
            <p className="text-xl opacity-90 mb-6">Kahoot-style event<br />Projektor + telefony</p>
            <span className="px-6 py-2 bg-white/20 rounded-2xl font-bold text-lg">BĄDŹ QUIZMASTER</span>
          </motion.div>
        </Link>
      </div>

      {/* Leaderboard Teaser */}
      <div className="grid lg:grid-cols-4 gap-6">
        {modes.map(mode => (
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * modes.indexOf(mode) }}
            className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50"
          >
            <h4 className="font-black text-2xl mb-6 capitalize flex items-center">
              {mode === 'single' ? '🎯' : mode === 'duel' ? '⚔️' : mode === 'challenge' ? '🥊' : '👑'}
              <span className="ml-3">{mode.replace('_', ' ')}</span>
            </h4>

            <div className="space-y-3">
              {leaderboard?.filter(l => l.mode === mode).slice(0, 5).map((player, i) => (
                <div key={player.name} className="flex justify-between items-center p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                  <div className="font-bold text-lg">#{i + 1}</div>
                  <div className="text-right">
                    <div className="font-black text-xl">{player.total_exp} EXP</div>
                    <div className="text-sm opacity-75">{player.name}</div>
                  </div>
                </div>
              )) || <div className="text-center py-8 text-gray-500 italic text-lg">Bądź pierwszy! 🥇</div>}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
