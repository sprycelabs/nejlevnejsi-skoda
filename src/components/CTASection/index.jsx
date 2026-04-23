import { motion } from 'framer-motion'
import { Phone, Mail, ArrowRight, MessageSquare } from 'lucide-react'

export default function CTASection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative bg-gradient-to-br from-[#0d1f10] via-[#1a3d1e] to-[#0a1508] rounded-lg overflow-hidden"
        >
          {/* Decorative glow */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#1e7e34]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#28a745]/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />

          <div className="relative z-10 px-6 sm:px-12 py-14 sm:py-16">
            <div className="grid lg:grid-cols-2 gap-10 items-center">

              {/* Left */}
              <div>
                <p className="text-[#86efac] font-semibold text-sm uppercase tracking-wider mb-3">
                  Nezávazná nabídka zdarma
                </p>
                <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-4">
                  Řekněte nám, jaký vůz chcete.{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#28a745] to-[#86efac]">
                    Zbytek je na nás.
                  </span>
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  Do 24 hodin připravíme konkrétní nabídku s reálnou cenou z EU trhu.
                  Bez skrytých poplatků, bez závazků.
                </p>
              </div>

              {/* Right — contact options */}
              <div className="flex flex-col gap-4">
                <a
                  href="tel:+420733455966"
                  className="group flex items-center gap-4 bg-[#1e7e34] hover:bg-[#28a745] text-white rounded-lg px-6 py-4 transition-colors"
                >
                  <div className="w-10 h-10 bg-white/15 rounded-md flex items-center justify-center shrink-0">
                    <Phone size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="font-black text-base">+420 733 455 966</div>
                    <div className="text-white/70 text-xs">Po–Pá 8:00–18:00 · So 9:00–13:00</div>
                  </div>
                  <ArrowRight size={18} className="opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </a>

                <a
                  href="mailto:info@nejlevnejsi-skoda.cz"
                  className="group flex items-center gap-4 bg-white/10 hover:bg-white/20 border border-white/15 text-white rounded-lg px-6 py-4 transition-colors"
                >
                  <div className="w-10 h-10 bg-white/15 rounded-md flex items-center justify-center shrink-0">
                    <Mail size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-sm">info@nejlevnejsi-skoda.cz</div>
                    <div className="text-white/60 text-xs">Odpovídáme do 24 hodin</div>
                  </div>
                  <ArrowRight size={18} className="opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </a>

                <a
                  href="/kontakt"
                  className="group flex items-center gap-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg px-6 py-4 transition-colors"
                >
                  <div className="w-10 h-10 bg-white/15 rounded-md flex items-center justify-center shrink-0">
                    <MessageSquare size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-sm">Nezávazná poptávka</div>
                    <div className="text-white/60 text-xs">Vyplňte formulář online</div>
                  </div>
                  <ArrowRight size={18} className="opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </a>
              </div>

            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
