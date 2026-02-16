'use client'

import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext" // Używamy naszego Contextu
import { motion } from "framer-motion"
import { User, Shield, Star, Edit, LogOut, Settings, Award } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function ProfilPage() {
  // Pobieramy wszystko z Contextu - to rozwiązuje Twój problem z importem createClientComponentClient
  const { profile, signOut, loading, updateProfile } = useSupabaseAuth()
  
  const [isEditing, setIsEditing] = useState(false)
  const [newName, setNewName] = useState("")

  // Funkcja zapisu
  const handleSaveName = async () => {
    if (!newName) return
    try {
      await updateProfile({ full_name: newName }) // Używamy funkcji z Contextu
      setIsEditing(false)
    } catch (error) {
      alert("Błąd podczas zapisu profilu")
    }
  }

  // Jeśli się ładuje, pokaż spinner
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#BF2024]"></div>
      </div>
    )
  }

  // Jeśli brak profilu (niezalogowany), przekieruj lub pokaż komunikat
  if (!profile) {
    return (
      <div className="min-h-screen pt-32 text-center">
        <h1 className="text-2xl font-bold mb-4">Musisz się zalogować!</h1>
        <Link href="/" className="text-blue-600 underline">Wróć na stronę główną</Link>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container mx-auto px-6 max-w-4xl">
        
        {/* Karta Główna Profilu */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-gray-100 overflow-hidden relative"
        >
          {/* Tło dekoracyjne */}
          <div className="absolute top-0 left-0 w-full h-32 bg-linear-to-r from-[#BF2024] to-[#0055ff] opacity-10" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 mt-4">
            {/* Avatar */}
            <div className="w-32 h-32 rounded-full bg-gray-100 border-4 border-white shadow-lg flex items-center justify-center text-4xl font-black text-gray-300">
               {profile.avatar_url ? (
                 // Tu mógłby być <Image>
                 <span className="text-sm">IMG</span> 
               ) : (
                 <User size={64} />
               )}
            </div>

            {/* Dane */}
            <div className="flex-1 text-center md:text-left space-y-2">
              <div className="flex items-center justify-center md:justify-start gap-3">
                <span className="px-3 py-1 bg-blue-100 text-blue-600 text-xs font-black uppercase tracking-widest rounded-full">
                  Poziom {profile.level}
                </span>
                {profile.role === 'admin' && (
                  <span className="px-3 py-1 bg-red-100 text-red-600 text-xs font-black uppercase tracking-widest rounded-full flex items-center gap-1">
                    <Shield size={12} /> Admin
                  </span>
                )}
              </div>

              {isEditing ? (
                <div className="flex items-center gap-2">
                    <input 
                        className="text-3xl font-black font-heading text-gray-900 border-b-2 border-blue-500 outline-none"
                        defaultValue={profile.full_name || profile.username}
                        onChange={(e) => setNewName(e.target.value)}
                        autoFocus
                    />
                    <button onClick={handleSaveName} className="text-sm bg-black text-white px-3 py-1 rounded-full">Zapisz</button>
                    <button onClick={() => setIsEditing(false)} className="text-sm text-gray-500">Anuluj</button>
                </div>
              ) : (
                <h1 className="text-3xl md:text-5xl font-black font-heading text-gray-900 flex items-center justify-center md:justify-start gap-4">
                    {profile.full_name || profile.username}
                    <button onClick={() => setIsEditing(true)} className="text-gray-400 hover:text-blue-500 transition-colors">
                        <Edit size={24} />
                    </button>
                </h1>
              )}
              
              <p className="text-gray-500 font-bold">@{profile.username}</p>

              {/* Pasek XP */}
              <div className="max-w-md mt-4">
                <div className="flex justify-between text-xs font-bold text-gray-400 mb-1">
                  <span>XP: {profile.xp}</span>
                  <span>Następny poziom: {profile.level * 1000}</span>
                </div>
                <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(profile.xp / (profile.level * 1000)) * 100}%` }}
                    className="h-full bg-linear-to-r from-[#BF2024] to-[#0055ff]"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Grid Opcji */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
           {/* Osiągnięcia */}
           <div className="bg-white p-6 rounded-[2rem] shadow-lg border border-gray-100">
              <h3 className="font-black text-xl mb-4 flex items-center gap-2">
                 <Award className="text-[#f59e0b]" /> Twoje Osiągnięcia
              </h3>
              <div className="grid grid-cols-4 gap-2">
                 {[1,2,3,4].map(i => (
                    <div key={i} className="aspect-square bg-gray-50 rounded-xl flex items-center justify-center text-gray-300">
                        <Star size={20} />
                    </div>
                 ))}
              </div>
              <p className="text-xs text-gray-400 mt-4 text-center">Wykonywanie misji odblokowuje odznaki!</p>
           </div>

           {/* Ustawienia */}
           <div className="bg-white p-6 rounded-[2rem] shadow-lg border border-gray-100 flex flex-col justify-between">
              <div>
                <h3 className="font-black text-xl mb-4 flex items-center gap-2">
                    <Settings className="text-gray-400" /> Konto
                </h3>
                <p className="text-sm text-gray-500">Zarządzaj swoim kontem Urwisa.</p>
              </div>
              
              <div className="space-y-3 mt-6">
                {profile.role === 'admin' && (
                    <Link href="/admin" className="block w-full py-3 bg-zinc-900 text-white text-center rounded-xl font-bold uppercase tracking-widest hover:bg-[#BF2024] transition-colors">
                        Panel Admina
                    </Link>
                )}
                <button 
                    onClick={signOut}
                    className="w-full py-3 border-2 border-red-100 text-red-500 text-center rounded-xl font-bold uppercase tracking-widest hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                >
                    <LogOut size={18} /> Wyloguj się
                </button>
              </div>
           </div>
        </div>

      </div>
    </main>
  )
}
