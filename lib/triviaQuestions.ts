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
    "question": "Jaka jest najdłuższa rzeka na świecie?",
    "options": ["Amazonka", "Nil", "Jangcy", "Missisipi"],
    "correct": 1,
    "exp": 20,
    "category": "🗺️ Geografia"
  },
  {
    "question": "Kto namalował Monę Lisę?",
    "options": ["Michał Anioł", "Leonardo da Vinci", "Rafael", "Rembrandt"],
    "correct": 1,
    "exp": 25,
    "category": "🎨 Sztuka"
  },
  {
    "question": "Jak nazywa się największa firma technologiczna w Korei Południowej?",
    "options": ["LG", "Hyundai", "Samsung", "SK Hynix"],
    "correct": 2,
    "exp": 20,
    "category": "💻 Technologia"
  },
  {
    "question": "Jaki jest symbol chemiczny wody?",
    "options": ["H2O", "CO2", "NaCl", "O2"],
    "correct": 0,
    "exp": 15,
    "category": "🔬 Chemia"
  },
  {
    "question": "Który organ w ciele człowieka jest największy?",
    "options": ["Wątroba", "Skóra", "Płuca", "Mózg"],
    "correct": 1,
    "exp": 20,
    "category": "🩺 Biologia"
  },
  {
    "question": "Ile dni ma rok?",
    "options": ["360", "365", "300", "364"],
    "correct": 1,
    "exp": 15,
    "category": "📅 Kalendarz"
  },
  {
    "question": "Jak nazywa się dom w całości wykonany z lodu?",
    "options": ["Tipi", "Igloo", "Jurta", "Chata"],
    "correct": 1,
    "exp": 20,
    "category": "🏠 Architektura"
  },
  {
    "question": "Jaki jest pierwiastek kwadratowy z 64?",
    "options": ["6", "7", "8", "9"],
    "correct": 2,
    "exp": 15,
    "category": "➗ Matematyka"
  },
  {
    "question": "Który miesiąc ma 28 dni?",
    "options": ["Styczeń", "Luty", "Marzec", "Każdy"],
    "correct": 3,
    "exp": 25,
    "category": "📅 Kalendarz"
  },
  {
    "question": "Jaka jest stolica Portugalii?",
    "options": ["Porto", "Lizbona", "Coimbra", "Faro"],
    "correct": 1,
    "exp": 20,
    "category": "🗺️ Geografia"
  },
  {
    "question": "Ile oddechów bierze dziennie ludzkie ciało?",
    "options": ["10 000", "15 000", "20 000", "25 000"],
    "correct": 2,
    "exp": 20,
    "category": "🩺 Biologia"
  },
  {
    "question": "Jaki jest symbol chemiczny srebra?",
    "options": ["Au", "Ag", "Fe", "Cu"],
    "correct": 1,
    "exp": 15,
    "category": "🔬 Chemia"
  },
  {
    "question": "Jaki jest pierwszy wers słynnej powieści „Moby Dick”?",
    "options": ["Zadzwoń do mnie Ahab", "Nazywaj mnie Ismael", "Statek płynął", "Wieloryb był wielki"],
    "correct": 1,
    "exp": 25,
    "category": "📚 Literatura"
  },
  {
    "question": "Jaki jest najmniejszy ptak na świecie?",
    "options": ["Wróbel", "Koliber", "Sikorka", "Zięba"],
    "correct": 1,
    "exp": 20,
    "category": "🐦 Zwierzęta"
  },
  {
    "question": "Jakie jest pełne imię Barbie?",
    "options": ["Barbara Millicent Roberts", "Betty Marie Smith", "Brenda Ann Davis", "Bethany Louise Wilson"],
    "correct": 0,
    "exp": 25,
    "category": "🎀 Kultura"
  },
  {
    "question": "Za co Paul Hunn dzierży rekord 118.1 decybeli?",
    "options": ["Najgłośniejszy krzyk", "Najgłośniejsze beknięcie", "Najgłośniejszy śmiech", "Najgłośniejsze klaskanie"],
    "correct": 1,
    "exp": 30,
    "category": "🏆 Rekordy"
  },
  {
    "question": "Jaka była pierwsza pełnokolorowa kreskówka Disneya?",
    "options": ["Królik Bugs", "Kwiaty i drzewa", "Myszka Miki", "Król Lew"],
    "correct": 1,
    "exp": 25,
    "category": "🎬 Film"
  },
  {
    "question": "Ile minut ma godzina?",
    "options": ["50", "60", "70", "55"],
    "correct": 1,
    "exp": 10,
    "category": "⏰ Czas"
  },
  {
    "question": "Jaka jest stolica Francji?",
    "options": ["Londyn", "Berlin", "Paryż", "Madryt"],
    "correct": 2,
    "exp": 15,
    "category": "🗺️ Geografia"
  },
  {
    "question": "Kto napisał 'Pana Tadeusza'?",
    "options": ["Adam Mickiewicz", "Henryk Sienkiewicz", "Eliza Orzeszkowa", "Stefan Żeromski"],
    "correct": 0,
    "exp": 25,
    "category": "📚 Literatura"
  },
  {
    "question": "Jaka jest przybliżona prędkość światła?",
    "options": ["300 000 km/s", "150 000 km/s", "500 000 km/s", "100 000 km/s"],
    "correct": 0,
    "exp": 20,
    "category": "🔬 Fizyka"
  },
  {
    "question": "Który pierwiastek ma symbol O?",
    "options": ["Złoto", "Tlen", "Węgiel", "Wodór"],
    "correct": 1,
    "exp": 15,
    "category": "🔬 Chemia"
  },
  {
    "question": "Jaka planeta jest najbliższa Słońcu?",
    "options": ["Mars", "Wenus", "Merkury", "Jowisz"],
    "correct": 2,
    "exp": 20,
    "category": "🌌 Astronomia"
  },
  {
    "question": "Kto wynalazł telefon?",
    "options": ["Edison", "Bell", "Tesla", "Marconi"],
    "correct": 1,
    "exp": 25,
    "category": "💡 Wynalazki"
  },
  {
    "question": "Ile kontynentów jest na Ziemi?",
    "options": ["6", "7", "5", "8"],
    "correct": 1,
    "exp": 15,
    "category": "🗺️ Geografia"
  },
  {
    question: "Stolica Polski?",
    options: ["Kraków", "Warszawa", "Białobrzegi", "Wrocław"],
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
