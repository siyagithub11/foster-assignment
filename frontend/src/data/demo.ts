export interface Product {
  id: string
  name: string
  price: number
  description: string
  image?: string
  emoji?: string
}

export interface Portion {
  id: string
  label: string
  extra: number
}

const LOREM =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.'


export const PIZZA: Product = {
  id: 'pizza',
  name: 'Lorem ipsum dolor sit amet',
  price: 14,
  description: LOREM,
  image: '/images/pizza.png',
  emoji: '🍕',
}

export const BEST_SELLERS: Product[] = [
  { id: 'sushi', name: 'Sushi platter', price: 103, description: LOREM, image: '/images/sushi.png', emoji: '🍣' },
  { id: 'curry', name: 'Butter chicken', price: 50, description: LOREM, image: '/images/curry.png', emoji: '🍛' },
  { id: 'lasagna', name: 'Lasagna', price: 12.99, description: LOREM, image: '/images/lasagna.png', emoji: '🍝' },
  { id: 'cupcake', name: 'Berry cupcake', price: 8.2, description: LOREM, image: '/images/cupcake.png', emoji: '🧁' },
]

export const PORTIONS: Portion[] = [
  { id: 'personal', label: 'Personal (4 Slides)', extra: 0 },
  { id: 'medium', label: 'Medium (8 Slides)', extra: 3 },
  { id: 'familiar', label: 'Familiar (10 Slides)', extra: 6 },
  { id: 'jumbo', label: 'Jumbo (12 Slides)', extra: 10 },
]