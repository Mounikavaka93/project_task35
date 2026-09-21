import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { StoreProvider, useStore } from './context/StoreContext'
import useSmoothScroll, { smoothScrollTo } from './hooks/useSmoothScroll'
import Intro from './components/intro/Intro'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import CartDrawer from './components/layout/CartDrawer'
import CartBar from './components/layout/CartBar'
import WishlistDrawer from './components/layout/WishlistDrawer'
import SearchModal from './components/layout/SearchModal'
import Toast from './components/ui/Toast'
import Home from './pages/Home'
import Shop from './pages/Shop'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Orders from './pages/Orders'
import OrderDetail from './pages/OrderDetail'
import About from './pages/About'
import Contact from './pages/Contact'
import ProductDetail from './pages/ProductDetail'

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '')
      window.setTimeout(() => smoothScrollTo(id), 80)
      return
    }
    if (window.lenis) {
      window.lenis.scrollTo(0, { duration: 0.9 })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [pathname, hash])
  return null
}

function BackToTop() {
  const [show, setShow] = useState(false)
  const { cartCount } = useStore()
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 500)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  if (!show) return null
  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={() => {
        if (window.lenis) window.lenis.scrollTo(0, { duration: 1.1 })
        else window.scrollTo({ top: 0, behavior: 'smooth' })
      }}
      className={`fixed right-5 z-40 h-12 w-12 bg-ink text-cream grid place-items-center hover:bg-gold hover:text-ink transition-colors ${
        cartCount > 0 ? 'bottom-28' : 'bottom-5'
      }`}
    >
      <ArrowUp size={18} />
    </button>
  )
}

function AppShell() {
  const [entered, setEntered] = useState(false)
  const { cartOpen, wishlistOpen, searchOpen, menuOpen, cartCount } = useStore()
  const { pathname } = useLocation()
  useSmoothScroll(entered)

  useEffect(() => {
    const blocked = cartOpen || wishlistOpen || searchOpen || menuOpen
    if (blocked) window.lenis?.stop()
    else window.lenis?.start()
  }, [cartOpen, wishlistOpen, searchOpen, menuOpen])

  if (!entered) {
    return <Intro onEnter={() => setEntered(true)} />
  }

  const showCartPad =
    cartCount > 0 && !cartOpen && !pathname.startsWith('/checkout') && !pathname.startsWith('/orders')

  return (
    <>
      <Navbar />
      <div className={`site-enter min-h-[calc(100svh-var(--header-h))] flex flex-col bg-ivory text-ink font-sans w-full ${showCartPad ? 'pb-28' : ''}`}>
        <ScrollToTop />
        <div className="flex-1 w-full">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/track" element={<Orders />} />
            <Route path="/orders/:id" element={<OrderDetail />} />
            <Route path="/track/:id" element={<OrderDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <Footer />
      </div>
      <CartDrawer />
      <CartBar />
      <WishlistDrawer />
      <SearchModal />
      <Toast />
      <BackToTop />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <StoreProvider>
        <AppShell />
      </StoreProvider>
    </BrowserRouter>
  )
}
