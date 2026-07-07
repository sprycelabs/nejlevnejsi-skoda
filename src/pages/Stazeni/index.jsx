import { FileText, Download } from 'lucide-react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import SEO from '../../components/SEO'

const documents = [
  { name: 'Obchodní podmínky', path: '/doc/terms.pdf', desc: 'Všeobecné obchodní podmínky společnosti Glenford Corp s.r.o.' },
  { name: 'Zásady ochrany osobních údajů (GDPR)', path: '/doc/gdpr.pdf', desc: 'Informace o zpracování osobních údajů.' },
  { name: 'Potvrzení o vedení účtu – FIO banka', path: '/stazeni/fio_potvrzeni_ucet.pdf', desc: 'Potvrzení o vedení bankovního účtu u FIO banky.' },
  { name: 'Potvrzení o vedení účtu – Česká spořitelna', path: '/stazeni/spor_potvrzeni_ucet.pdf', desc: 'Potvrzení o vedení bankovního účtu u České spořitelny.' },
  { name: 'Potvrzení o vedení účtu – ČSOB', path: '/stazeni/ucet.pdf', desc: 'Potvrzení o vedení bankovního účtu u ČSOB.' },
  { name: 'Výpis z obchodního rejstříku – Glenford Corp s.r.o.', path: '/stazeni/vypis.pdf', desc: 'Aktuální výpis společnosti Glenford Corp s.r.o. z obchodního rejstříku.' },
  { name: 'Výpis z obchodního rejstříku – Cosoleto Group s.r.o.', path: '/stazeni/vypis-cosoleto.pdf', desc: 'Aktuální výpis společnosti Cosoleto Group s.r.o. z obchodního rejstříku.' },
  { name: 'Oznámení zákazníkům', path: '/stazeni/oznameni_zakaznikum.pdf', desc: '' },
  { name: 'Plná moc – přihlášení k registraci', path: '/stazeni/plna_moc_prihlaseni.pdf', desc: '' },
  { name: 'Potvrzení o vedení účtu – Komerční banka (Cosoleto)', path: '/stazeni/Potvrzeni_Cosoleto_KB.pdf', desc: 'Potvrzení o vedení bankovního účtu u Komerční banky pro Cosoleto Group s.r.o.' },
  { name: 'Certifikát – Spolupráce s nadacemi', path: '/doc/certifikat.pdf', desc: 'Certifikát potvrzující spolupráci s nadacemi Život dětem a Dobrý anděl.' },
]

export default function Stazeni() {
  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title="Dokumenty ke stažení | Nejlevnější Škoda"
        description="Stáhněte si obchodní podmínky, GDPR a další dokumenty."
        canonical="/stazeni"
      />
      <Navbar />

      {/* Hero */}
      <section className="relative bg-[#0d1f10] overflow-hidden pt-24">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d1f10] via-[#1a3d1e] to-[#0a1508]" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="pb-10 pt-8">
            <p className="text-[#28a745] font-semibold text-sm uppercase tracking-wider mb-2">Ke stažení</p>
            <h1 className="text-3xl sm:text-4xl font-black text-white">Dokumenty ke stažení</h1>
          </div>
        </div>
        <div className="relative z-10">
          <svg viewBox="0 0 1440 60" fill="none" className="w-full block">
            <path d="M0 60L1440 60L1440 30C1200 60 960 0 720 30C480 60 240 0 0 30L0 60Z" fill="#f9fafb" />
          </svg>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          {documents.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <FileText size={48} className="mx-auto mb-4 opacity-30" />
              <p>Zatím zde nejsou žádné dokumenty.</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {documents.map(doc => (
                <li key={doc.filename} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-5">
                  <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center shrink-0">
                    <FileText size={22} className="text-[#1e7e34]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 text-sm">{doc.name}</p>
                    {doc.desc && <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{doc.desc}</p>}
                  </div>
                  <a
                    href={doc.path}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-[#1e7e34] hover:bg-[#28a745] text-white text-sm font-bold px-4 py-2.5 rounded-lg transition-colors shrink-0"
                  >
                    <Download size={15} />
                    Stáhnout
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
