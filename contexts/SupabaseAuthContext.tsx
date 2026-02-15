'use client'
import { createContext, useContext, useEffect, useState } from 'react'
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
  login: (email: string, password: string) => Promise<boolean>  // ✅ DODANE
  register: (email: string, username: string, password: string) => Promise<boolean>  // ✅ DODANE
  signOut: () => Promise<void>
}

const SupabaseAuthContext = createContext<AuthContextType | undefined>(undefined)

const supabase = createClient()

export function SupabaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    if (initialized) return

    let mounted = true

    const initAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()

        if (!mounted) return

        if (error) {
          console.error('❌ Session error:', error)
          setLoading(false)
          return
        }

        console.log('✅ Initial session:', session?.user?.email || 'No session')
        setSession(session)
        setUser(session?.user ?? null)

        if (session?.user) {
          await fetchProfile(session.user.id)
        } else {
          setLoading(false)
        }
      } catch (err) {
        console.error('❌ Init auth error:', err)
        if (mounted) setLoading(false)
      } finally {
        if (mounted) setInitialized(true)
      }
    }

    initAuth()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return

      console.log('🔔 Auth event:', event, session?.user?.email || 'No user')

      if (event === 'INITIAL_SESSION') return

      setSession(session)
      setUser(session?.user ?? null)

      if (session?.user && event === 'SIGNED_IN') {
        await fetchProfile(session.user.id)
      } else if (event === 'SIGNED_OUT') {
        setProfile(null)
        setLoading(false)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [initialized])

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('❌ Profile error:', error)
        throw error
      }

      console.log('✅ Profile loaded:', data?.username, 'Role:', data?.role)
      setProfile(data)
    } catch (error) {
      console.error('❌ Fetch profile error:', error)
    } finally {
      setLoading(false)
    }
  }

  // ✅ LOGIN FUNCTION
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('🔐 Logging in:', email)
      setLoading(true)

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      })

      if (error) {
        console.error('❌ Login error:', error)
        alert(error.message)
        return false
      }

      console.log('✅ Logged in:', data.user?.email)
      return true
    } catch (err: any) {
      console.error('❌ Login exception:', err)
      alert(err.message || 'Błąd logowania')
      return false
    } finally {
      setLoading(false)
    }
  }

  // ✅ REGISTER FUNCTION
  const register = async (email: string, username: string, password: string): Promise<boolean> => {
    try {
      console.log('📝 Registering:', email, username)
      setLoading(true)

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
          data: {
            username: username.trim(),
          },
        },
      })

      if (error) {
        console.error('❌ Register error:', error)
        alert(error.message)
        return false
      }

      console.log('✅ Registered:', data.user?.email)

      // Check if email confirmation is required
      if (data.user && !data.session) {
        alert('✅ Konto utworzone! Sprawdź email aby potwierdzić.')
        return true
      }

      alert('✅ Konto utworzone! Możesz się teraz zalogować.')
      return true
    } catch (err: any) {
      console.error('❌ Register exception:', err)
      alert(err.message || 'Błąd rejestracji')
      return false
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      console.log('🚪 Signing out...')

      setUser(null)
      setSession(null)
      setProfile(null)

      const { error } = await supabase.auth.signOut()

      if (error) throw error

      window.location.href = '/'
    } catch (error) {
      console.error('❌ Sign out error:', error)
    }
  }

  const isAdmin = profile?.role === 'admin'
  const isModerator = profile?.role === 'moderator' || profile?.role === 'admin'

  if (loading && !initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-bold">Ładowanie... 🦸‍♂️</div>
      </div>
    )
  }

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
        login,      // ✅ DODANE
        register,   // ✅ DODANE
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
