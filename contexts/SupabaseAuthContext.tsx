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
  signOut: () => Promise<void>
}

const SupabaseAuthContext = createContext<AuthContextType | undefined>(undefined)

// ✅ Client POZA komponentem (singleton)
const supabase = createClient()

export function SupabaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    if (initialized) return // ✅ Prevent double init

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

    // ✅ Auth listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return

      console.log('🔔 Auth event:', event, session?.user?.email || 'No user')

      // ✅ Ignore initial SIGNED_IN (już mamy session)
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

  const signOut = async () => {
    try {
      console.log('🚪 Signing out...')

      // ✅ Clear state first
      setUser(null)
      setSession(null)
      setProfile(null)

      const { error } = await supabase.auth.signOut()

      if (error) throw error

      // ✅ Force reload
      window.location.href = '/'
    } catch (error) {
      console.error('❌ Sign out error:', error)
    }
  }

  const isAdmin = profile?.role === 'admin'
  const isModerator = profile?.role === 'moderator' || profile?.role === 'admin'

  // ✅ Show loading state
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
