import { useState, useEffect } from 'react'
import { ShoppingCart, Phone, Menu, X, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  { label: 'O nás', href: '/o-nas' },
  { label: 'Vozy', href: '/vozy' },
  { label: 'Jak to funguje', href: '/#jak-to-funguje' },
  { label: 'Časté dotazy', href: '/faq' },
  { label: 'Kontakt', href: '/kontakt' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [cartCount] = useState(0)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 overflow-visible ${
        scrolled ? 'bg-white shadow-md' : 'bg-white/95 backdrop-blur-sm'
      }`}
    >
      {/* Top bar */}
      <div className="bg-[#145523] text-white text-xs sm:text-sm py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <span className="whitespace-nowrap">
            <span className="hidden sm:inline">Vozy Škoda z EU – průměrná úspora </span>
            <span className="sm:hidden">Úspora </span>
            <strong>20 %</strong>
            <span className="hidden sm:inline"> oproti ČR</span>
          </span>
          <a
            href="tel:+420733455966"
            className="flex items-center gap-1.5 hover:text-green-200 transition-colors whitespace-nowrap shrink-0"
          >
            <Phone size={13} />
            +420 733 455 966
          </a>
        </div>
      </div>

      {/* Main nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="select-none flex items-center">
          <img src="/logo.png" alt="Nejlevnější Škoda" style={{ height: '52px', width: 'auto' }} />
        </a>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <div key={link.label} className="relative group">
              <a
                href={link.href}
                className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#1e7e34] rounded-lg hover:bg-green-50 transition-all"
              >
                {link.label}
                {link.children && <ChevronDown size={14} className="group-hover:rotate-180 transition-transform" />}
              </a>
              {link.children && (
                <div className="absolute top-full left-0 mt-1 w-52 bg-white rounded-md shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  {link.children.map((child) => (
                    <a
                      key={child.label}
                      href={child.href}
                      className="block px-4 py-3 text-sm text-gray-700 hover:text-[#1e7e34] hover:bg-green-50 first:rounded-t-xl last:rounded-b-xl transition-colors"
                    >
                      {child.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <a
            href="tel:+420733455966"
            className="hidden md:flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-[#1e7e34] transition-colors"
          >
            <Phone size={16} />
            +420 733 455 966
          </a>

          <button className="relative p-2 text-gray-700 hover:text-[#1e7e34] hover:bg-green-50 rounded-lg transition-all">
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#1e7e34] text-white text-xs font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          <button
            className="lg:hidden p-2 text-gray-700 hover:text-[#1e7e34] hover:bg-green-50 rounded-lg transition-all"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 text-sm font-medium text-gray-700 hover:text-[#1e7e34] hover:bg-green-50 rounded-lg transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-3 border-t border-gray-100">
                <a
                  href="tel:+420733455966"
                  className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-[#1e7e34]"
                >
                  <Phone size={16} />
                  +420 733 455 966
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
