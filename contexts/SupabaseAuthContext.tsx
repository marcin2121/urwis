'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User, Session } from '@supabase/supabase-js'
import type { Profile } from '@/types/database'
import { useRouter } from 'next/navigation'
import { GuestProgress } from '@/lib/guest-progress'

interface AuthContextType {
  user: User | null
  session: Session | null
  profile: Profile | null
  isAuthenticated: boolean
  isAdmin: boolean
  isModerator: boolean
  loading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, username: string, password: string) => Promise<boolean>
  updateProfile: (updates: Partial<Profile>) => Promise<boolean>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const SupabaseAuthContext = createContext<AuthContextType | undefined>(undefined)
const supabase = createClient()

export function SupabaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // 1. Pobieranie profilu
  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // Profil jeszcze nie istnieje (np. trigger nie zadziałał), czekamy.
          setProfile(null)
          return
        }
        throw error
      }
      setProfile(data)
    } catch (err: any) {
      console.error('Error fetching profile:', err.message)
      setProfile(null)
    }
  }, [])

  // 2. Synchronizacja XP Gościa (Nowość!)
  const syncGuestProgress = async (userId: string) => {
    const guestXP = GuestProgress.getXPForTransfer()

    if (guestXP > 0) {
      console.log(`Przenoszenie ${guestXP} XP z konta gościa...`)
      try {
        // Zakładamy, że masz funkcję RPC 'add_user_rewards' w bazie
        const { error } = await supabase.rpc('add_user_rewards', {
          p_user_id: userId,
          p_points: Math.floor(guestXP / 2), // Np. połowa XP jako punkty (coins)
          p_xp: guestXP
        })

        if (!error) {
          GuestProgress.clear() // Wyczyść localStorage po sukcesie
          await fetchProfile(userId) // Odśwież profil, żeby zobaczyć nowe XP
          // Tutaj możesz dodać toast.success("Przeniesiono Twoje XP z gier!")
        }
      } catch (err) {
        console.error('Błąd synchronizacji XP:', err)
      }
    }
  }

  // 3. Inicjalizacja i nasłuchiwanie
  useEffect(() => {
    let mounted = true

    const initAuth = async () => {
      try {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession()
        if (!mounted) return
        if (error) throw error

        setSession(currentSession)
        setUser(currentSession?.user ?? null)

        if (currentSession?.user) {
          await fetchProfile(currentSession.user.id)
        }
      } catch (err) {
        console.error('Auth initialization error:', err)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    initAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!mounted) return
      if (event === 'INITIAL_SESSION') return

      setSession(newSession)
      setUser(newSession?.user ?? null)

      if (newSession?.user && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
        // Przy zalogowaniu sprawdzamy czy user ma XP z bycia gościem
        if (event === 'SIGNED_IN') {
          await syncGuestProgress(newSession.user.id)
        }

        await fetchProfile(newSession.user.id)
        if (mounted) setLoading(false)

      } else if (event === 'SIGNED_OUT') {
        setProfile(null)
        setLoading(false)
        router.push('/')
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [fetchProfile, router])

  // --- Metody Publiczne ---

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })
      if (error) {
        console.error('Login error:', error.message)
        return false
      }
      return true
    } catch (err: any) {
      return false
    } finally {
      setLoading(false)
    }
  }

  const register = async (email: string, username: string, password: string): Promise<boolean> => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: { username: username.trim() },
        },
      })
      if (error) {
        console.error('Register error:', error.message)
        return false
      }
      return true
    } catch (err: any) {
      return false
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updates: Partial<Profile>): Promise<boolean> => {
    if (!user) return false
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single()

      if (error) throw error
      setProfile(data)
      return true
    } catch (err: any) {
      console.error('Update profile error:', err.message)
      return false
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      setUser(null)
      setSession(null)
      setProfile(null)
      router.push('/')
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  const refreshProfile = async () => {
    if (user) await fetchProfile(user.id)
  }

  const isAdmin = profile?.role === 'admin'
  const isModerator = profile?.role === 'moderator' || profile?.role === 'admin'

  return (
    <SupabaseAuthContext.Provider
      value={{
        user, session, profile, isAuthenticated: !!session,
        isAdmin, isModerator, loading,
        login, register, updateProfile, signOut, refreshProfile,
      }}
    >
      {children}
    </SupabaseAuthContext.Provider>
  )
}

export const useSupabaseAuth = () => {
  const context = useContext(SupabaseAuthContext)
  if (context === undefined) {
    throw new Error('useSupabaseAuth must be used within SupabaseAuthProvider')
  }
  return context
}