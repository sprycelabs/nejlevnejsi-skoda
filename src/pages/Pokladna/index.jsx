import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ChevronRight, ShoppingCart, Trash2, Plus, Minus, ShieldCheck, AlertCircle, CheckCircle2, User, Building2, Loader2, Tag, X, Truck, FileText } from 'lucide-react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import SEO from '../../components/SEO'
import { useCart } from '../../context/CartContext'
import { formatPrice } from '../../data/cars'
import { applyDiscount } from '../../data/discountCodes'

const EMPTY_FYZICKA = {
  firstName: '', lastName: '', email: '', phone: '',
  street: '', city: '', zip: '', note: '', terms: false,
}

const EMPTY_FIRMA = {
  companyName: '', ico: '', dic: '', email: '', phone: '',
  contactPerson: '', street: '', city: '', zip: '', note: '', terms: false,
}

function FileUpload({ onFileChange }) {
  const [fileNames, setFileNames] = useState([])
  return (
    <div>
      <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-200 hover:border-[#1e7e34] rounded-md py-6 px-4 cursor-pointer transition-colors group">
        <input
          type="file"
          name="attachments"
          multiple
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp"
          className="hidden"
          onChange={e => {
            const fileList = Array.from(e.target.files)
            setFileNames(fileList.map(f => f.name))
            if (onFileChange) onFileChange(fileList)
          }}
        />
        <svg xmlns="http://www.w3.org/2000/svg" className="w-9 h-9 text-gray-300 group-hover:text-[#1e7e34] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12V4m0 0L8 8m4-4l4 4" />
        </svg>
        {fileNames.length > 0 ? (
          <span className="text-sm text-[#1e7e34] font-medium text-center">{fileNames.join(', ')}</span>
        ) : (
          <span className="text-sm text-gray-400 text-center">Vyberte soubory nebo sem přetáhněte</span>
        )}
        <span className="text-xs text-gray-300">PDF, Word, JPG, PNG — max. 10 MB</span>
      </label>
    </div>
  )
}

function Field({ label, name, type = 'text', value, onChange, error, placeholder }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
      <input
        type={type} name={name} value={value} onChange={onChange} placeholder={placeholder}
        className={`w-full border rounded-md px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1e7e34]/30 focus:border-[#1e7e34] transition-colors ${error ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
      />
      {error && <p className="flex items-center gap-1 text-red-500 text-xs mt-1"><AlertCircle size={12} />{error}</p>}
    </div>
  )
}

export default function Pokladna() {
  const { items, removeFromCart, updateQty, clearCart, cartTotal } = useCart()
  const totalQty = items.reduce((sum, { qty }) => sum + qty, 0)
  const depositAmount = 200000 * totalQty
  const [type, setType] = useState('fyzicka') // 'fyzicka' | 'firma'
  const [form, setForm] = useState(EMPTY_FYZICKA)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [orderNumber, setOrderNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [invoiceChecked, setInvoiceChecked] = useState(false)
  const [deliveryChecked, setDeliveryChecked] = useState(false)
  const [sidebarErrors, setSidebarErrors] = useState({})
  const [attachedFiles, setAttachedFiles] = useState([])
  const [discountInput, setDiscountInput] = useState('')
  const [appliedDiscount, setAppliedDiscount] = useState(null)
  const [discountError, setDiscountError] = useState('')

  // Přepočítává se vždy z aktuálního cartTotal — reaguje na změny košíku
  const discountAmount = appliedDiscount
    ? appliedDiscount.type === 'percent'
      ? Math.round(cartTotal * appliedDiscount.value / 100)
      : Math.min(appliedDiscount.value, cartTotal)
    : 0
  const discountedTotal = cartTotal - discountAmount

  function handleApplyDiscount() {
    if (!discountInput.trim()) {
      setDiscountError('Zadejte slevový kód')
      return
    }
    const result = applyDiscount(discountInput, cartTotal)
    if (!result) {
      setDiscountError('Neplatný slevový kód')
      setAppliedDiscount(null)
    } else {
      setAppliedDiscount(result)
      setDiscountError('')
    }
  }

  function handleRemoveDiscount() {
    setAppliedDiscount(null)
    setDiscountInput('')
    setDiscountError('')
  }

  function switchType(t) {
    setType(t)
    setForm(t === 'fyzicka' ? EMPTY_FYZICKA : EMPTY_FIRMA)
    setErrors({})
  }

  function handleChange(e) {
    const { name, value, type: t, checked } = e.target
    setForm(f => ({ ...f, [name]: t === 'checkbox' ? checked : value }))
    setErrors(err => ({ ...err, [name]: '' }))
  }

  function validate() {
    const e = {}
    if (type === 'fyzicka') {
      if (!form.firstName?.trim()) e.firstName = 'Povinné pole'
      if (!form.lastName?.trim()) e.lastName = 'Povinné pole'
    } else {
      if (!form.companyName?.trim()) e.companyName = 'Povinné pole'
      if (!form.ico?.trim()) e.ico = 'Povinné pole'
    }
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Zadejte platný e-mail'
    if (!form.phone.trim()) e.phone = 'Povinné pole'
    if (!form.street.trim()) e.street = 'Povinné pole'
    if (!form.city.trim()) e.city = 'Povinné pole'
    if (!form.zip.trim()) e.zip = 'Povinné pole'
    if (!form.terms) e.terms = 'Musíte souhlasit s obchodními podmínkami'
    return e
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    const sErrs = {}
    if (!invoiceChecked) sErrs.invoice = 'Povinné'
    if (!deliveryChecked) sErrs.delivery = 'Povinné'
    if (Object.keys(errs).length > 0 || Object.keys(sErrs).length > 0) {
      setErrors(errs)
      setSidebarErrors(sErrs)
      setTimeout(() => {
        const firstError = document.querySelector(
          'input.border-red-400, textarea.border-red-400, .border-red-300, .border-red-200'
        )
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }, 50)
      return
    }
    setLoading(true)
    setSubmitError('')
    try {
      // Převeď soubory zákazníka na base64
      const fileAttachments = await Promise.all(
        attachedFiles.map(file => new Promise((resolve) => {
          const reader = new FileReader()
          reader.onload = () => resolve({
            name: file.name,
            type: file.type || 'application/octet-stream',
            data: reader.result.split(',')[1],
          })
          reader.readAsDataURL(file)
        }))
      )

      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form, items, total: discountedTotal, fileAttachments,
          discount: appliedDiscount ? { ...appliedDiscount, amount: discountAmount } : null,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Chyba serveru')
      setOrderNumber(data.orderNumber)
      clearCart()
      setSubmitted(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      // Google Ads konverze — odeslání objednávky
      if (typeof window.gtag_report_conversion === 'function') {
        window.gtag_report_conversion(discountedTotal)
      }
    } catch (err) {
      setSubmitError('Nepodařilo se odeslat objednávku. Zkuste to prosím znovu nebo nás kontaktujte.')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-40 pb-24 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} className="text-[#1e7e34]" />
            </div>
            <h1 className="text-3xl font-black text-gray-900 mb-3">Objednávka odeslána!</h1>
            {orderNumber && (
              <div className="inline-block bg-green-50 border border-green-200 rounded-lg px-5 py-2 mb-4">
                <span className="text-sm text-gray-500">Číslo objednávky: </span>
                <span className="font-black text-[#1e7e34] text-base">{orderNumber}</span>
              </div>
            )}
            <p className="text-gray-500 leading-relaxed mb-8">
              Děkujeme za vaši objednávku. Potvrzení jsme zaslali na <strong>{form.email}</strong>. Fakturu s platebními údaji obdržíte do 24 hodin.
            </p>
            <Link to="/" className="inline-flex items-center gap-2 bg-[#1e7e34] hover:bg-[#28a745] text-white font-bold px-8 py-3 rounded-md transition-colors">
              Zpět na hlavní stránku
            </Link>
          </motion.div>
        </div>
        <Footer />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-40 pb-24 text-center">
          <ShoppingCart size={56} className="text-gray-200 mx-auto mb-4" />
          <h1 className="text-2xl font-black text-gray-900 mb-3">Košík je prázdný</h1>
          <p className="text-gray-400 mb-6">Přidejte nejprve vozy do košíku.</p>
          <Link to="/vozy" className="inline-flex items-center gap-2 bg-[#1e7e34] hover:bg-[#28a745] text-white font-bold px-6 py-3 rounded-md transition-colors">
            Prohlédnout vozy
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO title="Pokladna" description="Dokončení objednávky." noindex />
      <Navbar />

      {/* Hero */}
      <section className="relative bg-[#0d1f10] overflow-hidden pt-24">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d1f10] via-[#1a3d1e] to-[#0a1508]" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 text-sm text-gray-400 pt-6 pb-4">
            <Link to="/" className="hover:text-white transition-colors">Domů</Link>
            <ChevronRight size={13} />
            <span className="text-gray-200">Pokladna</span>
          </div>
          <div className="pb-8 pt-2">
            <p className="text-[#28a745] font-semibold text-sm uppercase tracking-wider mb-2">Dokončení objednávky</p>
            <h1 className="text-3xl sm:text-4xl font-black text-white mb-5">Pokladna</h1>
            <div className="flex flex-wrap gap-4 sm:gap-6">
              {[
                { icon: ShieldCheck, text: 'Tovární záruka zdarma' },
                { icon: Truck,       text: 'Doprava a registrace zdarma' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-gray-300 text-sm">
                  <Icon size={15} className="text-[#28a745]" />
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="relative z-10">
          <svg viewBox="0 0 1440 60" fill="none" className="w-full block">
            <path d="M0 60L1440 60L1440 30C1200 60 960 0 720 30C480 60 240 0 0 30L0 60Z" fill="#f9fafb" />
          </svg>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <form onSubmit={handleSubmit} noValidate>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

              {/* LEFT */}
              <div className="lg:col-span-2 space-y-6">

                {/* Přepínač typ zákazníka */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-lg border border-gray-100 shadow-sm p-2 flex gap-2"
                >
                  <button
                    type="button"
                    onClick={() => switchType('fyzicka')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md font-bold text-sm transition-all ${
                      type === 'fyzicka'
                        ? 'bg-[#1e7e34] text-white shadow-sm'
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <User size={16} />
                    Fyzická osoba
                  </button>
                  <button
                    type="button"
                    onClick={() => switchType('firma')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md font-bold text-sm transition-all ${
                      type === 'firma'
                        ? 'bg-[#1e7e34] text-white shadow-sm'
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <Building2 size={16} />
                    Nákup na firmu
                  </button>
                </motion.div>

                {/* Formulář — fyzická osoba */}
                <AnimatePresence mode="wait">
                  {type === 'fyzicka' && (
                    <motion.div key="fyzicka"
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                      className="bg-white rounded-lg border border-gray-100 shadow-sm p-6"
                    >
                      <h2 className="font-black text-gray-900 text-lg mb-5">Osobní údaje</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field label="Jméno *" name="firstName" value={form.firstName} onChange={handleChange} error={errors.firstName} placeholder="Karel" />
                        <Field label="Příjmení *" name="lastName" value={form.lastName} onChange={handleChange} error={errors.lastName} placeholder="Novák" />
                        <Field label="E-mail *" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} placeholder="jan@email.cz" />
                        <Field label="Telefon *" name="phone" type="tel" value={form.phone} onChange={handleChange} error={errors.phone} placeholder="+420 000 000 000" />
                      </div>
                    </motion.div>
                  )}

                  {/* Formulář — firma */}
                  {type === 'firma' && (
                    <motion.div key="firma"
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                      className="bg-white rounded-lg border border-gray-100 shadow-sm p-6"
                    >
                      <h2 className="font-black text-gray-900 text-lg mb-5">Firemní údaje</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                          <Field label="Název společnosti *" name="companyName" value={form.companyName} onChange={handleChange} error={errors.companyName} placeholder="Firma s.r.o." />
                        </div>
                        <Field label="IČO *" name="ico" value={form.ico} onChange={handleChange} error={errors.ico} placeholder="12345678" />
                        <Field label="DIČ" name="dic" value={form.dic} onChange={handleChange} error={errors.dic} placeholder="CZ12345678" />
                        <Field label="Kontaktní osoba" name="contactPerson" value={form.contactPerson} onChange={handleChange} error={errors.contactPerson} placeholder="Jan Novák" />
                        <Field label="E-mail *" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} placeholder="firma@email.cz" />
                        <Field label="Telefon *" name="phone" type="tel" value={form.phone} onChange={handleChange} error={errors.phone} placeholder="+420 000 000 000" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Adresa */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                  className="bg-white rounded-lg border border-gray-100 shadow-sm p-6"
                >
                  <h2 className="font-black text-gray-900 text-lg mb-5">
                    {type === 'firma' ? 'Sídlo společnosti' : 'Doručovací adresa'}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <Field label="Ulice a č.p. *" name="street" value={form.street} onChange={handleChange} error={errors.street} placeholder="Příkladná 123" />
                    </div>
                    <Field label="Město *" name="city" value={form.city} onChange={handleChange} error={errors.city} placeholder="Praha" />
                    <Field label="PSČ *" name="zip" value={form.zip} onChange={handleChange} error={errors.zip} placeholder="110 00" />
                  </div>
                </motion.div>

                {/* Poznámka */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                  className="bg-white rounded-lg border border-gray-100 shadow-sm p-6"
                >
                  <h2 className="font-black text-gray-900 text-lg mb-5">Poznámka k objednávce</h2>
                  <textarea
                    name="note" value={form.note} onChange={handleChange} rows={3}
                    placeholder="Např. preferovaná barva, výbava, termín dodání..."
                    className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1e7e34]/30 focus:border-[#1e7e34] resize-none"
                  />
                </motion.div>

                {/* Přílohy */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.175 }}
                  className="bg-white rounded-lg border border-gray-100 shadow-sm p-6"
                >
                  <h2 className="font-black text-gray-900 text-lg mb-1">Přílohy <span className="text-sm font-normal text-gray-400">(nepovinné)</span></h2>
                  <p className="text-sm text-gray-400 mb-4">Volitelně přiložte konfiguraci z webu Škoda-Auto, fotky nebo jakýkoli dokument.</p>
                  <FileUpload onFileChange={setAttachedFiles} />
                </motion.div>

                {/* Obchodní podmínky */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                  className="bg-white rounded-lg border border-gray-100 shadow-sm p-6"
                >
                  <div className={`flex items-start gap-3 p-4 rounded-md ${errors.terms ? 'bg-red-50 border border-red-200' : 'bg-gray-50'}`}>
                    <input type="checkbox" id="terms" name="terms" checked={form.terms} onChange={handleChange}
                      className="mt-0.5 w-5 h-5 accent-[#1e7e34] shrink-0 cursor-pointer"
                    />
                    <label htmlFor="terms" className="text-sm text-gray-700 leading-relaxed cursor-pointer">
                      Souhlasím s{' '}
                      <a href="/doc/terms.pdf" target="_blank" rel="noopener" className="text-[#1e7e34] font-semibold hover:underline">obchodními podmínkami</a>
                      {' '}a beru na vědomí zpracování osobních údajů dle{' '}
                      <a href="/doc/gdpr.pdf" target="_blank" rel="noopener" className="text-[#1e7e34] font-semibold hover:underline">zásad ochrany soukromí</a>. *
                    </label>
                  </div>
                  {errors.terms && (
                    <p className="flex items-center gap-1.5 text-red-500 text-sm mt-2">
                      <AlertCircle size={14} /> {errors.terms}
                    </p>
                  )}
                </motion.div>
              </div>

              {/* RIGHT — shrnutí */}
              <div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
                  className="bg-white rounded-lg border border-gray-100 shadow-sm p-6 sticky top-28"
                >
                  <h2 className="font-black text-gray-900 text-lg mb-4 flex items-center gap-2">
                    <ShoppingCart size={18} className="text-[#1e7e34]" />
                    Shrnutí objednávky
                  </h2>

                  <ul className="divide-y divide-gray-100 mb-4">
                    {items.map(({ car, qty }) => (
                      <li key={car.id} className="py-4 flex gap-3">
                        <div className="w-16 h-12 bg-gray-50 rounded flex items-center justify-center shrink-0">
                          <img src={car.image} alt={car.name} className="w-full h-full object-contain p-1" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-gray-900 text-sm truncate">{car.name}</p>
                          <p className="text-xs text-gray-400">{car.variant}</p>
                          <div className="flex items-center justify-between mt-1.5">
                            <div className="flex items-center gap-1 border border-gray-200 rounded">
                              <button type="button" onClick={() => updateQty(car.id, qty - 1)} className="p-1 hover:bg-gray-100">
                                <Minus size={11} className="text-gray-500" />
                              </button>
                              <span className="text-xs font-semibold w-5 text-center">{qty}</span>
                              <button type="button" onClick={() => updateQty(car.id, qty + 1)} className="p-1 hover:bg-gray-100">
                                <Plus size={11} className="text-gray-500" />
                              </button>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-black text-[#1e7e34] text-sm">{formatPrice(car.salePrice * qty)}</span>
                              <button type="button" onClick={() => removeFromCart(car.id)} className="text-gray-300 hover:text-red-400 transition-colors">
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>

                  {/* Platba */}
                  <div className="border-t border-gray-100 pt-4 mb-3">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Platba</p>
                    <label className={`flex items-start gap-2.5 p-3 rounded-md border cursor-pointer transition-colors ${sidebarErrors.invoice ? 'border-red-300 bg-red-50' : 'border-gray-100 bg-gray-50 hover:border-[#1e7e34]/30'}`}>
                      <input
                        type="checkbox"
                        checked={invoiceChecked}
                        onChange={e => { setInvoiceChecked(e.target.checked); setSidebarErrors(s => ({ ...s, invoice: '' })) }}
                        className="w-4 h-4 accent-[#1e7e34] shrink-0 mt-0.5 cursor-pointer"
                      />
                      <div>
                        <span className="text-sm font-semibold text-gray-800">Faktura</span>
                        <p className="text-xs text-gray-400">Platba na základě faktury</p>
                      </div>
                    </label>
                    {sidebarErrors.invoice && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={11} /> Vyberte způsob platby</p>}
                  </div>

                  {/* Doprava */}
                  <div className="mb-4">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Doprava</p>
                    <label className={`flex items-start gap-2.5 p-3 rounded-md border cursor-pointer transition-colors ${sidebarErrors.delivery ? 'border-red-300 bg-red-50' : 'border-gray-100 bg-gray-50 hover:border-[#1e7e34]/30'}`}>
                      <input
                        type="checkbox"
                        checked={deliveryChecked}
                        onChange={e => { setDeliveryChecked(e.target.checked); setSidebarErrors(s => ({ ...s, delivery: '' })) }}
                        className="w-4 h-4 accent-[#1e7e34] shrink-0 mt-0.5 cursor-pointer"
                      />
                      <div>
                        <span className="text-sm font-semibold text-gray-800">Zdarma na adresu</span>
                        <p className="text-xs text-gray-400">Dovoz až ke dveřím</p>
                      </div>
                    </label>
                    {sidebarErrors.delivery && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={11} /> Vyberte způsob dopravy</p>}
                  </div>

                  {/* Slevový kód */}
                  <div className="mb-4">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Slevový kód</p>
                    {appliedDiscount ? (
                      <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-md px-3 py-2.5">
                        <div className="flex items-center gap-2">
                          <Tag size={14} className="text-[#1e7e34]" />
                          <span className="text-sm font-bold text-[#1e7e34]">{appliedDiscount.code}</span>
                          <span className="text-xs text-green-700 bg-green-100 rounded px-1.5 py-0.5">
                            {appliedDiscount.type === 'percent' ? `-${appliedDiscount.value} %` : `-${formatPrice(appliedDiscount.value)}`}
                          </span>
                        </div>
                        <button type="button" onClick={handleRemoveDiscount} className="text-gray-400 hover:text-red-400 transition-colors">
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={discountInput}
                          onChange={e => { setDiscountInput(e.target.value.toUpperCase()); setDiscountError('') }}
                          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleApplyDiscount())}
                          placeholder="Zadejte kód..."
                          className={`flex-1 border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e7e34]/30 focus:border-[#1e7e34] transition-colors ${discountError ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                        />
                        <button
                          type="button"
                          onClick={handleApplyDiscount}
                          className="px-3 py-2 bg-gray-900 hover:bg-gray-700 text-white text-sm font-bold rounded-md transition-colors whitespace-nowrap"
                        >
                          Použít
                        </button>
                      </div>
                    )}
                    {discountError && (
                      <p className="flex items-center gap-1 text-red-500 text-xs mt-1.5">
                        <AlertCircle size={11} /> {discountError}
                      </p>
                    )}
                  </div>


                  <div className="border-t border-gray-100 pt-4 mb-6">
                    {appliedDiscount && (
                      <>
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-gray-400 text-sm">Cena před slevou</span>
                          <span className="text-gray-400 text-sm line-through">{formatPrice(cartTotal)}</span>
                        </div>
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-green-700 text-sm font-semibold">Sleva ({appliedDiscount.code})</span>
                          <span className="text-green-700 text-sm font-bold">−{formatPrice(discountAmount)}</span>
                        </div>
                      </>
                    )}
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-gray-500 text-sm">Celkem vč. DPH</span>
                      <span className="font-black text-xl text-gray-900">{formatPrice(discountedTotal)}</span>
                    </div>
                    <div className="bg-green-50 border border-green-100 rounded-md px-3 py-2.5 mt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-[#1e7e34]">Záloha k úhradě nyní</span>
                        <span className="font-black text-sm text-[#1e7e34]">{formatPrice(depositAmount)}</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">Zbytek ceny uhradíte při převzetí vozu</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 bg-blue-50 border border-blue-100 rounded-md p-3 mb-5 text-xs text-blue-800 leading-relaxed">
                    <ShieldCheck size={15} className="text-blue-400 shrink-0 mt-0.5" />
                    <span>
                      Odesláním nám sdělíte zájem o vůz. <strong>Do 24 hodin vás kontaktujeme</strong> telefonicky nebo e-mailem pro potvrzení. Zároveň obdržíte <strong>proforma fakturu</strong> s platebními údaji.
                    </span>
                  </div>

                  {submitError && (
                    <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-md p-3 mb-4 text-xs text-red-700">
                      <AlertCircle size={14} className="shrink-0 mt-0.5" />
                      {submitError}
                    </div>
                  )}
                  <button type="submit" disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-[#1e7e34] hover:bg-[#28a745] disabled:opacity-60 disabled:cursor-not-allowed text-white font-black py-4 rounded-md transition-colors text-base"
                  >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <ShieldCheck size={18} />}
                    {loading ? 'Odesílám...' : 'Odeslat poptávku'}
                  </button>
                  <p className="text-center text-xs text-gray-400 mt-3">
                    Po odeslání vás do 24 h kontaktujeme k potvrzení
                  </p>
                </motion.div>
              </div>

            </div>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  )
}
