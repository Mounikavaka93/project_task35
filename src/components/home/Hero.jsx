import { useRef } from 'react'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { smoothScrollTo } from '../../hooks/useSmoothScroll'
import SafeImage from '../ui/SafeImage'

export default function Hero() {
  const wrapRef = useRef(null)
  const imgRef = useRef(null)

  const onMove = (e) => {
    const wrap = wrapRef.current
    const img = imgRef.current
    if (!wrap || !img) return
    const rect = wrap.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    img.style.transform = `scale(1.08) translate(${x * 18}px, ${y * 14}px)`
  }

  const onLeave = () => {
    if (imgRef.current) imgRef.current.style.transform = 'scale(1.04) translate(0, 0)'
  }

  return (
    <section
      ref={wrapRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="relative min-h-[100svh] overflow-hidden bg-ink text-cream w-full"
    >
      <div className="absolute inset-0">
        <SafeImage
          ref={imgRef}
          src="/images/photo-1483985988355-763728e1935b.jpg"
          alt="Fashion editorial banner"
          loading="eager"
          className="h-full w-full object-cover transition-transform duration-700 ease-out will-change-transform"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/88 via-ink/50 to-ink/15" />
      </div>

      <div className="absolute left-[6%] top-[16%] h-24 w-24 rounded-full border border-gold/30 animate-float hidden md:block" />
      <div
        className="absolute right-[10%] bottom-[18%] h-16 w-16 rounded-full border border-gold/40 animate-float hidden md:block"
        style={{ animationDelay: '1.2s' }}
      />
      <Sparkles className="absolute right-[16%] top-[24%] text-gold/70 animate-float hidden lg:block" size={22} />

      <div className="relative h-full min-h-[100svh] w-full flex flex-col justify-center shell py-24 md:py-28">
        <p className="animate-fade-up text-[11px] tracking-[0.38em] uppercase text-gold">
          Fancy Store · Autumn Atelier
        </p>
        <h1
          className="animate-fade-up font-display text-[3.4rem] sm:text-6xl md:text-7xl lg:text-[6rem] leading-[0.9] max-w-4xl mt-5"
          style={{ animationDelay: '0.14s' }}
        >
          Dress the day
          <br />
          in <em className="italic gold-text">quiet gold</em>
        </h1>
        <p
          className="animate-fade-up max-w-xl mt-6 text-cream/80 text-base sm:text-lg leading-relaxed"
          style={{ animationDelay: '0.28s' }}
        >
          Jewellery, handbags, watches, beauty, and the finishing pieces — curated for a modern life that still believes in ceremony.
        </p>
        <div className="animate-fade-up mt-10 flex flex-wrap gap-4" style={{ animationDelay: '0.4s' }}>
          <Link
            to="/shop"
            className="btn-gold inline-flex items-center gap-2 px-8 py-3.5 text-xs tracking-[0.22em] uppercase font-medium"
          >
            Shop now <ArrowRight size={16} />
          </Link>
          <a
            href="#lookbook"
            onClick={(e) => {
              e.preventDefault()
              smoothScrollTo('lookbook')
            }}
            className="inline-flex items-center gap-2 px-8 py-3.5 text-xs tracking-[0.22em] uppercase border border-cream/35 hover:border-gold hover:text-gold transition-colors"
          >
            View lookbook
          </a>
        </div>
      </div>
    </section>
  )
}
