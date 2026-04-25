import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingCart, Trash2, Plus, Minus, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { formatPrice } from '../../data/cars'

export default function Cart() {
  const { items, removeFromCart, updateQty, cartTotal, isOpen, setIsOpen } = useCart()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/40 z-[60]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white z-[70] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <ShoppingCart size={20} className="text-[#1e7e34]" />
                <h2 className="font-black text-gray-900 text-lg">Košík</h2>
                {items.length > 0 && (
                  <span className="bg-[#1e7e34] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {items.reduce((s, i) => s + i.qty, 0)}
                  </span>
                )}
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-6">
                  <ShoppingCart size={48} className="text-gray-200" />
                  <p className="text-gray-400 font-medium">Košík je prázdný</p>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-[#1e7e34] font-semibold text-sm hover:underline"
                  >
                    Pokračovat v prohlížení
                  </button>
                </div>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {items.map(({ car, qty }) => (
                    <li key={car.id} className="flex gap-4 px-6 py-5">
                      {/* Image */}
                      <div className="w-20 h-16 bg-gray-50 rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                        <img src={car.image} alt={car.name} className="w-full h-full object-contain p-1" />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 text-sm truncate">{car.name}</p>
                        <p className="text-xs text-gray-400 mb-2">{car.variant}</p>
                        <div className="flex items-center justify-between">
                          {/* Qty controls */}
                          <div className="flex items-center gap-1 border border-gray-200 rounded-md">
                            <button
                              onClick={() => updateQty(car.id, qty - 1)}
                              className="p-1.5 hover:bg-gray-100 transition-colors"
                            >
                              <Minus size={13} className="text-gray-600" />
                            </button>
                            <span className="text-sm font-semibold w-6 text-center">{qty}</span>
                            <button
                              onClick={() => updateQty(car.id, qty + 1)}
                              className="p-1.5 hover:bg-gray-100 transition-colors"
                            >
                              <Plus size={13} className="text-gray-600" />
                            </button>
                          </div>
                          <span className="font-black text-[#1e7e34] text-sm">{formatPrice(car.salePrice * qty)}</span>
                        </div>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => removeFromCart(car.id)}
                        className="self-start p-1.5 hover:bg-red-50 hover:text-red-500 text-gray-300 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-gray-100 px-6 py-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-sm">Celkem</span>
                  <span className="font-black text-xl text-gray-900">{formatPrice(cartTotal)}</span>
                </div>
                <Link
                  to="/pokladna"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 w-full bg-[#1e7e34] hover:bg-[#28a745] text-white font-bold py-3.5 rounded-md transition-colors"
                >
                  Odeslat objednávku
                  <ArrowRight size={16} />
                </Link>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center text-sm text-gray-400 hover:text-gray-600 transition-colors"
                >
                  Pokračovat v prohlížení
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
