import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { Helmet } from 'react-helmet-async'
import SEO from './components/SEO'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import QuickLinks from './components/QuickLinks'
import ClientsBar from './components/ClientsBar'
import CarListing from './components/CarListing'
import BombDeal from './components/BombDeal'
import PromoBeruSlevu from './components/PromoBeruSlevu'
import HowItWorks from './components/HowItWorks'
import WhyUs from './components/WhyUs'
import PriceGuarantee from './components/PriceGuarantee'
import ProcessSection from './components/ProcessSection'
import CTASection from './components/CTASection'
import Footer from './components/Footer'
import VozyPage from './pages/Vozy'
import VozDetail from './pages/VozDetail'
import ONas from './pages/ONas'
import Kontakt from './pages/Kontakt'
import FAQ from './pages/FAQ'
import Pokladna from './pages/Pokladna'
import AkceKveten from './pages/AkceKveten'
import BeruSlevu from './pages/BeruSlevu'
import OjeteVozy from './pages/OjeteVozy'
import OjeteVozyDetail from './pages/OjeteVozyDetail'
import ScrollToTop from './components/ScrollToTop'
import Cart from './components/Cart'
import CookieBanner from './components/CookieBanner'
import FloatingActions from './components/FloatingActions'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import KlientskeCentrum from './pages/KlientskeCentrum'
import KlientskeCentrumLogin from './pages/KlientskeCentrum/Login'
import Pomahame from './pages/Pomahame'
import Stazeni from './pages/Stazeni'

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Glenford Corp s.r.o.',
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
    streetAddress: 'Primátorská 296/38',
    addressLocality: 'Praha',
    postalCode: '180 00',
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
        <PriceGuarantee />
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
      <AuthProvider>
        <CartProvider>
          <ScrollToTop />
          <Cart />
          <CookieBanner />
          <FloatingActions />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/vozy" element={<VozyPage />} />
            <Route path="/vozy/:slug" element={<VozDetail />} />
            <Route path="/o-nas" element={<ONas />} />
            <Route path="/kontakt" element={<Kontakt />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/pokladna" element={<Pokladna />} />
            <Route path="/akce-kveten" element={<AkceKveten />} />
            <Route path="/beru-slevu" element={<BeruSlevu />} />
            <Route path="/ojete-vozy" element={<OjeteVozy />} />
            <Route path="/ojete-vozy/octavia-combi" element={<OjeteVozyDetail />} />
            <Route path="/pomahame" element={<Pomahame />} />
            <Route path="/stazeni" element={<Stazeni />} />
            {/* FB reklamy — redirecty na správné detail stránky */}
            <Route path="/fabia-dynamic-config" element={<Navigate to="/vozy/fabia-dynamic-config" replace />} />
            <Route path="/fabia-dynamic" element={<Navigate to="/vozy/fabia-dynamic" replace />} />
            {/* Klientské centrum */}
            <Route path="/klientske-centrum/login" element={<KlientskeCentrumLogin />} />
            <Route
              path="/klientske-centrum"
              element={
                <ProtectedRoute>
                  <KlientskeCentrum />
                </ProtectedRoute>
              }
            />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
    </HelmetProvider>
  )
}
