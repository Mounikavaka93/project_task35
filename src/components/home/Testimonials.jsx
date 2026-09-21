import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { testimonials } from '../../data/products'
import StarRating from '../ui/StarRating'
import ScrollReveal from '../ui/ScrollReveal'
import SectionHeader from '../ui/SectionHeader'
import SafeImage from '../ui/SafeImage'

export default function Testimonials() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % testimonials.length)
    }, 5200)
    return () => window.clearInterval(id)
  }, [])

  const go = (dir) => {
    setIndex((i) => (i + dir + testimonials.length) % testimonials.length)
  }

  const t = testimonials[index]

  return (
    <section className="py-16 md:py-24 bg-cream w-full">
      <div className="shell max-w-none">
        <SectionHeader eyebrow="Atelier notes" title="What they wear home" />
        <ScrollReveal>
          <div className="relative text-center max-w-4xl mx-auto">
            <SafeImage
              src={t.avatar}
              alt={t.name}
              className="mx-auto h-20 w-20 rounded-full object-cover ring-2 ring-gold/50 mb-6"
            />
            <StarRating rating={t.rating} className="justify-center mb-5" />
            <blockquote
              key={t.id}
              className="font-display text-2xl sm:text-3xl md:text-[2.25rem] leading-snug italic text-ink animate-fade-up"
            >
              “{t.quote}”
            </blockquote>
            <p className="mt-6 font-medium">{t.name}</p>
            <p className="text-sm text-muted">{t.role}</p>

            <div className="mt-8 flex items-center justify-center gap-4">
              <button
                type="button"
                aria-label="Previous review"
                onClick={() => go(-1)}
                className="h-10 w-10 border border-line grid place-items-center hover:bg-ink hover:text-cream transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    aria-label={`Go to review ${i + 1}`}
                    onClick={() => setIndex(i)}
                    className={`h-2 rounded-full transition-all ${i === index ? 'w-8 bg-gold' : 'w-2 bg-line'}`}
                  />
                ))}
              </div>
              <button
                type="button"
                aria-label="Next review"
                onClick={() => go(1)}
                className="h-10 w-10 border border-line grid place-items-center hover:bg-ink hover:text-cream transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
