'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { Trophy, Timer, RotateCcw, Zap, Sparkles, Brain } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext'
import { cn } from '@/lib/utils' // Zakładam, że masz cn w utils, jak nie - usuń i użyj template string

// --- KONFIGURACJA ---
const SOUNDS = {
  flip: '/sounds/flip.mp3', // Dodaj te pliki do public/sounds/ lub usuń obsługę dźwięku
  match: '/sounds/correct.mp3',
  win: '/sounds/win.mp3',
  error: '/sounds/wrong.mp3',
}

const EMOJI_SET = [
  '🧸', '🚗', '🚀', '🦄', '🦖', '🎨', '🎮', '🧩',
  '⚽', '🎸', '🍦', '🍕', '🦁', '🐼', '🐯', '🐙',
  '🦋', '🌻', '🌈', '⚡'
]

type Difficulty = 'easy' | 'medium' | 'hard'

interface GameConfig {
  rows: number
  cols: number
  label: string
  points: number
  xp: number
}

const DIFFICULTIES: Record<Difficulty, GameConfig> = {
  easy: { rows: 3, cols: 4, label: 'Łatwy (12 kart)', points: 50, xp: 100 }, // 3x4 = 12
  medium: { rows: 4, cols: 4, label: 'Średni (16 kart)', points: 100, xp: 200 }, // 4x4 = 16
  hard: { rows: 4, cols: 5, label: 'Trudny (20 kart)', points: 150, xp: 300 }, // 4x5 = 20
}

interface Card {
  id: number
  emoji: string
  isFlipped: boolean
  isMatched: boolean
}

export default function MemoryGame() {
  const { user, profile } = useSupabaseAuth()
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null)
  const [cards, setCards] = useState<Card[]>([])
  const [flippedIndices, setFlippedIndices] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [timer, setTimer] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isGameWon, setIsGameWon] = useState(false)
  const [combo, setCombo] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)

  // Audio refs (prosta obsługa bez zewnętrznych hooków dla stabilności)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const playSound = (type: keyof typeof SOUNDS) => {
    // Odkomentuj jeśli masz pliki dźwiękowe
    const audio = new Audio(SOUNDS[type])
    audio.volume = 0.4
    audio.play().catch(() => { })
  }

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying && !isGameWon) {
      interval = setInterval(() => setTimer((t) => t + 1), 1000)
    }
    return () => clearInterval(interval)
  }, [isPlaying, isGameWon])

  const startGame = (diff: Difficulty) => {
    const config = DIFFICULTIES[diff]
    const totalCards = config.rows * config.cols
    const uniquePairs = totalCards / 2

    // Losowanie kart
    const selectedEmojis = EMOJI_SET.sort(() => 0.5 - Math.random()).slice(0, uniquePairs)
    const gameDeck = [...selectedEmojis, ...selectedEmojis]
      .sort(() => 0.5 - Math.random())
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false,
      }))

    setDifficulty(diff)
    setCards(gameDeck)
    setFlippedIndices([])
    setMoves(0)
    setTimer(0)
    setCombo(0)
    setIsGameWon(false)
    setIsPlaying(true)
    setIsProcessing(false)
  }

  const handleCardClick = async (index: number) => {
    // Blokady: gra nieaktywna, karta już odkryta, karta dopasowana, trwa przetwarzanie 2 kart
    if (!isPlaying || cards[index].isFlipped || cards[index].isMatched || isProcessing) return

    playSound('flip')

    // Odkryj kartę
    const newCards = [...cards]
    newCards[index].isFlipped = true
    setCards(newCards)

    const newFlipped = [...flippedIndices, index]
    setFlippedIndices(newFlipped)

    // Jeśli to druga karta
    if (newFlipped.length === 2) {
      setIsProcessing(true)
      setMoves((m) => m + 1)

      const [firstIndex, secondIndex] = newFlipped

      if (newCards[firstIndex].emoji === newCards[secondIndex].emoji) {
        // --- DOPASOWANIE (MATCH) ---
        playSound('match')
        setCombo((c) => c + 1)

        // Efekt confetti na karcie
        confetti({
          particleCount: 30,
          spread: 50,
          origin: { y: 0.7 }, // Przybliżona pozycja
          colors: ['#a855f7', '#ec4899']
        })

        setTimeout(() => {
          setCards((prev) => prev.map((c, i) =>
            i === firstIndex || i === secondIndex
              ? { ...c, isMatched: true, isFlipped: true }
              : c
          ))
          setFlippedIndices([])
          setIsProcessing(false)

          // Sprawdź czy wygrana
          const allMatched = cards.every((c, i) =>
            (i === firstIndex || i === secondIndex) || c.isMatched
          )

          if (allMatched) {
            handleWin()
          }
        }, 500)
      } else {
        // --- BRAK DOPASOWANIA (MISMATCH) ---
        playSound('error')
        setCombo(0)
        setTimeout(() => {
          setCards((prev) => prev.map((c, i) =>
            i === firstIndex || i === secondIndex
              ? { ...c, isFlipped: false }
              : c
          ))
          setFlippedIndices([])
          setIsProcessing(false)
        }, 1000)
      }
    }
  }

  const handleWin = async () => {
    setIsGameWon(true)
    setIsPlaying(false)
    playSound('win')
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 }
    })

    if (user && difficulty) {
      await saveScore()
    }
  }

  const saveScore = async () => {
    if (!user || !difficulty) return

    const config = DIFFICULTIES[difficulty]
    const supabase = createClient()

    // 1. Zapisz log gry (opcjonalne, jeśli masz tabelę game_logs)
    /*
    await supabase.from('game_logs').insert({
      user_id: user.id,
      game_type: 'memory',
      difficulty: difficulty,
      moves: moves,
      time_seconds: timer,
      xp_earned: config.xp
    })
    */

    // 2. Zaktualizuj profil użytkownika (XP i punkty)
    // Używamy RPC (bezpieczna funkcja bazodanowa) lub update
    try {
      // Prosta inkrementacja (może wymagać stworzenia funkcji w bazie dla atomowości)
      const { error } = await supabase.rpc('add_user_rewards', {
        p_user_id: user.id,
        p_points: config.points,
        p_xp: config.xp
      })

      if (error) {
        console.error("Błąd zapisu nagrody:", error)
        // Fallback jeśli nie masz funkcji RPC:
        /*
        await supabase.from('profiles').update({
            total_exp: (profile?.total_exp || 0) + config.xp
        }).eq('id', user.id)
        */
      }
    } catch (e) {
      console.error("Błąd zapisu:", e)
    }
  }

  // --- RENDEROWANIE MENU ---
  if (!difficulty) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black text-purple-600 mb-4 tracking-tight">
            Wybierz poziom trudności
          </h2>
          <p className="text-gray-500 text-lg">
            Trenuj pamięć i zdobywaj punkty Urwisa!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(Object.entries(DIFFICULTIES) as [Difficulty, GameConfig][]).map(([key, config]) => (
            <motion.button
              key={key}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => startGame(key)}
              className="relative overflow-hidden group bg-white rounded-3xl p-8 shadow-xl border-2 border-transparent hover:border-purple-500 transition-all text-left"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Brain size={100} />
              </div>
              <div className="relative z-10">
                <div className="text-3xl mb-4">{key === 'easy' ? '🧸' : key === 'medium' ? '🧩' : '🎓'}</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{config.label}</h3>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-4">
                  <div className={`w-2 h-2 rounded-full ${key === 'easy' ? 'bg-green-500' : key === 'medium' ? 'bg-yellow-500' : 'bg-red-500'}`} />
                  Plansza {config.rows}x{config.cols}
                </div>
                <div className="flex gap-3">
                  <span className="inline-flex items-center text-xs font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-md">
                    +{config.xp} XP
                  </span>
                  <span className="inline-flex items-center text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-md">
                    +{config.points} pkt
                  </span>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    )
  }

  // --- RENDEROWANIE GRY ---
  const config = DIFFICULTIES[difficulty]

  return (
    <div className="w-full max-w-3xl mx-auto px-4">
      {/* HUD */}
      <div className="flex items-center justify-between mb-8 bg-white p-4 rounded-2xl shadow-xs border border-gray-100">
        <button
          onClick={() => setDifficulty(null)}
          className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
        >
          <RotateCcw size={20} />
        </button>

        <div className="flex gap-6">
          <div className="flex items-center gap-2 text-purple-600 font-bold">
            <Timer size={20} />
            <span>{Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}</span>
          </div>
          <div className="flex items-center gap-2 text-blue-600 font-bold">
            <Sparkles size={20} />
            <span>Ruchy: {moves}</span>
          </div>
        </div>

        <div className={`font-black transition-all ${combo > 1 ? 'text-amber-500 scale-110' : 'text-gray-300'}`}>
          {combo > 1 ? `${combo}x COMBO!` : 'MEMORY'}
        </div>
      </div>

      {/* PLANSZA */}
      <motion.div
        layout
        className="grid gap-3 w-full"
        style={{
          gridTemplateColumns: `repeat(${config.cols}, minmax(0, 1fr))`,
          aspectRatio: `${config.cols}/${config.rows}`
        }}
      >
        <AnimatePresence>
          {cards.map((card, index) => (
            <motion.div
              key={card.id} // Używamy stabilnego ID
              layout
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => handleCardClick(index)}
              className="relative w-full h-full perspective-1000 cursor-pointer"
            >
              <motion.div
                className="w-full h-full relative preserve-3d transition-transform duration-500"
                animate={{ rotateY: card.isFlipped ? 180 : 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* REWERS (TYŁ) */}
                <div className="absolute inset-0 backface-hidden bg-linear-to-br from-purple-500 to-indigo-600 rounded-xl shadow-md border-b-4 border-indigo-800 flex items-center justify-center">
                  <span className="text-3xl opacity-50 text-white">?</span>
                </div>

                {/* AWERS (PRZÓD) */}
                <div
                  className={`absolute inset-0 backface-hidden rounded-xl shadow-lg flex items-center justify-center text-4xl md:text-5xl bg-white border-2 ${card.isMatched ? 'border-green-400 bg-green-50' : 'border-purple-200'}`}
                  style={{ transform: 'rotateY(180deg)' }}
                >
                  {card.isMatched && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1.5, opacity: 0 }}
                      className="absolute inset-0 bg-green-400 rounded-xl"
                    />
                  )}
                  {card.emoji}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* MODAL WYGRANEJ */}
      <AnimatePresence>
        {isGameWon && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl overflow-hidden relative"
            >
              {/* Efekt tła */}
              <div className="absolute top-0 left-0 w-full h-32 bg-linear-to-b from-purple-100 to-transparent -z-10" />

              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-7xl mb-4 inline-block"
              >
                🏆
              </motion.div>

              <h3 className="text-3xl font-black text-gray-800 mb-2">Gratulacje!</h3>
              <p className="text-gray-500 mb-6">Poziom {config.label} ukończony!</p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-purple-50 p-4 rounded-2xl">
                  <div className="text-xs text-purple-500 font-bold uppercase">Wynik</div>
                  <div className="text-2xl font-black text-purple-700">{Math.max(0, 1000 - moves * 10 - timer)}</div>
                </div>
                <div className="bg-green-50 p-4 rounded-2xl">
                  <div className="text-xs text-green-500 font-bold uppercase">Nagroda</div>
                  <div className="text-2xl font-black text-green-700">+{config.xp} XP</div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => startGame(difficulty)}
                  className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-lg transition-transform active:scale-95 shadow-lg shadow-purple-200"
                >
                  Zagraj jeszcze raz
                </button>
                <button
                  onClick={() => setDifficulty(null)}
                  className="w-full py-3 text-gray-500 hover:text-gray-800 font-semibold"
                >
                  Wróć do menu
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}