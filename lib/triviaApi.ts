// Open Trivia Database API + lokalna cache
const TRIVIA_API_BASE = 'https://opentdb.com/api.php'

// Typy odpowiedzi API
export interface OpenTriviaQuestion {
  category: string
  type: string
  difficulty: string
  question: string
  correct_answer: string
  incorrect_answers: string[]
}

export interface TriviaApiResponse {
  response_code: number
  results: OpenTriviaQuestion[]
}

// Konfiguracja kategorii (filtrowanie + polskie nazwy)
export const CATEGORIES = {
  9: '🧬 Biologia',
  10: '📚 Książki',
  11: '🎬 Filmy',
  12: '🎵 Muzyka',
  17: '🛡️ Nauka i Natura',
  18: '🖥️ Komputery',
  19: '🏛️ Matematyka',
  20: '🏆 Mythologia',
  21: '⚽ Sport',
  22: '🗺️ Geografia',
  23: '🏛️ Historia',
  25: '🎨 Sztuka',
  26: '🎘️ Zabawki Gry'
} as Record<string, string>

export const DIFFICULTY_EXP = {
  easy: 10,
  medium: 25,
  hard: 50
} as Record<string, number>

// Pobierz pytania z API
export const fetchTriviaQuestions = async (
  amount = 10,
  category?: number,
  difficulty?: 'easy' | 'medium' | 'hard'
): Promise<TriviaQuestion[]> => {
  try {
    const params = new URLSearchParams({
      amount: amount.toString(),
      type: 'multiple'
    })

    if (category) params.append('category', category.toString())
    if (difficulty) params.append('difficulty', difficulty)

    const response = await fetch(`${TRIVIA_API_BASE}?${params}`)
    const data: TriviaApiResponse = await response.json()

    if (data.response_code !== 0) {
      throw new Error(`API error: ${data.response_code}`)
    }

    return data.results.map(q => ({
      question: decodeHtml(q.question),
      options: shuffleOptions([q.correct_answer, ...q.incorrect_answers]),
      correct: 0,  // Zawsze 0 (przemieszane)
      exp: DIFFICULTY_EXP[q.difficulty as keyof typeof DIFFICULTY_EXP] || 15,
      category: CATEGORIES[q.category] || q.category
    }))
  } catch (error) {
    console.error('Trivia API error:', error)
    return []  // Fallback do lokalnych
  }
}

// Utils
const decodeHtml = (html: string): string => {
  const txt = document.createElement('textarea')
  txt.innerHTML = html
  return txt.value
}

const shuffleOptions = (options: string[]): string[] => {
  return options.sort(() => Math.random() - 0.5)
}

export interface TriviaQuestion {
  question: string
  options: string[]
  correct: number
  exp: number
  category: string
}
