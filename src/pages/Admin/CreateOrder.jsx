import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Plus, Trash2, AlertCircle, Loader2, Check, Tag, BadgePercent, Banknote } from 'lucide-react'
import { supabaseAdmin as supabase } from '../../lib/supabaseAdmin'
import { cars, ojeteVozy, formatPrice } from '../../data/cars'
import { applyDiscount } from '../../data/discountCodes'

async function callAdminCreateOrder(payload, token) {
  const res = await fetch('/api/admin-create-order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })
  return res.json()
}

const PROFORMA_DEPOSIT_PCT = 0.20  // jen pro shrnutí v UI

const STATUSES = [
  { key: 'prijato',            label: 'Přijato' },
  { key: 'zpracovava_se',      label: 'Zpracovává se' },
  { key: 'potvrzeno_dealerem', label: 'Potvrzeno dealerem' },
  { key: 'na_ceste',           label: 'Na cestě' },
  { key: 'prihlasovani',       label: 'Přihlašování' },
  { key: 'dorucovani',         label: 'Doručování' },
  { key: 'doruceno',           label: 'Doručeno' },
]

function emptyCarRow() {
  return { carSlug: '', price: '', qty: 1 }
}

function Field({ label, type = 'text', value, onChange, placeholder }) {
  return (
    <div>
      <label className="text-xs text-gray-500 mb-1.5 block">{label}</label>
      <input
        type={type} value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#28a745] transition-colors"
      />
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 space-y-4">
      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{title}</p>
      {children}
    </div>
  )
}

export default function AdminCreateOrder() {
  const navigate = useNavigate()
  const allCars = [...cars, ...ojeteVozy]

  // Zákazník
  const [customerType, setCustomerType] = useState('fyzicka')
  const [form, setForm] = useState({
    email: '', firstName: '', lastName: '',
    companyName: '', ico: '', dic: '', contactPerson: '',
    phone: '', street: '', city: '', zip: '',
    notes: '', paymentMethod: 'prevod', delivery: false,
    charity: '', status: 'prijato',
  })

  // Vozy
  const [carRows, setCarRows] = useState([emptyCarRow()])

  // Slevový kód
  const [codeInput, setCodeInput] = useState('')
  const [appliedCode, setAppliedCode] = useState(null) // { code, amount }
  const [codeError, setCodeError] = useState('')

  // Manuální sleva
  const [manualDiscount, setManualDiscount] = useState({ label: '', type: 'fixed', value: '' })

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function setField(key, value) {
    setForm(f => ({ ...f, [key]: value }))
  }

  function setCarField(idx, key, value) {
    setCarRows(rows => rows.map((r, i) => i === idx ? { ...r, [key]: value } : r))
  }

  function selectCar(idx, slug) {
    const car = allCars.find(c => c.slug === slug)
    setCarRows(rows => rows.map((r, i) =>
      i === idx ? { ...r, carSlug: slug, price: car ? String(car.salePrice) : '' } : r
    ))
  }

  // Výpočty
  const totalBase = carRows.reduce((s, r) => s + (Number(r.price) || 0) * r.qty, 0)

  const codeDiscountAmt = appliedCode?.amount ?? 0

  const manualDiscountAmt = manualDiscount.value
    ? manualDiscount.type === 'percent'
      ? Math.round(totalBase * Number(manualDiscount.value) / 100)
      : Number(manualDiscount.value)
    : 0

  const totalDiscountAmt = codeDiscountAmt + manualDiscountAmt
  const totalFinal = Math.max(0, totalBase - totalDiscountAmt)
  const deposit = Math.round(totalBase * PROFORMA_DEPOSIT_PCT) // vždy z ceny před slevou

  // Ověření kódu
  function verifyCode() {
    setCodeError('')
    if (!codeInput.trim()) return
    const result = applyDiscount(codeInput, totalBase)
    if (!result) {
      setCodeError('Kód nenalezen nebo neplatný')
      setAppliedCode(null)
    } else {
      setAppliedCode({ code: result.code, amount: result.amount })
    }
  }

  function removeCode() {
    setAppliedCode(null)
    setCodeInput('')
    setCodeError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!form.email) return setError('E-mail je povinný')
    if (carRows.some(r => !r.carSlug)) return setError('Vyberte vůz u každého řádku')
    if (carRows.some(r => !r.price)) return setError('Vyplňte cenu u každého vozu')
    if (!form.paymentMethod) return setError('Zvolte způsob platby')

    setSaving(true)

    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.access_token) {
      setError('Nepodařilo se ověřit admin session')
      setSaving(false)
      return
    }

    // Sestavíme items pro API — car.salePrice = admin-nastavená cena
    const items = carRows.map(r => {
      const car = allCars.find(c => c.slug === r.carSlug)
      return {
        car: {
          name:       car?.name || '',
          slug:       car?.slug || null,
          variant:    car?.variant || null,
          color:      car?.color || null,
          internalId: car?.internalId || null,
          isUsed:     car?.isUsed || !!car?.mileage || false,
          mileage:    car?.mileage || null,
          salePrice:  Number(r.price), // admin-nastavená cena
        },
        qty: r.qty,
      }
    })

    const payload = {
      form:           { ...form, notes: form.notes },
      items,
      customerType,
      paymentMethod:  form.paymentMethod,
      discount:       appliedCode || null,
      manualDiscount: manualDiscount.value
        ? { label: manualDiscount.label, type: manualDiscount.type, value: manualDiscount.value, amount: manualDiscountAmt }
        : null,
      charity:        form.charity || null,
      status:         form.status,
    }

    const json = await callAdminCreateOrder(payload, session.access_token)
    setSaving(false)
    if (json.error) { setError(json.error); return }
    navigate('/admin')
  }

  return (
    <div className="min-h-screen bg-[#0d1117] text-white">
      <header className="border-b border-[#30363d] bg-[#161b22] sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center gap-4">
          <button onClick={() => navigate('/admin')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
          >
            <ArrowLeft size={16} />
            Zpět
          </button>
          <span className="text-[#30363d]">|</span>
          <span className="text-sm font-bold">Nová objednávka</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* ——— Vozy ——— */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <Section title="Vozy">
              <div className="space-y-3">
                {carRows.map((row, idx) => (
                  <div key={idx} className="bg-[#0d1117] rounded-xl p-4 space-y-3">
                    <div className="flex items-end gap-3">
                      <div className="flex-1">
                        <label className="text-xs text-gray-500 mb-1.5 block">Vůz</label>
                        <select
                          value={row.carSlug}
                          onChange={e => selectCar(idx, e.target.value)}
                          className="w-full bg-[#161b22] border border-[#30363d] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#28a745] transition-colors"
                        >
                          <option value="">— Vyberte vůz —</option>
                          <optgroup label="Nové vozy">
                            {cars.map(c => (
                              <option key={c.slug} value={c.slug}>
                                {c.name} — {c.variant} — {formatPrice(c.salePrice)}
                              </option>
                            ))}
                          </optgroup>
                          <optgroup label="Ojeté vozy">
                            {ojeteVozy.map(c => (
                              <option key={c.slug} value={c.slug}>
                                {c.name} — {c.variant} — {formatPrice(c.salePrice)}
                              </option>
                            ))}
                          </optgroup>
                        </select>
                      </div>
                      <div className="w-20 shrink-0">
                        <label className="text-xs text-gray-500 mb-1.5 block">Ks</label>
                        <input
                          type="number" min="1" max="99"
                          value={row.qty}
                          onChange={e => setCarField(idx, 'qty', Math.max(1, Number(e.target.value)))}
                          className="w-full bg-[#161b22] border border-[#30363d] rounded-lg px-3 py-2.5 text-white text-sm text-center focus:outline-none focus:border-[#28a745] transition-colors"
                        />
                      </div>
                      {carRows.length > 1 && (
                        <button type="button"
                          onClick={() => setCarRows(rows => rows.filter((_, i) => i !== idx))}
                          className="text-gray-600 hover:text-red-400 transition-colors pb-2.5"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>

                    <div>
                      <label className="text-xs text-gray-500 mb-1.5 block">Cena za ks (Kč)</label>
                      <input
                        type="number" min="0"
                        value={row.price}
                        onChange={e => setCarField(idx, 'price', e.target.value)}
                        placeholder="doplní se z ceníku"
                        className="w-full bg-[#161b22] border border-[#30363d] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#28a745] transition-colors"
                      />
                    </div>
                  </div>
                ))}

                <button type="button"
                  onClick={() => setCarRows(rows => [...rows, emptyCarRow()])}
                  className="flex items-center gap-2 text-sm text-gray-500 hover:text-white border border-dashed border-[#30363d] hover:border-gray-500 rounded-xl px-4 py-3 w-full transition-colors"
                >
                  <Plus size={14} />
                  Přidat další vůz
                </button>
              </div>
            </Section>
          </motion.div>

          {/* ——— Zákazník ——— */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <Section title="Zákazník">
              <div className="flex gap-2">
                {[['fyzicka', 'Fyzická osoba'], ['firma', 'Firma']].map(([k, l]) => (
                  <button key={k} type="button" onClick={() => setCustomerType(k)}
                    className={`flex-1 py-2 rounded-lg text-sm font-semibold border transition-colors ${
                      customerType === k
                        ? 'border-[#28a745] text-[#28a745] bg-[#28a745]/10'
                        : 'border-[#30363d] text-gray-500 hover:text-gray-300'
                    }`}
                  >{l}</button>
                ))}
              </div>

              <Field label="E-mail *" type="email" value={form.email} onChange={v => setField('email', v)} placeholder="zakaznik@email.cz" />

              {customerType === 'fyzicka' ? (
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Jméno" value={form.firstName} onChange={v => setField('firstName', v)} placeholder="Jan" />
                  <Field label="Příjmení" value={form.lastName} onChange={v => setField('lastName', v)} placeholder="Novák" />
                </div>
              ) : (
                <>
                  <Field label="Název firmy" value={form.companyName} onChange={v => setField('companyName', v)} placeholder="Firma s.r.o." />
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="IČO" value={form.ico} onChange={v => setField('ico', v)} placeholder="12345678" />
                    <Field label="DIČ" value={form.dic} onChange={v => setField('dic', v)} placeholder="CZ12345678" />
                  </div>
                  <Field label="Kontaktní osoba" value={form.contactPerson} onChange={v => setField('contactPerson', v)} placeholder="Jméno Příjmení" />
                </>
              )}

              <Field label="Telefon" value={form.phone} onChange={v => setField('phone', v)} placeholder="+420 XXX XXX XXX" />
              <Field label="Ulice a číslo" value={form.street} onChange={v => setField('street', v)} placeholder="Novákova 1" />
              <div className="grid grid-cols-3 gap-3">
                <Field label="PSČ" value={form.zip} onChange={v => setField('zip', v)} placeholder="110 00" />
                <div className="col-span-2">
                  <Field label="Město" value={form.city} onChange={v => setField('city', v)} placeholder="Praha" />
                </div>
              </div>
            </Section>
          </motion.div>

          {/* ——— Objednávka ——— */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Section title="Objednávka">
              <div>
                <label className="text-xs text-gray-500 mb-1.5 block">Způsob platby</label>
                <div className="flex gap-2">
                  {[['prevod', 'Převodem'], ['osobne', 'Osobně']].map(([k, l]) => (
                    <button key={k} type="button" onClick={() => setField('paymentMethod', k)}
                      className={`flex-1 py-2 rounded-lg text-sm font-semibold border transition-colors ${
                        form.paymentMethod === k
                          ? 'border-[#28a745] text-[#28a745] bg-[#28a745]/10'
                          : 'border-[#30363d] text-gray-500 hover:text-gray-300'
                      }`}
                    >{l}</button>
                  ))}
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer select-none">
                <button type="button" onClick={() => setField('delivery', !form.delivery)}
                  className={`w-5 h-5 rounded border flex items-center justify-center transition-colors shrink-0 ${form.delivery ? 'bg-[#28a745] border-[#28a745]' : 'border-[#30363d]'}`}
                >
                  {form.delivery && <Check size={11} className="text-white" />}
                </button>
                <span className="text-sm text-gray-300">Doprava ke klientovi</span>
              </label>

              <div>
                <label className="text-xs text-gray-500 mb-1.5 block">Charita</label>
                <select value={form.charity} onChange={e => setField('charity', e.target.value)}
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#28a745] transition-colors"
                >
                  <option value="">Nevybráno</option>
                  <option value="zivot_detem">Život dětem</option>
                  <option value="dobry_andel">Dobrý anděl</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-500 mb-1.5 block">Poznámka</label>
                <textarea value={form.notes} onChange={e => setField('notes', e.target.value)}
                  rows={3} placeholder="Poznámka zákazníka…"
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#28a745] transition-colors resize-none"
                />
              </div>
            </Section>
          </motion.div>

          {/* ——— Slevy ——— */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <Section title="Slevy">
              {/* Slevový kód */}
              <div>
                <label className="text-xs text-gray-500 mb-1.5 block">Slevový kód</label>
                {appliedCode ? (
                  <div className="flex items-center gap-3 bg-[#28a745]/10 border border-[#28a745]/30 rounded-lg px-4 py-2.5">
                    <Tag size={14} className="text-[#28a745] shrink-0" />
                    <span className="text-[#28a745] font-bold text-sm flex-1">{appliedCode.code}</span>
                    <span className="text-[#28a745] font-bold text-sm">−{formatPrice(appliedCode.amount)}</span>
                    <button type="button" onClick={removeCode} className="text-gray-500 hover:text-white transition-colors ml-1">
                      <Trash2 size={13} />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={codeInput}
                      onChange={e => { setCodeInput(e.target.value.toUpperCase()); setCodeError('') }}
                      placeholder="SLEVA10"
                      className="flex-1 bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#28a745] transition-colors font-mono"
                    />
                    <button
                      type="button"
                      onClick={verifyCode}
                      disabled={!codeInput.trim() || totalBase === 0}
                      className="px-4 py-2.5 rounded-lg text-sm font-semibold border border-[#30363d] text-gray-300 hover:text-white hover:border-gray-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
                    >
                      Ověřit kód
                    </button>
                  </div>
                )}
                {codeError && (
                  <p className="flex items-center gap-1.5 text-red-400 text-xs mt-1.5">
                    <AlertCircle size={12} />
                    {codeError}
                  </p>
                )}
              </div>

              {/* Manuální sleva */}
              <div className="border-t border-[#30363d] pt-4 space-y-3">
                <label className="text-xs text-gray-500 block">Manuální sleva</label>
                <Field
                  label="Název slevy"
                  value={manualDiscount.label}
                  onChange={v => setManualDiscount(d => ({ ...d, label: v }))}
                  placeholder="např. Věrnostní sleva, Akce léto…"
                />
                <div className="flex gap-2 items-end">
                  <div className="flex gap-2">
                    {[['fixed', <Banknote size={14} />, 'Kč'], ['percent', <BadgePercent size={14} />, '%']].map(([k, icon, suffix]) => (
                      <button key={k} type="button"
                        onClick={() => setManualDiscount(d => ({ ...d, type: k, value: '' }))}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold border transition-colors ${
                          manualDiscount.type === k
                            ? 'border-[#28a745] text-[#28a745] bg-[#28a745]/10'
                            : 'border-[#30363d] text-gray-500 hover:text-gray-300'
                        }`}
                      >
                        {icon}{suffix}
                      </button>
                    ))}
                  </div>
                  <div className="flex-1">
                    <input
                      type="number" min="0"
                      max={manualDiscount.type === 'percent' ? 100 : undefined}
                      value={manualDiscount.value}
                      onChange={e => setManualDiscount(d => ({ ...d, value: e.target.value }))}
                      placeholder={manualDiscount.type === 'percent' ? '0 %' : '0 Kč'}
                      className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#28a745] transition-colors"
                    />
                  </div>
                  {manualDiscount.value && (
                    <div className="text-[#28a745] font-bold text-sm whitespace-nowrap pb-2.5">
                      −{formatPrice(manualDiscountAmt)}
                    </div>
                  )}
                </div>
              </div>
            </Section>
          </motion.div>

          {/* ——— Počáteční stav ——— */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Section title="Počáteční stav">
              <div className="flex flex-wrap gap-2">
                {STATUSES.map(s => (
                  <button key={s.key} type="button" onClick={() => setField('status', s.key)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                      form.status === s.key
                        ? 'border-[#28a745] text-[#28a745] bg-[#28a745]/10'
                        : 'border-[#30363d] text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    {form.status === s.key && <Check size={10} />}
                    {s.label}
                  </button>
                ))}
              </div>
            </Section>
          </motion.div>

          {/* ——— Shrnutí ——— */}
          {totalBase > 0 && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
              <div className="bg-[#161b22] border border-[#28a745]/20 rounded-xl p-6 space-y-4">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Shrnutí objednávky</p>

                {/* Vozy */}
                <div className="space-y-2">
                  {carRows.filter(r => r.carSlug && r.price).map((row, idx) => {
                    const car = allCars.find(c => c.slug === row.carSlug)
                    const line = (Number(row.price) || 0) * row.qty
                    return (
                      <div key={idx} className="flex justify-between items-center text-sm">
                        <span className="text-gray-300">
                          {row.qty > 1 && <span className="text-gray-500 mr-1">{row.qty}×</span>}
                          {car?.name} {car?.variant}
                        </span>
                        <span className="text-white font-semibold">{formatPrice(line)}</span>
                      </div>
                    )
                  })}
                </div>

                <div className="border-t border-[#30363d] pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Cena vozů celkem</span>
                    <span className="text-white font-bold">{formatPrice(totalBase)}</span>
                  </div>

                  {codeDiscountAmt > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400 flex items-center gap-1.5">
                        <Tag size={12} />
                        Kód {appliedCode.code}
                      </span>
                      <span className="text-red-400 font-bold">−{formatPrice(codeDiscountAmt)}</span>
                    </div>
                  )}

                  {manualDiscountAmt > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">
                        {manualDiscount.label || 'Manuální sleva'}
                        {manualDiscount.type === 'percent' && ` (${manualDiscount.value} %)`}
                      </span>
                      <span className="text-red-400 font-bold">−{formatPrice(manualDiscountAmt)}</span>
                    </div>
                  )}

                  {totalDiscountAmt > 0 && (
                    <div className="flex justify-between text-sm border-t border-[#30363d] pt-2">
                      <span className="text-gray-400">Sleva celkem</span>
                      <span className="text-red-400 font-bold">−{formatPrice(totalDiscountAmt)}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center border-t border-[#30363d] pt-3">
                    <span className="text-white font-bold text-base">Celkem k úhradě</span>
                    <span className="text-white font-black text-xl">{formatPrice(totalFinal)}</span>
                  </div>

                  <div className="flex justify-between items-center bg-[#28a745]/10 border border-[#28a745]/20 rounded-lg px-4 py-3 mt-1">
                    <div>
                      <p className="text-[#28a745] font-semibold text-sm">Záloha 20 %</p>
                      <p className="text-gray-500 text-xs mt-0.5">Počítáno z ceny vozů před slevou</p>
                    </div>
                    <span className="text-[#28a745] font-black text-lg">{formatPrice(deposit)}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {error && (
            <div className="flex items-center gap-2 bg-red-900/20 border border-red-800/40 rounded-lg px-4 py-3">
              <AlertCircle size={14} className="text-red-400 shrink-0" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div className="flex gap-3 pb-8">
            <button type="button" onClick={() => navigate('/admin')}
              className="flex-1 py-3 rounded-xl border border-[#30363d] text-gray-400 hover:text-white text-sm font-semibold transition-colors"
            >Zrušit</button>
            <button type="submit" disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 bg-[#1e7e34] hover:bg-[#28a745] disabled:opacity-50 text-white font-bold py-3 rounded-xl text-sm transition-colors"
            >
              {saving ? <Loader2 size={15} className="animate-spin" /> : 'Vytvořit objednávku'}
            </button>
          </div>

        </form>
      </main>
    </div>
  )
}
