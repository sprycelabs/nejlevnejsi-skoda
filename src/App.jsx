import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { Helmet } from 'react-helmet-async'
import SEO from './components/SEO'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import QuickLinks from './components/QuickLinks'
import ClientsBar from './components/ClientsBar'
import CarListing from './components/CarListing'
import BombDeal from './components/BombDeal'
import HowItWorks from './components/HowItWorks'
import WhyUs from './components/WhyUs'
import ProcessSection from './components/ProcessSection'
import CTASection from './components/CTASection'
import Footer from './components/Footer'
import VozyPage from './pages/Vozy'
import VozDetail from './pages/VozDetail'
import ONas from './pages/ONas'
import Kontakt from './pages/Kontakt'
import FAQ from './pages/FAQ'
import Pokladna from './pages/Pokladna'
import ScrollToTop from './components/ScrollToTop'
import Cart from './components/Cart'
import CookieBanner from './components/CookieBanner'
import { CartProvider } from './context/CartContext'

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Nejlevnější Škoda',
  url: 'https://nejlevnejsi-skoda.cz',
  logo: 'https://nejlevnejsi-skoda.cz/logo.webp',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+420733455966',
    contactType: 'customer service',
    availableLanguage: 'Czech',
    hoursAvailable: 'Mo-Fr 08:00-18:00',
  },
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Rybná 716',
    addressLocality: 'Praha',
    postalCode: '110 00',
    addressCountry: 'CZ',
  },
  sameAs: [],
}

function HomePage() {
  return (
    <div className="min-h-screen">
      <SEO
        title="Vozy Škoda z EU levněji než v ČR | Ušetřete až 20 %"
        description="Kupte novou Škodu z EU až o 20 % levněji než u českých dealerů. Tovární záruka zachována, dovoz do ČR zajištěn. Octavia, Fabia, Kodiaq, Superb a další modely."
        canonical="/"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(organizationJsonLd)}</script>
      </Helmet>
      <Navbar />
      <main>
        <Hero />
        <ClientsBar />
        <QuickLinks />
        <CarListing />
        <BombDeal />
        <HowItWorks />
        <ProcessSection />
        <WhyUs />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <HelmetProvider>
    <BrowserRouter>
      <CartProvider>
        <ScrollToTop />
        <Cart />
        <CookieBanner />
        <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/vozy" element={<VozyPage />} />
        <Route path="/vozy/:slug" element={<VozDetail />} />
        <Route path="/o-nas" element={<ONas />} />
        <Route path="/kontakt" element={<Kontakt />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/pokladna" element={<Pokladna />} />
        </Routes>
      </CartProvider>
    </BrowserRouter>
    </HelmetProvider>
  )
}
