import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Copy, Check, ArrowRight, ShieldCheck, Truck, Tag,
  Zap, Fuel, Cog, BadgePercent, Star, Users, Clock
} from 'lucide-react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import SEO from '../../components/SEO'
import { cars, formatPrice } from '../../data/cars'

function PercentDecor({ className }) {
  return (
    <svg viewBox="0 0 120 120" fill="none" className={className}>
      <circle cx="30" cy="30" r="20" stroke="currentColor" strokeWidth="10" />
      <line x1="85" y1="10" x2="15" y2="110" stroke="currentColor" strokeWidth="10" strokeLinecap="round" />
      <circle cx="90" cy="90" r="20" stroke="currentColor" strokeWidth="10" />
    </svg>
  )
}

function useCopy() {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText('BERU_SLEVU')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return [copied, copy]
}

function CodeButton({ size = 'lg', align = 'center' }) {
  const [copied, copy] = useCopy()
  const isLg = size === 'lg'
  return (
    <div className={`flex flex-col gap-2 ${align === 'center' ? 'items-center' : 'items-start'}`}>
      <button
        onClick={copy}
        className={`group flex items-center gap-2 sm:gap-3 bg-white rounded-2xl shadow-2xl shadow-lime-950/20 hover:shadow-lime-950/30 hover:-translate-y-1 transition-all duration-200 select-none ${isLg ? 'px-5 py-4 sm:px-8 sm:py-5' : 'px-4 py-3'}`}
      >
        <span className={`font-mono font-black text-lime-600 tracking-widest ${isLg ? 'text-2xl sm:text-3xl md:text-4xl' : 'text-lg sm:text-xl'}`}>
          BERU_SLEVU
        </span>
        <span className={`flex items-center justify-center rounded-xl transition-all duration-200 ${copied ? 'bg-lime-100 text-lime-600' : 'bg-gray-100 text-gray-400 group-hover:bg-lime-100 group-hover:text-lime-600'} ${isLg ? 'w-9 h-9 sm:w-10 sm:h-10' : 'w-7 h-7 sm:w-8 sm:h-8'}`}>
          {copied ? <Check size={isLg ? 18 : 15} /> : <Copy size={isLg ? 18 : 15} />}
        </span>
      </button>
      <p className="text-lime-950/50 text-sm">{copied ? '✓ Zkopírováno!' : 'Klikni pro zkopírování'}</p>
    </div>
  )
}

// Vybereme mix config aut pro showcase
const featuredCars = cars
  .filter(c => c.type === 'config')
  .slice(0, 6)

const stats = [
  { value: '800+', label: 'Spokojených zákazníků', icon: Users },
  { value: '20 %', label: 'Průměrná úspora oproti ČR', icon: BadgePercent },
  { value: '100%', label: 'Tovární záruka zachována', icon: ShieldCheck },
  { value: '14 dní', label: 'Průměrná doba dodání', icon: Clock },
]

export default function BeruSlevu() {
  const [herocopied, heroCopy] = useCopy()

  return (
    <>
      <SEO
        title="BERU_SLEVU — sleva 10 000 Kč na jakýkoliv vůz Škoda"
        description="Použij promo kód BERU_SLEVU a získej slevu 10 000 Kč na jakýkoliv nový vůz Škoda z EU. Tovární záruka, doprava zdarma."
        canonical="/beru-slevu"
      />
      <Navbar />

      {/* ── HERO ─────────────────────────────────────── */}
      <section className="relative bg-lime-600 overflow-hidden pt-24 pb-0">
        <div className="absolute inset-0 bg-gradient-to-br from-lime-500 via-lime-600 to-lime-700 pointer-events-none" />
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #65a30d 1px, transparent 1px)', backgroundSize: '28px 28px', opacity: 0.25 }} />
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-lime-400/30 rounded-full blur-3xl pointer-events-none" />

        <div className="absolute top-24 left-[2%] pointer-events-none text-lime-700 opacity-20 hidden lg:block">
          <PercentDecor className="w-48 h-48 -rotate-12" />
        </div>
        <div className="absolute top-32 right-[2%] pointer-events-none text-lime-700 opacity-15 hidden lg:block">
          <PercentDecor className="w-32 h-32 rotate-12" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-end">

            {/* Left */}
            <div className="pt-6 pb-4 lg:pb-24">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl sm:text-5xl xl:text-[5.5rem] font-black leading-[1.05] mb-3"
              >
                <span className="text-white block">10 000 Kč?</span>
                <span className="text-lime-950 block">To se prostě bere.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lime-950/70 text-base sm:text-lg mt-5 mb-8 leading-relaxed"
              >
                Sleva <strong className="text-lime-950">10 000 Kč</strong> na jakýkoliv nový vůz Škoda z naší nabídky.
                Žádná podmínka, žádná registrace — stačí zadat kód.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-8 flex flex-col items-start gap-2"
              >
                <p className="text-lime-950/60 text-xs font-bold uppercase tracking-widest">Promo kód</p>
                <CodeButton size="lg" align="left" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap items-center gap-5"
              >
                {[
                  { icon: ShieldCheck, text: 'Tovární záruka' },
                  { icon: Truck, text: 'Doprava zdarma' },
                  { icon: Star, text: 'Ověření zákazníci' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2 text-lime-950/70 text-sm font-medium">
                    <Icon size={15} className="text-lime-950" />
                    {text}
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right — car (desktop) */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="hidden lg:flex items-center justify-center relative"
            >
              <img
                src="/hero-car.webp"
                alt="Škoda"
                className="w-full max-w-2xl scale-105 origin-center object-contain"
                style={{ filter: 'drop-shadow(0 40px 60px rgba(0,0,0,0.25))' }}
              />
            </motion.div>
          </div>
        </div>

        {/* Auto na mobilu */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="lg:hidden relative z-10 -mb-6"
        >
          <img
            src="/hero-car.webp"
            alt="Škoda"
            className="w-full max-w-sm mx-auto object-contain"
            style={{ filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.2))' }}
          />
        </motion.div>

        {/* Wave */}
        <div className="relative z-10">
          <svg viewBox="0 0 1440 80" fill="none" className="w-full block">
            <path d="M0 80L1440 80L1440 40C1200 80 960 0 720 40C480 80 240 0 0 40L0 80Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────── */}
      <section className="py-14 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map(({ value, label, icon: Icon }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="text-center"
              >
                <div className="w-11 h-11 bg-lime-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Icon size={20} className="text-lime-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-gray-900 mb-1">{value}</div>
                <div className="text-gray-500 text-xs sm:text-sm leading-tight">{label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VYBRANÁ AUTA ─────────────────────────────── */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-lime-100 border border-lime-200 rounded-full px-4 py-1.5 mb-4">
              <Tag size={13} className="text-lime-600" />
              <span className="text-lime-700 text-xs font-bold uppercase tracking-widest">S kódem BERU_SLEVU</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">Vybraná auta se slevou</h2>
            <p className="text-gray-500 max-w-md mx-auto">Zadej kód při objednávce a každé z těchto aut bude o 10 000 Kč levnější.</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredCars.map((car, i) => (
              <motion.div
                key={car.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
              >
                <Link to={`/vozy/${car.slug}`} className="block bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group">
                  {/* Badge */}
                  <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 h-48 flex items-center justify-center overflow-hidden">
                    <img src={car.image} alt={car.name} className="h-full w-full object-contain p-4 group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute top-3 left-3">
                      <span className="bg-lime-500 text-white text-xs font-black px-2.5 py-1 rounded-full">Novinka</span>
                    </div>
                    <div className="absolute top-3 right-3 w-11 h-11 bg-red-500 text-white rounded-full flex flex-col items-center justify-center shadow">
                      <span className="text-xs font-black leading-none">{car.discount}%</span>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="font-black text-gray-900 text-base mb-0.5">{car.name}</h3>
                    <p className="text-gray-400 text-sm mb-3">{car.variant}</p>

                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                      <span className="flex items-center gap-1"><Fuel size={12} />{car.fuel}</span>
                      <span className="flex items-center gap-1"><Cog size={12} />{car.transmission}</span>
                      <span className="flex items-center gap-1"><Zap size={12} />{car.power}</span>
                    </div>

                    {/* Ceny */}
                    <div className="bg-lime-50 border border-lime-200 rounded-xl p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-gray-400 text-xs">Naše cena</span>
                        <span className="text-gray-400 text-xs line-through">{formatPrice(car.salePrice)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-lime-700 text-xs font-bold">S kódem BERU_SLEVU</span>
                        <span className="text-lime-700 font-black text-lg">{formatPrice(car.salePrice - 10000)}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/vozy"
              className="inline-flex items-center gap-2 bg-lime-600 hover:bg-lime-500 text-white font-black px-8 py-4 rounded-xl transition-all hover:-translate-y-0.5 shadow-lg shadow-lime-600/20"
            >
              Zobrazit všechna auta
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── JAK TO FUNGUJE ───────────────────────────── */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">Jak to funguje?</h2>
            <p className="text-gray-500">Tři kroky a máš slevu na svůj nový vůz.</p>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { n: '01', title: 'Vyber vůz', desc: 'Prohlédni si nabídku nových Škod z EU. Všechna auta jsou skladem, ceny jsou konečné.' },
              { n: '02', title: 'Zadej kód', desc: 'V košíku zadej kód BERU_SLEVU. Sleva 10 000 Kč se automaticky odečte od ceny.' },
              { n: '03', title: 'Postaráme se o vše', desc: 'Dovoz, přihlášení i předání vozu zařídíme my. Tovární záruka zůstává zachována.' },
            ].map(({ n, title, desc }, i) => (
              <motion.div
                key={n}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-gray-50 rounded-2xl p-7 sm:p-8 relative overflow-hidden min-h-[160px]"
              >
                {/* Velké číslo v pozadí */}
                <div
                  className="absolute -bottom-6 -right-3 font-black text-lime-500/35 leading-none select-none pointer-events-none"
                  style={{ fontSize: '9rem' }}
                >
                  {n}
                </div>
                {/* Malý číselný indikátor */}
                <div className="font-mono font-black text-lime-500 text-sm mb-4">{n}</div>
                <h3 className="font-black text-gray-900 text-lg sm:text-xl mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PODMÍNKY ─────────────────────────────────── */}
      <section className="py-10 bg-gray-50 border-t border-gray-100">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <h3 className="font-black text-gray-700 text-sm uppercase tracking-wider mb-4 text-center">Podmínky akce</h3>
          <div className="grid sm:grid-cols-2 gap-2">
            {[
              'Platí na jakýkoliv vůz z aktuální nabídky',
              'Nelze kombinovat s dalšími slevami',
              'Kód je volně dostupný, bez registrace',
              'Platný do odvolání',
            ].map(item => (
              <div key={item} className="flex items-center gap-2 text-sm text-gray-500">
                <Check size={14} className="text-lime-500 shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ───────────────────────────────── */}
      <section className="py-20 bg-lime-600 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #65a30d 1px, transparent 1px)', backgroundSize: '28px 28px', opacity: 0.25 }} />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-lime-800/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-2">Zkopíruj.</h2>
            <h2 className="text-4xl sm:text-5xl font-black text-lime-950 mb-6">Vlož. Ušetři.</h2>
            <p className="text-lime-950/60 mb-10 text-lg">Sleva 10 000 Kč na jakýkoliv vůz. Žádné podmínky.</p>

            <div className="flex flex-col items-center gap-6">
              <CodeButton size="lg" />
              <Link
                to="/vozy"
                className="flex items-center gap-2 bg-lime-950 hover:bg-lime-900 text-white font-black px-8 py-4 rounded-xl transition-all hover:-translate-y-0.5 shadow-lg"
              >
                Prohlédnout vozy <ArrowRight size={18} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  )
}
