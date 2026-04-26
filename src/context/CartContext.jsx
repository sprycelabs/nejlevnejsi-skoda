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
      const existing = prev.find(i => i.car.id === car.id)
      if (existing) {
        return prev.map(i => i.car.id === car.id ? { ...i, qty: i.qty + 1 } : i)
      }
      return [...prev, { car, qty: 1 }]
    })
    setIsOpen(true)
  }

  function removeFromCart(carId) {
    setItems(prev => prev.filter(i => i.car.id !== carId))
  }

  function updateQty(carId, qty) {
    if (qty < 1) return removeFromCart(carId)
    setItems(prev => prev.map(i => i.car.id === carId ? { ...i, qty } : i))
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
