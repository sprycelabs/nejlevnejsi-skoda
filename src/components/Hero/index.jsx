import { motion } from 'framer-motion'
import { ArrowRight, ShieldCheck, Truck } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative bg-[#0d1f10] overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0d1f10] via-[#1a3d1e] to-[#0a1508]" />

      {/* Decorative circles */}
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-[#1e7e34]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-[#28a745]/8 rounded-full blur-3xl pointer-events-none" />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-28 sm:pt-36 pb-16 sm:pb-32 w-full">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">

          {/* Left — text */}
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl sm:text-4xl xl:text-6xl font-black text-white leading-tight mb-5 sm:mb-6"
            >
              Vozy Škoda z EU{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#28a745] to-[#86efac]">
                levněji
              </span>{' '}
              než v ČR
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-gray-300 text-base sm:text-lg leading-relaxed mb-6 sm:mb-8 max-w-lg"
            >
              Dovoz Škody z EU za ceny výrazně nižší než u českých dealerů.
              Průměrná úspora <strong className="text-white">až 20 %</strong>, plná tovární záruka a kompletní servis bez starostí.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-3 sm:gap-4 mb-8 sm:mb-12"
            >
              <a
                href="#vozy"
                className="flex items-center gap-2 bg-[#1e7e34] hover:bg-[#28a745] text-white font-bold px-5 sm:px-7 py-3 sm:py-4 rounded-md transition-all duration-200 shadow-lg shadow-green-900/40 hover:-translate-y-0.5 text-sm sm:text-base"
              >
                Prohlédnout vozy
                <ArrowRight size={18} />
              </a>
              <a
                href="#jak-to-funguje"
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-5 sm:px-7 py-3 sm:py-4 rounded-md transition-all duration-200 hover:-translate-y-0.5 text-sm sm:text-base"
              >
                Jak to funguje
              </a>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap items-center gap-4 sm:gap-6"
            >
              {[
                { icon: ShieldCheck, text: 'Tovární záruka zachována' },
                { icon: Truck, text: 'Dovoz do ČR zajištěn' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-gray-300 text-sm">
                  <Icon size={16} className="text-[#28a745]" />
                  {text}
                </div>
              ))}
              <div className="flex items-center gap-3 border-l border-white/10 pl-4 sm:pl-6">
                <span className="text-gray-400 text-sm">Spolupracujeme s autorizovanými partnery</span>
                <img src="/logo/skoda.webp" alt="Škoda Auto" className="h-16 w-auto opacity-90" />
              </div>
            </motion.div>
          </div>

          {/* Right — car photo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative flex items-end justify-center lg:justify-end"
          >
            {/* Akce Květen badge */}
            <motion.a
              href="/kontakt"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="hidden lg:block absolute top-0 right-0 z-10 group"
            >
              <div className="bg-orange-500 hover:bg-orange-400 transition-colors rounded-xl px-4 py-3 shadow-xl shadow-orange-900/40 text-center">
                <div className="text-white/80 text-xs font-bold uppercase tracking-widest mb-1">Akce Květen</div>
                <div className="text-white text-2xl font-black leading-none">−10 000 Kč</div>
                <div className="text-orange-100 text-xs mt-1 font-medium">na první objednávku</div>
                <div className="mt-2 pt-2 border-t border-white/20 text-orange-100 text-xs">
                  Pouze prvních <strong className="text-white">10 zákazníků</strong>
                </div>
                <div className="mt-2 bg-white/15 group-hover:bg-white/25 transition-colors rounded-md px-3 py-1.5 text-white text-xs font-bold">
                  Napsat o slevový kód →
                </div>
              </div>
            </motion.a>

            <img
              src="/hero-car.webp"
              alt="Škoda"
              fetchpriority="high"
              decoding="sync"
              className="w-full scale-125 sm:scale-100 lg:scale-125 xl:scale-150 lg:max-w-2xl xl:max-w-3xl lg:translate-y-24 origin-bottom"
              style={{ filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.7))' }}
            />
          </motion.div>

        </div>
      </div>

      {/* Akce Květen — mobile banner pod gridem */}
      <div className="lg:hidden relative z-10 px-4 pb-6">
        <a href="/kontakt" className="group flex items-center justify-between gap-4 bg-orange-500 hover:bg-orange-400 transition-colors rounded-xl px-5 py-4 shadow-xl shadow-orange-900/40">
          <div>
            <div className="text-white/80 text-xs font-bold uppercase tracking-widest mb-1">Akce Květen</div>
            <div className="text-white text-2xl font-black leading-none">−10 000 Kč</div>
            <div className="text-orange-100 text-xs mt-1">na první objednávku · prvních <strong className="text-white">10 zákazníků</strong></div>
          </div>
          <div className="bg-white/20 group-hover:bg-white/30 transition-colors rounded-lg px-4 py-2.5 text-white text-sm font-bold shrink-0 whitespace-nowrap">
            Napsat o kód →
          </div>
        </a>
      </div>

      {/* Bottom wave */}
      <div className="relative z-10">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block">
          <path d="M0 80L1440 80L1440 40C1200 80 960 0 720 40C480 80 240 0 0 40L0 80Z" fill="white" />
        </svg>
      </div>
    </section>
  )
}
