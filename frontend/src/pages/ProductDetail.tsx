import { useEffect, useState } from 'react'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import FoodImage from '../components/FoodImage'
import { BackArrow, MinusIcon, PlusIcon } from '../components/Icons'
import Screen from '../components/Screen'
import { useCart } from '../context/CartContext'
import { BEST_SELLERS, PIZZA, PORTIONS } from '../data/demo'
import type { Product } from '../data/demo'

const MIN_QTY = 1
const MAX_QTY = 20

export default function ProductDetail() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { addItem } = useCart()
  const passed = (useLocation().state as { product?: Product } | null)?.product

  const [quantity, setQuantity] = useState(MIN_QTY)
  const [portionId, setPortionId] = useState(PORTIONS[0].id)
  const [added, setAdded] = useState('')

  useEffect(() => {
    if (!added) return
    const timer = window.setTimeout(() => setAdded(''), 2200)
    return () => window.clearTimeout(timer)
  }, [added])

  const product = passed ?? [PIZZA, ...BEST_SELLERS].find((p) => p.id === id)
  if (!product) return <Navigate to="/home" replace />

  const portion = PORTIONS.find((p) => p.id === portionId) ?? PORTIONS[0]

  const handleAdd = () => {
    addItem({
      productId: product.id,
      name: product.name,
      portion: portion.label,
      quantity,
      unitPrice: product.price + portion.extra,
    })
    setAdded(`Added ${quantity} × ${portion.label.split(' ')[0]} to cart`)
  }

  return (
    <Screen>
      <div className="relative px-5 pt-10">
        <FoodImage src={product.image} alt={product.name} emoji={product.emoji} className="h-56 w-full rounded-4xl" />
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="absolute top-14 left-8 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-primary shadow"
        >
          <BackArrow className="h-5 w-5" />
        </button>
      </div>

      {/* Price + quantity */}
      <div className="mx-5 mt-4 flex items-center justify-between border-y border-orange-100 py-2.5">
        <p className="font-display text-[26px] font-bold text-primary-dark">₹{product.price.toFixed(2)}</p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Decrease quantity"
            disabled={quantity <= MIN_QTY}
            onClick={() => setQuantity((q) => Math.max(MIN_QTY, q - 1))}
            className="flex h-6.5 w-6.5 items-center justify-center rounded-full bg-primary-dark text-white disabled:opacity-40"
          >
            <MinusIcon />
          </button>
          <span className="w-5 text-center text-[22px] text-ink" aria-live="polite">
            {quantity}
          </span>
          <button
            type="button"
            aria-label="Increase quantity"
            disabled={quantity >= MAX_QTY}
            onClick={() => setQuantity((q) => Math.min(MAX_QTY, q + 1))}
            className="flex h-6.5 w-6.5 items-center justify-center rounded-full bg-primary-dark text-white disabled:opacity-40"
          >
            <PlusIcon />
          </button>
        </div>
      </div>

      {/* Name + description */}
      <div className="px-5 pt-4">
        <h1 className="font-display text-[21px] font-semibold text-ink">{product.name}</h1>
        <p className="mt-1 text-[14px] leading-snug text-ink/90">{product.description}</p>
      </div>

      {/* Portion */}
      <div className="px-5 pt-8">
        <h2 className="font-display text-[21px] font-semibold text-ink">Personal portion</h2>
        <div role="radiogroup" aria-label="Portion size" className="mt-4 space-y-3.5">
          {PORTIONS.map((p) => {
            const selected = p.id === portionId
            return (
              <button
                key={p.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => setPortionId(p.id)}
                className="flex w-full items-center text-left text-[14px] text-ink"
              >
                <span>{p.label}</span>
                <span className="mx-2 flex-1 translate-y-0.5 border-b border-dotted border-orange-300" aria-hidden="true" />
                <span className="mr-3 text-[13px]">${p.extra.toFixed(2)}</span>
                <span
                  className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-primary-dark"
                  aria-hidden="true"
                >
                  {selected && <span className="h-2.5 w-2.5 rounded-full bg-primary-dark" />}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="mt-auto px-5 pt-8 pb-6">
        <button
          type="button"
          onClick={handleAdd}
          className="h-12 w-full rounded-lg bg-primary text-[16px] font-semibold tracking-wide text-white transition active:scale-[0.99]"
        >
          Add to cart
        </button>
      </div>

      {added && (
        <div role="status" className="fixed bottom-24 left-1/2 z-20 -translate-x-1/2 rounded-full bg-ink px-4 py-2 text-sm whitespace-nowrap text-white shadow-lg">
          {added}
        </div>
      )}
    </Screen>
  )
}