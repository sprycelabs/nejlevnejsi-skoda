import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Flame, ArrowRight, AlertCircle, Banknote, Scissors } from 'lucide-react'
import { cars, formatPrice } from '../../data/cars'

export default function BombDeal() {
  const car = cars.find(c => c.isBomb)
  if (!car) return null

  const savings = car.originalPrice - car.salePrice

  return (
    <section className="py-16 sm:py-20 bg-[#0d1f10] overflow-hidden relative">
      {/* bg glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">

        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-2 mb-8"
        >
          <div className="h-px flex-1 max-w-16 bg-orange-500/40" />
          <span className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-black px-4 py-1.5 rounded-full tracking-widest uppercase">
            <Flame size={12} /> Cenová bomba <Flame size={12} />
          </span>
          <div className="h-px flex-1 max-w-16 bg-orange-500/40" />
        </motion.div>

        {/* Main card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl border-2 border-orange-400/60 overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #1a2e1c 0%, #0f1f11 60%, #1a1200 100%)' }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">

            {/* Left — text */}
            <div className="p-8 sm:p-10 flex flex-col justify-center">
              <p className="text-orange-400 text-xs font-black uppercase tracking-widest mb-3">Limitovaná nabídka</p>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight mb-3">
                {car.bombTagline}
              </h2>
              <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-6 max-w-md">
                {car.bombNote}
              </p>

              {/* Price */}
              <div className="mb-7">
                <span className="text-gray-500 text-sm line-through block">{formatPrice(car.originalPrice)}</span>
                <span className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">
                  {formatPrice(car.salePrice)}
                </span>
                <span className="block text-sm text-gray-400 mt-1">
                  vč. DPH · <span className="text-orange-400 font-semibold">ušetříte {formatPrice(savings)}</span>
                </span>
              </div>

              {/* Podmínky — kompaktně */}
              <div className="space-y-2 mb-8">
                {car.bombConditions.map(cond => (
                  <div key={cond} className="flex items-center gap-2.5">
                    <AlertCircle size={13} className="text-orange-400 shrink-0" />
                    <span className="text-gray-300 text-sm">{cond}</span>
                  </div>
                ))}
              </div>

              {/* Po 18 měsících */}
              <div className="grid grid-cols-2 gap-3 mb-8">
                {car.bombAfterOptions.map(({ title, desc }, i) => (
                  <div key={title} className={`rounded-lg p-3.5 border ${i === 0 ? 'border-white/10 bg-white/5' : 'border-orange-400/30 bg-orange-500/10'}`}>
                    <div className="flex items-center gap-1.5 mb-1">
                      {i === 0
                        ? <Scissors size={12} className="text-gray-400 shrink-0" />
                        : <Banknote size={12} className="text-orange-400 shrink-0" />
                      }
                      <span className={`text-xs font-black ${i === 0 ? 'text-gray-200' : 'text-orange-300'}`}>{title}</span>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>

              <Link
                to={`/vozy/${car.slug}`}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white font-black px-7 py-4 rounded-lg transition-all duration-200 text-sm self-start group"
              >
                <Flame size={16} />
                Chci tuto nabídku
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Right — car image */}
            <div className="relative flex items-end justify-center overflow-hidden min-h-64 lg:min-h-0">
              {/* orange glow behind car */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-72 h-32 bg-orange-500/20 rounded-full blur-2xl" />
              {/* discount badge */}
              <div className="absolute top-6 right-6 w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex flex-col items-center justify-center shadow-xl z-10">
                <span className="text-white text-xs font-black leading-none">-{car.discount}%</span>
              </div>
              <motion.img
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                src={car.image}
                alt={`${car.name} ${car.variant}`}
                className="relative z-10 w-full max-w-sm lg:max-w-full object-contain p-6 lg:p-10"
                style={{ filter: 'drop-shadow(0 20px 50px rgba(251,146,60,0.25))' }}
              />
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  )
}
