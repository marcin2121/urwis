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

export async function getRandomQuestions(category?: string, count = 20): Promise<TriviaQuestion[]> {
  const supabase = await createClient()
  let query = supabase
    .from('trivia_questions')
    .select('id,question,options,correct,exp,category')
    .eq('is_active', true)
    .order('random()')
    .limit(count)

  if (category && category !== 'mixed') {
    query = query.eq('category', category)
  }

  const { data } = await query
  return (data || []).map((q: any): TriviaQuestion => ({
    id: q.id,
    question: q.question,
    options: q.options.split(',').map((o: string) => o.trim()),
    correct: q.correct,
    exp: q.exp,
    category: q.category,
  }))
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
