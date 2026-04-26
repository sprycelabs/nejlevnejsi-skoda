import { motion } from 'framer-motion'
import { Search, ShoppingCart, Truck, FileCheck, ExternalLink, ChevronRight } from 'lucide-react'

const steps = [
  { icon: Search, text: 'Analyzujeme dostupné nabídky v rámci EU' },
  { icon: ShoppingCart, text: 'Vybereme optimální konfiguraci a zdroj nákupu' },
  { icon: FileCheck, text: 'Zajistíme objednávku i komunikaci s dodavatelem' },
  { icon: Truck, text: 'Organizujeme logistiku a přepravu vozu do ČR' },
  { icon: FileCheck, text: 'Vyřídíme kompletní přihlášení vozidla' },
  { icon: Truck, text: 'Auto vám dovezeme až domů' },
]

export default function ProcessSection() {
  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left — photo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative order-2 lg:order-1"
          >
            {/* Background shape */}
            <div className="absolute -inset-4 bg-gradient-to-br from-[#f0faf2] to-[#e6f4e9] rounded-lg -z-10" />

            {/* Floating badge — desktop only */}
            <div className="hidden lg:flex absolute top-4 left-4 bg-white rounded-lg shadow-xl px-4 py-3 items-center gap-3">
              <div className="w-9 h-9 bg-[#f0faf2] rounded-md flex items-center justify-center shrink-0">
                <span className="text-[#1e7e34] font-black text-sm">20%</span>
              </div>
              <div>
                <div className="font-bold text-gray-900 text-sm leading-tight">Průměrná úspora</div>
                <div className="text-xs text-gray-500">oproti ČR cenám</div>
              </div>
            </div>

            <img
              src="/car-01.webp"
              alt="Škoda vůz z EU"
              className="w-full object-contain drop-shadow-2xl pt-4 lg:pt-0"
            />

            {/* Badge mobile — pod fotkou */}
            <div className="lg:hidden flex items-center gap-3 bg-white rounded-lg shadow-md px-4 py-3 mt-3 w-fit">
              <div className="w-9 h-9 bg-[#f0faf2] rounded-md flex items-center justify-center shrink-0">
                <span className="text-[#1e7e34] font-black text-sm">20%</span>
              </div>
              <div>
                <div className="font-bold text-gray-900 text-sm leading-tight">Průměrná úspora</div>
                <div className="text-xs text-gray-500">oproti ČR cenám</div>
              </div>
            </div>
          </motion.div>

          {/* Right — text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-1 lg:order-2"
          >
            <p className="text-[#1e7e34] font-semibold text-sm uppercase tracking-wider mb-3">
              Vyberte si vůz
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 mb-2">
              Z nabídky nebo vlastní konfigurace.
            </h2>

            <p className="text-gray-600 leading-relaxed mb-4">
              Vyberte si z naší nabídky již nakonfigurovaných vozidel, vozidlo kupte a my vám jej dodáme.
            </p>
            <p className="text-gray-600 leading-relaxed mb-3">
              Nebo si na{' '}
              <a
                href="https://www.skoda-auto.cz/modely"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[#1e7e34] font-semibold hover:underline"
              >
                oficiálním webu Škoda-Auto
                <ExternalLink size={13} />
              </a>{' '}
              nakonfigurujte svůj vůz, konfiguraci nám zašlete a my vám uděláme nabídku na zcela totožné vozidlo od našich dealerů.
            </p>

            <div className="my-6 border-t border-gray-100" />

            <p className="font-bold text-gray-900 mb-4">Celý proces přebíráme za vás:</p>

            <ul className="space-y-3 mb-8">
              {steps.map((step, i) => (
                <motion.li
                  key={step.text}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-6 h-6 bg-[#f0faf2] rounded-md flex items-center justify-center shrink-0 mt-0.5">
                    <ChevronRight size={14} className="text-[#1e7e34]" />
                  </div>
                  <span className="text-gray-600 text-sm leading-relaxed">{step.text}</span>
                </motion.li>
              ))}
            </ul>

            <p className="text-gray-500 text-sm italic mb-8">
              Vyhnete se složité administrativě, jazykovým bariérám i časově náročnému porovnávání nabídek.
            </p>

            <div className="flex flex-wrap lg:flex-nowrap gap-3 items-center">
              <a
                href="/vozy"
                className="flex items-center gap-2 bg-[#145523] hover:bg-[#1e7e34] text-white font-bold px-6 py-3 rounded-md transition-colors text-sm"
              >
                Koupit hned
              </a>
              <a
                href="https://www.skoda-auto.cz/modely"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 border border-gray-200 hover:border-[#1e7e34] text-gray-700 hover:text-[#1e7e34] font-semibold px-6 py-3 rounded-md transition-colors text-sm"
              >
                Konfigurovat na Škoda-Auto
                <ExternalLink size={14} />
              </a>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
