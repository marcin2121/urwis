'use client'

import UrwisIntro from '@/components/Intro';
import Particles from "@/components/Particles";
import { RibbonsBg } from "@/components/Ribbons";
import HeroSection from '@/components/Hero';
import PoznajUrwisa from '@/components/PoznajUrwisa';
import AboutSection from '@/components/AboutSection';
import PromoSection from '@/components/PromoSection';
import OfertaGrid from '@/components/OfertaGrid';
import KlubUrwisaSection from '@/components/KlubUrwisaSection'; // <-- NOWY IMPORT
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <UrwisIntro>
      <main style={{ position: 'relative', backgroundColor: '#FFFFFF', minHeight: '100vh', overflow: 'hidden' }}>
        
        {/* TŁA */}
        <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
          <Particles
            particleCount={1000}
            particleColors={["#bf2024", "#0055ff"]}
            alphaParticles
            particleBaseSize={100}
            speed={0.1}
            sizeRandomness={1}
            particleSpread={10}
          />
        </div>
        <div style={{ position: 'fixed', inset: 0, zIndex: 11, pointerEvents: 'none' }}>
          <RibbonsBg colors={["#bf2024", "#0055ff"]} />
        </div>

        {/* --- SEKCJE --- */}
        <HeroSection />
        <PoznajUrwisa />
        <PromoSection />
        <OfertaGrid />
        
        {/* Nowy komponent Klubu Urwisa */}
        <KlubUrwisaSection />
        
        <AboutSection />

      </main>
    </UrwisIntro>
  );
}
