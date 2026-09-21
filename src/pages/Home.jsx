import Hero from '../components/home/Hero'
import Categories from '../components/home/Categories'
import FeaturedProducts from '../components/home/FeaturedProducts'
import NewArrivals from '../components/home/NewArrivals'
import SpecialOffers from '../components/home/SpecialOffers'
import Lookbook from '../components/home/Lookbook'
import Testimonials from '../components/home/Testimonials'
import Newsletter from '../components/home/Newsletter'
import Marquee from '../components/ui/Marquee'
import { RotateCcw, Shield, Sparkles, Truck } from 'lucide-react'

const perks = [
  { icon: Truck, title: 'Complimentary shipping', copy: 'On orders over $150' },
  { icon: RotateCcw, title: 'Easy returns', copy: '30 days, no fuss' },
  { icon: Shield, title: 'Secure checkout', copy: 'Protected payments' },
  { icon: Sparkles, title: 'Atelier wrapping', copy: 'Gift-ready as standard' },
]

export default function Home() {
  return (
    <main className="w-full">
      <Hero />
      <Marquee />
      <section className="border-b border-line bg-ivory w-full">
        <div className="w-full grid grid-cols-2 lg:grid-cols-4">
          {perks.map(({ icon: Icon, title, copy }) => (
            <div
              key={title}
              className="flex items-center gap-3 px-4 py-6 md:px-8 md:py-8 border-r border-b lg:border-b-0 border-line"
            >
              <Icon size={20} className="text-gold-deep shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-medium leading-tight">{title}</p>
                <p className="text-xs text-muted mt-1">{copy}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <Categories />
      <FeaturedProducts />
      <NewArrivals />
      <SpecialOffers />
      <Lookbook />
      <Testimonials />
      <Newsletter />
    </main>
  )
}
