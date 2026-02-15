'use client'
import Navbar from '@/components/ui/Navbar';
import LoyaltyDashboard from '@/components/LoyaltyDashboard';

export default function LoyaltyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      <div className="pt-32">
        <LoyaltyDashboard />
      </div>
    </div>
  );
}
