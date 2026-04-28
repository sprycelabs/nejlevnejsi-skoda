import { useParams, Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { motion } from 'framer-motion'
import {
  ArrowLeft, ShoppingCart, Phone, Mail, Fuel, Cog, Zap, Package,
  Truck, ShieldCheck, BadgePercent, Calendar, Palette, ChevronRight,
  Star, CheckCircle2, ArrowRight, Accessibility, Flame, Gift, Clock,
  AlertCircle, Scissors, Banknote
} from 'lucide-react'
import { cars, formatPrice } from '../../data/cars'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import SEO from '../../components/SEO'
import { Helmet } from 'react-helmet-async'

export default function VozDetail() {
  const { slug } = useParams()
  const { addToCart } = useCart()
  const car = cars.find(c => c.slug === slug)
  const related = cars.filter(c => c.slug !== slug).slice(0, 3)

  if (!car) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center flex-col gap-4 pt-24">
          <p className="text-2xl font-black text-gray-700">Vůz nenalezen</p>
          <Link to="/vozy" className="text-[#1e7e34] font-semibold hover:underline flex items-center gap-1">
            <ArrowLeft size={16} /> Zpět na vozy
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  const savings = car.originalPrice - car.salePrice

  const specs = [
    { label: 'Palivo', value: car.fuel },
    { label: 'Převodovka', value: car.transmission },
    { label: 'Spotřeba', value: car.consumption },
    { label: 'Výkon', value: car.power },
    { label: 'Rok výroby', value: String(car.year) },
    { label: 'Barva', value: car.color },
    { label: 'Pohon', value: car.variant.includes('4x4') ? '4×4' : 'FWD' },
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
    offers: {
      '@type': 'Offer',
      url: `${siteUrl}/vozy/${car.slug}`,
      priceCurrency: 'CZK',
      price: car.salePrice,
      availability: 'https://schema.org/InStock',
      seller: { '@type': 'Organization', name: 'Nejlevnější Škoda' },
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

        {/* CENOVÁ BOMBA banner — full width */}
        {car.isBomb && (
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
                {car.isBomb && (
                  <span className="flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-black px-3 py-1.5 rounded-full">
                    <Flame size={12} /> Cenová bomba
                  </span>
                )}
                {car.isNew && <span className="bg-[#0d6efd] text-white text-xs font-bold px-3 py-1.5 rounded-full">Novinka</span>}
                {car.isSale && <span className="bg-[#1e7e34] text-white text-xs font-bold px-3 py-1.5 rounded-full">Akce</span>}
                {car.freeDelivery && <span className="bg-[#fd7e14] text-white text-xs font-bold px-3 py-1.5 rounded-full">Doprava ZDARMA</span>}
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white mb-2">{car.name}</h1>
              <p className="text-gray-300 text-base sm:text-xl mb-2">{car.variant} · {car.power}</p>
              {car.internalId && (
                <p className="text-gray-600 text-xs font-mono mb-5 sm:mb-8">{car.internalId}</p>
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
                className="w-full max-w-sm lg:max-w-2xl lg:translate-y-6 pb-4 lg:pb-0"
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

            {/* CENOVÁ BOMBA — hlavní sekce */}
            {car.isBomb && (
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

                {/* Po 18 měsících — 2 možnosti */}
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
              </motion.div>
            )}

            {/* Specifikace */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden"
            >
              <div className="px-7 py-5 border-b border-gray-100">
                <h2 className="text-xl font-black text-gray-900">Technické parametry</h2>
              </div>
              <div className="divide-y divide-gray-50">
                {specs.map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between px-7 py-4 hover:bg-gray-50 transition-colors">
                    <span className="text-sm text-gray-500">{label}</span>
                    <span className="text-sm font-semibold text-gray-900">{value}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Popis */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-lg border border-gray-100 shadow-sm p-7"
            >
              <h2 className="text-xl font-black text-gray-900 mb-4">O tomto voze</h2>
              <div className="space-y-3 text-gray-600 leading-relaxed text-[15px]">
                <p>
                  <strong className="text-gray-900">{car.name} {car.variant}</strong> je dostupný přímo
                  ze skladů evropských dealerů za výrazně nižší ceny než u českých prodejců.
                  Vůz pochází z oficiální distribuční sítě Škoda Auto — tovární záruka platí stejně jako
                  při nákupu v ČR.
                </p>
                <p>
                  Motor {car.variant} s výkonem {car.power} nabízí výbornou rovnováhu výkonu a
                  spotřeby ({car.consumption}).
                  {car.transmission === 'Automat'
                    ? ' Automat zajišťuje pohodlné řízení ve městě i na dálnici.'
                    : ' Manuální převodovka zaručuje přímý kontakt s vozem a nižší náklady na servis.'}
                </p>
                <p>
                  Celý proces nákupu zajišťujeme za vás — od výběru až po předání klíčků v ČR.
                  Postaráme se o přepravu, přihlášení a veškerou administrativu.
                </p>
              </div>

              {/* Co je zahrnuto */}
              <div className="mt-7 pt-7 border-t border-gray-100">
                <h3 className="font-black text-gray-900 mb-4">Co je zahrnuto v ceně</h3>
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
              className="bg-gradient-to-br from-[#0d1f10] to-[#1a3d1e] rounded-lg p-7 text-white"
            >
              <h2 className="text-xl font-black mb-5">Proč koupit přes nás?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
                {[
                  { icon: BadgePercent, title: `Ušetříte ${car.discount} %`, sub: 'oproti ČR ceně' },
                  { icon: ShieldCheck, title: 'Plná záruka', sub: 'jako u CZ dealera' },
                  { icon: Star, title: 'Bez starostí', sub: 'Vše vyřídíme za vás' },
                ].map(({ icon: Icon, title, sub }) => (
                  <div key={title} className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-white/10 rounded-md flex items-center justify-center shrink-0">
                      <Icon size={18} className="text-[#28a745]" />
                    </div>
                    <div>
                      <div className="font-bold text-white">{title}</div>
                      <div className="text-gray-400 text-sm">{sub}</div>
                    </div>
                  </div>
                ))}
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
                  <div className="text-sm text-gray-400 line-through mb-0.5">{formatPrice(car.originalPrice)}</div>
                  <div className="text-4xl font-black text-[#1e7e34]">{formatPrice(car.salePrice)}</div>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-sm text-gray-500">vč. DPH</span>
                    <span className="text-sm font-semibold text-red-500">ušetříte {formatPrice(savings)}</span>
                  </div>
                  {car.freeDelivery && (
                    <div className="flex items-center gap-1.5 mt-3 text-xs text-[#1e7e34] font-medium">
                      <Truck size={13} /> Doprava do ČR zdarma
                    </div>
                  )}
                </div>

                <div className="p-5 space-y-3">
                  {/* stock */}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shrink-0" />
                    Skladem {car.inStock} {car.inStock === 1 ? 'kus' : car.inStock < 5 ? 'kusy' : 'kusů'}
                  </div>

                  <button
                    onClick={() => addToCart(car)}
                    className="w-full flex items-center justify-center gap-2 bg-[#1e7e34] hover:bg-[#28a745] text-white font-bold py-4 rounded-md transition-colors text-base"
                  >
                    <ShoppingCart size={18} />
                    Přidat do košíku
                  </button>

                  <a
                    href="tel:+420733455966"
                    className="flex items-center justify-center gap-2 w-full border-2 border-[#1e7e34] text-[#1e7e34] hover:bg-[#1e7e34] hover:text-white font-semibold py-3 rounded-md transition-all text-sm"
                  >
                    <Phone size={15} /> Zavolat: +420 733 455 966
                  </a>

                  <a
                    href="mailto:info@nejlevnejsi-skoda.cz"
                    className="flex items-center justify-center gap-2 w-full border border-gray-200 text-gray-600 hover:border-[#1e7e34] hover:text-[#1e7e34] font-medium py-3 rounded-md transition-all text-sm"
                  >
                    <Mail size={15} /> Napsat e-mail
                  </a>
                </div>
              </motion.div>

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

              {/* Quick info */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.35 }}
                className="bg-white rounded-lg border border-gray-100 shadow-sm p-5"
              >
                <h3 className="font-bold text-gray-900 text-sm mb-4">Rychlý přehled</h3>
                <div className="space-y-3">
                  {[
                    { icon: Fuel, label: 'Palivo', value: car.fuel },
                    { icon: Cog, label: 'Převodovka', value: car.transmission },
                    { icon: Zap, label: 'Spotřeba', value: car.consumption },
                    { icon: Package, label: 'Výkon', value: car.power },
                    { icon: Calendar, label: 'Rok', value: String(car.year) },
                    { icon: Palette, label: 'Barva', value: car.color },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-gray-500">
                        <Icon size={13} className="text-gray-400" />{label}
                      </span>
                      <span className="font-medium text-gray-800">{value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* ── Podobné vozy ── */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-gray-900">Podobné vozy</h2>
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
    </div>
  )
}
