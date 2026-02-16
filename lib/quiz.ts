export async function getCategories() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('trivia_questions')
    .select('category')
    .eq('is_active', true)
    .order('category')
  return [...new Set(data?.map((q: any) => q.category) || [])]
}
