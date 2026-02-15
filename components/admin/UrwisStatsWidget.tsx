'use client'
import { createClient } from '@/lib/supabase/client';
import { useState, useEffect } from 'react';

export default function UrwisStatsWidget() {
  const [topHunters, setTopHunters] = useState([]);
  const [totalFinds, setTotalFinds] = useState(0);
  const supabase = createClient();

  useEffect(() => {
    const fetchStats = async () => {
      // Top 5 łowców
      const { data: hunters } = await supabase
        .rpc('get_top_urwis_hunters', { limit_count: 5 });

      // Total znalezień
      const { count } = await supabase
        .from('hidden_urwis_finds')
        .select('*', { count: 'exact', head: true });

      setTopHunters(hunters || []);
      setTotalFinds(count || 0);
    };

    fetchStats();
  }, [supabase]);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-yellow-400">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        🦸‍♂️ Ukryty Urwis
      </h3>

      <div className="mb-4">
        <div className="text-3xl font-black text-yellow-600">{totalFinds}</div>
        <div className="text-sm text-gray-600">Łączna liczba znalezień</div>
      </div>

      <div className="space-y-2">
        <div className="text-sm font-bold text-gray-700">Top 5 Łowców:</div>
        {topHunters.slice(0, 5).map((hunter: any, idx: number) => (
          <div key={hunter.user_id} className="flex justify-between text-sm">
            <span>#{idx + 1} {hunter.username}</span>
            <span className="font-bold">{hunter.find_count} 🎯</span>
          </div>
        ))}
      </div>
    </div>
  );
}
