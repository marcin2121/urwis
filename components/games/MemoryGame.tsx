'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { Timer, RotateCcw, Sparkles, Brain } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext'

// --- KONFIGURACJA ---
// Używamy krótkich, sztywnych czasów dla synchronizacji z dźwiękiem
const ANIMATION_DURATION = 0.25
const AUTO_CLOSE_DELAY = 1000

const SOUNDS = {
  flip: '/sounds/flip.mp3',
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
  easy: { rows: 3, cols: 4, label: 'Łatwy (12 kart)', points: 50, xp: 100 },
  medium: { rows: 4, cols: 4, label: 'Średni (16 kart)', points: 100, xp: 200 },
  hard: { rows: 4, cols: 5, label: 'Trudny (20 kart)', points: 150, xp: 300 },
}

interface Card {
  id: number
  emoji: string
  isFlipped: boolean
  isMatched: boolean
}

export default function MemoryGame() {
  const { user } = useSupabaseAuth()
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null)
  const [cards, setCards] = useState<Card[]>([])
  const [flippedIndices, setFlippedIndices] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [timer, setTimer] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isGameWon, setIsGameWon] = useState(false)
  const [combo, setCombo] = useState(0)

  // Ref do timeouta, aby móc go anulować przy szybkim klikaniu
  const mismatchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const playSound = (type: keyof typeof SOUNDS) => {
    const audio = new Audio(SOUNDS[type])
    audio.volume = 0.4
    audio.play().catch(() => { })
  }

  // Timer gry
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying && !isGameWon) {
      interval = setInterval(() => setTimer((t) => t + 1), 1000)
    }
    return () => clearInterval(interval)
  }, [isPlaying, isGameWon])

  // Cleanup timeouta przy odmontowaniu
  useEffect(() => {
    return () => {
      if (mismatchTimeoutRef.current) clearTimeout(mismatchTimeoutRef.current)
    }
  }, [])

  const startGame = (diff: Difficulty) => {
    const config = DIFFICULTIES[diff]
    const totalCards = config.rows * config.cols
    const uniquePairs = totalCards / 2

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

    if (mismatchTimeoutRef.current) clearTimeout(mismatchTimeoutRef.current)
  }

  const handleCardClick = (index: number) => {
    // 1. Walidacja podstawowa
    if (!isPlaying || cards[index].isMatched || cards[index].isFlipped) return

    playSound('flip')

    // 2. Obsługa "Szybkiego Resetu" (gdy klikasz 3 kartę, a 2 poprzednie wiszą niepasujące)
    if (flippedIndices.length === 2) {
      // Anuluj oczekujący reset (ten z setTimeout)
      if (mismatchTimeoutRef.current) {
        clearTimeout(mismatchTimeoutRef.current)
        mismatchTimeoutRef.current = null
      }

      // Natychmiast zakryj tamte dwie i odkryj nową
      const [idx1, idx2] = flippedIndices
      setCards(prev => prev.map((c, i) => {
        if (i === index) return { ...c, isFlipped: true } // Odkryj nową (klikniętą)
        if (i === idx1 || i === idx2) return { ...c, isFlipped: false } // Zakryj stare
        return c
      }))

      setFlippedIndices([index])
      return // Koniec, czekamy na drugą do pary
    }

    // 3. Standardowe odkrywanie (pierwsza lub druga karta)
    setCards(prev => prev.map((c, i) => i === index ? { ...c, isFlipped: true } : c))
    const newFlipped = [...flippedIndices, index]
    setFlippedIndices(newFlipped)

    // 4. Sprawdzenie pary (gdy odkryto drugą)
    if (newFlipped.length === 2) {
      setMoves(m => m + 1)
      const [firstIdx, secondIdx] = newFlipped

      if (cards[firstIdx].emoji === cards[index].emoji) {
        // --- MATCH ---
        playSound('match')
        setCombo(c => c + 1)
        confetti({
          particleCount: 30,
          spread: 50,
          origin: { y: 0.7 },
          colors: ['#a855f7', '#ec4899']
        })

        // Oznacz jako dopasowane
        setCards(prev => prev.map((c, i) =>
          i === firstIdx || i === index ? { ...c, isMatched: true, isFlipped: true } : c
        ))
        setFlippedIndices([])

        // Sprawdź wygraną
        const allMatched = cards.filter(c => !c.isMatched).length <= 2 // <= 2 bo właśnie dopasowaliśmy 2
        if (allMatched) handleWin()

      } else {
        // --- MISMATCH ---
        playSound('error')
        setCombo(0)

        // Ustawiamy timer na zakrycie, ALE jeśli użytkownik kliknie inną kartę, 
        // to ten timer zostanie anulowany w bloku "Szybki Reset" wyżej.
        mismatchTimeoutRef.current = setTimeout(() => {
          setCards(prev => prev.map((c, i) =>
            i === firstIdx || i === index ? { ...c, isFlipped: false } : c
          ))
          setFlippedIndices([])
          mismatchTimeoutRef.current = null
        }, AUTO_CLOSE_DELAY)
      }
    }
  }

  const handleWin = async () => {
    setTimeout(() => {
      setIsGameWon(true)
      setIsPlaying(false)
      playSound('win')
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } })
      if (user && difficulty) saveScore()
    }, 300)
  }

  const saveScore = async () => {
    if (!user || !difficulty) return
    const config = DIFFICULTIES[difficulty]
    const supabase = createClient()

    try {
      await supabase.rpc('add_user_rewards', {
        p_user_id: user.id,
        p_points: config.points,
        p_xp: config.xp
      })
    } catch (e) {
      console.error("Błąd zapisu:", e)
    }
  }

  // --- MENU ---
  if (!difficulty) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black text-purple-600 mb-4">Wybierz poziom</h2>
          <p className="text-gray-500">Im trudniej, tym więcej XP!</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(Object.entries(DIFFICULTIES) as [Difficulty, GameConfig][]).map(([key, config]) => (
            <motion.button
              key={key}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => startGame(key)}
              className="relative overflow-hidden bg-white rounded-3xl p-8 shadow-xl border-2 border-transparent hover:border-purple-500 transition-all text-left group"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20"><Brain size={100} /></div>
              <div className="text-3xl mb-4">{key === 'easy' ? '🧸' : key === 'medium' ? '🧩' : '🎓'}</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">{config.label}</h3>
              <div className="flex gap-2 text-sm font-medium text-gray-500 mt-4">
                <span className="bg-purple-50 text-purple-600 px-2 py-1 rounded">+{config.xp} XP</span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    )
  }

  const config = DIFFICULTIES[difficulty]

  return (
    <div className="w-full max-w-3xl mx-auto px-4">
      {/* HUD */}
      <div className="flex items-center justify-between mb-8 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <button onClick={() => setDifficulty(null)} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
          <RotateCcw size={20} />
        </button>
        <div className="flex gap-6 font-bold text-gray-700">
          <div className="flex items-center gap-2"><Timer size={20} className="text-purple-500" /> {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}</div>
          <div className="flex items-center gap-2"><Sparkles size={20} className="text-blue-500" /> {moves}</div>
        </div>
        <div className={`font-black ${combo > 1 ? 'text-amber-500 animate-pulse' : 'text-transparent'}`}>
          {combo > 1 ? `${combo}x COMBO!` : '.'}
        </div>
      </div>

      {/* PLANSZA */}
      <div
        className="grid gap-3 w-full mx-auto"
        style={{
          gridTemplateColumns: `repeat(${config.cols}, minmax(0, 1fr))`,
          aspectRatio: `${config.cols}/${config.rows}`
        }}
      >
        {cards.map((card, index) => (
          <div key={card.id} className="relative w-full h-full perspective-1000 cursor-pointer" onClick={() => handleCardClick(index)}>
            <motion.div
              className="w-full h-full relative preserve-3d"
              initial={false}
              animate={{ rotateY: card.isFlipped ? 180 : 0 }}
              transition={{ duration: ANIMATION_DURATION, ease: "easeInOut" }} // SZYBKA ANIMACJA
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* TYŁ KARTY */}
              <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-md border-b-4 border-indigo-800 flex items-center justify-center">
                <span className="text-3xl opacity-50 text-white">?</span>
              </div>

              {/* PRZÓD KARTY */}
              <div
                className={`absolute inset-0 backface-hidden rounded-xl shadow-lg flex items-center justify-center text-4xl md:text-5xl bg-white border-