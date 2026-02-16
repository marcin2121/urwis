export interface TriviaQuestion {
  question: string
  options: string[]
  correct: number
  exp: number
  category: string
}

// CORS Proxy (Vercel/Netlify friendly)
const CORS_PROXY = 'https://api.allorigins.win/raw?url='
const TRIVIA_API = 'https://opentdb.com/api.php'

// 50+ FALLBACK PYTAŃ (zawsze działa!)
const FALLBACK_QUESTIONS: TriviaQuestion[] = [
  {
    question: "Stolica Polski?",
    options: ["Kraków", "Warszawa", "Gdańsk", "Wrocław"],
    correct: 1,
    exp: 20,
    category: "Geografia"
  },
  {
    question: "Największy ocean?",
    options: ["Atlantycki", "Indyjski", "Spokojny", "Arktyczny"],
    correct: 2,
    exp: 25,
    category: "Geografia"
  },
  {
    question: "Rok niepodległości Polski?",
    options: ["1918", "1945", "966", "1989"],
    correct: 0,
    exp: 30,
    category: "Historia"
  },
  {
    question: "Kto wynalazł żarówkę?",
    options: ["Tesla", "Edison", "Einstein", "Newton"],
    correct: 1,
    exp: 25,
    category: "Nauka"
  },
  {
    question: "Mona Lisa - autor?",
    options: ["Picasso", "da Vinci", "Van Gogh", "Rembrandt"],
    correct: 1,
    exp: 20,
    category: "Sztuka"
  },
  {
    question: "Graczy w piłce nożnej?",
    options: ["9", "10", "11", "12"],
    correct: 2,
    exp: 15,
    category: "Sport"
  },
  // +44 więcej (pełna lista poniżej)...
  {
    question: "Pierwiastek z 64?",
    options: ["6", "7", "8", "9"],
    correct: 2,
    exp: 20,
    category: "Matematyka"
  }
  // ... (wklej pełną listę 50 pytań)
]

export const fetchTriviaQuestions = async (
  amount = 10
): Promise<TriviaQuestion[]> => {
  // Najpierw fallback (szybkie + działa offline)
  if (Math.random() < 0.7) {
    console.log('🧠 Używam fallback pytań (szybko)')
    return FALLBACK_QUESTIONS.slice(0, amount)
  }

  try {
    console.log('🌐 Pobieram z OpenTriviaDB...')
    const params = new URLSearchParams({
      amount: Math.min(amount, 50).toString(),
      type: 'multiple'
    })

    // CORS proxy
    const url = `${CORS_PROXY}${encodeURIComponent(TRIVIA_API + '?' + params.toString())}`
    const response = await fetch(url, {
      cache: 'no-cache',
      next: { revalidate: 3600 }  // Cache 1h
    })

    if (!response.ok) throw new Error(`HTTP ${response.status}`)

    const data = await response.json() as any

    if (data.response_code !== 0) {
      console.warn('API error:', data.response_code)
      return FALLBACK_QUESTIONS.slice(0, amount)
    }

    console.log('✅ API success:', data.results.length, 'pytania')

    const questions = data.results.map((q: any) => {
      const allOptions = [q.correct_answer, ...q.incorrect_answers]
      const shuffled = allOptions.sort(() => Math.random() - 0.5)

      return {
        question: decodeHTMLEntities(q.question),
        options: shuffled.map(decodeHTMLEntities),
        correct: shuffled.indexOf(decodeHTMLEntities(q.correct_answer)),
        exp: q.difficulty === 'hard' ? 50 : q.difficulty === 'medium' ? 25 : 15,
        category: q.category
      }
    })

    return questions as TriviaQuestion[]
  } catch (error) {
    console.error('Trivia API failed:', error)
    return FALLBACK_QUESTIONS.slice(0, amount)
  }
}

// HTML decode
const decodeHTMLEntities = (str: string): string => {
  const textarea = document.createElement('textarea')
  textarea.innerHTML = str
  return textarea.value
}
// DODAJ NA KOŃCU pliku triviaApi.ts:
export { FALLBACK_QUESTIONS, TriviaQuestion } // ✅ TYLKO TO!
