import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ShieldCheck, BadgePercent, Globe, HeartHandshake, Users, TrendingUp, ChevronRight, Phone, Mail, ArrowRight } from 'lucide-react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

const stats = [
  { value: '500+', label: 'spokojených zákazníků' },
  { value: '20 %', label: 'průměrná úspora oproti ČR' },
  { value: '15+', label: 'let zkušeností' },
  { value: '10+', label: 'zemí EU v síti' },
]

const values = [
  {
    icon: ShieldCheck,
    title: 'Transparentnost',
    desc: 'Předem víte přesně kolik zaplatíte, odkud vůz pochází a co vše je zahrnuto. Žádné skryté poplatky ani překvapení na konci.',
  },
  {
    icon: BadgePercent,
    title: 'Úspora',
    desc: 'Využíváme reálné cenové rozdíly mezi trhy EU. Průměrná úspora 20 % není marketingové číslo — je to průměr z reálných obchodů.',
  },
  {
    icon: HeartHandshake,
    title: 'Péče o zákazníka',
    desc: 'Provázíme vás celým procesem od první konzultace až po předání klíčků. Jsme dosažitelní a odpovídáme rychle.',
  },
  {
    icon: Globe,
    title: 'Znalost trhu',
    desc: 'Sledujeme nabídky stovek dealerů po celé Evropě. Víme, kde a kdy nakoupit, aby cena i podmínky byly pro vás co nejlepší.',
  },
]

const timeline = [
  {
    year: '2009',
    title: 'Začátky',
    desc: 'Firma vznikla z osobní zkušenosti zakladatele — který sám koupil vůz v Německu za výrazně nižší cenu a uvědomil si, že tento přístup může nabídnout i ostatním.',
  },
  {
    year: '2014',
    title: 'Specializace na Škoda',
    desc: 'Po letech zkušeností s různými značkami jsme se rozhodli specializovat výhradně na vozy Škoda Auto — brand s nejsilnějšími cenovými rozdíly v rámci EU.',
  },
  {
    year: '2018',
    title: 'Systém a škálování',
    desc: 'Vybudovali jsme vlastní systém sledování nabídek a síť ověřených partnerů v klíčových zemích EU. Objem obchodů překročil 100 vozů ročně.',
  },
  {
    year: '2026',
    title: 'Dnes',
    desc: 'Stovky spokojených zákazníků, od jednotlivců po firemní flotily. Každý případ řešíme individuálně, každý vůz s plnou zárukou a bez kompromisů.',
  },
]

export default function ONas() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero */}
      <section className="relative bg-[#0d1f10] overflow-hidden pt-24">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d1f10] via-[#1a3d1e] to-[#0a1508]" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#1e7e34]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 text-sm text-gray-400 pt-6 pb-4">
            <Link to="/" className="hover:text-white transition-colors">Domů</Link>
            <ChevronRight size={13} />
            <span className="text-gray-200">O nás</span>
          </div>

          <div className="max-w-3xl pb-16 pt-4">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[#28a745] font-semibold text-sm uppercase tracking-wider mb-3"
            >
              Kdo jsme
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-6"
            >
              Neprodáváme auta.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#28a745] to-[#86efac]">
                Optimalizujeme jejich pořízení.
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-gray-300 text-lg leading-relaxed"
            >
              Jsme nejlevnejsi-skoda.cz — specializovaný partner pro nákup vozů Škoda
              z evropských trhů. Díky přístupu k nabídkám stovek dealerů v celé EU zajišťujeme
              identické vozy za ceny, které čeští prodejci nenabídnou.
            </motion.p>
          </div>
        </div>

        <div className="relative z-10">
          <svg viewBox="0 0 1440 60" fill="none" className="w-full block">
            <path d="M0 60L1440 60L1440 30C1200 60 960 0 720 30C480 60 240 0 0 30L0 60Z" fill="#f9fafb" />
          </svg>
        </div>
      </section>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-2">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-white rounded-lg border border-gray-100 shadow-sm p-4 sm:p-6 text-center"
            >
              <div className="text-3xl font-black text-[#1e7e34] mb-1">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Příběh */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-[#1e7e34] font-semibold text-sm uppercase tracking-wider mb-3">Náš příběh</p>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-6">
                Vznikli jsme z jednoduché myšlenky
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  V rámci EU existují výrazné cenové rozdíly u stejných vozů — stejná Škoda Octavia
                  stojí v Německu, Belgii nebo Polsku o desítky tisíc méně než v České republice.
                  Není to náhoda ani chyba, je to strukturální rozdíl daný lokálními dealerskými maržemi
                  a poptávkou.
                </p>
                <p>
                  Náš zakladatel si toho všiml jako první u svého vlastního nákupu. Místo aby zaplatil
                  přes 800 000 Kč u českého dealera, pořídil identický vůz v zahraničí za výrazně méně.
                  Celý proces byl ale složitý — jazyková bariéra, administrativa, logistika.
                </p>
                <p>
                  Proto nejlevnejsi-skoda.cz vzniklo: aby tento proces zvládl za vás
                  kdokoliv, bez znalostí a bez starostí. Za stejnou cenu, za jakou si sami nakoupíme.
                </p>
              </div>
            </motion.div>

            {/* Timeline */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-0"
            >
              {timeline.map((item, i) => (
                <div key={item.year} className="flex gap-5 group">
                  {/* Line */}
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-[#1e7e34] rounded-full flex items-center justify-center shrink-0 shadow-md">
                      <span className="text-white text-xs font-black">{item.year.slice(2)}</span>
                    </div>
                    {i < timeline.length - 1 && <div className="w-0.5 flex-1 bg-gray-200 my-1" />}
                  </div>
                  {/* Content */}
                  <div className={`pb-8 ${i === timeline.length - 1 ? 'pb-0' : ''}`}>
                    <div className="text-xs font-bold text-[#1e7e34] uppercase tracking-wider mb-1">{item.year}</div>
                    <h3 className="font-black text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Hodnoty */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[#1e7e34] font-semibold text-sm uppercase tracking-wider mb-2"
            >
              Co nás definuje
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900"
            >
              Naše hodnoty
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="group p-6 rounded-lg border border-gray-100 hover:border-[#1e7e34]/30 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 bg-[#f0faf2] group-hover:bg-[#1e7e34] rounded-md flex items-center justify-center mb-5 transition-colors duration-300">
                  <v.icon size={22} className="text-[#1e7e34] group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="font-black text-gray-900 mb-2">{v.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pro koho */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-[#1e7e34] font-semibold text-sm uppercase tracking-wider mb-3">Naši zákazníci</p>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 mb-6">Pro koho to děláme</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Naše služby využívají jak soukromí zákazníci, tak firmy, které chtějí efektivně
                  obnovovat vozový park bez zbytečných nákladů.
                </p>
                <p>
                  Každý projekt řešíme individuálně — od jednoho vozu až po větší flotily.
                  Přístup je vždy stejný: transparentní cena, maximální úspora, nulové kompromisy
                  na zárukou ani kvalitou.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-8">
                {[
                  { icon: Users, title: 'Soukromé osoby', desc: 'Nový vůz pro rodinu bez přeplatků' },
                  { icon: TrendingUp, title: 'Firmy & flotily', desc: 'Efektivní obnova vozového parku' },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="bg-white rounded-lg border border-gray-100 p-5 shadow-sm">
                    <div className="w-10 h-10 bg-[#f0faf2] rounded-md flex items-center justify-center mb-3">
                      <Icon size={18} className="text-[#1e7e34]" />
                    </div>
                    <div className="font-bold text-gray-900 text-sm mb-1">{title}</div>
                    <div className="text-xs text-gray-500">{desc}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* CTA card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-[#0d1f10] to-[#1a3d1e] rounded-lg p-6 sm:p-10 text-white"
            >
              <h3 className="text-2xl font-black mb-3">Připraveni začít?</h3>
              <p className="text-gray-300 leading-relaxed mb-8">
                Napište nám nebo zavolejte. Nezávazně vám připravíme konkrétní nabídku
                na vůz, který chcete — s reálnou cenou z EU.
              </p>

              <div className="space-y-3 mb-8">
                <a href="tel:+420733455966" className="flex items-center gap-3 text-white hover:text-[#28a745] transition-colors">
                  <Phone size={16} className="text-[#28a745] shrink-0" />
                  +420 733 455 966
                </a>
                <a href="mailto:info@nejlevnejsi-skoda.cz" className="flex items-center gap-3 text-white hover:text-[#28a745] transition-colors">
                  <Mail size={16} className="text-[#28a745] shrink-0" />
                  info@nejlevnejsi-skoda.cz
                </a>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/vozy"
                  className="flex items-center justify-center gap-2 bg-[#1e7e34] hover:bg-[#28a745] text-white font-bold px-6 py-3 rounded-md transition-colors text-sm"
                >
                  Prohlédnout vozy <ArrowRight size={15} />
                </Link>
                <a
                  href="tel:+420733455966"
                  className="flex items-center justify-center gap-2 border border-white/20 hover:bg-white/10 text-white font-semibold px-6 py-3 rounded-md transition-colors text-sm"
                >
                  Zavolat nyní
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
