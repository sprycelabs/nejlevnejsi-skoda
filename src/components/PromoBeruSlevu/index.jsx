import { useState } from 'react'
import { Copy, Check, Tag } from 'lucide-react'
import { motion } from 'framer-motion'

export default function PromoBeruSlevu({ compact = false }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText('BERU_SLEVU')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (compact) {
    return (
      <div className="bg-gradient-to-r from-lime-500 to-lime-400 rounded-lg px-5 py-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white/25 rounded-md flex items-center justify-center shrink-0">
            <Tag size={17} className="text-white" />
          </div>
          <div>
            <p className="text-white font-black text-sm leading-tight">10 000 Kč? To se prostě bere.</p>
            <p className="text-lime-950/70 text-xs mt-0.5">Sleva 10 000 Kč na jakýkoliv vůz — použij kód při objednávce</p>
          </div>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 bg-white/25 hover:bg-white/40 border border-white/40 text-white font-black text-sm px-4 py-2 rounded-lg transition-all shrink-0 select-none"
        >
          <span className="font-mono tracking-wider">BERU_SLEVU</span>
          {copied
            ? <Check size={14} className="text-white" />
            : <Copy size={14} className="text-white" />
          }
        </button>
      </div>
    )
  }

  return (
    <section className="py-10 sm:py-14 bg-lime-50 overflow-hidden relative">
      <div className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #84cc16 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-br from-lime-500 to-lime-400 rounded-2xl px-6 sm:px-12 py-10 sm:py-12 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-xl shadow-lime-500/20"
        >
          {/* Left */}
          <div className="text-center lg:text-left">
            <p className="text-lime-950/60 text-xs font-black uppercase tracking-widest mb-2">Aktuální akce</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-3">
              10 000 Kč?<br />
              <span className="text-lime-950/80">To se prostě bere.</span>
            </h2>
            <p className="text-lime-950/60 text-sm max-w-sm mx-auto lg:mx-0">
              Sleva 10 000 Kč na jakýkoliv vůz z naší nabídky. Akci nelze kombinovat s dalšími slevami.
            </p>
          </div>

          {/* Right — code box */}
          <div className="flex flex-col items-center gap-3 shrink-0">
            <p className="text-lime-950/60 text-xs font-bold uppercase tracking-wider">Promo kód</p>
            <button
              onClick={handleCopy}
              className="group flex items-center gap-3 bg-white rounded-xl px-7 py-4 shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5 select-none"
            >
              <span className="font-mono font-black text-2xl text-lime-600 tracking-widest">BERU_SLEVU</span>
              <span className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 ${
                copied ? 'bg-lime-100 text-lime-600' : 'bg-gray-100 text-gray-400 group-hover:bg-lime-100 group-hover:text-lime-600'
              }`}>
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </span>
            </button>
            <p className="text-lime-950/50 text-xs">
              {copied ? '✓ Zkopírováno do schránky' : 'Klikni pro zkopírování'}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
