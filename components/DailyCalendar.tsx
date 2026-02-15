'use client'
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useSupabaseLoyalty } from '@/contexts/SupabaseLoyaltyContext';

export default function DailyCalendar() {
  const { user, isAuthenticated, addExp } = useSupabaseAuth();
  const { addPoints } = useSupabaseLoyalty();
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [claimedDays, setClaimedDays] = useState<Set<string>>(new Set());
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [rewardData, setRewardData] = useState<any>(null);

  useEffect(() => {
    if (!user) return;

    // Pobierz wszystkie dni w których odebrał nagrody
    const claimed = new Set<string>();
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(`urwis_daily_claimed_${user.id}_`)) {
        const dateStr = key.replace(`urwis_daily_claimed_${user.id}_`, '');
        claimed.add(dateStr);
      }
    });
    setClaimedDays(claimed);
  }, [user, isOpen]);

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const claimDailyReward = (day: number) => {
    if (!user) return;

    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const today = new Date();
    const clickedDate = new Date(currentYear, currentMonth, day);

    // Sprawdź czy to dzisiejszy dzień
    if (
      clickedDate.getDate() !== today.getDate() ||
      clickedDate.getMonth() !== today.getMonth() ||
      clickedDate.getFullYear() !== today.getFullYear()
    ) {
      alert('Możesz odebrać nagrodę tylko za dzisiejszy dzień!');
      return;
    }

    // Sprawdź czy już odebrał
    if (claimedDays.has(dateStr)) {
      alert('Dzisiaj już odebrałeś nagrodę!');
      return;
    }

    // Oblicz streak
    const streak = calculateStreak();
    const basePoints = 10;
    const bonusPoints = Math.min(streak * 5, 100);
    const totalPoints = basePoints + bonusPoints;
    const expAmount = 50 + (streak * 10);

    // Sprawdź milestone rewards
    const milestoneRewards = checkMilestones(claimedDays.size + 1);

    // Zapisz
    localStorage.setItem(`urwis_daily_claimed_${user.id}_${dateStr}`, 'true');
    addPoints(totalPoints, 'Codzienna nagroda');
    addExp(expAmount, 'Codzienna nagroda');

    // Pokaż modal z nagrodą
    setRewardData({
      points: totalPoints,
      exp: expAmount,
      streak,
      milestones: milestoneRewards
    });
    setShowRewardModal(true);

    // Odśwież claimed days
    setClaimedDays(new Set([...claimedDays, dateStr]));
  };

  const calculateStreak = () => {
    if (!user) return 0;

    let streak = 0;
    const today = new Date();

    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dateStr = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`;

      if (claimedDays.has(dateStr)) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }

    return streak;
  };

  const checkMilestones = (totalClaimed: number) => {
    const rewards = [];
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);

    if (totalClaimed === 7) rewards.push({ type: 'coupon', code: 'WEEK10', name: '10% zniżki', icon: '🎁' });
    if (totalClaimed === 14) rewards.push({ type: 'coupon', code: 'TWOWEEKS15', name: '15% zniżki', icon: '🎉' });
    if (totalClaimed === 20) rewards.push({ type: 'bonus', points: 100, exp: 200, name: 'Bonus 20 dni', icon: '🏆' });
    if (totalClaimed === daysInMonth) rewards.push({ type: 'coupon', code: 'MONTH25', name: '25% zniżki', icon: '👑' });

    return rewards;
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days = [];

    // Puste dni przed pierwszym dniem miesiąca
    for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) {
      days.push(<div key={`empty-${i}`} className="aspect-square" />);
    }

    // Dni miesiąca
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isClaimed = claimedDays.has(dateStr);
      const isToday = day === new Date().getDate() &&
        currentMonth === new Date().getMonth() &&
        currentYear === new Date().getFullYear();
      const isPast = new Date(currentYear, currentMonth, day) < new Date(new Date().setHours(0, 0, 0, 0));
      const isFuture = new Date(currentYear, currentMonth, day) > new Date();

      days.push(
        <motion.button
          key={day}
          whileHover={isToday && !isClaimed ? { scale: 1.1 } : {}}
          whileTap={isToday && !isClaimed ? { scale: 0.95 } : {}}
          onClick={() => isToday && !isClaimed && claimDailyReward(day)}
          disabled={!isToday || isClaimed}
          className={`aspect-square rounded-xl flex flex-col items-center justify-center font-bold text-sm relative transition-all ${isClaimed
            ? 'bg-linear-to-br from-green-400 to-emerald-500 text-white shadow-lg'
            : isToday
              ? 'bg-linear-to-br from-yellow-400 to-orange-500 text-white shadow-xl animate-pulse cursor-pointer'
              : isPast
                ? 'bg-gray-100 text-gray-400'
                : 'bg-gray-50 text-gray-300'
            }`}
        >
          <span className="text-lg">{day}</span>
          {isClaimed && <span className="text-2xl absolute">✓</span>}
          {isToday && !isClaimed && <span className="text-xs mt-1">Odbierz!</span>}
        </motion.button>
      );
    }

    return days;
  };

  return (
    <>
      {/* Przycisk otwierający kalendarz */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="w-full py-4 bg-linear-to-r from-yellow-500 to-orange-500 text-white rounded-2xl font-bold text-lg shadow-xl"
      >
        📅 Kalendarz Nagród
      </motion.button>

      {/* Modal z kalendarzem */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-3xl font-black bg-linear-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                      Kalendarz Nagród
                    </h2>
                    <p className="text-gray-600 text-sm mt-1">
                      Odbieraj nagrody codziennie!
                    </p>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-2xl"
                  >
                    ✕
                  </button>
                </div>

                {/* Miesiąc navigation */}
                <div className="flex justify-between items-center mb-6">
                  <button
                    onClick={() => {
                      if (currentMonth === 0) {
                        setCurrentMonth(11);
                        setCurrentYear(currentYear - 1);
                      } else {
                        setCurrentMonth(currentMonth - 1);
                      }
                    }}
                    className="px-4 py-2 bg-gray-100 rounded-xl font-bold hover:bg-gray-200"
                  >
                    ←
                  </button>
                  <h3 className="text-2xl font-black">
                    {new Date(currentYear, currentMonth).toLocaleDateString('pl-PL', { month: 'long', year: 'numeric' })}
                  </h3>
                  <button
                    onClick={() => {
                      if (currentMonth === 11) {
                        setCurrentMonth(0);
                        setCurrentYear(currentYear + 1);
                      } else {
                        setCurrentMonth(currentMonth + 1);
                      }
                    }}
                    className="px-4 py-2 bg-gray-100 rounded-xl font-bold hover:bg-gray-200"
                  >
                    →
                  </button>
                </div>

                {/* Dni tygodnia */}
                <div className="grid grid-cols-7 gap-2 mb-2">
                  {['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Ndz'].map(day => (
                    <div key={day} className="text-center font-bold text-gray-600 text-xs">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Kalendarz */}
                <div className="grid grid-cols-7 gap-2">
                  {renderCalendar()}
                </div>

                {/* Statystyki */}
                <div className="mt-6 grid grid-cols-3 gap-4">
                  <div className="p-4 bg-linear-to-br from-green-50 to-emerald-50 rounded-xl text-center border-2 border-green-200">
                    <div className="text-3xl mb-1">✅</div>
                    <div className="text-2xl font-black text-green-600">{claimedDays.size}</div>
                    <div className="text-xs text-gray-600">Odebrane</div>
                  </div>
                  <div className="p-4 bg-linear-to-br from-orange-50 to-red-50 rounded-xl text-center border-2 border-orange-200">
                    <div className="text-3xl mb-1">🔥</div>
                    <div className="text-2xl font-black text-orange-600">{calculateStreak()}</div>
                    <div className="text-xs text-gray-600">Seria</div>
                  </div>
                  <div className="p-4 bg-linear-to-br from-purple-50 to-pink-50 rounded-xl text-center border-2 border-purple-200">
                    <div className="text-3xl mb-1">🎁</div>
                    <div className="text-2xl font-black text-purple-600">
                      {getDaysInMonth(currentMonth, currentYear) - claimedDays.size}
                    </div>
                    <div className="text-xs text-gray-600">Pozostałe</div>
                  </div>
                </div>

                {/* Milestones */}
                <div className="mt-6 p-4 bg-linear-to-r from-yellow-50 to-orange-50 rounded-xl border-2 border-yellow-200">
                  <h4 className="font-bold text-gray-900 mb-3">🏆 Nagrody Milestone:</h4>
                  <div className="space-y-2 text-sm">
                    <div className={claimedDays.size >= 7 ? 'text-green-600 font-bold' : 'text-gray-600'}>
                      {claimedDays.size >= 7 ? '✓' : '○'} 7 dni: Kupon -10% (WEEK10)
                    </div>
                    <div className={claimedDays.size >= 14 ? 'text-green-600 font-bold' : 'text-gray-600'}>
                      {claimedDays.size >= 14 ? '✓' : '○'} 14 dni: Kupon -15% (TWOWEEKS15)
                    </div>
                    <div className={claimedDays.size >= 20 ? 'text-green-600 font-bold' : 'text-gray-600'}>
                      {claimedDays.size >= 20 ? '✓' : '○'} 20 dni: Bonus 100 punktów + 200 EXP
                    </div>
                    <div className={claimedDays.size >= getDaysInMonth(currentMonth, currentYear) ? 'text-green-600 font-bold' : 'text-gray-600'}>
                      {claimedDays.size >= getDaysInMonth(currentMonth, currentYear) ? '✓' : '○'} Cały miesiąc: Kupon -25% (MONTH25)
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reward Modal */}
      <AnimatePresence>
        {showRewardModal && rewardData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowRewardModal(false)}
            className="fixed inset-0 bg-black/50 z-60 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 max-w-md text-center shadow-2xl"
            >
              <div className="text-7xl mb-4">🎉</div>
              <h3 className="text-3xl font-black mb-4">Gratulacje!</h3>
              <p className="text-xl mb-2">
                Zdobyłeś <span className="font-black text-orange-600">{rewardData.points}</span> punktów!
              </p>
              <p className="text-lg mb-4">
                i <span className="font-black text-purple-600">{rewardData.exp}</span> EXP! ✨
              </p>
              <p className="text-sm text-gray-600 mb-6">
                Seria: <span className="font-bold text-orange-600">{rewardData.streak} dni 🔥</span>
              </p>

              {rewardData.milestones.length > 0 && (
                <div className="mb-6 p-4 bg-yellow-50 rounded-xl border-2 border-yellow-300">
                  <h4 className="font-bold text-gray-900 mb-2">🎁 Milestone Odblokowany!</h4>
                  {rewardData.milestones.map((milestone: any, i: number) => (
                    <div key={i} className="text-sm font-bold text-orange-600">
                      {milestone.icon} {milestone.name}
                      {milestone.code && ` - Kod: ${milestone.code}`}
                    </div>
                  ))}
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowRewardModal(false)}
                className="px-8 py-3 bg-linear-to-r from-yellow-500 to-orange-500 text-white rounded-full font-bold"
              >
                Super! 🎊
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
