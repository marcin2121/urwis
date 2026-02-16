interface SupabaseQuestion {
  id: number;
  question: string;
  options: string;  // CSV w DB
  correct: number;
  exp: number;
  category: string;
  is_active: boolean;
}

export type TriviaQuestion = Omit<SupabaseQuestion, 'options'> & {
  options: string[];  // parsed array
};

// 🔧 UNIVERSAL CLIENT HELPER (RSC + Client safe)
async function getSupabaseClient(): Promise<any> {
  if (typeof window === 'undefined') {
    // Server Component
    const { createClient } = await import('@/lib/supabase/server');
    return await createClient();
  } else {
    // Client Component  
    const { createClient } = await import('@/lib/supabase/client');
    return createClient();
  }
}

// 🏆 KATEGORIE (Geografia, Matematyka...)
export async function getCategories(): Promise<string[]> {
  const supabase = await getSupabaseClient();
  const { data } = await supabase
    .from('trivia_questions')
    .select('category')
    .eq('is_active', true)
    .order('category');
  return [...new Set((data || []).map((q: any) => q.category))];
}

// 🎲 LOSOWE PYTANIA (kategoria/mixed)
export async function getRandomQuestions(
  category?: string,
  count = 10
): Promise<TriviaQuestion[]> {
  const supabase = await getSupabaseClient();
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
  return (data || []).map((q: SupabaseQuestion): TriviaQuestion => ({
    id: q.id,
    question: q.question,
    options: q.options.split(',').map((o: string) => o.trim()),  // CSV → array
    correct: q.correct,
    exp: q.exp,
    category: q.category,
  }));
}

// 📅 DAILY QUESTION (1/dzień/user)
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

  if (session) return null;  // już odebrane

  const questions = await getRandomQuestions('mixed', 1);
  return questions[0] || null;
}

// 🥇 LEADERBOARD (bonus z SQL VIEW)
export async function getLeaderboard(limit = 10): Promise<{ user_id: string; total_exp: number }[]> {
  const supabase = await getSupabaseClient();
  const { data } = await supabase
    .from('quiz_leaderboard')
    .select('user_id, total_exp')
    .order('total_exp', { ascending: false })
    .limit(limit);
  return data || [];
}
