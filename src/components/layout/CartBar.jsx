import { Link, useLocation } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'
import { formatMoney } from '../../data/products'
import { FREE_SHIPPING_FROM, TAX_RATE } from '../../data/checkout'
import { useStore } from '../../context/StoreContext'

export default function CartBar() {
  const { cartCount, cartTotal, cartOpen, setCartOpen } = useStore()
  const { pathname } = useLocation()
  const hidden =
    cartCount === 0 ||
    cartOpen ||
    pathname.startsWith('/checkout') ||
    pathname.startsWith('/orders')

  if (hidden) return null

  const shipping = cartTotal >= FREE_SHIPPING_FROM ? 0 : 12
  const total = cartTotal + shipping + Number((cartTotal * TAX_RATE).toFixed(2))

  return (
    <div className="fixed bottom-0 inset-x-0 z-[65] bg-ink text-cream border-t border-gold/40 shadow-[0_-12px_40px_rgba(22,20,18,0.28)]">
      <div className="shell py-3 flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
        <div>
          <p className="text-sm flex items-center gap-2">
            <ShoppingBag size={16} className="text-gold" />
            {cartCount} {cartCount === 1 ? 'item' : 'items'} in bag · {formatMoney(total)} to pay
          </p>
          <p className="text-[11px] tracking-[0.12em] uppercase text-cream/60 mt-1">
            Next: address → payment → place order
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="flex-1 sm:flex-none px-4 py-3 text-[11px] tracking-[0.16em] uppercase border border-cream/30 hover:border-gold"
          >
            View bag
          </button>
          <Link
            to="/checkout"
            className="btn-gold flex-1 sm:flex-none text-center px-6 py-3 text-[11px] tracking-[0.16em] uppercase font-medium"
          >
            Checkout & pay
          </Link>
        </div>
      </div>
    </div>
  )
}
