import { useState } from 'react'
import { Phone, X, MessageCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const WA_NUMBER = '420733455966'
const PHONE = '+420733455966'

export default function FloatingActions() {
  const [open, setOpen] = useState(false)

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.92 }}
            transition={{ duration: 0.18 }}
            className="flex flex-col gap-2 mb-1"
          >
            <a
              href={`https://wa.me/${WA_NUMBER}?text=Dobrý%20den%2C%20mám%20zájem%20o%20více%20informací%20o%20vozech%20na%20nejlevnejsi-skoda.cz`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-white shadow-lg border border-gray-100 rounded-full pl-4 pr-5 py-3 text-sm font-semibold text-gray-800 hover:shadow-xl transition-all hover:-translate-y-0.5"
            >
              <span className="w-8 h-8 bg-[#25d366] rounded-full flex items-center justify-center shrink-0">
                <MessageCircle size={16} className="text-white" />
              </span>
              WhatsApp
            </a>
            <a
              href={`tel:${PHONE}`}
              className="flex items-center gap-3 bg-white shadow-lg border border-gray-100 rounded-full pl-4 pr-5 py-3 text-sm font-semibold text-gray-800 hover:shadow-xl transition-all hover:-translate-y-0.5"
            >
              <span className="w-8 h-8 bg-[#1e7e34] rounded-full flex items-center justify-center shrink-0">
                <Phone size={16} className="text-white" />
              </span>
              Zavolat nám
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileTap={{ scale: 0.93 }}
        onClick={() => setOpen(o => !o)}
        className={`flex items-center gap-2.5 shadow-xl rounded-full font-bold text-white text-sm px-5 py-3.5 transition-all ${
          open ? 'bg-gray-700' : 'bg-[#1e7e34] hover:bg-[#28a745]'
        }`}
        style={{ boxShadow: open ? undefined : '0 4px 24px rgba(30,126,52,0.45)' }}
      >
        {open ? <X size={17} /> : <Phone size={17} />}
        {open ? 'Zavřít' : 'Ozvěte se mi'}
      </motion.button>
    </div>
  )
}
