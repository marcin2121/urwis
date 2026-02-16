// lib/quiz.ts – Urwis Quiz System (Server + Client safe)
import type { SupabaseClient } from '@supabase/supabase-js'

// INTERFEJSY (jedne!)
interface SupabaseQuestion {
  id: number;
  question: string;
  options: string;  // CSV z DB
  correct: number;
  exp: number;
  category: string;
  is_active: boolean;
}

export type TriviaQuestion = Omit<SupabaseQuestion, 'options'> & {
  options: string[];
};

// SUPABASE HELPER (dynamic RSC/Client)
async function getSupabaseClient(): Promise<SupabaseClient> {
  if (typeof window === 'undefined') {
    // RSC/Server
    const { createClient } = await import('@/lib/supabase/server');
    return await createClient();
  } else {
    // Client
    const { createClient } = await import('@/lib/supabase/client');
    return createClient()!;
  }
}

// 🏆 KATEGORIE
export async function getCategories(): Promise<string[]> {
  const supabase = await getSupabaseClient();
  const { data } = await supabase
    .from('trivia_questions')
    .select('category')
    .eq('is_active', true)
    .order('category');
  return [...new Set((data || []).map((q: any) => q.category))];
}

// 🎲 LOSOWE PYTANIA
export async function getRandomQuestions(
  category?: string,
  count = 10
): Promise<TriviaQuestion[]> {
  const supabase = await getSupabaseClient();
  let query = supabase
    .from('trivia_questions')
    .select('id,question,options,correct,exp,category,is_active')
    .eq('is_active', true)
    .order('random()')
    .limit(count);

  if (category && category !== 'mixed') {
    query = query.eq('category', category);
  }

  const { data } = await query;
  return (data as SupabaseQuestion[] || [])
    .map((q): TriviaQuestion => ({
      id: q.id,
      question: q.question,
      options: q.options.split(',').map((o: string) => o.trim()),
      correct: q.correct,
      exp: q.exp,
      category: q.category,
      is_active: q.is_active,
    }));
}

// 📅 DAILY QUESTION
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

// 🥇 LEADERBOARD
export async function getLeaderboard(limit = 10): Promise<{ user_id: string; total_exp: number }[]> {
  const supabase = await getSupabaseClient();
  const { data } = await supabase
    .from('quiz_leaderboard')
    .select('user_id, total_exp')
    .order('total_exp', { ascending: false })
    .limit(limit);
  return data as { user_id: string; total_exp: number }[] || [];
}
