'use client'
import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getRandomQuestionsClient } from '@/lib/quiz-client'  // client fetch
import Confetti from 'react-confetti'
import { TriviaQuestion } from '@/lib/quiz-server'

interface Props {
  initialQuestions?: TriviaQuestion[]
  categories: string[]
  selectedCategory?: string
}

export default function SinglePlayerQuiz({
  initialQuestions = [],
  categories,
  selectedCategory = 'mixed'
}: Props) {
  const [questions, setQuestions] = useState(initialQuestions)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [gameFinished, setGameFinished] = useState(false)
  const [userExp, setUserExp] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)

  // Load more questions on category change
  useEffect(() => {
    async function loadQuestions() {
      if (questions.length === 0) {
        const newQuestions = await getRandomQuestionsClient(selectedCategory, 10)
        setQuestions(newQuestions)
      }
    }
    loadQuestions()
  }, [selectedCategory, questions.length])

  const currentQuestion = questions[currentQuestionIndex]

  const handleAnswer = useCallback((answerIndex: number) => {
    setSelectedAnswer(answerIndex)
    setShowResult(true)

    // Check answer after delay
    setTimeout(() => {
      if (answerIndex === currentQuestion?.correct) {
        const exp = currentQuestion?.exp || 10
        setScore(prev => prev + 1)
        setUserExp(prev => prev + exp)
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 3000)
      }

      setTimeout(() => {
        if (currentQuestionIndex + 1 < questions.length) {
          setCurrentQuestionIndex(prev => prev + 1)
        } else {
          setGameFinished(true)
        }
        setSelectedAnswer(null)
        setShowResult(false)
      }, 1500)
    }, 500)
  }, [currentQuestionIndex, questions, currentQuestion?.correct, currentQuestion?.exp])

  const restartGame = () => {
    setCurrentQuestionIndex(0)
    setScore(0)
    setUserExp(0)
    setGameFinished(false)
    setSelectedAnswer(null)
    setShowResult(false)
  }

  if (!currentQuestion && questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#E94444] to-[#1473E6]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="text-6xl"
        >
          ⚡
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5E6] to-white">
      {/* Confetti */}
      <AnimatePresence>
        {showConfetti && (
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={false}
            numberOfPieces={200}
            colors={['#FFBE0B', '#E94444', '#1473E6']}
          />
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto p-6 md:p-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-[#E94444] to-[#1473E6] bg-clip-text text-transparent mb-4">
            SINGLE PLAYER
          </h1>
          <div className="flex gap-8 justify-center items-center flex-wrap">
            <div className="text-3xl font-black text-[#1A1A2E]">
              Wynik: <span className="text-[#FFBE0B]">{score}</span>/{questions.length}
            </div>
            <div className="text-3xl font-black text-purple-600">
              EXP: <span className="text-[#FFBE0B] font-black text-4xl">+{userExp}</span>
            </div>
          </div>
        </motion.div>

        {/* Category Selector */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-12"
        >
          <select
            value={selectedCategory}
            onChange={(e) => {
              setQuestions([])
              // Trigger reload via parent or router
            }}
            className="mx-auto block px-8 py-4 bg-white/80 backdrop-blur-xl rounded-3xl text-2xl font-bold border-4 border-[#1473E6]/30 shadow-2xl focus:border-[#FFBE0B] focus:outline-none transition-all"
          >
            <option value="mixed">🎲 Mieszane</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </motion.div>

        {/* Question */}
        <AnimatePresence mode="wait">
          {currentQuestion && !gameFinished ? (
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
              className="bg-white/90 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border-4 border-white/50 max-w-3xl mx-auto"
            >
              {/* Question */}
              <div className="text-center mb-12">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-6xl mb-8 mx-auto w-24 h-24 bg-gradient-to-br from-[#FFBE0B] to-yellow-500 rounded-3xl flex items-center justify-center shadow-2xl font-black"
                >
                  Q{currentQuestionIndex + 1}
                </motion.div>
                <h2 className="text-3xl md:text-4xl font-black text-[#1A1A2E] mb-2 leading-tight">
                  {currentQuestion.question}
                </h2>
                <div className="text-xl text-gray-600 font-semibold">
                  {currentQuestion.category.toUpperCase()}
                </div>
              </div>

              {/* Answers */}
              <div className="space-y-4">
                {currentQuestion.options.map((option, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    disabled={showResult}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`
                      w-full p-8 text-left rounded-2xl font-bold text-xl shadow-xl transition-all duration-300 border-4
                      ${selectedAnswer === null 
                        ? 'bg-gradient-to-r from-blue-400 to-blue-500 text-white border-blue-300 hover:from-blue-500 hover:to-blue-600 hover:shadow-2xl hover:-translate-y-1' 
                        : selectedAnswer === currentQuestion.correct && index === selectedAnswer
                        ? 'bg-gradient-to-r from-emerald-400 to-emerald-500 text-white border-emerald-300 shadow-emerald-200/50' 
                        : index === currentQuestion.correct 
                        ? 'bg-gradient-to-r from-emerald-400 to-emerald-500 text-white border-emerald-300 shadow-emerald-200/50' 
                        : selectedAnswer === index 
                        ? 'bg-gradient-to-r from-red-400 to-red-500 text-white border-red-300 shadow-red-200/50' 
                        : 'bg-white border-gray-200 text-gray-800 hover:border-blue-300 hover:shadow-xl hover:bg-blue-50'
                      }
                      ${showResult ? 'cursor-default' : 'cursor-pointer'}
                    `}
                  >
                    <span className="text-2xl mr-4">{String.fromCharCode(65 + index)}.</span>
                    {option}
                  </motion.button>
                ))}
              </div>

              {/* Result Feedback */}
              <AnimatePresence>
                {showResult && selectedAnswer !== null && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-8 pt-8 border-t-4 border-white/50"
                  >
                    {selectedAnswer === currentQuestion.correct ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-center"
                      >
                        <div className="text-8xl mb-4">✅</div>
                        <h3 className="text-4xl font-black text-emerald-600 mb-2">POPRAWNIE!</h3>
                        <div className="text-2xl font-bold text-emerald-500">
                          +{currentQuestion.exp} EXP
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-center"
                      >
                        <div className="text-8xl mb-4">❌</div>
                        <h3 className="text-4xl font-black text-red-600 mb-2">ŹLE!</h3>
                        <div className="text-2xl font-bold text-emerald-500">
                          Poprawna: {String.fromCharCode(65 + currentQuestion.correct)}. {currentQuestion.options[currentQuestion.correct]}
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* Game Finished */}
        <AnimatePresence>
          {gameFinished && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl mx-auto text-center py-20 bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border-4 border-[#FFBE0B]/50"
            >
              <div className="text-8xl mb-8">🎉</div>
              <h2 className="text-5xl font-black text-[#1A1A2E] mb-6">
                GRATULACJE!
              </h2>
              <div className="text-4xl font-black text-[#FFBE0B] mb-8">
                {score}/{questions.length} ({Math.round(score / questions.length * 100)}%)
              </div>
              <div className="text-3xl font-bold text-purple-600 mb-12">
                Zdobyte EXP: <span className="text-[#FFBE0B] text-4xl">+{userExp}</span>
              </div>
              <motion.button
                onClick={restartGame}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-12 py-6 bg-gradient-to-r from-[#E94444] to-[#1473E6] text-white text-2xl font-black rounded-3xl shadow-2xl hover:shadow-3xl hover:from-[#FFBE0B] hover:to-orange-500 transition-all duration-300"
              >
                🏆 GRAJ PONOWNIE
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
