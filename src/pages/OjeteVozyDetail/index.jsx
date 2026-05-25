import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, Phone, Mail, ShieldCheck, Truck, CheckCircle2,
  ChevronRight, ChevronLeft, Maximize2, X, Gauge, Calendar,
  Users, Wrench, MapPin, Fuel, Cog, Clock, ShoppingCart,
  AlertTriangle, BadgePercent, Star, Info
} from 'lucide-react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import SEO from '../../components/SEO'

const PRICE = 249000
const STOCK = 5
const TOTAL_STOCK = 16

function czk(n) {
  return new Intl.NumberFormat('cs-CZ', { style: 'currency', currency: 'CZK', maximumFractionDigits: 0 }).format(n)
}

// fake car object for cart
const CAR_CART = {
  id: 'ojete-octavia-combi',
  slug: 'ojete-vozy/octavia-combi',
  name: 'Škoda Octavia Combi',
  variant: '1.0 TSI e-TEC DSG',
  power: '81 kW',
  fuel: 'Benzín',
  transmission: 'DSG automat',
  salePrice: PRICE,
  originalPrice: PRICE,
  image: '/ojete-hero.webp',
  inStock: STOCK,
  isUsed: true,
}

const IMAGES = [
  'octavia 2022 (1).webp',
  'octavia 2022 (1)_1.webp',
  'octavia 2022 (2).webp',
  'octavia 2022 (2)_1.webp',
  'octavia 2022 (3).webp',
  'octavia 2022 (3)_1.webp',
  'octavia 2022 (4).webp',
  'octavia 2022 (4)_1.webp',
  'octavia 2022 (5).webp',
  'octavia 2022 (5)_1.webp',
  'octavia 2022 (6).webp',
  'octavia 2022 (7).webp',
  'octavia 2022 (8).webp',
  'octavia 2022 (9).webp',
  'octavia 2022 (10).webp',
  'octavia 2022 (11).webp',
  'octavia 2022 (12).webp',
  'octavia 2022 (13).webp',
  'octavia 2022 (14).webp',
  'octavia 2022 (15).webp',
  'octavia 2022 (16).webp',
].map(f => `/cars/ojete-octavia/${encodeURIComponent(f)}`)

const SPECS = [
  { label: 'Palivo', value: 'Benzín' },
  { label: 'Převodovka', value: 'Automatická DSG, 7st' },
  { label: 'Výkon', value: '81 kW' },
  { label: 'Zdvihový objem', value: '999 cm³' },
  { label: 'Nájezd', value: '116 600 – 121 120 km' },
  { label: '1. registrace', value: '04/2022' },
  { label: 'Počet majitelů', value: '1' },
  { label: 'Emisní třída', value: 'Euro 6' },
  { label: 'Původ', value: 'Holandsko' },
  { label: 'Servisní historie', value: 'Úplná' },
  { label: 'Stav karoserie', value: 'Nehavarovaná' },
  { label: 'Kuřácký vůz', value: 'Ne' },
]

const EQUIPMENT = {
  'Exteriér': [
    'Automaticky zatmavitelné zpětné zrcátko',
    'Elektricky sklopná vnější zrcátka',
    'Vnější zrcátka elektricky nastavitelná a vyhřívaná',
    'Vnější zrcátka v barvě karoserie',
    'Chromované díly exteriéru',
    'Elektronické rozložení brzdné síly',
    'Ostřikovače světlometů',
    'LED zadní světla',
  ],
  'Infotainment': [
    'Multimedia, Android Auto, Apple Car – bezdrátové',
    'Navigační systém – kompletní mapa Evropy',
  ],
  'Interiér': [
    'Zadní sedadla sklopná 2/3',
    'Třízónová klimatizace',
    'Zadní loketní opěrka',
    'Přední loketní opěrka',
    'Výškové nastavení sedadla řidiče',
    'Elektrická přední i zadní okna',
    'Bezklíčové odemykání a startování',
    'Výškové nastavení sedadla spolujezdce',
    'Vyhřívaná přední sedadla',
  ],
  'Bezpečnost': [
    'Zadní airbag(y)',
    'Přední airbag(y)',
    'Boční airbag(y)',
    'Alarm',
    'Autonomní nouzové brzdění',
    'Detekce mrtvého úhlu s korekcí',
  ],
  'Ostatní': [
    'Propojené služby – nouzové volání',
    'DAB+',
    'Elektricky ovládané páté dveře se senzorovým ovládáním',
    'Extra tónované sklo vzadu',
    'LED mlhovky',
    'Nastavitelná bederní opora',
    'LCD panel',
    'Senzor jízdního pruhu s korekcí',
    'Výhřev ostřikovačů a stěračů předního skla',
  ],
}

const TECH_SPECS = {
  'Motor': [
    { label: 'Typ motoru', value: '1.0 TSI e-TEC (mild hybrid)' },
    { label: 'Zdvihový objem', value: '999 cm³' },
    { label: 'Výkon', value: '81 kW' },
    { label: 'Palivo', value: 'Benzín' },
    { label: 'Emisní třída', value: 'Euro 6' },
  ],
  'Převodovka a podvozek': [
    { label: 'Převodovka', value: 'Automatická DSG, 7 stupňů' },
    { label: 'Pohon', value: 'Přední náhon' },
  ],
  'Rozměry': [
    { label: 'Karoserie', value: 'Combi (kombi)' },
    { label: 'Počet dveří', value: '5' },
    { label: 'Počet sedadel', value: '5' },
  ],
  'Identifikace vozu': [
    { label: '1. registrace', value: '04/2022' },
    { label: 'Nájezd', value: '116 600 – 121 120 km' },
    { label: 'Počet majitelů', value: '1' },
    { label: 'Původ', value: 'Holandsko' },
    { label: 'Servisní historie', value: 'Úplná' },
  ],
}

const SERVIS = [
  'Nový motorový olej + filtr',
  'Olej a filtr v DSG převodovce',
  'Zapalovací svíčky',
  'Vzduchový + kabinový filtr',
  'Nové brzdové kotouče a destičky',
  'Stabilizační tyčky + silentbloky',
  'Kontrola tlumičů — vše v normě',
  'Kontrola a vyčištění EGR',
  'Klimatizace — kontrola + doplnění',
]

export default function OjeteVozyDetail() {
  const { addToCart } = useCart()
  const [activeIdx, setActiveIdx] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('prehled')

  const prev = useCallback(() => setActiveIdx(i => (i - 1 + IMAGES.length) % IMAGES.length), [])
  const next = useCallback(() => setActiveIdx(i => (i + 1) % IMAGES.length), [])

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

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title="Škoda Octavia Combi 1.0 TSI DSG 2022 | Ojeté vozy z aukce"
        description="Škoda Octavia Combi 2022, 1.0 TSI e-TEC DSG, ~120 000 km, 1 majitel. Kompletní servis hotový, dovoz a registrace v ČR v ceně. Cena 249 000 Kč vč. DPH."
        canonical="/ojete-vozy/octavia-combi"
        image="https://nejlevnejsi-skoda.cz/ojete-hero.webp"
        type="product"
      />
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative bg-[#0d1f10] overflow-hidden pt-24">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d1f10] via-[#1a3d1e] to-[#0a1508]" />
        <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-[#1e7e34]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          {/* breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-400 pt-6 pb-4 flex-wrap">
            <Link to="/" className="hover:text-white transition-colors">Domů</Link>
            <ChevronRight size={13} />
            <Link to="/ojete-vozy" className="hover:text-white transition-colors">Ojeté vozy</Link>
            <ChevronRight size={13} />
            <span className="text-gray-200">Škoda Octavia Combi 1.0 TSI e-TEC DSG</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 items-end pb-0 pt-4">
            {/* left */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="pb-4 lg:pb-12"
            >
              <div className="flex flex-wrap gap-2 mb-5">
                <span className="bg-gray-600 text-white text-xs font-bold px-3 py-1.5 rounded-full">Ojeté</span>
                <span className="bg-[#1e7e34] text-white text-xs font-bold px-3 py-1.5 rounded-full">Aukční série</span>
                <span className="bg-[#fd7e14] text-white text-xs font-bold px-3 py-1.5 rounded-full">Zbývá jen {STOCK} z {TOTAL_STOCK} kusů</span>
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white mb-2">
                Škoda Octavia Combi
              </h1>
              <p className="text-gray-300 text-base sm:text-xl mb-6">1.0 TSI e-TEC · 81 kW · DSG automat</p>

              <div className="flex flex-wrap gap-5 mb-8">
                {[
                  { icon: Gauge,    v: '~120 000 km' },
                  { icon: Calendar, v: '04/2022' },
                  { icon: Fuel,     v: 'Benzín / hybrid' },
                  { icon: Cog,      v: 'DSG automat' },
                ].map(({ icon: Icon, v }) => (
                  <div key={v} className="flex items-center gap-2 text-gray-300 text-sm">
                    <Icon size={15} className="text-[#28a745]" />
                    {v}
                  </div>
                ))}
              </div>

              <div className="inline-flex flex-col">
                <span className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#28a745] to-[#86efac]">
                  {czk(PRICE)}
                </span>
                <span className="text-gray-400 text-sm mt-1">vč. DPH · dovoz domů · přihlášení v ČR</span>
              </div>
            </motion.div>

            {/* right — foto */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="flex items-end justify-center"
            >
              <img
                src="/ojete-hero.webp"
                alt="Škoda Octavia Combi 2022"
                className="w-full max-w-xs sm:max-w-sm lg:max-w-2xl lg:translate-y-6 pb-4 lg:pb-0"
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
              <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden" style={{ aspectRatio: '16/10' }}>
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeIdx}
                    src={IMAGES[activeIdx]}
                    alt={`Škoda Octavia – foto ${activeIdx + 1}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>

                <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-md flex items-center justify-center transition-all hover:scale-105">
                  <ChevronLeft size={20} className="text-gray-700" />
                </button>
                <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-md flex items-center justify-center transition-all hover:scale-105">
                  <ChevronRight size={20} className="text-gray-700" />
                </button>
                <button onClick={() => setLightboxOpen(true)} className="absolute top-3 right-3 w-9 h-9 bg-white/90 hover:bg-white rounded-md shadow-md flex items-center justify-center">
                  <Maximize2 size={16} className="text-gray-700" />
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  {activeIdx + 1} / {IMAGES.length}
                </div>
              </div>

              <div className="flex gap-2 p-3 overflow-x-auto scrollbar-hide border-t border-gray-100">
                {IMAGES.map((img, i) => (
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
            </motion.div>

            {/* Trust bar */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-3"
            >
              {[
                { icon: ShieldCheck, title: 'Prověřená historie', sub: '1 majitel · plná servisní kniha' },
                { icon: Wrench,      title: 'Servis hotový',      sub: 'Kompletní údržba 120 000 km' },
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

            {/* Upozornění — princip nabídky */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="bg-amber-50 border border-amber-200 rounded-lg p-5 flex items-start gap-4"
            >
              <div className="w-10 h-10 bg-amber-100 rounded-md flex items-center justify-center shrink-0 mt-0.5">
                <Info size={20} className="text-amber-600" />
              </div>
              <div>
                <div className="font-black text-amber-900 text-sm mb-1">Důležité — princip této nabídky</div>
                <p className="text-sm text-amber-800 leading-relaxed">
                  Jedná se o výprodej aukční série {TOTAL_STOCK} identických vozů — zbývá posledních {STOCK} kusů.{' '}
                  <strong>Kupujete vůz z této série, nikoliv konkrétní VIN.</strong>{' '}
                  Všechny vozy mají obdobné parametry, historii a stav — díky tomu získáváte výrazně nižší cenu než na běžném trhu.
                </p>
              </div>
            </motion.div>

            {/* Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.25 }}
              className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden"
            >
              <div className="flex border-b border-gray-100 overflow-x-auto scrollbar-hide">
                {[
                  { key: 'prehled', label: 'Přehled' },
                  { key: 'vybava',  label: 'Výbava' },
                  { key: 'technika', label: 'Technická specifikace' },
                  { key: 'servis',  label: 'Provedený servis' },
                ].map(tab => (
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
                    {SPECS.map(({ label, value }) => (
                      <div key={label} className="flex items-center justify-between px-7 py-4 hover:bg-gray-50 transition-colors">
                        <span className="text-sm text-gray-500">{label}</span>
                        <span className="text-sm font-semibold text-gray-900">{value}</span>
                      </div>
                    ))}
                  </motion.div>
                )}

                {activeTab === 'vybava' && (
                  <motion.div key="vybava" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="divide-y divide-gray-100">
                    {Object.entries(EQUIPMENT).map(([category, items]) => (
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

                {activeTab === 'technika' && (
                  <motion.div key="technika" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="divide-y divide-gray-100">
                    {Object.entries(TECH_SPECS).map(([group, rows]) => (
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
                    ))}
                  </motion.div>
                )}

                {activeTab === 'servis' && (
                  <motion.div key="servis" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="px-7 py-6">
                    <p className="text-sm text-gray-500 mb-5">Každé vozidlo prošlo kompletní údržbou před prodejem při 120 000 km. Kupujete auto připravené k okamžitému provozu bez dalších nákladů.</p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6">
                      {SERVIS.map(item => (
                        <li key={item} className="flex items-center gap-2.5 text-sm text-gray-700">
                          <CheckCircle2 size={15} className="text-[#1e7e34] shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
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
              <h2 className="text-xl font-black text-gray-900 mb-4">Škoda Octavia Combi 2022 — co o voze vědět</h2>
              <div className="space-y-3 text-gray-600 leading-relaxed text-[15px]">
                <p>
                  <strong className="text-gray-900">Limitovaná aukční nabídka – zbývá jen {STOCK} z {TOTAL_STOCK} vozů.</strong>{' '}
                  Nabízíme výjimečnou příležitost nákupu zcela prověřených vozů Škoda Octavia Combi ve zvýhodněném režimu hromadného výprodeje z aukce.
                </p>
                <p>
                  Motor 1.0 TSI e-TEC s mild hybridní technologií nabízí výbornou spotřebu při zachování svižné jízdy. DSG automat zajišťuje pohodlné řízení ve městě i na dálnici.
                </p>
                <p>
                  Před prodejem každý vůz prošel kompletní údržbou při 120 000 km — olej, filtry, brzdy, svíčky i DSG převodovka. Letní pneumatiky s min. 4 mm dezénu. Nekupujete auto a pak řešíte servis. Koupíte a jedete.
                </p>
              </div>

              <div className="mt-7 pt-7 border-t border-gray-100">
                <h3 className="font-black text-gray-900 mb-4">Co je zahrnuto v ceně — žádné skryté příplatky</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  {[
                    'Kompletní servis 120 000 km',
                    'Přeprava do ČR',
                    'Registrace vozu v ČR',
                    'Předávací protokol',
                    'Dovoz až k vám domů',
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

            {/* Proč u nás */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-[#0d1f10] to-[#1a3d1e] rounded-xl p-7 sm:p-10 text-white"
            >
              <p className="text-[#86efac] font-semibold text-sm uppercase tracking-wider mb-2">Proč nakoupit přes nás</p>
              <h2 className="text-2xl sm:text-3xl font-black mb-2">Proč koupit tuto Octavii u nás?</h2>
              <p className="text-gray-400 text-sm mb-8">Transparentní původ, servis hotový předem, kompletní vyřízení na klíč.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {[
                  { icon: ShieldCheck,  title: 'Transparentní původ',  sub: 'Holandský leasing, plná servisní historia, žádná překvapení.' },
                  { icon: Wrench,       title: 'Servis hotový předem', sub: 'Koupíte auto a jedete. Žádné náklady navíc hned po nákupu.' },
                  { icon: Truck,        title: 'Vše na klíč',          sub: 'Přeprava, registrace v ČR, dovoz domů — vše v ceně.' },
                  { icon: Users,        title: 'Ideální pro firmy',    sub: `Zbývá ${STOCK} z ${TOTAL_STOCK} identických vozů — výhodná příležitost pro firemní flotilu.` },
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

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { icon: ShieldCheck,  text: 'Vrácení zálohy při zrušení' },
                  { icon: CheckCircle2, text: 'Žádné skryté poplatky — smluvně garantováno' },
                  { icon: ShieldCheck,  text: 'Kompletní dokumentace vozu' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-md px-4 py-3">
                    <Icon size={15} className="text-[#28a745] shrink-0" />
                    <span className="text-gray-300 text-xs leading-snug">{text}</span>
                  </div>
                ))}
              </div>

              <div className="mt-5 pt-5 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
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

              {/* price card */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.25 }}
                className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden"
              >
                <div className="bg-[#f0faf2] px-6 py-5 border-b border-green-100">
                  <div className="text-xs text-[#1e7e34] uppercase tracking-wider font-bold mb-1">Cena vč. DPH</div>
                  <div className="text-4xl font-black text-[#1e7e34] mb-1">{czk(PRICE)}</div>
                  <div className="text-xs text-gray-500">dovoz domů · přihlášení v ČR · bez skrytých poplatků</div>
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-2 text-sm font-semibold px-3 py-2 rounded-md bg-orange-50 text-orange-700">
                    <div className="w-2 h-2 rounded-full bg-orange-500 shrink-0 animate-pulse" />
                    Zbývá jen {STOCK} z {TOTAL_STOCK} kusů
                  </div>

                  <button
                    onClick={() => addToCart(CAR_CART)}
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
                </div>
              </motion.div>

              {/* urgency */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3"
              >
                <Clock size={18} className="text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-amber-900 text-sm">Omezená dostupnost</div>
                  <div className="text-xs text-amber-700 mt-0.5 leading-relaxed">Zbývá jen {STOCK} z {TOTAL_STOCK} vozů. Po vyprodání se nabídka nebude opakovat.</div>
                </div>
              </motion.div>

              {/* zpět */}
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
          <div className="text-xl font-black text-[#1e7e34] leading-tight">{czk(PRICE)}</div>
          <div className="text-xs text-orange-500 font-semibold">Zbývá {STOCK} z {TOTAL_STOCK} kusů</div>
        </div>
        <a href="tel:+420733455966" className="flex items-center gap-1 border-2 border-[#1e7e34] text-[#1e7e34] font-bold px-3 py-2 rounded-md text-sm whitespace-nowrap">
          <Phone size={14} /> Zavolat
        </a>
        <button
          onClick={() => addToCart(CAR_CART)}
          className="flex items-center gap-1 bg-[#1e7e34] hover:bg-[#28a745] text-white font-bold px-3 py-2 rounded-md text-sm whitespace-nowrap transition-colors"
        >
          <ShoppingCart size={14} /> Do košíku
        </button>
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
                  src={IMAGES[activeIdx]}
                  alt={`foto ${activeIdx + 1}`}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.18 }}
                  className="w-full max-h-[75vh] object-contain"
                />
              </AnimatePresence>
              <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/25 rounded-full flex items-center justify-center transition-colors">
                <ChevronLeft size={26} className="text-white" />
              </button>
              <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/25 rounded-full flex items-center justify-center transition-colors">
                <ChevronRight size={26} className="text-white" />
              </button>
            </div>
            <div className="text-white/60 text-sm mt-4">{activeIdx + 1} / {IMAGES.length}</div>
            <div className="flex gap-2 mt-4 px-4 overflow-x-auto max-w-3xl" onClick={e => e.stopPropagation()}>
              {IMAGES.map((img, i) => (
                <button key={i} onClick={() => setActiveIdx(i)}
                  className={`shrink-0 w-16 h-11 rounded border-2 overflow-hidden transition-all ${i === activeIdx ? 'border-[#28a745]' : 'border-white/20 opacity-50 hover:opacity-80'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            <button onClick={() => setLightboxOpen(false)} className="absolute top-5 right-5 w-10 h-10 bg-white/10 hover:bg-white/25 rounded-full flex items-center justify-center transition-colors">
              <X size={20} className="text-white" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
