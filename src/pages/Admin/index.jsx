import { useState, useEffect } from 'react'
import { useAdminAuth } from '../../context/AdminAuthContext'
import { useNavigate } from 'react-router-dom'
import { supabaseAdmin as supabase } from '../../lib/supabaseAdmin'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LogOut, ShieldCheck, ShoppingBag, Users, RefreshCw, AlertCircle, Package,
  UserPlus, X, Lock, Eye, EyeOff, CheckCircle2, Car, MapPin, CreditCard,
  Truck, Tag, Heart, FileText, Phone, Mail, Building2, Hash, Plus
} from 'lucide-react'

const STATUS_LABELS = {
  prijato:             { label: 'Přijato',              color: 'bg-blue-500/15 text-blue-400 border-blue-500/20' },
  zpracovava_se:       { label: 'Zpracovává se',        color: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20' },
  potvrzeno_dealerem:  { label: 'Potvrzeno dealerem',  color: 'bg-purple-500/15 text-purple-400 border-purple-500/20' },
  na_ceste:            { label: 'Na cestě',              color: 'bg-orange-500/15 text-orange-400 border-orange-500/20' },
  prihlasovani:        { label: 'Přihlašování',         color: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20' },
  dorucovani:          { label: 'Doručování',            color: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/20' },
  doruceno:            { label: 'Doručeno',              color: 'bg-green-500/15 text-green-400 border-green-500/20' },
}

function formatPrice(p) {
  return new Intl.NumberFormat('cs-CZ', { style: 'currency', currency: 'CZK', maximumFractionDigits: 0 }).format(p)
}

function formatDate(d) {
  return new Date(d).toLocaleDateString('cs-CZ', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function StatusBadge({ status }) {
  const s = STATUS_LABELS[status] || { label: status, color: 'bg-gray-500/15 text-gray-400 border-gray-500/20' }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${s.color}`}>
      {s.label}
    </span>
  )
}

function TabButton({ active, onClick, icon: Icon, label, count }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
        active
          ? 'border-[#28a745] text-white'
          : 'border-transparent text-gray-500 hover:text-gray-300'
      }`}
    >
      <Icon size={15} />
      {label}
      {count > 0 && (
        <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${active ? 'bg-[#28a745]/20 text-[#28a745]' : 'bg-[#30363d] text-gray-500'}`}>
          {count}
        </span>
      )}
    </button>
  )
}

function groupOrders(orders) {
  const map = {}
  orders.forEach(o => {
    const key = o.order_number || o.id
    if (!map[key]) {
      map[key] = { ...o, cars: [], totalPrice: 0 }
    }
    map[key].cars.push({
      name: o.car_name, variant: o.car_variant, color: o.car_color,
      qty: o.qty, price: o.price, price_original: o.price_original,
      price_final: o.price_final, internal_id: o.internal_id, is_used: o.is_used,
    })
    map[key].totalPrice += (o.price || 0)
  })
  return Object.values(map).sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
}

// ——— Objednávky ———
function OrdersTab({ orders, loading, error, onAcknowledge }) {
  const navigate = useNavigate()

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorBox message={error} />

  const grouped = groupOrders(orders)

  return (
    <>
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#30363d]">
        <span className="text-xs text-gray-500">{grouped.length} objednávek</span>
        <button
          onClick={() => navigate('/admin/nova-objednavka')}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#28a745] border border-[#28a745]/40 hover:bg-[#28a745]/10 px-3 py-1.5 rounded-lg transition-colors"
        >
          <Plus size={13} />
          Nová objednávka
        </button>
      </div>
      {grouped.length === 0 && <Empty label="Žádné objednávky" />}
      <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#30363d]">
            {['Objednávka', 'Zákazník', 'Vozy', 'Celkem', 'Status', 'Datum', ''].map(h => (
              <th key={h} className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#21262d]">
          {grouped.map(o => {
            const isNew = !o.acknowledged
            return (
              <motion.tr
                key={o.order_number || o.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => navigate(`/admin/objednavky/${encodeURIComponent(o.order_number || o.id)}`)}
                className={`cursor-pointer transition-colors ${isNew ? 'bg-[#28a745]/5 hover:bg-[#28a745]/10' : 'hover:bg-[#161b22]'}`}
              >
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    {isNew && <span className="w-2 h-2 rounded-full bg-[#28a745] shrink-0 animate-pulse" />}
                    <span className="font-mono text-xs text-gray-400">{o.order_number || '—'}</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-white text-xs">{o.email}</div>
                  {(o.first_name || o.last_name) && (
                    <div className="text-gray-500 text-xs">{o.first_name} {o.last_name}</div>
                  )}
                  {o.company_name && (
                    <div className="text-gray-500 text-xs">{o.company_name}</div>
                  )}
                </td>
                <td className="px-4 py-4">
                  {o.cars.map((c, i) => (
                    <div key={i} className={i > 0 ? 'mt-1.5 pt-1.5 border-t border-[#21262d]' : ''}>
                      <div className="text-white font-semibold text-xs">
                        {c.qty > 1 && <span className="text-gray-500 mr-1">{c.qty}×</span>}
                        {c.name}
                      </div>
                      <div className="text-gray-500 text-xs">{c.variant}</div>
                    </div>
                  ))}
                </td>
                <td className="px-4 py-4">
                  <span className="text-[#28a745] font-bold text-xs">{o.totalPrice ? formatPrice(o.totalPrice) : '—'}</span>
                </td>
                <td className="px-4 py-4">
                  <StatusBadge status={o.status} />
                </td>
                <td className="px-4 py-4">
                  <span className="text-gray-500 text-xs">{formatDate(o.created_at)}</span>
                </td>
                <td className="px-4 py-4" onClick={e => e.stopPropagation()}>
                  {isNew && (
                    <button
                      onClick={() => onAcknowledge(o.order_number || o.id)}
                      className="text-xs font-semibold text-[#28a745] border border-[#28a745]/40 hover:bg-[#28a745]/10 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
                    >
                      Přijmout
                    </button>
                  )}
                </td>
              </motion.tr>
            )
          })}
        </tbody>
      </table>
      </div>
    </>
  )
}

// ——— Modal pro vytvoření účtu ———
function CreateAccountModal({ customer, onClose, onSuccess }) {
  const { user } = useAdminAuth()
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (password.length < 6) { setError('Heslo musí mít alespoň 6 znaků'); return }
    setLoading(true)
    setError('')

    const { data: { session } } = await supabase.auth.getSession()
    const token = session?.access_token
    if (!token) { setError('Nepodařilo se ověřit admin session'); setLoading(false); return }

    const res = await fetch('/api/admin-create-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ email: customer.email, password }),
    })
    const data = await res.json()

    if (!res.ok) { setError(data.error || 'Chyba serveru'); setLoading(false); return }

    onSuccess(customer.email, data.userId)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-sm bg-[#161b22] border border-[#30363d] rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-black text-white text-base">Založit klientský účet</h3>
            <p className="text-gray-500 text-xs mt-0.5">{customer.email}</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Heslo pro zákazníka</label>
            <div className="relative">
              <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Min. 6 znaků"
                required
                className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg pl-10 pr-10 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#28a745] transition-colors"
              />
              <button type="button" onClick={() => setShowPassword(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-900/20 border border-red-800/40 rounded-lg px-3 py-2.5">
              <AlertCircle size={13} className="text-red-400 shrink-0" />
              <p className="text-red-400 text-xs">{error}</p>
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 text-sm text-gray-400 hover:text-white border border-[#30363d] hover:border-gray-500 py-2.5 rounded-lg transition-colors">
              Zrušit
            </button>
            <button type="submit" disabled={loading} className="flex-1 flex items-center justify-center gap-2 bg-[#1e7e34] hover:bg-[#28a745] disabled:opacity-50 text-white font-bold text-sm py-2.5 rounded-lg transition-colors">
              {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Vytvořit účet'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

// ——— Zákazníci ———
function CustomersTab({ customers, orders, loading, error, onAccountCreated }) {
  const [modal, setModal] = useState(null)

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorBox message={error} />
  if (customers.length === 0) return <Empty label="Žádní zákazníci" />

  const enriched = customers.map(c => {
    const cOrders = orders.filter(o => o.email === c.email)
    const total = cOrders.reduce((s, o) => s + (o.price || 0), 0)
    const lastOrder = [...cOrders].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0]
    return { ...c, orderCount: cOrders.length, total, lastOrder }
  })

  return (
    <>
      {modal && (
        <CreateAccountModal
          customer={modal}
          onClose={() => setModal(null)}
          onSuccess={onAccountCreated}
        />
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#30363d]">
              {['E-mail', 'Objednávek', 'Celkem utraceno', 'Poslední status', 'Zákazník od', 'Účet'].map(h => (
                <th key={h} className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#21262d]">
            {enriched.map(c => (
              <motion.tr
                key={c.email}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="hover:bg-[#161b22] transition-colors"
              >
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-[#1e7e34]/20 border border-[#1e7e34]/30 flex items-center justify-center shrink-0">
                      <span className="text-[#28a745] text-xs font-black">{c.email[0].toUpperCase()}</span>
                    </div>
                    <span className="text-white text-xs font-medium">{c.email}</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className="text-gray-300 font-semibold">{c.orderCount}</span>
                </td>
                <td className="px-4 py-4">
                  <span className="text-[#28a745] font-bold text-xs">{c.total > 0 ? formatPrice(c.total) : '—'}</span>
                </td>
                <td className="px-4 py-4">
                  {c.lastOrder ? <StatusBadge status={c.lastOrder.status} /> : '—'}
                </td>
                <td className="px-4 py-4">
                  <span className="text-gray-500 text-xs">{formatDate(c.created_at)}</span>
                </td>
                <td className="px-4 py-4">
                  {c.auth_user_id ? (
                    <span className="flex items-center gap-1.5 text-xs text-[#28a745]">
                      <CheckCircle2 size={13} />
                      Má účet
                    </span>
                  ) : (
                    <button
                      onClick={() => setModal(c)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-white border border-[#30363d] hover:border-gray-500 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
                    >
                      <UserPlus size={12} />
                      Založit účet
                    </button>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-7 h-7 border-2 border-[#28a745] border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

function ErrorBox({ message }) {
  return (
    <div className="flex items-center gap-3 bg-red-900/20 border border-red-800/40 rounded-xl px-5 py-4 m-4">
      <AlertCircle size={16} className="text-red-400 shrink-0" />
      <p className="text-red-400 text-sm">{message}</p>
    </div>
  )
}

function Empty({ label }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-gray-600">
      <Package size={32} className="mb-3 opacity-40" />
      <p className="text-sm">{label}</p>
    </div>
  )
}

export default function AdminPanel() {
  const { user, signOut } = useAdminAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('orders')
  const [orders, setOrders] = useState([])
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function fetchData() {
    setLoading(true)
    setError('')

    const [ordersRes, customersRes] = await Promise.all([
      supabase.from('orders').select('*').eq('is_new', true).order('created_at', { ascending: false }),
      supabase.from('customers').select('*').eq('is_new', true).order('created_at', { ascending: false }),
    ])

    if (ordersRes.error) setError('Chyba při načítání objednávek: ' + ordersRes.error.message)
    else setOrders(ordersRes.data || [])

    if (customersRes.error) setError(e => e + (e ? ' | ' : '') + 'Chyba zákazníci: ' + customersRes.error.message)
    else setCustomers(customersRes.data || [])

    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  function handleAccountCreated(email, userId) {
    setCustomers(prev => prev.map(c => c.email === email ? { ...c, auth_user_id: userId } : c))
  }

  async function handleAcknowledge(orderNumber) {
    await supabase
      .from('orders')
      .update({ acknowledged: true })
      .eq('order_number', orderNumber)
    setOrders(prev => prev.map(o =>
      (o.order_number || o.id) === orderNumber ? { ...o, acknowledged: true } : o
    ))
  }

  async function handleSignOut() {
    await signOut()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-[#0d1117] text-white">
      <header className="border-b border-[#30363d] bg-[#161b22] sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldCheck size={18} className="text-[#28a745]" />
            <span className="font-black text-sm tracking-tight">Admin Panel</span>
            <span className="text-[#30363d]">/</span>
            <span className="text-gray-500 text-sm">nejlevnejsi-skoda.cz</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={fetchData} className="flex items-center gap-1.5 text-gray-500 hover:text-white text-xs transition-colors">
              <RefreshCw size={13} />
              Obnovit
            </button>
            <span className="text-[#30363d]">|</span>
            <span className="text-gray-500 text-xs">{user?.email}</span>
            <button onClick={handleSignOut} className="flex items-center gap-1.5 text-gray-400 hover:text-white text-xs transition-colors">
              <LogOut size={14} />
              Odhlásit
            </button>
          </div>
        </div>
      </header>

      <div className="border-b border-[#30363d] bg-[#161b22]/50">
        <div className="max-w-7xl mx-auto px-6 flex gap-1">
          <TabButton active={tab === 'orders'} onClick={() => setTab('orders')} icon={ShoppingBag} label="Objednávky" count={groupOrders(orders).length} />
          <TabButton active={tab === 'customers'} onClick={() => setTab('customers')} icon={Users} label="Zákazníci" count={customers.length} />
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-6">
        <div className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden">
          {tab === 'orders' && <OrdersTab orders={orders} loading={loading} error={error} onAcknowledge={handleAcknowledge} />}
          {tab === 'customers' && <CustomersTab customers={customers} orders={orders} loading={loading} error={error} onAccountCreated={handleAccountCreated} />}
        </div>
      </main>
    </div>
  )
}
