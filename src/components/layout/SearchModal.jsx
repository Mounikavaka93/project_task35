import { useEffect, useState } from 'react'
import { Search, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatPrice } from '../../data/products'
import { useStore } from '../../context/StoreContext'
import SafeImage from '../ui/SafeImage'

export default function SearchModal() {
  const { searchOpen, setSearchOpen, searchProducts } = useStore()
  const [query, setQuery] = useState('')
  const results = searchProducts(query)

  useEffect(() => {
    if (!searchOpen) setQuery('')
  }, [searchOpen])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setSearchOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setSearchOpen])

  if (!searchOpen) return null

  return (
    <div className="fixed inset-0 z-[80]">
      <button
        type="button"
        className="absolute inset-0 bg-ink/55"
        aria-label="Close search"
        onClick={() => setSearchOpen(false)}
      />
      <div
        className="relative mx-auto mt-16 sm:mt-24 w-[min(92vw,720px)] bg-ivory p-5 sm:p-8 shadow-2xl"
        data-lenis-prevent
        style={{ animation: 'toastIn 0.35s ease both' }}
      >
        <div className="flex items-center gap-3 border-b border-line pb-3">
          <Search size={18} className="text-muted" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search jewellery, bags, watches…"
            className="flex-1 bg-transparent text-lg outline-none placeholder:text-muted"
          />
          <button type="button" aria-label="Close search" onClick={() => setSearchOpen(false)}>
            <X size={18} />
          </button>
        </div>
        <div className="mt-4 max-h-[50vh] overflow-y-auto space-y-2">
          {query && results.length === 0 && (
            <p className="text-sm text-muted py-6 text-center">No pieces matched that search.</p>
          )}
          {results.map((product) => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              onClick={() => setSearchOpen(false)}
              className="flex items-center gap-4 p-2 hover:bg-cream transition-colors"
            >
              <SafeImage src={product.image} alt="" className="h-16 w-14 object-cover" />
              <div className="flex-1 min-w-0">
                <p className="font-display text-lg leading-tight">{product.name}</p>
                <p className="text-xs uppercase tracking-[0.16em] text-muted">{product.category}</p>
              </div>
              <span className="text-sm">{formatPrice(product.price)}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
