import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sun, CheckCircle2, ArrowRight, ShieldCheck, Truck, Star, Users, Ticket } from 'lucide-react'

const TOTAL_COUPONS = 11
const USED_COUPONS  = 0   // aktualizovat manuálně
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import SEO from '../../components/SEO'

export default function AkceDovolena() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email.trim()) { setError('Zadejte prosím svůj e-mail.'); return }
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/akce-dovolena', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.message || 'Nepodařilo se odeslat žádost.')
      }
      setSuccess(true)
    } catch (err) {
      setError(err.message || 'Něco se pokazilo. Zkuste to znovu.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <SEO
        title="Škoda na dovolenou — sleva 10 000 Kč"
        description="Začíná léto a s ním naše speciální akce. Kupte novou Škodu s okamžitou slevou 10 000 Kč a vyrazte na dovolenou v novém autě. Omezený počet kuponů."
        canonical="/akce-dovolena"
      />
      <Navbar />

      <div className="min-h-[calc(100vh-100px)] mt-[100px] relative overflow-hidden flex items-center justify-center px-4 py-16">
        {/* Gradient pozadí — od zelené ke sky blue */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d1f10] via-[#0c3547] to-[#0a1a2e]" />

        {/* Dekorativní kruhy */}
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-[#1e7e34]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Grid */}
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        <div className="relative z-10 w-full max-w-lg">
          <AnimatePresence mode="wait">
            {!success ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center"
              >
                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-cyan-500/20 border border-cyan-500/40 rounded-full px-4 py-1.5 mb-6">
                  <Sun size={13} className="text-cyan-400" />
                  <span className="text-cyan-400 text-sm font-bold uppercase tracking-wider">Škoda na dovolenou</span>
                </div>

                {/* Nadpis */}
                <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-3">
                  Škoda{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-[#86efac]">
                    nevzít
                  </span>
                </h1>
                <p className="text-gray-300 text-lg mb-2 leading-relaxed">
                  Léto je tady. A s ním i ta nejlepší jízda roku.
                </p>
                <p className="text-gray-400 text-sm mb-8 leading-relaxed max-w-sm mx-auto">
                  Nová Škoda jako spolehlivý parťák k moři, do hor i na výlet s celou rodinou.
                  Teď s okamžitou slevou <strong className="text-white">10 000 Kč</strong>.
                </p>

                {/* Karta */}
                <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6 text-left">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-white font-black text-lg">−10 000 Kč</span>
                    <span className="bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-bold px-3 py-1 rounded-full">
                      Omezený počet kuponů
                    </span>
                  </div>

                  {/* Počítadlo kuponů */}
                  <div className="mb-5 p-3 bg-white/5 rounded-xl border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <Ticket size={12} className="text-cyan-400" />
                        Zbývající kupony
                      </div>
                      <span className="text-white font-black text-sm">
                        {TOTAL_COUPONS - USED_COUPONS}
                        <span className="text-gray-500 font-normal"> / {TOTAL_COUPONS}</span>
                      </span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-[#28a745] rounded-full transition-all"
                        style={{ width: `${((TOTAL_COUPONS - USED_COUPONS) / TOTAL_COUPONS) * 100}%` }}
                      />
                    </div>
                    {(TOTAL_COUPONS - USED_COUPONS) <= 3 && (
                      <p className="text-orange-400 text-xs mt-1.5 font-semibold">
                        ⚡ Poslední {TOTAL_COUPONS - USED_COUPONS} kupony!
                      </p>
                    )}
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                      <input
                        type="email"
                        value={email}
                        onChange={e => { setEmail(e.target.value); setError('') }}
                        placeholder="váš@email.cz"
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 text-sm outline-none focus:border-cyan-400/60 transition-colors"
                      />
                      {error && <p className="text-red-400 text-xs mt-1.5">{error}</p>}
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-colors text-sm"
                    >
                      {loading ? 'Odesílám…' : <>Chci slevový kód <ArrowRight size={15} /></>}
                    </button>
                  </form>

                  <p className="text-gray-500 text-xs mt-3 text-center">
                    Kód vám pošleme na e-mail. Platný na první objednávku.
                  </p>
                </div>

                {/* Výhody */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: ShieldCheck, text: 'Plná tovární záruka' },
                    { icon: Truck,       text: 'Doprava a registrace zdarma' },
                    { icon: Star,        text: 'Nové vozy 2026, 0 km' },
                    { icon: Users,       text: 'Stovky spokojených zákazníků' },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-2 text-gray-400 text-xs">
                      <Icon size={13} className="text-cyan-400 shrink-0" />
                      {text}
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className="w-20 h-20 bg-cyan-500/10 border border-cyan-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={40} className="text-cyan-400" />
                </div>
                <h2 className="text-4xl font-black text-white mb-3">Hotovo!</h2>
                <p className="text-gray-300 text-lg mb-2">
                  Slevový kód jsme vám odeslali na <strong className="text-white">{email}</strong>.
                </p>
                <p className="text-gray-500 text-sm mb-8">
                  Zkontrolujte i složku se spamem. Kód je platný 30 dní.
                </p>
                <a
                  href="/vozy"
                  className="inline-flex items-center gap-2 bg-[#1e7e34] hover:bg-[#28a745] text-white font-bold px-6 py-3 rounded-md transition-colors"
                >
                  Prohlédnout vozy <ArrowRight size={15} />
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <Footer />
    </>
  )
}
