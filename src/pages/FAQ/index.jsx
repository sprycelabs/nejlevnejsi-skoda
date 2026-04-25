import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ChevronRight, ChevronDown, Phone, Mail } from 'lucide-react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

const faqs = [
  {
    category: 'Obecné',
    items: [
      {
        q: 'Jak je možné, že jsou vozy levnější než v ČR?',
        a: 'V rámci EU existují výrazné cenové rozdíly u identických vozů. Stejná Škoda Octavia stojí v některém jiném státě EU v danou chvíli o desítky tisíc korun méně než v České republice. Jde o strukturální rozdíl daný lokálními dealerskými maržemi, poptávkou a vývojem kurzu koruny vůči dolaru a euru — není to náhoda ani chyba.',
      },
      {
        q: 'Je nákup vozu ze zahraničí legální?',
        a: 'Ano, zcela legální. Nákup vozů v rámci EU je součástí volného pohybu zboží — jednoho ze základních pilířů Evropské unie. Vozidlo je řádně přihlášeno v ČR a splňuje všechny zákonné požadavky.',
      },
      {
        q: 'Jak dlouho celý proces trvá?',
        a: 'Od nezávazné poptávky po předání klíčků obvykle 3–6 týdnů. Záleží na dostupnosti konkrétního vozu a rychlosti administrace. U skladových vozů může být dodání rychlejší.',
      },
      {
        q: 'Musím jet do zahraničí nebo něco vyřizovat osobně?',
        a: 'Ne. Celý proces, včetně komunikace s dealerem, přepravy, přihlášení vozidla a předání v ČR, zajišťujeme za vás. Vy se nemusíte starat o nic.',
      },
    ],
  },
  {
    category: 'Vozidlo a záruka',
    items: [
      {
        q: 'Vztahuje se na vůz tovární záruka?',
        a: 'Ano. Všechny vozy pocházejí z oficiální distribuční sítě Škoda Auto. Tovární záruka je stejná jako při nákupu u českého dealera a platí v celé EU. Servis můžete absolvovat u jakéhokoli autorizovaného Škoda servisu v ČR.',
      },
      {
        q: 'Jsou vozy nové nebo ojeté?',
        a: 'Primárně dodáváme nové vozy. V nabídce jsou i vozy s velmi nízkým nájezdem (předváděcí, skladové) — vždy to jasně uvádíme v detailu vozu.',
      },
      {
        q: 'Mohu si vybrat výbavu, barvu a doplňky přesně podle svých přání?',
        a: 'Ano. Buď si vyberete z naší aktuální nabídky nakonfigurovaných vozů, nebo si na webu skoda-auto.cz nakonfigurujete vůz podle sebe a konfiguraci nám zašlete. My vám připravíme nabídku na totožné vozidlo.',
      },
      {
        q: 'Jaká je průměrná úspora oproti českému dealerovi?',
        a: 'Průměrná úspora se pohybuje kolem 20 % oproti ceníkovým cenám u českých dealerů. U konkrétního vozu může být úspora vyšší nebo nižší — záleží na modelu, výbavě a aktuální situaci na trhu.',
      },
    ],
  },
  {
    category: 'Platba a cena',
    items: [
      {
        q: 'Co vše je zahrnuto v ceně?',
        a: 'V ceně vozu je zahrnuta přeprava do ČR (u vozů označených "Doprava zdarma"), přihlášení vozidla, technická přejímka, kompletní dokumentace a předávací protokol. Vše vám transparentně sdělíme předem.',
      },
      {
        q: 'Jaký je váš poplatek za zprostředkování?',
        a: 'Naši odměnu vždy transparentně uvedeme v nabídce. Je součástí celkové ceny a neplatíte žádné skryté příplatky.',
      },
      {
        q: 'Mohu vůz financovat — leasing nebo úvěr?',
        a: 'Ano, financování je možné. Kontaktujte nás a probereme možnosti. Spolupracujeme s finančními partnery, kteří umí financovat i vozy nakoupené v zahraničí.',
      },
      {
        q: 'Kdy a jak se platí?',
        a: 'Platební podmínky jsou součástí každé individuální nabídky. Standardně se platí část při objednávce a zbytek před předáním vozu. Vše je smluvně ošetřeno.',
      },
    ],
  },
  {
    category: 'Proces a logistika',
    items: [
      {
        q: 'Jak probíhá přihlášení vozu v ČR?',
        a: 'Vše vyřídíme za vás. Zajistíme COC dokument (osvědčení o shodě), technickou přejímku, přihlášení na příslušném úřadě a vydání českých SPZ. Vy pouze dodáte potřebné doklady.',
      },
      {
        q: 'Co když vůz při převzetí nesplňuje očekávání?',
        a: 'Před předáním vůz důkladně zkontrolujeme. Postupujeme transparentně — fotodokumentace, předávací protokol. V případě jakýchkoli nesrovnalostí věc okamžitě řešíme.',
      },
      {
        q: 'Nabízíte služby i pro firemní zákazníky?',
        a: 'Ano. Pracujeme jak se soukromými zákazníky, tak s firmami při obnově vozového parku. Objem od jednoho vozu po větší flotily — přístup je vždy individuální.',
      },
    ],
  },
]

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between gap-4 py-5 text-left"
      >
        <span className={`font-semibold text-sm sm:text-base leading-snug transition-colors ${open ? 'text-[#1e7e34]' : 'text-gray-900'}`}>
          {q}
        </span>
        <ChevronDown
          size={18}
          className={`shrink-0 mt-0.5 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180 text-[#1e7e34]' : ''}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="text-gray-500 text-sm leading-relaxed pb-5">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FAQ() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero */}
      <section className="relative bg-[#0d1f10] overflow-hidden pt-40">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d1f10] via-[#1a3d1e] to-[#0a1508]" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#1e7e34]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 text-sm text-gray-400 pt-6 pb-4">
            <Link to="/" className="hover:text-white transition-colors">Domů</Link>
            <ChevronRight size={13} />
            <span className="text-gray-200">Časté dotazy</span>
          </div>

          <div className="max-w-3xl pb-16 pt-4">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[#28a745] font-semibold text-sm uppercase tracking-wider mb-3"
            >
              Máte otázky?
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-6"
            >
              Časté dotazy
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-gray-300 text-lg leading-relaxed"
            >
              Odpovědi na nejčastější otázky o nákupu vozů Škoda z EU. Nenašli jste co hledáte? Napište nám.
            </motion.p>
          </div>
        </div>

        <div className="relative z-10">
          <svg viewBox="0 0 1440 60" fill="none" className="w-full block">
            <path d="M0 60L1440 60L1440 30C1200 60 960 0 720 30C480 60 240 0 0 30L0 60Z" fill="#f9fafb" />
          </svg>
        </div>
      </section>

      {/* FAQ content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="space-y-8">
            {faqs.map((section) => (
              <motion.div
                key={section.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden"
              >
                <div className="px-6 py-4 bg-[#f0faf2] border-b border-gray-100">
                  <h2 className="font-black text-gray-900">{section.category}</h2>
                </div>
                <div className="px-6">
                  {section.items.map((item) => (
                    <FAQItem key={item.q} q={item.q} a={item.a} />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 bg-gradient-to-br from-[#0d1f10] to-[#1a3d1e] rounded-lg p-8 text-white text-center"
          >
            <h3 className="text-xl font-black mb-2">Nenašli jste odpověď?</h3>
            <p className="text-gray-300 text-sm mb-6">Neváhejte nás kontaktovat — rádi vám odpovíme na jakýkoli dotaz.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="tel:+420733455966"
                className="flex items-center justify-center gap-2 bg-[#1e7e34] hover:bg-[#28a745] text-white font-bold px-6 py-3 rounded-md transition-colors text-sm"
              >
                <Phone size={15} />
                +420 733 455 966
              </a>
              <a
                href="mailto:info@nejlevnejsi-skoda.cz"
                className="flex items-center justify-center gap-2 border border-white/20 hover:bg-white/10 text-white font-semibold px-6 py-3 rounded-md transition-colors text-sm"
              >
                <Mail size={15} />
                Napsat e-mail
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
