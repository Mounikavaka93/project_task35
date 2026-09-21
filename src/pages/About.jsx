import ScrollReveal from '../components/ui/ScrollReveal'
import SectionHeader from '../components/ui/SectionHeader'
import SafeImage from '../components/ui/SafeImage'

const values = [
  { title: 'Material first', copy: 'Leather, silk, gold, and glass chosen for how they age — not just how they photograph.' },
  { title: 'Edited, not endless', copy: 'We keep the rooms of the store small so every piece earns its place.' },
  { title: 'Ceremony in the everyday', copy: 'A watch, a scarf, a lipstick — the quiet rituals that make a day feel finished.' },
]

export default function About() {
  return (
    <main className="w-full">
      <section className="relative h-[46vh] min-h-[300px] overflow-hidden bg-ink w-full">
        <SafeImage
          src="/images/photo-1441984904996-e0b6ba687e04.jpg"
          alt="Atelier"
          loading="eager"
          className="h-full w-full object-cover opacity-60 animate-ken"
        />
        <div className="absolute inset-0 flex items-center justify-center text-center shell">
          <div className="animate-fade-up">
            <p className="text-[11px] tracking-[0.32em] uppercase text-gold">Since 2018</p>
            <h1 className="font-display text-5xl sm:text-6xl text-cream mt-2">The maison</h1>
          </div>
        </div>
      </section>

      <section className="w-full shell py-16 md:py-24 text-center">
        <SectionHeader
          title="Fancy Store"
          copy="We opened as a small atelier for people who dress with intention. Today the rooms have grown — jewellery, handbags, watches, cosmetics, footwear, accessories — but the eye is the same."
        />
        <p className="text-muted leading-relaxed max-w-3xl mx-auto">
          Fancy Store is a fashion and lifestyle boutique designed to feel like walking into a well-lit room: calm palettes, considered objects, and a little gold at the edges. We source for proportion and glow. We photograph for truth. We wrap every order as if it were a gift, because it usually is.
        </p>
      </section>

      <section className="bg-cream py-16 md:py-24 w-full">
        <div className="grid md:grid-cols-3 w-full">
          {values.map((item, i) => (
            <ScrollReveal key={item.title} delay={i * 90} className="px-6 md:px-10 py-8 md:py-4 md:border-r border-line last:border-r-0">
              <p className="text-[11px] tracking-[0.28em] uppercase text-gold-deep">0{i + 1}</p>
              <h3 className="font-display text-3xl mt-3">{item.title}</h3>
              <p className="text-muted mt-3 text-sm leading-relaxed">{item.copy}</p>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="w-full grid sm:grid-cols-3 text-center">
        {[
          ['12k+', 'Pieces placed'],
          ['36', 'Cities served'],
          ['4.9', 'Average rating'],
        ].map(([stat, label]) => (
          <div key={label} className="py-12 md:py-16 border-t border-r border-line">
            <p className="font-display text-5xl gold-text">{stat}</p>
            <p className="text-[11px] tracking-[0.24em] uppercase text-muted mt-2">{label}</p>
          </div>
        ))}
      </section>
    </main>
  )
}
