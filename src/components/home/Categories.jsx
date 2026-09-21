import { Link } from 'react-router-dom'
import { categories } from '../../data/products'
import ScrollReveal from '../ui/ScrollReveal'
import SectionHeader from '../ui/SectionHeader'
import SafeImage from '../ui/SafeImage'

export default function Categories() {
  return (
    <section id="categories" className="py-16 md:py-24 w-full">
      <div className="shell">
        <SectionHeader
          eyebrow="The maison"
          title="Shop by category"
          copy="Six rooms of the store — each edited with the same eye for material, proportion, and glow."
        />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 w-full">
        {categories.map((cat, i) => (
          <ScrollReveal key={cat.id} delay={i * 70} className="h-full">
            <Link
              to={`/shop?category=${cat.id}`}
              className="category-card group relative block overflow-hidden h-[240px] sm:h-[320px] lg:h-[380px] w-full"
            >
              <SafeImage src={cat.image} alt={cat.name} className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/15 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 md:p-7 text-cream">
                <p className="text-[11px] tracking-[0.24em] uppercase text-gold">{cat.count} pieces</p>
                <h3 className="font-display text-2xl md:text-3xl mt-1">{cat.name}</h3>
                <span className="mt-3 inline-block text-[11px] tracking-[0.2em] uppercase border-b border-gold pb-0.5 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  Explore
                </span>
              </div>
            </Link>
          </ScrollReveal>
        ))}
      </div>
    </section>
  )
}
