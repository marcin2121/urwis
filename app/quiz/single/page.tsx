'use client'
import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client' // ✅ Auth-aware!
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext'
import { useSupabaseLoyalty } from '@/contexts/SupabaseLoyaltyContext'

type TriviaQuestion = {
  id: number
  question: string
  options: string[] // ✅ Array, nie string!
  correct: number
  exp: number
  category: string
}

export default function SinglePlayerQuiz() {
  const supabase = createClient() // ✅ Już ma auth!
  const { user } = useSupabaseAuth()
  const { addExp } = useSupabaseLoyalty()

  const [current, setCurrent] = useState(0)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('mixed')
  const [questions, setQuestions] = useState<TriviaQuestion[]>([])
  const [loading, setLoading] = useState(true)

  // 🔥 Load questions
  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true)
      let query = supabase
        .from('trivia_questions')
        .select('id,question,options,correct,exp,category')
        .eq('is_active', true)
        .limit(10)

      if (selectedCategory !== 'mixed') {
        query = query.eq('category', selectedCategory)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching questions:', error)
        setLoading(false)
        return
      }

      // ✅ Options już są JSONB array!
      const formatted = (data || []).map((q: any) => ({
        ...q,
        options: Array.isArray(q.options) ? q.options : JSON.parse(q.options)
      }))

      setQuestions(formatted)
      setLoading(false)
    }

    fetchQuestions()
  }, [selectedCategory])

  // 💾 Save session
  const saveSession = async (finalScore: number, maxStreak: number) => {
    if (!user?.id) {
      console.warn('No user logged in')
      return
    }

    const accuracy = questions.length
      ? Math.round((finalScore / (questions.length * 20)) * 100)
      : 0

    await supabase.from('quiz_sessions').insert({
      user_id: user.id,
      mode: 'single',
      category: selectedCategory,
      questions_count: questions.length,
      score: finalScore,
      max_streak: maxStreak,
      accuracy
    })

    // ✅ Dodaj EXP do loyalty!
    await addExp(finalScore, `Quiz Single - ${selectedCategory}`)
  }

  const answer = useCallback(
    (index: number) => {
      const q = questions[current]
      if (!q) return

      const isCorrect = index === q.correct
      const streakMultiplier = Math.min(streak + 1, 3)
      const earnedExp = isCorrect ? q.exp * streakMultiplier : 0

      let newScore = score
      let newStreak = streak

      if (isCorrect) {
        newScore += earnedExp
        newStreak += 1
        setScore(newScore)
        setStreak(newStreak)
      } else {
        newStreak = 0
        setStreak(0)
      }

      setTimeout(() => {
        if (current + 1 < questions.length) {
          setCurrent(c => c + 1)
        } else {
          setGameOver(true)
          saveSession(newScore, Math.max(newStreak, streak))
        }
      }, 1200)
    },
    [current, questions, score, streak]
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="text-6xl"
        >
          🧠
        </motion.div>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="text-7xl mb-4">😢</div>
          <h2 className="text-3xl font-black mb-4">Brak pytań w tej kategorii!</h2>
          <Link
            href="/quiz"
            className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold text-xl shadow-xl"
          >
            Wróć do Dashboard
          </Link>
        </div>
      </div>
    )
  }

  const q = questions[current]

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
      {!gameOver ? (
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Category Selector */}
          <div className="text-center">
            <select
              value={selectedCategory}
              onChange={e => {
                setSelectedCategory(e.target.value)
                setCurrent(0)
                setScore(0)
                setStreak(0)
                setGameOver(false)
              }}
              className="px-8 py-4 bg-white rounded-3xl shadow-xl border-4 border-indigo-200 text-xl font-bold cursor-pointer hover:border-indigo-400 transition-all"
            >
              <option value="mixed">🎲 Wszystkie kategorie</option>
              <option value="🗺️ Geografia">🌍 Geografia</option>
              <option value="🏛️ Historia">📜 Historia</option>
              <option value="➗ Matematyka">🔢 Matematyka</option>
              <option value="⚽ Sport">⚽ Sport</option>
              <option value="🔬 Nauka">🧪 Nauka</option>
              <option value="🎨 Sztuka">🎨 Sztuka</option>
              <option value="📚 Literatura">📚 Literatura</option>
            </select>
          </div>

          {/* Progress */}
          <div className="text-center p-6 bg-white/70 backdrop-blur rounded-3xl shadow-xl">
            <div className="text-3xl font-black mb-2">
              Pytanie {current + 1} / {questions.length}
            </div>
            <div className="text-2xl font-bold">
              <span className="text-orange-600">{score} EXP</span>
              {' • '}
              <span className="text-emerald-600">Seria: {streak}x 🔥</span>
            </div>
          </div>

          {/* Question */}
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-12 bg-white/90 backdrop-blur rounded-3xl shadow-2xl text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-8 leading-relaxed">
              {q.question}
            </h2>
            <div className="text-xl text-purple-700 font-semibold uppercase tracking-wide">
              {q.category}
            </div>
          </motion.div>

          {/* Answers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {q.options.map((option: string, i: number) => (
              <motion.button
                key={i}
                onClick={() => answer(i)}
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.98 }}
                className="group p-10 rounded-3xl font-bold text-xl shadow-2xl bg-gradient-to-r from-indigo-50 via-white to-purple-50 hover:from-indigo-100 hover:to-purple-100 border-4 border-indigo-200 hover:border-indigo-400 text-left min-h-[140px] flex items-center relative overflow-hidden transition-all"
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
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-9xl mb-8">
            🏆
          </motion.div>
          <h2 className="text-6xl font-black bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-600 bg-clip-text text-transparent mb-8">
            FENOMENALNIE!
          </h2>
          <div className="space-y-6">
            <div className="text-7xl font-black text-emerald-600 drop-shadow-2xl">
              {score} EXP
            </div>
            <div className="text-4xl text-yellow-500 font-bold">Max Streak: {streak}x 🔥</div>
          </div>
          <div className="flex flex-col sm:flex-row gap-6 justify-center pt-12 border-t-4 border-emerald-200/50">
            <Link
              href="/quiz"
              className="px-16 py-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-3xl font-black text-2xl shadow-2xl hover:scale-105 transition-all"
            >
              🏠 Dashboard
            </Link>
            <button
              onClick={() => window.location.reload()}
              className="px-16 py-8 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-3xl font-black text-2xl shadow-2xl hover:scale-105 transition-all"
            >
              🔄 Jeszcze raz!
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
