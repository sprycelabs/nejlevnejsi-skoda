import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Loader2, Tag } from 'lucide-react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import SEO from '../../components/SEO'

export default function AkceKveten() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form: {
            name: 'Zájem o akci Květen',
            email,
            phone: '',
            model: '',
            message: 'Zájem o slevový kód AKCE KVĚTEN — sleva 10 000 Kč na první objednávku.',
          },
          fileAttachments: [],
        }),
      })
      if (!res.ok) throw new Error()
      setSent(true)
    } catch {
      setError('Nepodařilo se odeslat. Zkuste to znovu.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <SEO title="Akce Květen" description="" noindex />
      <Navbar />

      <div className="min-h-[calc(100vh-100px)] mt-[100px] bg-[#0d1f10] flex items-center justify-center px-4">
        <div className="absolute inset-0 mt-[100px] bg-gradient-to-br from-[#0d1f10] via-[#1a3d1e] to-[#0a1508] pointer-events-none" />

        <AnimatePresence mode="wait">
          {sent ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative z-10 text-center"
            >
              <div className="w-20 h-20 bg-[#1e7e34]/20 border border-[#1e7e34]/40 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={40} className="text-[#28a745]" />
              </div>
              <h2 className="text-3xl font-black text-white mb-3">Máme to!</h2>
              <p className="text-gray-300 text-lg">
                Ozveme se vám se slevovým kódem co nejdříve.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative z-10 w-full max-w-md text-center"
            >
              <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-500/40 rounded-full px-4 py-1.5 mb-6">
                <Tag size={13} className="text-orange-400" />
                <span className="text-orange-400 text-sm font-bold uppercase tracking-wider">Akce Květen · zbývá jen 10 míst!</span>
              </div>

              <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-3">
                Ušetřete <span className="text-orange-400 whitespace-nowrap">10 000 Kč</span><br />na první objednávku
              </h1>
              <p className="text-gray-300 text-lg mb-2">
                Jen prvních <strong className="text-white">10 zákazníků</strong> v květnu získá slevový kód.
              </p>
              <p className="text-gray-500 text-sm mb-10">
                Místa se rychle plní — zadejte e-mail a kód vám pošleme obratem.
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError('') }}
                  placeholder="váš@email.cz"
                  className="flex-1 bg-white/10 border border-white/20 text-white placeholder-gray-500 rounded-md px-4 py-3.5 text-sm focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 transition-colors"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-400 disabled:opacity-60 text-white font-black px-7 py-3.5 rounded-md transition-colors whitespace-nowrap"
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : null}
                  {loading ? 'Odesílám…' : 'Chci kód, dokud zbývá!'}
                </button>
              </form>

              {error && (
                <p className="text-red-400 text-sm mt-3">{error}</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Footer />
    </>
  )
}
