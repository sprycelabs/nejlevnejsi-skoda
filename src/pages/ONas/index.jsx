import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ShieldCheck, BadgePercent, Globe, HeartHandshake, Users, TrendingUp, ChevronRight, Phone, Mail, ArrowRight } from 'lucide-react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

const stats = [
  { value: '500+', label: 'spokojenĂ˝ch zĂˇkaznĂ­kĹŻ' },
  { value: '20 %', label: 'prĹŻmÄ›rnĂˇ Ăşspora oproti ÄŚR' },
  { value: '15+', label: 'let zkuĹˇenostĂ­' },
  { value: '10+', label: 'zemĂ­ EU v sĂ­ti' },
]

const values = [
  {
    icon: ShieldCheck,
    title: 'Transparentnost',
    desc: 'PĹ™edem vĂ­te pĹ™esnÄ› kolik zaplatĂ­te, odkud vĹŻz pochĂˇzĂ­ a co vĹˇe je zahrnuto. Ĺ˝ĂˇdnĂ© skrytĂ© poplatky ani pĹ™ekvapenĂ­ na konci.',
  },
  {
    icon: BadgePercent,
    title: 'Ăšspora',
    desc: 'VyuĹľĂ­vĂˇme reĂˇlnĂ© cenovĂ© rozdĂ­ly mezi trhy EU. PrĹŻmÄ›rnĂˇ Ăşspora 20 % nenĂ­ marketingovĂ© ÄŤĂ­slo â€” je to prĹŻmÄ›r z reĂˇlnĂ˝ch obchodĹŻ.',
  },
  {
    icon: HeartHandshake,
    title: 'PĂ©ÄŤe o zĂˇkaznĂ­ka',
    desc: 'ProvĂˇzĂ­me vĂˇs celĂ˝m procesem od prvnĂ­ konzultace aĹľ po pĹ™edĂˇnĂ­ klĂ­ÄŤkĹŻ. Jsme dosaĹľitelnĂ­ a odpovĂ­dĂˇme rychle.',
  },
  {
    icon: Globe,
    title: 'Znalost trhu',
    desc: 'Sledujeme nabĂ­dky stovek dealerĹŻ po celĂ© EvropÄ›. VĂ­me, kde a kdy nakoupit, aby cena i podmĂ­nky byly pro vĂˇs co nejlepĹˇĂ­.',
  },
]

const timeline = [
  {
    year: '2009',
    title: 'ZaÄŤĂˇtky',
    desc: 'Firma vznikla z osobnĂ­ zkuĹˇenosti zakladatele â€” kterĂ˝ sĂˇm koupil vĹŻz v NÄ›mecku za vĂ˝raznÄ› niĹľĹˇĂ­ cenu a uvÄ›domil si, Ĺľe tento pĹ™Ă­stup mĹŻĹľe nabĂ­dnout i ostatnĂ­m.',
  },
  {
    year: '2014',
    title: 'Specializace na Ĺ koda',
    desc: 'Po letech zkuĹˇenostĂ­ s rĹŻznĂ˝mi znaÄŤkami jsme se rozhodli specializovat vĂ˝hradnÄ› na vozy Ĺ koda Auto â€” brand s nejsilnÄ›jĹˇĂ­mi cenovĂ˝mi rozdĂ­ly v rĂˇmci EU.',
  },
  {
    year: '2018',
    title: 'SystĂ©m a ĹˇkĂˇlovĂˇnĂ­',
    desc: 'Vybudovali jsme vlastnĂ­ systĂ©m sledovĂˇnĂ­ nabĂ­dek a sĂ­ĹĄ ovÄ›Ĺ™enĂ˝ch partnerĹŻ v klĂ­ÄŤovĂ˝ch zemĂ­ch EU. Objem obchodĹŻ pĹ™ekroÄŤil 100 vozĹŻ roÄŤnÄ›.',
  },
  {
    year: '2026',
    title: 'Dnes',
    desc: 'Stovky spokojenĂ˝ch zĂˇkaznĂ­kĹŻ, od jednotlivcĹŻ po firemnĂ­ flotily. KaĹľdĂ˝ pĹ™Ă­pad Ĺ™eĹˇĂ­me individuĂˇlnÄ›, kaĹľdĂ˝ vĹŻz s plnou zĂˇrukou a bez kompromisĹŻ.',
  },
]

export default function ONas() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero */}
      <section className="relative bg-[#0d1f10] overflow-hidden pt-40">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d1f10] via-[#1a3d1e] to-[#0a1508]" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#1e7e34]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 text-sm text-gray-400 pt-6 pb-4">
            <Link to="/" className="hover:text-white transition-colors">DomĹŻ</Link>
            <ChevronRight size={13} />
            <span className="text-gray-200">O nĂˇs</span>
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
              NeprodĂˇvĂˇme auta.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#28a745] to-[#86efac]">
                Optimalizujeme jejich poĹ™Ă­zenĂ­.
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-gray-300 text-lg leading-relaxed"
            >
              Jsme nejlevnejsi-skoda.cz â€” specializovanĂ˝ partner pro nĂˇkup vozĹŻ Ĺ koda
              z evropskĂ˝ch trhĹŻ. DĂ­ky pĹ™Ă­stupu k nabĂ­dkĂˇm stovek dealerĹŻ v celĂ© EU zajiĹˇĹĄujeme
              identickĂ© vozy za ceny, kterĂ© ÄŤeĹˇtĂ­ prodejci nenabĂ­dnou.
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

      {/* PĹ™Ă­bÄ›h */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-[#1e7e34] font-semibold text-sm uppercase tracking-wider mb-3">NĂˇĹˇ pĹ™Ă­bÄ›h</p>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-6">
                Vznikli jsme z jednoduchĂ© myĹˇlenky
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  V rĂˇmci EU existujĂ­ vĂ˝raznĂ© cenovĂ© rozdĂ­ly u stejnĂ˝ch vozĹŻ â€” stejnĂˇ Ĺ koda Octavia
                  stojĂ­ v NÄ›mecku, Belgii nebo Polsku o desĂ­tky tisĂ­c mĂ©nÄ› neĹľ v ÄŚeskĂ© republice.
                  NenĂ­ to nĂˇhoda ani chyba, je to strukturĂˇlnĂ­ rozdĂ­l danĂ˝ lokĂˇlnĂ­mi dealerskĂ˝mi marĹľemi
                  a poptĂˇvkou.
                </p>
                <p>
                  NĂˇĹˇ zakladatel si toho vĹˇiml jako prvnĂ­ u svĂ©ho vlastnĂ­ho nĂˇkupu. MĂ­sto aby zaplatil
                  pĹ™es 800 000 KÄŤ u ÄŤeskĂ©ho dealera, poĹ™Ă­dil identickĂ˝ vĹŻz v zahraniÄŤĂ­ za vĂ˝raznÄ› mĂ©nÄ›.
                  CelĂ˝ proces byl ale sloĹľitĂ˝ â€” jazykovĂˇ bariĂ©ra, administrativa, logistika.
                </p>
                <p>
                  Proto nejlevnejsi-skoda.cz vzniklo: aby tento proces zvlĂˇdl za vĂˇs
                  kdokoliv, bez znalostĂ­ a bez starostĂ­. Za stejnou cenu, za jakou si sami nakoupĂ­me.
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
              Co nĂˇs definuje
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900"
            >
              NaĹˇe hodnoty
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
              <p className="text-[#1e7e34] font-semibold text-sm uppercase tracking-wider mb-3">NaĹˇi zĂˇkaznĂ­ci</p>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 mb-6">Pro koho to dÄ›lĂˇme</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  NaĹˇe sluĹľby vyuĹľĂ­vajĂ­ jak soukromĂ­ zĂˇkaznĂ­ci, tak firmy, kterĂ© chtÄ›jĂ­ efektivnÄ›
                  obnovovat vozovĂ˝ park bez zbyteÄŤnĂ˝ch nĂˇkladĹŻ.
                </p>
                <p>
                  KaĹľdĂ˝ projekt Ĺ™eĹˇĂ­me individuĂˇlnÄ› â€” od jednoho vozu aĹľ po vÄ›tĹˇĂ­ flotily.
                  PĹ™Ă­stup je vĹľdy stejnĂ˝: transparentnĂ­ cena, maximĂˇlnĂ­ Ăşspora, nulovĂ© kompromisy
                  na zĂˇrukou ani kvalitou.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-8">
                {[
                  { icon: Users, title: 'SoukromĂ© osoby', desc: 'NovĂ˝ vĹŻz pro rodinu bez pĹ™eplatkĹŻ' },
                  { icon: TrendingUp, title: 'Firmy & flotily', desc: 'EfektivnĂ­ obnova vozovĂ©ho parku' },
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
              <h3 className="text-2xl font-black mb-3">PĹ™ipraveni zaÄŤĂ­t?</h3>
              <p className="text-gray-300 leading-relaxed mb-8">
                NapiĹˇte nĂˇm nebo zavolejte. NezĂˇvaznÄ› vĂˇm pĹ™ipravĂ­me konkrĂ©tnĂ­ nabĂ­dku
                na vĹŻz, kterĂ˝ chcete â€” s reĂˇlnou cenou z EU.
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
                  ProhlĂ©dnout vozy <ArrowRight size={15} />
                </Link>
                <a
                  href="tel:+420733455966"
                  className="flex items-center justify-center gap-2 border border-white/20 hover:bg-white/10 text-white font-semibold px-6 py-3 rounded-md transition-colors text-sm"
                >
                  Zavolat nynĂ­
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
