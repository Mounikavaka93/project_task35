import { Star } from 'lucide-react'

export default function StarRating({ rating = 5, size = 14, className = '' }) {
  return (
    <div className={`flex items-center gap-0.5 ${className}`} aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i + 1 <= Math.round(rating)
        return (
          <Star
            key={i}
            size={size}
            className={filled ? 'fill-gold text-gold' : 'text-line'}
          />
        )
      })}
    </div>
  )
}
