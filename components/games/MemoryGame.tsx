'use client'
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface MemoryGameProps {
  onComplete: () => void;
}

export default function MemoryGame({ onComplete }: MemoryGameProps) {
  const [cards, setCards] = useState<string[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);

  const emojis = ['🧸', '🎮', '🎲', '🚗', '🎨', '⚽', '🎪', '🎁'];

  useEffect(() => {
    initGame();
  }, []);

  const initGame = () => {
    const shuffled = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setGameWon(false);
  };

  const handleCardClick = (index: number) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(moves + 1);
      
      if (cards[newFlipped[0]] === cards[newFlipped[1]]) {
        setMatched([...matched, ...newFlipped]);
        setFlipped([]);
        
        if (matched.length + 2 === cards.length) {
          setTimeout(() => setGameWon(true), 500);
        }
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Game info */}
      <div className="flex justify-between items-center">
        <div className="text-lg font-bold">Ruchy: {moves}</div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={initGame}
          className="px-4 py-2 bg-purple-500 text-white rounded-lg font-bold"
        >
          🔄 Reset
        </motion.button>
      </div>

      {/* Game board */}
      <div className="grid grid-cols-4 gap-4">
        {cards.map((emoji, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleCardClick(index)}
            className={`aspect-square rounded-xl cursor-pointer flex items-center justify-center text-5xl font-bold transition-all ${
              flipped.includes(index) || matched.includes(index)
                ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white'
                : 'bg-gradient-to-br from-gray-200 to-gray-300'
            }`}
          >
            {(flipped.includes(index) || matched.includes(index)) ? emoji : '?'}
          </motion.div>
        ))}
      </div>

      {/* Win modal */}
      {gameWon && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center p-8 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl"
        >
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-2xl font-black mb-2">Gratulacje!</h3>
          <p className="text-gray-700 mb-4">
            Ukończyłeś grę w {moves} ruchach!
          </p>
          <div className="bg-white rounded-lg p-4 inline-block mb-4">
            <div className="text-sm text-gray-600 mb-1">Twój kupon:</div>
            <div className="text-2xl font-black text-purple-600">MEMORY10</div>
            <div className="text-sm text-gray-600">10% zniżki na zabawki edukacyjne</div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onComplete}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-bold"
          >
            Zamknij i użyj kuponu
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}
