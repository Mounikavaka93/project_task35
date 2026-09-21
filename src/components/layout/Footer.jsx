import { Link } from 'react-router-dom'
import { Mail, MapPin, Phone, Sparkles } from 'lucide-react'
import { categories } from '../../data/products'
import { useState } from 'react'
import { useStore } from '../../context/StoreContext'

const socials = [
  {
    label: 'Instagram',
    path: 'M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zm10 1.8H7A2.2 2.2 0 0 0 4.8 7v10A2.2 2.2 0 0 0 7 19.2h10a2.2 2.2 0 0 0 2.2-2.2V7A2.2 2.2 0 0 0 17 4.8zM12 8.2A3.8 3.8 0 1 1 8.2 12 3.8 3.8 0 0 1 12 8.2zm0 1.5A2.3 2.3 0 1 0 14.3 12 2.3 2.3 0 0 0 12 9.7zM17.35 6.4a.9.9 0 1 1-.9.9.9.9 0 0 1 .9-.9z',
  },
  {
    label: 'Facebook',
    path: 'M14 8h3V4h-3c-2.8 0-5 2.2-5 5v2H7v4h2v7h4v-7h3.1l.9-4H13V9c0-.6.4-1 1-1z',
  },
  {
    label: 'X',
    path: 'M17.3 4H20l-6.3 7.2L21 20h-5.3l-4.2-5.5L6.6 20H4l6.8-7.8L3.2 4h5.4l3.8 5L17.3 4zm-1.9 14.4h1.5L8.7 5.5H7.1l8.3 12.9z',
  },
  {
    label: 'YouTube',
    path: 'M21.6 7.2a2.7 2.7 0 0 0-1.9-1.9C18 5 12 5 12 5s-6 0-7.7.3A2.7 2.7 0 0 0 2.4 7.2 28 28 0 0 0 2 12a28 28 0 0 0 .4 4.8 2.7 2.7 0 0 0 1.9 1.9C6 19 12 19 12 19s6 0 7.7-.3a2.7 2.7 0 0 0 1.9-1.9A28 28 0 0 0 22 12a28 28 0 0 0-.4-4.8zM10 15.2V8.8L15.5 12 10 15.2z',
  },
]

export default function Footer() {
  const { showToast } = useStore()
  const [email, setEmail] = useState('')

  const onSubmit = (e) => {
    e.preventDefault()
    if (!email.trim()) return
    showToast('Welcome to the inner circle.')
    setEmail('')
  }

  return (
    <footer className="bg-ink text-cream w-full">
      <div className="w-full shell py-16 md:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-5">
              <Sparkles size={18} className="text-gold" />
              <span className="font-display text-2xl tracking-[0.18em]">FANCY</span>
            </Link>
            <p className="text-cream/70 text-sm leading-relaxed mb-6">
              A modern maison for jewellery, handbags, watches, beauty, and the pieces that finish a life well lived.
            </p>
            <div className="flex gap-3">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href="#"
                  aria-label={social.label}
                  className="h-10 w-10 rounded-full border border-cream/20 grid place-items-center hover:bg-gold hover:text-ink hover:border-gold transition-all duration-300"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                    <path d={social.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-[11px] tracking-[0.28em] uppercase text-gold mb-5">Quick links</h3>
            <ul className="space-y-2.5 text-sm text-cream/75">
              <li><Link className="hover:text-gold transition-colors" to="/">Home</Link></li>
              <li><Link className="hover:text-gold transition-colors" to="/shop">Shop</Link></li>
              <li><Link className="hover:text-gold transition-colors" to="/cart">Bag</Link></li>
              <li><Link className="hover:text-gold transition-colors" to="/checkout">Checkout</Link></li>
              <li><Link className="hover:text-gold transition-colors" to="/orders">Track order</Link></li>
              <li><Link className="hover:text-gold transition-colors" to="/about">About</Link></li>
              <li><Link className="hover:text-gold transition-colors" to="/contact">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-[11px] tracking-[0.28em] uppercase text-gold mb-5">Categories</h3>
            <ul className="space-y-2.5 text-sm text-cream/75">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link className="hover:text-gold transition-colors" to={`/shop?category=${cat.id}`}>
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[11px] tracking-[0.28em] uppercase text-gold mb-5">Contact</h3>
            <ul className="space-y-3 text-sm text-cream/75">
              <li className="flex gap-3">
                <MapPin size={16} className="text-gold mt-0.5 shrink-0" />
                18 Atelier Lane, Mayfair, London
              </li>
              <li className="flex gap-3">
                <Phone size={16} className="text-gold mt-0.5 shrink-0" />
                +44 20 7946 0188
              </li>
              <li className="flex gap-3">
                <Mail size={16} className="text-gold mt-0.5 shrink-0" />
                hello@fancystore.com
              </li>
            </ul>
            <form onSubmit={onSubmit} className="mt-6 flex">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email for the edit"
                className="flex-1 min-w-0 bg-white/5 border border-cream/15 px-3 py-2.5 text-sm placeholder:text-cream/40 focus:outline-none focus:border-gold"
              />
              <button type="submit" className="btn-gold px-4 text-xs tracking-[0.16em] uppercase font-medium">
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-cream/10 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between text-xs text-cream/50">
          <p>© {new Date().getFullYear()} Fancy Store. All rights reserved.</p>
          <p className="tracking-[0.18em] uppercase">Fashion · Lifestyle · Quiet Luxury</p>
        </div>
      </div>
    </footer>
  )
}
