import { Link } from 'react-router-dom'
import { Minus, Plus, X } from 'lucide-react'
import { formatMoney, formatPrice } from '../data/products'
import { FREE_SHIPPING_FROM, TAX_RATE } from '../data/checkout'
import { useStore } from '../context/StoreContext'
import SectionHeader from '../components/ui/SectionHeader'
import SafeImage from '../components/ui/SafeImage'

export default function Cart() {
  const { cart, removeFromCart, updateQty, cartTotal, setCartOpen } = useStore()
  const shipping = cartTotal >= FREE_SHIPPING_FROM || cartTotal === 0 ? 0 : 12
  const tax = Number((cartTotal * TAX_RATE).toFixed(2))
  const total = cartTotal + shipping + tax
  const remaining = Math.max(0, FREE_SHIPPING_FROM - cartTotal)

  return (
    <main className="w-full py-12 md:py-16">
      <div className="shell">
        <SectionHeader
          align="left"
          eyebrow="Your bag"
          title="Shopping bag"
          copy="Review quantities, then continue to a secure checkout with address, payment, and tracking."
        />
      </div>

      {cart.length === 0 ? (
        <div className="shell py-16 text-center border-t border-line">
          <p className="font-display text-3xl">Your bag is empty</p>
          <Link to="/shop" className="btn-gold inline-flex mt-6 px-8 py-3.5 text-xs tracking-[0.2em] uppercase">
            Shop the edit
          </Link>
        </div>
      ) : (
        <div className="w-full">
          <div className="bg-ink text-cream">
            <div className="shell py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <p className="text-sm">
                Your bag is ready. Next: enter a delivery address, choose payment, then place the order.
              </p>
              <Link
                to="/checkout"
                onClick={() => setCartOpen(false)}
                className="btn-gold inline-flex justify-center px-6 py-3 text-[11px] tracking-[0.16em] uppercase font-medium shrink-0"
              >
                Continue to checkout
              </Link>
            </div>
          </div>
          <div className="grid lg:grid-cols-[1.4fr_0.8fr] w-full border-t border-line">
          <div className="divide-y divide-line">
            {cart.map((item) => (
              <div key={item.id} className="flex gap-4 p-4 md:p-6">
                <SafeImage src={item.image} alt="" className="h-28 w-24 object-cover bg-cream shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between gap-3">
                    <div>
                      <p className="text-[11px] tracking-[0.18em] uppercase text-muted">{item.category}</p>
                      <Link to={`/product/${item.id}`} className="font-display text-xl leading-tight">
                        {item.name}
                      </Link>
                    </div>
                    <button type="button" aria-label="Remove" onClick={() => removeFromCart(item.id)}>
                      <X size={16} className="text-muted" />
                    </button>
                  </div>
                  <p className="mt-2">{formatPrice(item.price)}</p>
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
                <p className="hidden sm:block font-medium shrink-0">{formatMoney(item.price * item.qty)}</p>
              </div>
            ))}
          </div>

          <aside className="bg-cream p-5 md:p-8 lg:border-l border-t lg:border-t-0 border-line">
            <h2 className="font-display text-2xl">Order summary</h2>
            {remaining > 0 ? (
              <p className="text-sm text-muted mt-3">
                Add {formatMoney(remaining)} more for complimentary standard shipping.
              </p>
            ) : (
              <p className="text-sm text-gold-deep mt-3">Complimentary standard shipping unlocked.</p>
            )}
            <dl className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted">Subtotal</dt>
                <dd>{formatMoney(cartTotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Estimated shipping</dt>
                <dd>{shipping === 0 ? 'Complimentary' : formatMoney(shipping)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">VAT (20%)</dt>
                <dd>{formatMoney(tax)}</dd>
              </div>
              <div className="flex justify-between border-t border-line pt-3 text-base font-medium">
                <dt>Total</dt>
                <dd>{formatMoney(total)}</dd>
              </div>
            </dl>
            <Link
              to="/checkout"
              onClick={() => setCartOpen(false)}
              className="btn-gold mt-6 flex justify-center py-3.5 text-xs tracking-[0.2em] uppercase font-medium"
            >
              Proceed to checkout
            </Link>
            <Link to="/shop" className="block text-center mt-4 text-xs tracking-[0.16em] uppercase text-muted hover:text-ink">
              Continue shopping
            </Link>
          </aside>
        </div>
        </div>
      )}
    </main>
  )
}
