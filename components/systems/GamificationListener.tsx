'use client'

import { useEffect, useRef } from 'react'
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext'
import { urwisToast } from '@/components/ui/UrwisNotifications'
import confetti from 'canvas-confetti'

export default function GamificationListener() {
  const { profile, user } = useSupabaseAuth()

  // Refy do śledzenia poprzedniego stanu, aby wykryć zmiany
  const prevLevelRef = useRef<number | null>(null)
  const initializedRef = useRef(false)

  // 1. Wykrywanie Level Up
  useEffect(() => {
    if (!profile) return

    // Jeśli to pierwsze załadowanie, tylko zapisz poziom
    if (prevLevelRef.current === null) {
      prevLevelRef.current = profile.level
      initializedRef.current = true

      // Przy okazji pierwszego wejścia: sprawdź czy są nagrody
      checkDailyRewards(profile)
      return
    }

    // Sprawdź czy poziom wzrósł
    if (profile.level > prevLevelRef.current) {
      // LEVEL UP!
      triggerLevelUpEffect(profile.level)
      prevLevelRef.current = profile.level
    }

  }, [profile]) // Uruchom zawsze, gdy zmienia się profil (np. po dodaniu XP)

  // --- LOGIKA POMOCNICZA ---

  const triggerLevelUpEffect = (level: number) => {
    // 1. Toast
    urwisToast.levelUp(level)

    // 2. Dźwięk (opcjonalnie)
    const audio = new Audio('/sounds/win.mp3') // Upewnij się, że masz ten plik
    audio.volume = 0.5
    audio.play().catch(() => { })

    // 3. Wielkie confetti na środku ekranu
    const duration = 3000
    const end = Date.now() + duration

      ; (function frame() {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#FFD700', '#FFA500'] // Złote
        })
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#FFD700', '#FFA500']
        })

        if (Date.now() < end) {
          requestAnimationFrame(frame)
        }
      })()
  }

  const checkDailyRewards = (userProfile: any) => {
    // Sprawdzamy czy użytkownik odebrał nagrodę dzisiaj
    // Zakładam, że masz pole last_daily_reward w bazie (timestamp)

    if (!userProfile.last_daily_reward) {
      urwisToast.dailyReward()
      return
    }

    const lastClaim = new Date(userProfile.last_daily_reward)
    const today = new Date()

    // Resetujemy godziny, porównujemy tylko dni
    lastClaim.setHours(0, 0, 0, 0)
    today.setHours(0, 0, 0, 0)

    if (today > lastClaim) {
      // Minął dzień od ostatniej nagrody
      setTimeout(() => {
        urwisToast.dailyReward()
      }, 2000) // Małe opóźnienie, żeby nie atakować od razu po wejściu
    }
  }

  return null // Ten komponent nie renderuje nic wizualnego
}