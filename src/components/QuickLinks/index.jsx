import { motion } from 'framer-motion'
import { Car, Tag, Banknote, Wrench } from 'lucide-react'

const links = [
  {
    icon: Car,
    title: 'Nové skladové vozy',
    desc: 'Ihned k odběru',
    href: '#vozy',
    bg: 'bg-[#1e7e34]',
  },
  {
    icon: Tag,
    title: 'Akční nabídky',
    desc: 'Slevy až 20 %',
    href: '#vozy',
    bg: 'bg-[#145523]',
  },
  {
    icon: Banknote,
    title: 'Financování',
    desc: 'Výhodné podmínky',
    href: '#kontakt',
    bg: 'bg-[#1e7e34]',
  },
  {
    icon: Wrench,
    title: 'Servis & záruka',
    desc: 'Plná tovární záruka',
    href: '#jak-to-funguje',
    bg: 'bg-[#145523]',
  },
]

export default function QuickLinks() {
  return (
    <section className="py-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 pt-6 sm:pt-8 relative z-10">
          {links.map((item, i) => (
            <motion.a
              key={item.title}
              href={item.href}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className={`${item.bg} text-white rounded-lg p-3 sm:p-6 flex flex-col items-center text-center gap-2 sm:gap-3 shadow-lg hover:shadow-xl transition-shadow cursor-pointer`}
            >
              <div className="w-10 h-10 sm:w-14 sm:h-14 bg-white/15 rounded-md flex items-center justify-center">
                <item.icon size={26} strokeWidth={1.5} />
              </div>
              <div>
                <div className="font-bold text-sm sm:text-base leading-tight">{item.title}</div>
                <div className="text-white/70 text-xs sm:text-sm mt-0.5">{item.desc}</div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}
