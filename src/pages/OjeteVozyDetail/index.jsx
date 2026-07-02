import { useState, useEffect, useCallback } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, Phone, ShieldCheck, Truck, CheckCircle2,
  ChevronRight, ChevronLeft, Maximize2, X, Gauge, Calendar,
  Wrench, Fuel, Cog, ShoppingCart, AlertTriangle, MapPin, Info
} from 'lucide-react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import SEO from '../../components/SEO'
import { ojeteVozy, formatPrice } from '../../data/cars'

export default function OjeteVozyDetail() {
  const { slug } = useParams()
  const car = ojeteVozy.find(c => c.slug === slug)

  if (!car) return <Navigate to="/ojete-vozy" replace />

  return <CarDetail car={car} />
}

function CarDetail({ car }) {
  const { addToCart } = useCart()
  const soldOut = car.inStock === 0

  const images = car.images?.length ? car.images : [car.image]

  const [activeIdx, setActiveIdx] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('prehled')

  const prev = useCallback(() => setActiveIdx(i => (i - 1 + images.length) % images.length), [images.length])
  const next = useCallback(() => setActiveIdx(i => (i + 1) % images.length), [images.length])

  useEffect(() => {
    if (!lightboxOpen) return
    const handler = e => {
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'Escape') setLightboxOpen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [lightboxOpen, prev, next])

  const specs = [
    { label: 'Palivo', value: car.fuel },
    { label: 'Převodovka', value: car.transmission },
    { label: 'Výkon', value: car.power },
    { label: 'Rok výroby', value: String(car.year) },
    { label: 'Nájezd', value: car.mileage },
    ...(car.color ? [{ label: 'Barva', value: car.color }] : []),
    ...(car.origin ? [{ label: 'Původ', value: car.origin }] : []),
    ...(car.stk ? [{ label: 'STK platná do', value: String(car.stk) }] : []),
  ]

  const tabs = [
    { key: 'prehled', label: 'Přehled' },
    ...(car.equipment ? [{ key: 'vybava', label: 'Výbava' }] : []),
    ...(car.highlight ? [{ key: 'stav', label: 'Stav vozu' }] : []),
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title={`${car.name} ${car.variant} ${car.year} | Ojeté vozy`}
        description={car.highlight?.slice(0, 160) ?? `${car.name} ${car.variant}, ${car.year}, ${car.mileage}. Cena ${formatPrice(car.salePrice)} vč. DPH.`}
        canonical={`/ojete-vozy/${car.slug}`}
        image={`https://nejlevnejsi-skoda.cz${car.image}`}
        type="product"
      />
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative bg-[#0d1f10] overflow-hidden pt-24">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d1f10] via-[#1a3d1e] to-[#0a1508]" />
        <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-[#1e7e34]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 text-sm text-gray-400 pt-6 pb-4 flex-wrap">
            <Link to="/" className="hover:text-white transition-colors">Domů</Link>
            <ChevronRight size={13} />
            <Link to="/ojete-vozy" className="hover:text-white transition-colors">Ojeté vozy</Link>
            <ChevronRight size={13} />
            <span className="text-gray-200">{car.name} {car.variant}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 items-end pb-0 pt-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="pb-4 lg:pb-12"
            >
              <div className="flex flex-wrap gap-2 mb-5">
                <span className="bg-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">Ojeté</span>
                {soldOut
                  ? <span className="bg-gray-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">Prodáno</span>
                  : car.isReserved
                    ? <span className="bg-gray-600 text-white text-xs font-bold px-3 py-1.5 rounded-full">Rezervováno</span>
                    : <span className="bg-[#1e7e34] text-white text-xs font-bold px-3 py-1.5 rounded-full">Skladem</span>
                }
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white mb-2">{car.name}</h1>
              <p className="text-gray-300 text-base sm:text-xl mb-6">{car.variant} · {car.power}</p>

              <div className="flex flex-wrap gap-5 mb-8">
                {[
                  { icon: Gauge,    v: car.mileage },
                  { icon: Calendar, v: String(car.year) },
                  { icon: Fuel,     v: car.fuel },
                  { icon: Cog,      v: car.transmission },
                ].map(({ icon: Icon, v }) => (
                  <div key={v} className="flex items-center gap-2 text-gray-300 text-sm">
                    <Icon size={15} className="text-[#28a745]" />
                    {v}
                  </div>
                ))}
              </div>

              <div className="inline-flex flex-col">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#28a745] to-[#86efac]">
                    {formatPrice(car.salePrice)}
                  </span>
                  <span className="text-gray-400 text-sm line-through">{formatPrice(car.originalPrice)}</span>
                </div>
                <span className="text-gray-400 text-sm mt-1">vč. DPH · dovoz domů · přihlášení v ČR</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="flex items-end justify-center"
            >
              <img
                src={car.image}
                alt={`${car.name} ${car.variant}`}
                className="w-full max-w-xs sm:max-w-sm lg:max-w-2xl lg:translate-y-6 pb-4 lg:pb-0 object-cover"
                style={{ filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.7))' }}
              />
            </motion.div>
          </div>
        </div>

        <div className="relative z-10">
          <svg viewBox="0 0 1440 60" fill="none" className="w-full block">
            <path d="M0 60L1440 60L1440 30C1200 60 960 0 720 30C480 60 240 0 0 30L0 60Z" fill="#f9fafb" />
          </svg>
        </div>
      </section>

      {/* ── MAIN ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

          {/* left (2/3) */}
          <div className="lg:col-span-2 space-y-8">

            {/* Galerie */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden"
            >
              <div className="relative bg-gray-100 overflow-hidden" style={{ aspectRatio: '16/10' }}>
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeIdx}
                    src={images[activeIdx]}
                    alt={`${car.name} – foto ${activeIdx + 1}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>

                {images.length > 1 && (
                  <>
                    <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-md flex items-center justify-center transition-all hover:scale-105">
                      <ChevronLeft size={20} className="text-gray-700" />
                    </button>
                    <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-md flex items-center justify-center transition-all hover:scale-105">
                      <ChevronRight size={20} className="text-gray-700" />
                    </button>
                  </>
                )}
                <button onClick={() => setLightboxOpen(true)} className="absolute top-3 right-3 w-9 h-9 bg-white/90 hover:bg-white rounded-md shadow-md flex items-center justify-center">
                  <Maximize2 size={16} className="text-gray-700" />
                </button>
                {images.length > 1 && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    {activeIdx + 1} / {images.length}
                  </div>
                )}
              </div>

              {images.length > 1 && (
                <div className="flex gap-2 p-3 overflow-x-auto border-t border-gray-100">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveIdx(i)}
                      className={`shrink-0 w-20 h-14 rounded-md overflow-hidden border-2 transition-all ${
                        i === activeIdx ? 'border-[#1e7e34] shadow-md' : 'border-gray-200 hover:border-gray-400 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`náhled ${i + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Trust bar */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-3"
            >
              {[
                { icon: ShieldCheck, title: 'Prověřený vůz', sub: 'Servisní historie, bez skrytých vad' },
                { icon: Wrench,      title: 'Servis v pořádku', sub: 'Provedená výměna oleje a převodovky' },
                { icon: Truck,       title: 'Dovoz a registrace', sub: 'V ceně, po celé ČR' },
              ].map(({ icon: Icon, title, sub }) => (
                <div key={title} className="bg-white rounded-lg border border-gray-100 shadow-sm p-4 sm:p-5 flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#f0faf2] rounded-md flex items-center justify-center shrink-0">
                    <Icon size={20} className="text-[#1e7e34]" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-sm">{title}</div>
                    <div className="text-xs text-gray-500">{sub}</div>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden"
            >
              <div className="flex border-b border-gray-100 overflow-x-auto">
                {tabs.map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-5 py-4 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
                      activeTab === tab.key ? 'border-[#1e7e34] text-[#1e7e34]' : 'border-transparent text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {activeTab === 'prehled' && (
                  <motion.div key="prehled" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="divide-y divide-gray-50">
                    {specs.map(({ label, value }) => (
                      <div key={label} className="flex items-center justify-between px-7 py-4 hover:bg-gray-50 transition-colors">
                        <span className="text-sm text-gray-500">{label}</span>
                        <span className="text-sm font-semibold text-gray-900">{value}</span>
                      </div>
                    ))}
                  </motion.div>
                )}

                {activeTab === 'vybava' && car.equipment && (
                  <motion.div key="vybava" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="divide-y divide-gray-100">
                    {Object.entries(car.equipment).map(([category, items]) => (
                      <div key={category} className="px-7 py-5">
                        <h3 className="font-bold text-gray-900 mb-3">{category}</h3>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6">
                          {items.map(item => (
                            <li key={item} className="flex items-center gap-2 text-sm text-gray-700">
                              <CheckCircle2 size={14} className="text-[#1e7e34] shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </motion.div>
                )}

                {activeTab === 'stav' && car.highlight && (
                  <motion.div key="stav" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="px-7 py-6">
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{car.highlight}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* CTA dark card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-[#0d1f10] to-[#1a3d1e] rounded-xl p-7 sm:p-10 text-white"
            >
              <p className="text-[#86efac] font-semibold text-sm uppercase tracking-wider mb-2">Zájem o vůz?</p>
              <h2 className="text-2xl sm:text-3xl font-black mb-2">Kontaktujte nás</h2>
              <p className="text-gray-400 text-sm mb-8">Rádi zodpovíme vaše otázky a domluvíme podmínky.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
                {[
                  { icon: ShieldCheck, title: 'Transparentní původ',  sub: 'Servisní dokumentace, žádná překvapení.' },
                  { icon: Truck,       title: 'Vše na klíč',          sub: 'Přeprava, registrace v ČR, dovoz domů — vše v ceně.' },
                ].map(({ icon: Icon, title, sub }) => (
                  <div key={title} className="flex items-start gap-4 bg-white/5 rounded-lg p-4">
                    <div className="w-10 h-10 bg-[#1e7e34]/40 rounded-md flex items-center justify-center shrink-0">
                      <Icon size={18} className="text-[#28a745]" />
                    </div>
                    <div>
                      <div className="font-bold text-white mb-0.5">{title}</div>
                      <div className="text-gray-400 text-sm leading-relaxed">{sub}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-5 border-t border-white/10">
                <p className="text-gray-400 text-sm">Máte otázky? Zavolejte nám — rádi poradíme.</p>
                <a href="tel:+420733455966" className="flex items-center gap-2 bg-[#1e7e34] hover:bg-[#28a745] text-white font-bold px-6 py-3 rounded-md transition-colors text-sm whitespace-nowrap">
                  <Phone size={15} /> +420 733 455 966
                </a>
              </div>
            </motion.div>
          </div>

          {/* sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.25 }}
                className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden"
              >
                <div className="bg-[#f0faf2] px-6 py-5 border-b border-green-100">
                  <div className="text-xs text-[#1e7e34] uppercase tracking-wider font-bold mb-1">Cena vč. DPH</div>
                  <div className="text-4xl font-black text-[#1e7e34] mb-0.5">{formatPrice(car.salePrice)}</div>
                  <div className="text-xs text-gray-400 line-through mb-1">{formatPrice(car.originalPrice)}</div>
                  <div className="text-xs text-gray-500">dovoz domů · přihlášení v ČR · bez skrytých poplatků</div>
                </div>

                <div className="p-5 space-y-3">
                  {soldOut ? (
                    <>
                      <div className="flex items-center gap-2 text-sm font-semibold px-3 py-2 rounded-md bg-gray-100 text-gray-500">
                        <div className="w-2 h-2 rounded-full bg-gray-400 shrink-0" />
                        Prodáno
                      </div>
                      <div className="w-full flex items-center justify-center gap-2 bg-gray-200 text-gray-400 font-bold py-4 rounded-md text-base cursor-not-allowed">
                        <ShoppingCart size={18} /> Prodáno
                      </div>
                    </>
                  ) : car.isReserved ? (
                    <>
                      <div className="flex items-center gap-2 text-sm font-semibold px-3 py-2 rounded-md bg-gray-100 text-gray-500">
                        <div className="w-2 h-2 rounded-full bg-gray-500 shrink-0" />
                        Rezervováno
                      </div>
                      <div className="w-full flex items-center justify-center gap-2 bg-gray-200 text-gray-400 font-bold py-4 rounded-md text-base cursor-not-allowed">
                        <ShoppingCart size={18} /> Rezervováno
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 text-sm font-semibold px-3 py-2 rounded-md bg-green-50 text-[#1e7e34]">
                        <div className="w-2 h-2 rounded-full bg-[#1e7e34] shrink-0" />
                        Skladem · k dispozici
                      </div>
                      <button
                        onClick={() => addToCart(car)}
                        className="w-full flex items-center justify-center gap-2 bg-[#1e7e34] hover:bg-[#28a745] text-white font-bold py-4 rounded-md text-base transition-colors"
                      >
                        <ShoppingCart size={18} /> Do košíku
                      </button>
                    </>
                  )}

                  <a
                    href="tel:+420733455966"
                    className="flex items-center justify-center gap-2 w-full border-2 border-[#1e7e34] text-[#1e7e34] hover:bg-[#1e7e34] hover:text-white font-semibold py-3 rounded-md transition-all text-sm"
                  >
                    <Phone size={15} /> Zavolat: +420 733 455 966
                  </a>
                </div>
              </motion.div>

              <Link to="/ojete-vozy" className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 transition-colors px-1">
                <ArrowLeft size={15} /> Zpět na ojeté vozy
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* mobile sticky bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-2xl px-4 py-3 flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <div className="text-xl font-black text-[#1e7e34] leading-tight">{formatPrice(car.salePrice)}</div>
          <div className="text-xs text-gray-400">{car.name}</div>
        </div>
        <a href="tel:+420733455966" className="flex items-center gap-1 border-2 border-[#1e7e34] text-[#1e7e34] font-bold px-3 py-2 rounded-md text-sm whitespace-nowrap">
          <Phone size={14} /> Zavolat
        </a>
        {!soldOut && !car.isReserved && (
          <button
            onClick={() => addToCart(car)}
            className="flex items-center gap-1 bg-[#1e7e34] hover:bg-[#28a745] text-white font-bold px-3 py-2 rounded-md text-sm whitespace-nowrap transition-colors"
          >
            <ShoppingCart size={14} /> Do košíku
          </button>
        )}
      </div>
      <div className="lg:hidden h-20" />

      {/* lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center"
            onClick={() => setLightboxOpen(false)}
          >
            <div className="relative w-full max-w-5xl px-16" onClick={e => e.stopPropagation()}>
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeIdx}
                  src={images[activeIdx]}
                  alt={`foto ${activeIdx + 1}`}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.18 }}
                  className="w-full max-h-[75vh] object-contain"
                />
              </AnimatePresence>
              {images.length > 1 && (
                <>
                  <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/25 rounded-full flex items-center justify-center transition-colors">
                    <ChevronLeft size={26} className="text-white" />
                  </button>
                  <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/25 rounded-full flex items-center justify-center transition-colors">
                    <ChevronRight size={26} className="text-white" />
                  </button>
                </>
              )}
            </div>
            {images.length > 1 && (
              <>
                <div className="text-white/60 text-sm mt-4">{activeIdx + 1} / {images.length}</div>
                <div className="flex gap-2 mt-4 px-4 overflow-x-auto max-w-3xl" onClick={e => e.stopPropagation()}>
                  {images.map((img, i) => (
                    <button key={i} onClick={() => setActiveIdx(i)}
                      className={`shrink-0 w-16 h-11 rounded border-2 overflow-hidden transition-all ${i === activeIdx ? 'border-[#28a745]' : 'border-white/20 opacity-50 hover:opacity-80'}`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </>
            )}
            <button onClick={() => setLightboxOpen(false)} className="absolute top-5 right-5 w-10 h-10 bg-white/10 hover:bg-white/25 rounded-full flex items-center justify-center transition-colors">
              <X size={20} className="text-white" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
