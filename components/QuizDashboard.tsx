'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface LeaderboardPlayer {
  mode: string
  name: string
  total_exp: number
  rank: number
}

export default function QuizDashboard({
  initialLeaderboard,
  categoriesCount
}: {
  initialLeaderboard: LeaderboardPlayer[]
  categoriesCount: number
}) {
  const modes = ['single', 'duel', 'challenge', 'party']
  const [leaderboard, setLeaderboard] = useState(initialLeaderboard)

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-12 space-y-12">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-20 bg-gradient-to-br from-red-500 via-blue-500 to-purple-500 rounded-3xl text-white shadow-2xl"
      >
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-7xl mb-6"
        >
          🧠
        </motion.div>
        <h1 className="text-6xl md:text-7xl font-black mb-6 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
          QUIZ URWIS
        </h1>
        <p className="text-2xl opacity-90 mb-8 max-w-2xl mx-auto">
          65 pytań • {categoriesCount} kategorii • Graj i zdobywaj EXP! 🏆
        </p>
      </motion.div>

      {/* 4 Tryby */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { href: '/quiz/single', emoji: '🎯', title: 'Single Player', desc: 'Spokojna gra solo', label: 'GRAJ TERAZ' },
          { href: '/quiz/duel/new', emoji: '⚔️', title: 'Duel Party', desc: '2-8 graczy live!', label: 'UTWÓRZ POKÓJ' },
          { href: '/quiz/challenge/new', emoji: '🥊', title: 'Challenge 1v1', desc: '10s/pytanie async', label: 'WYŚLIJ CHALLENGE' },
          { href: '/quiz/party/new', emoji: '👑', title: 'Party Master', desc: 'Kahoot dla eventów', label: 'BĄDŹ QUIZMASTER' }
        ].map(({ href, emoji, title, desc, label }, i) => (
          <Link key={href} href={href} className="group">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              whileHover={{ scale: 1.05, rotateY: 5 }}
              className="h-64 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-8 text-white shadow-2xl group-hover:shadow-3xl cursor-pointer border-4 border-emerald-300/50 hover:border-emerald-200/50 hover:from-emerald-600 hover:to-teal-700"
            >
              <div className="text-6xl mb-6">{emoji}</div>
              <h3 className="text-3xl font-black mb-4">{title}</h3>
              <p className="text-xl opacity-90 mb-6 leading-relaxed">{desc}</p>
              <span className="px-6 py-2 bg-white/20 backdrop-blur rounded-2xl font-bold text-lg shadow-lg">
                {label}
              </span>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Leaderboard Cards */}
      <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6">
        {modes.map((mode, i) => (
          <motion.div
            key={mode}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + 0.1 * i }}
            className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50 hover:shadow-3xl transition-all"
          >
            <h4 className="font-black text-2xl mb-6 flex items-center capitalize">
              {mode === 'single' ? '🎯' : mode === 'duel' ? '⚔️' : mode === 'challenge' ? '🥊' : '👑'}
              <span className="ml-3">{mode.replace('_', ' ')}</span>
            </h4>

            <div className="space-y-3">
              {leaderboard.filter((l: any) => l.mode === mode).slice(0, 5).map((player: any, j: number) => (
                <motion.div
                  key={player.name}
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl shadow-sm hover:shadow-md cursor-default"
                >
                  <div className="font-mono text-lg font-bold text-gray-800">#{j + 1}</div>
                  <div className="text-right ml-4">
                    <div className="font-black text-2xl text-emerald-600">{player.total_exp} EXP</div>
                    <div className="text-sm font-semibold text-gray-700">{player.name}</div>
                  </div>
                </motion.div>
              )) || <div className="text-center py-12 text-
