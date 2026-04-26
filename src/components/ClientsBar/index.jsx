import { motion } from 'framer-motion'

const clients = [
  { name: 'Bayer', logo: '/logo/bayer.webp', url: 'https://www.bayer.com' },
  { name: 'Ahold Delhaize', logo: '/logo/ahold.webp', url: 'https://www.aholddelhaize.com' },
  { name: 'Borgesius', logo: '/logo/borgesius.webp', url: 'https://www.borgesius.nl' },
  { name: 'ADAC', logo: '/logo/adac.webp', url: 'https://www.adac.de' },
  { name: 'Amazon', logo: '/logo/amazon.webp', url: 'https://www.amazon.de' },
  { name: 'Bolt', logo: '/logo/bolt.webp', url: 'https://bolt.eu' },
]

export default function ClientsBar() {
  return (
    <section className="py-10 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center text-xs font-semibold uppercase tracking-widest text-gray-400 mb-8"
        >
          Mezi naše nejvýznamější zákazníky patří
        </motion.p>
      </div>

      {/* scroll wrapper — full width on mobile */}
      <div className="overflow-x-auto sm:overflow-visible scrollbar-hide">
        <div className="flex flex-nowrap sm:flex-wrap items-center justify-start sm:justify-center gap-10 sm:gap-12 lg:gap-16 pb-2 sm:pb-0 px-4 sm:px-6 sm:max-w-7xl sm:mx-auto w-max sm:w-auto">
          {clients.map((client, i) => (
            <motion.div
              key={client.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="flex items-center justify-center shrink-0"
            >
              <a href={client.url} target="_blank" rel="noopener noreferrer">
                <img
                  src={client.logo}
                  alt={client.name}
                  className="client-logo transition-all duration-300 hover:opacity-75"
                />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
