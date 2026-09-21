import { products } from '../../data/products'
import ProductCard from '../ui/ProductCard'
import ScrollReveal from '../ui/ScrollReveal'
import SectionHeader from '../ui/SectionHeader'

export default function NewArrivals() {
  const arrivals = products.filter((p) => p.isNew)

  return (
    <section id="arrivals" className="py-16 md:py-24 bg-cream w-full">
      <div className="shell">
        <SectionHeader
          eyebrow="Just landed"
          title="New arrivals"
          copy="Fresh silhouettes with a New badge — hover to see the second story of each piece."
        />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 w-full">
        {arrivals.map((product, i) => (
          <ScrollReveal key={product.id} delay={i * 60} className="h-full border-t border-r border-line bg-ivory">
            <div className="p-3 sm:p-4 h-full">
              <ProductCard product={product} />
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  )
}
