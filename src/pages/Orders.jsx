import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { formatMoney } from '../data/products'
import { formatDate, getTimeline } from '../data/checkout'
import { useStore } from '../context/StoreContext'
import SectionHeader from '../components/ui/SectionHeader'
import SafeImage from '../components/ui/SafeImage'

export default function Orders() {
  const { orders } = useStore()
  const navigate = useNavigate()
  const [query, setQuery] = useState({ id: '', email: '' })
  const [error, setError] = useState('')

  const lookup = (e) => {
    e.preventDefault()
    const match = orders.find(
      (o) =>
        o.id.toLowerCase() === query.id.trim().toLowerCase() &&
        o.address.email.toLowerCase() === query.email.trim().toLowerCase(),
    )
    if (!match) {
      setError('No order matched that number and email.')
      return
    }
    navigate(`/orders/${match.id}`)
  }

  return (
    <main className="w-full py-12 md:py-16">
      <div className="shell">
        <SectionHeader
          align="left"
          eyebrow="Atelier desk"
          title="Orders & tracking"
          copy="Look up a parcel with your order number and email, or open any order placed on this device."
        />
      </div>

      <form onSubmit={lookup} className="shell grid sm:grid-cols-[1fr_1fr_auto] gap-3 pb-10">
        <input
          className="input-line px-3 py-3 text-sm"
          placeholder="Order number  e.g. FS-100184"
          value={query.id}
          onChange={(e) => setQuery((q) => ({ ...q, id: e.target.value }))}
        />
        <input
          type="email"
          className="input-line px-3 py-3 text-sm"
          placeholder="Email on the order"
          value={query.email}
          onChange={(e) => setQuery((q) => ({ ...q, email: e.target.value }))}
        />
        <button type="submit" className="btn-gold px-6 py-3 text-xs tracking-[0.16em] uppercase font-medium">
          Track
        </button>
        {error && <p className="sm:col-span-3 text-sm text-red-700">{error}</p>}
        <p className="sm:col-span-3 text-xs text-muted">
          Try a live sample: <strong>FS-100184</strong> · <strong>amelia@example.com</strong>
        </p>
      </form>

      <div className="border-t border-line">
        {orders.length === 0 && (
          <p className="shell py-16 text-muted text-center">No orders yet.</p>
        )}
        {orders.map((order) => {
          const track = getTimeline(order)
          return (
            <Link
              key={order.id}
              to={`/orders/${order.id}`}
              className="shell flex flex-col md:flex-row md:items-center gap-4 py-6 border-b border-line hover:bg-cream/60 transition-colors"
            >
              <div className="flex -space-x-2 shrink-0">
                {order.items.slice(0, 3).map((item) => (
                  <SafeImage key={item.id} src={item.image} alt="" className="h-14 w-12 object-cover border border-ivory" />
                ))}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium">{order.id}</p>
                <p className="text-sm text-muted">
                  {formatDate(order.createdAt)} · {order.items.length} item{order.items.length > 1 ? 's' : ''} · {order.courier}
                </p>
              </div>
              <div className="md:text-right">
                <p className="text-[11px] tracking-[0.16em] uppercase text-gold-deep">{track.statusLabel}</p>
                <p className="text-sm">{formatMoney(order.totals.total)}</p>
              </div>
            </Link>
          )
        })}
      </div>
    </main>
  )
}
