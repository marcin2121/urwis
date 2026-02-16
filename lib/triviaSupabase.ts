import { createClient } from '@/lib/supabase/server'
import type { TriviaQuestion } from '@/lib/triviaApi'

export async function getTriviaQuestions(amount = 20): Promise<TriviaQuestion[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('trivia_questions')
    .select('id,question,options,correct,exp,category')
    .eq('isactive', true)
    .order('random()')
    .limit(amount)

  if (error || !data?.length) return []

  return data.map((q: any) => ({
    id: q.id,
    question: q.question.trim(),
    options: q.options.split(',').map((o: string) => o.trim()),
    correct: q.correct,
    exp: q.exp,
    category: q.category.trim()
  })) as TriviaQuestion[]
}
