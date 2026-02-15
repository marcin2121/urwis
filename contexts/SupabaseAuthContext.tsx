'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { createClient } from '@/lib/supabase/client'
import { migrateLocalStorageToSupabase } from '@/lib/migrations/migrateLocalStorage'
import type { User as SupabaseUser, Session } from '@supabase/supabase-js'

interface UserProfile {
  id: string
  username: string
  email: string
  avatar_url: string | null
  level: number
  total_exp: number
  created_at: string
  updated_at: string
}

interface SupabaseAuthContextType {
  user: SupabaseUser | null
  profile: UserProfile | null
  session: Session | null
  isLoading: boolean
  signUp: (email: string, password: string, username: string) => Promise<{ error?: string }>
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error?: string }>
  addExp: (amount: number, reason?: string) => Promise<{ error?: string }> // ← DODAJ reason
  refreshProfile: () => Promise<void> // ← DODAJ
}

const SupabaseAuthContext = createContext<SupabaseAuthContextType | undefined>(undefined)

export function SupabaseAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [migrationDone, setMigrationDone] = useState(false)
  const supabase = createClient()

  // Initialize auth session
  useEffect(() => {
    const initAuth = async () => {
      try {
        const {
          data: { session: currentSession },
        } = await supabase.auth.getSession()
        setSession(currentSession)
        setUser(currentSession?.user ?? null)

        if (currentSession?.user) {
          await fetchProfile(currentSession.user.id)

          // Migrate localStorage data on first login
          if (!migrationDone && localStorage.getItem('urwis_points')) {
            const result = await migrateLocalStorageToSupabase(currentSession.user.id)
            if (result.success) {
              console.log('[v0] Migrated data:', result.migratedData)
              setMigrationDone(true)
            }
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      setSession(newSession)
      setUser(newSession?.user ?? null)

      if (newSession?.user) {
        await fetchProfile(newSession.user.id)
      } else {
        setProfile(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error
      setProfile(data)
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  // ← DODAJ funkcję refreshProfile
  const refreshProfile = async () => {
    if (!user) return
    await fetchProfile(user.id)
  }

  const signUp = async (email: string, password: string, username: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
          emailRedirectTo: `${window.location.origin}/auth/sign-up-success`,
        },
      })

      if (error) throw error

      return { error: undefined }
    } catch (error: any) {
      return { error: error.message }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
      return { error: undefined }
    } catch (error: any) {
      return { error: error.message }
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      setProfile(null)
      setSession(null)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return { error: 'No user logged in' }

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)

      if (error) throw error

      setProfile((prev) => (prev ? { ...prev, ...updates } : null))
      return { error: undefined }
    } catch (error: any) {
      return { error: error.message }
    }
  }

  // ← ZMIANA: dodaj parametr reason
  const addExp = async (amount: number, reason?: string) => {
    if (!user || !profile) return { error: 'No user or profile' }

    try {
      const newTotalExp = profile.total_exp + amount
      const oldLevel = profile.level

      // Oblicz nowy poziom (przykładowy wzór - dostosuj do swoich potrzeb)
      const newLevel = Math.floor(Math.sqrt(newTotalExp / 100)) + 1

      // Update profile with new exp and level
      const { error } = await supabase
        .from('profiles')
        .update({
          total_exp: newTotalExp,
          level: newLevel
        })
        .eq('id', user.id)

      if (error) throw error

      // ← ZMIANA: Log exp transaction z powodem
      await supabase.from('exp_history').insert({
        user_id: user.id,
        amount,
        reason: reason || 'Experience gained', // ← Użyj reason
        new_total: newTotalExp,
      })

      setProfile((prev) =>
        prev ? { ...prev, total_exp: newTotalExp, level: newLevel } : null
      )

      // ← BONUS: Pokaż notyfikację jeśli level up
      if (newLevel > oldLevel) {
        console.log(`🎉 Level UP! ${oldLevel} → ${newLevel}`)
        // Możesz tu dodać toast notification
      }

      return { error: undefined }
    } catch (error: any) {
      return { error: error.message }
    }
  }

  return (
    <SupabaseAuthContext.Provider
      value={{
        user,
        profile,
        session,
        isLoading,
        signUp,
        signIn,
        signOut,
        updateProfile,
        addExp,
        refreshProfile, // ← DODAJ
      }}
    >
      {children}
    </SupabaseAuthContext.Provider>
  )
}

// ← ULEPSZONE: Compatibility hook dla starych komponentów
export function useSupabaseAuth() {
  const context = useContext(SupabaseAuthContext)
  if (context === undefined) {
    throw new Error('useSupabaseAuth must be used within SupabaseAuthProvider')
  }

  // Oblicz exp do następnego poziomu
  const calculateExpToNextLevel = (level: number, currentExp: number) => {
    const nextLevelRequirement = Math.pow(level + 1, 2) * 100
    return nextLevelRequirement - currentExp
  }

  // Map Supabase auth context to old AuthContext interface
  return {
    // ← GŁÓWNE (nowe API):
    user: context.user, // ← Supabase User
    profile: context.profile, // ← UserProfile
    session: context.session,
    isLoading: context.isLoading,
    signUp: context.signUp,
    signIn: context.signIn,
    signOut: context.signOut,
    updateProfile: context.updateProfile,
    addExp: context.addExp, // ← Teraz z reason!
    refreshProfile: context.refreshProfile, // ← DODAJ

    // ← COMPATIBILITY (stare API dla komponentów):
    isAuthenticated: !!context.user,

    // ← MAPPED user object (dla DailyCalendar, MissionsPanel itp.)
    userLegacy: context.profile ? {
      id: context.profile.id,
      email: context.profile.email,
      username: context.profile.username,
      level: context.profile.level,
      exp: context.profile.total_exp,
      expToNextLevel: calculateExpToNextLevel(context.profile.level, context.profile.total_exp),
      avatar: context.profile.avatar_url || '🧸',
      createdAt: context.profile.created_at,
    } : null,

    // ← LEGACY functions (dla starych komponentów):
    login: async (email: string, password: string) => {
      const result = await context.signIn(email, password)
      return { error: result.error } // ← Poprawka: zwracaj error, nie boolean
    },
    register: async (email: string, username: string, password: string) => {
      const result = await context.signUp(email, password, username)
      return { error: result.error } // ← Poprawka: zwracaj error
    },
    logout: context.signOut,
    updateAvatar: async (avatar: string) => {
      await context.updateProfile({ avatar_url: avatar })
    },
  }
}

// ← DODAJ: Export raw context dla zaawansowanych przypadków
export { SupabaseAuthContext }
