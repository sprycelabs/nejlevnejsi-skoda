import { motion } from 'framer-motion'
import { Tag, XCircle } from 'lucide-react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import SEO from '../../components/SEO'

export default function AkceKveten() {
  return (
    <>
      <SEO title="Akce Květen" description="" noindex />
      <Navbar />

      <div className="min-h-[calc(100vh-100px)] mt-[100px] bg-[#0d1f10] flex items-center justify-center px-4">
        <div className="absolute inset-0 mt-[100px] bg-gradient-to-br from-[#0d1f10] via-[#1a3d1e] to-[#0a1508] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 w-full max-w-md text-center"
        >
          <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-500/40 rounded-full px-4 py-1.5 mb-6">
            <Tag size={13} className="text-orange-400" />
            <span className="text-orange-400 text-sm font-bold uppercase tracking-wider">Akce Květen</span>
          </div>

          <div className="w-20 h-20 bg-orange-500/10 border border-orange-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle size={40} className="text-orange-400" />
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-4">
            Akce je u konce
          </h1>
          <p className="text-gray-300 text-lg mb-3">
            Dostupný počet kuponů byl již <strong className="text-white">vyčerpán</strong>.
          </p>
          <p className="text-gray-500 text-sm">
            Sledujte nás pro další akce a speciální nabídky.
          </p>

          <a
            href="/vozy"
            className="inline-flex items-center gap-2 mt-10 bg-[#1e7e34] hover:bg-[#28a745] text-white font-bold px-6 py-3 rounded-md transition-colors"
          >
            Prohlédnout vozy
          </a>
        </motion.div>
      </div>
      <Footer />
    </>
  )
}
