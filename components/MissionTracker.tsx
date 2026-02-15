'use client'
import { useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { usePathname } from 'next/navigation';
import { updateStreak } from '@/utils/streakTracker'; // ← DODAJ

export default function MissionTracker() {
  const { user } = useAuth();
  const { checkMissionProgress } = useNotifications();
  const pathname = usePathname();
  const checkedToday = useRef<Set<string>>(new Set());
  const sessionStartTime = useRef<number>(Date.now()); // ← Czas startu sesji

  useEffect(() => {
    console.log('🚀 MissionTracker mounted!', { user: user?.id, pathname });
    
    if (!user) {
      console.log('❌ No user, tracking disabled');
      return;
    }

    const today = new Date().toDateString();
    const trackingKey = `urwis_tracking_${user.id}_${today}`;
    
    // Pobierz lub utwórz tracking data
    let trackingData = JSON.parse(localStorage.getItem(trackingKey) || '{}');

    // ===== TRACK PAGE VISITS =====
    const visitedPages = trackingData.visited_pages || [];
    if (!visitedPages.includes(pathname)) {
      visitedPages.push(pathname);
      trackingData.visited_pages = visitedPages;
      trackingData.pages_visited = visitedPages.length;
      
      console.log('📊 Tracking: Strony odwiedzone:', visitedPages.length);
      
      localStorage.setItem(trackingKey, JSON.stringify(trackingData));
      
      const checkKey = `pages_visited_${visitedPages.length}`;
      if (!checkedToday.current.has(checkKey)) {
        checkedToday.current.add(checkKey);
        checkMissionProgress('pages_visited', visitedPages.length);
      }
    }

    // ===== TRACK SPECIFIC PAGES =====
    if (pathname === '/' || pathname === '') {
      if (!trackingData.visit_home) {
        trackingData.visit_home = 1;
        console.log('🏠 Tracking: Odwiedzono stronę główną');
        localStorage.setItem(trackingKey, JSON.stringify(trackingData));
        
        const checkKey = 'visit_home';
        if (!checkedToday.current.has(checkKey)) {
          checkedToday.current.add(checkKey);
          checkMissionProgress('visit_home', 1);
        }
      }
    }
    
    if (pathname === '/profil' || pathname === '/profile') {
      if (!trackingData.visit_profile) {
        trackingData.visit_profile = 1;
        console.log('👤 Tracking: Odwiedzono profil');
        localStorage.setItem(trackingKey, JSON.stringify(trackingData));
        
        const checkKey = 'visit_profile';
        if (!checkedToday.current.has(checkKey)) {
          checkedToday.current.add(checkKey);
          checkMissionProgress('visit_profile', 1);
        }
      }
    }

    if (pathname.startsWith('/gry') || pathname.startsWith('/games')) {
      if (!trackingData.visit_games) {
        trackingData.visit_games = 1;
        console.log('🎮 Tracking: Odwiedzono sekcję gier');
        localStorage.setItem(trackingKey, JSON.stringify(trackingData));
        
        const checkKey = 'visit_games';
        if (!checkedToday.current.has(checkKey)) {
          checkedToday.current.add(checkKey);
          checkMissionProgress('visit_games', 1);
        }
      }
    }

    // ===== TRACK TIME SPENT (KUMULATYWNIE) =====
    sessionStartTime.current = Date.now();
    
    const interval = setInterval(() => {
      // Pobierz świeże dane
      const freshData = JSON.parse(localStorage.getItem(trackingKey) || '{}');
      
      // Oblicz ile sekund minęło w TEJ sesji
      const sessionElapsed = Math.floor((Date.now() - sessionStartTime.current) / 1000);
      
      // Pobierz poprzedni total (z innych sesji dzisiaj)
      const previousTotal = freshData.time_spent_base || 0;
      
      // Nowy total = poprzedni + aktualny czas sesji
      const newTotal = previousTotal + sessionElapsed;
      
      // Zapisz
      freshData.time_spent = newTotal;
      freshData.time_spent_base = previousTotal; // zapisz bazę (nie zmienia się podczas sesji)
      
      localStorage.setItem(trackingKey, JSON.stringify(freshData));
      
      console.log('⏰ Tracking: Czas dzisiaj:', newTotal, 'sek (sesja:', sessionElapsed, 'sek)');
      
      // Sprawdź milestone (co 60 sekund)
      if (newTotal >= 60 && newTotal % 60 < 5) { // sprawdź w oknie 5 sekund
        const checkKey = `time_spent_${Math.floor(newTotal / 60)}`;
        if (!checkedToday.current.has(checkKey)) {
          checkedToday.current.add(checkKey);
          checkMissionProgress('time_spent', newTotal);
        }
      }
      
      // Sprawdź też dokładnie 300 (5 minut)
      if (newTotal >= 300) {
        const checkKey = 'time_spent_300';
        if (!checkedToday.current.has(checkKey)) {
          checkedToday.current.add(checkKey);
          checkMissionProgress('time_spent', newTotal);
        }
      }
      
    }, 5000); // Sprawdzaj co 5 sekund

    // ===== CLEANUP - zapisz czas przy opuszczeniu strony =====
    const saveTimeOnExit = () => {
      const freshData = JSON.parse(localStorage.getItem(trackingKey) || '{}');
      const sessionElapsed = Math.floor((Date.now() - sessionStartTime.current) / 1000);
      const previousTotal = freshData.time_spent_base || 0;
      const newTotal = previousTotal + sessionElapsed;
      
      // Zapisz nową bazę dla następnej sesji
      freshData.time_spent = newTotal;
      freshData.time_spent_base = newTotal; // WAŻNE: zaktualizuj bazę
      
      localStorage.setItem(trackingKey, JSON.stringify(freshData));
      
      console.log('💾 Saving time on exit:', newTotal, 'sekund');
    };

    // Dodaj listenery na opuszczenie strony
    window.addEventListener('beforeunload', saveTimeOnExit);
    window.addEventListener('pagehide', saveTimeOnExit);

    // ===== TRACK TOTAL VISITS =====
    const totalVisitsKey = `urwis_total_visits_${user.id}`;
    const totalVisits = parseInt(localStorage.getItem(totalVisitsKey) || '0');
    localStorage.setItem(totalVisitsKey, (totalVisits + 1).toString());
    console.log('🔢 Tracking: Całkowite wizyty:', totalVisits + 1);
 // ===== UPDATE STREAK ===== (DODAJ NA KOŃCU, przed return)
 updateStreak(user.id);
 
    return () => {
      clearInterval(interval);
      saveTimeOnExit(); // Zapisz przy unmount
      window.removeEventListener('beforeunload', saveTimeOnExit);
      window.removeEventListener('pagehide', saveTimeOnExit);
    };
  }, [user, pathname]);

  return null;
}
