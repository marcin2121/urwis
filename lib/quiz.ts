interface SupabaseRow {
  id: number;
  question: string;
  options: string;
  correct: number;
  exp: number;
  category: string;
  is_active: boolean;
}

export type TriviaQuestion = SupabaseRow & { options: string[] };

async function getSupabaseClient(): Promise<any> {
  if (typeof window === 'undefined') {
    const { createClient } = await import('@/lib/supabase/server');
    return await createClient();
  } else {
    const { createClient } = await import('@/lib/supabase/client');
    return createClient()!;
  }
}

export async function getCategories(): Promise<string[]> {
  const supabase = await getSupabaseClient();
  const { data } = await supabase
    .from('trivia_questions')
    .select('category')
    .eq('is_active', true)
    .order('category');
  return [...new Set((data as any[]).map((q: any) => q.category))];
}

export async function getRandomQuestions(category?: string, count = 10): Promise<TriviaQuestion[]> {
  const supabase = await getSupabaseClient();
  let query = supabase
    .from('trivia_questions')
    .select('id,question,options,correct,exp,category')
    .eq('is_active', true)
    .order('random()')
    .limit(count);

  if (category && category !== 'mixed') query = query.eq('category', category);

  const { data } = await query;
  return (data || []).map((q: SupabaseRow): TriviaQuestion => ({
    ...q,
    options: (q.options as string).split(',').map((o: string) => o.trim()),
  }));
}

export async function getDailyQuestion(userId: string): Promise<TriviaQuestion | null> {
  const supabase = await getSupabaseClient();
  const today = new Date().toISOString().slice(0, 10);

  const { data: session } = await supabase
    .from('quiz_sessions')
    .select('id')
    .eq('user_id', userId)
    .eq('mode', 'daily')
    .gte('played_at', today)
    .single();

  if (session) return null;
  const questions = await getRandomQuestions('mixed', 1);
  return questions[0] || null;
}

export async function getLeaderboard(limit = 10): Promise<{ user_id: string; total_exp: number }[]> {
  const supabase = await getSupabaseClient();
  const { data } = await supabase
    .from('quiz_leaderboard')
    .select('user_id, total_exp')
    .order('total_exp', { ascending: false })
    .limit(limit);
  return data as { user_id: string; total_exp: number }[];
}

// NIE ma duplikat export type!
