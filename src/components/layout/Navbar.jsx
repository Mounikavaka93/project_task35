import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Heart, Menu, Search, ShoppingBag, Sparkles, X, ChevronDown } from 'lucide-react'
import { categories } from '../../data/products'
import { useStore } from '../../context/StoreContext'
import { smoothScrollTo } from '../../hooks/useSmoothScroll'

const links = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/shop' },
  { label: 'New Arrivals', to: '/#arrivals', hash: 'arrivals' },
  { label: 'Offers', to: '/#offers', hash: 'offers' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

const SECTION_IDS = ['categories', 'arrivals', 'offers']

function navClass(on) {
  return `nav-link ${on ? 'active text-gold-deep' : 'text-ink-soft'}`
}

export default function Navbar() {
  const {
    cartCount,
    wishlist,
    cartBump,
    setSearchOpen,
    setCartOpen,
    setWishlistOpen,
    menuOpen,
    setMenuOpen,
  } = useStore()
  const [scrolled, setScrolled] = useState(false)
  const [catsOpen, setCatsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const headerRef = useRef(null)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const el = headerRef.current
    if (!el) return undefined
    const applyHeight = () => {
      document.documentElement.style.setProperty('--header-h', `${el.offsetHeight}px`)
    }
    applyHeight()
    const observer = new ResizeObserver(applyHeight)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const sync = () => {
      const y = window.lenis?.scroll ?? window.scrollY ?? 0
      setScrolled(y > 12)

      if (location.pathname !== '/') {
        setActiveSection('')
        return
      }

      const line =
        (parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 110) + 20
      let current = 'home'
      SECTION_IDS.forEach((id) => {
        const node = document.getElementById(id)
        if (node && node.getBoundingClientRect().top <= line) current = id
      })
      setActiveSection(current)
    }

    sync()
    window.addEventListener('scroll', sync, { passive: true })
    const frame = window.requestAnimationFrame(() => {
      window.lenis?.on('scroll', sync)
    })

    return () => {
      window.cancelAnimationFrame(frame)
      window.lenis?.off('scroll', sync)
      window.removeEventListener('scroll', sync)
    }
  }, [location.pathname])

  useEffect(() => {
    setMenuOpen(false)
    setCatsOpen(false)
  }, [location.pathname, location.hash, setMenuOpen])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const goHash = (id) => {
    if (location.pathname !== '/') {
      navigate(`/#${id}`)
    } else {
      smoothScrollTo(id)
    }
    setMenuOpen(false)
  }

  const isHome = location.pathname === '/'

  return (
    <>
      <div ref={headerRef} className="fixed top-0 inset-x-0 z-50">
        <div className="bg-ink text-cream text-[11px] tracking-[0.22em] uppercase py-2.5 text-center px-4">
          Complimentary shipping on orders over $150 · Autumn edit now live
        </div>

        <header
          className={`transition-all duration-300 ${
            scrolled || !isHome
              ? 'bg-ivory/92 backdrop-blur-md shadow-[0_8px_30px_rgba(22,20,18,0.06)]'
              : 'bg-ivory/70 backdrop-blur-sm'
          }`}
        >
          <div className="w-full shell">
            <div className="h-[68px] md:h-[78px] flex items-center justify-between gap-3">
              <button
                type="button"
                className="lg:hidden icon-btn p-2 -ml-2"
                aria-label="Open menu"
                onClick={() => setMenuOpen(true)}
              >
                <Menu size={22} />
              </button>

              <Link to="/" className="flex items-center gap-2 group shrink-0">
                <span className="relative grid place-items-center h-9 w-9">
                  <Sparkles size={18} className="text-gold-deep" />
                  <span className="absolute inset-0 rounded-full border border-gold/50 animate-[pulseRing_2.4s_ease_infinite]" />
                </span>
                <span className="font-display text-2xl md:text-[1.85rem] tracking-[0.18em] leading-none">
                  FANCY
                </span>
              </Link>

              <nav className="hidden lg:flex items-center gap-7 text-[12px] tracking-[0.18em] uppercase">
                <NavLink to="/" className={() => navClass(isHome && activeSection === 'home')} end>
                  Home
                </NavLink>
                <NavLink to="/shop" className={({ isActive }) => navClass(isActive)}>
                  Shop
                </NavLink>

                <div
                  className="relative"
                  onMouseEnter={() => setCatsOpen(true)}
                  onMouseLeave={() => setCatsOpen(false)}
                >
                  <button
                    type="button"
                    className={`${navClass(isHome && activeSection === 'categories')} flex items-center gap-1`}
                    onClick={() => goHash('categories')}
                  >
                    Categories <ChevronDown size={14} />
                  </button>
                  <div
                    className={`absolute left-1/2 -translate-x-1/2 top-full pt-4 transition-all duration-300 ${
                      catsOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
                    }`}
                  >
                    <div className="bg-white min-w-[240px] border border-line shadow-xl p-3">
                      {categories.map((cat) => (
                        <Link
                          key={cat.id}
                          to={`/shop?category=${cat.id}`}
                          className="block px-3 py-2.5 text-[11px] tracking-[0.16em] uppercase hover:bg-cream hover:text-gold-deep transition-colors"
                        >
                          {cat.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                {links.slice(2).map((link) =>
                  link.hash ? (
                    <button
                      key={link.label}
                      type="button"
                      className={navClass(isHome && activeSection === link.hash)}
                      onClick={() => goHash(link.hash)}
                    >
                      {link.label}
                    </button>
                  ) : (
                    <NavLink
                      key={link.label}
                      to={link.to}
                      className={({ isActive }) => navClass(isActive)}
                    >
                      {link.label}
                    </NavLink>
                  ),
                )}
                <NavLink to="/orders" className={({ isActive }) => navClass(isActive)}>
                  Track
                </NavLink>
              </nav>

              <div className="flex items-center gap-1 sm:gap-2">
                {cartCount > 0 && (
                  <Link
                    to="/checkout"
                    className="hidden md:inline-flex btn-gold px-4 py-2 text-[11px] tracking-[0.16em] uppercase font-medium"
                  >
                    Checkout
                  </Link>
                )}
                <button
                  type="button"
                  className="icon-btn p-2"
                  aria-label="Search"
                  onClick={() => setSearchOpen(true)}
                >
                  <Search size={20} />
                </button>
                <button
                  type="button"
                  className="icon-btn p-2 relative"
                  aria-label="Wishlist"
                  onClick={() => setWishlistOpen(true)}
                >
                  <Heart size={20} />
                  {wishlist.length > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 rounded-full bg-gold text-ink text-[10px] grid place-items-center">
                      {wishlist.length}
                    </span>
                  )}
                </button>
                <button
                  type="button"
                  className={`icon-btn p-2 relative ${cartBump ? 'animate-cart-pop' : ''}`}
                  aria-label="Shopping bag"
                  onClick={() => setCartOpen(true)}
                >
                  <ShoppingBag size={20} />
                  {cartCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 rounded-full bg-ink text-cream text-[10px] grid place-items-center">
                      {cartCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </header>
      </div>
      <div className="shrink-0" style={{ height: 'var(--header-h)' }} aria-hidden="true" />

      <div
        className={`fixed inset-0 z-[70] lg:hidden transition-opacity duration-300 ${
          menuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <button
          type="button"
          className="absolute inset-0 bg-ink/50"
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
        />
        <aside
          className="absolute left-0 top-0 h-full w-[min(86vw,380px)] bg-ivory p-6 overflow-y-auto"
          data-lenis-prevent
          style={{ animation: menuOpen ? 'slideDrawerLeft 0.35s ease both' : undefined }}
        >
          <div className="flex items-center justify-between mb-10">
            <span className="font-display text-2xl tracking-[0.18em]">FANCY</span>
            <button type="button" aria-label="Close menu" onClick={() => setMenuOpen(false)}>
              <X size={22} />
            </button>
          </div>
          <nav className="flex flex-col gap-1">
            <Link to="/" className="font-display text-3xl py-2" onClick={() => setMenuOpen(false)}>
              Home
            </Link>
            <Link to="/shop" className="font-display text-3xl py-2" onClick={() => setMenuOpen(false)}>
              Shop
            </Link>
            <p className="mt-4 mb-2 text-[11px] tracking-[0.24em] uppercase text-muted">Categories</p>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/shop?category=${cat.id}`}
                className="py-1.5 text-ink-soft"
                onClick={() => setMenuOpen(false)}
              >
                {cat.name}
              </Link>
            ))}
            <button type="button" className="font-display text-3xl py-2 text-left mt-4" onClick={() => goHash('arrivals')}>
              New Arrivals
            </button>
            <button type="button" className="font-display text-3xl py-2 text-left" onClick={() => goHash('offers')}>
              Offers
            </button>
            <Link to="/about" className="font-display text-3xl py-2" onClick={() => setMenuOpen(false)}>
              About
            </Link>
            <Link to="/contact" className="font-display text-3xl py-2" onClick={() => setMenuOpen(false)}>
              Contact
            </Link>
            <Link to="/orders" className="font-display text-3xl py-2" onClick={() => setMenuOpen(false)}>
              Track order
            </Link>
            <Link to="/cart" className="font-display text-3xl py-2" onClick={() => setMenuOpen(false)}>
              Bag {cartCount > 0 ? `(${cartCount})` : ''}
            </Link>
            {cartCount > 0 && (
              <Link
                to="/checkout"
                className="btn-gold mt-4 text-center py-3.5 text-xs tracking-[0.2em] uppercase font-medium"
                onClick={() => setMenuOpen(false)}
              >
                Checkout & pay
              </Link>
            )}
          </nav>
        </aside>
      </div>
    </>
  )
}
