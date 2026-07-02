import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Plus, Trash2, AlertCircle, Loader2, Check } from 'lucide-react'
import { supabaseAdmin as supabase } from '../../lib/supabaseAdmin'
import { cars, ojeteVozy, formatPrice } from '../../data/cars'

const PROFORMA_DEPOSIT_PCT = 0.20

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
  return { carSlug: '', price: '', qty: 1, discountAmount: 0 }
}

async function generateOrderNumber() {
  const year = new Date().getFullYear()
  const { data } = await supabase
    .from('orders')
    .select('order_number')
    .like('order_number', `OBJ-${year}-%`)
    .order('created_at', { ascending: false })
    .limit(1)

  let count = 1
  if (data?.length > 0) {
    const parts = (data[0].order_number || '').split('-')
    const num = parseInt(parts[2] || '0')
    if (!isNaN(num)) count = num + 1
  }
  return `OBJ-${year}-${String(count).padStart(3, '0')}`
}

function AdminField({ label, type = 'text', value, onChange, placeholder }) {
  return (
    <div>
      <label className="text-xs text-gray-500 mb-1 block">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#28a745] transition-colors"
      />
    </div>
  )
}

export default function CreateOrderModal({ onClose, onSuccess }) {
  const [customerType, setCustomerType] = useState('fyzicka')
  const [form, setForm] = useState({
    email: '', firstName: '', lastName: '',
    companyName: '', ico: '', dic: '', contactPerson: '',
    phone: '', street: '', city: '', zip: '',
    notes: '', paymentMethod: 'prevod', delivery: false,
    charity: '', discountCode: '', status: 'prijato',
  })
  const [carRows, setCarRows] = useState([emptyCarRow()])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function setField(key, value) {
    setForm(f => ({ ...f, [key]: value }))
  }

  function setCarField(idx, key, value) {
    setCarRows(rows => rows.map((r, i) => i === idx ? { ...r, [key]: value } : r))
  }

  function selectCar(idx, slug) {
    const all = [...cars, ...ojeteVozy]
    const car = all.find(c => c.slug === slug)
    setCarRows(rows => rows.map((r, i) =>
      i === idx ? { ...r, carSlug: slug, price: car ? String(car.salePrice) : '' } : r
    ))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!form.email) return setError('E-mail je povinný')
    if (carRows.some(r => !r.carSlug)) return setError('Vyberte vůz u každého řádku')
    if (!form.paymentMethod) return setError('Zvolte způsob platby')

    setSaving(true)
    const orderNumber = await generateOrderNumber()
    const isCompany = customerType === 'firma'
    const all = [...cars, ...ojeteVozy]

    const rows = carRows.map(r => {
      const car = all.find(c => c.slug === r.carSlug)
      const lineOriginal = (Number(r.price) || 0) * r.qty
      const discountAmt = Number(r.discountAmount) || 0
      const lineFinal = lineOriginal - discountAmt

      return {
        email:           form.email,
        first_name:      isCompany ? null : form.firstName || null,
        last_name:       isCompany ? null : form.lastName || null,
        company_name:    isCompany ? form.companyName || null : null,
        ico:             isCompany ? form.ico || null : null,
        dic:             isCompany ? form.dic || null : null,
        contact_person:  isCompany ? form.contactPerson || null : null,
        phone:           form.phone || null,
        street:          form.street || null,
        city:            form.city || null,
        zip:             form.zip || null,
        customer_type:   customerType,
        notes:           form.notes || null,
        order_number:    orderNumber,
        payment_method:  form.paymentMethod,
        delivery:        form.delivery,
        discount_code:   form.discountCode || null,
        discount_amount: discountAmt,
        charity:         form.charity || null,
        car_name:        car?.name || '',
        car_slug:        car?.slug || null,
        car_variant:     car?.variant || null,
        car_color:       car?.color || null,
        internal_id:     car?.internalId || null,
        qty:             r.qty,
        is_used:         car?.isUsed || !!car?.mileage || false,
        price:           lineOriginal,
        price_original:  lineOriginal,
        price_final:     lineFinal,
        deposit_paid:    Math.round(lineFinal * PROFORMA_DEPOSIT_PCT),
        status:          form.status,
        is_new:          true,
        acknowledged:    true,
      }
    })

    const { error: dbErr } = await supabase.from('orders').insert(rows)
    setSaving(false)
    if (dbErr) { setError(dbErr.message); return }
    onSuccess(orderNumber)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-8 px-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-2xl bg-[#161b22] border border-[#30363d] rounded-2xl my-auto"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#30363d]">
          <h2 className="font-black text-white text-lg">Nová objednávka</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">

          {/* Vozy */}
          <section>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Vozy</p>
            <div className="space-y-3">
              {carRows.map((row, idx) => {
                const lineFinal = (Number(row.price) || 0) * row.qty - (Number(row.discountAmount) || 0)
                const deposit = Math.round(lineFinal * PROFORMA_DEPOSIT_PCT)
                return (
                  <div key={idx} className="bg-[#0d1117] rounded-xl p-4 space-y-3">
                    <div className="flex items-end gap-3">
                      <div className="flex-1">
                        <label className="text-xs text-gray-500 mb-1 block">Vůz</label>
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
                        <label className="text-xs text-gray-500 mb-1 block">Ks</label>
                        <input
                          type="number" min="1" max="99"
                          value={row.qty}
                          onChange={e => setCarField(idx, 'qty', Math.max(1, Number(e.target.value)))}
                          className="w-full bg-[#161b22] border border-[#30363d] rounded-lg px-3 py-2.5 text-white text-sm text-center focus:outline-none focus:border-[#28a745] transition-colors"
                        />
                      </div>
                      {carRows.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setCarRows(rows => rows.filter((_, i) => i !== idx))}
                          className="text-gray-600 hover:text-red-400 transition-colors pb-2.5"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Cena za ks (Kč)</label>
                        <input
                          type="number" min="0"
                          value={row.price}
                          onChange={e => setCarField(idx, 'price', e.target.value)}
                          placeholder="doplní se z ceníku"
                          className="w-full bg-[#161b22] border border-[#30363d] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#28a745] transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Sleva (Kč)</label>
                        <input
                          type="number" min="0"
                          value={row.discountAmount}
                          onChange={e => setCarField(idx, 'discountAmount', e.target.value)}
                          placeholder="0"
                          className="w-full bg-[#161b22] border border-[#30363d] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#28a745] transition-colors"
                        />
                      </div>
                    </div>

                    {row.price && (
                      <div className="flex items-center gap-5 text-xs border-t border-[#30363d] pt-2.5">
                        <span className="text-gray-500">Celkem po slevě: <span className="text-white font-bold">{formatPrice(lineFinal)}</span></span>
                        <span className="text-gray-500">Záloha 20 %: <span className="text-[#28a745] font-bold">{formatPrice(deposit)}</span></span>
                      </div>
                    )}
                  </div>
                )
              })}

              <button
                type="button"
                onClick={() => setCarRows(rows => [...rows, emptyCarRow()])}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-white border border-dashed border-[#30363d] hover:border-gray-500 rounded-xl px-4 py-3 w-full transition-colors"
              >
                <Plus size={14} />
                Přidat další vůz
              </button>
            </div>
          </section>

          {/* Zákazník */}
          <section>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Zákazník</p>
            <div className="flex gap-2 mb-4">
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
            <div className="space-y-3">
              <AdminField label="E-mail *" type="email" value={form.email} onChange={v => setField('email', v)} placeholder="zakaznik@email.cz" />
              {customerType === 'fyzicka' ? (
                <div className="grid grid-cols-2 gap-3">
                  <AdminField label="Jméno" value={form.firstName} onChange={v => setField('firstName', v)} placeholder="Jan" />
                  <AdminField label="Příjmení" value={form.lastName} onChange={v => setField('lastName', v)} placeholder="Novák" />
                </div>
              ) : (
                <>
                  <AdminField label="Název firmy" value={form.companyName} onChange={v => setField('companyName', v)} placeholder="Firma s.r.o." />
                  <div className="grid grid-cols-2 gap-3">
                    <AdminField label="IČO" value={form.ico} onChange={v => setField('ico', v)} placeholder="12345678" />
                    <AdminField label="DIČ" value={form.dic} onChange={v => setField('dic', v)} placeholder="CZ12345678" />
                  </div>
                  <AdminField label="Kontaktní osoba" value={form.contactPerson} onChange={v => setField('contactPerson', v)} placeholder="Jméno Příjmení" />
                </>
              )}
              <AdminField label="Telefon" value={form.phone} onChange={v => setField('phone', v)} placeholder="+420 XXX XXX XXX" />
              <AdminField label="Ulice a číslo" value={form.street} onChange={v => setField('street', v)} placeholder="Novákova 1" />
              <div className="grid grid-cols-3 gap-3">
                <AdminField label="PSČ" value={form.zip} onChange={v => setField('zip', v)} placeholder="110 00" />
                <div className="col-span-2">
                  <AdminField label="Město" value={form.city} onChange={v => setField('city', v)} placeholder="Praha" />
                </div>
              </div>
            </div>
          </section>

          {/* Objednávka */}
          <section>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Objednávka</p>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Způsob platby</label>
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

              <AdminField label="Slevový kód" value={form.discountCode} onChange={v => setField('discountCode', v)} placeholder="SLEVA10" />

              <div>
                <label className="text-xs text-gray-500 mb-1 block">Charita</label>
                <select value={form.charity} onChange={e => setField('charity', e.target.value)}
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#28a745] transition-colors"
                >
                  <option value="">Nevybráno</option>
                  <option value="zivot_detem">Život dětem</option>
                  <option value="dobry_andel">Dobrý anděl</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-500 mb-1 block">Poznámka</label>
                <textarea value={form.notes} onChange={e => setField('notes', e.target.value)}
                  rows={3} placeholder="Poznámka zákazníka…"
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#28a745] transition-colors resize-none"
                />
              </div>
            </div>
          </section>

          {/* Počáteční stav */}
          <section>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Počáteční stav</p>
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
          </section>

          {error && (
            <div className="flex items-center gap-2 bg-red-900/20 border border-red-800/40 rounded-lg px-4 py-3">
              <AlertCircle size={14} className="text-red-400 shrink-0" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div className="flex gap-3">
            <button type="button" onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-[#30363d] text-gray-400 hover:text-white text-sm font-semibold transition-colors"
            >Zrušit</button>
            <button type="submit" disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 bg-[#1e7e34] hover:bg-[#28a745] disabled:opacity-50 text-white font-bold py-3 rounded-xl text-sm transition-colors"
            >
              {saving ? <Loader2 size={15} className="animate-spin" /> : 'Vytvořit objednávku'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
