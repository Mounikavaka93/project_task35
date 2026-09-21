import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { products } from '../data/products'
import {
  TAX_RATE,
  createSampleOrders,
  emptyAddress,
  getShippingCost,
  shippingMethods,
} from '../data/checkout'

const StoreContext = createContext(null)

const readStorage = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function StoreProvider({ children }) {
  const [cart, setCart] = useState(() => readStorage('fancy-cart', []))
  const [wishlist, setWishlist] = useState(() => readStorage('fancy-wishlist', []))
  const [orders, setOrders] = useState(() => {
    const saved = readStorage('fancy-orders', null)
    if (saved && saved.length) {
      const hasSamples = saved.some((o) => o.id === 'FS-100184' || o.id === 'FS-100092')
      if (hasSamples) return saved
      return [...createSampleOrders(), ...saved]
    }
    return createSampleOrders()
  })
  const [savedAddress, setSavedAddress] = useState(() => readStorage('fancy-address', emptyAddress))
  const [cartOpen, setCartOpen] = useState(false)
  const [wishlistOpen, setWishlistOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [toast, setToast] = useState(null)
  const [cartBump, setCartBump] = useState(false)
  const toastTimer = useRef(null)

  useEffect(() => {
    localStorage.setItem('fancy-cart', JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    localStorage.setItem('fancy-wishlist', JSON.stringify(wishlist))
  }, [wishlist])

  useEffect(() => {
    localStorage.setItem('fancy-orders', JSON.stringify(orders))
  }, [orders])

  useEffect(() => {
    localStorage.setItem('fancy-address', JSON.stringify(savedAddress))
  }, [savedAddress])

  const showToast = useCallback((message) => {
    setToast(message)
    if (toastTimer.current) window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(null), 4000)
  }, [])

  const addToCart = useCallback(
    (product, qty = 1, options = {}) => {
      setCart((prev) => {
        const existing = prev.find((item) => item.id === product.id)
        if (existing) {
          return prev.map((item) =>
            item.id === product.id ? { ...item, qty: item.qty + qty } : item,
          )
        }
        return [...prev, { ...product, qty }]
      })
      setCartBump(true)
      window.setTimeout(() => setCartBump(false), 450)
      showToast(`${product.name} added to bag`)
      if (options.openCart !== false) setCartOpen(true)
    },
    [showToast],
  )

  const removeFromCart = useCallback((id) => {
    setCart((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const updateQty = useCallback((id, qty) => {
    setCart((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, qty } : item))
        .filter((item) => item.qty > 0),
    )
  }, [])

  const clearCart = useCallback(() => setCart([]), [])

  const toggleWishlist = useCallback(
    (product) => {
      setWishlist((prev) => {
        const exists = prev.some((item) => item.id === product.id)
        if (exists) {
          showToast(`${product.name} removed from wishlist`)
          return prev.filter((item) => item.id !== product.id)
        }
        showToast(`${product.name} saved to wishlist`)
        return [...prev, product]
      })
    },
    [showToast],
  )

  const isWishlisted = useCallback(
    (id) => wishlist.some((item) => item.id === id),
    [wishlist],
  )

  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.qty, 0), [cart])
  const cartTotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.qty, 0),
    [cart],
  )

  const getTotals = useCallback(
    (methodId = 'standard') => {
      const subtotal = cartTotal
      const shipping = getShippingCost(subtotal, methodId)
      const tax = Number((subtotal * TAX_RATE).toFixed(2))
      const total = Number((subtotal + shipping + tax).toFixed(2))
      return { subtotal, shipping, tax, total }
    },
    [cartTotal],
  )

  const placeOrder = useCallback(
    ({ address, billing, payment, shippingMethod, notes }) => {
      const method = shippingMethods.find((m) => m.id === shippingMethod) || shippingMethods[0]
      const totals = getTotals(method.id)
      const id = `FS-${Math.floor(100000 + Math.random() * 900000)}`
      const order = {
        id,
        trackingNumber: `FANCY${Date.now().toString().slice(-10)}`,
        createdAt: Date.now(),
        shippingMethod: method.id,
        courier: method.courier,
        eta: Date.now() + method.days * 24 * 3600000,
        address,
        billing: billing || address,
        payment,
        items: cart.map((item) => ({
          id: item.id,
          name: item.name,
          image: item.image,
          price: item.price,
          qty: item.qty,
        })),
        totals,
        notes: notes || '',
      }
      setOrders((prev) => [order, ...prev])
      setSavedAddress(address)
      setCart([])
      showToast(`Order ${id} confirmed`)
      return order
    },
    [cart, getTotals, showToast],
  )

  const findOrder = useCallback(
    (id, email) => {
      const order = orders.find((o) => o.id.toLowerCase() === String(id).trim().toLowerCase())
      if (!order) return null
      if (email && order.address.email.toLowerCase() !== email.trim().toLowerCase()) return null
      return order
    },
    [orders],
  )

  const searchProducts = useCallback((query) => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q),
    )
  }, [])

  const value = {
    cart,
    wishlist,
    orders,
    savedAddress,
    setSavedAddress,
    cartOpen,
    setCartOpen,
    wishlistOpen,
    setWishlistOpen,
    searchOpen,
    setSearchOpen,
    menuOpen,
    setMenuOpen,
    toast,
    cartBump,
    addToCart,
    removeFromCart,
    updateQty,
    clearCart,
    toggleWishlist,
    isWishlisted,
    cartCount,
    cartTotal,
    getTotals,
    placeOrder,
    findOrder,
    searchProducts,
    showToast,
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
