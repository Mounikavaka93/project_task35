import { Link } from 'react-router-dom'
import { products } from '../../data/products'
import ProductCard from '../ui/ProductCard'
import ScrollReveal from '../ui/ScrollReveal'
import SectionHeader from '../ui/SectionHeader'

export default function FeaturedProducts() {
  const featured = products.filter((p) => p.isFeatured).slice(0, 8)

  return (
    <section className="py-16 md:py-20 w-full">
      <div className="shell">
        <SectionHeader
          eyebrow="Editor’s choice"
          title="Featured pieces"
          copy="The items our atelier keeps returning to — priced with the original, and the invitation to save."
        />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 w-full">
        {featured.map((product, i) => (
          <ScrollReveal key={product.id} delay={i * 60} className="h-full border-t border-r border-line">
            <div className="p-3 sm:p-4 h-full">
              <ProductCard product={product} />
            </div>
          </ScrollReveal>
        ))}
      </div>
      <div className="text-center py-10 border-t border-line">
        <Link
          to="/shop"
          className="btn-outline inline-flex px-8 py-3.5 text-xs tracking-[0.22em] uppercase font-medium"
        >
          View all products
        </Link>
      </div>
    </section>
  )
}
