import { useState } from 'react'

interface FoodImageProps {
  src?: string
  alt: string
  emoji?: string
  className?: string
}

export default function FoodImage({ src, alt, emoji = '🍽️', className = '' }: FoodImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null)

  if (!src || failedSrc === src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex items-center justify-center bg-linear-to-br from-orange-100 to-orange-300 ${className}`}
      >
        <span className="text-4xl">{emoji}</span>
      </div>
    )
  }

  return <img src={src} alt={alt} loading="lazy" onError={() => setFailedSrc(src)} className={`object-cover ${className}`} />
}