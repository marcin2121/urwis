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
                </
