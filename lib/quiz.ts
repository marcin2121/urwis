// lib/quiz.ts – Urwis Quiz System (16.02.2026)
/**
 * Shared quiz functions – dynamic server/client Supabase
 * Best practices: RSC props → client, RLS, typesafe
 */

interface SupabaseRow {
  id: number;
  question: string;
  options: string;  // CSV: "Opcja1,Opcja2,Opcja3"
  correct: number;  // index poprawnej (0-based)
  exp: number;
  category: string;
  is_active: boolean;
}

export type TriviaQuestion = SupabaseRow & {
  options: string[];  // parsed array
};

// 🔧 SUPABASE HELPER (RSC + Client safe)
async function getSupabaseClient(): Promise<any> {
  if (typeof window === 'undefined') {
    // Server Component
    const { createClient } = await import('@/lib/supabase/server');
    return await createClient();
  } else {
    // Client Component
    const { createClient } = await import('@/lib/supabase/client');
    return createClient()!;
  }
}

// 🏆 GET CATEGORIES (Geografia, Matematyka...)
export async function getCategories(): Promise<string[]> {
  const supabase = await getSupabaseClient();
  const { data } = await supabase
    .from('trivia_questions')
    .select('category')
    .eq('is_active', true)
    .order('category');
  return [...new Set((data || []).map((q: any) => q.category))];
}

// 🎲 RANDOM QUESTIONS (kategoria lub mixed)
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
  return (data || []).map((q): TriviaQuestion => ({
    ...q,
    options: typeof q.options === 'string'
      ? q.options.split(',').map((o: string) => o.trim())
      : [],
  }));
}

// 📅 DAILY QUESTION (jedno na dzień per user)
export async function getDailyQuestion(userId: string): Promise<TriviaQuestion | null> {
  const supabase = await getSupabaseClient();
  const today = new Date().toISOString().slice(0, 10);

  // Sprawdź czy już zrobione dzisiaj
  const { data: session } = await supabase
    .from('quiz_sessions')
    .select('id')
    .eq('user_id', userId)
    .eq('mode', 'daily')
    .gte('played_at', today)
    .single();

  if (session) return null;

  // Nowe pytanie
  const questions = await getRandomQuestions('mixed', 1);
  return questions[0] || null;
}

// 🥇 LEADERBOARD TOP 10 (nowe!)
export async function getLeaderboard(limit = 10): Promise<{ user_id: string; total_exp: number }[]> {
  const supabase = await getSupabaseClient();
  const { data } = await supabase
    .from('quiz_leaderboard')  // VIEW z status.md
    .select('user_id, total_exp')
    .order('total_exp', { ascending: false })
    .limit(limit);
  return data || [];
}

export type { TriviaQuestion };
