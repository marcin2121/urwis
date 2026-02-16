// app/quiz/page.tsx – Pure RSC!
import QuizDashboard from '@/components/QuizDashboard'
import { getCategories, getLeaderboard } from '@/lib/quiz-server'  // server only!

interface LeaderboardPlayer {
  user_id: string
  total_exp: number
  rank: number
}

export default async function QuizPage() {
  const [categories, leaderboardRaw] = await Promise.all([
    getCategories(),
    getLeaderboard(20)
  ])

  const initialLeaderboard: LeaderboardPlayer[] = leaderboardRaw.map((p: any, i: number) => ({
    ...p,
    rank: i + 1
  }))

  return (
    <QuizDashboard
      initialLeaderboard={initialLeaderboard}
      categoriesCount={categories.length}
    />
  )
}
