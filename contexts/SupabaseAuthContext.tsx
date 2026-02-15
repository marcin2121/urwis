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
  const [initialized, setInitialized] = useState(false)

  const fetchProfile = async (userId: string) => {
    console.log('🔍 Fetching profile for:', userId)
    console.log('🧪 Supabase client:', !!supabase)

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      console.log('📦 Profile response:', { data: !!data, error: error?.message })

      if (error) {
        console.error('❌ Profile error:', error.message)
        setProfile({
          id: userId,
          username: 'Urwis',
          email: 'urwis@urwis.pl',
          level: 1,
          total_exp: 0,
          role: 'user',
          avatar_url: null,
        } as any)
        return  // ✅ DODANE
      }

      if (data) {
        console.log('✅ Profile loaded:', data.username)
        setProfile(data)
      }
    } catch (error) {
      console.error('💥 fetchProfile crashed:', error)
      setProfile(null)
    } finally {
      console.log('🏁 Setting loading to false')
      setLoading(false)
    }
  }

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
        if (mounted) {
          setInitialized(true)
          setLoading(false)
        }
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
        console.log('🎯 SIGNED_IN - wołam fetchProfile')
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

  // ✅ POPRAWIONE FUNKCJE Z RETURN
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
        return false  // ✅ RETURN
      }

      console.log('✅ Logged in:', data.user?.email)
      return true  // ✅ RETURN
    } catch (err: any) {
      console.error('❌ Login exception:', err)
      alert(err.message || 'Błąd logowania')
      return false  // ✅ RETURN
    } finally {
      setLoading(false)
    }
  }

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
        return false  // ✅ RETURN
      }

      console.log('✅ Registered:', data.user?.email)

      if (data.user && !data.session) {
        alert('✅ Konto utworzone! Sprawdź email aby potwierdzić.')
        return true  // ✅ RETURN
      }

      alert('✅ Konto utworzone! Możesz się teraz zalogować.')
      return true  // ✅ RETURN
    } catch (err: any) {
      console.error('❌ Register exception:', err)
      alert(err.message || 'Błąd rejestracji')
      return false  // ✅ RETURN
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updates: Partial<Profile>): Promise<boolean> => {
    if (!user) {
      console.error('❌ No user to update')
      return false  // ✅ RETURN
    }

    try {
      console.log('🔄 Updating profile:', updates)

      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single()

      if (error) {
        console.error('❌ Update profile error:', error)
        alert('Błąd aktualizacji profilu: ' + error.message)
        return false  // ✅ RETURN
      }

      console.log('✅ Profile updated:', data)
      setProfile(data)
      return true  // ✅ RETURN
    } catch (err: any) {
      console.error('❌ Update profile exception:', err)
      alert(err.message || 'Błąd aktualizacji profilu')
      return false  // ✅ RETURN
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-yellow-50">
        <div className="text-2xl font-bold text-blue-600 animate-bounce">
          Ładowanie Urwisa... 🦸‍♂️⚡
        </div>
        <div className="text-sm text-gray-500 mt-2">
          Sprawdź Console (F12) jeśli wisi >3s
        </div>
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
