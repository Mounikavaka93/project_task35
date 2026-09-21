import { Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useStore } from '../../context/StoreContext'

export default function Toast() {
  const { toast, setCartOpen, cartCount } = useStore()
  if (!toast) return null

  return (
    <div className="fixed top-[calc(var(--header-h)+12px)] left-1/2 z-[80] -translate-x-1/2 px-4 w-[min(92vw,460px)]">
      <div
        className="flex items-center gap-3 bg-ink text-cream px-4 py-3 shadow-2xl"
        style={{ animation: 'toastIn 0.35s ease both' }}
      >
        <span className="h-7 w-7 rounded-full bg-gold text-ink flex items-center justify-center shrink-0">
          <Check size={14} />
        </span>
        <p className="text-sm flex-1 min-w-0">{toast}</p>
        {cartCount > 0 && (
          <Link
            to="/checkout"
            onClick={() => setCartOpen(false)}
            className="shrink-0 text-[10px] tracking-[0.16em] uppercase bg-gold text-ink px-3 py-2 font-medium"
          >
            Checkout
          </Link>
        )}
      </div>
    </div>
  )
}
