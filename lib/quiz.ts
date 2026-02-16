import type { Database } from '@/types/supabase'; // generated types!

export type TriviaQuestion = Database['public']['Tables']['trivia_questions']['Row'] & {
  options: string[]; // parsed
};

export async function getCategories(): Promise<string[]> {
  let supabase;

  // RSC path
  if (typeof window === 'undefined') {
    const { createClient } = await import('@/lib/supabase/server');
    supabase = await createClient();
  } else {
    // Client path
    const { createClient } = await import('@/lib/supabase/client');
    supabase = createClient();
  }

  const { data } = await supabase
    .from('trivia_questions')
    .select('category')
    .eq('is_active', true)
    .order('category');

  return [...new Set((data || []).map((q: any) => q.category))];
}

// Reszta funkcji IDENTYCZNE (tylko ten sam dual pattern)
export async function getRandomQuestions(category?: string, count = 10): Promise<TriviaQuestion[]> {
  let supabase;
  if (typeof window === 'undefined') {
    const { createClient } = await import('@/lib/supabase/server');
    supabase = await createClient();
  } else {
    const { createClient } = await import('@/lib/supabase/client');
    supabase = createClient();
  }

  let query = supabase
    .from('trivia_questions')
    .select('id,question,options,correct,exp,category')
    .eq('is_active', true)
    .order('random()')
    .limit(count);

  if (category && category !== 'mixed') {
    query = query.eq('category', category);
  }

  const { data } = await query;
  return (data || []).map((q): TriviaQuestion => ({
    ...q,
    options: typeof q.options === 'string' ? q.options.split(',').map((o: string) => o.trim()) : q.options,
  }));
}


export async function getDailyQuestion(userId: string): Promise<TriviaQuestion | null> {
  const supabase = await createClient()
  const today = new Date().toISOString().slice(0, 10)

  const { data } = await supabase
    .from('quiz_sessions')
    .select('id')
    .eq('user_id', userId)
    .eq('mode', 'daily')
    .gte('played_at', today)
    .single()

  if (data) return null // już zrobione dzisiaj

  const questions = await getRandomQuestions('mixed', 1)  // ✅ AWAIT!
  return questions[0] || null  // ✅ Type-safe!
}

export async function getRandomQuestions(category?: string, count = 10): Promise<TriviaQuestion[]> {
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
    category: q.category
  }))
}

export type { TriviaQuestion }