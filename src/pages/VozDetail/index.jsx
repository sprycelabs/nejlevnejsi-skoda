import { useParams, Link, Navigate, useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, ShoppingCart, Phone, Mail, Fuel, Cog, Zap, Package,
  Truck, ShieldCheck, BadgePercent, Calendar, Palette, ChevronRight,
  Star, CheckCircle2, ArrowRight, Accessibility, Flame, Gift, Clock,
  AlertCircle, Scissors, Banknote, ChevronLeft, Maximize2, X, Tag, Sparkles, Eye, Bell
} from 'lucide-react'
import { cars, formatPrice } from '../../data/cars'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import SEO from '../../components/SEO'
import { Helmet } from 'react-helmet-async'

export default function VozDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const car = cars.find(c => c.slug === slug)
  const related = cars.filter(c => c.slug !== slug).slice(0, 3)

  if (!car) {
    return <Navigate to="/vozy" replace />
  }

  const savings = car.originalPrice - car.salePrice
  const images = car.imageCount > 1
    ? Array.from({ length: car.imageCount }, (_, i) => `/cars/${car.slug}/${String(i + 1).padStart(2, '0')}.webp`)
    : [car.image]
  const [activeIdx, setActiveIdx] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('prehled')
  const [failedImages, setFailedImages] = useState(new Set())
  const [watchEmail, setWatchEmail] = useState('')
  const [watchSent, setWatchSent] = useState(false)
  const viewCount = 8 + ((car.id * 13 + 7) % 19)
  const liveCount = 1 + (car.id % 3)
  const handleImgError = (idx) => setFailedImages(prev => new Set(prev).add(idx))

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
    { label: 'Spotřeba', value: car.consumption },
    { label: 'Výkon', value: car.power },
    { label: 'Barva', value: car.color },
    { label: 'Stav', value: 'Nové' },
  ]

  const carTitle = `${car.name} ${car.variant}`
  const siteUrl  = 'https://nejlevnejsi-skoda.cz'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: carTitle,
    description: `Nový ${carTitle} dovezený z EU. Ušetřete ${car.discount} % oproti české ceně. Tovární záruka zachována, dovoz do ČR zajištěn.`,
    brand: { '@type': 'Brand', name: 'Škoda' },
    image: `${siteUrl}${car.image}`,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '127',
      bestRating: '5',
      worstRating: '1',
    },
    review: {
      '@type': 'Review',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: '5',
        bestRating: '5',
      },
      author: { '@type': 'Person', name: 'Martin K.' },
      reviewBody: 'Bezproblémový dovoz, ušetřil jsem přes 150 000 Kč oproti české ceně. Komunikace skvělá, vůz doručen včas.',
    },
    offers: {
      '@type': 'Offer',
      url: `${siteUrl}/vozy/${car.slug}`,
      priceCurrency: 'CZK',
      price: car.salePrice,
      availability: 'https://schema.org/InStock',
      seller: { '@type': 'Organization', name: 'Glenford Corp s.r.o.' },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: '0',
          currency: 'CZK',
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'CZ',
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 7,
            maxValue: 30,
            unitCode: 'DAY',
          },
        },
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'CZ',
        returnPolicyCategory: 'https://schema.org/MerchantReturnNotPermitted',
      },
    },
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title={`${carTitle} z EU | Ušetřete ${car.discount} %`}
        description={`Kupte ${carTitle} z EU za ${formatPrice(car.salePrice)}. Ušetříte ${formatPrice(savings)} oproti české ceně. Tovární záruka, dovoz do ČR, bez starostí.`}
        canonical={`/vozy/${car.slug}`}
        image={`${siteUrl}${car.image}`}
        type="product"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative bg-[#0d1f10] overflow-hidden pt-24">
        {/* bg glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d1f10] via-[#1a3d1e] to-[#0a1508]" />
        <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-[#1e7e34]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />

        {/* PRODÁNO banner */}
        {car.isSold && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="relative z-10 w-full flex items-center justify-center gap-3 bg-gray-900 text-white text-sm font-black tracking-widest uppercase py-2.5"
          >
            Tento vůz byl prodán
          </motion.div>
        )}

        {/* REZERVOVÁNO banner */}
        {!car.isSold && car.isReserved && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="relative z-10 w-full flex items-center justify-center gap-3 bg-gray-700 text-white text-sm font-black tracking-widest uppercase py-2.5"
          >
            Tento vůz je rezervován
          </motion.div>
        )}

        {/* CENOVÁ BOMBA banner — full width */}
        {!car.isReserved && car.isBomb && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="relative z-10 w-full flex items-center justify-center gap-3 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-black tracking-widest uppercase py-2.5"
          >
            <Flame size={15} />
            Cenová bomba — Limitovaná akce
            <Flame size={15} />
          </motion.div>
        )}

        {/* TOP VÝBAVA banner */}
        {!car.isReserved && !car.isBomb && car.topVybava && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="relative z-10 w-full flex items-center justify-center gap-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white text-sm font-black tracking-widest uppercase py-2.5"
          >
            <Star size={14} className="text-yellow-300 fill-yellow-300" />
            TOP výbava — prémiová konfigurace
            <Star size={14} className="text-yellow-300 fill-yellow-300" />
          </motion.div>
        )}

        {/* DODÁNÍ banner */}
        {car.deliveryNote && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="relative z-10 w-full flex items-center justify-center gap-3 bg-[#0d6efd] text-white text-sm font-black tracking-wide uppercase py-2.5"
          >
            <Clock size={14} />
            {car.deliveryNote}
          </motion.div>
        )}

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          {/* breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-400 pt-6 pb-4">
            <Link to="/" className="hover:text-white transition-colors">Domů</Link>
            <ChevronRight size={13} />
            <Link to="/vozy" className="hover:text-white transition-colors">Vozy</Link>
            <ChevronRight size={13} />
            <span className="text-gray-200">{car.name} {car.variant}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 items-end pb-0 pt-4">
            {/* left — text */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="pb-4 lg:pb-12"
            >
              {/* badges */}
              <div className="flex flex-wrap gap-2 mb-5">
                {car.isSold && (
                  <span className="flex items-center gap-1.5 bg-gray-900 text-white text-xs font-black px-3 py-1.5 rounded-full">
                    Prodáno
                  </span>
                )}
                {!car.isSold && car.isReserved && (
                  <span className="flex items-center gap-1.5 bg-gray-600 text-white text-xs font-black px-3 py-1.5 rounded-full">
                    Rezervováno
                  </span>
                )}
                {!car.isReserved && car.isBomb && (
                  <span className="flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-black px-3 py-1.5 rounded-full">
                    <Flame size={12} /> Cenová bomba
                  </span>
                )}
                {!car.isReserved && !car.isBomb && car.topVybava && (
                  <span className="flex items-center gap-1.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white text-xs font-black px-3 py-1.5 rounded-full">
                    <Star size={11} className="fill-yellow-300 text-yellow-300" /> TOP výbava
                  </span>
                )}
                {car.deliveryNote && (
                  <span className="flex items-center gap-1.5 bg-[#0d6efd] text-white text-xs font-black px-3 py-1.5 rounded-full">
                    <Clock size={11} /> {car.deliveryNote}
                  </span>
                )}
                {car.type === 'config' && <span className="bg-[#0d6efd]/80 text-white text-xs font-bold px-3 py-1.5 rounded-full">Novinka</span>}
                {car.freeDelivery && <span className="bg-[#fd7e14] text-white text-xs font-bold px-3 py-1.5 rounded-full">Doprava ZDARMA</span>}
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white mb-2">{car.name}</h1>
              <p className="text-gray-300 text-base sm:text-xl mb-2">{car.variant} · {car.power}</p>
              {car.internalId && (
                <p className="text-gray-600 text-xs font-mono mb-3">{car.internalId}</p>
              )}

              {/* color variants switcher */}
              {car.colorVariants && car.colorVariants.length > 1 && (
                <div className="mb-5 sm:mb-8">
                  <p className="text-gray-400 text-xs uppercase tracking-widest font-semibold mb-3">Dostupné barvy</p>
                  <div className="flex items-center gap-3">
                    {car.colorVariants.map(v => (
                      <button
                        key={v.slug}
                        onClick={() => navigate(`/vozy/${v.slug}`)}
                        title={v.color}
                        className={`w-9 h-9 rounded-full flex-shrink-0 transition-all ring-offset-2 ring-offset-[#0d1f10] ${
                          v.slug === car.slug
                            ? 'ring-2 ring-white scale-110'
                            : 'ring-1 ring-white/30 hover:ring-white/60 hover:scale-105'
                        }`}
                        style={{ backgroundColor: v.hex }}
                      />
                    ))}
                    <span className="text-gray-300 text-sm ml-1">{car.color}</span>
                  </div>
                </div>
              )}

              {/* available colors (informational, no navigation) */}
              {car.availableColors && car.availableColors.length > 0 && (
                <div className="mb-5 sm:mb-8">
                  <p className="text-gray-400 text-xs uppercase tracking-widest font-semibold mb-3">Dostupné barvy</p>
                  <div className="flex flex-wrap items-center gap-2">
                    {car.availableColors.map(v => (
                      <div key={v.color} className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5">
                        <span
                          className="w-4 h-4 rounded-full flex-shrink-0 ring-1 ring-white/20"
                          style={{ backgroundColor: v.hex }}
                        />
                        <span className="text-gray-300 text-xs">{v.color}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* quick specs row */}
              <div className="flex flex-wrap gap-6 mb-8">
                {[
                  { icon: Fuel, v: car.fuel },
                  { icon: Cog, v: car.transmission },
                  { icon: Zap, v: car.consumption },
                ].map(({ icon: Icon, v }) => (
                  <div key={v} className="flex items-center gap-2 text-gray-300 text-sm">
                    <Icon size={15} className="text-[#28a745]" />
                    {v}
                  </div>
                ))}
              </div>

              {/* price */}
              <div className="inline-flex flex-col">
                <span className="text-gray-400 text-sm line-through">{formatPrice(car.originalPrice)}</span>
                <span className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#28a745] to-[#86efac]">
                  {formatPrice(car.salePrice)}
                </span>
                <span className="text-gray-400 text-sm mt-1">
                  vč. DPH · <span className="text-red-400 font-semibold">ušetříte {formatPrice(savings)}</span>
                </span>
              </div>

            </motion.div>

            {/* right — car image */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="flex items-end justify-center relative"
            >
              <img
                src={car.image}
                alt={`${car.name} ${car.variant}`}
                className="w-full max-w-xs sm:max-w-sm lg:max-w-2xl scale-125 lg:scale-125 lg:translate-y-6 pb-4 lg:pb-0"
                style={{ filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.7))' }}
              />
              {/* discount badge */}
              <div className="absolute top-4 right-0 w-16 h-16 bg-red-500 rounded-full flex flex-col items-center justify-center shadow-xl">
                <span className="text-white text-xs font-black leading-none">-{car.discount}%</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* wave */}
        <div className="relative z-10">
          <svg viewBox="0 0 1440 60" fill="none" className="w-full block">
            <path d="M0 60L1440 60L1440 30C1200 60 960 0 720 30C480 60 240 0 0 30L0 60Z" fill="#f9fafb" />
          </svg>
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

          {/* ── LEFT column (2/3) ── */}
          <div className="lg:col-span-2 space-y-8">

            {/* ── GALERIE ── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden"
            >
              {/* Hlavní foto */}
              <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden" style={{ aspectRatio: '16/10' }}>
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeIdx}
                    src={failedImages.has(activeIdx) ? car.image : images[activeIdx]}
                    alt={`${car.name} – foto ${activeIdx + 1}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`w-full h-full object-contain p-6 ${car.inStock === 0 ? 'grayscale' : ''}`}
                    onError={() => handleImgError(activeIdx)}
                  />
                </AnimatePresence>
                {failedImages.has(activeIdx) && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs text-center py-1.5 px-3 backdrop-blur-sm">
                    Ilustrační foto — pracujeme na tom
                  </div>
                )}

                {/* Šipka vlevo */}
                <button
                  onClick={prev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-md flex items-center justify-center transition-all hover:scale-105"
                >
                  <ChevronLeft size={20} className="text-gray-700" />
                </button>

                {/* Šipka vpravo */}
                <button
                  onClick={next}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-md flex items-center justify-center transition-all hover:scale-105"
                >
                  <ChevronRight size={20} className="text-gray-700" />
                </button>

                {/* Fullscreen */}
                <button
                  onClick={() => setLightboxOpen(true)}
                  className="absolute top-3 right-3 w-9 h-9 bg-white/90 hover:bg-white rounded-md shadow-md flex items-center justify-center transition-all"
                >
                  <Maximize2 size={16} className="text-gray-700" />
                </button>

                {/* Počítadlo */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  {activeIdx + 1} / {images.length}
                </div>
              </div>

              {/* Thumbnaily */}
              <div className="flex gap-2 p-3 overflow-x-auto scrollbar-hide border-t border-gray-100">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIdx(i)}
                    className={`shrink-0 w-20 h-14 rounded-md overflow-hidden border-2 transition-all ${
                      i === activeIdx
                        ? 'border-[#1e7e34] shadow-md'
                        : 'border-gray-200 hover:border-gray-400 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={failedImages.has(i) ? car.image : img}
                      alt={`náhled ${i + 1}`}
                      className={`w-full h-full object-contain bg-gray-50 p-1 ${car.inStock === 0 ? 'grayscale' : ''}`}
                      onError={() => handleImgError(i)}
                    />
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Trust bar */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4"
            >
              {[
                { icon: ShieldCheck, title: 'Záruka v ceně', sub: '3 roky / 150 000 km' },
                { icon: Truck, title: 'Dovoz do ČR', sub: car.freeDelivery ? 'Zdarma' : 'Na dotaz' },
                { icon: BadgePercent, title: 'Ušetříte', sub: formatPrice(savings) },
              ].map(({ icon: Icon, title, sub }) => (
                <div key={title} className="bg-white rounded-lg border border-gray-100 shadow-sm p-4 sm:p-5 flex items-center gap-3 sm:gap-4">
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

            {/* Škoda partner pruh */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.25 }}
              className="bg-white rounded-lg border border-gray-100 shadow-sm px-5 py-3 flex items-center gap-4"
            >
              <span className="text-xs text-gray-400">Spolupracujeme s autorizovanými partnery</span>
              <img src="/logo/skoda.webp" alt="Škoda Auto" className="h-9 w-auto" />
            </motion.div>

            {/* CENOVÁ BOMBA — hlavní sekce (jen pro auta s bombTagline) */}
            {car.isBomb && car.bombTagline && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.25 }}
                className="rounded-xl overflow-hidden border-2 border-orange-400 shadow-lg"
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-5 flex items-center gap-4">
                  <div className="w-11 h-11 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
                    <Flame size={22} className="text-white" />
                  </div>
                  <div>
                    <div className="text-white font-black text-lg leading-tight">{car.bombTagline}</div>
                    <div className="text-orange-100 text-sm mt-0.5">Cenová bomba — limitovaná nabídka</div>
                  </div>
                </div>

                {/* Popis konceptu */}
                <div className="bg-orange-50 px-6 py-5 border-b border-orange-100">
                  <p className="text-sm text-orange-900 leading-relaxed">{car.bombNote}</p>
                </div>

                {/* Jak to funguje — 3 kroky */}
                <div className="bg-white px-6 py-5 border-b border-gray-100">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Jak to funguje</p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    {[
                      { step: '1', title: 'Koupíte auto', desc: 'Za výjimečnou cenu s reklamním polepem naší značky.' },
                      { step: '2', title: '18 měsíců jedete', desc: 'S polepem, najedete min. 20 000 km — jako každé jiné auto.' },
                      { step: '3', title: 'Vy rozhodujete', desc: 'Polep sundáme zdarma, nebo ho necháte a dostáváte paušál.' },
                    ].map(({ step, title, desc }) => (
                      <div key={step} className="flex-1 flex items-start gap-3">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white text-xs font-black shrink-0 mt-0.5">
                          {step}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 text-sm">{title}</div>
                          <div className="text-xs text-gray-500 mt-0.5 leading-relaxed">{desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Podmínky */}
                {car.bombConditions?.length > 0 && (
                <div className="bg-white px-6 py-5 border-b border-gray-100">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Podmínky nabídky</p>
                  <div className="space-y-2.5">
                    {car.bombConditions.map(cond => (
                      <div key={cond} className="flex items-start gap-3">
                        <div className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                          <AlertCircle size={11} className="text-orange-500" />
                        </div>
                        <span className="text-sm text-gray-700">{cond}</span>
                      </div>
                    ))}
                  </div>
                </div>
                )}

                {/* Po 18 měsících — 2 možnosti */}
                {car.bombAfterOptions?.length > 0 && (
                <div className="bg-white px-6 py-5">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Po uplynutí 18 měsíců si vyberete</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {car.bombAfterOptions.map(({ title, desc }, i) => (
                      <div key={title} className={`rounded-lg border-2 p-4 ${i === 0 ? 'border-gray-200 bg-gray-50' : 'border-orange-200 bg-orange-50'}`}>
                        <div className="flex items-center gap-2 mb-2">
                          {i === 0
                            ? <Scissors size={15} className="text-gray-500 shrink-0" />
                            : <Banknote size={15} className="text-orange-500 shrink-0" />
                          }
                          <span className={`font-black text-sm ${i === 0 ? 'text-gray-800' : 'text-orange-700'}`}>{title}</span>
                        </div>
                        <p className={`text-xs leading-relaxed ${i === 0 ? 'text-gray-500' : 'text-orange-700'}`}>{desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
                )}
              </motion.div>
            )}

            {/* Tabs: Přehled / Výbava / Technická specifikace */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden"
            >
              {/* Tab hlavičky */}
              <div className="flex border-b border-gray-100 overflow-x-auto scrollbar-hide">
                {[
                  { key: 'prehled', label: 'Přehled' },
                  { key: 'vybava', label: 'Výbava' },
                  { key: 'technika', label: 'Technická specifikace' },
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-6 py-4 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
                      activeTab === tab.key
                        ? 'border-[#1e7e34] text-[#1e7e34]'
                        : 'border-transparent text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab obsah */}
              <AnimatePresence mode="wait">
                {activeTab === 'prehled' && (
                  <motion.div
                    key="prehled"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="divide-y divide-gray-50"
                  >
                    {specs.map(({ label, value }) => (
                      <div key={label} className="flex items-center justify-between px-7 py-4 hover:bg-gray-50 transition-colors">
                        <span className="text-sm text-gray-500">{label}</span>
                        <span className="text-sm font-semibold text-gray-900">{value}</span>
                      </div>
                    ))}
                  </motion.div>
                )}

                {activeTab === 'vybava' && (
                  <motion.div
                    key="vybava"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="divide-y divide-gray-100"
                  >
                    {car.equipment
                      ? Object.entries(car.equipment).map(([category, items]) => (
                          <div key={category} className="px-7 py-5">
                            <h3 className="font-bold text-gray-900 mb-4">{category}</h3>
                            {/* Vnořené podkategorie (config vozy) */}
                            {!Array.isArray(items) ? (
                              <div className="space-y-5">
                                {Object.entries(items).map(([sub, subItems]) => (
                                  <div key={sub}>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{sub}</p>
                                    <ul className="space-y-1.5">
                                      {subItems.map(item => (
                                        <li key={item} className="flex items-center gap-2 text-sm text-gray-700">
                                          <CheckCircle2 size={14} className="text-[#1e7e34] shrink-0" />
                                          {item}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                ))}
                              </div>
                            ) : items.length > 0 ? (
                              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6">
                                {items.map(item => (
                                  <li key={item} className="flex items-center gap-2 text-sm text-gray-700">
                                    <CheckCircle2 size={14} className="text-[#1e7e34] shrink-0" />
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-sm text-gray-400 italic">Brzy doplníme</p>
                            )}
                          </div>
                        ))
                      : <p className="px-7 py-6 text-sm text-gray-400">Výbava bude brzy doplněna.</p>
                    }
                  </motion.div>
                )}

                {activeTab === 'technika' && (
                  <motion.div
                    key="technika"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="divide-y divide-gray-100"
                  >
                    {car.technicalSpecs
                      ? Object.entries(car.technicalSpecs).map(([group, rows]) => (
                          <div key={group} className="px-7 py-5">
                            <h3 className="font-bold text-gray-900 mb-3">{group}</h3>
                            <div className="divide-y divide-gray-50">
                              {rows.map(({ label, value }) => (
                                <div key={label} className="flex items-center justify-between py-2.5 hover:bg-gray-50 -mx-2 px-2 rounded transition-colors">
                                  <span className="text-sm text-gray-500">{label}</span>
                                  <span className="text-sm font-semibold text-gray-900 text-right ml-4">{value}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))
                      : <p className="px-7 py-6 text-sm text-gray-400">Technická specifikace bude brzy doplněna.</p>
                    }
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Popis */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-lg border border-gray-100 shadow-sm p-7"
            >
              <h2 className="text-xl font-black text-gray-900 mb-4">{car.name} z EU — co o voze vědět</h2>
              <div className="space-y-3 text-gray-600 leading-relaxed text-[15px]">
                {car.highlight ? (
                  <p><strong className="text-gray-900">{car.highlight}</strong></p>
                ) : (
                  <p>
                    <strong className="text-gray-900">{car.name} {car.variant} levněji než u dealera</strong> —
                    vůz pochází přímo z evropské distribuční sítě Škoda Auto. Tovární záruka platí stejně
                    jako při nákupu v ČR a servis zajistíte u jakéhokoli autorizovaného servisu v celé EU.
                  </p>
                )}
                <p>
                  Motor {car.variant} s výkonem {car.power} nabízí výbornou rovnováhu výkonu a
                  spotřeby ({car.consumption}).
                  {car.transmission === 'Automat'
                    ? ' Automatická převodovka zajišťuje pohodlné řízení ve městě i na dálnici.'
                    : ' Manuální převodovka zaručuje přímý kontakt s vozem a nižší náklady na servis.'}
                </p>
                <p>
                  Koupit {car.name} levněji nebylo nikdy jednodušší — celý nákup v zahraničí
                  zajišťujeme za vás. Od výběru vozu až po předání klíčků v ČR, včetně přepravy
                  a přihlášení vozidla.
                </p>
              </div>

              {/* Co je zahrnuto */}
              <div className="mt-7 pt-7 border-t border-gray-100">
                <h3 className="font-black text-gray-900 mb-4">Co je zahrnuto v ceně — žádné skryté příplatky</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  {[
                    'Prodloužená záruka 3 roky / 150 000 km',
                    'Technická přejímka v ČR',
                    'Registrace vozu v ČR',
                    'Předávací protokol',
                    car.freeDelivery ? 'Přeprava do ČR zdarma' : 'Přeprava do ČR (na dotaz)',
                    'Kompletní dokumentace',
                  ].map(item => (
                    <div key={item} className="flex items-center gap-2.5 text-sm text-gray-700">
                      <CheckCircle2 size={16} className="text-[#1e7e34] shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Proč koupit */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-[#0d1f10] to-[#1a3d1e] rounded-xl p-7 sm:p-10 text-white"
            >
              <p className="text-[#86efac] font-semibold text-sm uppercase tracking-wider mb-2">Proč nakoupit přes nás</p>
              <h2 className="text-2xl sm:text-3xl font-black mb-2">Proč koupit {car.name} z EU přes nás?</h2>
              <p className="text-gray-400 text-sm mb-8">Zajistíme vám nejlepší cenu na trhu, vše vyřídíme za vás — od výběru až po předání klíčků.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {[
                  { icon: BadgePercent, title: `Ušetříte ${formatPrice(savings)}`, sub: `Oproti české ceně ${formatPrice(car.originalPrice)} — to je ${car.discount} % rozdíl.` },
                  { icon: ShieldCheck, title: 'Tovární záruka beze změny', sub: 'Platí stejně jako při nákupu v ČR. Servis u každého autorizovaného Škoda servisu.' },
                  { icon: Truck, title: 'Dovoz a registrace zdarma', sub: 'Přeprava do ČR, přihlášení vozidla a předávací protokol — vše v ceně.' },
                  { icon: Star, title: 'Nákup na klíč', sub: 'Vy si vyberete, my zařídíme zbytek. Bez jazykové bariéry, bez stresu.' },
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
              {/* Garance */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { icon: ShieldCheck, text: 'Vrácení zálohy při zrušení' },
                  { icon: CheckCircle2, text: 'Žádné skryté poplatky — smluvně garantováno' },
                  { icon: ShieldCheck, text: 'Stejná tovární záruka jako v ČR' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-md px-4 py-3">
                    <Icon size={15} className="text-[#28a745] shrink-0" />
                    <span className="text-gray-300 text-xs leading-snug">{text}</span>
                  </div>
                ))}
              </div>

              <div className="mt-5 pt-5 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <p className="text-gray-400 text-sm">Máte otázky? Zavolejte nám — rádi poradíme.</p>
                <a
                  href="tel:+420733455966"
                  className="flex items-center gap-2 bg-[#1e7e34] hover:bg-[#28a745] text-white font-bold px-6 py-3 rounded-md transition-colors text-sm whitespace-nowrap"
                >
                  <Phone size={15} /> +420 733 455 966
                </a>
              </div>
            </motion.div>
          </div>

          {/* ── RIGHT sidebar ── */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">

              {/* Price card */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.25 }}
                className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden"
              >
                <div className="bg-[#f0faf2] px-6 py-5 border-b border-green-100">
                  {/* Vizuální porovnání cen */}
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">Cena v ČR</div>
                      <div className="text-lg font-bold text-gray-400 line-through">{formatPrice(car.originalPrice)}</div>
                    </div>
                    <div className="text-gray-300 text-2xl font-light">→</div>
                    <div className="text-right">
                      <div className="text-xs text-[#1e7e34] uppercase tracking-wider font-bold mb-0.5">Naše cena</div>
                      <div className="text-3xl font-black text-[#1e7e34]">{formatPrice(car.salePrice)}</div>
                    </div>
                  </div>
                  <div className="bg-red-50 border border-red-100 rounded-md px-3 py-2 flex items-center justify-between">
                    <span className="text-sm text-red-600 font-semibold">Ušetříte</span>
                    <span className="text-base font-black text-red-600">{formatPrice(savings)}</span>
                  </div>
                  <div className="text-xs text-gray-400 mt-2">vč. DPH</div>
                  {car.freeDelivery && (
                    <div className="flex items-center gap-1.5 mt-2 text-xs text-[#1e7e34] font-medium">
                      <Truck size={13} /> Doprava do ČR zdarma
                    </div>
                  )}
                </div>

                <div className="p-5 space-y-3">
                  {/* stock — urgency */}
                  <div className={`flex items-center gap-2 text-sm font-semibold px-3 py-2 rounded-md ${car.inStock <= 3 ? 'bg-orange-50 text-orange-700' : 'text-gray-600'}`}>
                    <div className={`w-2 h-2 rounded-full shrink-0 animate-pulse ${car.inStock <= 3 ? 'bg-orange-500' : 'bg-green-500'}`} />
                    {car.inStock <= 3
                      ? `Poslední ${car.inStock} ${car.inStock === 1 ? 'kus' : 'kusy'} za tuto cenu!`
                      : `Skladem ${car.inStock} kusů`
                    }
                  </div>

                  <div className="rounded-md bg-red-50 border border-red-100 px-3 py-2 flex items-center gap-2.5">
                    <span className="relative flex h-2.5 w-2.5 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
                    </span>
                    <span className="text-xs text-red-700 font-semibold">
                      Právě prohlíží <strong>{liveCount} {liveCount === 1 ? 'člověk' : 'lidé'}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400 px-3">
                    <Eye size={13} className="text-gray-300" />
                    <span><strong className="text-gray-600">{viewCount} lidí</strong> si prohlédlo tento vůz dnes</span>
                  </div>

                  {car.inStock === 0 ? (
                    <div className="w-full flex items-center justify-center gap-2 bg-gray-200 text-gray-400 font-bold py-4 rounded-md text-base cursor-not-allowed">
                      <ShoppingCart size={18} />
                      Vyprodáno
                    </div>
                  ) : car.isReserved ? (
                    <div className="w-full flex items-center justify-center gap-2 bg-gray-200 text-gray-400 font-bold py-4 rounded-md text-base cursor-not-allowed">
                      <ShoppingCart size={18} />
                      Rezervováno
                    </div>
                  ) : (
                    <button
                      onClick={() => addToCart(car)}
                      className="w-full flex items-center justify-center gap-2 bg-[#1e7e34] hover:bg-[#28a745] text-white font-bold py-4 rounded-md transition-colors text-base"
                    >
                      <ShoppingCart size={18} />
                      Přidat do košíku
                    </button>
                  )}

                  <a
                    href="tel:+420733455966"
                    className="flex items-center justify-center gap-2 w-full border-2 border-[#1e7e34] text-[#1e7e34] hover:bg-[#1e7e34] hover:text-white font-semibold py-3 rounded-md transition-all text-sm"
                  >
                    <Phone size={15} /> Zavolat: +420 733 455 966
                  </a>

                </div>
              </motion.div>

              {/* HLÍDEJ CENU — jen pro rezervovaná auta */}
              {car.isReserved && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.28 }}
                  className="bg-amber-50 border border-amber-200 rounded-lg p-4"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-9 h-9 bg-amber-500 rounded-md flex items-center justify-center shrink-0">
                      <Bell size={17} className="text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-sm">Hlídej podobný vůz</div>
                      <div className="text-xs text-gray-500 mt-0.5 leading-relaxed">Tento vůz je rezervován. Napište nám email a dáme vám vědět, jakmile bude k dispozici podobný.</div>
                    </div>
                  </div>
                  {watchSent ? (
                    <div className="bg-amber-100 border border-amber-300 rounded-md px-3 py-2.5 text-xs font-semibold text-amber-800 text-center">
                      ✓ Zaregistrováno — ozveme se vám!
                    </div>
                  ) : (
                    <form
                      onSubmit={e => {
                        e.preventDefault()
                        if (!watchEmail) return
                        window.location.href = `mailto:info@nejlevnejsi-skoda.cz?subject=Hlídej%20vůz%3A%20${encodeURIComponent(car.name)}&body=Dobrý%20den%2C%20mám%20zájem%20o%20podobný%20vůz%20jako%20${encodeURIComponent(car.name + ' ' + car.variant)}.%20Prosím%20kontaktujte%20mě%20na%3A%20${encodeURIComponent(watchEmail)}`
                        setWatchSent(true)
                      }}
                      className="flex gap-2"
                    >
                      <input
                        type="email"
                        required
                        value={watchEmail}
                        onChange={e => setWatchEmail(e.target.value)}
                        placeholder="váš@email.cz"
                        className="flex-1 text-xs border border-amber-200 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                      />
                      <button
                        type="submit"
                        className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-3 py-2 rounded-md transition-colors shrink-0"
                      >
                        Hlídat
                      </button>
                    </form>
                  )}
                </motion.div>
              )}

              {/* ZTP sleva */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="bg-[#f0faf2] border border-green-200 rounded-lg p-4 flex items-start gap-3"
              >
                <div className="w-9 h-9 bg-[#1e7e34] rounded-md flex items-center justify-center shrink-0">
                  <Accessibility size={18} className="text-white" />
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-sm">Sleva pro držitele ZTP</div>
                  <div className="text-xs text-gray-500 mt-0.5 leading-relaxed">Jste držitelem průkazu ZTP? Kontaktujte nás pro individuální nabídku.</div>
                  <a href="/kontakt" className="inline-block mt-2 text-xs font-semibold text-[#1e7e34] hover:underline">Zjistit více →</a>
                </div>
              </motion.div>

              {/* BERU_SLEVU promo */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.32 }}
                className="bg-lime-50 border border-lime-300 rounded-lg p-4 flex items-start gap-3"
              >
                <div className="w-9 h-9 bg-lime-500 rounded-md flex items-center justify-center shrink-0">
                  <Tag size={18} className="text-white" />
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-sm">Aktuální akce — 10 000 Kč</div>
                  <div className="text-xs text-gray-500 mt-0.5 leading-relaxed">Použij promo kód při objednávce a ušetři dalších 10 000 Kč na jakýkoliv vůz.</div>
                  <div className="mt-2 inline-flex items-center gap-1.5 bg-lime-100 border border-lime-300 rounded px-2 py-1">
                    <span className="font-mono font-black text-lime-700 text-xs tracking-wider">BERU_SLEVU</span>
                  </div>
                </div>
              </motion.div>

              {/* Poznámka k dodání */}
              {car.deliveryNote && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.34 }}
                  className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3"
                >
                  <div className="w-9 h-9 bg-blue-500 rounded-md flex items-center justify-center shrink-0">
                    <Clock size={18} className="text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-sm">Informace o dodání</div>
                    <div className="text-xs text-gray-500 mt-0.5 leading-relaxed">{car.deliveryNote}</div>
                  </div>
                </motion.div>
              )}

              {/* CENOVÁ BOMBA — sidebar urgency */}
              {car.isBomb && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.35 }}
                  className="border-2 border-orange-400 rounded-lg overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 px-4 py-2.5 flex items-center gap-2">
                    <Flame size={14} className="text-white" />
                    <span className="text-white text-xs font-black uppercase tracking-wider">Cenová bomba</span>
                  </div>
                  <div className="bg-orange-50 p-4 space-y-3">
                    <div className="flex items-start gap-2.5">
                      <Clock size={15} className="text-orange-500 shrink-0 mt-0.5" />
                      <p className="text-xs text-orange-900 leading-relaxed font-medium">
                        Dostupné pouze <strong>do vyprodání {car.inStock} kusů</strong> na skladě.
                      </p>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <Flame size={15} className="text-orange-500 shrink-0 mt-0.5" />
                      <p className="text-xs text-orange-900 leading-relaxed font-medium">
                        Auto s reklamním polepem — <strong>ihned vaše</strong>, podmínky na 18 měsíců.
                      </p>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <Banknote size={15} className="text-orange-500 shrink-0 mt-0.5" />
                      <p className="text-xs text-orange-900 leading-relaxed font-medium">
                        Po 18 měsících možnost <strong>měsíčního paušálu</strong> za reklamu.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

            </div>
          </div>
        </div>

        {/* ── Podobné vozy ── */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-gray-900">Další vozy Škoda z EU</h2>
            <Link to="/vozy" className="text-[#1e7e34] font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all">
              Všechny vozy <ArrowRight size={15} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
            {related.map((relCar, i) => (
              <motion.div
                key={relCar.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden group"
              >
                <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 h-44 flex items-center justify-center overflow-hidden">
                  <img src={relCar.image} alt={relCar.name} className="h-full w-full object-contain p-4 group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute top-3 right-3 w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center shadow">
                    <span className="text-xs font-black">-{relCar.discount}%</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-black text-gray-900">{relCar.name}</h3>
                  <p className="text-gray-500 text-sm mb-3">{relCar.variant} · {relCar.power}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-gray-400 line-through">{formatPrice(relCar.originalPrice)}</div>
                      <div className="text-xl font-black text-[#1e7e34]">{formatPrice(relCar.salePrice)}</div>
                    </div>
                    <Link
                      to={`/vozy/${relCar.slug}`}
                      className="flex items-center gap-1 border border-gray-200 hover:border-[#1e7e34] hover:text-[#1e7e34] text-gray-600 text-sm font-medium py-2 px-4 rounded-md transition-colors"
                    >
                      Detail <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <Footer />

      {/* ── MOBILNÍ FIXNÍ CTA LIŠTA ── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-2xl px-4 py-3 flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <div className="text-xs text-gray-400 line-through leading-none">{formatPrice(car.originalPrice)}</div>
          <div className="text-xl font-black text-[#1e7e34] leading-tight">{formatPrice(car.salePrice)}</div>
          <div className="text-xs text-red-500 font-semibold">ušetříte {formatPrice(savings)}</div>
        </div>
        <a
          href="tel:+420733455966"
          className="flex items-center gap-1 border-2 border-[#1e7e34] text-[#1e7e34] font-bold px-3 py-2 rounded-md text-sm whitespace-nowrap"
        >
          <Phone size={14} /> Zavolat
        </a>
        {car.inStock === 0 ? (
          <span className="flex items-center gap-1 bg-gray-200 text-gray-400 font-bold px-3 py-2 rounded-md text-sm whitespace-nowrap cursor-not-allowed">
            <ShoppingCart size={14} /> Vyprodáno
          </span>
        ) : car.isReserved ? (
          <span className="flex items-center gap-1 bg-gray-200 text-gray-400 font-bold px-3 py-2 rounded-md text-sm whitespace-nowrap cursor-not-allowed">
            <ShoppingCart size={14} /> Rezervováno
          </span>
        ) : (
          <button
            onClick={() => addToCart(car)}
            className="flex items-center gap-1 bg-[#1e7e34] hover:bg-[#28a745] text-white font-bold px-3 py-2 rounded-md text-sm whitespace-nowrap transition-colors"
          >
            <ShoppingCart size={14} /> Do košíku
          </button>
        )}
      </div>

      {/* Spacer aby footer nebyl pod fixní lištou na mobilu */}
      <div className="lg:hidden h-20" />

      {/* ── LIGHTBOX ── */}
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
            {/* Hlavní foto */}
            <div className="relative w-full max-w-5xl px-16" onClick={e => e.stopPropagation()}>
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeIdx}
                  src={failedImages.has(activeIdx) ? car.image : images[activeIdx]}
                  alt={`${car.name} – foto ${activeIdx + 1}`}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.18 }}
                  className="w-full max-h-[75vh] object-contain"
                  onError={() => handleImgError(activeIdx)}
                />
              </AnimatePresence>

              <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/25 rounded-full flex items-center justify-center transition-colors">
                <ChevronLeft size={26} className="text-white" />
              </button>
              <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/25 rounded-full flex items-center justify-center transition-colors">
                <ChevronRight size={26} className="text-white" />
              </button>
            </div>

            {/* Počítadlo */}
            <div className="text-white/60 text-sm mt-4">{activeIdx + 1} / {images.length}</div>

            {/* Thumbnaily */}
            <div className="flex gap-2 mt-4 px-4 overflow-x-auto max-w-3xl" onClick={e => e.stopPropagation()}>
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIdx(i)}
                  className={`shrink-0 w-16 h-11 rounded border-2 overflow-hidden transition-all ${
                    i === activeIdx ? 'border-[#28a745]' : 'border-white/20 opacity-50 hover:opacity-80'
                  }`}
                >
                  <img src={failedImages.has(i) ? car.image : img} alt="" className="w-full h-full object-contain bg-black p-0.5" onError={() => handleImgError(i)} />
                </button>
              ))}
            </div>

            {/* Zavřít */}
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-5 right-5 w-10 h-10 bg-white/10 hover:bg-white/25 rounded-full flex items-center justify-center transition-colors"
            >
              <X size={20} className="text-white" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
