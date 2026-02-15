'use client'
import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import ModelViewer from '@/components/ModelViewer';

export default function PoznajUrwisa() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.9", "end 0.2"]
  });
  
  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  const y = useSpring(useTransform(scrollYProgress, [0, 1], [100, -100]), springConfig);
  
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const featureRefs = [useRef(null), useRef(null), useRef(null)];
  
  const titleInView = useInView(titleRef, { once: true, margin: "-100px" });
  const descInView = useInView(descRef, { once: true, margin: "-100px" });

  return (
    <section 
      id="poznaj-urwisa"
      ref={containerRef}
      className="relative min-h-screen py-24 lg:py-32 overflow-hidden bg-gradient-to-b from-white via-blue-50/20 to-white"
    >
      {/* Animated background blobs */}
      <motion.div 
        style={{ y }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-20 left-10 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" 
          style={{ background: 'linear-gradient(to bottom right, #BF2024, #ff6b6b)' }} 
        />
        <div className="absolute top-40 right-10 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-blob animation-delay-2000" 
          style={{ background: 'linear-gradient(to bottom right, #0055ff, #66a3ff)' }} 
        />
        <div className="absolute bottom-20 left-1/2 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" 
          style={{ background: 'linear-gradient(to bottom right, #BF2024, #0055ff)' }} 
        />
      </motion.div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left: Content */}
          <div className="space-y-10 lg:space-y-12">
            
            {/* Badge + Title */}
            <motion.div
              ref={titleRef}
              initial={{ opacity: 0, y: 40 }}
              animate={titleInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-6"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={titleInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-white text-sm font-bold uppercase tracking-wider rounded-full shadow-lg"
                style={{ background: 'linear-gradient(135deg, #BF2024 0%, #0055ff 100%)' }}
              >
                Maskotka Sklepu
              </motion.div>

              {/* Title */}
              <h2 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black leading-[0.95] tracking-tight text-gray-900">
                Poznaj
                <br />
                <span className="inline-block mt-2 text-transparent bg-clip-text" 
                  style={{ backgroundImage: 'linear-gradient(135deg, #BF2024 0%, #0055ff 100%)' }}
                >
                  Urwisa
                </span>
              </h2>
            </motion.div>

            {/* Description */}
            <motion.div
              ref={descRef}
              initial={{ opacity: 0, y: 30 }}
              animate={descInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="space-y-4"
            >
              <p className="text-xl lg:text-2xl text-gray-800 leading-relaxed font-medium">
                Sympatyczny diabełek, który sprawia, że zakupy stają się 
                <span className="font-bold" style={{ color: '#BF2024' }}> prawdziwą przygodą</span>.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Urwis kocha dobrą zabawę i zawsze pomoże Ci znaleźć najlepsze produkty. 
                Jest energiczny, kreatywny i gotowy na każdą przygodę!
              </p>
            </motion.div>

            {/* Features */}
            <div className="space-y-4">
              {[
                { 
                  icon: (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ), 
                  title: 'Zawsze pomocny', 
                  desc: 'Podpowie najlepsze produkty dla Twojego dziecka',
                  color: '#BF2024'
                },
                { 
                  icon: (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  ), 
                  title: 'Pełen energii', 
                  desc: 'Zakupy z nim to czysta radość i zabawa',
                  color: '#BF2024'
                },
                { 
                  icon: (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                  ), 
                  title: 'Kreatywny', 
                  desc: 'Pokaże Ci rzeczy, o których nie wiedziałeś',
                  color: '#BF2024'
                }
              ].map((feature, i) => (
                <FeatureCard 
                  key={i} 
                  {...feature} 
                  index={i}
                  featureRef={featureRefs[i]}
                />
              ))}
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="pt-4"
            >
              <motion.a
                href="#oferta"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="group inline-flex items-center gap-3 px-8 py-5 text-white font-bold text-lg rounded-full shadow-xl hover:shadow-2xl transition-all duration-300"
                style={{ 
                  background: 'linear-gradient(135deg, #BF2024 0%, #0055ff 100%)',
                  backgroundSize: '200% 100%',
                  backgroundPosition: '0% 0%'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundPosition = '100% 0%';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundPosition = '0% 0%';
                }}
              >
                <span>Zobacz naszą ofertę</span>
                <motion.svg
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </motion.svg>
              </motion.a>
            </motion.div>
          </div>

          {/* Right: 3D Model */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative h-[600px] lg:h-[800px] flex items-center justify-center"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            {/* Glow effect - gradient czerwono-niebieski */}
            <motion.div
              animate={{
                scale: isHovering ? 1.2 : 1,
                opacity: isHovering ? 0.6 : 0.4
              }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 rounded-full blur-3xl"
              style={{ background: 'linear-gradient(135deg, #BF2024 0%, #0055ff 100%)' }}
            />

            {/* Decorative ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 border-4 border-dashed rounded-full"
              style={{ borderColor: '#BF2024' }}
            />

            {/* 3D Model Container */}
            <div className="relative w-full h-full flex items-center justify-center z-10" style={{ pointerEvents: 'auto' }}>
              <ModelViewer 
                url="/urwis.glb"
                width={800}
                height={800}
                defaultZoom={2.0}
                minZoomDistance={0.8}
                maxZoomDistance={12}
                defaultRotationX={-85}
                defaultRotationY={5}
                enableMouseParallax
                enableHoverRotation
                showScreenshotButton={false}
                fadeIn={true}
                onModelLoaded={() => setModelLoaded(true)}
              />
            </div>

            {/* Interaction hint */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: (modelLoaded && !isHovering) ? 1 : 0, y: 0 }}
              transition={{ delay: 1.5, duration: 0.6 }}
              className="absolute bottom-4 lg:bottom-8 left-1/2 -translate-x-1/2 pointer-events-none z-20"
            >
              <div className="px-6 py-3 bg-white/95 backdrop-blur-xl rounded-full shadow-xl border border-gray-200">
                <p className="text-sm font-semibold text-gray-700 flex items-center gap-3">
                  <svg className="w-5 h-5" style={{ color: '#0055ff' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                  </svg>
                  <span>Kliknij i przeciągnij, aby obracać</span>
                </p>
              </div>
            </motion.div>

            {/* Loading indicator */}
            {!modelLoaded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-3xl z-30"
              >
                <div className="text-center space-y-4">
                  <div className="relative w-16 h-16 mx-auto">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 border-4 border-gray-200 rounded-full"
                      style={{ borderTopColor: '#BF2024' }}
                    />
                  </div>
                  <p className="text-lg font-semibold text-gray-700">
                    Ładowanie modelu...
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Feature Card
function FeatureCard({ icon, title, desc, index, featureRef, color }: any) {
  const inView = useInView(featureRef, { once: true, margin: "-50px" });
  
  return (
    <motion.div
      ref={featureRef}
      initial={{ opacity: 0, x: -40 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: 0.5 + index * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ x: 8, scale: 1.02 }}
      className="group relative flex items-start gap-5 p-5 lg:p-6 rounded-2xl bg-white/80 backdrop-blur-sm border-2 border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
      style={{
        '--hover-border-color': color
      } as any}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = color;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#f3f4f6';
      }}
    >
      {/* Icon */}
      <motion.div
        whileHover={{ scale: 1.2, rotate: 5 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="flex-shrink-0 relative z-10"
        style={{ color }}
      >
        {icon}
      </motion.div>

      {/* Content */}
      <div className="relative z-10 flex-1">
        <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2 group-hover:transition-colors duration-300"
          style={{
            '--hover-color': color
          } as any}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = color;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#111827';
          }}
        >
          {title}
        </h3>
        <p className="text-base text-gray-600 leading-relaxed">
          {desc}
        </p>
      </div>

      {/* Arrow indicator */}
      <motion.svg
        initial={{ opacity: 0, x: -10 }}
        className="absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ color }}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </motion.svg>
    </motion.div>
  );
}
