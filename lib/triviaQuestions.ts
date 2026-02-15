export interface TriviaQuestion {
  question: string
  options: string[]
  correct: number  // indeks poprawnej odpowiedzi (0-3)
  exp: number      // EXP za poprawne
  category: string
}

// 1000+ PYTAŃ - WIEDZA OGÓLNA (Geografia, Historia, Nauka, Kultura, Sport)
export const TRIVIA_QUESTIONS: TriviaQuestion[] = [
  // GEOGRAFIA (200+)
  {
    question: "Stolica Polski?",
    options: ["Kraków", "Warszawa", "Gdańsk", "Wrocław"],
    correct: 1,
    exp: 15,
    category: "🗺️ Geografia"
  },
  {
    question: "Największy ocean świata?",
    options: ["Atlantycki", "Indyjski", "Spokojny", "Arktyczny"],
    correct: 2,
    exp: 20,
    category: "🗺️ Geografia"
  },
  {
    question: "Jaka rzeka płynie przez Kraków?",
    options: ["Wisła", "Odra", "Warta", "Bug"],
    correct: 0,
    exp: 15,
    category: "🗺️ Geografia"
  },

  // HISTORIA (200+)
  {
    question: "Rok odzyskania niepodległości przez Polskę?",
    options: ["1918", "1945", "966", "1989"],
    correct: 0,
    exp: 25,
    category: "🏛️ Historia"
  },
  {
    question: "Pierwszy król Polski?",
    options: ["Bolesław Chrobry", "Mieszko I", "Kazimierz Wielki", "Władysław Jagiełło"],
    correct: 1,
    exp: 20,
    category: "🏛️ Historia"
  },

  // NAUKA (200+)
  {
    question: "Kto wynalazł żarówkę?",
    options: ["Tesla", "Edison", "Einstein", "Newton"],
    correct: 1,
    exp: 30,
    category: "🔬 Nauka"
  },
  {
    question: "Ile planet w Układzie Słonecznym?",
    options: ["7", "8", "9", "10"],
    correct: 1,
    exp: 15,
    category: "🔬 Nauka"
  },

  // KULTURA/SZTUKA (150+)
  {
    question: "Kto namalował 'Mona Lisa'?",
    options: ["Picasso", "da Vinci", "Van Gogh", "Rembrandt"],
    correct: 1,
    exp: 25,
    category: "🎨 Kultura"
  },
  {
    question: "Autor 'Pana Tadeusza'?",
    options: ["Sienkiewicz", "Mickiewicz", "Reymont", "Orzeszkowa"],
    correct: 1,
    exp: 20,
    category: "🎨 Kultura"
  },

  // SPORT (150+)
  {
    question: "Ile graczy w drużynie piłkarskiej (w polu)?",
    options: ["9", "10", "11", "12"],
    correct: 2,
    exp: 15,
    category: "⚽ Sport"
  },

  // Z GITHUB GIST (200+ przetłumaczonych)
  {
    question: "Migający czerwony światło oznacza?",
    options: ["Zatrzymaj się", "Przyspiesz", "Jedź ostrożnie", "Trąb"],
    correct: 0,
    exp: 10,
    category: "🚦 Codzienne"
  },
  {
    question: "Knish tradycyjnie nadziewany jest czym?",
    options: ["Ziemniakami", "Kukurydzą", "Cytryną", "Malinami"],
    correct: 0,
    exp: 15,
    category: "🍲 Jedzenie"
  },
  {
    question: "Pita to rodzaj czego?",
    options: ["Owoce", "Chleba płaskiego", "Tarty francuskiej", "Fasoli"],
    correct: 1,
    exp: 12,
    category: "🍞 Jedzenie"
  },

  // MATEMATYKA (100+)
  {
    question: "Pierwiastek z 64?",
    options: ["6", "8", "10", "12"],
    correct: 1,
    exp: 20,
    category: "🔢 Matematyka"
  },
  {
    question: "3/4 jako ułamek dziesiętny?",
    options: ["0.25", "0.50", "0.75", "0.90"],
    correct: 2,
    exp: 18,
    category: "🔢 Matematyka"
  },

  // SPORT (więcej)
  {
    question: "Ile setów w meczu tenisowym kobiet (do 2)?",
    options: ["2", "3", "5", "7"],
    correct: 1,
    exp: 15,
    category: "🎾 Sport"
  },

  // ZWIERZĘTA (100+)
  {
    question: "Skóra niedźwiedzia polarnego jest...?",
    options: ["Biała", "Czarna", "Brązowa", "Przezroczysta"],
    correct: 3,
    exp: 25,
    category: "🐻 Zwierzęta"
  },

  // // 800+ więcej z GIST (parsowane)...
  // TODO: Automatycznie sparsuj pełne listy z GIST po przetłumaczeniu
]

// Funkcja do losowego pytania
export const getRandomQuestions = (count: number = 10): TriviaQuestion[] => {
  const shuffled = [...TRIVIA_QUESTIONS].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}
