import { motion } from 'framer-motion'
import { Heart, Car, ArrowRight, Download, FileText } from 'lucide-react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import SEO from '../../components/SEO'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay },
})

const heroFadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay },
})

export default function Pomahame() {
  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Nejlevnější Škoda pomáhá | Život dětem"
        description="Z každého prodaného vozu věnujeme 1 000 Kč nadaci Život dětem. Pomáháme vážně nemocným dětem a jejich rodinám po celé České republice."
        canonical="/pomahame"
      />
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center bg-[#0a1a0c] overflow-hidden">
        {/* background texture */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_#1e7e34_0%,_transparent_60%)] opacity-40 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_#0d3318_0%,_transparent_70%)] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full pt-32 pb-20 sm:py-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 border border-[#4ade80]/30 rounded-full px-4 py-1.5 mb-8"
              >
                <Heart size={13} className="text-[#4ade80]" fill="#4ade80" />
                <span className="text-[#4ade80] text-xs font-bold uppercase tracking-widest">Nejlevnější Škoda pomáhá</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.05] mb-8"
              >
                Společně<br />
                pomáháme<br />
                <span className="text-[#4ade80]">tam, kde je to</span><br />
                <span className="text-[#4ade80]">potřeba</span>
              </motion.h1>

              <p className="text-gray-300 text-lg leading-relaxed mb-10 max-w-lg">
                Věříme, že úspěšné podnikání by mělo mít i společenský rozměr. Proto každý prodaný vůz znamená víc než jen radost z nové Škody.
              </p>

              <a
                href="/vozy"
                className="inline-flex items-center gap-3 bg-white hover:bg-green-50 text-[#1e7e34] font-bold px-8 py-4 rounded-xl transition-colors text-base group shadow-lg"
              >
                Prohlédnout vozy
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            {/* Right — big stat */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <div className="w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-[#1e7e34]/10 border border-[#1e7e34]/20 flex flex-col items-center justify-center text-center p-8">
                  <Heart size={32} className="text-[#4ade80] mb-4" fill="#4ade80" />
                  <div className="text-6xl sm:text-7xl font-black text-white leading-none mb-2">1 000</div>
                  <div className="text-[#4ade80] font-bold text-lg">Kč z každého vozu</div>
                  <div className="text-gray-500 text-sm mt-2">dle vašeho výběru nadaci</div>
                </div>
                <div className="absolute inset-0 rounded-full border border-[#1e7e34]/10 scale-110 pointer-events-none" />
                <div className="absolute inset-0 rounded-full border border-[#1e7e34]/5 scale-125 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Proč to děláme */}
      <section className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-start">
            <motion.div {...fadeUp()}>
              <p className="text-[#1e7e34] font-bold text-sm uppercase tracking-widest mb-4">Naše myšlenka</p>
              <h2 className="text-4xl sm:text-5xl font-black text-gray-900 leading-tight mb-6">
                Naším cílem není pouze prodávat auta
              </h2>
              <p className="text-gray-500 text-lg leading-relaxed">
                Věříme, že úspěšné podnikání by mělo mít i společenský rozměr. Proto jsme navázali spolupráci s nadacemi <strong className="text-gray-800">Život dětem</strong> a <strong className="text-gray-800">Dobrý anděl</strong>, které pomáhají vážně nemocným dětem a jejich rodinám po celé České republice.
              </p>
            </motion.div>

            <div className="space-y-6">
              {[
                {
                  num: '01',
                  title: 'Z každého vozu 1 000 Kč',
                  text: 'Z každého nově prodaného automobilu věnujeme 1 000 Kč na podporu projektů nadace Život dětem. Každý zákazník se tak svým nákupem stává součástí dobré věci.',
                },
                {
                  num: '02',
                  title: 'Automobil k užívání',
                  text: 'Nadaci bezplatně poskytujeme osobní automobil k užívání na dobu jednoho roku. Spolehlivý vůz usnadní každodenní práci pracovníků, návštěvy rodin i organizaci charitativních akcí.',
                },
              ].map((item, i) => (
                <motion.div key={item.num} {...fadeUp(i * 0.1)} className="flex gap-6 p-6 rounded-2xl border border-gray-100 hover:border-[#1e7e34]/30 hover:shadow-sm transition-all">
                  <span className="text-4xl font-black text-gray-300 shrink-0 leading-none">{item.num}</span>
                  <div>
                    <h3 className="font-black text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{item.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Dark quote section */}
      <section className="py-28 bg-[#0a1a0c]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div {...fadeUp()}>
            <Heart size={40} className="text-[#4ade80] mx-auto mb-8" fill="#4ade80" />
            <blockquote className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-8">
              "Každý vůz, který si u nás pořídíte, znamená nejen radost z nové Škody, ale také konkrétní pomoc dětem."
            </blockquote>
            <p className="text-gray-500 text-lg">
              Děkujeme všem zákazníkům za důvěru. Právě díky vám můžeme společně pomáhat tam, kde je to skutečně potřeba.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Naše nadace */}
      <section className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div {...fadeUp()} className="text-center mb-16">
            <p className="text-[#1e7e34] font-bold text-sm uppercase tracking-widest mb-4">Podporujeme</p>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900">Podporujeme dvě nadace</h2>
            <p className="text-gray-500 text-lg mt-4 max-w-xl mx-auto">Z každého prodaného vozu věnujeme 1 000 Kč — sami si vyberete, které nadaci váš příspěvek poputuje.</p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Život dětem */}
            <motion.div {...fadeUp(0.05)} className="bg-gray-50 rounded-3xl p-10 flex flex-col">
              <div className="h-20 flex items-center mb-8">
                <img src="/pomaha/zivot_detem.webp?v=2" alt="Život dětem" className="h-full w-auto object-contain" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-3">Život dětem</h3>
              <p className="text-gray-500 leading-relaxed flex-1 mb-8">
                Život dětem o.p.s. již řadu let pomáhá vážně nemocným dětem a jejich rodinám po celé České republice. Finančně i prakticky podporuje rodiny v nejtěžších chvílích jejich života.
              </p>
              <a
                href="https://www.zivotdetem.cz"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#1e7e34] font-bold hover:underline self-start"
              >
                zivotdetem.cz <ArrowRight size={16} />
              </a>
            </motion.div>

            {/* Dobrý anděl */}
            <motion.div {...fadeUp(0.1)} className="bg-gray-50 rounded-3xl p-10 flex flex-col">
              <div className="h-20 flex items-center mb-8">
                <img src="/pomaha/dobry_andel.webp?v=2" alt="Dobrý anděl" className="h-full w-auto object-contain" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-3">Dobrý anděl</h3>
              <p className="text-gray-500 leading-relaxed flex-1 mb-8">
                Nadace Dobrý anděl pomáhá rodinám s dětmi, které se ocitly v těžké životní situaci způsobené nemocí. Každý měsíc posílá finanční podporu přímo rodinám, které to nejvíce potřebují.
              </p>
              <a
                href="https://www.dobryandel.cz"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#1e7e34] font-bold hover:underline self-start"
              >
                dobryandel.cz <ArrowRight size={16} />
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Certifikát */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <motion.div {...fadeUp()} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 flex flex-col sm:flex-row items-center gap-6">
            <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center shrink-0">
              <FileText size={26} className="text-[#1e7e34]" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <p className="font-black text-gray-900 text-lg">Certifikát spolupráce s nadacemi</p>
              <p className="text-gray-500 text-sm mt-1">Doklad o naší spolupráci s nadacemi Život dětem a Dobrý anděl.</p>
            </div>
            <a
              href="/doc/certifikat.pdf"
              download
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#1e7e34] hover:bg-[#28a745] text-white text-sm font-bold px-5 py-3 rounded-xl transition-colors shrink-0"
            >
              <Download size={15} />
              Stáhnout
            </a>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-[#1e7e34]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <motion.div {...fadeUp()}>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Pořiďte si Škodu a pomozte s námi</h2>
            <p className="text-green-200 text-lg mb-10">Každý nákup má smysl navíc.</p>
            <a
              href="/vozy"
              className="inline-flex items-center gap-3 bg-white text-[#1e7e34] font-black px-8 py-4 rounded-xl hover:bg-green-50 transition-all text-base sm:text-lg group"
            >
              Prohlédnout vozy
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
