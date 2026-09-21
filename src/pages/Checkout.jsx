import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CreditCard, Lock, ShieldCheck, Truck } from 'lucide-react'
import { formatMoney } from '../data/products'
import {
  countries,
  detectCardBrand,
  emptyAddress,
  formatCardNumber,
  formatExpiry,
  FREE_SHIPPING_FROM,
  paymentMethods,
  shippingMethods,
} from '../data/checkout'
import { useStore } from '../context/StoreContext'
import SafeImage from '../components/ui/SafeImage'

const SAMPLE_ADDRESS = {
  fullName: 'Amelia Hart',
  email: 'amelia@example.com',
  phone: '+44 7700 900184',
  line1: '12 Chesterfield Street',
  line2: 'Apartment 4B',
  city: 'London',
  state: 'Greater London',
  postal: 'W1J 5JN',
  country: 'United Kingdom',
}

const Field = ({ label, children }) => (
  <label className="block">
    <span className="block text-[11px] tracking-[0.16em] uppercase text-muted mb-1.5">{label}</span>
    {children}
  </label>
)

export default function Checkout() {
  const { cart, savedAddress, getTotals, placeOrder } = useStore()
  const navigate = useNavigate()
  const [address, setAddress] = useState(() => ({
    ...emptyAddress,
    ...(savedAddress && typeof savedAddress === 'object' ? savedAddress : {}),
  }))
  const [billingSame, setBillingSame] = useState(true)
  const [billing, setBilling] = useState(() => ({
    ...emptyAddress,
    ...(savedAddress && typeof savedAddress === 'object' ? savedAddress : {}),
  }))
  const [shipId, setShipId] = useState('standard')
  const [payId, setPayId] = useState('card')
  const [card, setCard] = useState({ number: '', expiry: '', cvc: '', holder: '' })
  const [upiId, setUpiId] = useState('')
  const [paypalEmail, setPaypalEmail] = useState('')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const totals = useMemo(() => getTotals(shipId), [getTotals, shipId])
  const setAddr = (target, key, value) => {
    if (target === 'ship') setAddress((prev) => ({ ...prev, [key]: value }))
    else setBilling((prev) => ({ ...prev, [key]: value }))
  }

  const validate = () => {
    const required = ['fullName', 'email', 'phone', 'line1', 'city', 'state', 'postal', 'country']
    if (required.some((key) => !String(address[key]).trim())) {
      return 'Please complete every shipping field.'
    }
    if (!billingSame && required.some((key) => !String(billing[key]).trim())) {
      return 'Please complete the billing address.'
    }
    if (payId === 'card') {
      const digits = card.number.replace(/\s/g, '')
      if (digits.length < 16) return 'Enter a 16-digit card number.'
      if (!/^\d{2}\/\d{2}$/.test(card.expiry)) return 'Enter expiry as MM/YY.'
      const [mm, yy] = card.expiry.split('/').map(Number)
      const now = new Date()
      const exp = new Date(2000 + yy, mm)
      if (mm < 1 || mm > 12 || exp <= now) return 'Card expiry looks invalid.'
      if (card.cvc.replace(/\D/g, '').length < 3) return 'Enter a valid CVC.'
      if (!card.holder.trim()) return 'Enter the name on the card.'
    }
    if (payId === 'upi' && !/^[\w.-]+@[\w.-]+$/.test(upiId.trim())) {
      return 'Enter a valid UPI ID, for example name@okaxis.'
    }
    if (payId === 'paypal' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(paypalEmail)) {
      return 'Enter the PayPal email on the account.'
    }
    return ''
  }

  const fillDemo = () => {
    setAddress({ ...SAMPLE_ADDRESS })
    setBilling({ ...SAMPLE_ADDRESS })
    setPayId('card')
    setCard({
      number: formatCardNumber('4242424242424242'),
      expiry: '12/28',
      cvc: '123',
      holder: 'Amelia Hart',
    })
    setError('')
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    const message = validate()
    if (message) {
      setError(message)
      return
    }
    setError('')
    setBusy(true)
    await new Promise((resolve) => window.setTimeout(resolve, 1100))
    const digits = card.number.replace(/\s/g, '')
    const payment = {
      method: payId,
      brand:
        payId === 'card' ? detectCardBrand(digits) : payId === 'upi' ? 'UPI' : payId === 'paypal' ? 'PayPal' : 'Cash on delivery',
      last4: payId === 'card' ? digits.slice(-4) : '',
      holder: card.holder || address.fullName,
      upiId: payId === 'upi' ? upiId.trim() : '',
      email: payId === 'paypal' ? paypalEmail : address.email,
    }
    const order = placeOrder({
      address,
      billing: billingSame ? address : billing,
      payment,
      shippingMethod: shipId,
      notes,
    })
    navigate(`/orders/${order.id}?placed=1`)
  }

  if (cart.length === 0) {
    return (
      <main className="shell py-24 text-center">
        <h1 className="font-display text-4xl">Nothing to check out</h1>
        <Link to="/shop" className="btn-gold inline-flex mt-6 px-8 py-3.5 text-xs tracking-[0.2em] uppercase">
          Return to shop
        </Link>
      </main>
    )
  }

  return (
    <main className="w-full">
      <div className="shell py-10 md:py-12 border-b border-line">
        <p className="text-[11px] tracking-[0.28em] uppercase text-gold-deep">Secure checkout</p>
        <h1 className="font-display text-4xl md:text-5xl mt-2">Address & payment</h1>
        <ol className="mt-5 flex flex-wrap gap-3 text-[11px] tracking-[0.16em] uppercase">
          <li className="text-gold-deep">1. Bag</li>
          <li className="text-ink">2. Address</li>
          <li className="text-ink">3. Payment</li>
          <li className="text-muted">4. Confirmation</li>
        </ol>
        <p className="text-muted mt-2 max-w-xl text-sm">
          Encrypted connection · VAT included at 20% · Complimentary standard shipping from {formatMoney(FREE_SHIPPING_FROM)}.
        </p>
        <button
          type="button"
          onClick={fillDemo}
          className="mt-5 btn-gold inline-flex px-5 py-2.5 text-[11px] tracking-[0.16em] uppercase font-medium"
        >
          Fill sample address & card
        </button>
      </div>

      <form id="checkout-form" onSubmit={onSubmit} className="grid lg:grid-cols-[1.35fr_0.85fr] w-full">
        <div className="p-4 md:p-8 lg:p-12 space-y-10 border-b lg:border-b-0 lg:border-r border-line">
          <section>
            <div className="flex items-center justify-between gap-3 mb-5">
              <h2 className="font-display text-2xl">Shipping address</h2>
              <button
                type="button"
                className="text-[11px] tracking-[0.14em] uppercase text-gold-deep hover:underline"
                onClick={() => setAddress({ ...SAMPLE_ADDRESS })}
              >
                Use sample address
              </button>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="Full name">
                <input required className="input-line w-full px-3 py-3 text-sm" value={address.fullName} onChange={(e) => setAddr('ship', 'fullName', e.target.value)} />
              </Field>
              <Field label="Email">
                <input required type="email" className="input-line w-full px-3 py-3 text-sm" value={address.email} onChange={(e) => setAddr('ship', 'email', e.target.value)} />
              </Field>
              <Field label="Phone">
                <input required className="input-line w-full px-3 py-3 text-sm" value={address.phone} onChange={(e) => setAddr('ship', 'phone', e.target.value)} />
              </Field>
              <Field label="Country">
                <select className="input-line w-full px-3 py-3 text-sm" value={address.country} onChange={(e) => setAddr('ship', 'country', e.target.value)}>
                  {countries.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </Field>
              <div className="sm:col-span-2">
                <Field label="Address line 1">
                  <input required className="input-line w-full px-3 py-3 text-sm" value={address.line1} onChange={(e) => setAddr('ship', 'line1', e.target.value)} />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="Address line 2">
                  <input className="input-line w-full px-3 py-3 text-sm" value={address.line2} onChange={(e) => setAddr('ship', 'line2', e.target.value)} />
                </Field>
              </div>
              <Field label="City">
                <input required className="input-line w-full px-3 py-3 text-sm" value={address.city} onChange={(e) => setAddr('ship', 'city', e.target.value)} />
              </Field>
              <Field label="State / County">
                <input required className="input-line w-full px-3 py-3 text-sm" value={address.state} onChange={(e) => setAddr('ship', 'state', e.target.value)} />
              </Field>
              <Field label="Postal code">
                <input required className="input-line w-full px-3 py-3 text-sm" value={address.postal} onChange={(e) => setAddr('ship', 'postal', e.target.value)} />
              </Field>
            </div>
            <label className="mt-4 flex items-center gap-2 text-sm">
              <input type="checkbox" checked={billingSame} onChange={(e) => setBillingSame(e.target.checked)} />
              Billing address is the same as shipping
            </label>
          </section>

          {!billingSame && (
            <section>
              <h2 className="font-display text-2xl mb-5">Billing address</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                <Field label="Full name">
                  <input className="input-line w-full px-3 py-3 text-sm" value={billing.fullName} onChange={(e) => setAddr('bill', 'fullName', e.target.value)} />
                </Field>
                <Field label="Email">
                  <input type="email" className="input-line w-full px-3 py-3 text-sm" value={billing.email} onChange={(e) => setAddr('bill', 'email', e.target.value)} />
                </Field>
                <Field label="Phone">
                  <input className="input-line w-full px-3 py-3 text-sm" value={billing.phone} onChange={(e) => setAddr('bill', 'phone', e.target.value)} />
                </Field>
                <Field label="Country">
                  <select className="input-line w-full px-3 py-3 text-sm" value={billing.country} onChange={(e) => setAddr('bill', 'country', e.target.value)}>
                    {countries.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Address line 1">
                    <input className="input-line w-full px-3 py-3 text-sm" value={billing.line1} onChange={(e) => setAddr('bill', 'line1', e.target.value)} />
                  </Field>
                </div>
                <Field label="City">
                  <input className="input-line w-full px-3 py-3 text-sm" value={billing.city} onChange={(e) => setAddr('bill', 'city', e.target.value)} />
                </Field>
                <Field label="State / County">
                  <input className="input-line w-full px-3 py-3 text-sm" value={billing.state} onChange={(e) => setAddr('bill', 'state', e.target.value)} />
                </Field>
                <Field label="Postal code">
                  <input className="input-line w-full px-3 py-3 text-sm" value={billing.postal} onChange={(e) => setAddr('bill', 'postal', e.target.value)} />
                </Field>
              </div>
            </section>
          )}

          <section>
            <h2 className="font-display text-2xl mb-5">Delivery method</h2>
            <div className="space-y-3">
              {shippingMethods.map((method) => {
                const price = method.id === 'standard' && totals.subtotal >= FREE_SHIPPING_FROM ? 0 : method.price
                return (
                  <label
                    key={method.id}
                    className={`flex items-start gap-3 border p-4 cursor-pointer transition-colors ${
                      shipId === method.id ? 'border-gold bg-cream' : 'border-line hover:border-ink'
                    }`}
                  >
                    <input type="radio" name="ship" checked={shipId === method.id} onChange={() => setShipId(method.id)} className="mt-1" />
                    <Truck size={18} className="text-gold-deep mt-0.5" />
                    <span className="flex-1 min-w-0">
                      <span className="flex justify-between gap-3">
                        <span className="font-medium">{method.name}</span>
                        <span>{price === 0 ? 'Free' : formatMoney(price)}</span>
                      </span>
                      <span className="block text-sm text-muted mt-1">
                        {method.eta} · {method.courier}
                      </span>
                    </span>
                  </label>
                )
              })}
            </div>
          </section>

          <section>
            <h2 className="font-display text-2xl mb-5">Payment</h2>
            <div className="grid sm:grid-cols-2 gap-3 mb-5">
              {paymentMethods.map((method) => (
                <label
                  key={method.id}
                  className={`border p-4 cursor-pointer transition-colors ${
                    payId === method.id ? 'border-gold bg-cream' : 'border-line hover:border-ink'
                  }`}
                >
                  <input type="radio" name="pay" checked={payId === method.id} onChange={() => setPayId(method.id)} className="mr-2" />
                  <span className="font-medium">{method.name}</span>
                  <span className="block text-xs text-muted mt-1 ml-5">{method.hint}</span>
                </label>
              ))}
            </div>

            {payId === 'card' && (
              <div className="grid sm:grid-cols-2 gap-3 bg-ivory border border-line p-4">
                <div className="sm:col-span-2">
                  <Field label="Card number">
                    <div className="relative">
                      <CreditCard size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                      <input
                        className="input-line w-full pl-10 pr-3 py-3 text-sm"
                        placeholder="ACCT-000015"
                        inputMode="numeric"
                        autoComplete="cc-number"
                        value={card.number}
                        onChange={(e) => setCard((c) => ({ ...c, number: formatCardNumber(e.target.value) }))}
                      />
                    </div>
                  </Field>
                </div>
                <Field label="Name on card">
                  <input
                    className="input-line w-full px-3 py-3 text-sm"
                    autoComplete="cc-name"
                    value={card.holder}
                    onChange={(e) => setCard((c) => ({ ...c, holder: e.target.value }))}
                  />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Expiry">
                    <input
                      className="input-line w-full px-3 py-3 text-sm"
                      placeholder="MM/YY"
                      autoComplete="cc-exp"
                      value={card.expiry}
                      onChange={(e) => setCard((c) => ({ ...c, expiry: formatExpiry(e.target.value) }))}
                    />
                  </Field>
                  <Field label="CVC">
                    <input
                      className="input-line w-full px-3 py-3 text-sm"
                      placeholder="123"
                      inputMode="numeric"
                      autoComplete="cc-csc"
                      value={card.cvc}
                      onChange={(e) => setCard((c) => ({ ...c, cvc: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                    />
                  </Field>
                </div>
                <p className="sm:col-span-2 text-xs text-muted flex flex-wrap items-center gap-x-3 gap-y-2">
                  <span>Demo card: ACCT-000015 · any future expiry · any 3-digit CVC. We never store the full number or CVC.</span>
                  <button
                    type="button"
                    className="text-gold-deep tracking-[0.12em] uppercase hover:underline"
                    onClick={() =>
                      setCard({
                        number: formatCardNumber('4242424242424242'),
                        expiry: '12/28',
                        cvc: '123',
                        holder: address.fullName || 'Amelia Hart',
                      })
                    }
                  >
                    Fill demo card
                  </button>
                </p>
              </div>
            )}

            {payId === 'upi' && (
              <Field label="UPI ID">
                <input
                  className="input-line w-full px-3 py-3 text-sm"
                  placeholder="name@okaxis"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                />
              </Field>
            )}

            {payId === 'paypal' && (
              <Field label="PayPal email">
                <input
                  type="email"
                  className="input-line w-full px-3 py-3 text-sm"
                  placeholder="you@email.com"
                  value={paypalEmail}
                  onChange={(e) => setPaypalEmail(e.target.value)}
                />
              </Field>
            )}

            {payId === 'cod' && (
              <p className="text-sm text-muted border border-line p-4">
                Pay in cash or local card when the courier arrives. A signature will be required. COD is available on this order.
              </p>
            )}
          </section>

          <Field label="Delivery note (optional)">
            <textarea
              rows={3}
              className="input-line w-full px-3 py-3 text-sm"
              placeholder="Gate code, concierge, gift wrap…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </Field>
        </div>

        <aside className="bg-cream p-5 md:p-8 lg:p-10">
          <h2 className="font-display text-2xl">Your order</h2>
          <ul className="mt-5 space-y-4">
            {cart.map((item) => (
              <li key={item.id} className="flex gap-3">
                <SafeImage src={item.image} alt="" className="h-16 w-14 object-cover bg-ivory" />
                <div className="flex-1 min-w-0">
                  <p className="font-display text-lg leading-tight">{item.name}</p>
                  <p className="text-xs text-muted">Qty {item.qty}</p>
                </div>
                <p className="text-sm">{formatMoney(item.price * item.qty)}</p>
              </li>
            ))}
          </ul>
          <dl className="mt-6 space-y-2 text-sm border-t border-line pt-4">
            <div className="flex justify-between">
              <dt className="text-muted">Subtotal</dt>
              <dd>{formatMoney(totals.subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Shipping</dt>
              <dd>{totals.shipping === 0 ? 'Complimentary' : formatMoney(totals.shipping)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">VAT 20%</dt>
              <dd>{formatMoney(totals.tax)}</dd>
            </div>
            <div className="flex justify-between font-medium text-base pt-2">
              <dt>To pay</dt>
              <dd>{formatMoney(totals.total)}</dd>
            </div>
          </dl>
          {error && <p className="mt-4 text-sm text-red-700">{error}</p>}
          <button
            type="submit"
            disabled={busy}
            className="btn-gold w-full mt-6 py-3.5 text-xs tracking-[0.2em] uppercase font-medium disabled:opacity-60"
          >
            {busy ? 'Authorising payment…' : `Place order · ${formatMoney(totals.total)}`}
          </button>
          <p className="mt-4 flex items-center justify-center gap-2 text-xs text-muted">
            <Lock size={12} /> 256-bit SSL · <ShieldCheck size={12} /> PCI-ready demo checkout
          </p>
        </aside>
        <div className="lg:hidden sticky bottom-0 bg-ink text-cream p-3 z-30 col-span-full">
          <button
            type="submit"
            disabled={busy}
            className="btn-gold w-full py-3.5 text-xs tracking-[0.2em] uppercase font-medium disabled:opacity-60"
          >
            {busy ? 'Authorising payment…' : `Place order · ${formatMoney(totals.total)}`}
          </button>
        </div>
      </form>
    </main>
  )
}
