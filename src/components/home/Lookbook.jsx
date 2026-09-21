import { lookbook } from '../../data/products'
import ScrollReveal from '../ui/ScrollReveal'
import SectionHeader from '../ui/SectionHeader'
import SafeImage from '../ui/SafeImage'

export default function Lookbook() {
  return (
    <section id="lookbook" className="py-16 md:py-24 w-full">
      <div className="shell">
        <SectionHeader
          eyebrow="The collection"
          title="Lookbook"
          copy="Editorial frames — large imagery, slow hover, and the kind of layout a magazine would keep."
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 md:h-[780px] w-full">
        {lookbook.map((item, i) => (
          <ScrollReveal
            key={item.id}
            delay={i * 90}
            variant="reveal"
            className={`h-[320px] md:h-auto ${item.span}`}
          >
            <article className="lookbook-tile relative h-full overflow-hidden group cursor-pointer">
              <SafeImage src={item.image} alt={item.title} className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-ink/20 group-hover:bg-ink/45 transition-colors duration-500" />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-cream translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                <p className="text-[11px] tracking-[0.24em] uppercase text-gold">{item.subtitle}</p>
                <h3 className="font-display text-3xl md:text-5xl mt-1">{item.title}</h3>
              </div>
            </article>
          </ScrollReveal>
        ))}
      </div>
    </section>
  )
}
