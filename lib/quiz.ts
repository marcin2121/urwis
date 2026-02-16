import type { Database } from '../types/supabase'; // fix ścieżka!

export type TriviaQuestion = Database['public']['Tables']['trivia_questions']['Row'] & {
  options: string[]; // parsed CSV
};

// UTILITY: helper do clienta (używa dynamic import)
async function getSupabaseClient() {
  if (typeof window === 'undefined') {
    // RSC
    const { createClient } = await import('@/lib/supabase/server');
    return await createClient();
  } else {
    // Client
    const { createClient } = await import('@/lib/supabase/client');
    return createClient();
  }
}

export async function getCategories(): Promise<string[]> {
  const supabase = await getSupabaseClient()!;
  const { data } = await supabase
    .from('trivia_questions')
    .select('category')
    .eq('is_active', true)
    .order('category');

  return [...new Set((data || []).map((q: any) => q.category))];
}

export async function getRandomQuestions(category?: string, count = 10): Promise<TriviaQuestion[]> {
  const supabase = await getSupabaseClient()!;
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
    options: typeof q.options === 'string' ?
      q.options.split(',').map((o: string) => o.trim()) :
      q.options || [],
  }));
}

export async function getDailyQuestion(userId: string): Promise<TriviaQuestion | null> {
  const supabase = await getSupabaseClient()!;
  const today = new Date().toISOString().slice(0, 10);

  const { data: session } = await supabase
    .from('quiz_sessions')
    .select('id')
    .eq('user_id', userId)
    .eq('mode', 'daily')
    .gte('played_at', today)
    .single();

  if (session) return null; // już zrobione dzisiaj

  const questions = await getRandomQuestions('mixed', 1);
  return questions[0] || null;
}
