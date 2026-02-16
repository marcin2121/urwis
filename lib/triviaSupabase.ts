import { createClient } from '@/utils/supabase/server'
import type { TriviaQuestion } from './triviaApi' // zachowaj TS

// 🔥 Bezpośrednio z Twojej tabeli!
export async function getTriviaQuestions(amount = 20) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('trivia_questions')
    .select('id,question,options,correct,exp,category')
    .eq('isactive', true)
    .order('random()')
    .limit(amount)

  if (error || !data?.length) return []

  // Parse CSV options → array ["op1","op2","op3","op4"]
  return data.map(q => ({
    ...q,
    options: q.options.split(',').map(o => o.trim())
  })) as TriviaQuestion[]
}
