import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

export interface CartItem {
  productId: string
  name: string
  portion: string
  quantity: number
  unitPrice: number
}

interface CartValue {
  items: CartItem[]
  count: number
  addItem: (item: CartItem) => void
}

const CART_KEY = 'fastor_cart'
const CartContext = createContext<CartValue | null>(null)

function loadCart(): CartItem[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(CART_KEY) ?? '[]')
    return Array.isArray(parsed) ? (parsed as CartItem[]) : []
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadCart)

  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(items))
    } catch {
      /* storage unavailable - cart persist nahi hoga */
    }
  }, [items])

  // Same product + same portion ho to quantity badhao, duplicate line mat banao
  const addItem = useCallback((item: CartItem) => {
    setItems((prev) => {
      const index = prev.findIndex((p) => p.productId === item.productId && p.portion === item.portion)
      if (index === -1) return [...prev, item]
      return prev.map((p, i) => (i === index ? { ...p, quantity: p.quantity + item.quantity } : p))
    })
  }, [])

  const value = useMemo(
    () => ({ items, count: items.reduce((sum, i) => sum + i.quantity, 0), addItem }),
    [items, addItem],
  )
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>')
  return ctx
}