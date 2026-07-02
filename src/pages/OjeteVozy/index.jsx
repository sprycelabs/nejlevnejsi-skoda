import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, SlidersHorizontal, X, ChevronDown, Fuel, Cog, Gauge, Calendar, ShoppingCart, ArrowRight, ArrowUpDown, Phone, ShieldCheck, Truck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ojeteVozy, formatPrice } from '../../data/cars'
import { useCart } from '../../context/CartContext'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import SEO from '../../components/SEO'

const MODELS = [...new Set(ojeteVozy.map(c => c.name.split(' ').slice(0, 2).join(' ')))].sort((a, b) => a.localeCompare(b, 'cs'))
const FUELS = [...new Set(ojeteVozy.map(c => c.fuel))]
const TRANSMISSIONS = [...new Set(ojeteVozy.map(c => c.transmission))]
const MAX_PRICE = ojeteVozy.length ? Math.max(...ojeteVozy.map(c => c.salePrice)) : 1000000
const MIN_PRICE = ojeteVozy.length ? Math.min(...ojeteVozy.map(c => c.salePrice)) : 0

const SORT_OPTIONS = [
  { value: 'default', label: 'Výchozí řazení' },
  { value: 'price-asc', label: 'Cena: od nejnižší' },
  { value: 'price-desc', label: 'Cena: od nejvyšší' },
  { value: 'discount', label: 'Největší sleva' },
  { value: 'mileage-asc', label: 'Nájezd: od nejnižšího' },
  { value: 'name', label: 'Název A–Z' },
]

function FilterChip({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-[#1e7e34]/10 text-[#1e7e34] text-xs font-medium px-3 py-1.5 rounded-full">
      {label}
      <button onClick={onRemove} className="hover:text-[#145523]"><X size={12} /></button>
    </span>
  )
}

function CarCard({ car }) {
  const { addToCart } = useCart()
  const soldOut = car.inStock === 0
  return (
    <Link to={`/ojete-vozy/${car.slug}`} className="block">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className={`bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden group flex flex-col h-full ${
          soldOut
            ? 'border-2 border-gray-300 ring-2 ring-gray-100 opacity-70'
            : car.isReserved
              ? 'border-2 border-gray-400 ring-2 ring-gray-200 opacity-80'
              : 'border border-gray-100'
        }`}
      >
        {soldOut && (
          <div className="bg-gray-500 flex items-center justify-center gap-1.5 py-1.5">
            <span className="text-white text-xs font-black tracking-widest uppercase">Prodáno</span>
          </div>
        )}
        {!soldOut && car.isReserved && (
          <div className="bg-gray-700 flex items-center justify-center gap-1.5 py-1.5">
            <span className="text-white text-xs font-black tracking-widest uppercase">Rezervováno</span>
          </div>
        )}

        <div className="relative h-48 overflow-hidden bg-gray-100">
          <img
            src={car.image}
            alt={car.name}
            className={`h-full w-full object-cover group-hover:scale-105 transition-transform duration-300 ${soldOut ? 'grayscale' : ''}`}
          />
          {soldOut && (
            <div className="absolute inset-0 bg-gray-900/30 flex items-center justify-center">
              <span className="bg-gray-700/80 text-white text-sm font-black px-4 py-2 rounded-full tracking-wide">Prodáno</span>
            </div>
          )}
          {!soldOut && car.isReserved && (
            <div className="absolute inset-0 bg-gray-900/10 flex items-center justify-center">
              <span className="bg-gray-800/80 text-white text-sm font-black px-4 py-2 rounded-full tracking-wide">Rezervováno</span>
            </div>
          )}
          <div className="absolute top-3 left-3">
            <span className="bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">Ojeté</span>
          </div>
          <div className="absolute top-3 right-3 w-11 h-11 bg-red-500 text-white rounded-full flex flex-col items-center justify-center shadow-lg">
            <span className="text-xs font-black leading-none">{car.discount} %</span>
          </div>
        </div>

        <div className="p-5 flex flex-col flex-1">
          <div className="mb-3">
            <h3 className="font-black text-lg text-gray-900">{car.name}</h3>
            <p className="text-gray-500 text-sm">{car.variant} · {car.power}</p>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="flex items-center gap-1.5 text-xs text-gray-600"><Fuel size={13} className="text-gray-400 shrink-0" />{car.fuel}</div>
            <div className="flex items-center gap-1.5 text-xs text-gray-600"><Cog size={13} className="text-gray-400 shrink-0" />{car.transmission}</div>
            <div className="flex items-center gap-1.5 text-xs text-gray-600"><Calendar size={13} className="text-gray-400 shrink-0" />{car.year}</div>
            <div className="flex items-center gap-1.5 text-xs text-gray-600"><Gauge size={13} className="text-gray-400 shrink-0" />{car.mileage}</div>
          </div>

          <div className="mb-4 mt-auto">
            <div className="flex items-baseline gap-2">
              <span className="text-xs text-gray-400 line-through">{formatPrice(car.originalPrice)}</span>
            </div>
            <div className="text-2xl font-black text-[#1e7e34]">{formatPrice(car.salePrice)}</div>
            <div className="text-xs text-gray-400">vč. DPH · ušetříte {formatPrice(car.originalPrice - car.salePrice)}</div>
          </div>

          <div className="flex gap-2">
            {soldOut ? (
              <span
                className="flex-1 flex items-center justify-center gap-1.5 bg-gray-200 text-gray-400 text-sm font-semibold py-3 px-4 rounded-md cursor-not-allowed"
                onClick={e => { e.preventDefault(); e.stopPropagation() }}
              >
                <ShoppingCart size={15} />
                Prodáno
              </span>
            ) : car.isReserved ? (
              <span
                className="flex-1 flex items-center justify-center gap-1.5 bg-gray-200 text-gray-400 text-sm font-semibold py-3 px-4 rounded-md cursor-not-allowed"
                onClick={e => { e.preventDefault(); e.stopPropagation() }}
              >
                <ShoppingCart size={15} />
                Rezervováno
              </span>
            ) : (
              <button
                onClick={e => { e.preventDefault(); e.stopPropagation(); addToCart(car) }}
                className="flex-1 flex items-center justify-center gap-1.5 bg-[#1e7e34] hover:bg-[#28a745] text-white text-sm font-semibold py-3 px-4 rounded-md transition-colors"
              >
                <ShoppingCart size={15} />
                Do košíku
              </button>
            )}
            <span className="flex items-center gap-1 border border-gray-200 hover:border-[#1e7e34] text-gray-600 hover:text-[#1e7e34] text-sm font-medium py-3 px-4 rounded-md transition-colors">
              Detail <ArrowRight size={14} />
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}

export default function OjeteVozy() {
  const [search, setSearch] = useState('')
  const [selectedModels, setSelectedModels] = useState([])
  const [selectedFuels, setSelectedFuels] = useState([])
  const [selectedTransmissions, setSelectedTransmissions] = useState([])
  const [priceRange, setPriceRange] = useState([MIN_PRICE, MAX_PRICE])
  const [onlyFreeDelivery, setOnlyFreeDelivery] = useState(false)
  const [onlyNew, setOnlyNew] = useState(false)
  const [sort, setSort] = useState('default')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const toggleItem = (list, setList, value) => {
    setList(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value])
  }

  const activeFiltersCount = selectedModels.length + selectedFuels.length + selectedTransmissions.length +
    (onlyFreeDelivery ? 1 : 0) + (onlyNew ? 1 : 0) +
    (priceRange[0] !== MIN_PRICE || priceRange[1] !== MAX_PRICE ? 1 : 0)

  const resetAll = () => {
    setSelectedModels([])
    setSelectedFuels([])
    setSelectedTransmissions([])
    setPriceRange([MIN_PRICE, MAX_PRICE])
    setOnlyFreeDelivery(false)
    setOnlyNew(false)
    setSearch('')
  }

  const filtered = useMemo(() => {
    let result = ojeteVozy.filter(car => {
      if (search && !`${car.name} ${car.variant}`.toLowerCase().includes(search.toLowerCase())) return false
      if (selectedModels.length && !selectedModels.some(m => car.name.startsWith(m))) return false
      if (selectedFuels.length && !selectedFuels.includes(car.fuel)) return false
      if (selectedTransmissions.length && !selectedTransmissions.includes(car.transmission)) return false
      if (car.salePrice < priceRange[0] || car.salePrice > priceRange[1]) return false
      if (onlyFreeDelivery && !car.freeDelivery) return false
      if (onlyNew && !car.isNew) return false
      return true
    })

    switch (sort) {
      case 'price-asc': return [...result].sort((a, b) => a.salePrice - b.salePrice)
      case 'price-desc': return [...result].sort((a, b) => b.salePrice - a.salePrice)
      case 'discount': return [...result].sort((a, b) => b.discount - a.discount)
      case 'mileage-asc': return [...result].sort((a, b) => parseInt(a.mileage) - parseInt(b.mileage))
      case 'name': return [...result].sort((a, b) => a.name.localeCompare(b.name))
      default: return result
    }
  }, [search, selectedModels, selectedFuels, selectedTransmissions, priceRange, onlyFreeDelivery, onlyNew, sort])

  const FilterPanel = () => (
    <div className="space-y-6">
      {MODELS.length > 0 && (
        <div>
          <h3 className="font-bold text-gray-900 text-sm mb-3">Model</h3>
          <div className="space-y-2">
            {MODELS.map(model => (
              <label key={model} className="flex items-start gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedModels.includes(model)}
                  onChange={() => toggleItem(selectedModels, setSelectedModels, model)}
                  className="w-4 h-4 accent-[#1e7e34] cursor-pointer shrink-0 mt-0.5"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">{model}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {MODELS.length > 0 && <div className="border-t border-gray-100" />}

      {FUELS.length > 0 && (
        <div>
          <h3 className="font-bold text-gray-900 text-sm mb-3">Palivo</h3>
          <div className="space-y-2">
            {FUELS.map(fuel => (
              <label key={fuel} className="flex items-start gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedFuels.includes(fuel)}
                  onChange={() => toggleItem(selectedFuels, setSelectedFuels, fuel)}
                  className="w-4 h-4 accent-[#1e7e34] cursor-pointer shrink-0 mt-0.5"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">{fuel}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {FUELS.length > 0 && <div className="border-t border-gray-100" />}

      {TRANSMISSIONS.length > 0 && (
        <div>
          <h3 className="font-bold text-gray-900 text-sm mb-3">Převodovka</h3>
          <div className="space-y-2">
            {TRANSMISSIONS.map(t => (
              <label key={t} className="flex items-start gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedTransmissions.includes(t)}
                  onChange={() => toggleItem(selectedTransmissions, setSelectedTransmissions, t)}
                  className="w-4 h-4 accent-[#1e7e34] cursor-pointer shrink-0 mt-0.5"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">{t}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {TRANSMISSIONS.length > 0 && <div className="border-t border-gray-100" />}

      <div>
        <h3 className="font-bold text-gray-900 text-sm mb-3">Cena</h3>
        <div className="space-y-3">
          <div className="flex justify-between text-xs text-gray-500">
            <span>{formatPrice(priceRange[0])}</span>
            <span>{formatPrice(priceRange[1])}</span>
          </div>
          <input
            type="range"
            min={MIN_PRICE}
            max={MAX_PRICE}
            step={10000}
            value={priceRange[1]}
            onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
            className="w-full accent-[#1e7e34]"
          />
        </div>
      </div>

      <div className="border-t border-gray-100" />

      {/* Ostatní */}
      <div>
        <h3 className="font-bold text-gray-900 text-sm mb-3">Ostatní</h3>
        <div className="space-y-2">
          <label className="flex items-start gap-2.5 cursor-pointer group">
            <input type="checkbox" checked={onlyFreeDelivery} onChange={e => setOnlyFreeDelivery(e.target.checked)} className="w-4 h-4 accent-[#1e7e34]" />
            <span className="text-sm text-gray-700 group-hover:text-gray-900">Doprava zdarma</span>
          </label>
          <label className="flex items-start gap-2.5 cursor-pointer group">
            <input type="checkbox" checked={onlyNew} onChange={e => setOnlyNew(e.target.checked)} className="w-4 h-4 accent-[#1e7e34]" />
            <span className="text-sm text-gray-700 group-hover:text-gray-900">Pouze novinky</span>
          </label>
        </div>
      </div>

      {activeFiltersCount > 0 && (
        <>
          <div className="border-t border-gray-100" />
          <button onClick={resetAll} className="w-full text-sm text-red-500 hover:text-red-700 font-medium flex items-center gap-1.5 justify-center py-2 border border-red-200 hover:border-red-300 rounded-md transition-colors">
            <X size={14} /> Zrušit filtry ({activeFiltersCount})
          </button>
        </>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Ojeté vozy | Škoda, VW, Audi, SEAT, CUPRA — prověřené vozy z leasingu"
        description="Prověřené ojeté vozy z finančního a operativního leasingu. Škoda, Volkswagen, Audi, SEAT, CUPRA. Doprava a registrace v ceně, transparentní popis stavu, záruka na skryté vady."
        canonical="/ojete-vozy"
      />
      <Navbar />

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative bg-[#0d1f10] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d1f10] via-[#1a3d1e] to-[#0a1508]" />
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-[#1e7e34]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-[#28a745]/8 rounded-full blur-3xl pointer-events-none" />
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-28 sm:pt-36 pb-10 sm:pb-16 w-full">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.05 }}
                className="inline-flex items-center gap-2 bg-[#1e7e34]/20 border border-[#1e7e34]/40 text-[#86efac] text-xs font-bold px-4 py-1.5 rounded-full mb-5 tracking-wider uppercase"
              >
                <span className="w-2 h-2 rounded-full bg-[#4ade80] shrink-0" />
                Ojeté vozy
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-3xl sm:text-4xl xl:text-5xl font-black text-white leading-tight mb-5"
              >
                Prověřené ojeté vozy{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#28a745] to-[#86efac]">
                  připravené k odběru
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-gray-300 text-sm sm:text-base leading-relaxed mb-8 max-w-lg"
              >
                Nabízíme vozy po ukončení finančního nebo operativního leasingu — převážně ze skupiny Volkswagen (Škoda, VW, Audi, SEAT, CUPRA). U každého vozu uvádíme podrobný popis stavu včetně všech závad. Žádná překvapení.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="flex flex-wrap gap-3 mb-8"
              >
                <a
                  href="tel:+420733455966"
                  className="flex items-center gap-2 bg-[#1e7e34] hover:bg-[#28a745] text-white font-bold px-6 py-3.5 rounded-md transition-all duration-200 shadow-lg shadow-green-900/40 text-sm"
                >
                  <Phone size={16} />
                  Zavolat
                </a>
                <a
                  href="#katalog"
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-6 py-3.5 rounded-md transition-all duration-200 text-sm"
                >
                  Zobrazit vozy
                  <ArrowRight size={14} />
                </a>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-wrap items-center gap-5"
              >
                {[
                  { icon: ShieldCheck, text: 'Transparentní popis stavu' },
                  { icon: Truck,       text: 'Doprava a registrace v ceně' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2 text-gray-300 text-xs sm:text-sm">
                    <Icon size={15} className="text-[#28a745]" />
                    {text}
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right — klíčové benefity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-3"
            >
              {[
                { title: 'Doprava po celé ČR', desc: 'Dovoz a registrace vozu na nového majitele jsou součástí ceny.' },
                { title: 'Doživotní záruka', desc: 'Na skryté vady poskytujeme doživotní záruku bez výjimky.' },
                { title: '12 měs. / 50 000 km', desc: 'Na technický stav vozů bez tovární záruky — podle toho, co nastane dříve.' },
                { title: 'Poctivý popis stavu', desc: 'Uvádíme všechny závady, poškození i kosmetické vady. Žádná překvapení.' },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.07 }}
                  className="bg-white/5 border border-white/10 rounded-xl p-5"
                >
                  <div className="font-black text-white text-sm mb-1.5">{item.title}</div>
                  <div className="text-gray-400 text-xs leading-relaxed">{item.desc}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        <div className="relative z-10">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block">
            <path d="M0 80L1440 80L1440 40C1200 80 960 0 720 40C480 80 240 0 0 40L0 80Z" fill="#f9fafb" />
          </svg>
        </div>
      </section>

      {/* ── KATALOG ───────────────────────────────────────────────────────── */}
      <div id="katalog" className="max-w-7xl mx-auto px-4 sm:px-6 py-8 bg-gray-50 min-h-[60vh]">
        <div className="flex gap-0 lg:gap-8">
          {/* Sidebar filtry — desktop */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="bg-white rounded-lg border border-gray-100 p-6 sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-black text-gray-900">Filtry</h2>
                {activeFiltersCount > 0 && (
                  <span className="bg-[#1e7e34] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </div>
              <FilterPanel />
            </div>
          </aside>

          {/* Hlavní obsah */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col gap-2 sm:gap-3 mb-6">
              <div className="relative w-full">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Hledat vůz…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-md pl-10 pr-4 py-2.5 text-sm outline-none focus:border-[#1e7e34] transition-colors"
                />
                {search && (
                  <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <X size={14} />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMobileFiltersOpen(true)}
                  className="lg:hidden flex items-center gap-2 bg-white border border-gray-200 rounded-md px-4 py-2.5 text-sm font-medium text-gray-700 hover:border-[#1e7e34] transition-colors shrink-0"
                >
                  <SlidersHorizontal size={15} />
                  Filtry
                  {activeFiltersCount > 0 && <span className="bg-[#1e7e34] text-white text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">{activeFiltersCount}</span>}
                </button>

                <div className="relative flex-1 lg:flex-none">
                  <ArrowUpDown size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <select
                    value={sort}
                    onChange={e => setSort(e.target.value)}
                    className="appearance-none w-full bg-white border border-gray-200 rounded-md pl-9 pr-8 py-2.5 text-sm font-medium text-gray-700 outline-none focus:border-[#1e7e34] cursor-pointer transition-colors"
                  >
                    {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                  <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>

                <span className="text-sm text-gray-400 shrink-0 ml-auto lg:ml-0">
                  {filtered.length} {filtered.length === 1 ? 'vůz' : filtered.length < 5 ? 'vozy' : 'vozů'}
                </span>
              </div>
            </div>

            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedModels.map(m => <FilterChip key={m} label={m} onRemove={() => toggleItem(selectedModels, setSelectedModels, m)} />)}
                {selectedFuels.map(f => <FilterChip key={f} label={f} onRemove={() => toggleItem(selectedFuels, setSelectedFuels, f)} />)}
                {selectedTransmissions.map(t => <FilterChip key={t} label={t} onRemove={() => toggleItem(selectedTransmissions, setSelectedTransmissions, t)} />)}
                {onlyFreeDelivery && <FilterChip label="Doprava zdarma" onRemove={() => setOnlyFreeDelivery(false)} />}
                {onlyNew && <FilterChip label="Novinky" onRemove={() => setOnlyNew(false)} />}
              </div>
            )}

            <AnimatePresence mode="wait">
              {filtered.length > 0 ? (
                <motion.div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-5">
                  {filtered.map(car => <CarCard key={car.id} car={car} />)}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20 text-gray-400"
                >
                  <Search size={40} className="mx-auto mb-4 opacity-30" />
                  <p className="font-semibold text-lg text-gray-600">Žádné vozy nenalezeny</p>
                  <p className="text-sm mt-1">Zkuste upravit nebo zrušit filtry</p>
                  <button onClick={resetAll} className="mt-4 text-[#1e7e34] font-semibold hover:underline text-sm">
                    Zrušit všechny filtry
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Mobile filtry drawer */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFiltersOpen(false)}
              className="fixed inset-0 bg-black z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-[85vw] sm:w-80 bg-white z-50 overflow-y-auto lg:hidden"
            >
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <h2 className="font-black text-gray-900">Filtry</h2>
                <button onClick={() => setMobileFiltersOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X size={20} />
                </button>
              </div>
              <div className="p-5">
                <FilterPanel />
              </div>
              <div className="p-5 border-t border-gray-100">
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="w-full bg-[#1e7e34] hover:bg-[#28a745] text-white font-bold py-3 rounded-md transition-colors"
                >
                  Zobrazit výsledky ({filtered.length})
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  )
}
