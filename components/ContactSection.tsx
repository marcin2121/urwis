'use client'
import { motion } from 'framer-motion';
import { useForm, ValidationError } from '@formspree/react';
import MagicBento from '@/components/ui/MagicBento';

export default function ContactSection() {
  const [state, handleSubmit] = useForm("mdalgzln");

  const contactInfo = [
    {
      icon: '📞',
      title: 'Telefon',
      value: '604 208 183',
      link: 'tel:+48604208183',
      glowColor: '59, 130, 246', // blue-500
      gridClass: 'col-span-1 row-span-1'
    },
    {
      icon: '🗺️',
      title: 'Adres',
      value: 'Reymonta 38A',
      value2: 'Białobrzegi 26-800',
      link: 'https://maps.google.com/?cid=8112829577330745372',
      glowColor: '239, 68, 68', // red-500
      gridClass: 'col-span-1 row-span-1'
    },
    {
      icon: '🕐',
      title: 'Godziny otwarcia',
      value: 'Pon-Pt: 8:00-18:00',
      value2: 'Sobota: 8:00-15:00',
      glowColor: '34, 197, 94', // green-500
      gridClass: 'col-span-2 row-span-2' // DUŻA KARTA
    },
    {
      icon: '📧',
      title: 'Email',
      value: 'kontakt@urwis.pl',
      link: 'mailto:kontakt@urwis.pl',
      glowColor: '168, 85, 247', // purple-500
      gridClass: 'col-span-2 row-span-2' // DUŻA KARTA
    },
    {
      icon: '🚗',
      title: 'Parking',
      value: 'Darmowy',
      value2: 'przy sklepie',
      glowColor: '251, 146, 60', // orange-500
      gridClass: 'col-span-1 row-span-1'
    },
    {
      icon: '💳',
      title: 'Płatności',
      value: 'Gotówka, karta i blik',
      glowColor: '236, 72, 153', // pink-500
      gridClass: 'col-span-1 row-span-1'
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden bg-white">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-6xl"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000)
            }}
            animate={{
              y: [0, -30, 0],
              rotate: [0, 360]
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            {['📞', '✉️', '📍', '🎈'][i % 4]}
          </motion.div>
        ))}
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 mb-4">
            <span className="text-2xl">💬</span>
            <span className="font-bold text-purple-600">Skontaktuj się z nami</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-black mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Kontakt
            </span>
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Masz pytanie? Chętnie pomożemy! Skontaktuj się z nami telefonicznie, mailowo lub odwiedź nas osobiście.
          </p>
        </motion.div>

        {/* Bento Grid - Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-4 gap-4 mb-16 max-w-7xl mx-auto">
          {contactInfo.map((info, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={info.gridClass}
            >
              <a
                href={info.link}
                target={info.link?.startsWith('http') ? '_blank' : undefined}
                rel={info.link?.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="block h-full"
              >
                <MagicBento
                  textAutoHide={false}
                  enableStars
                  enableSpotlight
                  enableBorderGlow={true}
                  enableTilt={false}
                  enableMagnetism={false}
                  clickEffect
                  spotlightRadius={400}
                  particleCount={12}
                  glowColor={info.glowColor}
                  disableAnimations={false}
                  className="h-full min-h-[180px] rounded-3xl bg-linear-to-br from-gray-50 to-white border-2 border-gray-200 hover:border-purple-300 hover:shadow-2xl transition-all duration-300"
                >
                  <div className="flex flex-col items-center justify-center text-center p-8 h-full">
                    <div className="text-6xl mb-4">
                      {info.icon}
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 mb-3">
                      {info.title}
                    </h3>
                    <p className="text-gray-700 font-semibold text-base">
                      {info.value}
                    </p>
                    {info.value2 && (
                      <p className="text-gray-700 font-semibold text-base">
                        {info.value2}
                      </p>
                    )}
                  </div>
                </MagicBento>
              </a>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
          {/* Contact Form with Formspree */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 border-2 border-gray-200"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="text-4xl">📝</div>
              <h2 className="text-3xl font-black text-gray-900">
                Wyślij wiadomość
              </h2>
            </div>

            {state.succeeded ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="text-7xl mb-6">✅</div>
                <h3 className="text-2xl font-black text-green-700 mb-3">
                  Dziękujemy za wiadomość!
                </h3>
                <p className="text-gray-600 mb-6">
                  Odpowiemy najszybciej jak to możliwe.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-bold"
                >
                  Wyślij kolejną wiadomość
                </motion.button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-2">
                    Imię i nazwisko *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="Jan Kowalski"
                  />
                  <ValidationError
                    prefix="Imię"
                    field="name"
                    errors={state.errors}
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="jan@example.com"
                  />
                  <ValidationError
                    prefix="Email"
                    field="email"
                    errors={state.errors}
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-bold text-gray-700 mb-2">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="+48 123 456 789"
                  />
                  <ValidationError
                    prefix="Telefon"
                    field="phone"
                    errors={state.errors}
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="subject" className="block text-sm font-bold text-gray-700 mb-2">
                    Temat *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                  >
                    <option value="">Wybierz temat...</option>
                    <option value="pytanie">Pytanie o produkt</option>
                    <option value="zamowienie">Zamówienie</option>
                    <option value="reklamacja">Reklamacja</option>
                    <option value="wspolpraca">Współpraca</option>
                    <option value="inne">Inne</option>
                  </select>
                  <ValidationError
                    prefix="Temat"
                    field="subject"
                    errors={state.errors}
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-bold text-gray-700 mb-2">
                    Wiadomość *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors resize-none"
                    placeholder="Napisz swoją wiadomość..."
                  />
                  <ValidationError
                    prefix="Wiadomość"
                    field="message"
                    errors={state.errors}
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={state.submitting}
                  whileHover={{ scale: state.submitting ? 1 : 1.02 }}
                  whileTap={{ scale: state.submitting ? 1 : 0.98 }}
                  className={`w-full py-4 rounded-xl font-bold text-white shadow-xl transition-all ${state.submitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:shadow-2xl'
                    }`}
                >
                  {state.submitting ? '⏳ Wysyłanie...' : '📤 Wyślij wiadomość'}
                </motion.button>
              </form>
            )}
          </motion.div>

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-gray-200"
          >
            <div className="p-8 pb-0">
              <div className="flex items-center gap-3 mb-6">
                <div className="text-4xl">🗺️</div>
                <h2 className="text-3xl font-black text-gray-900">
                  Znajdź nas
                </h2>
              </div>

              <p className="text-gray-600 mb-6">
                Zapraszamy do naszego sklepu w Białobrzegach. Znajdujemy się przy ulicy Reymonta 38A.
              </p>
            </div>

            {/* Google Maps Embed */}
            <div className="relative h-[500px] w-full">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d8413.861345556805!2d20.950292!3d51.645135!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4718fdfaefa939bb%3A0x70c667b47a29301c!2sSklep%20Urwis!5e1!3m2!1spl!2spl!4v1771091119479!5m2!1spl!2spl"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Lokalizacja Sklep Urwis - Reymonta 38A, Białobrzegi"
                className="rounded-b-3xl"
              />
            </div>

            {/* Quick Actions */}
            <div className="p-6 grid grid-cols-2 gap-4">
              <motion.a
                href="https://maps.google.com/?cid=8112829577330745372"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-bold text-sm shadow-lg"
              >
                <span>🧭</span>
                <span>Nawiguj</span>
              </motion.a>

              <motion.a
                href="tel:+48604208183"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold text-sm shadow-lg"
              >
                <span>📞</span>
                <span>Zadzwoń</span>
              </motion.a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
