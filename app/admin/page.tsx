'use client'

import { useEffect, useState } from 'react'
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Users, ShieldCheck, Search, Plus, Minus, Star, 
  Package, CheckCircle, Clock, ShoppingBag, RefreshCw, XCircle
} from 'lucide-react'

export default function AdminDashboard() {
  const { profile, supabase, loading: authLoading } = useSupabaseAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState<'users' | 'orders'>('users')
  
  // Stany dla danych
  const [users, setUsers] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => { setMounted(true) }, [])

  const fetchData = async () => {
    setLoadingData(true)
    if (activeTab === 'users') {
      const { data } = await supabase.from('profiles').select('*').order('points', { ascending: false })
      if (data) setUsers(data)
    } else {
      // Pobieramy zamówienia z dołączonymi danymi profilu i nagrody
      const { data } = await supabase
        .from('reward_claims')
        .select(`
          *,
          profiles:user_id (username, avatar_url),
          rewards:reward_id (name, image_url, cost)
        `)
        .order('created_at', { ascending: false })
      if (data) setOrders(data)
    }
    setLoadingData(false)
  }

  useEffect(() => {
    if (mounted && profile?.role === 'admin') {
      fetchData()
    } else if (mounted && !authLoading && profile?.role !== 'admin') {
      router.push('/')
    }
  }, [mounted, profile, authLoading, activeTab])

  // Funkcja zmiany punktów
  const adjustPoints = async (userId: string, amount: number) => {
    const user = users.find(u => u.id === userId)
    const newPoints = Math.max(0, (user?.points || 0) + amount)
    const { error } = await supabase.from('profiles').update({ points: newPoints }).eq('id', userId)
    if (!error) setUsers(users.map(u => u.id === userId ? { ...u, points: newPoints } : u))
  }

  // Funkcja wydawania nagrody
  const handleDeliver = async (orderId: string) => {
    const { error } = await supabase
      .from('reward_claims')
      .update({ status: 'collected' })
      .eq('id', orderId)
    
    if (!error) {
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: 'collected' } : o))
    }
  }

  if (!mounted || authLoading) return null

  return (
    <div className="min-h-screen bg-[#F4F7FE] pt-28 pb-12 px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* NAGŁÓWEK */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-zinc-900 p-3 rounded-2xl text-white">
               <ShieldCheck size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-black text-zinc-900">Admin Panel</h1>
              <p className="text-zinc-400 font-bold uppercase tracking-widest text-[10px]">Zarządzanie Sklepem Urwis</p>
            </div>
          </div>

          {/* PRZEŁĄCZNIK ZAKŁADEK */}
          <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-zinc-100">
            <TabButton active={activeTab === 'users'} onClick={() => setActiveTab('users')} icon={<Users size={16}/>} label="Urwisy" />
            <TabButton active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} icon={<ShoppingBag size={16}/>} label="Zamówienia" />
          </div>
        </div>

        {/* WYSZUKIWARKA */}
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
          <input 
            type="text"
            placeholder={activeTab === 'users' ? "Szukaj urwisa..." : "Szukaj po kodzie lub nicku..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-6 py-4 rounded-2xl border-none shadow-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>

        {/* TREŚĆ ZAKŁADEK */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-zinc-100 overflow-hidden min-h-[500px]">
          {loadingData ? (
            <div className="flex flex-col items-center justify-center h-[500px] gap-4">
               <RefreshCw className="animate-spin text-blue-500" size={40} />
               <p className="text-zinc-400 font-black uppercase tracking-widest text-xs">Pobieranie danych...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              {activeTab === 'users' ? (
                /* TABELA URWISÓW */
                <table className="w-full text-left">
                  <thead className="bg-zinc-50/50 border-b border-zinc-100">
                    <tr>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-400">Agent</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-400">Punkty</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-400 text-right">Akcje</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-50">
                    {users.filter(u => u.username.toLowerCase().includes(searchQuery.toLowerCase())).map(u => (
                      <tr key={u.id} className="hover:bg-zinc-50/50 transition-colors group">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <span className="text-3xl not-italic">{u.avatar_url || '🐱'}</span>
                            <span className="font-black text-zinc-900">{u.username}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-2">
                              <Star className="text-yellow-400" fill="currentColor" size={16} />
                              <span className="font-black text-xl text-blue-600">{u.points}</span>
                           </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => adjustPoints(u.id, -10)} className="p-2 bg-zinc-50 rounded-lg text-zinc-400 hover:text-red-500 transition-all"><Minus size={16}/></button>
                            <button onClick={() => adjustPoints(u.id, 10)} className="p-2 bg-zinc-50 rounded-lg text-zinc-400 hover:text-green-500 transition-all"><Plus size={16}/></button>
                            <button onClick={() => adjustPoints(u.id, 50)} className="px-4 py-2 bg-zinc-900 text-white rounded-xl font-black text-[10px] uppercase">+50</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                /* TABELA ZAMÓWIEŃ */
                <table className="w-full text-left">
                  <thead className="bg-zinc-50/50 border-b border-zinc-100">
                    <tr>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-400">Kod / Status</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-400">Urwis</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-400">Nagroda</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-400 text-right">Akcja</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-50">
                    {orders.length === 0 ? (
                      <tr><td colSpan={4} className="p-20 text-center text-zinc-300 font-bold">Brak zamówień do wyświetlenia.</td></tr>
                    ) : orders.map(o => (
                      <tr key={o.id} className="hover:bg-zinc-50/50 transition-colors">
                        <td className="px-8 py-6">
                          <div className="flex flex-col gap-1">
                            <span className="font-black text-zinc-900 font-mono text-lg">{o.claim_code}</span>
                            {o.status === 'pending' ? (
                              <span className="flex items-center gap-1 text-[10px] font-black text-orange-500 uppercase"><Clock size={10}/> Oczekuje</span>
                            ) : (
                              <span className="flex items-center gap-1 text-[10px] font-black text-green-500 uppercase"><CheckCircle size={10}/> Wydano</span>
                            )}
                          </div>
                        </td>
                        <td className="px-8 py-6 font-bold text-zinc-600">{o.profiles?.username}</td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2">
                             <span className="not-italic text-xl">{o.rewards?.image_url}</span>
                             <span className="font-bold text-zinc-900">{o.rewards?.name}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                          {o.status === 'pending' ? (
                            <button 
                              onClick={() => handleDeliver(o.id)}
                              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase hover:bg-zinc-900 transition-all shadow-lg shadow-blue-100 flex items-center gap-2 ml-auto"
                            >
                              Wydaj Nagrodę <Package size={14} />
                            </button>
                          ) : (
                            <span className="text-zinc-300 font-black text-[10px] uppercase">Zrealizowane</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function TabButton({ active, onClick, icon, label }: any) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all
        ${active ? 'bg-zinc-900 text-white shadow-lg' : 'text-zinc-400 hover:bg-zinc-50'}`}
    >
      {icon} {label}
    </button>
  )
}
