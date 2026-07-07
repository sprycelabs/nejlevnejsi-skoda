import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, ShieldCheck, Truck, Copy, Check } from 'lucide-react'

function PercentDecor({ className }) {
  return (
    <svg viewBox="0 0 120 120" fill="none" className={className}>
      <circle cx="30" cy="30" r="20" stroke="currentColor" strokeWidth="10" />
      <line x1="85" y1="10" x2="15" y2="110" stroke="currentColor" strokeWidth="10" strokeLinecap="round" />
      <circle cx="90" cy="90" r="20" stroke="currentColor" strokeWidth="10" />
    </svg>
  )
}

function TagDecor({ className }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" className={className}>
      <path d="M10 10 L10 55 L50 95 L95 50 L55 10 Z" stroke="currentColor" strokeWidth="7" strokeLinejoin="round" />
      <circle cx="32" cy="32" r="8" stroke="currentColor" strokeWidth="6" />
    </svg>
  )
}

export default function Hero() {
  const [copied, setCopied] = useState(false)

  const handleCopy = (e) => {
    e.preventDefault()
    navigator.clipboard.writeText('BERU_SLEVU')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className="relative bg-lime-600 overflow-hidden">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-lime-600 via-lime-600 to-lime-700 pointer-events-none" />

      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #65a30d 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          opacity: 0.3,
        }}
      />

      {/* Soft glow blobs */}
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-lime-300/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-lime-600/20 rounded-full blur-3xl pointer-events-none" />


      {/* Dekorativní % */}
      <div className="absolute top-16 left-[4%] pointer-events-none text-lime-700 opacity-20">
        <PercentDecor className="w-40 h-40 -rotate-12" />
      </div>
      <div className="absolute bottom-24 right-[3%] pointer-events-none text-lime-700 opacity-20 hidden sm:block">
        <PercentDecor className="w-32 h-32 rotate-12" />
      </div>
      <div className="absolute top-1/2 -translate-y-1/2 left-[1%] pointer-events-none text-lime-700 opacity-15 hidden lg:block">
        <PercentDecor className="w-24 h-24 rotate-6" />
      </div>
      <div className="absolute top-1/2 -translate-y-1/3 right-[8%] pointer-events-none text-lime-700 opacity-15 hidden lg:block">
        <PercentDecor className="w-64 h-64 rotate-6" />
      </div>

      {/* Dekorativní tagy */}
      <div className="absolute top-20 right-[42%] pointer-events-none text-lime-700 opacity-20 hidden lg:block">
        <TagDecor className="w-16 h-16 rotate-12" />
      </div>
      <div className="absolute bottom-16 left-[8%] pointer-events-none text-lime-700 opacity-20 hidden sm:block">
        <TagDecor className="w-20 h-20 -rotate-15" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-28 sm:pt-36 pb-4 sm:pb-32 w-full">
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
              <span className="text-lime-950">
                levněji
              </span>{' '}
              než v ČR
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lime-950/80 text-base sm:text-lg leading-relaxed mb-4 max-w-lg"
            >
              Dovoz Škody z EU za ceny výrazně nižší než u českých dealerů.
              Průměrná úspora <strong className="text-lime-950">až 20 %</strong>, plná tovární záruka a kompletní servis bez starostí.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="hidden sm:block text-sm text-lime-950/70 mb-6 sm:mb-8"
            >
              Např. Škoda Karoq od <strong className="text-lime-950">639 900 Kč</strong> — ušetříte <strong className="text-white whitespace-nowrap">170 000 Kč</strong> oproti ČR
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-3 sm:gap-4 mb-8 sm:mb-12"
            >
              <a
                href="#vozy"
                className="flex items-center gap-2 bg-lime-950 hover:bg-lime-900 text-white font-black px-5 sm:px-7 py-3 sm:py-4 rounded-md transition-all duration-200 shadow-lg shadow-lime-950/30 hover:-translate-y-0.5 text-sm sm:text-base"
              >
                Prohlédnout vozy
                <ArrowRight size={18} />
              </a>
              <a
                href="#jak-to-funguje"
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 border border-white/40 text-white font-semibold px-5 sm:px-7 py-3 sm:py-4 rounded-md transition-all duration-200 hover:-translate-y-0.5 text-sm sm:text-base"
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
                <div key={text} className="flex items-center gap-2 text-lime-950/80 text-sm">
                  <Icon size={16} className="text-lime-950" />
                  {text}
                </div>
              ))}
              <div className="flex items-center gap-3 border-l border-lime-950/20 pl-4 sm:pl-6">
                <span className="text-lime-950/60 text-sm">Spolupracujeme s autorizovanými partnery</span>
                <img src="/logo/skoda.webp" alt="Škoda Auto" className="h-16 w-auto opacity-80" />
              </div>
            </motion.div>
          </div>

          {/* Right — car photo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative flex flex-col items-center lg:items-end"
          >
            {/* BERU_SLEVU badge — desktop */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="hidden lg:block absolute top-0 right-0 z-10"
            >
              <button
                onClick={handleCopy}
                className="group bg-lime-500 hover:bg-lime-400 transition-all duration-200 rounded-xl px-4 py-3 shadow-xl shadow-lime-500/30 text-center cursor-pointer hover:-translate-y-0.5"
              >
                <div className="text-lime-950/60 text-xs font-bold uppercase tracking-widest mb-1">Aktuální akce</div>
                <div className="text-lime-950 text-2xl font-black leading-none">−10 000 Kč</div>
                <div className="text-lime-950 text-sm font-black leading-snug mt-0.5">To se prostě bere.</div>
                <div className="text-lime-950/70 text-xs mt-1 font-medium">na jakýkoliv vůz</div>
                <div className="mt-2 pt-2 border-t border-lime-950/15 flex items-center justify-center gap-1.5">
                  <span className="font-mono font-black text-lime-950 text-sm tracking-wider">BERU_SLEVU</span>
                  {copied
                    ? <Check size={12} className="text-lime-950/70" />
                    : <Copy size={12} className="text-lime-950/50 group-hover:text-lime-950/80 transition-colors" />
                  }
                </div>
                <div className="text-lime-950/50 text-xs mt-0.5">
                  {copied ? '✓ Zkopírováno!' : 'Klikni pro kopírování'}
                </div>
              </button>
            </motion.div>

            <img
              src="/hero-car.webp"
              alt="Škoda"
              fetchpriority="high"
              decoding="sync"
              className="w-full scale-125 sm:scale-100 lg:scale-125 xl:scale-150 lg:max-w-2xl xl:max-w-3xl lg:translate-y-24 origin-bottom"
              style={{ filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.15))' }}
            />

            {/* Dobrý anděl badge */}
            <motion.a
              href="/pomahame"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="hidden lg:flex items-center gap-4 bg-white/15 hover:bg-white/25 border border-white/30 backdrop-blur-sm rounded-2xl px-6 py-4 transition-all duration-200 lg:translate-y-24 mt-4 self-end"
            >
              <img src="/pomaha/dobry_andel.webp" alt="Dobrý anděl" className="h-14 w-auto" />
              <div>
                <p className="text-white text-sm font-black leading-tight">Držitelé certifikátu</p>
                <p className="text-white/60 text-sm leading-tight mt-0.5">Dobrý anděl · zjistit více</p>
              </div>
              <ArrowRight size={18} className="text-white/60 ml-2" />
            </motion.a>
          </motion.div>

        </div>
      </div>

      {/* BERU_SLEVU — mobile banner */}
      <div className="lg:hidden relative z-10 px-4 pb-6">
        <button
          onClick={handleCopy}
          className="w-full flex items-center justify-between gap-4 bg-lime-500 hover:bg-lime-400 transition-colors rounded-xl px-5 py-4 shadow-lg shadow-lime-500/25"
        >
          <div className="text-left">
            <div className="text-lime-950/60 text-xs font-bold uppercase tracking-widest mb-1">Aktuální akce</div>
            <div className="text-lime-950 text-2xl font-black leading-none">−10 000 Kč</div>
            <div className="text-lime-950/70 text-xs mt-1">na jakýkoliv vůz</div>
          </div>
          <div className="rounded-lg px-4 py-2.5 bg-lime-950/10 text-lime-950 shrink-0 text-center">
            <div className="font-mono font-black text-sm tracking-wider">BERU_SLEVU</div>
            <div className="flex items-center justify-center gap-1 mt-1 text-lime-950/60 text-xs">
              {copied ? <><Check size={11} /> Zkopírováno</> : <><Copy size={11} /> Kopírovat</>}
            </div>
          </div>
        </button>
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
