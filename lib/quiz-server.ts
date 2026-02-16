import { createClient } from '@/lib/supabase/server'

export type TriviaQuestion = {
  id: number
  question: string
  options: string[]
  correct: number
  exp: number
  category: string
}

export async function getCategories() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('trivia_questions')
    .select('category')
    .eq('is_active', true)
    .order('category')
  return [...new Set((data || []).map((q: any) => q.category))]
}

export async function getLeaderboard(limit = 10) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('quiz_leaderboard')
    .select('user_id, total_exp')
    .order('total_exp', { ascending: false })
    .limit(limit)
  return data as any || []
}
