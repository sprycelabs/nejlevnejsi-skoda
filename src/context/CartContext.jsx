import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext(null)

function loadCart() {
  try {
    const saved = localStorage.getItem('cart')
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items))
  }, [items])

  function addToCart(car) {
    setItems(prev => {
      const existing = prev.find(i => i.car.slug === car.slug)
      if (existing) {
        return prev.map(i => i.car.slug === car.slug ? { ...i, qty: i.qty + 1 } : i)
      }
      return [...prev, { car, qty: 1 }]
    })
    setIsOpen(true)
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'add_to_cart', {
        currency: 'CZK',
        value: car.salePrice,
        items: [{
          item_id: car.slug,
          item_name: `${car.name} ${car.variant}`,
          price: car.salePrice,
          quantity: 1,
        }],
      })
    }
  }

  function removeFromCart(carSlug) {
    setItems(prev => prev.filter(i => i.car.slug !== carSlug))
  }

  function updateQty(carSlug, qty) {
    if (qty < 1) return removeFromCart(carSlug)
    setItems(prev => prev.map(i => i.car.slug === carSlug ? { ...i, qty } : i))
  }

  function clearCart() {
    setItems([])
    localStorage.removeItem('cart')
  }

  const cartCount = items.reduce((sum, i) => sum + i.qty, 0)
  const cartTotal = items.reduce((sum, i) => sum + i.car.salePrice * i.qty, 0)

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQty, clearCart, cartCount, cartTotal, isOpen, setIsOpen }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
