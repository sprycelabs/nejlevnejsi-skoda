import { motion } from 'framer-motion'
import { ArrowRight, ShieldCheck, Truck, Sun } from 'lucide-react'

// Palmové listy SVG
function Palm({ className }) {
  return (
    <svg viewBox="0 0 100 240" fill="none" className={className}>
      {/* Kmen */}
      <path d="M50 240 Q46 195 53 160 Q60 128 50 98 Q44 76 52 58" stroke="#4ade80" strokeWidth="9" strokeLinecap="round" />
      {/* Listy */}
      <path d="M52 58 Q14 44 0 57" stroke="#4ade80" strokeWidth="5" strokeLinecap="round" />
      <path d="M52 58 Q80 38 97 48" stroke="#4ade80" strokeWidth="5" strokeLinecap="round" />
      <path d="M52 58 Q28 32 26 10" stroke="#4ade80" strokeWidth="5" strokeLinecap="round" />
      <path d="M52 58 Q78 34 92 20" stroke="#4ade80" strokeWidth="5" strokeLinecap="round" />
      <path d="M52 58 Q50 28 54 4" stroke="#4ade80" strokeWidth="4.5" strokeLinecap="round" />
      <path d="M52 58 Q16 54 4 72" stroke="#4ade80" strokeWidth="4" strokeLinecap="round" />
      <path d="M52 58 Q86 52 98 70" stroke="#4ade80" strokeWidth="4" strokeLinecap="round" />
    </svg>
  )
}

// Slunce SVG
function SunDecor({ className }) {
  const rays = Array.from({ length: 12 }, (_, i) => i * 30)
  return (
    <svg viewBox="0 0 160 160" fill="none" className={className}>
      <circle cx="80" cy="80" r="28" fill="#fbbf24" />
      {rays.map(deg => {
        const rad = (deg * Math.PI) / 180
        const r1 = 36, r2 = 56
        return (
          <line
            key={deg}
            x1={80 + r1 * Math.cos(rad)} y1={80 + r1 * Math.sin(rad)}
            x2={80 + r2 * Math.cos(rad)} y2={80 + r2 * Math.sin(rad)}
            stroke="#fbbf24" strokeWidth="4" strokeLinecap="round"
          />
        )
      })}
    </svg>
  )
}

export default function Hero() {
  return (
    <section className="relative bg-[#071828] overflow-hidden">
      {/* Letní gradient — oceán + trocha zeleně */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#071828] via-[#0b3a50] to-[#091e10]" />

      {/* Slunce — vpravo nahoře */}
      <div className="absolute top-12 right-[12%] pointer-events-none opacity-25">
        <SunDecor className="w-44 h-44" />
      </div>

      {/* Palma vpravo */}
      <div className="absolute bottom-10 right-6 sm:right-14 lg:right-[36%] pointer-events-none opacity-20 hidden sm:block">
        <Palm className="w-20 sm:w-28" />
      </div>

      {/* Palma vlevo — menší */}
      <div className="absolute bottom-10 -left-4 pointer-events-none opacity-12 hidden lg:block" style={{ opacity: 0.12 }}>
        <Palm className="w-16 scale-x-[-1]" />
      </div>

      {/* Vlnky oceánu */}
      <div className="absolute bottom-20 left-0 right-0 pointer-events-none opacity-10">
        <svg viewBox="0 0 1440 60" fill="none" className="w-full">
          <path d="M0 38 Q180 18 360 38 Q540 58 720 38 Q900 18 1080 38 Q1260 58 1440 38 L1440 60 L0 60 Z" fill="#38bdf8" />
          <path d="M0 48 Q180 28 360 48 Q540 68 720 48 Q900 28 1080 48 Q1260 68 1440 48 L1440 60 L0 60 Z" fill="#0ea5e9" opacity="0.5" />
        </svg>
      </div>

      {/* Dekorativní kruhy — teal */}
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-teal-400/8 rounded-full blur-3xl pointer-events-none" />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-28 sm:pt-36 pb-4 sm:pb-32 w-full">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">

          {/* Levá strana — text */}
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl sm:text-4xl xl:text-6xl font-black text-white leading-tight mb-5 sm:mb-6"
            >
              Vozy Škoda{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-[#86efac]">
                levněji
              </span>{' '}
              než v ČR
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-gray-300 text-base sm:text-lg leading-relaxed mb-4 max-w-lg"
            >
              Nová Škoda jako spolehlivý parťák k moři, do hor i na výlet s rodinou.
              Průměrná úspora <strong className="text-white">až 20 %</strong>, plná tovární záruka a kompletní servis bez starostí.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="hidden sm:block text-sm text-gray-400 mb-6 sm:mb-8"
            >
              Např. Škoda Karoq od <strong className="text-white">639 900 Kč</strong> — ušetříte <strong className="text-cyan-300 whitespace-nowrap">170 000 Kč</strong> oproti ČR
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
              className="hidden sm:flex flex-wrap items-center gap-4 sm:gap-6"
            >
              {[
                { icon: ShieldCheck, text: 'Tovární záruka zdarma' },
                { icon: Truck, text: 'Doprava a registrace zdarma' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-gray-300 text-sm">
                  <Icon size={16} className="text-cyan-400" />
                  {text}
                </div>
              ))}
              <div className="flex items-center gap-3 border-l border-white/10 pl-4 sm:pl-6">
                <span className="text-gray-400 text-sm">Spolupracujeme s autorizovanými partnery</span>
                <img src="/logo/skoda.webp" alt="Škoda Auto" className="h-16 w-auto opacity-90" />
              </div>
            </motion.div>
          </div>

          {/* Pravá strana — auto */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative flex items-end justify-center lg:justify-end"
          >
            {/* Škoda na dovolenou badge */}
            <motion.a
              href="/akce-dovolena"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="hidden lg:block absolute top-0 right-0 z-10 group"
            >
              <div className="bg-[#0891b2]/80 hover:bg-[#0891b2] rounded-xl px-4 py-3 shadow-xl shadow-cyan-900/40 text-center transition-colors">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <Sun size={11} className="text-cyan-200" />
                  <span className="text-cyan-200 text-xs font-bold uppercase tracking-widest">Škoda na dovolenou</span>
                </div>
                <div className="text-white text-2xl font-black leading-none">−10 000 Kč</div>
                <div className="text-cyan-100 text-xs mt-1 font-medium">na první objednávku</div>
                <div className="mt-2 pt-2 border-t border-white/20 text-white text-xs font-bold group-hover:underline">
                  Chci slevový kód →
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

      {/* Škoda na dovolenou — mobile banner */}
      <div className="lg:hidden relative z-10 px-4 pb-6">
        <a href="/akce-dovolena" className="block">
          <div className="flex items-center justify-between gap-4 bg-[#0891b2]/80 rounded-xl px-5 py-4 shadow-xl shadow-cyan-900/40">
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <Sun size={11} className="text-cyan-200" />
                <span className="text-cyan-200 text-xs font-bold uppercase tracking-widest">Škoda na dovolenou</span>
              </div>
              <div className="text-white text-2xl font-black leading-none">−10 000 Kč</div>
              <div className="text-cyan-100 text-xs mt-1">na první objednávku</div>
            </div>
            <div className="rounded-lg px-4 py-2.5 bg-white/20 text-white text-xs font-bold shrink-0 whitespace-nowrap text-center">
              Chci kód →
            </div>
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
