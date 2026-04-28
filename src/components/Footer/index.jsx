import { Phone, Mail, Share2, MessageCircle } from 'lucide-react'

const footerLinks = {
  'Nové vozy': [
    { label: 'Škoda Octavia', href: '/vozy' },
    { label: 'Škoda Fabia', href: '/vozy' },
    { label: 'Škoda Kodiaq', href: '/vozy' },
    { label: 'Škoda Karoq', href: '/vozy' },
    { label: 'Škoda Superb', href: '/vozy' },
    { label: 'Škoda Kamiq', href: '/vozy' },
  ],
  'Pro zákazníky': [
    { label: 'Jak to funguje', href: '/#jak-to-funguje' },
    { label: 'Financování', href: '/#jak-to-funguje' },
    { label: 'FAQ', href: '/faq' },
  ],
  'Servis': [
    { label: 'Tovární záruka', href: '/o-nas' },
    { label: 'Autorizovaný servis', href: '/o-nas' },
    { label: 'Pojištění', href: '/o-nas' },
    { label: 'Registrace vozu', href: '/o-nas' },
  ],
  'Společnost': [
    { label: 'O nás', href: '/o-nas' },
    { label: 'Kontakt', href: '/kontakt' },
    { label: 'Obchodní podmínky', href: '/doc/term.docx', download: true },
    { label: 'GDPR', href: '/doc/gdpr.docx', download: true },
    { label: 'Cookies', href: '/kontakt' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-[#0d1f10] text-gray-300">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-8">
          {/* Brand col */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <a href="/" className="flex items-center mb-5">
              <img src="/logo.webp" alt="Nejlevnější Škoda" className="h-6 sm:h-8 lg:h-9 w-auto" style={{ filter: 'brightness(0) invert(1)' }} />
            </a>
            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              Váš partner pro nákup vozů Škoda z EU za výhodné ceny. Průměrná úspora 20 %.
            </p>
            <div className="space-y-2">
              <a href="tel:+420733455966" className="flex items-center gap-2 text-sm hover:text-[#28a745] transition-colors">
                <Phone size={14} className="text-[#28a745]" />
                +420 733 455 966
              </a>
              <a href="mailto:info@nejlevnejsi-skoda.cz" className="flex items-center gap-2 text-sm hover:text-[#28a745] transition-colors">
                <Mail size={14} className="text-[#28a745]" />
                info@nejlevnejsi-skoda.cz
              </a>
            </div>
            <div className="flex gap-3 mt-5">
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 bg-white/10 hover:bg-[#1e7e34] rounded-lg flex items-center justify-center transition-colors"
              >
                <Share2 size={16} />
              </a>
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 bg-white/10 hover:bg-[#1e7e34] rounded-lg flex items-center justify-center transition-colors"
              >
                <MessageCircle size={16} />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-bold text-white text-sm mb-4">{title}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} {...(link.download ? { download: true } : {})} className="text-sm text-gray-400 hover:text-[#28a745] transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Škoda partner bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-4">
          <span className="text-gray-500 text-xs">Spolupracujeme s autorizovanými partnery</span>
          <img src="/logo/skoda.webp" alt="Škoda Auto" className="h-11 w-auto opacity-70" />
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <span>© {new Date().getFullYear()} TOP GLOBAL STRATEGIC MANAGEMENT LTD,Reg. číslo: 490247, Všechna práva vyhrazena.</span>
          <div className="flex gap-4">
            <a href="/doc/gdpr.docx" download className="hover:text-gray-300 transition-colors">GDPR</a>
            <a href="/doc/term.docx" download className="hover:text-gray-300 transition-colors">Obchodní podmínky</a>
            <a href="/kontakt" className="hover:text-gray-300 transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
