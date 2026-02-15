'use client'
import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User, Session } from '@supabase/supabase-js'
import type { Profile } from '@/types/database'

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
}

const SupabaseAuthContext = createContext<AuthContextType | undefined>(undefined)
const supabase = createClient()

export function SupabaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = useCallback(async (userId: string, email?: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // Profile doesn't exist yet - create a fallback
          const fallback: Profile = {
            id: userId,
            username: email?.split('@')[0]?.replace('.', '_') || 'Urwis',
            email: email || '',
            level: 1,
            total_exp: 0,
            role: 'user',
            avatar_url: null,
            created_at: new Date().toISOString(),
          }
          setProfile(fallback)
          return
        }
        throw error
      }
      setProfile(data)
    } catch (err) {
      console.error('Error fetching profile:', err)
      // Set a minimal fallback so the app doesn't break
      setProfile({
        id: userId,
        username: email?.split('@')[0]?.replace('.', '_') || 'Urwis',
        email: email || '',
        level: 1,
        total_exp: 0,
        role: 'user',
        avatar_url: null,
        created_at: new Date().toISOString(),
      })
    }
  }, [])

  useEffect(() => {
    let mounted = true

    const initAuth = async () => {
      try {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession()

        if (!mounted) return

        if (error) {
          console.error('Session error:', error)
          setLoading(false)
          return
        }

        setSession(currentSession)
        setUser(currentSession?.user ?? null)

        if (currentSession?.user) {
          await fetchProfile(currentSession.user.id, currentSession.user.email ?? undefined)
        }
      } catch (err) {
        console.error('Init auth error:', err)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    initAuth()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!mounted) return
      if (event === 'INITIAL_SESSION') return

      setSession(newSession)
      setUser(newSession?.user ?? null)

      if (newSession?.user && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
        await fetchProfile(newSession.user.id, newSession.user.email ?? undefined)
        if (mounted) setLoading(false)
      } else if (event === 'SIGNED_OUT') {
        setProfile(null)
        if (mounted) setLoading(false)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [fetchProfile])

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
      console.error('Login exception:', err.message)
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
          data: {
            username: username.trim(),
          },
        },
      })

      if (error) {
        console.error('Register error:', error.message)
        return false
      }

      return true
    } catch (err: any) {
      console.error('Register exception:', err.message)
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

      if (error) {
        console.error('Update profile error:', error.message)
        return false
      }

      setProfile(data)
      return true
    } catch (err: any) {
      console.error('Update profile exception:', err.message)
      return false
    }
  }

  const signOut = async () => {
    try {
      setUser(null)
      setSession(null)
      setProfile(null)

      const { error } = await supabase.auth.signOut()
      if (error) throw error

      window.location.href = '/'
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  const isAdmin = profile?.role === 'admin'
  const isModerator = profile?.role === 'moderator' || profile?.role === 'admin'

  return (
    <SupabaseAuthContext.Provider
      value={{
        user,
        session,
        profile,
        isAuthenticated: !!session,
        isAdmin,
        isModerator,
        loading,
        login,
        register,
        updateProfile,
        signOut,
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
