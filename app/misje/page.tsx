'use client'
import Navbar from '@/components/ui/Navbar';
import DailyChallenges from '@/components/DailyChallenges';

export default function ChallengesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      <div className="pt-32">
        <DailyChallenges />
      </div>
    </div>
  );
}
