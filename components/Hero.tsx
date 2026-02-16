'use client'
import { useRef, useEffect, useState, ReactNode } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Modal from 'react-modal';
import Link from 'next/link';
import { 
  MapPin, Star, Heart, Package, ChevronDown, 
  Gamepad2, Puzzle, PartyPopper, ShoppingBag, Sparkles, BookOpen 
} from 'lucide-react';

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isHoursOpen, setIsHoursOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [shopStatus, setShopStatus] = useState({ isOpen: false, text: "" });

  useEffect(() => {
    const checkStatus = () => {
      const now = new Date();
      const day = now.getDay(); 
      const hour = now.getHours();
      const min = now.getMinutes();
      const currentTime = hour + min / 60;

      let openTime = 8;
      let closeTime = 18;
      let dayText = "8:00 - 18:00";

      if (day === 6) { // Sobota
        closeTime = 15;
        dayText = "8:00 - 15:00";
      } else if (day === 0) { // Niedziela
        setShopStatus({ isOpen: false, text: "Dzisiaj: Zamknięte" });
        return;
      }

      const isOpen = currentTime >= openTime && currentTime < closeTime;
      setShopStatus({ 
        isOpen, 
        text: `Dzisiaj: ${dayText}` 
      });
    };

    checkStatus();
    setIsMobile(window.innerWidth < 768);
    if (typeof window !== 'undefined') {
      Modal.setAppElement('body');
    }
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const scrollToNext = () => {
    const nextSection = document.getElementById('poznaj-urwisa');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const address = "Sklep Urwis - Władysława Reymonta 38A, 26-800 Białobrzegi";
  const mapEmbedUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2466.452445851416!2d20.9472314772183!3d51.65159497184643!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x471927771744116b%3A0x6b87693503282436!2sSklep%20Urwis!5e0!3m2!1spl!2spl!4v1700000000000!5m2!1spl!2spl`;

  const floatingIcons = [
    { Icon: Gamepad2, x: "10%", y: "20%", delay: 0, color: "#0055ff" },
    { Icon: Puzzle, x: "85%", y: "15%", delay: 1, color: "#BF2024" },
    { Icon: PartyPopper, x: "5%", y: "65%", delay: 2, color: "#fbbf24" },
    { Icon: ShoppingBag, x: "90%", y: "70%", delay: 1.5, color: "#22c55e" },
    { Icon: Sparkles, x: "80%", y: "40%", delay: 0.5, color: "#a855f7" },
    { Icon: BookOpen, x: "15%", y: "45%", delay: 2.5, color: "#ec4899" },
  ];

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">
      
      {/* Background */}
      <div className="absolute inset-0 z-0">
        {!isMobile && (
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full blur-[120px] opacity-20 bg-[#BF2024]" />
            <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full blur-[120px] opacity-20 bg-[#0055ff]" />
          </div>
        )}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `radial-gradient(#BF2024 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
      </div>

      <motion.div style={{ y, opacity }} className="relative z-10 container mx-auto px-6 text-center">
        
        {/* Badge: Godziny */}
        <div className="relative inline-block mb-8">
          <motion.button
            onClick={() => setIsHoursOpen(!isHoursOpen)}
            className="flex items-center gap-3 px-6 py-3 rounded-full border-2 bg-white shadow-lg transition-all cursor-pointer"
            style={{ borderColor: shopStatus.isOpen ? '#22c55e' : '#BF2024' }}
            whileHover={{ scale: 1.05 }}
          >
            <div className={`w-3 h-3 rounded-full ${shopStatus.isOpen ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            <span className="text-sm font-black uppercase tracking-widest text-gray-800 font-heading">
              {shopStatus.text}
            </span>
            <ChevronDown className={`transition-transform duration-300 ${isHoursOpen ? 'rotate-180' : ''}`} size={16} />
          </motion.button>
          <AnimatePresence>
  {isHoursOpen && (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="absolute top-full left-0 right-0 mt-3 bg-white rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border-2 border-gray-50 p-5 z-50 min-w-[240px] overflow-hidden"
    >
      {/* Dekoracyjny pasek na górze */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-[#BF2024] to-[#0055ff]" />
      
      <div className="space-y-3 pt-2">
        {/* Poniedziałek - Piątek */}
        <div className="flex justify-between items-center group">
          <div className="flex flex-col text-left">
            <span className="text-[10px] uppercase tracking-widest text-gray-400 font-black">Dni robocze</span>
            <span className="text-sm font-black text-gray-700">Pon. - Pt </span>
          </div>
          <span className="px-3 py-1 bg-blue-50 text-[#0055ff] rounded-lg text-xs font-black">
            8:00 - 18:00
          </span>
        </div>

        <div className="h-px bg-gray-50" />

        {/* Sobota */}
        <div className="flex justify-between items-center">
          <div className="flex flex-col text-left">
            <span className="text-[10px] uppercase tracking-widest text-gray-400 font-black">Weekend</span>
            <span className="text-sm font-black text-gray-700">Sobota</span>
          </div>
          <span className="px-3 py-1 bg-red-50 text-[#BF2024] rounded-lg text-xs font-black">
            8:00 - 15:00
          </span>
        </div>

        <div className="h-px bg-gray-50" />

        {/* Niedziela */}
        <div className="flex justify-between items-center opacity-60">
          <div className="flex flex-col text-left">
            <span className="text-[10px] uppercase tracking-widest text-gray-400 font-black">Odpoczynek</span>
            <span className="text-sm font-black text-gray-400">Niedziela</span>
          </div>
          <span className="px-3 py-1 bg-gray-100 text-gray-400 rounded-lg text-xs font-black">
            Zamknięte
          </span>
        </div>
      </div>

      {/* Mały akcent na dole */}
      <div className="mt-4 pt-3 border-t border-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
        Zapraszamy na zakupy! 🧸
      </div>
    </motion.div>
  )}
</AnimatePresence>
        </div>

        {/* Heading */}
        <h1 className="md:text-8xl xl:text-9xl font-black leading-[1.1] tracking-tighter mb-8 font-heading">
          <span className="block text-transparent bg-clip-text bg-linear-to-r from-[#BF2024] to-[#0055ff] pb-2 tracking-wider">
            Sklep Urwis
          </span>
          <span className="block text-gray-900 text-4xl md:text-6xl tracking-tight lg:text-7xl mt-2">
            Więcej niż tylko zabawki
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-12 font-medium font-body leading-relaxed">
          Najlepsze gry, artykuły szkolne i akcesoria imprezowe. <br className="hidden md:block" />
          Wszystko, czego potrzebuje Twój mały (i duży) bohater!
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          <motion.a
            href="/oferta"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center px-10 py-5 rounded-full bg-linear-to-r from-[#BF2024] to-[#0055ff] text-white font-black text-xl shadow-xl shadow-blue-500/20 font-heading tracking-wide"
          >
            ZOBACZ OFERTĘ
          </motion.a>

          <motion.button
            onClick={() => setIsMapOpen(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-10 py-5 rounded-full bg-white border-2 border-gray-200 text-gray-800 font-black text-xl shadow-lg flex items-center gap-2 font-heading cursor-pointer tracking-wide"
          >
            <span className="text-2xl">🗺️</span> LOKALIZACJA
          </motion.button>
        </div>

        {/* Stats Section */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-8">
          <Link href="https://g.page/r/CRwwKXq0Z8ZwEBM/review" target="_blank">
            <StatBadge icon="⭐" color="#333333">
              Ocena <span className="text-[#BF2024]">4.9</span>
            </StatBadge>
          </Link>
          
          <StatBadge icon="❤️" color="#333333" noHover>
            Od <span className="text-[#0055ff]">2007</span> roku
          </StatBadge>
          
          <StatBadge icon="📦" color="#333333" noHover>
            Lokalny <span className="text-[#333333]">biznes</span>
          </StatBadge>
        </div>
      </motion.div>

      {/* Floating Icons */}
      {!isMobile && floatingIcons.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 0.15,
            y: [0, -30, 0],
            rotate: [0, 10, -10, 0]
          }}
          transition={{ duration: 6, repeat: Infinity, delay: item.delay, ease: "easeInOut" }}
          className="absolute pointer-events-none"
          style={{ top: item.y, left: item.x, color: item.color }}
        >
          <item.Icon size={80} strokeWidth={2.5} />
        </motion.div>
      ))}

      {/* Map Modal */}
      <Modal
        isOpen={isMapOpen}
        onRequestClose={() => setIsMapOpen(false)}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-3xl p-4 md:p-8 max-w-5xl w-[95%] shadow-2xl outline-none"
        overlayClassName="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center"
      >
        <div className="w-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-black text-gray-900 font-heading">Nasza lokalizacja</h2>
            <button 
              onClick={() => setIsMapOpen(false)} 
              className="text-4xl font-bold p-2 hover:rotate-90 transition-transform cursor-pointer"
            >
              ×
            </button>
          </div>
          <p className="font-bold text-gray-600 mb-4 flex items-center gap-2 font-body">
            <MapPin size={18} className="text-[#BF2024]" /> {address}
          </p>
          <div className="aspect-video w-full rounded-2xl overflow-hidden border-4 border-gray-50 bg-gray-100">
            <iframe
              src={mapEmbedUrl}
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy"
            />
          </div>
        </div>
      </Modal>

      {/* Scroll Indicator */}
      <motion.div
        style={{
          opacity: useTransform(scrollYProgress, [0, 0.2], [1, 0])
        }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 cursor-pointer group z-20"
        onClick={scrollToNext}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="relative"
        >
          <div className="absolute -inset-2 rounded-full blur-lg opacity-30 bg-linear-to-r from-[#BF2024] to-[#0055ff]" />

          <div className="relative px-6 py-3 bg-white/80 backdrop-blur-md rounded-full shadow-xl border border-gray-100 group-hover:scale-105 transition-transform">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-widest text-gray-500">
                Poznaj Urwisa
              </span>
              <motion.span
                animate={{ y: [0, 3, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="text-lg"
              >
                👇
              </motion.span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

// Komponent StatBadge z obsługą children i opcjonalnym brakiem animacji
function StatBadge({ icon, color, children, noHover = false }: { icon: string, color: string, children: ReactNode, noHover?: boolean }) {
  return (
    <motion.div 
      whileHover={noHover ? {} : { scale: 1.05 }}
      className={`flex items-center gap-3 px-6 py-3 rounded-full bg-white shadow-md border border-gray-100 transition-transform ${noHover ? '' : 'cursor-pointer hover:shadow-lg'}`}
    >
      <span className="text-2xl">{icon}</span>
      <span className="font-black uppercase tracking-tight text-sm font-heading" style={{ color }}>
        {children}
      </span>
    </motion.div>
  );
}
