import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Phone, Mail, MapPin, Clock, ChevronRight, Send,
  CheckCircle, Car, MessageSquare, User, AtSign,
} from 'lucide-react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

const contactItems = [
  {
    icon: Phone,
    label: 'Telefon',
    value: '+420 733 455 966',
    sub: 'Po–Pá 8:00–18:00',
    href: 'tel:+420733455966',
  },
  {
    icon: Mail,
    label: 'E-mail',
    value: 'info@nejlevnejsi-skoda.cz',
    sub: 'Odpovídáme do 24 hodin',
    href: 'mailto:info@nejlevnejsi-skoda.cz',
  },
  {
    icon: MapPin,
    label: 'Sídlo',
    value: 'Praha, Česká republika',
    sub: 'Schůzky po domluvě',
    href: null,
  },
  {
    icon: Clock,
    label: 'Provozní doba',
    value: 'Po–Pá 8:00–18:00',
    sub: 'So 9:00–13:00',
    href: null,
  },
]

const carModels = [
  'Škoda Octavia',
  'Škoda Fabia',
  'Škoda Superb',
  'Škoda Kodiaq',
  'Škoda Karoq',
  'Škoda Kamiq',
  'Škoda Enyaq',
  'Jiný model',
]

export default function Kontakt() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    model: '',
    message: '',
  })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSent(true)
    }, 1200)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero */}
      <section className="relative bg-[#0d1f10] overflow-hidden pt-28">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d1f10] via-[#1a3d1e] to-[#0a1508]" />
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#1e7e34]/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/4" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 text-sm text-gray-400 pt-6 pb-4">
            <Link to="/" className="hover:text-white transition-colors">Domů</Link>
            <ChevronRight size={13} />
            <span className="text-gray-200">Kontakt</span>
          </div>

          <div className="max-w-3xl pb-16 pt-4">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[#28a745] font-semibold text-sm uppercase tracking-wider mb-3"
            >
              Jsme tu pro vás
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-6"
            >
              Nezávazná poptávka<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#28a745] to-[#86efac]">
                do 24 hodin odpovíme.
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-gray-300 text-lg leading-relaxed"
            >
              Řekněte nám, jaký vůz hledáte. Připravíme konkrétní nabídku s reálnou cenou
              z EU trhu — bez závazků, zdarma.
            </motion.p>
          </div>
        </div>

        <div className="relative z-10">
          <svg viewBox="0 0 1440 60" fill="none" className="w-full block">
            <path d="M0 60L1440 60L1440 30C1200 60 960 0 720 30C480 60 240 0 0 30L0 60Z" fill="#f9fafb" />
          </svg>
        </div>
      </section>

      {/* Contact cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-2">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
          {contactItems.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              {item.href ? (
                <a
                  href={item.href}
                  className="group bg-white rounded-lg border border-gray-100 shadow-sm p-5 flex flex-col gap-3 hover:border-[#1e7e34]/40 hover:shadow-md transition-all h-full"
                >
                  <div className="w-10 h-10 bg-[#f0faf2] group-hover:bg-[#1e7e34] rounded-md flex items-center justify-center transition-colors">
                    <item.icon size={18} className="text-[#1e7e34] group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">{item.label}</div>
                    <div className="font-bold text-gray-900 text-sm">{item.value}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{item.sub}</div>
                  </div>
                </a>
              ) : (
                <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-5 flex flex-col gap-3 h-full">
                  <div className="w-10 h-10 bg-[#f0faf2] rounded-md flex items-center justify-center">
                    <item.icon size={18} className="text-[#1e7e34]" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">{item.label}</div>
                    <div className="font-bold text-gray-900 text-sm">{item.value}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{item.sub}</div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Form + info */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-3"
            >
              <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-5 sm:p-8">
                <h2 className="text-2xl font-black text-gray-900 mb-2">Nezávazná poptávka</h2>
                <p className="text-gray-500 text-sm mb-8">Vyplňte formulář a my se vám ozveme s konkrétní nabídkou.</p>

                {sent ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-16 text-center"
                  >
                    <div className="w-16 h-16 bg-[#f0faf2] rounded-full flex items-center justify-center mb-5">
                      <CheckCircle size={32} className="text-[#1e7e34]" />
                    </div>
                    <h3 className="text-xl font-black text-gray-900 mb-2">Zpráva odeslána!</h3>
                    <p className="text-gray-500 text-sm max-w-xs">
                      Děkujeme za váš zájem. Ozveme se vám do 24 hodin s konkrétní nabídkou.
                    </p>
                    <button
                      onClick={() => { setSent(false); setForm({ name: '', email: '', phone: '', model: '', message: '' }) }}
                      className="mt-6 text-sm text-[#1e7e34] font-semibold hover:underline"
                    >
                      Odeslat další poptávku
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5">
                      {/* Jméno */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                          Jméno a příjmení *
                        </label>
                        <div className="relative">
                          <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            name="name"
                            required
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Jan Novák"
                            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-[#1e7e34] focus:ring-1 focus:ring-[#1e7e34] transition-colors"
                          />
                        </div>
                      </div>

                      {/* Telefon */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                          Telefon
                        </label>
                        <div className="relative">
                          <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            type="tel"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            placeholder="+420 000 000 000"
                            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-[#1e7e34] focus:ring-1 focus:ring-[#1e7e34] transition-colors"
                          />
                        </div>
                      </div>
                    </div>

                    {/* E-mail */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                        E-mail *
                      </label>
                      <div className="relative">
                        <AtSign size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="email"
                          name="email"
                          required
                          value={form.email}
                          onChange={handleChange}
                          placeholder="jan.novak@email.cz"
                          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-[#1e7e34] focus:ring-1 focus:ring-[#1e7e34] transition-colors"
                        />
                      </div>
                    </div>

                    {/* Model */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                        Zájem o model
                      </label>
                      <div className="relative">
                        <Car size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <select
                          name="model"
                          value={form.model}
                          onChange={handleChange}
                          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-[#1e7e34] focus:ring-1 focus:ring-[#1e7e34] transition-colors appearance-none bg-white text-gray-700"
                        >
                          <option value="">Vyberte model (volitelné)</option>
                          {carModels.map((m) => (
                            <option key={m} value={m}>{m}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Zpráva */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                        Zpráva *
                      </label>
                      <div className="relative">
                        <MessageSquare size={15} className="absolute left-3 top-3.5 text-gray-400" />
                        <textarea
                          name="message"
                          required
                          value={form.message}
                          onChange={handleChange}
                          rows={4}
                          placeholder="Popište, jaký vůz hledáte — model, výbavu, barvu, rok výroby..."
                          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-[#1e7e34] focus:ring-1 focus:ring-[#1e7e34] transition-colors resize-none"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 bg-[#1e7e34] hover:bg-[#28a745] disabled:opacity-70 text-white font-bold py-3 px-6 rounded-md transition-colors text-sm"
                    >
                      {loading ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Odesílám…
                        </>
                      ) : (
                        <>
                          <Send size={15} />
                          Odeslat poptávku
                        </>
                      )}
                    </button>

                    <p className="text-xs text-gray-400 text-center">
                      Odesláním souhlasíte se zpracováním osobních údajů. Vaše data používáme výhradně pro odpověď na poptávku.
                    </p>
                  </form>
                )}
              </div>
            </motion.div>

            {/* Right info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-2 space-y-6"
            >
              {/* Dark card */}
              <div className="bg-gradient-to-br from-[#0d1f10] to-[#1a3d1e] rounded-lg p-8 text-white">
                <h3 className="text-xl font-black mb-2">Preferujete telefon?</h3>
                <p className="text-gray-300 text-sm leading-relaxed mb-6">
                  Zavolejte nám přímo — rádi vám zodpovíme jakékoli otázky a domluvíme se na dalším postupu.
                </p>
                <a
                  href="tel:+420733455966"
                  className="flex items-center gap-3 bg-[#1e7e34] hover:bg-[#28a745] text-white font-bold px-5 py-3 rounded-md transition-colors text-sm w-full justify-center"
                >
                  <Phone size={16} />
                  +420 733 455 966
                </a>
                <div className="mt-4 pt-4 border-t border-white/10 text-xs text-gray-400">
                  Dostupní Po–Pá 8:00–18:00 a So 9:00–13:00
                </div>
              </div>

              {/* FAQ */}
              <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-5 sm:p-8">
                <h3 className="font-black text-gray-900 mb-5">Časté dotazy</h3>
                <div className="space-y-5">
                  {[
                    {
                      q: 'Jak dlouho trvá celý proces?',
                      a: 'Od poptávky po předání klíčků obvykle 3–6 týdnů v závislosti na dostupnosti vozu.',
                    },
                    {
                      q: 'Vztahuje se na vůz záruka?',
                      a: 'Ano. Všechny vozy jsou nové nebo záruční s plnou zárukou Škoda Auto.',
                    },
                    {
                      q: 'Je třeba jezdit do zahraničí?',
                      a: 'Ne. Celý proces, včetně dopravy a registrace, zajišťujeme za vás.',
                    },
                    {
                      q: 'Jaká je výše poplatku za službu?',
                      a: 'Poplatek sdělíme transparentně předem. Je zahrnut v celkové ceně nabídky.',
                    },
                  ].map(({ q, a }) => (
                    <div key={q} className="border-b border-gray-100 pb-5 last:border-0 last:pb-0">
                      <div className="font-semibold text-gray-900 text-sm mb-1">{q}</div>
                      <div className="text-gray-500 text-sm leading-relaxed">{a}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
