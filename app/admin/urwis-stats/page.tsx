'use client'
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { createClient } from '@/lib/supabase/client';
import { useState, useEffect } from 'react';
import { redirect } from 'next/navigation';

interface UrwisFindStat {
  user_id: string;
  found_date: string;
  profiles: {
    username: string;
  };
  created_at: string;
}

interface TopHunter {
  user_id: string;
  username: string;
  find_count: number;
}

export default function UrwisStatsPage() {
  const { profile } = useSupabaseAuth();
  const [stats, setStats] = useState<UrwisFindStat[]>([]);
  const [topHunters, setTopHunters] = useState<TopHunter[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  // ✅ Sprawdź czy admin
  useEffect(() => {
    if (!profile) return;

    // Zakładam że masz pole 'role' w profiles
    if (profile.role !== 'admin') {
      redirect('/');
    }
  }, [profile]);

  // ✅ Pobierz dane
  useEffect(() => {
    if (!profile || profile.role !== 'admin') return;

    const fetchStats = async () => {
      try {
        // Ostatnie 100 znalezień
        const { data: statsData } = await supabase
          .from('hidden_urwis_finds')
          .select('user_id, found_date, created_at, profiles(username)')
          .order('created_at', { ascending: false })
          .limit(100);

        // Top 10 łowców
        const { data: huntersData } = await supabase
          .rpc('get_top_urwis_hunters', { limit_count: 10 });

        setStats(statsData || []);
        setTopHunters(huntersData || []);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [profile, supabase]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl">Ładowanie statystyk... 📊</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-black mb-8 text-gray-900">
          🦸‍♂️ Statystyki Ukrytego Urwisa
        </h1>

        {/* 🏆 TOP 10 ŁOWCÓW */}
        <div className="bg-white rounded-3xl p-6 shadow-xl mb-8 border-4 border-yellow-400">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            🏆 Top 10 Łowców Urwisa
          </h2>
          <div className="grid gap-3">
            {topHunters.map((hunter, idx) => (
              <div
                key={hunter.user_id}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-black text-gray-600">
                    #{idx + 1}
                  </span>
                  <span className="font-bold text-lg">{hunter.username}</span>
                </div>
                <span className="px-4 py-2 bg-yellow-400 rounded-full font-bold text-sm">
                  {hunter.find_count} znalezień 🎯
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 📊 OSTATNIE ZNALEZIENIA */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border-4 border-blue-400">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            📊 Ostatnie 100 znalezień
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left p-3 font-bold">Użytkownik</th>
                  <th className="text-left p-3 font-bold">Data znalezienia</th>
                  <th className="text-left p-3 font-bold">Kiedy</th>
                </tr>
              </thead>
              <tbody>
                {stats.map((stat) => (
                  <tr
                    key={`${stat.user_id}-${stat.found_date}`}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="p-3 font-semibold">
                      {stat.profiles?.username || 'Unknown'}
                    </td>
                    <td className="p-3 text-gray-600">
                      {new Date(stat.found_date).toLocaleDateString('pl-PL')}
                    </td>
                    <td className="p-3 text-sm text-gray-500">
                      {formatTimeAgo(stat.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// ✅ Helper do formatowania czasu
function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Przed chwilą';
  if (diffMins < 60) return `${diffMins} min temu`;
  if (diffHours < 24) return `${diffHours}h temu`;
  return `${diffDays} dni temu`;
}
