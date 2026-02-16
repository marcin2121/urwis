'use client'
import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useQuery, useMutation } from '@tanstack/react-query'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { getRandomQuestions } from '@/lib/quiz'
import type { TriviaQuestion } from '@/lib/quiz'

export default function SinglePlayerQuiz() {
  const supabase = createClientComponentClient()
  const [current, setCurrent] = useState(0)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('mixed')

  // 🔥 10 losowych pytań z Supabase
  const { data: questions = [] } = useQuery<TriviaQuestion[]>({
    queryKey: ['quiz-single', selectedCategory],
    queryFn: () => getRandomQuestions(selectedCategory, 10),
  })

  // 💾 Zapisz wynik do leaderboard
  const saveSession = useMutation({
    mutationFn: async (finalScore: number) => {
      const { error } = await supabase
        .from('quiz_sessions')
        .insert({
          mode: 'single',
          category: selectedCategory,
          questions_count: questions.length,
          score: finalScore,
          max_streak: streak,
          accuracy: Math.round((score / questions.length) * 100 * 100) / 100
        })
      if (error) throw error
    },
    onSuccess: () => {
      supabase.from('profiles').select('exp').eq('id', supabase.auth.getUser().data.user?.id)
    }
  })

  const answer = (index: number) => {
    const q = questions[current]
    if (!q) return

    const isCorrect = index === q.correct
    const exp = isCorrect ? q.exp * Math.min(streak + 1, 3) : 0 // streak bonus

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
        setGameOver(true)
        saveSession.mutate(score + exp) // final save!
      }
    }, 1200)
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity }}
          className="text-4xl"
        >
          Ładuję pytania... 🧠
        </motion.div>
      </div>
    )
  }

  const q = questions[current]

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        {/* Category Selector */}
        {!gameOver && (
          <div className="mb-12 text-center">
            <label className="text-2xl font-bold text-gray-800 mb-4 block">
              Wybierz kategorię:
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-8 py-4 bg-white rounded-3xl shadow-xl border-4 border-indigo-200 text-2xl font-bold text-gray-800 w-full max-w-md mx-auto"
            >
              <option value="mixed">🎲 Mieszane (wszystkie)</option>
              <option value="Geografia">🌍 Geografia</option>
              <option value="Historia">📜 Historia</option>
              <option value="Matematyka">🔢 Matematyka</option>
              <option value="Sport">⚽ Sport</option>
              <option value="Nauka">🔬 Nauka</option>
            </select>
          </div>
        )}

        {gameOver ? (
          /* Game Over Screen */
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-24"
          >
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1, repeat: 2 }}
              className="text-8xl mb-8"
            >
              🏆
            </motion.div>
            <h2 className="text-5xl font-black bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-8">
              Gratulacje!
            </h2>
            <div className="text-6xl font-black text-emerald-600 mb-8 drop-shadow-2xl">
              {score} EXP
            </div>
            <div className="text-3xl text-yellow-500 mb-12">
              Najlepszy streak: {streak}x 🔥
            </div>
            <div className="space-x-4">
              <Link
                href="/quiz"
                className="px-12 py-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-3xl font-black text-xl shadow-2xl hover:shadow-3xl inline-bl
