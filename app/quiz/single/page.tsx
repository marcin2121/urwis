'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext'
import { useSupabaseLoyalty } from '@/contexts/SupabaseLoyaltyContext'

type TriviaQuestion = {
  id: number
  question: string
  options: string[]
  correct: number
  exp: number
  category: string
}

export default function SinglePlayerQuiz() {
  const supabase = createClient()
  const { user } = useSupabaseAuth()
  const { addExp } = useSupabaseLoyalty()

  const [current, setCurrent] = useState(0)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('mixed')
  const [questions, setQuestions] = useState<TriviaQuestion[]>([])
  const [loading, setLoading] = useState(true)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [nextDisabled, setNextDisabled] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Preload audio
  useEffect(() => {
    const correctAudio = new Audio('/sounds/correct.mp3')
    const wrongAudio = new Audio('/sounds/wrong.mp3')
    audioRef.current = correctAudio
  }, [])

  // Load questions
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

      if (error || !data?.length) {
        console.error('Error or no questions:', error)
        setLoading(false)
        return
      }

      setQuestions(data.map((q: any) => ({
        ...q,
        options: Array.isArray(q.options) ? q.options : JSON.parse(q.options)
      })))
      setLoading(false)
    }

    fetchQuestions()
  }, [selectedCategory])

  const saveSession = async (finalScore: number, maxStreak: number) => {
    if (!user?.id) return

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

    await addExp(finalScore, `Quiz Single - ${selectedCategory}`)
  }

  const answer = useCallback(async (index: number) => {
    const q = questions[current]
    if (!q || nextDisabled) return

    setNextDisabled(true)
    const isCorrect = index === q.correct
    setFeedback(isCorrect ? 'correct' : 'wrong')

    // Audio feedback
    const audio = audioRef.current
    if (audio && isCorrect) {
      audio.currentTime = 0
      audio.play().catch(() => { })
    }

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

    // Feedback delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    setFeedback(null)
    setNextDisabled(false)

    if (current + 1 < questions.length) {
      setCurrent(c => c + 1)
    } else {
      setGameOver(true)
      saveSession(newScore, Math.max(newStreak, streak))
    }
  }, [current, questions, score, streak, nextDisabled])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-8 pt-24">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="text-8xl"
        >
          ⚡
        </motion.div>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex flex-col items-center justify-center p-8 pt-24 space-y-6">
        <div className="text-8xl mb-8">😢</div>
        <h2 className="text-4xl font-black mb-4 text-gray-800">Brak pytań!</h2>
        <Link
          href="/quiz"
          className="px-12 py-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-3xl font-bold text-xl shadow-2xl hover:scale-105 transition-all"
        >
          ← Wróć do Dashboard
        </Link>
      </div>
    )
  }

  const q = questions[current]

  return (
    <>
      {/* Fixed navbar padding */}
      <div className="pt-20 pb-8" />

      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
        {!gameOver ? (
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Category + Back */}
            <div className="flex items-center justify-between">
              <Link href="/quiz" className="flex items-center gap-3 text-xl font-bold text-purple-600 hover:text-purple-700 p-4 -m-4 rounded-2xl hover:bg-purple-100 transition-all">
                ← Dashboard
              </Link>
              <select
                value={selectedCategory}
                onChange={e => {
                  setSelectedCategory(e.target.value)
                  setCurrent(0)
                  setScore(0)
                  setStreak(0)
                  setGameOver(false)
                }}
                className="px-6 py-4 bg-white/90 backdrop-blur rounded-3xl shadow-xl border-4 border-indigo-200 text-xl font-bold cursor-pointer hover:border-indigo-400 transition-all"
              >
                <option value="mixed">🎲 Mieszane ({questions.length})</option>
                <option value="🗺️ Geografia">🌍 Geografia</option>
                <option value="🏛️ Historia">📜 Historia</option>
                <option value="➗ Matematyka">🔢 Matematyka</option>
                <option value="⚽ Sport">⚽ Sport</option>
                <option value="🔬 Nauka">🧪 Nauka</option>
              </select>
            </div>

            {/* Progress Bar */}
            <motion.div
              className="p-6 bg-white/70 backdrop-blur rounded-3xl shadow-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-2xl font-black">
                  Pytanie <span className="text-purple-600">{current + 1}</span> / {questions.length}
                </div>
                <div className="text-2xl font-bold flex items-center gap-4">
                  <span className="text-orange-600">{score} EXP</span>
                  <span className="text-emerald-600">
                    Seria: <span className="text-2xl">{streak}x</span> 🔥
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <motion.div
                  className="bg-gradient-to-r from-emerald-400 to-orange-500 h-4 rounded-full shadow-lg"
                  initial={{ width: 0 }}
                  animate={{ width: `${((current + 1) / questions.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </motion.div>

            {/* Question */}
            <motion.div
              key={current}
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="p-12 bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl text-center border-4 border-white/50"
            >
              <motion.h2
                className="text-3xl md:text-4xl lg:text-5xl font-black mb-8 leading-tight"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                {q.question}
              </motion.h2>
              <div className="text-2xl font-bold px-6 py-3 bg-purple-100 text-purple-800 rounded-2xl inline-block">
                {q.category}
              </div>
            </motion.div>

            {/* Answers + FEEDBACK */}
            <AnimatePresence mode="wait">
              <motion.div
                key={feedback || 'answers'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              >
                {q.options.map((option: string, i: number) => (
                  <motion.button
                    key={i}
                    onClick={() => answer(i)}
                    whileHover={{ scale: 1.02, y: -3 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={nextDisabled}
                    className={`
                      group relative p-10 rounded-3xl font-bold text-xl shadow-2xl text-left min-h-[140px] flex items-center overflow-hidden transition-all duration-300
                      ${feedback === null
                        ? 'bg-gradient-to-r from-indigo-50 via-white to-purple-50 hover:from-indigo-100 hover:to-purple-100 border-4 border-indigo-200 hover:border-indigo-400 hover:shadow-3xl text-gray-800 hover:text-gray-900'
                        : feedback === 'correct' && i === q.correct
                          ? 'bg-gradient-to-r from-emerald-400 to-emerald-600 border-4 border-emerald-400 shadow-emerald-500/50 scale-105 shadow-3xl text-white animate-bounce'
                          : feedback === 'wrong' && i === q.correct
                            ? 'bg-gradient-to-r from-emerald-400/80 to-emerald-500/80 border-4 border-emerald-300 shadow-emerald-300/50 text-emerald-900 font-black scale-105'
                            : feedback === 'wrong'
                              ? 'bg-gradient-to-r from-red-100 to-rose-100 border-4 border-red-300 opacity-50 scale-[0.97]'
                              : 'bg-gradient-to-r from-emerald-400/60 to-emerald-500/60 border-4 border-emerald-300 shadow-emerald-300/50 text-emerald-900 font-black scale-105'
                      }
                    `}
                  >
                    <span className="text-5xl font-black mr-8 z-10 group-hover:text-indigo-700">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="relative z-10 leading-relaxed">{option}</span>

                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-1000 opacity-0 group-hover:opacity-100" />
                  </motion.button>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Next Question Hint */}
            {feedback && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center p-6 bg-gradient-to-r from-emerald-50 to-orange-50 border-4 border-emerald-200 rounded-3xl"
              >
                <div className={`text-6xl mb-4 ${feedback === 'correct' ? 'text-emerald-600 animate-bounce' : 'text-red-600'}`}>
                  {feedback === 'correct' ? '✅' : '❌'}
                </div>
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="text-2xl font-black"
                >
                  {feedback === 'correct' ? `+${questions[current].exp * Math.min(streak + 1, 3)} EXP!` : 'Spróbuj następnym razem!'}
                </motion.div>
              </motion.div>
            )}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-4xl mx-auto text-center py-24 space-y-12 pt-32"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
              transition={{ duration: 1, repeat: 1 }}
              className="text-9xl mb-8"
            >
              🏆
            </motion.div>
            <motion.h2
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="text-6xl lg:text-7xl font-black bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-600 bg-clip-text text-transparent mb-8"
            >
              FENOMENALNIE!
            </motion.h2>
            <div className="space-y-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-7xl font-black text-emerald-600 drop-shadow-2xl mb-8"
              >
                {score} EXP
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl text-yellow-500 font-bold"
              >
                Najlepsza seria: {streak}x 🔥
              </motion.div>
            </div>
            <div className="flex flex-col lg:flex-row gap-6 justify-center pt-16 border-t-8 border-emerald-200/50">
              <Link
                href="/quiz"
                className="px-16 py-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-3xl font-black text-2xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all"
              >
                🏠 Leaderboard
              </Link>
              <button
                onClick={() => window.location.reload()}
                className="px-16 py-8 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-3xl font-black text-2xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all"
              >
                🔄 Nowa Gra!
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </>
  )
}
