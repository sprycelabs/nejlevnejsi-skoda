import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabaseAdmin as supabase } from '../../lib/supabaseAdmin'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, Mail, Phone, MapPin, Building2, Hash,
  Users, CreditCard, Truck, Tag, Heart, FileText, AlertCircle, Download, Loader2, Check,
  SendHorizonal, Pencil, X, Save
} from 'lucide-react'

const STATUSES = [
  { key: 'prijato',            label: 'Přijato',             color: 'bg-blue-500/15 text-blue-400 border-blue-500/20',     activeRing: 'ring-blue-500' },
  { key: 'zpracovava_se',      label: 'Zpracovává se',       color: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20', activeRing: 'ring-yellow-500' },
  { key: 'potvrzeno_dealerem', label: 'Potvrzeno dealerem',  color: 'bg-purple-500/15 text-purple-400 border-purple-500/20', activeRing: 'ring-purple-500' },
  { key: 'na_ceste',           label: 'Na cestě',             color: 'bg-orange-500/15 text-orange-400 border-orange-500/20', activeRing: 'ring-orange-500' },
  { key: 'prihlasovani',       label: 'Přihlašování',        color: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20',     activeRing: 'ring-cyan-500' },
  { key: 'dorucovani',         label: 'Doručování',           color: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/20', activeRing: 'ring-indigo-500' },
  { key: 'doruceno',           label: 'Doručeno',             color: 'bg-green-500/15 text-green-400 border-green-500/20',  activeRing: 'ring-green-500' },
]

const STATUS_MAP = Object.fromEntries(STATUSES.map(s => [s.key, s]))

function formatPrice(p) {
  return new Intl.NumberFormat('cs-CZ', { style: 'currency', currency: 'CZK', maximumFractionDigits: 0 }).format(p)
}

function formatDate(d) {
  return new Date(d).toLocaleDateString('cs-CZ', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function StatusBadge({ status }) {
  const s = STATUS_MAP[status] || { label: status, color: 'bg-gray-500/15 text-gray-400 border-gray-500/20' }
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${s.color}`}>
      {s.label}
    </span>
  )
}

function Row({ icon: Icon, label, value }) {
  if (!value) return null
  return (
    <div className="flex items-start gap-3">
      <Icon size={15} className="text-gray-600 mt-0.5 shrink-0" />
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm text-white font-medium">{value}</p>
      </div>
    </div>
  )
}

function Section({ title, children, action }) {
  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{title}</p>
        {action}
      </div>
      {children}
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">{label}</label>
      {children}
    </div>
  )
}

function Input({ value, onChange, placeholder, type = 'text' }) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#28a745] transition-colors"
    />
  )
}

function Textarea({ value, onChange, placeholder, rows = 3 }) {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#28a745] transition-colors resize-none"
    />
  )
}

export default function AdminOrderDetail() {
  const { orderNumber } = useParams()
  const navigate = useNavigate()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [invoiceLoading, setInvoiceLoading] = useState(false)
  const [currentStatus, setCurrentStatus] = useState(null)
  const [statusSaving, setStatusSaving] = useState(false)
  const [emailToast, setEmailToast] = useState('')
  const [editing, setEditing] = useState(false)
  const [editData, setEditData] = useState({})
  const [savingEdit, setSavingEdit] = useState(false)
  const [saveError, setSaveError] = useState('')

  function set(field) {
    return val => setEditData(prev => ({ ...prev, [field]: val }))
  }

  function startEdit() {
    const o = rows[0]
    setEditData({
      email:          o.email || '',
      first_name:     o.first_name || '',
      last_name:      o.last_name || '',
      company_name:   o.company_name || '',
      ico:            o.ico || '',
      dic:            o.dic || '',
      contact_person: o.contact_person || '',
      phone:          o.phone || '',
      street:         o.street || '',
      city:           o.city || '',
      zip:            o.zip || '',
      notes:          o.notes || '',
      admin_note:     o.admin_note || '',
      payment_method: o.payment_method || '',
      delivery:       o.delivery || false,
    })
    setSaveError('')
    setEditing(true)
  }

  async function saveEdit() {
    setSavingEdit(true)
    setSaveError('')
    const { error: err } = await supabase
      .from('orders')
      .update(editData)
      .eq('order_number', decodeURIComponent(orderNumber))
    if (err) {
      setSaveError(err.message)
    } else {
      setRows(prev => prev.map(r => ({ ...r, ...editData })))
      setEditing(false)
    }
    setSavingEdit(false)
  }

  async function updateStatus(newStatus) {
    if (newStatus === currentStatus || statusSaving) return
    setStatusSaving(true)
    const { error: err } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('order_number', decodeURIComponent(orderNumber))
    if (!err) {
      setCurrentStatus(newStatus)
      sendStatusEmail(newStatus)
    }
    setStatusSaving(false)
  }

  async function sendStatusEmail(status) {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const res = await fetch('/api/admin-status-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ orderNumber: decodeURIComponent(orderNumber), status }),
      })
      const json = await res.json()
      if (json.success) {
        setEmailToast('Email zákazníkovi odeslán')
        setTimeout(() => setEmailToast(''), 3500)
      }
    } catch (e) {
      console.error('Status email failed:', e)
    }
  }

  async function downloadInvoice(path) {
    setInvoiceLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const res = await fetch('/api/admin-invoice-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ path }),
      })
      const json = await res.json()
      if (json.url) window.open(json.url, '_blank')
    } catch (e) {
      console.error('Invoice download failed:', e)
    } finally {
      setInvoiceLoading(false)
    }
  }

  useEffect(() => {
    async function fetchOrder() {
      const { data, error: err } = await supabase
        .from('orders')
        .select('*')
        .eq('order_number', decodeURIComponent(orderNumber))
      if (err) setError(err.message)
      else {
        setRows(data || [])
        if (data?.length > 0) setCurrentStatus(data[0].status)
      }
      setLoading(false)
    }
    fetchOrder()
  }, [orderNumber])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
        <div className="w-7 h-7 border-2 border-[#28a745] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error || rows.length === 0) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
        <div className="flex items-center gap-3 text-red-400">
          <AlertCircle size={18} />
          <p>{error || 'Objednávka nenalezena'}</p>
        </div>
      </div>
    )
  }

  const o = rows[0]
  const isCompany = o.customer_type === 'firma'
  const totalPrice = rows.reduce((s, r) => s + (r.price || 0), 0)
  const finalPrice = rows.reduce((s, r) => s + (r.price_final || r.price || 0), 0)

  return (
    <div className="min-h-screen bg-[#0d1117] text-white">
      <header className="border-b border-[#30363d] bg-[#161b22] sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center gap-4">
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
          >
            <ArrowLeft size={16} />
            Zpět
          </button>
          <span className="text-[#30363d]">|</span>
          <span className="text-sm font-bold">Admin Panel</span>
        </div>
      </header>

      <AnimatePresence>
        {emailToast && (
          <motion.div
            key="email-toast"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="fixed top-16 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 bg-[#1a2e1d] border border-[#28a745]/40 text-[#28a745] text-sm font-semibold px-5 py-3 rounded-full shadow-xl"
          >
            <SendHorizonal size={14} />
            {emailToast}
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        {/* Hlavička */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-gray-500 text-sm font-mono mb-1">{o.order_number}</p>
            <h1 className="text-2xl font-black text-white">{formatDate(o.created_at)}</h1>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={currentStatus || o.status} />
            {!editing && (
              <button
                onClick={startEdit}
                className="flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold border border-[#30363d] text-gray-300 hover:text-white hover:border-gray-500 transition-colors"
              >
                <Pencil size={14} />
                Upravit
              </button>
            )}
            {o.invoice_path && (
              <button
                onClick={() => downloadInvoice(o.invoice_path)}
                disabled={invoiceLoading}
                className="flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold border border-[#30363d] text-gray-300 hover:text-white hover:border-gray-500 transition-colors disabled:opacity-50"
              >
                {invoiceLoading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                Faktura
              </button>
            )}
          </div>
        </motion.div>

        {/* Edit form */}
        <AnimatePresence>
          {editing && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="bg-[#161b22] border border-[#28a745]/30 rounded-xl p-6 space-y-6"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-[#28a745] uppercase tracking-widest">Úprava objednávky</p>
                <button onClick={() => setEditing(false)} className="text-gray-500 hover:text-white transition-colors">
                  <X size={16} />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Zákazník */}
                <div className="space-y-4">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Zákazník</p>
                  <Field label="E-mail">
                    <Input value={editData.email} onChange={set('email')} placeholder="email@example.cz" type="email" />
                  </Field>
                  {isCompany ? (
                    <>
                      <Field label="Název firmy">
                        <Input value={editData.company_name} onChange={set('company_name')} />
                      </Field>
                      <div className="grid grid-cols-2 gap-3">
                        <Field label="IČO">
                          <Input value={editData.ico} onChange={set('ico')} />
                        </Field>
                        <Field label="DIČ">
                          <Input value={editData.dic} onChange={set('dic')} />
                        </Field>
                      </div>
                      <Field label="Kontaktní osoba">
                        <Input value={editData.contact_person} onChange={set('contact_person')} />
                      </Field>
                    </>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Jméno">
                        <Input value={editData.first_name} onChange={set('first_name')} />
                      </Field>
                      <Field label="Příjmení">
                        <Input value={editData.last_name} onChange={set('last_name')} />
                      </Field>
                    </div>
                  )}
                  <Field label="Telefon">
                    <Input value={editData.phone} onChange={set('phone')} placeholder="+420 000 000 000" type="tel" />
                  </Field>
                  <Field label="Ulice">
                    <Input value={editData.street} onChange={set('street')} />
                  </Field>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="PSČ">
                      <Input value={editData.zip} onChange={set('zip')} />
                    </Field>
                    <Field label="Město">
                      <Input value={editData.city} onChange={set('city')} />
                    </Field>
                  </div>
                </div>

                {/* Platba & ostatní */}
                <div className="space-y-4">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Platba & ostatní</p>
                  <Field label="Způsob platby">
                    <select
                      value={editData.payment_method}
                      onChange={e => set('payment_method')(e.target.value)}
                      className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#28a745] transition-colors"
                    >
                      <option value="osobne">Platba osobně (hotovost / karta)</option>
                      <option value="prevod">Platba převodem</option>
                    </select>
                  </Field>
                  <Field label="Doprava">
                    <button
                      type="button"
                      onClick={() => set('delivery')(!editData.delivery)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-semibold transition-colors ${
                        editData.delivery
                          ? 'bg-[#28a745]/15 border-[#28a745]/40 text-[#28a745]'
                          : 'bg-transparent border-[#30363d] text-gray-400'
                      }`}
                    >
                      <Truck size={14} />
                      {editData.delivery ? 'Ano — zákazník chce dopravu' : 'Ne — osobní odběr'}
                    </button>
                  </Field>
                  <Field label="Poznámka zákazníka">
                    <Textarea value={editData.notes} onChange={set('notes')} placeholder="Poznámka od zákazníka…" />
                  </Field>
                  <Field label="Interní poznámka (jen pro admina)">
                    <Textarea value={editData.admin_note} onChange={set('admin_note')} placeholder="Interní poznámka…" />
                  </Field>
                </div>
              </div>

              {saveError && (
                <div className="flex items-center gap-2 bg-red-900/20 border border-red-800/40 rounded-lg px-4 py-3">
                  <AlertCircle size={14} className="text-red-400 shrink-0" />
                  <p className="text-red-400 text-sm">{saveError}</p>
                </div>
              )}

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setEditing(false)}
                  className="px-5 py-2 text-sm text-gray-400 hover:text-white border border-[#30363d] hover:border-gray-500 rounded-lg transition-colors"
                >
                  Zrušit
                </button>
                <button
                  onClick={saveEdit}
                  disabled={savingEdit}
                  className="flex items-center gap-2 px-5 py-2 text-sm font-bold bg-[#1e7e34] hover:bg-[#28a745] disabled:opacity-50 text-white rounded-lg transition-colors"
                >
                  {savingEdit ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  Uložit změny
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Zákazník */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <Section title="Zákazník">
              <Row icon={Mail} label="E-mail" value={o.email} />
              {isCompany ? (
                <>
                  <Row icon={Building2} label="Firma" value={o.company_name} />
                  <Row icon={Hash} label="IČO" value={o.ico} />
                  <Row icon={Hash} label="DIČ" value={o.dic} />
                  <Row icon={Users} label="Kontaktní osoba" value={o.contact_person} />
                </>
              ) : (
                <Row icon={Users} label="Jméno" value={[o.first_name, o.last_name].filter(Boolean).join(' ')} />
              )}
              <Row icon={Phone} label="Telefon" value={o.phone} />
              <Row icon={MapPin} label="Adresa" value={[o.street, o.zip, o.city].filter(Boolean).join(', ')} />
            </Section>
          </motion.div>

          {/* Platba & doprava */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Section title="Platba & doprava">
              <Row
                icon={CreditCard}
                label="Způsob platby"
                value={o.payment_method === 'osobne' ? 'Platba osobně (hotovost / karta)' : o.payment_method === 'prevod' ? 'Platba převodem' : o.payment_method}
              />
              <Row icon={Truck} label="Doprava" value={o.delivery ? 'Ano — zákazník chce dopravu' : 'Ne — osobní odběr'} />
              {o.charity && <Row icon={Heart} label="Charita" value={o.charity} />}
              {o.notes && <Row icon={FileText} label="Poznámka zákazníka" value={o.notes} />}
            </Section>
          </motion.div>
        </div>

        {/* Vozy */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Section title="Vozy">
            <div className="space-y-3">
              {rows.map(r => (
                <div key={r.id} className="bg-[#0d1117] rounded-xl p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <p className="text-white font-black text-base">
                        {r.qty > 1 && <span className="text-gray-500 mr-2 font-normal">{r.qty}×</span>}
                        {r.car_name}
                      </p>
                      <p className="text-gray-400 text-sm">{r.car_variant}</p>
                      {r.car_color && <p className="text-gray-600 text-xs mt-0.5">{r.car_color}</p>}
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full border shrink-0 ${r.is_used ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                      {r.is_used ? 'Ojetý' : 'Nový'}
                    </span>
                  </div>
                  {r.internal_id && <p className="text-gray-600 text-xs font-mono mb-3">{r.internal_id}</p>}
                  <div className="border-t border-[#30363d] pt-3">
                    <p className="text-xs text-gray-500 mb-0.5">Cena vozu</p>
                    <p className="text-white font-bold text-sm">{formatPrice(r.price_original || r.price)}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </motion.div>

        {/* Souhrn cen */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Section title="Souhrn cen">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Celková cena vozů</span>
                <span className="text-white font-bold">{formatPrice(totalPrice)}</span>
              </div>
              {o.discount_code && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm flex items-center gap-2">
                    <Tag size={13} />
                    Slevový kód <span className="font-mono text-gray-300 ml-1">{o.discount_code}</span>
                  </span>
                  <span className="text-red-400 font-bold">−{formatPrice(o.discount_amount)}</span>
                </div>
              )}
              <div className="flex justify-between items-center border-t border-[#30363d] pt-3">
                <span className="text-white font-bold">Celkem k úhradě</span>
                <span className="text-white font-black text-lg">{formatPrice(finalPrice)}</span>
              </div>
              <div className="flex justify-between items-center bg-[#28a745]/10 border border-[#28a745]/20 rounded-lg px-4 py-3">
                <span className="text-[#28a745] font-semibold text-sm">Záloha (20 %)</span>
                <span className="text-[#28a745] font-black">{formatPrice(o.deposit_paid)}</span>
              </div>
            </div>
          </Section>
        </motion.div>

        {/* Stav objednávky */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Stav objednávky</p>
              {statusSaving && <Loader2 size={14} className="text-gray-500 animate-spin" />}
            </div>
            <div className="flex flex-wrap gap-2">
              {STATUSES.map(s => {
                const isActive = currentStatus === s.key
                return (
                  <button
                    key={s.key}
                    onClick={() => updateStatus(s.key)}
                    disabled={statusSaving}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition-all
                      ${isActive
                        ? `${s.color} ring-2 ${s.activeRing} ring-offset-1 ring-offset-[#161b22]`
                        : 'bg-transparent text-gray-500 border-[#30363d] hover:border-gray-500 hover:text-gray-300'
                      }
                      disabled:opacity-50 disabled:cursor-not-allowed
                    `}
                  >
                    {isActive && <Check size={12} />}
                    {s.label}
                  </button>
                )
              })}
            </div>
          </div>
        </motion.div>

        {o.admin_note && !editing && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Section title="Interní poznámka">
              <p className="text-gray-300 text-sm leading-relaxed">{o.admin_note}</p>
            </Section>
          </motion.div>
        )}
      </main>
    </div>
  )
}
