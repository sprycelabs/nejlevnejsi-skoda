import { motion } from 'framer-motion'
import { Fuel, Cog, Zap, Package, Truck, ShoppingCart, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cars, formatPrice } from '../../data/cars'
import { useCart } from '../../context/CartContext'

function CarCard({ car, index }) {
  const { addToCart } = useCart()
  return (
    <Link to={`/vozy/${car.slug}`} className="block">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden group flex flex-col h-full"
    >
      {/* Image area */}
      <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 h-52 flex items-center justify-center overflow-hidden">
        <img
          src={car.image}
          alt={car.name}
          className="h-full w-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {car.isSale && (
            <span className="bg-[#1e7e34] text-white text-xs font-bold px-2.5 py-1 rounded-full">
              Akce
            </span>
          )}
          {car.isNew && (
            <span className="bg-[#0d6efd] text-white text-xs font-bold px-2.5 py-1 rounded-full">
              Novinka
            </span>
          )}
          {car.freeDelivery && (
            <span className="bg-[#fd7e14] text-white text-xs font-bold px-2.5 py-1 rounded-full">
              Doprava ZDARMA
            </span>
          )}
        </div>

        {/* Discount badge */}
        <div className="absolute top-3 right-3 w-12 h-12 bg-red-500 text-white rounded-full flex flex-col items-center justify-center shadow-lg">
          <span className="text-xs font-black leading-none">{car.discount} %</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="mb-3">
          <h3 className="font-black text-lg text-gray-900">{car.name}</h3>
          <p className="text-gray-500 text-sm">{car.variant} · {car.power}</p>
        </div>

        {/* Specs */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <Fuel size={13} className="text-gray-400 shrink-0" />
            {car.fuel}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <Cog size={13} className="text-gray-400 shrink-0" />
            {car.transmission}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <Zap size={13} className="text-gray-400 shrink-0" />
            {car.consumption}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <Package size={13} className="text-gray-400 shrink-0" />
            Skladem {car.inStock} ks
          </div>
        </div>

        {/* Price */}
        <div className="mb-4 mt-auto">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-xs text-gray-400 line-through">{formatPrice(car.originalPrice)}</span>
            {car.freeDelivery && (
              <span className="flex items-center gap-1 text-xs text-[#1e7e34] font-medium">
                <Truck size={11} /> Doprava zdarma
              </span>
            )}
          </div>
          <div className="text-2xl font-black text-[#1e7e34]">{formatPrice(car.salePrice)}</div>
          <div className="text-xs text-gray-400">vč. DPH · ušetříte {formatPrice(car.originalPrice - car.salePrice)}</div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            onClick={e => { e.preventDefault(); addToCart(car) }}
            className="flex-1 flex items-center justify-center gap-1.5 bg-[#1e7e34] hover:bg-[#28a745] text-white text-sm font-semibold py-3 px-4 rounded-md transition-colors"
          >
            <ShoppingCart size={15} />
            Do košíku
          </button>
          <span className="flex items-center gap-1 border border-gray-200 hover:border-[#1e7e34] text-gray-600 hover:text-[#1e7e34] text-sm font-medium py-3 px-4 rounded-md transition-colors">
            Detail
            <ArrowRight size={14} />
          </span>
        </div>
      </div>
    </motion.div>
    </Link>
  )
}

export default function CarListing() {
  return (
    <section id="vozy" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[#1e7e34] font-semibold text-sm uppercase tracking-wider mb-2"
            >
              Výběr vozů
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900"
            >
              Vozy ihned k odběru
            </motion.h2>
          </div>
          <motion.a
            href="/vozy"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-1.5 text-[#1e7e34] font-semibold hover:gap-2.5 transition-all text-sm"
          >
            Všechny vozy <ArrowRight size={16} />
          </motion.a>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {cars.slice(0, 6).map((car, i) => (
            <CarCard key={car.id} car={car} index={i} />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <a
            href="/vozy"
            className="inline-flex items-center gap-2 bg-white border-2 border-[#1e7e34] text-[#1e7e34] font-bold px-8 py-4 rounded-md hover:bg-[#1e7e34] hover:text-white transition-all duration-200"
          >
            Zobrazit všechny vozy
            <ArrowRight size={18} />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
