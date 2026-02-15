'use client'
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useLoyalty } from '@/contexts/LoyaltyContext';
import MissionNotification from '@/components/MissionNotification';
import { Mission, getMissionsByType } from '@/config/gamification.config';
import { getMissionProgress } from '@/utils/missionProgress';

export default function MissionsPanel() {
  const { user, addExp } = useAuth();
  const { addPoints } = useLoyalty();
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly'>('daily');
  const [missions, setMissions] = useState<Mission[]>([]);
  const [completedMissions, setCompletedMissions] = useState<Set<string>>(new Set());
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [rewardData, setRewardData] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;

    const today = new Date().toDateString();
    const weekStart = getWeekStart();

    const filteredMissions = getMissionsByType(activeTab);

    const completed = new Set<string>();
    filteredMissions.forEach(mission => {
      const key = mission.type === 'daily' 
        ? `urwis_mission_${mission.id}_${user.id}_${today}`
        : `urwis_mission_${mission.id}_${user.id}_${weekStart}`;
      
      if (localStorage.getItem(key)) {
        completed.add(mission.id);
      }
    });
    setCompletedMissions(completed);

    const updatedMissions = filteredMissions.map(mission => {
      const progress = getMissionProgress(mission, user.id);
      return { ...mission, progress };
    });

    setMissions(updatedMissions);
    checkAutoCompletedMissions(updatedMissions, completed);

  }, [user, activeTab]);

  const getWeekStart = () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    return new Date(now.setDate(diff)).toDateString();
  };

  const checkAutoCompletedMissions = (missions: Mission[], completed: Set<string>) => {
    missions.forEach(mission => {
      if (completed.has(mission.id)) return;
      if (mission.progress && mission.progress >= mission.requirement) {
        showNotification(mission);
      }
    });
  };

  const showNotification = (mission: Mission) => {
    const newNotification = {
      id: Date.now(),
      mission: mission,
      timestamp: Date.now()
    };
    setNotifications(prev => [...prev, newNotification]);

    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
    }, 5000);
  };

  const claimMissionReward = (mission: Mission) => {
    if (!user) return;
    if (completedMissions.has(mission.id)) return;
    if (!mission.progress || mission.progress < mission.requirement) {
      alert('Nie ukończyłeś jeszcze tej misji!');
      return;
    }

    addPoints(mission.reward.points, `Misja: ${mission.title}`);
    addExp(mission.reward.exp, `Misja: ${mission.title}`);

    const today = new Date().toDateString();
    const weekStart = getWeekStart();
    const key = mission.type === 'daily' 
      ? `urwis_mission_${mission.id}_${user.id}_${today}`
      : `urwis_mission_${mission.id}_${user.id}_${weekStart}`;
    
    localStorage.setItem(key, 'true');
    setCompletedMissions(prev => new Set([...prev, mission.id]));

    setRewardData({
      title: mission.title,
      points: mission.reward.points,
      exp: mission.reward.exp
    });
    setShowRewardModal(true);
  };

  const removeNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <>
      <div className="bg-white rounded-3xl shadow-2xl p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-black mb-2">Twoje Misje</h2>
            <p className="text-gray-600">Wykonuj zadania i zdobywaj nagrody!</p>
          </div>

          {/* Tab Switch */}
          <div className="flex gap-2 bg-gray-100 p-2 rounded-2xl">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab('daily')}
              className={`px-6 py-3 rounded-xl font-bold transition-all ${
                activeTab === 'daily'
                  ? 'bg-[linear-gradient(to_right,rgb(59,130,246),rgb(168,85,247))] text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              📅 Dzienne
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab('weekly')}
              className={`px-6 py-3 rounded-xl font-bold transition-all ${
                activeTab === 'weekly'
                  ? 'bg-[linear-gradient(to_right,rgb(249,115,22),rgb(239,68,68))] text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              📆 Tygodniowe
            </motion.button>
          </div>
        </div>

        {/* Missions List */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {missions.map((mission, index) => {
              const isCompleted = completedMissions.has(mission.id);
              const canClaim = mission.progress && mission.progress >= mission.requirement && !isCompleted;
              const progressPercent = mission.progress 
                ? Math.min((mission.progress / mission.requirement) * 100, 100) 
                : 0;

              return (
                <motion.div
                  key={mission.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-6 rounded-2xl border-2 transition-all ${
                    isCompleted
                      ? 'bg-green-50 border-green-300'
                      : canClaim
                      ? 'bg-yellow-50 border-yellow-400 shadow-lg'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Icon */}
                    <div className={`text-5xl ${isCompleted ? 'opacity-50' : ''}`}>
                      {mission.icon}
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-xl font-black text-gray-900">
                          {mission.title}
                        </h3>
                        {mission.verifyType === 'auto' && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                            AUTO
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {mission.description}
                      </p>

                      {/* Progress Bar */}
                      <div className="mb-2">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-semibold text-gray-700">
                            Progress: {mission.progress || 0} / {mission.requirement}
                          </span>
                          <span className="text-sm font-bold text-purple-600">
                            {mission.reward.points} pkt • {mission.reward.exp} EXP
                          </span>
                        </div>
                        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full ${
                              isCompleted
                                ? 'bg-green-500'
                                : canClaim
                                ? 'bg-[linear-gradient(to_right,rgb(251,191,36),rgb(249,115,22))]'
                                : 'bg-[linear-gradient(to_right,rgb(96,165,250),rgb(168,85,247))]'
                            }`}
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercent}%` }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div>
                      {isCompleted ? (
                        <div className="px-6 py-3 bg-green-500 text-white rounded-xl font-bold text-center">
                          ✓ Odebrano
                        </div>
                      ) : canClaim ? (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => claimMissionReward(mission)}
                          className="px-6 py-3 bg-[linear-gradient(to_right,rgb(234,179,8),rgb(249,115,22))] text-white rounded-xl font-bold shadow-xl animate-pulse"
                        >
                          🎁 Odbierz!
                        </motion.button>
                      ) : (
                        <div className="px-6 py-3 bg-gray-200 text-gray-500 rounded-xl font-bold text-center">
                          W trakcie...
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="p-4 bg-[linear-gradient(to_bottom_right,rgb(239,246,255),rgb(243,232,255))] rounded-xl text-center border-2 border-blue-200">
            <div className="text-3xl mb-1">📋</div>
            <div className="text-2xl font-black text-blue-600">{missions.length}</div>
            <div className="text-xs text-gray-600">Dostępne</div>
          </div>
          <div className="p-4 bg-[linear-gradient(to_bottom_right,rgb(254,249,195),rgb(254,243,199))] rounded-xl text-center border-2 border-yellow-200">
            <div className="text-3xl mb-1">⏳</div>
            <div className="text-2xl font-black text-orange-600">
              {missions.filter(m => m.progress && m.progress >= m.requirement && !completedMissions.has(m.id)).length}
            </div>
            <div className="text-xs text-gray-600">Do odebrania</div>
          </div>
          <div className="p-4 bg-[linear-gradient(to_bottom_right,rgb(240,253,244),rgb(209,250,229))] rounded-xl text-center border-2 border-green-200">
            <div className="text-3xl mb-1">✅</div>
            <div className="text-2xl font-black text-green-600">{completedMissions.size}</div>
            <div className="text-xs text-gray-600">Ukończone</div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {notifications.map(notification => (
          <MissionNotification
            key={notification.id}
            mission={notification.mission}
            onClose={() => removeNotification(notification.id)}
            onClaim={() => {
              claimMissionReward(notification.mission);
              removeNotification(notification.id);
            }}
          />
        ))}
      </div>

      {/* Reward Modal */}
      <AnimatePresence>
        {showRewardModal && rewardData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowRewardModal(false)}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 max-w-md text-center shadow-2xl"
            >
              <div className="text-7xl mb-4">🎉</div>
              <h3 className="text-3xl font-black mb-2">Misja Ukończona!</h3>
              <p className="text-xl text-gray-700 mb-4">{rewardData.title}</p>
              <div className="p-4 bg-yellow-50 rounded-xl border-2 border-yellow-300 mb-6">
                <div className="text-2xl font-black text-orange-600 mb-1">
                  +{rewardData.points} punktów
                </div>
                <div className="text-lg font-bold text-purple-600">
                  +{rewardData.exp} EXP ✨
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowRewardModal(false)}
                className="px-8 py-3 bg-[linear-gradient(to_right,rgb(234,179,8),rgb(249,115,22))] text-white rounded-full font-bold"
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
