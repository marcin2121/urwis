'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext'
import { fetchTriviaQuestions, TriviaQuestion } from '@/lib/triviaApi'

export default function TriviaGeneralGame({ onComplete }: { onComplete: () => void }) {
  const { profile } = useSupabaseAuth()
  const [questions, setQuestions] = useState<TriviaQuestion[]>([])
  const [current, setCurrent] = useState(0)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [loading, setLoading] = useState(true)
  const [gameOver, setGameOver] = useState(false)

  useEffect(() => {
    // Pobierz świeże pytania z API
    fetchTriviaQuestions(20, undefined, 'mixed')  // 20 pytań, mixed difficulty
      .then(questions => {
        setQuestions(questions)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="w-full h-[500px] flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>
          Ładowanie pytań... 🧠
        </motion.div>
      </div>
    )
  }

  const q = questions[current]
  if (!q) return <div>Błąd ładowania pytań</div>

  const answer = (selectedIndex: number) => {
    // Sprawdź poprawność (pierwsza opcja = poprawna po shuffle)
    const isCorrect = selectedIndex === q.correct
    const exp = isCorrect ? q.exp * Math.min(streak + 1, 5) : 0

    if (isCorrect) {
      setScore(s => s + exp)
      setStreak(s => s + 1)
    } else {
      setStreak(0)
    }

    setTimeout(() => {
      if (current + 1 < questions.length && !gameOver) {
        setCurrent(c => c + 1)
      } else {
        setGameOver(true)
        // TODO: Zapisz EXP do Supabase
        console.log(`🎉 ${score} EXP za Trivia! Streak x${streak}`)
      }
    }, 1500)
  }

  if (gameOver) {
    return (
      <div className="w-full h-[500px] flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl">
        <motion.div animate={{ scale: [1, 1.3, 1] }} className="text-6xl mb-6">🎉</motion.div>
        <h2 className="text-4xl font-black text-white mb-4">Geniusz Wiedzy!</h2>
        <div className="text-3xl text-emerald-100 mb-8">{score} EXP zdobytych!</div>
        <div className="text-xl text-white/90 mb-8">Streak: <span className="font-black text-yellow-300">{streak}x</span></div>
        <motion.button
          onClick={onComplete}
          whileHover={{ scale: 1.05 }}
          className="px-8 py-4 bg-white text-emerald-600 rounded-2xl font-bold text-lg shadow-2xl"
        >
          Gram Dalej! ➡️
        </motion.button>
      </div>
    )
  }

  return (
    <div className="w-full h-[500px] p-8 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl">
      {/* Header */}
      <div className="text-center mb-12 p-6 bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-indigo-100">
        <h2 className="text-3xl font-black mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          🧠 Open Trivia Challenge
        </h2>
        <div className="flex gap-6 justify-center text-lg font-semibold">
          <span>Pytanie {current + 1}/20</span>
          <span className="text-emerald-600">Streak: {streak}x</span>
          <span className="text-orange-600">EXP: {score}</span>
        </div>
        <div className="text-sm text-gray-600 mt-2">{q.category}</div>
      </div>

      {/* Question */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10 p-8 bg-white/80 rounded-3xl shadow-2xl border-4 border-indigo-200"
      >
        <h3 className="text-2xl font-bold text-gray-800 mb-8 leading-relaxed">
          {q.question}
        </h3>
      </motion.div>

      {/* 4 Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto px-4">
        {q.options.map((option, i) => (
          <motion.button
            key={i}
            onClick={() => answer(i)}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="group relative p-6 rounded-2xl font-bold text-lg shadow-lg transition-all duration-200
              bg-gradient-to-r from-white to-gray-50 hover:from-indigo-50 hover:to-purple-50
              border-4 border-gray-200 hover:border-indigo-300 hover:shadow-xl active:shadow-2xl
              min-h-[80px] flex items-center justify-center text-left"
          >
            <span className="relative z-10">{option}</span>
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/10 to-purple-500/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.button>
        ))}
      </div>
    </div>
  )
}
