import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getErrorMessage } from '../api/client'
import { fetchRestaurants } from '../api/restaurants'
import type { Restaurant } from '../api/restaurants'
import FoodImage from '../components/FoodImage'
import { PhoneIcon, WalletIcon } from '../components/Icons'
import Screen from '../components/Screen'
import { useAuth } from '../context/AuthContext'
import { BEST_SELLERS, PIZZA } from '../data/demo'
import type { Product } from '../data/demo'

type Status = 'loading' | 'ready' | 'error'

export default function Home() {
  const navigate = useNavigate()
  const { signOut } = useAuth()

  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [status, setStatus] = useState<Status>('loading')
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)
  const [toast, setToast] = useState('')

  useEffect(() => {
    let cancelled = false
    fetchRestaurants()
      .then((list) => {
        if (cancelled) return
        setRestaurants(list)
        setStatus('ready')
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setError(getErrorMessage(err, 'Could not load restaurants.'))
        setStatus('error')
      })
    return () => {
      cancelled = true
    }
  }, [reloadKey])

  useEffect(() => {
    if (!toast) return
    const id = window.setTimeout(() => setToast(''), 2000)
    return () => window.clearTimeout(id)
  }, [toast])

  const retry = () => {
    setStatus('loading')
    setError('')
    setReloadKey((k) => k + 1)
  }

  const openProduct = (product: Product) => navigate(`/product/${product.id}`, { state: { product } })

  const openRestaurant = (r: Restaurant) =>
    openProduct({
      id: r.id,
      name: r.name,
      price: PIZZA.price,
      description: r.subtitle ?? PIZZA.description,
      image: r.image,
      emoji: '🍽️',
    })

  const cancelOrder = (id: string) => {
    setRestaurants((prev) => prev.filter((r) => r.id !== id))
    setToast('Order cancelled')
  }

  return (
    <Screen className="pb-8">
   
      <header className="flex items-start justify-between border-b border-gray-200 px-5 pt-12 pb-3">
        <div>
          <p className="text-[13px] text-muted">Current Locations</p>
          <p className="mt-1 text-[15px] font-medium text-ink">Model Town, New Delhi</p>
        </div>
        <button
          type="button"
          onClick={signOut}
          className="mt-1 text-[13px] font-semibold text-primary underline-offset-2 hover:underline"
        >
          Logout
        </button>
      </header>

     
      <div className="flex items-center gap-3 px-5 pt-4">
        <div className="flex h-14 flex-1 items-center rounded-2xl bg-gray-100 px-4 text-[18px] text-muted">Karan</div>
        <button
          type="button"
          aria-label="Call"
          className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-orange-400 to-primary text-white"
        >
          <PhoneIcon className="h-5 w-5" />
        </button>
        <button
          type="button"
          aria-label="Wallet"
          className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-sky-400 to-indigo-600 text-white"
        >
          <WalletIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Best sellers */}
      <section className="mt-6">
        <h2 className="px-5 font-display text-[19px] font-semibold text-ink">Best Seller</h2>
        <div className="no-scrollbar mt-3 flex gap-3 overflow-x-auto px-5">
          {BEST_SELLERS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => openProduct(item)}
              aria-label={`${item.name}, $${item.price}`}
              className="relative h-27 w-18 shrink-0 overflow-hidden rounded-2xl"
            >
              <FoodImage src={item.image} alt={item.name} emoji={item.emoji} className="h-full w-full" />
              <span className="absolute bottom-1 left-0 rounded-r bg-primary-dark px-1.5 py-0.5 text-[10px] font-semibold text-white">
                ${item.price.toFixed(item.price % 1 === 0 ? 1 : 2)}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Promo banner */}
      <section className="mt-5 px-5">
        <button
          type="button"
          onClick={() => openProduct(PIZZA)}
          aria-label="30% off on our new dish"
          className="relative flex h-32.5 w-full overflow-hidden rounded-3xl bg-primary-dark text-left"
        >
          <span className="absolute -top-5 left-24 h-12 w-12 rounded-full border-4 border-yellow-400" aria-hidden="true" />
          <span className="absolute -bottom-4 -left-4 h-12 w-12 rounded-full border-4 border-yellow-400" aria-hidden="true" />
          <div className="relative z-10 flex w-[48%] flex-col justify-center pl-5 text-white">
            <p className="text-[13px] leading-tight">Experience our delicious new dish</p>
            <p className="mt-1 text-[28px] leading-none font-extrabold">30% OFF</p>
          </div>
          <FoodImage src={PIZZA.image} alt="Pizza" emoji={PIZZA.emoji} className="h-full w-[52%]" />
        </button>
        <div className="mt-3 flex justify-center gap-1.5" aria-hidden="true">
          {[0, 1, 2, 3, 4].map((i) => (
            <span key={i} className={`h-1 w-5 rounded-full ${i === 2 ? 'bg-primary-dark' : 'bg-orange-200'}`} />
          ))}
        </div>
      </section>

    
      <section className="mt-6 px-5">
        <h2 className="font-display text-[19px] font-semibold text-ink">Popular Items</h2>

        {status === 'loading' && (
          <ul className="mt-3 space-y-4" aria-label="Loading">
            {[0, 1, 2].map((i) => (
              <li key={i} className="flex animate-pulse gap-4">
                <div className="h-27 w-24 rounded-2xl bg-gray-200" />
                <div className="flex-1 space-y-3 pt-2">
                  <div className="h-4 w-2/3 rounded bg-gray-200" />
                  <div className="h-3 w-1/2 rounded bg-gray-200" />
                </div>
              </li>
            ))}
          </ul>
        )}

        {status === 'error' && (
          <div role="alert" className="mt-3 rounded-2xl bg-blush p-4 text-sm text-ink">
            <p>{error}</p>
            <button type="button" onClick={retry} className="mt-2 font-semibold text-primary underline">
              Try again
            </button>
          </div>
        )}

        {status === 'ready' && restaurants.length === 0 && (
          <p className="mt-3 text-sm text-muted">No restaurants found for this city.</p>
        )}

        {status === 'ready' && restaurants.length > 0 && (
          <ul className="mt-2">
            {restaurants.map((r) => (
              <li key={r.id} className="flex gap-4 border-b border-orange-100 py-4 last:border-b-0">
                <button type="button" onClick={() => openRestaurant(r)} aria-label={`Open ${r.name}`} className="shrink-0">
                  <FoodImage src={r.image} alt={r.name} className="h-27 w-24 rounded-2xl" />
                </button>
                <div className="flex min-w-0 flex-1 flex-col justify-between">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-display text-[19px] leading-tight font-semibold text-ink">{r.name}</h3>
                    {r.rating !== undefined && (
                      <span className="shrink-0 text-[15px] font-bold text-primary-dark">★ {r.rating.toFixed(1)}</span>
                    )}
                  </div>
                  {r.subtitle && <p className="truncate text-[13px] text-ink/80">{r.subtitle}</p>}
                  <div className="flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => cancelOrder(r.id)}
                      className="rounded-full bg-primary-dark px-3 py-1.5 text-[13px] font-semibold text-white"
                    >
                      Cancel Order
                    </button>
                    <button
                      type="button"
                      onClick={() => setToast('Driver tracking is coming soon')}
                      className="rounded-full bg-blush px-3 py-1.5 text-[13px] font-semibold text-primary-dark"
                    >
                      Track Driver
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {toast && (
        <div role="status" className="fixed bottom-6 left-1/2 z-20 -translate-x-1/2 rounded-full bg-ink px-4 py-2 text-sm text-white shadow-lg">
          {toast}
        </div>
      )}
    </Screen>
  )
}