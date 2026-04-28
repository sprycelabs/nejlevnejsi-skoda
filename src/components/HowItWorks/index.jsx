import { motion } from 'framer-motion'
import { MousePointerClick, ClipboardCheck, MapPin } from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: MousePointerClick,
    title: 'Vyberte vůz',
    desc: 'Vyberte si z naší nabídky nakonfigurovaných vozů nebo nám zašlete konfiguraci z webu Škoda-Auto a my vám připravíme nabídku na totožný vůz.',
  },
  {
    number: '02',
    icon: ClipboardCheck,
    title: 'My zajistíme vše',
    desc: 'Analyzujeme nabídky dealerů po celé EU, vybereme nejlevnější Škodu odpovídající vaší konfiguraci, zajistíme objednávku, komunikaci s dealerem, logistiku a veškerou administrativu.',
  },
  {
    number: '03',
    icon: MapPin,
    title: 'Převezmete vůz v ČR',
    desc: 'Váš nový vůz dorazí přímo do ČR s plnou tovární zárukou. Vyřídíme registraci, přihlášení a předání — nákup Škody v zahraničí nikdy nebyl jednodušší.',
  },
]

export default function HowItWorks() {
  return (
    <section id="jak-to-funguje" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[#1e7e34] font-semibold text-sm uppercase tracking-wider mb-2"
          >
            Jednoduchý proces
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 mb-4"
          >
            Jak funguje dovoz Škody z EU?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 text-lg"
          >
            Celý dovoz Škody z EU vyřídíme za vás – od výběru vozu po předání klíčků v ČR.
          </motion.p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line (desktop) */}
          <div className="hidden lg:block absolute top-16 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-transparent via-[#1e7e34]/30 to-transparent" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 lg:gap-12">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="flex flex-col items-center text-center"
              >
                {/* Icon circle */}
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-[#f0faf2] border-2 border-[#1e7e34]/20 rounded-lg flex items-center justify-center group-hover:border-[#1e7e34] transition-colors">
                    <step.icon size={32} className="text-[#1e7e34]" strokeWidth={1.5} />
                  </div>
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-[#1e7e34] text-white text-xs font-black rounded-full flex items-center justify-center shadow-md">
                    {i + 1}
                  </div>
                </div>

                <h3 className="text-xl font-black text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-500 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-14 bg-gradient-to-br from-[#0d1f10] to-[#1a3d1e] rounded-lg p-6 sm:p-8 lg:p-12 text-center"
        >
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-white mb-3">
            Máte zájem o Škodu z EU? Nezávazně se nás zeptejte.
          </h3>
          <p className="text-gray-300 mb-8 max-w-lg mx-auto">
            Rádi vám připravíme konkrétní nabídku na dovoz Škody z EU — Octavia, Fabia, Kodiaq, Superb nebo jakýkoliv jiný model.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="tel:+420733455966"
              className="bg-[#1e7e34] hover:bg-[#28a745] text-white font-bold px-8 py-4 rounded-md transition-colors"
            >
              Zavolat: +420 733 455 966
            </a>
            <a
              href="mailto:info@nejlevnejsi-skoda.cz"
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-8 py-4 rounded-md transition-colors"
            >
              Napsat e-mail
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
