import QuizDashboard from '@/components/QuizDashboard'
import { getLeaderboard, getCategories } from '@/lib/quiz'  // ✅ Użyj shared lib!

export default async function QuizPage() {
  // 🔄 Parallel RSC fetch (optymalne!)
  const [{ data: leaderboard }, { data: categories }] = await Promise.all([
    getLeaderboard(20),     // top 20 z VIEW
    getCategories()         // kategorie count
  ])

  // Format dla Dashboard
  const initialLeaderboard = leaderboard.map((p, i) => ({
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
