export const TAX_RATE = 0.2
export const FREE_SHIPPING_FROM = 150

export const shippingMethods = [
  {
    id: 'standard',
    name: 'Standard delivery',
    eta: '5–7 business days',
    days: 6,
    price: 12,
    courier: 'Fancy Atelier Logistics',
  },
  {
    id: 'express',
    name: 'Express delivery',
    eta: '2–3 business days',
    days: 3,
    price: 28,
    courier: 'Royal Mail Special Delivery',
  },
  {
    id: 'overnight',
    name: 'Overnight',
    eta: 'Next business day',
    days: 1,
    price: 48,
    courier: 'DHL Express',
  },
]

export const paymentMethods = [
  {
    id: 'card',
    name: 'Credit / Debit card',
    hint: 'Visa, Mastercard, Amex',
  },
  {
    id: 'upi',
    name: 'UPI / Google Pay',
    hint: 'Instant bank transfer',
  },
  {
    id: 'paypal',
    name: 'PayPal',
    hint: 'Pay with your PayPal balance',
  },
  {
    id: 'cod',
    name: 'Cash on delivery',
    hint: 'Pay when the parcel arrives',
  },
]

export const countries = [
  'United Kingdom',
  'United States',
  'India',
  'France',
  'Italy',
  'United Arab Emirates',
  'Singapore',
  'Australia',
]

export const emptyAddress = {
  fullName: '',
  email: '',
  phone: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  postal: '',
  country: 'United Kingdom',
}

export const TRACK_STEPS = [
  { key: 'placed', label: 'Order placed', copy: 'We have received your order.' },
  { key: 'paid', label: 'Payment confirmed', copy: 'Funds authorised. Receipt sent by email.' },
  { key: 'packed', label: 'Packed at atelier', copy: 'Quality check complete. Gift wrap applied.' },
  { key: 'shipped', label: 'Shipped', copy: 'Handed to the courier with tracking live.' },
  { key: 'transit', label: 'In transit', copy: 'Parcel is moving through the network.' },
  { key: 'out', label: 'Out for delivery', copy: 'Your courier is on the local round.' },
  { key: 'delivered', label: 'Delivered', copy: 'Signed for at the delivery address.' },
]

const HOURS = {
  standard: { packed: 10, shipped: 28, transit: 52, out: 110, delivered: 140 },
  express: { packed: 6, shipped: 14, transit: 28, out: 40, delivered: 56 },
  overnight: { packed: 3, shipped: 8, transit: 14, out: 20, delivered: 26 },
}

export function getShippingCost(subtotal, methodId) {
  if (subtotal >= FREE_SHIPPING_FROM && methodId === 'standard') return 0
  return shippingMethods.find((m) => m.id === methodId)?.price ?? 12
}

export function detectCardBrand(number) {
  const n = number.replace(/\s/g, '')
  if (/^4/.test(n)) return 'Visa'
  if (/^3[47]/.test(n)) return 'American Express'
  if (/^5[1-5]/.test(n) || /^2[2-7]/.test(n)) return 'Mastercard'
  if (/^6/.test(n)) return 'Discover'
  return 'Card'
}

export function formatCardNumber(value) {
  const digits = value.replace(/\D/g, '').slice(0, 16)
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ')
}

export function formatExpiry(value) {
  const digits = value.replace(/\D/g, '').slice(0, 4)
  if (digits.length < 3) return digits
  return `${digits.slice(0, 2)}/${digits.slice(2)}`
}

export function addBusinessDays(from, days) {
  const date = new Date(from)
  let added = 0
  while (added < days) {
    date.setDate(date.getDate() + 1)
    const day = date.getDay()
    if (day !== 0 && day !== 6) added += 1
  }
  return date.getTime()
}

export function formatDateTime(ts) {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(ts))
}

export function formatDate(ts) {
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(ts))
}

export function getTimeline(order, now = Date.now()) {
  const created = order.createdAt
  const hours = HOURS[order.shippingMethod] || HOURS.standard
  const checkpoints = {
    placed: created,
    paid: created + 2 * 60 * 1000,
    packed: created + hours.packed * 3600000,
    shipped: created + hours.shipped * 3600000,
    transit: created + hours.transit * 3600000,
    out: created + hours.out * 3600000,
    delivered: created + hours.delivered * 3600000,
  }

  const locations = {
    placed: 'Fancy Store · Mayfair atelier',
    paid: 'Payments · London',
    packed: 'Atelier dispatch, W1K',
    shipped: `${order.courier} hub · Heathrow`,
    transit: order.address?.city ? `In transit to ${order.address.city}` : 'National sort centre',
    out: order.address?.city ? `Local depot · ${order.address.city}` : 'Local depot',
    delivered: order.address?.line1 || 'Delivery address',
  }

  let currentIndex = 0
  const steps = TRACK_STEPS.map((step, index) => {
    const at = checkpoints[step.key]
    const done = now >= at
    if (done) currentIndex = index
    return {
      ...step,
      at,
      done,
      location: locations[step.key],
    }
  })

  const current = steps[currentIndex]
  const delivered = current.key === 'delivered'
  const statusLabel = delivered ? 'Delivered' : current.label

  return { steps, currentIndex, current, statusLabel, delivered, lastUpdate: current.at }
}

export function createSampleOrders() {
  const now = Date.now()
  return [
    {
      id: 'FS-100184',
      trackingNumber: 'FANCY8821943301',
      createdAt: now - 36 * 3600000,
      shippingMethod: 'express',
      courier: 'Royal Mail Special Delivery',
      eta: addBusinessDays(now - 36 * 3600000, 3),
      address: {
        fullName: 'Amelia Hart',
        email: 'amelia@example.com',
        phone: '+44 7700 900184',
        line1: '12 Chesterfield Street',
        line2: 'Apartment 4B',
        city: 'London',
        state: 'Greater London',
        postal: 'W1J 5JN',
        country: 'United Kingdom',
      },
      billing: null,
      payment: { method: 'card', brand: 'Visa', last4: '4242', holder: 'Amelia Hart' },
      items: [
        {
          id: 'p1',
          name: 'Aurelia Gold Collar',
          image:
            '/images/photo-1515562141207-7a88fb7ce338.jpg',
          price: 248,
          qty: 1,
        },
        {
          id: 'p11',
          name: 'Solstice Sunglasses',
          image:
            '/images/photo-1511499767150-a48a237f0083.jpg',
          price: 145,
          qty: 1,
        },
      ],
      totals: { subtotal: 393, shipping: 0, tax: 78.6, total: 471.6 },
      notes: 'Please leave with the concierge if out.',
    },
    {
      id: 'FS-100092',
      trackingNumber: 'FANCY7710032294',
      createdAt: now - 12 * 24 * 3600000,
      shippingMethod: 'standard',
      courier: 'Fancy Atelier Logistics',
      eta: addBusinessDays(now - 12 * 24 * 3600000, 6),
      address: {
        fullName: 'Priya Kapoor',
        email: 'priya@example.com',
        phone: '+91 98765 44120',
        line1: '14 Altamount Road',
        line2: '',
        city: 'Mumbai',
        state: 'Maharashtra',
        postal: '400026',
        country: 'India',
      },
      billing: null,
      payment: { method: 'upi', brand: 'UPI', last4: '', holder: 'Priya Kapoor', upiId: 'priya@okaxis' },
      items: [
        {
          id: 'p8',
          name: 'Amber Noir Perfume',
          image:
            '/images/photo-1541643600914-78b084683601.jpg',
          price: 128,
          qty: 1,
        },
      ],
      totals: { subtotal: 128, shipping: 12, tax: 25.6, total: 165.6 },
      notes: '',
    },
  ]
}
