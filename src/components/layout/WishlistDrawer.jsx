import { ShoppingBag, X } from 'lucide-react'
import { formatPrice } from '../../data/products'
import { useStore } from '../../context/StoreContext'
import SafeImage from '../ui/SafeImage'

export default function WishlistDrawer() {
  const { wishlist, wishlistOpen, setWishlistOpen, toggleWishlist, addToCart } = useStore()

  if (!wishlistOpen) return null

  return (
    <div className="fixed inset-0 z-[75]">
      <button
        type="button"
        className="absolute inset-0 bg-ink/45"
        aria-label="Close wishlist"
        onClick={() => setWishlistOpen(false)}
      />
      <aside
        className="absolute right-0 top-0 h-full w-[min(100vw,420px)] bg-ivory flex flex-col shadow-2xl"
        data-lenis-prevent
        style={{ animation: 'slideDrawer 0.35s ease both' }}
      >
        <div className="flex items-center justify-between px-5 py-5 border-b border-line">
          <h2 className="font-display text-2xl">Wishlist</h2>
          <button type="button" aria-label="Close wishlist" onClick={() => setWishlistOpen(false)}>
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {wishlist.length === 0 && (
            <p className="text-muted text-sm py-10 text-center">Save the pieces you love.</p>
          )}
          {wishlist.map((item) => (
            <div key={item.id} className="flex gap-4 border-b border-line pb-4">
              <SafeImage src={item.image} alt="" className="h-24 w-20 object-cover bg-cream" />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between gap-2">
                  <p className="font-display text-lg leading-tight">{item.name}</p>
                  <button type="button" aria-label="Remove" onClick={() => toggleWishlist(item)}>
                    <X size={14} className="text-muted" />
                  </button>
                </div>
                <p className="text-sm mt-1">{formatPrice(item.price)}</p>
                <button
                  type="button"
                  onClick={() => addToCart(item)}
                  className="mt-3 text-[11px] tracking-[0.16em] uppercase flex items-center gap-1.5 hover:text-gold-deep"
                >
                  <ShoppingBag size={13} /> Add to bag
                </button>
              </div>
            </div>
          ))}
        </div>
      </aside>
    </div>
  )
}
