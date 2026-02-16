import { createClient } from '@/lib/supabase/server'  // ✅ Twoja ścieżka!

export async function getCategories() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('trivia_questions')
    .select('category')
    .eq('is_active', true)
    .order('category')

  return [...new Set(data?.map((q: any) => q.category) || [])]
}

export async function getRandomQuestions(category?: string, count = 10) {
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
  return data?.map((q: any) => ({
    id: q.id,
    question: q.question,
    options: q.options.split(',').map((o: string) => o.trim()),
    correct: q.correct,
    exp: q.exp,
    category: q.category
  })) || []
}
