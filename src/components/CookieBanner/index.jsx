import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cookie, X, ShieldCheck } from 'lucide-react'

const CONSENT_KEY = 'njs_cookie_consent'

function applyConsent(value) {
  if (typeof window.gtag !== 'function') return
  if (value === 'granted') {
    window.gtag('consent', 'update', {
      analytics_storage:  'granted',
      ad_storage:         'denied',
      ad_user_data:       'denied',
      ad_personalization: 'denied',
    })
    // Odešli první page view až po souhlasu
    window.gtag('event', 'page_view')
  } else {
    window.gtag('consent', 'update', {
      analytics_storage:  'denied',
      ad_storage:         'denied',
      ad_user_data:       'denied',
      ad_personalization: 'denied',
    })
  }
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(CONSENT_KEY)
    if (saved) {
      // Obnov souhlas z minulé návštěvy
      applyConsent(saved)
    } else {
      // Žádná volba dosud — zobraz banner
      setVisible(true)
    }
  }, [])

  function accept() {
    localStorage.setItem(CONSENT_KEY, 'granted')
    applyConsent('granted')
    setVisible(false)
  }

  function decline() {
    localStorage.setItem(CONSENT_KEY, 'denied')
    applyConsent('denied')
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 28 }}
          className="fixed bottom-0 left-0 right-0 z-[9999] px-4 pb-4 sm:pb-5"
        >
          <div className="max-w-5xl mx-auto bg-[#0d1f10] border border-white/10 rounded-xl shadow-2xl shadow-black/40 px-5 py-4 sm:px-7 sm:py-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">

              {/* Icon + text */}
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="w-9 h-9 bg-[#1e7e34]/20 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                  <Cookie size={18} className="text-[#28a745]" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm mb-0.5">Tento web používá cookies</p>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    Analytické cookies nám pomáhají zlepšovat web. Žádné osobní údaje neprodáváme třetím stranám.{' '}
                    <a href="/doc/gdpr.docx" download className="text-[#28a745] hover:underline">Zásady ochrany soukromí</a>
                  </p>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                <button
                  onClick={decline}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 border border-white/20 hover:border-white/40 text-gray-300 hover:text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors"
                >
                  <X size={13} />
                  Odmítnout
                </button>
                <button
                  onClick={accept}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-[#1e7e34] hover:bg-[#28a745] text-white text-xs font-bold px-5 py-2.5 rounded-lg transition-colors shadow-lg shadow-green-900/40"
                >
                  <ShieldCheck size={13} />
                  Přijmout vše
                </button>
              </div>

            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
