import { motion } from 'framer-motion'
import { ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react'

const steps = [
  'Koupíte vůz u nás',
  'Do 14 dnů najdete totožný vůz u jiného dealera levněji',
  'Pošlete nám nabídku — rozdíl dorovnáme',
]

export default function PriceGuarantee() {
  return (
    <section className="py-14 sm:py-20 bg-[#0d1f10] overflow-hidden relative">
      {/* background glow */}
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-[#1e7e34]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-[#28a745]/8 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* Left — text */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <div className="inline-flex items-center gap-2 bg-[#1e7e34]/20 border border-[#1e7e34]/40 text-[#86efac] text-xs font-bold px-4 py-1.5 rounded-full mb-5 tracking-wider uppercase">
              <ShieldCheck size={13} />
              Garance nejnižší ceny
            </div>

            <h2 className="text-3xl sm:text-4xl xl:text-5xl font-black text-white leading-tight mb-4">
              Najdete levněji?{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#28a745] to-[#86efac]">
                Dorovnáme rozdíl.
              </span>
            </h2>

            <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-8 max-w-lg">
              Jsme si jistí naší cenou. Pokud do <strong className="text-white">14 dnů od nákupu</strong> najdete totožný vůz u jiného autorizovaného dealera za nižší cenu — rozdíl vám bez řečí dorovnáme.
            </p>

            <a
              href="/kontakt"
              className="inline-flex items-center gap-2 bg-[#1e7e34] hover:bg-[#28a745] text-white font-bold px-6 py-3.5 rounded-md transition-colors text-sm"
            >
              Chci se zeptat
              <ArrowRight size={15} />
            </a>
          </motion.div>

          {/* Right — card */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.1 }}
          >
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8">
              {/* Shield icon big */}
              <div className="w-14 h-14 bg-[#1e7e34]/20 border border-[#1e7e34]/30 rounded-2xl flex items-center justify-center mb-6">
                <ShieldCheck size={28} className="text-[#28a745]" />
              </div>

              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Jak to funguje</p>

              <div className="space-y-4">
                {steps.map((step, i) => (
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.2 + i * 0.08 }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-7 h-7 rounded-full bg-[#1e7e34]/20 border border-[#1e7e34]/40 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-[#86efac] text-xs font-black">{i + 1}</span>
                    </div>
                    <span className="text-gray-200 text-sm leading-relaxed">{step}</span>
                  </motion.div>
                ))}
              </div>

              {/* divider */}
              <div className="border-t border-white/10 mt-6 pt-5">
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={16} className="text-[#28a745] shrink-0 mt-0.5" />
                  <p className="text-gray-400 text-xs leading-relaxed">
                    Garance platí na <strong className="text-gray-200">totožný model, výbavu a rok výroby</strong> u autorizovaného dealera v ČR nebo EU.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
