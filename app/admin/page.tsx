'use client'

import { useState } from 'react'
// Importujemy hooka z naszego kontekstu (upewnij się, że ścieżka jest poprawna)
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext"
import { PlusCircle, Check, AlertCircle } from 'lucide-react'

export default function AdminPage() {
  // Używamy klienta z kontekstu, zamiast tworzyć nowego
  const { supabase, session } = useSupabaseAuth()
  
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  const [formData, setFormData] = useState({
    title: '',
    old_price: '',
    new_price: '',
    badge: '',
    category: 'Zabawki',
    is_hero_highlight: false
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg("")
    
    if (!session) {
        setErrorMsg("Błąd sesji: Nie jesteś zalogowany.")
        setLoading(false)
        return
    }

    // Konwersja cen (zamiana przecinka na kropkę)
    const oldPrice = parseFloat(formData.old_price.replace(',', '.'))
    const newPrice = parseFloat(formData.new_price.replace(',', '.'))

    if (isNaN(oldPrice) || isNaN(newPrice)) {
        setErrorMsg("Cena musi być poprawną liczbą!")
        setLoading(false)
        return
    }
    
    const { error } = await supabase
      .from('promotions')
      .insert([
        { 
          title: formData.title,
          old_price: oldPrice,
          new_price: newPrice,
          badge: formData.badge,
          category: formData.category,
          is_hero_highlight: formData.is_hero_highlight
        }
      ])

    setLoading(false)
    if (!error) {
      setSuccess(true)
      setFormData({ title: '', old_price: '', new_price: '', badge: '', category: 'Zabawki', is_hero_highlight: false })
      setTimeout(() => setSuccess(false), 3000)
    } else {
      console.error(error)
      setErrorMsg('Błąd zapisu: ' + error.message)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-32 pb-16">
      <div className="container mx-auto px-6 max-w-2xl">
        <div className="bg-white rounded-[2.5rem] p-10 shadow-xl border-2 border-zinc-100">
          <h1 className="text-3xl font-black font-heading mb-8 flex items-center gap-3">
            <PlusCircle className="text-[#BF2024]" /> PANEL ADMINA
          </h1>

          {errorMsg && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2 text-red-600 font-bold text-sm">
                <AlertCircle size={20} /> {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-black mb-2 uppercase tracking-widest">Nazwa produktu</label>
              <input 
                required
                className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-[#0055ff] outline-none transition-all"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                placeholder="np. Klocki LEGO Technic"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-black mb-2 uppercase tracking-widest">Stara Cena</label>
                <input 
                  required type="text"
                  className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none"
                  value={formData.old_price}
                  onChange={e => setFormData({...formData, old_price: e.target.value})}
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-black mb-2 uppercase tracking-widest">Nowa Cena</label>
                <input 
                  required type="text"
                  className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none"
                  value={formData.new_price}
                  onChange={e => setFormData({...formData, new_price: e.target.value})}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-black mb-2 uppercase tracking-widest">Badge (np. -20%)</label>
                <input 
                  className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none"
                  value={formData.badge}
                  onChange={e => setFormData({...formData, badge: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-black mb-2 uppercase tracking-widest">Kategoria</label>
                <select 
                  className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none cursor-pointer"
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                >
                  <option>Zabawki</option>
                  <option>Szkoła</option>
                  <option>Imprezy</option>
                  <option>Gry</option>
                </select>
              </div>
            </div>

            <label className="flex items-center gap-3 cursor-pointer p-4 bg-blue-50 rounded-2xl border-2 border-blue-100 hover:bg-blue-100 transition-colors">
              <input 
                type="checkbox" 
                className="w-5 h-5 accent-[#0055ff]"
                checked={formData.is_hero_highlight}
                onChange={e => setFormData({...formData, is_hero_highlight: e.target.checked})}
              />
              <span className="font-bold text-blue-900">Pokaż na głównej stronie (Gorące Okazje)</span>
            </label>

            <button 
              disabled={loading}
              className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest transition-all ${
                success ? 'bg-green-500 text-white' : 'bg-zinc-900 hover:bg-[#BF2024] text-white shadow-lg cursor-pointer'
              }`}
            >
              {loading ? 'Wysyłanie...' : success ? <span className="flex items-center justify-center gap-2"><Check /> Dodano pomyślnie!</span> : 'Opublikuj promocję'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
