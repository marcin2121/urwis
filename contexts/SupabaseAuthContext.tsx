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
  addExp: (amount: number) => Promise<{ error?: string }>
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

  const addExp = async (amount: number) => {
    if (!user || !profile) return { error: 'No user or profile' }

    try {
      const newTotalExp = profile.total_exp + amount

      // Update profile with new exp
      const { error } = await supabase
        .from('profiles')
        .update({ total_exp: newTotalExp })
        .eq('id', user.id)

      if (error) throw error

      // Log exp transaction
      await supabase.from('loyalty_points').insert({
        user_id: user.id,
        amount,
        reason: 'Experience gained',
      })

      setProfile((prev) =>
        prev ? { ...prev, total_exp: newTotalExp } : null
      )

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
      }}
    >
      {children}
    </SupabaseAuthContext.Provider>
  )
}

export function useSupabaseAuth() {
  const context = useContext(SupabaseAuthContext)
  if (context === undefined) {
    throw new Error('useSupabaseAuth must be used within SupabaseAuthProvider')
  }
  return context
}

// Compatibility hook for existing components using useAuth
export function useAuth() {
  const context = useContext(SupabaseAuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within SupabaseAuthProvider (AuthProvider is now SupabaseAuthProvider)')
  }
  
  // Map Supabase auth context to old AuthContext interface for backward compatibility
  return {
    user: context.profile ? {
      id: context.profile.id,
      email: context.profile.email,
      username: context.profile.username,
      level: context.profile.level,
      exp: context.profile.total_exp,
      expToNextLevel: 100 * context.profile.level * 1.5, // Approximate
      avatar: context.profile.avatar_url || '🧸',
      createdAt: context.profile.created_at,
    } : null,
    isAuthenticated: !!context.user,
    login: async (email: string, password: string) => {
      const result = await context.signIn(email, password)
      return !result.error
    },
    register: async (email: string, username: string, password: string) => {
      const result = await context.signUp(email, password, username)
      return !result.error
    },
    logout: context.signOut,
    addExp: async (amount: number) => {
      await context.addExp(amount)
    },
    updateAvatar: async (avatar: string) => {
      await context.updateProfile({ avatar_url: avatar })
    },
  }
}
