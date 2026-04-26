import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import QuickLinks from './components/QuickLinks'
import ClientsBar from './components/ClientsBar'
import CarListing from './components/CarListing'
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
import { CartProvider } from './context/CartContext'

function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <ClientsBar />
        <QuickLinks />
        <CarListing />
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
    <BrowserRouter>
      <CartProvider>
        <ScrollToTop />
        <Cart />
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
  )
}
