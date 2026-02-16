'use client'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getTriviaQuestions } from '@/lib/triviaSupabase'
import { FALLBACK_QUESTIONS, type TriviaQuestion } from '@/lib/triviaApi'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs' // dla EXP!

export default function TriviaGeneralGame({ onComplete }: { onComplete: () => void }) {
  const supabase = createClientComponentClient()
  const [current, setCurrent] = useState(0)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [gameOver, setGameOver] = useState(false)

  // 🔥 TWOJA CZĘŚĆ + types!
  const { data: questions = [] } = useQuery<TriviaQuestion[]>({
    queryKey: ['trivia-general'],
    queryFn: () => getTriviaQuestions(20),
  })

  const finalQuestions: TriviaQuestion[] = questions.length
    ? questions
    : FALLBACK_QUESTIONS.slice(0, 20)

  const q = finalQuestions[current]

  // Reszta Twojego kodu (answer, JSX)...
  const answer = async (index: number) => {
    const isCorrect = index === q.correct
    const exp = isCorrect ? q.exp * Math.min(streak + 1, 5) : 0

    if (isCorrect) {
      setScore(s => s + exp)
      setStreak(s => s + 1)

      // 💾 Zapisz EXP!
      await supabase.rpc('add_user_exp', { amount: exp })
    } else {
      setStreak(0)
    }

    // next question...
  }

  if (!q) return <div>Ładuję... 🧠</div> // safety

  // ... reszta Twojego JSX z q.question, q.options etc.
}
