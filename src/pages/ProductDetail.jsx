import { useMemo } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Heart, ShoppingBag } from 'lucide-react'
import { formatPrice, products } from '../data/products'
import { useStore } from '../context/StoreContext'
import ProductCard from '../components/ui/ProductCard'
import StarRating from '../components/ui/StarRating'
import SectionHeader from '../components/ui/SectionHeader'
import SafeImage from '../components/ui/SafeImage'

export default function ProductDetail() {
  const { id } = useParams()
  const product = products.find((p) => p.id === id)
  const { addToCart, toggleWishlist, isWishlisted, setCartOpen } = useStore()
  const navigate = useNavigate()

  const related = useMemo(() => {
    if (!product) return []
    return products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4)
  }, [product])

  if (!product) {
    return (
      <main className="py-24 text-center shell">
        <h1 className="font-display text-4xl">Piece not found</h1>
        <Link to="/shop" className="inline-block mt-6 text-sm tracking-[0.16em] uppercase border-b border-gold">
          Return to shop
        </Link>
      </main>
    )
  }

  const saved = isWishlisted(product.id)

  return (
    <main className="w-full">
      <div className="grid lg:grid-cols-2 w-full">
        <div className="relative overflow-hidden bg-cream min-h-[50vh] lg:min-h-[calc(100svh-110px)] group">
          <SafeImage
            src={product.image}
            alt={product.name}
            loading="eager"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
        <div className="flex flex-col justify-center p-6 md:p-12 lg:p-16">
          <p className="text-[11px] tracking-[0.24em] uppercase text-gold-deep">{product.category}</p>
          <h1 className="font-display text-4xl sm:text-5xl mt-2">{product.name}</h1>
          <div className="flex items-center gap-3 mt-4">
            <StarRating rating={product.rating} />
            <span className="text-sm text-muted">{product.reviews} reviews</span>
          </div>
          <div className="flex items-baseline gap-3 mt-5">
            <span className="text-2xl font-medium">{formatPrice(product.price)}</span>
            {product.originalPrice > product.price && (
              <span className="text-muted line-through">{formatPrice(product.originalPrice)}</span>
            )}
          </div>
          <p className="mt-6 text-muted leading-relaxed max-w-xl">{product.description}</p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 max-w-lg">
            <button
              type="button"
              onClick={() => addToCart(product)}
              className="btn-outline flex-1 py-3.5 text-xs tracking-[0.2em] uppercase font-medium inline-flex items-center justify-center gap-2"
            >
              <ShoppingBag size={16} /> Add to bag
            </button>
            <button
              type="button"
              onClick={() => {
                addToCart(product, 1, { openCart: false })
                setCartOpen(false)
                navigate('/checkout')
              }}
              className="btn-gold flex-1 py-3.5 text-xs tracking-[0.2em] uppercase font-medium inline-flex items-center justify-center gap-2"
            >
              Buy now
            </button>
          </div>
          <button
            type="button"
            onClick={() => toggleWishlist(product)}
            className="mt-3 text-xs tracking-[0.16em] uppercase text-muted hover:text-ink inline-flex items-center gap-2"
          >
            <Heart size={14} className={saved ? 'fill-gold text-gold' : ''} />
            {saved ? 'Saved to wishlist' : 'Add to wishlist'}
          </button>
        </div>
      </div>

      {related.length > 0 && (
        <section className="w-full border-t border-line">
          <div className="shell pt-14 pb-8">
            <SectionHeader eyebrow="More from this room" title="You may also like" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 w-full">
            {related.map((item) => (
              <div key={item.id} className="border-t border-r border-line">
                <div className="p-3 sm:p-4 h-full">
                  <ProductCard product={item} />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
