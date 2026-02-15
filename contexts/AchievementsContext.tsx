'use client'

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useSupabaseAuth } from './SupabaseAuthContext'

interface Achievement {
  id: string
  name: string
  description: string
  icon_url: string | null
  unlock_condition: string | null
  created_at: string
}

interface UserAchievement {
  id: string
  achievement_id: string
  earned_at: string
  achievement?: Achievement
}

interface AchievementsContextType {
  achievements: Achievement[]
  userAchievements: UserAchievement[]
  loading: boolean
  error: string | null
  unlockAchievement: (achievementId: string) => Promise<void>
  checkAchievements: (type: string, value: number) => Promise<void>
}

const AchievementsContext = createContext<AchievementsContextType | undefined>(undefined)

export function AchievementsProvider({ children }: { children: ReactNode }) {
  const { user, profile } = useSupabaseAuth()
  const supabase = createClient()

  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch all achievements
  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        setLoading(true)
        const { data, error: fetchError } = await supabase
          .from('achievements')
          .select('*')
          .order('created_at', { ascending: true })

        if (fetchError) throw fetchError
        setAchievements(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchAchievements()
  }, [])

  // Fetch user achievements
  useEffect(() => {
    if (!user?.id) return

    const fetchUserAchievements = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('user_achievements')
          .select('*, achievement:achievements(*)')
          .eq('user_id', user.id)

        if (fetchError) throw fetchError
        setUserAchievements(data)
      } catch (err: any) {
        setError(err.message)
      }
    }

    fetchUserAchievements()
  }, [user?.id])

  // Subscribe to new achievements
  useEffect(() => {
    if (!user?.id) return

    const channel = supabase
      .channel(`user-achievements-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'user_achievements',
          filter: `user_id=eq.${user.id}`,
        },
        (payload: any) => {
          setUserAchievements((prev) => [...prev, payload.new])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user?.id])

  const unlockAchievement = useCallback(
    async (achievementId: string) => {
      if (!user?.id) return

      try {
        // Check if already unlocked
        const existing = userAchievements.find(
          (ua) => ua.achievement_id === achievementId
        )
        if (existing) return

        // Unlock achievement
        const { error: insertError } = await supabase.from('user_achievements').insert({
          user_id: user.id,
          achievement_id: achievementId,
        })

        if (insertError) throw insertError
      } catch (err: any) {
        setError(err.message)
      }
    },
    [user?.id, userAchievements]
  )

  const checkAchievements = useCallback(
    async (type: string, value: number) => {
      if (!user?.id || !profile) return

      const alreadyUnlocked = userAchievements.map((ua) => ua.achievement_id)

      // Define achievement unlock conditions
      const unlockedConditions: { [key: string]: boolean } = {
        'first-100-exp': profile.total_exp >= 100 && !alreadyUnlocked.includes('first-100-exp'),
        'collector': profile.total_exp >= 500 && !alreadyUnlocked.includes('collector'),
        'master': profile.total_exp >= 1000 && !alreadyUnlocked.includes('master'),
        'level-5': profile.level >= 5 && !alreadyUnlocked.includes('level-5'),
        'level-10': profile.level >= 10 && !alreadyUnlocked.includes('level-10'),
      }

      // Unlock eligible achievements
      for (const [achievementId, shouldUnlock] of Object.entries(unlockedConditions)) {
        if (shouldUnlock) {
          await unlockAchievement(achievementId)
        }
      }
    },
    [user?.id, profile, userAchievements, unlockAchievement]
  )

  return (
    <AchievementsContext.Provider
      value={{
        achievements,
        userAchievements,
        loading,
        error,
        unlockAchievement,
        checkAchievements,
      }}
    >
      {children}
    </AchievementsContext.Provider>
  )
}

export function useAchievements() {
  const context = useContext(AchievementsContext)
  if (!context) {
    throw new Error('useAchievements must be used within AchievementsProvider')
  }
  return context
}
