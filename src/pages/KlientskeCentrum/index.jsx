import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LogOut, Car, Package, ChevronRight, ChevronDown, Clock, CheckCircle2, Truck, MessageCircle, AlertCircle, ExternalLink, Fuel, Zap, Settings2, Gauge, CreditCard } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { cars } from '../../data/cars'

const STATUS_CONFIG = {
  prijato: {
    label: 'Přijato',
    color: 'text-blue-600',
    bg: 'bg-blue-50 border-blue-200',
    dot: 'bg-blue-500',
    icon: Package,
    step: 0,
  },
  zpracovava_se: {
    label: 'Zpracovává se',
    color: 'text-amber-600',
    bg: 'bg-amber-50 border-amber-200',
    dot: 'bg-amber-500',
    icon: Clock,
    step: 1,
  },
  potvrzeno_dealerem: {
    label: 'Potvrzeno dealerem',
    color: 'text-violet-600',
    bg: 'bg-violet-50 border-violet-200',
    dot: 'bg-violet-500',
    icon: CheckCircle2,
    step: 2,
  },
  na_ceste: {
    label: 'Na cestě do ČR',
    color: 'text-orange-600',
    bg: 'bg-orange-50 border-orange-200',
    dot: 'bg-orange-500',
    icon: Truck,
    step: 3,
  },
  prihlasovani: {
    label: 'Přihlašování vozu',
    color: 'text-cyan-600',
    bg: 'bg-cyan-50 border-cyan-200',
    dot: 'bg-cyan-500',
    icon: Clock,
    step: 4,
  },
  dorucovani: {
    label: 'Doručování zákazníkovi',
    color: 'text-indigo-600',
    bg: 'bg-indigo-50 border-indigo-200',
    dot: 'bg-indigo-500',
    icon: Truck,
    step: 5,
  },
  doruceno: {
    label: 'Doručeno',
    color: 'text-green-600',
    bg: 'bg-green-50 border-green-200',
    dot: 'bg-green-500',
    icon: CheckCircle2,
    step: 6,
  },
}

const STEPS = [
  { key: 'prijato',            label: 'Přijato' },
  { key: 'zpracovava_se',      label: 'Zpracovává se' },
  { key: 'potvrzeno_dealerem', label: 'Potvrzeno dealerem' },
  { key: 'na_ceste',           label: 'Na cestě do ČR' },
  { key: 'prihlasovani',       label: 'Přihlašování vozu' },
  { key: 'dorucovani',         label: 'Doručování' },
  { key: 'doruceno',           label: 'Doručeno' },
]

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.prijato
  return (
    <span className={`inline-flex items-center gap-1.5 border text-xs font-bold px-3 py-1 rounded-full ${cfg.bg} ${cfg.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  )
}

function StatusTimeline({ status }) {
  const currentStep = STATUS_CONFIG[status]?.step ?? 0
  return (
    <div className="mt-4">
      {/* Mobil — vertikální timeline */}
      <div className="sm:hidden space-y-0">
        {STEPS.map((step, i) => {
          const done = i <= currentStep
          const active = i === currentStep
          return (
            <div key={step.key} className="flex items-stretch gap-3">
              {/* Linka + tečka */}
              <div className="flex flex-col items-center">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 shrink-0 ${
                  done ? 'bg-[#1e7e34] border-[#28a745]' : 'bg-gray-100 border-gray-200'
                } ${active ? 'ring-2 ring-green-200' : ''}`}>
                  {done
                    ? <CheckCircle2 size={12} className="text-white" />
                    : <span className="text-gray-400 text-[10px] font-bold">{i + 1}</span>
                  }
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`w-0.5 flex-1 my-0.5 ${i < currentStep ? 'bg-[#28a745]' : 'bg-gray-200'}`} />
                )}
              </div>
              {/* Label */}
              <div className={`pb-3 pt-0.5 text-sm font-medium leading-none ${
                active ? 'text-gray-900 font-bold' : done ? 'text-gray-600' : 'text-gray-400'
              }`}>
                {step.label}
                {active && <span className="ml-2 text-[10px] font-bold text-[#28a745] uppercase tracking-wide">← Aktuálně</span>}
              </div>
            </div>
          )
        })}
      </div>

      {/* Desktop — horizontální timeline */}
      <div className="hidden sm:flex items-center gap-0">
        {STEPS.map((step, i) => {
          const done = i <= currentStep
          const active = i === currentStep
          return (
            <div key={step.key} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-colors ${
                  done ? 'bg-[#1e7e34] border-[#28a745]' : 'bg-gray-100 border-gray-200'
                } ${active ? 'ring-2 ring-green-200' : ''}`}>
                  {done
                    ? <CheckCircle2 size={14} className="text-white" />
                    : <span className="text-gray-400 text-xs font-bold">{i + 1}</span>
                  }
                </div>
                <span className={`text-[10px] font-medium text-center leading-tight max-w-[52px] ${done ? 'text-gray-700' : 'text-gray-400'}`}>
                  {step.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mb-4 mx-0.5 ${i < currentStep ? 'bg-[#28a745]' : 'bg-gray-200'}`} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function CarDetailPanel({ carData, order }) {
  const quickSpecs = [
    carData?.fuel     && { icon: Fuel,     label: 'Palivo',      value: carData.fuel },
    carData?.power    && { icon: Zap,      label: 'Výkon',       value: carData.power },
    carData?.transmission && { icon: Settings2, label: 'Převodovka', value: carData.transmission },
    carData?.consumption  && { icon: Gauge,    label: 'Spotřeba',   value: carData.consumption },
  ].filter(Boolean)

  // Flatten equipment into a short preview (first group, max 6 items)
  const equipmentGroups = carData?.equipment ? Object.entries(carData.equipment) : []
  const firstGroupRaw = equipmentGroups[0]?.[1]
  const firstGroupItems = Array.isArray(firstGroupRaw) ? firstGroupRaw.slice(0, 6) : []
  const firstGroupTotal = Array.isArray(firstGroupRaw) ? firstGroupRaw.length : 0

  return (
    <div className="pt-4 space-y-4">
      {/* Quick specs */}
      {quickSpecs.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {quickSpecs.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
              <Icon size={14} className="text-[#28a745] shrink-0" />
              <div>
                <p className="text-gray-400 text-xs leading-none mb-0.5">{label}</p>
                <p className="text-gray-800 text-xs font-semibold">{value}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Highlight */}
      {carData?.highlight && (
        <div className="bg-green-50 border border-green-100 rounded-xl px-4 py-3">
          <p className="text-green-800 text-xs leading-relaxed line-clamp-3">{carData.highlight}</p>
        </div>
      )}

      {/* Equipment preview */}
      {firstGroupItems.length > 0 && (
        <div>
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-wide mb-2">
            {equipmentGroups[0][0]}
          </p>
          <ul className="space-y-1">
            {firstGroupItems.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                <CheckCircle2 size={12} className="text-[#28a745] mt-0.5 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          {firstGroupTotal > 6 && (
            <p className="text-gray-400 text-xs mt-1.5">
              + {firstGroupTotal - 6} dalších položek
            </p>
          )}
        </div>
      )}

      {order.notes && (
        <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
          <p className="text-amber-700 text-xs font-semibold uppercase tracking-wide mb-1">Vaše poznámka</p>
          <p className="text-gray-700 text-sm">{order.notes}</p>
        </div>
      )}

      {/* Link na detail */}
      {order.car_slug && (
        <a
          href={`/vozy/${order.car_slug}`}
          className="inline-flex items-center gap-2 text-[#28a745] hover:text-[#1e7e34] text-sm font-semibold transition-colors"
        >
          <ExternalLink size={14} />
          Zobrazit detail vozu na webu
        </a>
      )}
    </div>
  )
}

function OrderCard({ order, index }) {
  const [expanded, setExpanded] = useState(false)

  // Najdi vůz v cars.js podle internal_id
  const carData = order.internal_id
    ? cars.find(c => c.internalId === order.internal_id) ?? null
    : null

  const hasImage = carData?.image || order.car_slug
  const imageSrc = carData?.image || (order.car_slug ? `/cars/${order.car_slug}.webp` : null)
  const hasExpandable = carData || order.deposit_paid || order.notes || order.admin_note || order.car_slug

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Zpráva od nás — vždy viditelná, nad fotkou */}
      {order.admin_note && (
        <div className="mx-6 mt-6 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
          <p className="text-blue-600 text-xs font-semibold uppercase tracking-wide mb-1">Zpráva od nás</p>
          <p className="text-gray-700 text-sm leading-relaxed">{order.admin_note}</p>
        </div>
      )}

      {/* Car image */}
      {hasImage && imageSrc && (
        <div className="w-full bg-gray-50 px-6 pt-6">
          <img
            src={imageSrc}
            alt={order.car_name}
            className="w-full max-h-56 object-contain"
            onError={(e) => { e.target.parentElement.style.display = 'none' }}
          />
        </div>
      )}

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 border border-green-200 rounded-xl flex items-center justify-center shrink-0">
              <Car size={18} className="text-[#28a745]" />
            </div>
            <div>
              <h3 className="text-gray-900 font-bold text-sm">{order.car_name}</h3>
              {order.car_variant && (
                <p className="text-gray-500 text-xs mt-0.5">{order.car_variant}</p>
              )}
            </div>
          </div>
          <StatusBadge status={order.status} />
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-gray-100">
          {order.car_color && (
            <div>
              <p className="text-gray-400 text-xs mb-0.5">Barva</p>
              <p className="text-gray-700 text-sm font-medium">{order.car_color}</p>
            </div>
          )}
          {order.price && (
            <div>
              <p className="text-gray-400 text-xs mb-0.5">Cena</p>
              <p className="text-gray-700 text-sm font-medium">
                {new Intl.NumberFormat('cs-CZ', { style: 'currency', currency: 'CZK', maximumFractionDigits: 0 }).format(order.price)}
              </p>
            </div>
          )}
          {order.order_number && (
            <div>
              <p className="text-gray-400 text-xs mb-0.5">Č. objednávky</p>
              <p className="text-gray-700 text-sm font-medium">{order.order_number}</p>
            </div>
          )}
          <div>
            <p className="text-gray-400 text-xs mb-0.5">Datum</p>
            <p className="text-gray-700 text-sm font-medium">
              {new Date(order.created_at).toLocaleDateString('cs-CZ')}
            </p>
          </div>
        </div>

        {/* Timeline */}
        <StatusTimeline status={order.status} />

        {/* Platby */}
        {order.price && (
          <div className="mt-5 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard size={14} className="text-gray-400" />
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Přehled plateb</p>
            </div>
            {(() => {
              const fmt = v => new Intl.NumberFormat('cs-CZ', { style: 'currency', currency: 'CZK', maximumFractionDigits: 0 }).format(v)
              const total = order.price
              const paid = order.deposit_paid ?? 0
              const remaining = total - paid
              const pct = Math.round((paid / total) * 100)
              const isDone = order.status === 'doruceno'
              return (
                <div className="space-y-3">
                  {/* Progress bar */}
                  <div>
                    <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                      <span>Zaplaceno {pct} %</span>
                      <span>{fmt(total)}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${isDone ? 'bg-[#28a745]' : 'bg-blue-500'}`}
                        style={{ width: `${isDone ? 100 : pct}%` }}
                      />
                    </div>
                  </div>
                  {/* Řádky */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className={`rounded-xl px-4 py-3 ${paid > 0 ? 'bg-green-50 border border-green-100' : 'bg-gray-50 border border-gray-100'}`}>
                      <p className="text-xs text-gray-400 mb-0.5">Záloha zaplacena</p>
                      <p className={`text-sm font-black ${paid > 0 ? 'text-[#28a745]' : 'text-gray-400'}`}>
                        {paid > 0 ? fmt(paid) : '—'}
                      </p>
                      {paid > 0 && <p className="text-[10px] text-green-600 mt-0.5">✓ Uhrazeno</p>}
                    </div>
                    <div className={`rounded-xl px-4 py-3 ${isDone ? 'bg-green-50 border border-green-100' : remaining > 0 ? 'bg-orange-50 border border-orange-100' : 'bg-gray-50 border border-gray-100'}`}>
                      <p className="text-xs text-gray-400 mb-0.5">Zbývá doplatit</p>
                      <p className={`text-sm font-black ${isDone ? 'text-[#28a745]' : remaining > 0 ? 'text-orange-600' : 'text-gray-400'}`}>
                        {isDone ? fmt(0) : fmt(remaining)}
                      </p>
                      {isDone
                        ? <p className="text-[10px] text-green-600 mt-0.5">✓ Vše uhrazeno</p>
                        : null
                      }
                    </div>
                  </div>
                </div>
              )
            })()}
          </div>
        )}

        {/* Expandable detail */}
        {hasExpandable && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <button
              onClick={() => setExpanded(v => !v)}
              className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors w-full text-left"
            >
              <ChevronDown
                size={16}
                className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
              />
              {expanded ? 'Skrýt podrobnosti' : 'Podrobnosti vozu'}
            </button>

            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <CarDetailPanel carData={carData} order={order} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default function KlientskeCentrum() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchOrders() {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        setError('Nepodařilo se načíst objednávky.')
      } else {
        setOrders(data ?? [])
      }
      setLoading(false)
    }

    fetchOrders()
  }, [user.id])

  const handleSignOut = async () => {
    await signOut()
    navigate('/klientske-centrum/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/">
              <img src="/logo.webp" alt="Nejlevnější Škoda" className="h-5 sm:h-7" />
            </a>
            <ChevronRight size={14} className="text-gray-300" />
            <span className="text-gray-600 text-sm font-semibold">Klientské centrum</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-400 text-sm hidden sm:block">{user.email}</span>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 text-gray-400 hover:text-gray-700 text-sm font-medium transition-colors"
            >
              <LogOut size={15} />
              <span className="hidden sm:inline">Odhlásit</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <p className="text-[#28a745] text-xs font-bold uppercase tracking-widest mb-2">Vítejte zpět</p>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900">Vaše objednávky</h1>
          <p className="text-gray-500 mt-2 text-sm">Přehled zakoupených vozidel a stav jejich vyřízení.</p>
        </motion.div>

        {/* Stats */}
        {!loading && orders.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8"
          >
            {[
              { label: 'Celkem objednávek', value: orders.length },
              { label: 'Doručeno', value: orders.filter(o => o.status === 'doruceno').length },
              { label: 'Ve zpracování', value: orders.filter(o => o.status !== 'doruceno').length },
              {
                label: 'Celková hodnota',
                value: new Intl.NumberFormat('cs-CZ', { style: 'currency', currency: 'CZK', maximumFractionDigits: 0 })
                  .format(orders.reduce((sum, o) => sum + (o.price ?? 0), 0)),
                small: true,
              },
            ].map(stat => (
              <div key={stat.label} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                <p className="text-gray-400 text-xs mb-1">{stat.label}</p>
                <p className={`text-gray-900 font-black ${stat.small ? 'text-lg' : 'text-2xl'}`}>{stat.value}</p>
              </div>
            ))}
          </motion.div>
        )}

        {/* Obsah */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-2 border-[#28a745] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-5 py-4">
            <AlertCircle size={18} className="text-red-500 shrink-0" />
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        ) : orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24"
          >
            <div className="w-16 h-16 bg-gray-100 border border-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Car size={28} className="text-gray-400" />
            </div>
            <h3 className="text-gray-900 font-bold text-lg mb-2">Zatím žádné objednávky</h3>
            <p className="text-gray-500 text-sm mb-6">Jakmile dokončíte objednávku, objeví se zde.</p>
            <a
              href="/vozy"
              className="inline-flex items-center gap-2 bg-[#1e7e34] hover:bg-[#28a745] text-white font-bold px-5 py-2.5 rounded-lg text-sm transition-colors"
            >
              <Car size={15} />
              Prohlédnout vozy
            </a>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, i) => (
              <OrderCard key={order.id} order={order} index={i} />
            ))}
          </div>
        )}

        {/* Nápověda */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-10 bg-white border border-gray-200 rounded-xl px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between shadow-sm"
        >
          <div>
            <p className="text-gray-800 font-semibold text-sm mb-0.5">Máte otázku k objednávce?</p>
            <p className="text-gray-400 text-xs">Náš tým vám rád pomůže s jakýmkoli dotazem.</p>
          </div>
          <a
            href="/kontakt"
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm px-4 py-2.5 rounded-lg transition-colors shrink-0"
          >
            <MessageCircle size={14} />
            Kontaktovat nás
          </a>
        </motion.div>
      </main>
    </div>
  )
}
