'use client'

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import { useSupabaseAuth } from './SupabaseAuthContext'
import { createClient } from '@/lib/supabase/client'

interface LoyaltyContextType {
  profile: any
  points: number
  level: number
  totalExp: number
  badges: any[]
  userBadges: any[]
  addPoints: (amount: number, reason: string) => Promise<void>
  addExp: (amount: number) => Promise<void>
  earnBadge: (badgeId: string) => Promise<void>
  loading: boolean
  error: string | null
}

const LoyaltyContext = createContext<LoyaltyContextType | undefined>(undefined)

export function SupabaseLoyaltyProvider({ children }: { children: ReactNode }) {
  const { user } = useSupabaseAuth()
  const supabase = createClient()

  const [profile, setProfile] = useState<any>(null)
  const [points, setPoints] = useState(0)
  const [totalExp, setTotalExp] = useState(0)
  const [level, setLevel] = useState(1)
  const [badges, setBadges] = useState<any[]>([])
  const [userBadges, setUserBadges] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch user profile
  useEffect(() => {
    if (!user?.id) {
      setLoading(false)
      return
    }

    const fetchProfile = async () => {
      try {
        setLoading(true)
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (profileError) throw profileError

        setProfile(profileData)
        setPoints(profileData.total_exp || 0)
        setTotalExp(profileData.total_exp || 0)
        setLevel(profileData.level || 1)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [user?.id])

  // Subscribe to real-time profile updates
  useEffect(() => {
    if (!user?.id) return

    const channel = supabase
      .channel(`profile-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${user.id}`,
        },
        (payload) => {
          setProfile(payload.new)
          setLevel(payload.new.level)
          setTotalExp(payload.new.total_exp)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user?.id])

  const addPoints = useCallback(
    async (amount: number, reason: string) => {
      if (!user?.id) return

      try {
        // Add to loyalty_points table
        const { error: insertError } = await supabase.from('loyalty_points').insert({
          user_id: user.id,
          amount,
          reason,
        })

        if (insertError) throw insertError

        // Update profile total_exp
        const newTotal = (profile?.total_exp || 0) + amount
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ total_exp: newTotal })
          .eq('id', user.id)

        if (updateError) throw updateError

        setPoints(newTotal)
        setTotalExp(newTotal)
      } catch (err: any) {
        setError(err.message)
      }
    },
    [user?.id, profile]
  )

  const addExp = useCallback(
    async (amount: number) => {
      if (!user?.id) return

      try {
        const newTotal = (profile?.total_exp || 0) + amount
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ total_exp: newTotal })
          .eq('id', user.id)

        if (updateError) throw updateError

        setTotalExp(newTotal)
      } catch (err: any) {
        setError(err.message)
      }
    },
    [user?.id, profile]
  )

  const earnBadge = useCallback(
    async (badgeId: string) => {
      if (!user?.id) return

      try {
        const { error: insertError } = await supabase.from('user_badges').insert({
          user_id: user.id,
          badge_id: badgeId,
        })

        if (insertError && !insertError.message.includes('duplicate')) throw insertError
      } catch (err: any) {
        setError(err.message)
      }
    },
    [user?.id]
  )

  return (
    <LoyaltyContext.Provider
      value={{
        profile,
        points,
        level,
        totalExp,
        badges,
        userBadges,
        addPoints,
        addExp,
        earnBadge,
        loading,
        error,
      }}
    >
      {children}
    </LoyaltyContext.Provider>
  )
}

export function useSupabaseLoyalty() {
  const context = useContext(LoyaltyContext)
  if (!context) {
    throw new Error('useSupabaseLoyalty must be used within SupabaseLoyaltyProvider')
  }
  return context
}
