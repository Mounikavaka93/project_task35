import { Heart, ShoppingBag } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { formatPrice } from '../../data/products'
import { useStore } from '../../context/StoreContext'
import StarRating from './StarRating'
import SafeImage from './SafeImage'

export default function ProductCard({ product }) {
  const { addToCart, toggleWishlist, isWishlisted, setCartOpen } = useStore()
  const navigate = useNavigate()
  const saved = isWishlisted(product.id)
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const buyNow = () => {
    addToCart(product, 1, { openCart: false })
    setCartOpen(false)
    navigate('/checkout')
  }

  return (
    <article className="product-card group">
      <div className="product-media relative overflow-hidden bg-cream aspect-[3/4]">
        <SafeImage
          src={product.image}
          alt={product.name}
          className="primary absolute inset-0 h-full w-full object-cover"
        />
        <SafeImage
          src={product.hoverImage || product.image}
          alt=""
          className="secondary absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
          {product.isNew && (
            <span className="bg-ink text-cream text-[10px] tracking-[0.2em] uppercase px-2.5 py-1">
              New
            </span>
          )}
          {discount > 0 && (
            <span className="bg-gold text-ink text-[10px] tracking-[0.2em] uppercase px-2.5 py-1">
              -{discount}%
            </span>
          )}
        </div>

        <button
          type="button"
          aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}
          onClick={() => toggleWishlist(product)}
          className={`absolute top-3 right-3 z-10 h-10 w-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center transition-all duration-300 ${
            saved ? 'text-gold-deep' : 'text-ink hover:text-gold-deep'
          }`}
        >
          <Heart size={18} className={saved ? 'fill-gold text-gold' : ''} />
        </button>

        <div className="quick-actions absolute inset-x-3 bottom-3 z-10 flex gap-2">
          <button
            type="button"
            onClick={() => addToCart(product)}
            className="btn-gold flex-1 h-11 text-xs tracking-[0.16em] uppercase font-medium flex items-center justify-center gap-2"
          >
            <ShoppingBag size={15} /> Add to bag
          </button>
        </div>
      </div>

      <div className="product-copy space-y-1.5">
        <p className="text-[11px] tracking-[0.22em] uppercase text-muted">{product.category}</p>
        <Link
          to={`/product/${product.id}`}
          className="font-display text-xl leading-tight text-ink hover:text-gold-deep transition-colors"
        >
          {product.name}
        </Link>
        <div className="flex items-center gap-2">
          <StarRating rating={product.rating} />
          <span className="text-xs text-muted">({product.reviews})</span>
        </div>
        <div className="flex items-baseline gap-2 pt-1">
          <span className="text-ink font-medium">{formatPrice(product.price)}</span>
          {product.originalPrice > product.price && (
            <span className="text-muted text-sm line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={() => addToCart(product)}
            className="flex-1 h-10 text-[10px] tracking-[0.14em] uppercase border border-line hover:border-ink"
          >
            Add to bag
          </button>
          <button
            type="button"
            onClick={buyNow}
            className="btn-gold flex-1 h-10 text-[10px] tracking-[0.14em] uppercase font-medium"
          >
            Buy now
          </button>
        </div>
      </div>
    </article>
  )
}
