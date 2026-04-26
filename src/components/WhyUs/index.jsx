import { motion } from 'framer-motion'
import { BadgePercent, ShieldCheck, Globe, HeartHandshake, Clock, FileCheck } from 'lucide-react'

const benefits = [
  {
    icon: BadgePercent,
    title: 'Garantovaná úspora',
    desc: 'V průměru 20 % nižší cena oproti nákupu stejného vozu v ČR. Nejde o náhodu – využíváme reálné cenové rozdíly mezi trhy EU.',
  },
  {
    icon: ShieldCheck,
    title: 'Prodloužená záruka v ceně',
    desc: 'Každý vůz dodáváme s prodlouženou zárukou 3 roky / 150 000 km. Servis zajistíte u každého autorizovaného Škoda servisu v ČR i v EU.',
  },
  {
    icon: Globe,
    title: 'Celá EU v hledáčku',
    desc: 'Sledujeme nabídky u stovek dealerů napříč Evropou a vybíráme tu nejoptimálnější kombinaci ceny, specifikace a dostupnosti.',
  },
  {
    icon: HeartHandshake,
    title: 'Bez kompromisů',
    desc: 'Dostanete přesně ten vůz, který chcete – se správnou výbavou, barvou i doplňky. Žádné náhradní řešení.',
  },
  {
    icon: Clock,
    title: 'Kompletní servis',
    desc: 'Od výběru vozu po předání klíčků – objednávku, logistiku, dopravu, přihlášení i STK vyřídíme za vás.',
  },
  {
    icon: FileCheck,
    title: 'Transparentní cena',
    desc: 'Předem víte, kolik zaplatíte. Žádné skryté poplatky, žádná překvapení. Vše je zahrnuto ve výsledné ceně.',
  },
]

export default function WhyUs() {
  return (
    <section id="o-nas" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[#1e7e34] font-semibold text-sm uppercase tracking-wider mb-2"
          >
            Proč si vybrat nás
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 mb-4"
          >
            Transparentnost, úspora a klid
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 text-lg"
          >
            Neprodáváme auta – optimalizujeme jejich pořízení.
          </motion.p>
        </div>

        {/* Benefits grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {benefits.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="bg-white rounded-lg p-7 border border-gray-100 hover:border-[#1e7e34]/30 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-[#f0faf2] group-hover:bg-[#1e7e34] rounded-md flex items-center justify-center mb-5 transition-colors duration-300">
                <item.icon size={22} className="text-[#1e7e34] group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
