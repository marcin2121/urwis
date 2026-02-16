// app/quiz/page.tsx – PERFECT RSC
import QuizDashboard from '@/components/QuizDashboard'
import { getLeaderboard, getCategories } from '@/lib/quiz'

interface LeaderboardPlayer {
  user_id: string
  total_exp: number
  rank: number
}

export default async function QuizPage() {
  const [leaderboardRaw, categories] = await Promise.all([
    getLeaderboard(20),  // array<{ user_id, total_exp }>
    getCategories()      // string[]
  ])

  // ✅ Type-safe map
  const initialLeaderboard: LeaderboardPlayer[] = leaderboardRaw.map((p: { user_id: string; total_exp: number }, i: number) => ({
    ...p,
    rank: i + 1
  }))

  return (
    <QuizDashboard
      initialCategoriesCount={categories.length}
    // NIE ma initialLeaderboard – fetch w client!
    />
  )
}
