import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ShieldCheck, Truck, CheckCircle2, Wrench, Phone, Star, ChevronDown, BadgePercent, Users, Briefcase, TrendingUp } from 'lucide-react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import SEO from '../../components/SEO'

const PRICE = 249000
const STOCK = 2
const TOTAL_STOCK = 16

function czk(n) {
  return new Intl.NumberFormat('cs-CZ', { style: 'currency', currency: 'CZK', maximumFractionDigits: 0 }).format(n)
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, delay },
})

const FAQS = [
  {
    q: 'Mohu si vůz před koupí prohlédnout?',
    a: 'Ano, po domluvě je prohlídka možná. Kontaktujte nás telefonicky a domluvíme termín.',
  },
  {
    q: 'Kupuji konkrétní vůz, nebo jen z dané série?',
    a: 'Kupujete vůz z aukční série — nikoli konkrétní VIN. Všechna vozidla mají ale shodné nebo obdobné parametry, historii a stav, takže se fakticky neliší.',
  },
  {
    q: 'Je na vozy nějaká záruka?',
    a: 'Vozy jsou prověřeny a servisovány. Na provedený servis poskytujeme záruku. Tovární záruka Škoda se vztahuje dle stáří a nájezdu vozu.',
  },
  {
    q: 'Jak probíhá platba a předání?',
    a: 'Po objednání zaplatíte zálohu 20 % z kupní ceny, zbytek při předání vozu. Dopravu a přihlášení řešíme za vás.',
  },
  {
    q: 'Je možné koupit více vozů najednou například pro firmu?',
    a: 'Ano, na flotilový nákup více vozů rádi připravíme individuální nabídku. Kontaktujte nás prosím přímo.',
  },
]

function FaqList() {
  const [open, setOpen] = useState(null)
  return (
    <div className="space-y-3">
      {FAQS.map((faq, i) => (
        <motion.div key={i} {...fadeUp(i * 0.06)} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
          >
            <span className="font-bold text-gray-900 text-sm sm:text-base">{faq.q}</span>
            <ChevronDown
              size={18}
              className={`text-[#1e7e34] shrink-0 transition-transform duration-300 ${open === i ? 'rotate-180' : ''}`}
            />
          </button>
          <AnimatePresence initial={false}>
            {open === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <p className="px-5 pb-5 text-gray-500 text-sm leading-relaxed border-t border-gray-100 pt-3">{faq.a}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  )
}

export default function OjeteVozy() {
  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Ojeté vozy Škoda | Octavia Combi z aukce za výjimečnou cenu"
        description="Prověřené ojeté Škody Octavia Combi z holandského leasingu. Kompletní servis 120 000 km hotový předem. Zbývá jen 5 z 16 kusů — dovoz a registrace v ČR v ceně."
        canonical="/ojete-vozy"
      />
      <Navbar />

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative bg-[#0d1f10] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d1f10] via-[#1a3d1e] to-[#0a1508]" />
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-[#1e7e34]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-[#28a745]/8 rounded-full blur-3xl pointer-events-none" />
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-28 sm:pt-36 pb-4 sm:pb-16 w-full">
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 items-center">

            {/* Left */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.05 }}
                className="inline-flex items-center gap-2 bg-gray-500/30 border border-gray-400/40 text-gray-300 text-xs font-bold px-4 py-1.5 rounded-full mb-4 tracking-wider uppercase"
              >
                <span className="w-2 h-2 rounded-full bg-gray-400 shrink-0" />
                Vyprodáno · Brzy opět naskladníme
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-3xl sm:text-4xl xl:text-6xl font-black text-white leading-tight mb-4"
              >
                Škoda Octavia Combi{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#28a745] to-[#86efac]">
                  za výjimečnou cenu
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-gray-300 text-sm sm:text-lg leading-relaxed mb-6 max-w-lg"
              >
                Prověřené ojeté Octavie z holandského leasingu s kompletní servisní historií. Každý vůz prošel servisem 120 000 km — připraven k okamžitému provozu.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="flex flex-wrap gap-3 mb-6 sm:mb-10"
              >
                <a
                  href="tel:+420733455966"
                  className="flex items-center gap-2 bg-[#1e7e34] hover:bg-[#28a745] text-white font-bold px-5 sm:px-7 py-3 sm:py-4 rounded-md transition-all duration-200 shadow-lg shadow-green-900/40 text-sm sm:text-base"
                >
                  <Phone size={17} />
                  Mám zájem
                </a>
                <a
                  href="/ojete-vozy/octavia-combi"
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-5 sm:px-7 py-3 sm:py-4 rounded-md transition-all duration-200 text-sm sm:text-base"
                >
                  Detail vozu
                  <ArrowRight size={15} />
                </a>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-wrap items-center gap-5"
              >
                {[
                  { icon: ShieldCheck, text: 'Prověřená historie' },
                  { icon: Truck,       text: 'Dovoz a registrace v ceně' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2 text-gray-300 text-xs sm:text-sm">
                    <Icon size={15} className="text-[#28a745]" />
                    {text}
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right — foto */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative flex items-end justify-center lg:justify-end"
            >
              {/* vyprodáno badge — desktop only */}
              <div className="hidden lg:block absolute top-0 right-0 z-10 bg-gray-600 rounded-xl px-5 py-4 shadow-xl shadow-black/40 text-center">
                <div className="text-gray-300 text-xs font-bold uppercase tracking-widest mb-1">Stav skladu</div>
                <div className="text-white text-2xl font-black leading-none">Vyprodáno</div>
                <div className="mt-2 pt-2 border-t border-white/20 text-gray-300 text-xs">
                  Brzy opět naskladníme
                </div>
              </div>

              <img
                src="/ojete-hero.webp"
                alt="Škoda Octavia Combi"
                className="w-full max-h-52 sm:max-h-72 lg:max-h-none object-contain lg:max-w-2xl lg:translate-y-16"
                style={{ filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.6))' }}
              />
            </motion.div>

          </div>
        </div>

        {/* cena — mobile */}
        <div className="lg:hidden relative z-10 px-4 pb-4">
          <div className="flex items-center justify-between bg-[#1e7e34] rounded-xl px-5 py-4 shadow-xl">
            <div>
              <div className="text-green-200 text-xs font-bold uppercase tracking-widest mb-0.5">Cena vč. DPH</div>
              <div className="text-white text-2xl font-black leading-tight">{czk(PRICE)}</div>
            </div>
            <div className="text-right">
              <div className="text-green-200 text-xs mb-0.5">Zbývá</div>
              <div className="text-white font-black text-xl">{STOCK} <span className="text-green-200 font-normal text-sm">z {TOTAL_STOCK}</span></div>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block">
            <path d="M0 80L1440 80L1440 40C1200 80 960 0 720 40C480 80 240 0 0 40L0 80Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ── PROČ KOUPIT ───────────────────────────────────────────────────── */}
      <section id="proc-koupit" className="py-12 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div {...fadeUp()} className="text-center mb-10">
            <span className="text-[#1e7e34] text-xs font-black tracking-widest uppercase mb-3 block">Proč koupit právě u nás</span>
            <h2 className="text-2xl sm:text-4xl font-black text-gray-900">Výhody, které jinde nenajdete</h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { icon: BadgePercent, title: 'Ověřený aukční nákup',    desc: 'Nakupujeme celé série ve větším objemu — díky tomu dostáváme ceny, které běžný trh nenabídne.' },
              { icon: ShieldCheck,  title: 'Transparentní historie',  desc: 'Jeden majitel, plná servisní kniha, nehavarovaná. Původ z holandského leasingu.' },
              { icon: Wrench,       title: 'Servis hotový předem',    desc: 'Olej, filtry, brzdy, svíčky — vše vyměněno před prodejem. Žádné další investice.' },
              { icon: Truck,        title: 'Kompletní služba na klíč', desc: 'Dovoz, registrace v ČR, předání domů — vše zařídíme za vás od A do Z.' },
            ].map(({ icon: Icon, title, desc }, i) => (
              <motion.div key={title} {...fadeUp(i * 0.08)}
                className="flex sm:flex-col items-start sm:items-center gap-4 sm:gap-0 p-5 sm:p-6 rounded-2xl border border-gray-100 hover:border-[#1e7e34]/30 hover:shadow-lg transition-all duration-300 sm:text-center"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#1e7e34]/10 flex items-center justify-center shrink-0 sm:mx-auto sm:mb-4">
                  <Icon size={22} className="text-[#1e7e34]" />
                </div>
                <div>
                  <h3 className="font-black text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">{title}</h3>
                  <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CO BYLO UDĚLÁNO ───────────────────────────────────────────────── */}
      <section className="py-12 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div {...fadeUp()} className="text-center mb-10">
            <span className="text-[#1e7e34] text-xs font-black tracking-widest uppercase mb-3 block">Předprodejní servis</span>
            <h2 className="text-2xl sm:text-4xl font-black text-gray-900">Kompletní servis 120 000 km — hotový před prodejem</h2>
            <p className="text-gray-500 mt-3 text-sm sm:text-base max-w-lg mx-auto">Nekupujete auto a pak řešíte servis. Koupíte auto a jedete.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-4xl mx-auto">
            {[
              'Nový motorový olej + filtr',
              'Olej a filtr v DSG převodovce',
              'Zapalovací svíčky',
              'Vzduchový + kabinový filtr',
              'Nové brzdové kotouče a destičky',
              'Stabilizační tyčky + silentbloky',
              'Kontrola tlumičů',
              'Kontrola a vyčištění EGR',
              'Klimatizace — kontrola + doplnění',
            ].map((item, i) => (
              <motion.div key={item} {...fadeUp(i * 0.04)} className="flex items-center gap-3 bg-white rounded-xl px-4 py-3.5 border border-gray-100">
                <CheckCircle2 size={17} className="text-[#1e7e34] shrink-0" />
                <span className="text-gray-800 text-sm">{item}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PŮVOD VOZŮ ────────────────────────────────────────────────────── */}
      <section className="py-12 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div {...fadeUp()} className="text-center mb-10">
            <span className="text-[#1e7e34] text-xs font-black tracking-widest uppercase mb-3 block">Původ a historie</span>
            <h2 className="text-2xl sm:text-4xl font-black text-gray-900">Odkud auta bereme</h2>
            <p className="text-gray-500 mt-3 text-sm sm:text-base max-w-lg mx-auto">Žádné neznámé původy. Vozy pochází z ověřeného holandského operativního leasingu.</p>
          </motion.div>

          {/* timeline — mobile: jednoduchý seznam se svislou čárou vlevo, desktop: zigzag */}
          <div className="max-w-3xl mx-auto">

            {/* Mobile timeline */}
            <div className="sm:hidden relative pl-10">
              <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200" />
              {[
                { flag: '🇳🇱', title: 'Holandsko — operativní leasing', desc: 'Vozy byly 4 roky v operativním leasingu. Pravidelná údržba, jeden firemní provozovatel, 30 000 km ročně.' },
                { flag: '🏷️', title: 'Aukce — hromadný výkup',       desc: 'Po skončení leasingu nakupujeme celé série najednou — díky objemu dostáváme výrazně nižší ceny.' },
                { flag: '🔧', title: 'Servis 120 000 km',             desc: 'Každý vůz projde kompletní prohlídkou. Olej, filtry, brzdy, svíčky — vše vyměněno.' },
                { flag: '🇨🇿', title: 'Česká republika — k vám domů', desc: 'Přihlásíme vůz v ČR a dostavíme ho až k vám domů.' },
              ].map((step, i) => (
                <motion.div key={i} {...fadeUp(i * 0.1)} className="relative mb-8 last:mb-0">
                  <div className="absolute -left-6 w-8 h-8 rounded-full bg-[#1e7e34]/10 border-2 border-[#1e7e34]/30 flex items-center justify-center text-sm">
                    {step.flag}
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                    <p className="font-black text-gray-900 text-sm mb-1">{step.title}</p>
                    <p className="text-gray-500 text-xs leading-relaxed">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Desktop timeline (zigzag) */}
            <div className="hidden sm:block relative">
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-200 -translate-x-px" />
              {[
                { flag: '🇳🇱', title: 'Holandsko — operativní leasing', desc: 'Vozy byly 4 roky v operativním leasingu u holandské leasingové společnosti. Pravidelná údržba, jeden firemní provozovatel, 30 000 km ročně.', side: 'left' },
                { flag: '🏷️', title: 'Aukce — hromadný výkup',        desc: 'Po skončení leasingu vozy putují do aukce. Nakupujeme celé série identických aut najednou — díky objemu dostáváme výrazně nižší ceny.', side: 'right' },
                { flag: '🔧', title: 'Servis 120 000 km',              desc: 'Každý vůz projde kompletní prohlídkou a servisem. Olej, filtry, brzdy, svíčky — vše vyměněno. Auto odjíždí připravené.', side: 'left' },
                { flag: '🇨🇿', title: 'Česká republika — k vám domů',  desc: 'Přihlásíme vůz v ČR a dostavíme ho až k vám domů. Vy se o nic nestaráte.', side: 'right' },
              ].map((step, i) => (
                <motion.div key={i} {...fadeUp(i * 0.1)} className="relative flex items-center gap-6 mb-10 last:mb-0">
                  <div className="shrink-0 w-12 h-12 rounded-full bg-[#1e7e34]/10 border-2 border-[#1e7e34]/30 flex items-center justify-center text-xl absolute left-1/2 -translate-x-1/2 z-10">
                    {step.flag}
                  </div>
                  <div className={`bg-gray-50 rounded-2xl p-5 border border-gray-100 w-[calc(50%-40px)] ${step.side === 'left' ? 'mr-auto' : 'ml-auto'}`}>
                    <p className="font-black text-gray-900 mb-1">{step.title}</p>
                    <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ── PRO KOHO ──────────────────────────────────────────────────────── */}
      <section className="py-12 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">

            {/* left — text */}
            <motion.div {...fadeUp()}>
              <span className="text-[#1e7e34] text-xs font-black tracking-widest uppercase mb-3 block">Pro koho je nabídka ideální</span>
              <h2 className="text-2xl sm:text-4xl font-black text-gray-900 mb-3 leading-tight">
                Limitovaná aukční nabídka —{' '}
                <span className="text-[#1e7e34]">zbývá jen {STOCK} z {TOTAL_STOCK} vozů</span>
              </h2>
              <p className="text-gray-500 text-sm sm:text-base leading-relaxed mb-6">
                Nabízíme výjimečnou příležitost nákupu zcela prověřených vozů Škoda Octavia Combi ve zvýhodněném režimu hromadného výprodeje z aukce.
              </p>

              <div className="space-y-3">
                {[
                  { icon: Users,      title: 'Jednotlivci',          desc: 'Hledáte výhodné rodinné kombi s prověřenou historií a bez skrytých nákladů?' },
                  { icon: Briefcase,  title: 'Firmy',                desc: 'Ideální jako firemní flotila — k dispozici jsou zbývající vozy z aukční série za výhodnou cenu.' },
                  { icon: TrendingUp, title: 'Investoři / další prodej', desc: 'Nízká vstupní cena a prověřený stav vozů — výhodná příležitost pro další obchodní využití.' },
                ].map(({ icon: Icon, title, desc }, i) => (
                  <motion.div key={title} {...fadeUp(i * 0.08)} className="flex items-start gap-4 p-4 rounded-2xl border border-gray-100 bg-white hover:border-[#1e7e34]/30 hover:shadow-md transition-all duration-300">
                    <div className="w-10 h-10 rounded-xl bg-[#1e7e34]/10 flex items-center justify-center shrink-0">
                      <Icon size={19} className="text-[#1e7e34]" />
                    </div>
                    <div>
                      <h3 className="font-black text-gray-900 mb-0.5 text-sm sm:text-base">{title}</h3>
                      <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">{desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* right — CTA card */}
            <motion.div {...fadeUp(0.15)}>
              <div className="bg-gradient-to-br from-[#0d1f10] to-[#1a3d1e] rounded-3xl p-6 sm:p-10 text-white">
                <p className="text-[#86efac] font-bold text-sm uppercase tracking-wider mb-2">Nečekejte</p>
                <h3 className="text-2xl sm:text-3xl font-black mb-2">Zbývá jen {STOCK} z {TOTAL_STOCK} kusů</h3>
                <p className="text-gray-300 text-sm leading-relaxed mb-6">
                  Tato nabídka se nebude opakovat. Jakmile jsou vozy pryč, jsou pryč.
                </p>
                <div className="space-y-3">
                  <a
                    href="tel:+420733455966"
                    className="flex items-center justify-center gap-2 w-full bg-[#1e7e34] hover:bg-[#28a745] text-white font-bold py-4 rounded-xl transition-colors text-sm sm:text-base"
                  >
                    <Phone size={17} /> Zavolat a objednat
                  </a>
                  <a
                    href="/ojete-vozy/octavia-combi"
                    className="flex items-center justify-center gap-2 w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold py-4 rounded-xl transition-colors text-sm sm:text-base"
                  >
                    Detail vozu <ArrowRight size={15} />
                  </a>
                </div>
                <div className="mt-5 pt-5 border-t border-white/10 grid grid-cols-3 gap-2 text-center">
                  {[
                    { v: czk(PRICE), l: 'cena vč. DPH' },
                    { v: '1 majitel', l: 'původ' },
                    { v: '120k km', l: 'servis' },
                  ].map(({ v, l }) => (
                    <div key={l}>
                      <div className="font-black text-white text-xs sm:text-sm leading-tight">{v}</div>
                      <div className="text-gray-400 text-xs mt-0.5">{l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <section className="py-12 sm:py-20 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <motion.div {...fadeUp()} className="text-center mb-8">
            <span className="text-[#1e7e34] text-xs font-black tracking-widest uppercase mb-3 block">Časté otázky</span>
            <h2 className="text-2xl sm:text-4xl font-black text-gray-900">Máte otázky?</h2>
          </motion.div>

          <FaqList />
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="py-12 sm:py-20 bg-[#0d1f10]">
        <div className="max-w-xl mx-auto px-4 sm:px-6 text-center">
          <motion.div {...fadeUp()}>
            <p className="text-[#28a745] text-xs font-black tracking-widest uppercase mb-3">Zbývá jen {STOCK} z {TOTAL_STOCK} kusů</p>
            <h2 className="text-3xl sm:text-5xl font-black text-white mb-2">{czk(PRICE)}</h2>
            <p className="text-gray-400 mb-8 text-xs sm:text-sm">vč. DPH · dovoz domů · registrace v ČR · bez skrytých poplatků</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="tel:+420733455966"
                className="inline-flex items-center justify-center gap-2 bg-[#1e7e34] hover:bg-[#28a745] text-white font-bold px-6 sm:px-10 py-4 sm:py-5 rounded-xl transition-colors text-base sm:text-lg shadow-xl shadow-green-900/30"
              >
                <Phone size={20} />
                Zavolat a objednat
              </a>
              <a
                href="/ojete-vozy/octavia-combi"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-6 sm:px-10 py-4 sm:py-5 rounded-xl transition-colors text-base sm:text-lg"
              >
                Detail vozu
                <ArrowRight size={18} />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
