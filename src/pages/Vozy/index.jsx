import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, SlidersHorizontal, X, ChevronDown, Fuel, Cog, Zap, Package, Truck, ShoppingCart, ArrowRight, ArrowUpDown } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cars, formatPrice } from '../../data/cars'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

const MODELS = [...new Set(cars.map(c => c.name))]
const FUELS = [...new Set(cars.map(c => c.fuel))]
const TRANSMISSIONS = [...new Set(cars.map(c => c.transmission))]
const MAX_PRICE = Math.max(...cars.map(c => c.salePrice))
const MIN_PRICE = Math.min(...cars.map(c => c.salePrice))

const SORT_OPTIONS = [
  { value: 'default', label: 'VĂ˝chozĂ­ Ĺ™azenĂ­' },
  { value: 'price-asc', label: 'Cena: od nejniĹľĹˇĂ­' },
  { value: 'price-desc', label: 'Cena: od nejvyĹˇĹˇĂ­' },
  { value: 'discount', label: 'NejvÄ›tĹˇĂ­ sleva' },
  { value: 'name', label: 'NĂˇzev Aâ€“Z' },
]

function FilterChip({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-[#1e7e34]/10 text-[#1e7e34] text-xs font-medium px-3 py-1.5 rounded-full">
      {label}
      <button onClick={onRemove} className="hover:text-[#145523]"><X size={12} /></button>
    </span>
  )
}

function CarCard({ car, index }) {
  return (
    <Link to={`/vozy/${car.slug}`} className="block">
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden group flex flex-col h-full"
    >
      <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 h-48 flex items-center justify-center overflow-hidden">
        <img
          src={car.image}
          alt={car.name}
          className="h-full w-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {car.isSale && <span className="bg-[#1e7e34] text-white text-xs font-bold px-2.5 py-1 rounded-full">Akce</span>}
          {car.isNew && <span className="bg-[#0d6efd] text-white text-xs font-bold px-2.5 py-1 rounded-full">Novinka</span>}
          {car.freeDelivery && <span className="bg-[#fd7e14] text-white text-xs font-bold px-2.5 py-1 rounded-full">Doprava ZDARMA</span>}
        </div>
        <div className="absolute top-3 right-3 w-11 h-11 bg-red-500 text-white rounded-full flex flex-col items-center justify-center shadow-lg">
          <span className="text-xs font-black leading-none">{car.discount} %</span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="mb-3">
          <h3 className="font-black text-lg text-gray-900">{car.name}</h3>
          <p className="text-gray-500 text-sm">{car.variant} Â· {car.power}</p>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="flex items-center gap-1.5 text-xs text-gray-600"><Fuel size={13} className="text-gray-400 shrink-0" />{car.fuel}</div>
          <div className="flex items-center gap-1.5 text-xs text-gray-600"><Cog size={13} className="text-gray-400 shrink-0" />{car.transmission}</div>
          <div className="flex items-center gap-1.5 text-xs text-gray-600"><Zap size={13} className="text-gray-400 shrink-0" />{car.consumption}</div>
          <div className="flex items-center gap-1.5 text-xs text-gray-600"><Package size={13} className="text-gray-400 shrink-0" />Skladem {car.inStock} ks</div>
        </div>

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
          <div className="text-xs text-gray-400">vÄŤ. DPH Â· uĹˇetĹ™Ă­te {formatPrice(car.originalPrice - car.salePrice)}</div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={e => e.preventDefault()}
            className="flex-1 flex items-center justify-center gap-1.5 bg-[#1e7e34] hover:bg-[#28a745] text-white text-sm font-semibold py-3 px-4 rounded-md transition-colors"
          >
            <ShoppingCart size={15} />
            Do koĹˇĂ­ku
          </button>
          <span className="flex items-center gap-1 border border-gray-200 hover:border-[#1e7e34] text-gray-600 hover:text-[#1e7e34] text-sm font-medium py-3 px-4 rounded-md transition-colors">
            Detail <ArrowRight size={14} />
          </span>
        </div>
      </div>
    </motion.div>
    </Link>
  )
}

export default function VozyPage() {
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
    let result = cars.filter(car => {
      if (search && !`${car.name} ${car.variant}`.toLowerCase().includes(search.toLowerCase())) return false
      if (selectedModels.length && !selectedModels.includes(car.name)) return false
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
      case 'name': return [...result].sort((a, b) => a.name.localeCompare(b.name))
      default: return result
    }
  }, [search, selectedModels, selectedFuels, selectedTransmissions, priceRange, onlyFreeDelivery, onlyNew, sort])

  const FilterPanel = () => (
    <div className="space-y-6">
      {/* Model */}
      <div>
        <h3 className="font-bold text-gray-900 text-sm mb-3">Model</h3>
        <div className="space-y-2">
          {MODELS.map(model => (
            <label key={model} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedModels.includes(model)}
                onChange={() => toggleItem(selectedModels, setSelectedModels, model)}
                className="w-4 h-4 accent-[#1e7e34] cursor-pointer"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900">{model}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-100" />

      {/* Palivo */}
      <div>
        <h3 className="font-bold text-gray-900 text-sm mb-3">Palivo</h3>
        <div className="space-y-2">
          {FUELS.map(fuel => (
            <label key={fuel} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedFuels.includes(fuel)}
                onChange={() => toggleItem(selectedFuels, setSelectedFuels, fuel)}
                className="w-4 h-4 accent-[#1e7e34] cursor-pointer"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900">{fuel}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-100" />

      {/* PĹ™evodovka */}
      <div>
        <h3 className="font-bold text-gray-900 text-sm mb-3">PĹ™evodovka</h3>
        <div className="space-y-2">
          {TRANSMISSIONS.map(t => (
            <label key={t} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedTransmissions.includes(t)}
                onChange={() => toggleItem(selectedTransmissions, setSelectedTransmissions, t)}
                className="w-4 h-4 accent-[#1e7e34] cursor-pointer"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900">{t}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-100" />

      {/* Cena */}
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

      {/* OstatnĂ­ */}
      <div>
        <h3 className="font-bold text-gray-900 text-sm mb-3">OstatnĂ­</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2.5 cursor-pointer group">
            <input type="checkbox" checked={onlyFreeDelivery} onChange={e => setOnlyFreeDelivery(e.target.checked)} className="w-4 h-4 accent-[#1e7e34]" />
            <span className="text-sm text-gray-700 group-hover:text-gray-900">Doprava zdarma</span>
          </label>
          <label className="flex items-center gap-2.5 cursor-pointer group">
            <input type="checkbox" checked={onlyNew} onChange={e => setOnlyNew(e.target.checked)} className="w-4 h-4 accent-[#1e7e34]" />
            <span className="text-sm text-gray-700 group-hover:text-gray-900">Pouze novinky</span>
          </label>
        </div>
      </div>

      {activeFiltersCount > 0 && (
        <>
          <div className="border-t border-gray-100" />
          <button onClick={resetAll} className="w-full text-sm text-red-500 hover:text-red-700 font-medium flex items-center gap-1.5 justify-center py-2 border border-red-200 hover:border-red-300 rounded-md transition-colors">
            <X size={14} /> ZruĹˇit filtry ({activeFiltersCount})
          </button>
        </>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Page header */}
      <div className="bg-[#0d1f10] pt-24 sm:pt-28 pb-8 sm:pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-[#86efac] text-sm font-semibold uppercase tracking-wider mb-2">Katalog</p>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white">NovĂ© vozy Ĺ koda</h1>
          <p className="text-gray-400 mt-2">Vozy z EU za vĂ˝hodnĂ© ceny Â· plnĂˇ tovĂˇrnĂ­ zĂˇruka</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex gap-0 lg:gap-8">
          {/* Sidebar filtry â€” desktop */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="bg-white rounded-lg border border-gray-100 p-6 sticky top-24">
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

          {/* HlavnĂ­ obsah */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-6">
              {/* Search */}
              <div className="relative flex-1 min-w-0">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Hledat vĹŻzâ€¦"
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

              {/* Mobile filtry */}
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden flex items-center gap-2 bg-white border border-gray-200 rounded-md px-4 py-2.5 text-sm font-medium text-gray-700 hover:border-[#1e7e34] transition-colors"
              >
                <SlidersHorizontal size={15} />
                Filtry
                {activeFiltersCount > 0 && <span className="bg-[#1e7e34] text-white text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">{activeFiltersCount}</span>}
              </button>

              {/* Sort */}
              <div className="relative">
                <ArrowUpDown size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <select
                  value={sort}
                  onChange={e => setSort(e.target.value)}
                  className="appearance-none bg-white border border-gray-200 rounded-md pl-9 pr-8 py-2.5 text-sm font-medium text-gray-700 outline-none focus:border-[#1e7e34] cursor-pointer transition-colors"
                >
                  {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>

              <span className="text-sm text-gray-400 ml-auto">
                {filtered.length} {filtered.length === 1 ? 'vĹŻz' : filtered.length < 5 ? 'vozy' : 'vozĹŻ'}
              </span>
            </div>

            {/* AktivnĂ­ filtry chips */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedModels.map(m => <FilterChip key={m} label={m} onRemove={() => toggleItem(selectedModels, setSelectedModels, m)} />)}
                {selectedFuels.map(f => <FilterChip key={f} label={f} onRemove={() => toggleItem(selectedFuels, setSelectedFuels, f)} />)}
                {selectedTransmissions.map(t => <FilterChip key={t} label={t} onRemove={() => toggleItem(selectedTransmissions, setSelectedTransmissions, t)} />)}
                {onlyFreeDelivery && <FilterChip label="Doprava zdarma" onRemove={() => setOnlyFreeDelivery(false)} />}
                {onlyNew && <FilterChip label="Novinky" onRemove={() => setOnlyNew(false)} />}
              </div>
            )}

            {/* Grid */}
            <AnimatePresence mode="popLayout">
              {filtered.length > 0 ? (
                <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-5">
                  {filtered.map((car, i) => <CarCard key={car.id} car={car} index={i} />)}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20 text-gray-400"
                >
                  <Search size={40} className="mx-auto mb-4 opacity-30" />
                  <p className="font-semibold text-lg text-gray-600">Ĺ˝ĂˇdnĂ© vozy nenalezeny</p>
                  <p className="text-sm mt-1">Zkuste upravit nebo zruĹˇit filtry</p>
                  <button onClick={resetAll} className="mt-4 text-[#1e7e34] font-semibold hover:underline text-sm">
                    ZruĹˇit vĹˇechny filtry
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
                  Zobrazit vĂ˝sledky ({filtered.length})
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
