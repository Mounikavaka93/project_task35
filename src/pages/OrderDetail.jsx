import { useEffect, useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { Check, MapPin, Package, Receipt, Truck } from 'lucide-react'
import { formatMoney } from '../data/products'
import { formatDate, formatDateTime, getTimeline, shippingMethods } from '../data/checkout'
import { useStore } from '../context/StoreContext'
import SafeImage from '../components/ui/SafeImage'

function AddressBlock({ title, address }) {
  if (!address) return null
  return (
    <div>
      <h3 className="text-[11px] tracking-[0.2em] uppercase text-gold-deep mb-3">{title}</h3>
      <p className="font-medium">{address.fullName}</p>
      <p className="text-sm text-muted mt-1 leading-relaxed">
        {address.line1}
        {address.line2 ? `, ${address.line2}` : ''}
        <br />
        {address.city}, {address.state} {address.postal}
        <br />
        {address.country}
        <br />
        {address.phone}
        <br />
        {address.email}
      </p>
    </div>
  )
}

export default function OrderDetail() {
  const { id } = useParams()
  const [params] = useSearchParams()
  const justPlaced = params.get('placed') === '1'
  const { orders } = useStore()
  const order = orders.find((o) => o.id === id)
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 30000)
    return () => window.clearInterval(timer)
  }, [])

  const track = useMemo(() => (order ? getTimeline(order, now) : null), [order, now])
  const method = shippingMethods.find((m) => m.id === order?.shippingMethod)

  if (!order || !track) {
    return (
      <main className="shell py-24 text-center">
        <h1 className="font-display text-4xl">Order not found</h1>
        <Link to="/orders" className="inline-block mt-6 text-sm tracking-[0.16em] uppercase border-b border-gold">
          Back to orders
        </Link>
      </main>
    )
  }

  const paymentLabel =
    order.payment.method === 'card'
      ? `${order.payment.brand} ···· ${order.payment.last4}`
      : order.payment.method === 'upi'
        ? `UPI · ${order.payment.upiId}`
        : order.payment.method === 'paypal'
          ? `PayPal · ${order.payment.email}`
          : 'Cash on delivery'

  return (
    <main className="w-full">
      {justPlaced && (
        <div className="bg-ink text-cream text-center py-3 text-sm">
          Payment authorised. A confirmation is on its way to {order.address.email}.
        </div>
      )}

      <div className="shell py-10 md:py-12 border-b border-line flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p className="text-[11px] tracking-[0.28em] uppercase text-gold-deep">Tracking</p>
          <h1 className="font-display text-4xl md:text-5xl mt-2">{order.id}</h1>
          <p className="text-muted mt-2 text-sm">
            Placed {formatDateTime(order.createdAt)} · AWB {order.trackingNumber}
          </p>
        </div>
        <div className="md:text-right">
          <p className="text-[11px] tracking-[0.18em] uppercase text-gold-deep">{track.statusLabel}</p>
          <p className="text-sm text-muted mt-1">
            {track.delivered ? 'Arrived' : `Estimated ${formatDate(order.eta)}`}
          </p>
        </div>
      </div>

      <section className="grid lg:grid-cols-[1.15fr_0.85fr] w-full">
        <div className="p-5 md:p-10 lg:p-12 border-b lg:border-b-0 lg:border-r border-line">
          <div className="flex items-center gap-3 mb-8">
            <Package size={18} className="text-gold-deep" />
            <h2 className="font-display text-2xl">Live shipment status</h2>
          </div>
          <ol className="track-line">
            {track.steps.map((step) => (
              <li key={step.key} className={`track-step ${step.done ? 'is-done' : ''}`}>
                <span className="track-dot">{step.done ? <Check size={12} /> : null}</span>
                <div>
                  <p className="font-medium">{step.label}</p>
                  <p className="text-sm text-muted">{step.copy}</p>
                  <p className="text-xs text-muted mt-1 flex items-center gap-1">
                    <MapPin size={11} /> {step.location}
                    {step.done && <> · {formatDateTime(step.at)}</>}
                  </p>
                </div>
              </li>
            ))}
          </ol>
          <p className="text-xs text-muted mt-6">Last update {formatDateTime(track.lastUpdate)} · refreshes automatically.</p>
        </div>

        <div className="bg-cream p-5 md:p-10 space-y-8">
          <div>
            <h3 className="text-[11px] tracking-[0.2em] uppercase text-gold-deep mb-3">Courier</h3>
            <p className="flex items-center gap-2 font-medium">
              <Truck size={16} className="text-gold-deep" /> {order.courier}
            </p>
            <p className="text-sm text-muted mt-2">
              {method?.name} · {method?.eta}
              <br />
              Tracking {order.trackingNumber}
            </p>
          </div>
          <AddressBlock title="Delivery address" address={order.address} />
          <AddressBlock title="Billing address" address={order.billing && order.billing.line1 ? order.billing : order.address} />
          {order.notes && (
            <div>
              <h3 className="text-[11px] tracking-[0.2em] uppercase text-gold-deep mb-3">Delivery note</h3>
              <p className="text-sm text-muted">{order.notes}</p>
            </div>
          )}
        </div>
      </section>

      <section className="grid lg:grid-cols-[1.15fr_0.85fr] w-full border-t border-line">
        <div className="divide-y divide-line">
          {order.items.map((item) => (
            <div key={item.id} className="flex gap-4 p-4 md:p-6">
              <SafeImage src={item.image} alt="" className="h-24 w-20 object-cover bg-cream" />
              <div className="flex-1 min-w-0">
                <p className="font-display text-xl leading-tight">{item.name}</p>
                <p className="text-sm text-muted mt-1">Qty {item.qty}</p>
              </div>
              <p className="text-sm">{formatMoney(item.price * item.qty)}</p>
            </div>
          ))}
        </div>
        <div className="p-5 md:p-10 lg:border-l border-t lg:border-t-0 border-line">
          <h3 className="text-[11px] tracking-[0.2em] uppercase text-gold-deep mb-4 flex items-center gap-2">
            <Receipt size={14} /> Payment
          </h3>
          <p className="font-medium">{paymentLabel}</p>
          <p className="text-sm text-muted mt-1">Charged to {order.payment.holder || order.address.fullName}</p>
          <dl className="mt-6 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Subtotal</dt>
              <dd>{formatMoney(order.totals.subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Shipping</dt>
              <dd>{order.totals.shipping === 0 ? 'Complimentary' : formatMoney(order.totals.shipping)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">VAT 20%</dt>
              <dd>{formatMoney(order.totals.tax)}</dd>
            </div>
            <div className="flex justify-between font-medium text-base pt-2 border-t border-line">
              <dt>Total paid</dt>
              <dd>{formatMoney(order.totals.total)}</dd>
            </div>
          </dl>
          <Link to="/orders" className="btn-outline mt-8 inline-flex px-6 py-3 text-xs tracking-[0.16em] uppercase">
            All orders
          </Link>
        </div>
      </section>
    </main>
  )
}
