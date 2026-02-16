// lib/quiz-server.ts – RSC ONLY (app/quiz/page.tsx)
import { createClient } from '@/lib/supabase/server'

export type TriviaQuestion = {
  id: number
  question: string
  options: string[]
  correct: number
  exp: number
  category: string
}

export async function getCategories(): Promise<string[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('trivia_questions')
    .select('category')
    .eq('is_active', true)
    .order('category')
  return [...new Set((data || []).map((q: any) => q.category))]
}

export async function getLeaderboard(limit = 20): Promise<{ user_id: string; total_exp: number }[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('quiz_leaderboard')
    .select('user_id, total_exp')
    .order('total_exp', { ascending: false })
    .limit(limit)
  return data as { user_id: string; total_exp: number }[] || []
}
