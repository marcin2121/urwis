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
  refreshProfile: () => Promise<void>
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
    console.log('[v0] Auth context initializing...')
    let isMounted = true
    const initAuth = async () => {
      try {
        console.log('[v0] Getting session...')
        const {
          data: { session: currentSession },
        } = await supabase.auth.getSession()
        
        if (!isMounted) return
        
        console.log('[v0] Session retrieved:', !!currentSession?.user)
        setSession(currentSession)
        setUser(currentSession?.user ?? null)

        if (currentSession?.user) {
          console.log('[v0] Fetching profile for user:', currentSession.user.id)
          await fetchProfile(currentSession.user.id)

          // Migrate localStorage data on first login
          if (!migrationDone && localStorage.getItem('urwis_points')) {
            const result = await migrateLocalStorageToSupabase(currentSession.user.id)
            if (result.success) {
              console.log('[v0] Migrated data:', result.migratedData)
              if (isMounted) setMigrationDone(true)
            }
          }
        }
      } catch (error) {
        console.error('[v0] Error initializing auth:', error)
      } finally {
        if (isMounted) {
          console.log('[v0] Auth initialization complete')
          setIsLoading(false)
        }
      }
    }

    initAuth()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log('[v0] Auth state changed:', event)
      if (!isMounted) return
      
      setSession(newSession)
      setUser(newSession?.user ?? null)

      if (newSession?.user) {
        await fetchProfile(newSession.user.id)
      } else {
        setProfile(null)
      }
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  const fetchProfile = async (userId: string) => {
    console.log('[v0] fetchProfile starting for:', userId)
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // Profile doesn't exist yet - that's OK for new users
          console.log('[v0] Profile not found for user:', userId)
          setProfile(null)
        } else {
          console.error('[v0] Unexpected error fetching profile:', error.code, error.message)
          throw error
        }
      } else {
        console.log('[v0] Profile fetched successfully for:', userId)
        setProfile(data)
      }
    } catch (error) {
      console.error('[v0] Error fetching profile:', error)
      setProfile(null)
    }
  }

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
    console.log('[v0] signIn attempting for:', email)
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error('[v0] signIn failed:', error.message)
        throw error
      }
      console.log('[v0] signIn successful')
      return { error: undefined }
    } catch (error: any) {
      console.error('[v0] signIn error:', error.message)
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
        refreshProfile,
      }}
    >
      {children}
    </SupabaseAuthContext.Provider>
  )
}

// Compatibility hook dla starych komponentów
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

  return {
    // ← GŁÓWNE (nowe API):
    user: context.user,
    profile: context.profile,
    session: context.session,
    isLoading: context.isLoading,
    signUp: context.signUp,
    signIn: context.signIn,
    signOut: context.signOut,
    updateProfile: context.updateProfile,
    refreshProfile: context.refreshProfile,

    // ← COMPATIBILITY (stare API):
    isAuthenticated: !!context.user,

    // ← MAPPED user object
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

    // ← LEGACY functions
    login: async (email: string, password: string) => {
      const result = await context.signIn(email, password)
      return { error: result.error }
    },
    register: async (email: string, username: string, password: string) => {
      const result = await context.signUp(email, password, username)
      return { error: result.error }
    },
    logout: context.signOut,
    updateAvatar: async (avatar: string) => {
      await context.updateProfile({ avatar_url: avatar })
    },
  }
}

export { SupabaseAuthContext }
