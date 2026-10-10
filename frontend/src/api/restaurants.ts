import { api } from './client'

export interface Restaurant {
  id: string
  name: string
  image?: string
  subtitle?: string
  rating?: number
}

type Raw = Record<string, unknown>

const isObject = (v: unknown): v is Raw => typeof v === 'object' && v !== null && !Array.isArray(v)
const asString = (v: unknown): string | undefined => (typeof v === 'string' && v.trim() ? v.trim() : undefined)

function extractList(payload: unknown): unknown[] {
  const root = isObject(payload) ? payload : {}
  const data = isObject(root.data) ? root.data : {}
  const candidates = [
    payload,
    root.data,
    data.results,
    data.restaurants,
    data.items,
    data.list,
    root.results,
    root.restaurants,
  ]
  const found = candidates.find((c) => Array.isArray(c))
  return Array.isArray(found) ? found : []
}

function pickImage(raw: Raw): string | undefined {
  const direct = asString(raw.image_url) ?? asString(raw.image) ?? asString(raw.cover_image) ?? asString(raw.logo)
  if (direct) return direct
  const images = raw.images
  if (Array.isArray(images) && images.length > 0) {
    const first = images[0]
    if (typeof first === 'string') return first
    if (isObject(first)) return asString(first.url) ?? asString(first.image_url) ?? asString(first.image)
  }
  return undefined
}

function pickSubtitle(raw: Raw): string | undefined {
  const cuisines = raw.cuisines
  if (Array.isArray(cuisines) && cuisines.length > 0) {
    const names = cuisines
      .map((c) => (typeof c === 'string' ? c : isObject(c) ? asString(c.name) : undefined))
      .filter((c): c is string => Boolean(c))
    if (names.length > 0) return names.slice(0, 3).join(', ')
  }
  return asString(raw.location_name) ?? asString(raw.address) ?? asString(raw.city_name) ?? asString(raw.city)
}

function normalize(item: unknown, index: number): Restaurant {
  const raw = isObject(item) ? item : {}
  const rating = Number(raw.rating ?? raw.avg_rating)
  return {
    id: String(raw.id ?? raw.restaurant_id ?? raw._id ?? index),
    name: asString(raw.restaurant_name) ?? asString(raw.name) ?? asString(raw.title) ?? `Restaurant ${index + 1}`,
    image: pickImage(raw),
    subtitle: pickSubtitle(raw),
    rating: Number.isFinite(rating) && rating > 0 ? rating : undefined,
  }
}

export async function fetchRestaurants(cityId = 118): Promise<Restaurant[]> {
  const { data } = await api.get('/v1/m/restaurant', { params: { city_id: cityId } })
  return extractList(data).map(normalize)
}