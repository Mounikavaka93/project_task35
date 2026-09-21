import { Minus, Plus, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { formatMoney, formatPrice } from '../../data/products'
import { FREE_SHIPPING_FROM, TAX_RATE } from '../../data/checkout'
import { useStore } from '../../context/StoreContext'
import SafeImage from '../ui/SafeImage'

export default function CartDrawer() {
  const { cart, cartOpen, setCartOpen, removeFromCart, updateQty, cartTotal } = useStore()
  const navigate = useNavigate()
  const shipping = cartTotal >= FREE_SHIPPING_FROM || cartTotal === 0 ? 0 : 12
  const tax = Number((cartTotal * TAX_RATE).toFixed(2))
  const total = cartTotal + shipping + tax

  const goCheckout = () => {
    setCartOpen(false)
    navigate('/checkout')
  }

  if (!cartOpen) return null

  return (
    <div className="fixed inset-0 z-[75]">
      <button
        type="button"
        className="absolute inset-0 bg-ink/45"
        aria-label="Close bag"
        onClick={() => setCartOpen(false)}
      />
      <aside
        className="absolute right-0 top-0 h-full w-[min(100vw,420px)] bg-ivory flex flex-col shadow-2xl"
        data-lenis-prevent
        style={{ animation: 'slideDrawer 0.35s ease both' }}
      >
        <div className="flex items-center justify-between px-5 py-5 border-b border-line">
          <h2 className="font-display text-2xl">Your bag</h2>
          <button type="button" aria-label="Close bag" onClick={() => setCartOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {cart.length === 0 && (
            <p className="text-muted text-sm py-10 text-center">Your bag is waiting to be dressed.</p>
          )}
          {cart.map((item) => (
            <div key={item.id} className="flex gap-4 border-b border-line pb-4">
              <SafeImage src={item.image} alt="" className="h-24 w-20 object-cover bg-cream" />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between gap-2">
                  <p className="font-display text-lg leading-tight">{item.name}</p>
                  <button type="button" aria-label="Remove" onClick={() => removeFromCart(item.id)}>
                    <X size={14} className="text-muted" />
                  </button>
                </div>
                <p className="text-sm mt-1">{formatPrice(item.price)}</p>
                <div className="mt-3 inline-flex items-center border border-line">
                  <button type="button" className="p-2" onClick={() => updateQty(item.id, item.qty - 1)}>
                    <Minus size={12} />
                  </button>
                  <span className="w-8 text-center text-sm">{item.qty}</span>
                  <button type="button" className="p-2" onClick={() => updateQty(item.id, item.qty + 1)}>
                    <Plus size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-line p-5 space-y-2">
          {cart.length > 0 && (
            <>
              <p className="text-[11px] tracking-[0.16em] uppercase text-gold-deep">
                Next step: address & payment
              </p>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Subtotal</span>
                <span>{formatMoney(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Shipping</span>
                <span>{shipping === 0 ? 'Complimentary' : formatMoney(shipping)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">VAT 20%</span>
                <span>{formatMoney(tax)}</span>
              </div>
              <div className="flex justify-between text-sm font-medium pt-2">
                <span>Total</span>
                <span>{formatMoney(total)}</span>
              </div>
              <button
                type="button"
                onClick={goCheckout}
                className="btn-gold block w-full text-center py-3.5 text-xs tracking-[0.2em] uppercase font-medium mt-3"
              >
                Checkout & pay
              </button>
            </>
          )}
          <button
            type="button"
            onClick={() => {
              setCartOpen(false)
              navigate(cart.length ? '/cart' : '/shop')
            }}
            className="block w-full text-center py-2 text-xs tracking-[0.16em] uppercase text-muted hover:text-ink"
          >
            {cart.length ? 'View full bag' : 'Continue shopping'}
          </button>
        </div>
      </aside>
    </div>
  )
}
