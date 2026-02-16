'use client'
import { useState, useEffect, useCallback } from 'react'  // ✅ useEffect!
import { motion } from 'framer-motion'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'  // ✅ Poprawny import!
import { getRandomQuestions } from '@/lib/quiz-server'
import type { TriviaQuestion } from '@/lib/quiz-server'

export default function SinglePlayerQuiz() {
  const supabase = createClient(  // ✅ Global client (anon key)
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const [current, setCurrent] = useState(0)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('mixed')
  const [questions, setQuestions] = useState<TriviaQuestion[]>([])

  // 🔥 Load questions
  useEffect(() => {
    getRandomQuestions(selectedCategory, 10).then(setQuestions)
  }, [selectedCategory])

  // 💾 Save session
  const saveSession = async (finalScore: number) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      console.warn('No user logged in')
      return
    }

    await supabase.from('quiz_sessions').insert({
      user_id: user.id,
      mode: 'single',
      category: selectedCategory,
      questions_count: questions.length,
      score: finalScore,
      max_streak: streak,
      accuracy: questions.length ? Math.round((finalScore / (questions.length * 20)) * 100 * 100) / 100 : 0
    })
  }

  const answer = useCallback((index: number) => {
    const q = questions[current]
    if (!q) return

    const isCorrect = index === q.correct
    const exp = isCorrect ? q.exp * Math.min(streak + 1, 3) : 0

    if (isCorrect) {
      setScore(s => s + exp)
      setStreak(s => s + 1)
    } else {
      setStreak(0)
    }

    const next = () => {
      if (current + 1 < questions.length) {
        setCurrent(c => c + 1)
      } else {
        setGameOver(true)
        saveSession(score + exp)
      }
    }

    setTimeout(next, 1200)
  }, [current, questions, score, streak])

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-8">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }} className="text-4xl">
          Ładuję pytania... 🧠
        </motion.div>
      </div>
    )
  }

  const q = questions[current]

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
      {!gameOver ? (
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Category */}
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="w-full max-w-md mx-auto block px-6 py-4 bg-white rounded-3xl shadow-xl border-4 border-indigo-200 text-xl font-bold"
          >
            <option value="mixed">🎲 Mieszane</option>
            <option value="Geografia">🌍 Geografia</option>
            <option value="Historia">📜 Historia</option>
            <option value="Matematyka">🔢 Matematyka</option>
            <option value="Sport">⚽ Sport</option>
            <option value="Nauka">🧪 Nauka</option>
          </select>

          {/* Progress */}
          <div className="text-center p-6 bg-white/70 backdrop-blur rounded-3xl shadow-xl">
            <div className="text-3xl font-black mb-2">Pytanie {current + 1} z {questions.length}</div>
            <div className="text-2xl font-bold text-emerald-600">
              Streak: {streak}x | <span className="text-orange-600">{score} EXP</span>
            </div>
          </div>

          {/* Question */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-12 bg-white/90 backdrop-blur rounded-3xl shadow-2xl text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-8 leading-relaxed">{q.question}</h2>
            <div className="text-xl text-purple-700 font-semibold uppercase tracking-wide">
              {q.category}
            </div>
          </motion.div>

          {/* Answers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {q.options.map((option: string, i: number) => (
              <motion.button
                key={i}
                onClick={() => answer(i)}
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.98 }}
                className="group p-10 rounded-3xl font-bold text-xl shadow-2xl bg-gradient-to-r from-indigo-50 via-white to-purple-50 hover:from-indigo-100 hover:to-purple-100 border-4 border-indigo-200 hover:border-indigo-400 hover:shadow-3xl text-left min-h-[140px] flex items-center text-gray-800 hover:text-gray-900 relative overflow-hidden"
              >
                <span className="text-4xl font-black mr-6 text-indigo-600 group-hover:text-indigo-700 z-10">
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="relative z-10 leading-relaxed">{option}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />
              </motion.button>
            ))}
          </div>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto text-center py-24 space-y-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-9xl mb-8"
          >
            🏆
          </motion.div>
          <h2 className="text-6xl font-black bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-600 bg-clip-text text-transparent mb-8">
            FENOMENALNIE!
          </h2>
          <div className="space-y-6 text-center">
            <div className="text-7xl font-black text-emerald-600 drop-shadow-2xl">
              {score} EXP
            </div>
            <div className="text-4xl text-yellow-500 font-bold">
              Max Streak: {streak}x 🔥
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-6 justify-center pt-12 border-t-4 border-emerald-200/50">
            <Link
              href="/quiz"
              className="px-16 py-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-3xl font-black text-2xl shadow-2xl hover:shadow-3xl text-center"
            >
              🏠 Leaderboard
            </Link>
            <button
              onClick={() => window.location.reload()}
              className="px-16 py-8 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-3xl font-black text-2xl shadow-2xl hover:shadow-3xl"
            >
              🔄 Nowa Gra
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
