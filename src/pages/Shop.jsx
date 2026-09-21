import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { categories, products } from '../data/products'
import ProductCard from '../components/ui/ProductCard'
import SectionHeader from '../components/ui/SectionHeader'

export default function Shop() {
  const [params, setParams] = useSearchParams()
  const active = (params.get('category') || 'all').toLowerCase()
  const [sort, setSort] = useState('featured')

  const list = useMemo(() => {
    let items = active === 'all' ? [...products] : products.filter((p) => p.category === active)
    if (sort === 'price-asc') items.sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') items.sort((a, b) => b.price - a.price)
    if (sort === 'rating') items.sort((a, b) => b.rating - a.rating)
    if (sort === 'new') items.sort((a, b) => Number(b.isNew) - Number(a.isNew))
    return items
  }, [active, sort])

  const setCategory = (id) => {
    const next = new URLSearchParams(params)
    if (id === 'all') next.delete('category')
    else next.set('category', id)
    setParams(next)
  }

  return (
    <main className="w-full py-12 md:py-16">
      <div className="shell">
        <SectionHeader
          eyebrow="The boutique"
          title="Shop"
          copy="Filter by room of the store, sort by how you like to decide, and add to bag in a single motion."
        />

        <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between mb-8">
          <div className="flex gap-2 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => setCategory('all')}
              className={`shrink-0 px-4 py-2 text-[11px] tracking-[0.18em] uppercase border transition-colors ${
                active === 'all' ? 'bg-ink text-cream border-ink' : 'border-line hover:border-ink'
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id)}
                className={`shrink-0 px-4 py-2 text-[11px] tracking-[0.18em] uppercase border transition-colors ${
                  active === cat.id ? 'bg-ink text-cream border-ink' : 'border-line hover:border-ink'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
          <label className="text-sm text-muted flex items-center gap-2 shrink-0">
            Sort
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="input-line px-3 py-2 text-ink text-sm"
            >
              <option value="featured">Featured</option>
              <option value="new">New first</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="rating">Top rated</option>
            </select>
          </label>
        </div>
        <p className="text-sm text-muted mb-4">{list.length} pieces</p>
      </div>

      {list.length === 0 ? (
        <p className="shell py-16 text-center text-muted">No pieces in this category yet.</p>
      ) : (
      <div className="grid grid-cols-2 lg:grid-cols-4 w-full">
        {list.map((product) => (
          <div key={product.id} className="border-t border-r border-line">
            <div className="p-3 sm:p-4 h-full">
              <ProductCard product={product} />
            </div>
          </div>
        ))}
      </div>
      )}
    </main>
  )
}
