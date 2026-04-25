import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ChevronRight, ChevronDown, Phone, Mail } from 'lucide-react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

const faqs = [
  {
    category: 'ObecnĂ©',
    items: [
      {
        q: 'Jak je moĹľnĂ©, Ĺľe jsou vozy levnÄ›jĹˇĂ­ neĹľ v ÄŚR?',
        a: 'V rĂˇmci EU existujĂ­ vĂ˝raznĂ© cenovĂ© rozdĂ­ly u identickĂ˝ch vozĹŻ. StejnĂˇ Ĺ koda Octavia stojĂ­ v nÄ›kterĂ©m jinĂ©m stĂˇtÄ› EU v danou chvĂ­li o desĂ­tky tisĂ­c korun mĂ©nÄ› neĹľ v ÄŚeskĂ© republice. Jde o strukturĂˇlnĂ­ rozdĂ­l danĂ˝ lokĂˇlnĂ­mi dealerskĂ˝mi marĹľemi, poptĂˇvkou a vĂ˝vojem kurzu koruny vĹŻÄŤi dolaru a euru â€” nenĂ­ to nĂˇhoda ani chyba.',
      },
      {
        q: 'Je nĂˇkup vozu ze zahraniÄŤĂ­ legĂˇlnĂ­?',
        a: 'Ano, zcela legĂˇlnĂ­. NĂˇkup vozĹŻ v rĂˇmci EU je souÄŤĂˇstĂ­ volnĂ©ho pohybu zboĹľĂ­ â€” jednoho ze zĂˇkladnĂ­ch pilĂ­Ĺ™ĹŻ EvropskĂ© unie. Vozidlo je Ĺ™ĂˇdnÄ› pĹ™ihlĂˇĹˇeno v ÄŚR a splĹuje vĹˇechny zĂˇkonnĂ© poĹľadavky.',
      },
      {
        q: 'Jak dlouho celĂ˝ proces trvĂˇ?',
        a: 'Od nezĂˇvaznĂ© poptĂˇvky po pĹ™edĂˇnĂ­ klĂ­ÄŤkĹŻ obvykle 3â€“6 tĂ˝dnĹŻ. ZĂˇleĹľĂ­ na dostupnosti konkrĂ©tnĂ­ho vozu a rychlosti administrace. U skladovĂ˝ch vozĹŻ mĹŻĹľe bĂ˝t dodĂˇnĂ­ rychlejĹˇĂ­.',
      },
      {
        q: 'MusĂ­m jet do zahraniÄŤĂ­ nebo nÄ›co vyĹ™izovat osobnÄ›?',
        a: 'Ne. CelĂ˝ proces, vÄŤetnÄ› komunikace s dealerem, pĹ™epravy, pĹ™ihlĂˇĹˇenĂ­ vozidla a pĹ™edĂˇnĂ­ v ÄŚR, zajiĹˇĹĄujeme za vĂˇs. Vy se nemusĂ­te starat o nic.',
      },
    ],
  },
  {
    category: 'Vozidlo a zĂˇruka',
    items: [
      {
        q: 'Vztahuje se na vĹŻz tovĂˇrnĂ­ zĂˇruka?',
        a: 'Ano. VĹˇechny vozy pochĂˇzejĂ­ z oficiĂˇlnĂ­ distribuÄŤnĂ­ sĂ­tÄ› Ĺ koda Auto. TovĂˇrnĂ­ zĂˇruka je stejnĂˇ jako pĹ™i nĂˇkupu u ÄŤeskĂ©ho dealera a platĂ­ v celĂ© EU. Servis mĹŻĹľete absolvovat u jakĂ©hokoli autorizovanĂ©ho Ĺ koda servisu v ÄŚR.',
      },
      {
        q: 'Jsou vozy novĂ© nebo ojetĂ©?',
        a: 'PrimĂˇrnÄ› dodĂˇvĂˇme novĂ© vozy. V nabĂ­dce jsou i vozy s velmi nĂ­zkĂ˝m nĂˇjezdem (pĹ™edvĂˇdÄ›cĂ­, skladovĂ©) â€” vĹľdy to jasnÄ› uvĂˇdĂ­me v detailu vozu.',
      },
      {
        q: 'Mohu si vybrat vĂ˝bavu, barvu a doplĹky pĹ™esnÄ› podle svĂ˝ch pĹ™ĂˇnĂ­?',
        a: 'Ano. BuÄŹ si vyberete z naĹˇĂ­ aktuĂˇlnĂ­ nabĂ­dky nakonfigurovanĂ˝ch vozĹŻ, nebo si na webu skoda-auto.cz nakonfigurujete vĹŻz podle sebe a konfiguraci nĂˇm zaĹˇlete. My vĂˇm pĹ™ipravĂ­me nabĂ­dku na totoĹľnĂ© vozidlo.',
      },
      {
        q: 'JakĂˇ je prĹŻmÄ›rnĂˇ Ăşspora oproti ÄŤeskĂ©mu dealerovi?',
        a: 'PrĹŻmÄ›rnĂˇ Ăşspora se pohybuje kolem 20 % oproti cenĂ­kovĂ˝m cenĂˇm u ÄŤeskĂ˝ch dealerĹŻ. U konkrĂ©tnĂ­ho vozu mĹŻĹľe bĂ˝t Ăşspora vyĹˇĹˇĂ­ nebo niĹľĹˇĂ­ â€” zĂˇleĹľĂ­ na modelu, vĂ˝bavÄ› a aktuĂˇlnĂ­ situaci na trhu.',
      },
    ],
  },
  {
    category: 'Platba a cena',
    items: [
      {
        q: 'Co vĹˇe je zahrnuto v cenÄ›?',
        a: 'V cenÄ› vozu je zahrnuta pĹ™eprava do ÄŚR (u vozĹŻ oznaÄŤenĂ˝ch "Doprava zdarma"), pĹ™ihlĂˇĹˇenĂ­ vozidla, technickĂˇ pĹ™ejĂ­mka, kompletnĂ­ dokumentace a pĹ™edĂˇvacĂ­ protokol. VĹˇe vĂˇm transparentnÄ› sdÄ›lĂ­me pĹ™edem.',
      },
      {
        q: 'JakĂ˝ je vĂˇĹˇ poplatek za zprostĹ™edkovĂˇnĂ­?',
        a: 'NaĹˇi odmÄ›nu vĹľdy transparentnÄ› uvedeme v nabĂ­dce. Je souÄŤĂˇstĂ­ celkovĂ© ceny a neplatĂ­te ĹľĂˇdnĂ© skrytĂ© pĹ™Ă­platky.',
      },
      {
        q: 'Mohu vĹŻz financovat â€” leasing nebo ĂşvÄ›r?',
        a: 'Ano, financovĂˇnĂ­ je moĹľnĂ©. Kontaktujte nĂˇs a probereme moĹľnosti. Spolupracujeme s finanÄŤnĂ­mi partnery, kteĹ™Ă­ umĂ­ financovat i vozy nakoupenĂ© v zahraniÄŤĂ­.',
      },
      {
        q: 'Kdy a jak se platĂ­?',
        a: 'PlatebnĂ­ podmĂ­nky jsou souÄŤĂˇstĂ­ kaĹľdĂ© individuĂˇlnĂ­ nabĂ­dky. StandardnÄ› se platĂ­ ÄŤĂˇst pĹ™i objednĂˇvce a zbytek pĹ™ed pĹ™edĂˇnĂ­m vozu. VĹˇe je smluvnÄ› oĹˇetĹ™eno.',
      },
    ],
  },
  {
    category: 'Proces a logistika',
    items: [
      {
        q: 'Jak probĂ­hĂˇ pĹ™ihlĂˇĹˇenĂ­ vozu v ÄŚR?',
        a: 'VĹˇe vyĹ™Ă­dĂ­me za vĂˇs. ZajistĂ­me COC dokument (osvÄ›dÄŤenĂ­ o shodÄ›), technickou pĹ™ejĂ­mku, pĹ™ihlĂˇĹˇenĂ­ na pĹ™Ă­sluĹˇnĂ©m ĂşĹ™adÄ› a vydĂˇnĂ­ ÄŤeskĂ˝ch SPZ. Vy pouze dodĂˇte potĹ™ebnĂ© doklady.',
      },
      {
        q: 'Co kdyĹľ vĹŻz pĹ™i pĹ™evzetĂ­ nesplĹuje oÄŤekĂˇvĂˇnĂ­?',
        a: 'PĹ™ed pĹ™edĂˇnĂ­m vĹŻz dĹŻkladnÄ› zkontrolujeme. Postupujeme transparentnÄ› â€” fotodokumentace, pĹ™edĂˇvacĂ­ protokol. V pĹ™Ă­padÄ› jakĂ˝chkoli nesrovnalostĂ­ vÄ›c okamĹľitÄ› Ĺ™eĹˇĂ­me.',
      },
      {
        q: 'NabĂ­zĂ­te sluĹľby i pro firemnĂ­ zĂˇkaznĂ­ky?',
        a: 'Ano. Pracujeme jak se soukromĂ˝mi zĂˇkaznĂ­ky, tak s firmami pĹ™i obnovÄ› vozovĂ©ho parku. Objem od jednoho vozu po vÄ›tĹˇĂ­ flotily â€” pĹ™Ă­stup je vĹľdy individuĂˇlnĂ­.',
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
            <Link to="/" className="hover:text-white transition-colors">DomĹŻ</Link>
            <ChevronRight size={13} />
            <span className="text-gray-200">ÄŚastĂ© dotazy</span>
          </div>

          <div className="max-w-3xl pb-16 pt-4">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[#28a745] font-semibold text-sm uppercase tracking-wider mb-3"
            >
              MĂˇte otĂˇzky?
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-6"
            >
              ÄŚastĂ© dotazy
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-gray-300 text-lg leading-relaxed"
            >
              OdpovÄ›di na nejÄŤastÄ›jĹˇĂ­ otĂˇzky o nĂˇkupu vozĹŻ Ĺ koda z EU. NenaĹˇli jste co hledĂˇte? NapiĹˇte nĂˇm.
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
            <h3 className="text-xl font-black mb-2">NenaĹˇli jste odpovÄ›ÄŹ?</h3>
            <p className="text-gray-300 text-sm mb-6">NevĂˇhejte nĂˇs kontaktovat â€” rĂˇdi vĂˇm odpovĂ­me na jakĂ˝koli dotaz.</p>
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
