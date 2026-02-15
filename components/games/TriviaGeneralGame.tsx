'use client'
import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext'
import { fetchTriviaQuestions, TriviaQuestion, CATEGORIES } from '@/lib/triviaApi'

export default function TriviaCategoryGame({ onComplete }: { onComplete: () => void }) {
  const { profile } = useSupabaseAuth()
  const [step, setStep] = useState<'categories' | 'game' | 'results'>('categories')
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [questions, setQuestions] = useState<TriviaQuestion[]>([])
  const [current, setCurrent] = useState(0)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [loading, setLoading] = useState(false)

  // Kategorie z mnożnikami EXP
  const categories = [
    { id: 9, name: '🧬 Biologia', expMultiplier: 1.2, icon: '🧬' },
    { id: 10, name: '📚 Książki', expMultiplier: 1.1, icon: '📚' },
    { id: 11, name: '🎬 Filmy', expMultiplier: 1.3, icon: '🎬' },
    { id: 12, name: '🎵 Muzyka', expMultiplier: 1.1, icon: '🎵' },
    { id: 17, name: '🌿 Nauka', expMultiplier: 1.4, icon: '🔬' },
    { id: 18, name: '💻 Komputery', expMultiplier: 1.5, icon: '💻' },
    { id: 19, name: '🔢 Matematyka', expMultiplier: 1.6, icon: '🔢' },
    { id: 21, name: '⚽ Sport', expMultiplier: 1.0, icon: '⚽' },
    { id: 22, name: '🗺️ Geografia', expMultiplier: 1.2, icon: '🗺️' },
    { id: 23, name: '🏛️ Historia', expMultiplier: 1.3, icon: '🏛️' },
    { id: 25, name: '🎨 Sztuka', expMultiplier: 1.4, icon: '🎨' },
    { id: 27, name: '🚗 Motoryzacja', expMultiplier: 1.1, icon: '🚗' },
    { id: 26, name: '🎲 Gry', expMultiplier: 1.2, icon: '🎮' },
  ]

  const loadQuestions = useCallback(async () => {
    if (!selectedCategory) return

    setLoading(true)
    const newQuestions = await fetchTriviaQuestions(15, selectedCategory, 'mixed')
    setQuestions(newQuestions)
    setCurrent(0)
    setScore(0)
    setStreak(0)
    setStep('game')
    setLoading(false)
  }, [selectedCategory])

  const answer = (index: number) => {
    const q = questions[current]
    const isCorrect = index === q.correct
    const multiplier = categories.find(c => c.id === selectedCategory)?.expMultiplier || 1
    const exp = isCorrect ? Math.floor(q.exp * multiplier * Math.min(streak + 1, 5)) : 0

    if (isCorrect) {
      setScore(s => s + exp)
      setStreak(s => s + 1)
    } else {
      setStreak(0)
    }

    setTimeout(() => {
      if (current + 1 < questions.length) {
        setCurrent(c => c + 1)
      } else {
        setStep('results')
      }
    }, 1400)
  }

  // === KROK 1: WYBIERZ KATEGORIĘ ===
  if (step === 'categories') {
    return (
      <div className="w-full h-[500px] p-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl overflow-y-auto">
        <div className="text-center mb-8">
          <motion.h2
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-3xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4"
          >
            🧠 Wybierz Kategorię
          </motion.h2>
          <p className="text-lg text-gray-600">Wybierz temat i zacznij zarabiać EXP!</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[350px] overflow-y-auto px-2">
          {categories.map((cat, i) => (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedCategory(cat.id)}
              className="group relative p-6 rounded-2xl bg-white shadow-lg hover:shadow-2xl border-4 border-transparent hover:border-indigo-300 transition-all overflow-hidden h-32 flex flex-col items-center justify-center text-center"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{cat.icon}</div>
              <h3 className="font-bold text-gray-800 text-lg leading-tight">{cat.name}</h3>
              <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-emerald-400 to-green-500 text-white px-3 py-1 rounded-tl-xl text-xs font-bold opacity-0 group-hover:opacity-100 transition-all">
                x{cat.expMultiplier}
              </div>
            </motion.button>
          ))}
        </div>

        <motion.button
          onClick={onComplete}
          whileHover={{ scale: 1.02 }}
          className="w-full mt-6 p-4 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl"
        >
          ← Wróć do Gier
        </motion.button>
      </div>
    )
  }

  // === KROK 2: GRA ===
  if (step === 'game' && questions.length > 0) {
    const q = questions[current]
    const cat = categories.find(c => c.id === selectedCategory)

    return (
      <div className="w-full h-[500px] p-6 overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl">
        {/* Header */}
        <div className="text-center mb-6 p-4 bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-indigo-200">
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="text-2xl">{cat?.icon}</span>
            <h2 className="text-xl font-black">{cat?.name}</h2>
          </div>
          <div className="flex gap-4 text-sm font-semibold text-gray-600">
            <span>Pytanie {current + 1}/{questions.length}</span>
            <span className="text-emerald-600">Streak: {streak}x</span>
            <span className="text-orange-600">EXP: {score}</span>
          </div>
        </div>

        {/* Question */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-1 flex flex-col justify-center p-6 bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border-4 border-indigo-100 mb-6 overflow-hidden"
        >
          <h3 className="text-xl font-bold text-gray-800 text-center leading-relaxed mb-8">
            {q.question}
          </h3>
        </motion.div>

        {/* Answers */}
        <div className="grid grid-cols-2 gap-3 px-2">
          {q.options.map((option, i) => (
            <motion.button
              key={i}
              onClick={() => answer(i)}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="group relative p-4 rounded-xl font-semibold text-base shadow-lg transition-all
                bg-gradient-to-r from-white via-gray-50 to-indigo-50 hover:from-indigo-50 hover:to-purple-50
                border-2 border-gray-200 hover:border-indigo-300 hover:shadow-xl active:shadow-2xl min-h-[70px]
                flex items-center justify-center text-left"
            >
              <span className="relative z-10">{option}</span>
            </motion.button>
          ))}
        </div>
      </div>
    )
  }

  // === KROK 3: WYNIKI ===
  return (
    <div className="w-full h-[500px] flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-emerald-500 via-green-500 to-emerald-600 rounded-2xl">
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        className="text-7xl mb-6"
      >
        🏆
      </motion.div>
      <h2 className="text-4xl font-black text-white mb-4 drop-shadow-lg">Mistrz Wiedzy!</h2>
      <div className="text-3xl text-emerald-100 mb-4 drop-shadow-lg">{score} EXP</div>
      <div className="text-2xl text-yellow-200 mb-8 drop-shadow-lg">Streak x{streak}</div>

      <div className="space-y-3 mb-8 text-white/90">
        <motion.button
          onClick={() => {
            setStep('categories')
            setSelectedCategory(null)
          }}
          whileHover={{ scale: 1.05 }}
          className="w-full max-w-sm p-4 bg-white/20 backdrop-blur-xl rounded-2xl font-bold text-lg shadow-xl hover:bg-white/30"
        >
          Nowa Kategoria ➡️
        </motion.button>
        <motion.button
          onClick={onComplete}
          whileHover={{ scale: 1.05 }}
          className="w-full max-w-sm p-4 bg-white text-emerald-600 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl"
        >
          Wróć do Gier 🎮
        </motion.button>
      </div>
    </div>
  )
}
