'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext'

interface TriviaQuestion {
  question: string
  options: string[]
  correct: number
  exp: number
  category: string
}

const GENERAL_QUESTIONS: TriviaQuestion[] = [
  // GEOGRAFIA (15 pytań)
  { question: "Stolica Polski?", options: ["Kraków", "Warszawa", "Gdańsk"], correct: 1, exp: 15, category: "🗺️ Geografia" },
  { question: "Największy ocean?", options: ["Atlantycki", "Indyjski", "Spokojny"], correct: 2, exp: 20, category: "🗺️ Geografia" },

  // HISTORIA (15 pytań)
  { question: "Rok odzyskania niepodległości?", options: ["1918", "1945", "966"], correct: 0, exp: 25, category: "🏛️ Historia" },
  { question: "Pierwszy król Polski?", options: ["Bolesław Chrobry", "Mieszko I", "Kazimierz Wielki"], correct: 1, exp: 20, category: "🏛️ Historia" },

  // NAUKA (10 pytań)
  { question: "Kto wynalazł telefon?", options: ["Edison", "Bell", "Tesla"], correct: 1, exp: 30, category: "🔬 Nauka" },

  // KULTURA (5 pytań)
  { question: "Autor 'Pana Tadeusza'?", options: ["Sienkiewicz", "Mickiewicz", "Miłosz"], correct: 1, exp: 25, category: "🎨 Kultura" },

  // SPORT (5 pytań)
  { question: "Piłka nożna - graczy w polu?", options: ["9", "10", "11"], correct: 2, exp: 15, category: "⚽ Sport" },
]

export default function TriviaGeneralGame({ onComplete }: { onComplete: () => void }) {
  const { profile } = useSupabaseAuth()
  const [current, setCurrent] = useState(0)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [gameOver, setGameOver] = useState(false)

  const q = GENERAL_QUESTIONS[current]

  const answer = (index: number) => {
    const isCorrect = index === q.correct
    const exp = isCorrect ? q.exp * Math.min(streak + 1, 5) : 0  // max x5 streak

    if (isCorrect) {
      setScore(s => s + exp)
      setStreak(s => s + 1)
    } else {
      setStreak(0)
    }

    setTimeout(() => {
      if (current + 1 < GENERAL_QUESTIONS.length && !gameOver) {
        setCurrent(c => c + 1)
      } else {
        setGameOver(true)
        // Zapisz EXP do profilu
        if (profile && score > 0) {
          console.log(`🎉 +${score} EXP za Wiedzę Ogólną! Streak: ${streak}`)
        }
      }
    }, 1200)
  }

  if (gameOver) {
    return (
      <div className="w-full h-[500px] flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl">
        <motion.div animate={{ scale: [1, 1.2, 1] }} className="text-6xl mb-6">🏆</motion.div>
        <h2 className="text-3xl font-black text-white mb-4">Gratulacje!</h2>
        <p className="text-xl text-emerald-100 mb-8">Zdobyłeś <strong>{score} EXP</strong></p>
        <p className="text-lg text-white/90 mb-8">Streak: <strong>{streak}x</strong></p>
        <motion.button
          onClick={onComplete}
          whileHover={{ scale: 1.05 }}
          className="px-8 py-4 bg-white text-emerald-600 rounded-2xl font-bold text-lg shadow-2xl"
        >
          Wróć do Gier 🎮
        </motion.button>
      </div>
    )
  }

  return (
    <div className="w-full h-[500px] p-8 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="text-center mb-8 p-4 bg-white/60 backdrop-blur rounded-2xl">
        <h2 className="text-2xl font-black mb-2 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
          Wiedza Ogólna
        </h2>
        <div className="flex gap-4 justify-center text-sm">
          <span>Progres: {current + 1}/{GENERAL_QUESTIONS.length}</span>
          <span>Streak: <span className="font-bold text-emerald-600">{streak}x</span></span>
          <span>EXP: <span className="font-bold text-orange-600">{score}</span></span>
        </div>
      </div>

      {/* Category badge */}
      <div className="text-center mb-6">
        <span className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-bold rounded-full">
          {q.category}
        </span>
      </div>

      {/* Question */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 p-6 bg-white rounded-2xl shadow-lg border-2 border-purple-100"
      >
        <h3 className="text-xl font-semibold text-gray-800 mb-6 leading-relaxed">
          {q.question}
        </h3>
      </motion.div>

      {/* Answers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
        {q.options.map((option, i) => (
          <motion.button
            key={i}
            onClick={() => answer(i)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="p-6 rounded-xl font-bold text-lg border-4 shadow-lg transition-all hover:shadow-xl
              bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200
              border-gray-300 hover:border-purple-300 active:border-purple-500"
          >
            {option}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
