import QuizDashboard from '@/components/QuizDashboard'
import { createClient } from '@/lib/supabase/server'

async function getData() {
  const supabase = await createClient()

  const [{ data: leaderboard }, { count: categoriesCount }] = await Promise.all([
    supabase.from('quiz_leaderboard').select('*').limit(20),
    supabase.from('trivia_questions').select('id', { count: 'exact', head: true }).eq('is_active', true)
  ])

  return { initialLeaderboard: leaderboard || [], categoriesCount: categoriesCount || 0 }
}

export default async function QuizPage() {
  const data = await getData()

  return <QuizDashboard {...data} />
}
