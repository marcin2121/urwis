export default function QuizDashboard() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-5xl font-black bg-gradient-to-r from-[#E94444] via-[#1473E6] to-[#FFBE0B] bg-clip-text text-transparent text-center mb-12"
      >
        Quiz Urwis 🏆⚡
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* SINGLE */}
        <motion.a href="/quiz/single" className="group">
          <div className="h-48 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl p-8 text-white shadow-2xl group-hover:scale-105 transition-all border-4 border-white/20">
            <div className="text-5xl mb-4">🧸</div>
            <h2 className="text-2xl font-black mb-2">Single</h2>
            <p className="opacity-90">Codzienny grind!</p>
          </div>
        </motion.a>

        {/* CHALLENGE */}
        <motion.a href="/quiz/challenge" className="group">
          <div className="h-48 bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl p-8 text-white shadow-2xl group-hover:scale-105 transition-all border-4 border-white/20">
            <div className="text-5xl mb-4">⚔️</div>
            <h2 className="text-2xl font-black mb-2">1v1 Challenge</h2>
            <p className="opacity-90">Wyzwij kumpla!</p>
          </div>
        </motion.a>

        {/* DUEL */}
        <motion.a href="/quiz/duel" className="group">
          <div className="h-48 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-8 text-white shadow-2xl group-hover:scale-105 transition-all border-4 border-white/20">
            <div className="text-5xl mb-4">👥</div>
            <h2 className="text-2xl font-black mb-2">Duel Live</h2>
            <p className="opacity-90">2-8 graczy!</p>
          </div>
        </motion.a>

        {/* PARTY */}
        <motion.a href="/quiz/party/new" className="group">
          <div className="h-48 bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl p-8 text-white shadow-2xl group-hover:scale-105 transition-all border-4 border-white/20">
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="text-2xl font-black mb-2">Party Master</h2>
            <p className="opacity-90">Eventy sklepowe!</p>
          </div>
        </motion.a>
      </div>

      {/* Leaderboard pod quizami */}
      <div className="mt-16 p-8 bg-white/60 backdrop-blur-xl rounded-3xl shadow-2xl">
        <h3 className="text-3xl font-black mb-8 text-center bg-gradient-to-r from-[#FFBE0B] to-orange-500 bg-clip-text text-transparent">
          🏅 Top Quizowicze
        </h3>
        {/* Tu później Supabase query */}
      </div>
    </div>
  );
}
