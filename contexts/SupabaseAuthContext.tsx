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
  updateProfile: (updates: Partial<Profile>) => Promise<boolean>  // ✅ DODANE
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

  // ... (cały poprzedni kod useEffect, fetchProfile, login, register) ...

  // ✅ UPDATE PROFILE FUNCTION
  const updateProfile = async (updates: Partial<Profile>): Promise<boolean> => {
    if (!user) {
      console.error('❌ No user to update')
      return false
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
        return false
      }

      console.log('✅ Profile updated:', data)
      setProfile(data)
      return true
    } catch (err: any) {
      console.error('❌ Update profile exception:', err)
      alert(err.message || 'Błąd aktualizacji profilu')
      return false
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
        login,
        register,
        updateProfile,  // ✅ DODANE
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
