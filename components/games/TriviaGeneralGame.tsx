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
    // ✅ FIX: 'mixed' → undefined (API losuje difficulty)
    fetchTriviaQuestions(20)  // 20 pytań, mixed difficulty (domyślnie)
      .then(questions => {
        setQuestions(questions)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="w-full h-[500px] flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="text-2xl"
        >
          Pobieram pytania... 🧠
        </motion.div>
      </div>
    )
  }

  const q = questions[current]
  if (!q || questions.length === 0) {
    return (
      <div className="w-full h-[500px] flex items-center justify-center p-8 text-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl">
          <span className="text-2xl mb-4 block">😅</span>
          <p className="text-lg mb-4">Brak pytań z API</p>
          <motion.button
            onClick={() => window.location.reload()}
            whileHover={{ scale: 1.05 }}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold"
          >
            Spróbuj ponownie
          </motion.button>
        </div>
      </div>
    )
  }

  const answer = (index: number) => {
    const isCorrect = index === q.correct
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
        console.log(`🎉 +${score} EXP za Trivia! Streak: x${streak}`)
      }
    }, 1500)
  }

  if (gameOver) {
    return (
      <div className="w-full h-[500px] flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          className="text-7xl mb-6"
        >
          🏆
        </motion.div>
        <h2 className="text-4xl font-black text-white mb-4 drop-shadow-2xl">Geniusz Wiedzy!</h2>
        <div className="text-3xl text-emerald-100 mb-4 drop-shadow-lg">{score} EXP</div>
        <div className="text-2xl text-yellow-200 mb-8 drop-shadow-lg">Streak: <span className="font-black">{streak}x</span></div>

        <div className="space-y-3 w-full max-w-sm">
          <motion.button
            onClick={() => window.location.reload()}
            whileHover={{ scale: 1.05 }}
            className="w-full p-4 bg-white/20 backdrop-blur-xl rounded-2xl font-bold text-lg text-white shadow-xl hover:bg-white/30"
          >
            Nowa Gra ➡️
          </motion.button>
          <motion.button
            onClick={onComplete}
            whileHover={{ scale: 1.05 }}
            className="w-full p-4 bg-white text-emerald-600 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl"
          >
            Wróć do Gier 🎮
          </motion.button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-[500px] p-8 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="text-center mb-8 p-6 bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-indigo-200">
        <h2 className="text-3xl font-black mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          🧠 Open Trivia Challenge
        </h2>
        <div className="flex gap-6 justify-center items-center text-lg font-semibold text-gray-700">
          <span className="px-3 py-1 bg-indigo-100 rounded-full text-sm">Pytanie {current + 1}/20</span>
          <span className="text-emerald-600 font-black">Streak: {streak}x</span>
          <span className="text-orange-600 font-black">{score} EXP</span>
        </div>
        <div className="text-sm text-gray-500 mt-2">{q.category}</div>
      </div>

      {/* Question Card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="flex-1 mb-8 p-8 bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border-4 border-indigo-200 flex items-center justify-center"
      >
        <h3 className="text-2xl font-bold text-gray-800 text-center leading-relaxed max-w-4xl mx-auto">
          {q.question}
        </h3>
      </motion.div>

      {/* Answer Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {q.options.map((option, i) => (
          <motion.button
            key={i}
            onClick={() => answer(i)}
            whileHover={{ scale: 1.03, y: -3 }}
            whileTap={{ scale: 0.97 }}
            className="group relative p-6 rounded-2xl font-bold text-lg shadow-xl transition-all duration-300
              bg-gradient-to-r from-white via-gray-50 to-indigo-50 hover:from-indigo-50 hover:to-purple-50
              border-4 border-gray-200 hover:border-indigo-400 hover:shadow-2xl active:scale-98 active:shadow-3xl
              flex items-center justify-center min-h-[80px] text-left overflow-hidden"
          >
            <span className="relative z-10 text-gray-800">{option}</span>
            {/* Subtelny glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 rounded-2xl 
                           opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.button>
        ))}
      </div>
    </div>
  )
}
