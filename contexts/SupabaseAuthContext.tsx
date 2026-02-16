'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User, Session } from '@supabase/supabase-js'
import type { Profile } from '@/types/database'
import { useRouter } from 'next/navigation'
// Zakładam, że masz bibliotekę do powiadomień, np. sonner lub react-hot-toast
// import { toast } from 'sonner' 

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
  refreshProfile: () => Promise<void> // Nowa funkcja pomocnicza
}

const SupabaseAuthContext = createContext<AuthContextType | undefined>(undefined)
const supabase = createClient()

export function SupabaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Pobieranie profilu z bazy danych
  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        // Jeśli profil nie istnieje (PGRST116), to normalne przy pierwszej rejestracji,
        // zanim trigger zadziała. Nie tworzymy tu fake'owego profilu.
        if (error.code === 'PGRST116') {
          console.warn('Profile not found yet (waiting for trigger or creation).')
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

  // Inicjalizacja sesji
  useEffect(() => {
    let mounted = true

    const initAuth = async () => {
      try {
        // Pobierz sesję początkową
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

    // Nasłuchiwanie zmian w autoryzacji
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!mounted) return

      // Ignoruj INITIAL_SESSION, bo obsłużyliśmy to w initAuth
      if (event === 'INITIAL_SESSION') return

      setSession(newSession)
      setUser(newSession?.user ?? null)

      if (newSession?.user && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
        setLoading(true) // Pokaż loading podczas odświeżania profilu
        await fetchProfile(newSession.user.id)
        if (mounted) setLoading(false)
      } else if (event === 'SIGNED_OUT') {
        setProfile(null)
        setLoading(false)
        router.push('/') // Opcjonalnie: przekieruj na stronę główną
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [fetchProfile, router])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (error) {
        // toast.error(error.message)
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
            // Możemy tu dodać avatar_url itp.
          },
        },
      })

      if (error) {
        // toast.error(error.message)
        console.error('Register error:', error.message)
        return false
      }

      // toast.success('Sprawdź email, aby potwierdzić konto!')
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

      if (error) throw error

      setProfile(data)
      // toast.success('Profil zaktualizowany')
      return true
    } catch (err: any) {
      console.error('Update profile error:', err.message)
      // toast.error('Błąd aktualizacji profilu')
      return false
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      // Stan wyczyści się automatycznie dzięki onAuthStateChange
      // ale dla pewności przy nawigacji:
      setUser(null)
      setSession(null)
      setProfile(null)
      router.push('/')
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id)
    }
  }

  // Role
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
        refreshProfile,
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