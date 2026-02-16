'use client'
import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useQuery, useMutation } from '@tanstack/react-query'
import { createBrowserClient } from '@supabase/supabase-js'  // ✅ Client-side!
import Link from 'next/link'  // ✅ Import!
import { getRandomQuestions } from '@/lib/quiz'
import type { TriviaQuestion } from '@/lib/quiz'  // ✅ Teraz eksportowane!

export default function SinglePlayerQuiz() {
  const supabase = createBrowserClient(  // ✅ Client!
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const [current, setCurrent] = useState(0)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('mixed')

  const { data: questions = [] } = useQuery<TriviaQuestion[]>({
    queryKey: ['quiz-single', selectedCategory],
    queryFn: () => getRandomQuestions(selectedCategory, 10),
  })

  const saveSession = useMutation({
    mutationFn: async (finalScore: number) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user')

      const { error } = await supabase
        .from('quiz_sessions')
        .insert({
          user_id: user.id,
          mode: 'single',
          category: selectedCategory,
          questions_count: questions.length,
          score: finalScore,
          max_streak: streak,
          accuracy: Math.round((finalScore / (questions.length * 20)) * 100 * 100) / 100
        })
      if (error) throw error
    }
  })

  const answer = useCallback((index: number) => {  // ✅ Typed params!
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
        saveSession.mutate(score + exp)
      }
    }

    setTimeout(next, 1200)
  }, [current, questions, score, streak, saveSession])

  if (questions.length === 0) {
    return <div className="min-h-screen flex items-center justify-center">Ładuję... 🧠</div>
  }

  const q = questions[current]

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
      {!gameOver ? (
        // GAME ACTIVE
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
          </select>

          {/* Progress */}
          <div className="text-center p-6 bg-white/70 backdrop-blur rounded-3xl shadow-xl">
            <div className="text-3xl font-black mb-2">Pytanie {current + 1}/10</div>
            <div className="text-2xl font-bold text-emerald-600">Streak: {streak}x | {score} EXP</div>
          </div>

          {/* Question */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-12 bg-white/90 backdrop-blur rounded-3xl shadow-2xl text-center"
          >
            <h2 className="text-3xl font-bold mb-8">{q.question}</h2>
            <div className="text-xl text-purple-700 font-semibold">{q.category}</div>
          </motion.div>

          {/* Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {q.options.map((option: string, i: number) => (  // ✅ Typed!
              <motion.button
                key={i}
                onClick={() => answer(i)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="p-8 rounded-3xl font-bold text-xl shadow-2xl bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 border-4 border-indigo-200 hover:border-indigo-400 text-left min-h-[100px]"
              >
                <span className="text-3xl font-black mr-4">{String.fromCharCode(65 + i)}</span>
                {option}
              </motion.button>
            ))}
          </div>
        </div>
      ) : (
        // GAME OVER
        <div className="max-w-2xl mx-auto text-center py-24 space-y-8">
          <motion.div animate={{ scale: [1, 1.5, 1] }} className="text-8xl mb-8">🏆</motion.div>
          <h2 className="text-5xl font-black bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
            WYGRANA!
          </h2>
          <div className="text-6xl font-black text-emerald-600 mb-8">{score} EXP</div>
          <div className="space-x-6">
            <Link href="/quiz" className="px-12 py-6 bg-indigo-600 text-white rounded-3xl font-black text-xl shadow-2xl inline-block">
              🏠 Dashboard
            </Link>
            <button onClick={() => window.location.reload()} className="px-12 py-6 bg-orange-500 text-white rounded-3xl font-black text-xl shadow-2xl inline-block">
              🔄 Nowa Gra
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
