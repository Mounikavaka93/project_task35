import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ScrollReveal from '../ui/ScrollReveal'
import SafeImage from '../ui/SafeImage'

const END = new Date('2026-10-05T23:59:59')

function pad(n) {
  return String(n).padStart(2, '0')
}

export default function SpecialOffers() {
  const [time, setTime] = useState({ d: '00', h: '00', m: '00', s: '00' })

  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, END.getTime() - Date.now())
      const d = Math.floor(diff / 86400000)
      const h = Math.floor((diff % 86400000) / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      const s = Math.floor((diff % 60000) / 1000)
      setTime({ d: pad(d), h: pad(h), m: pad(m), s: pad(s) })
    }
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [])

  const cells = [
    { label: 'Days', value: time.d },
    { label: 'Hours', value: time.h },
    { label: 'Minutes', value: time.m },
    { label: 'Seconds', value: time.s },
  ]

  return (
    <section id="offers" className="w-full">
      <ScrollReveal variant="reveal-scale">
        <div className="relative overflow-hidden bg-ink text-cream min-h-[420px] md:min-h-[520px] grid md:grid-cols-2 w-full">
          <div className="absolute inset-0 md:relative md:inset-auto min-h-[420px]">
            <SafeImage
              src="/images/photo-1490481651871-ab68de25d43d.jpg"
              alt="Autumn sale"
              className="h-full w-full object-cover opacity-45 md:opacity-85"
            />
          </div>
          <div className="relative p-6 sm:p-10 lg:p-16 flex flex-col justify-center">
            <p className="text-[11px] tracking-[0.32em] uppercase text-gold">Special offers</p>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl mt-3 leading-none">
              30% off the
              <br />
              Autumn Edit
            </h2>
            <p className="mt-4 text-cream/75 max-w-md text-sm sm:text-base">
              Selected jewellery, handbags, and beauty — a seasonal invitation before the collection turns.
            </p>
            <div className="mt-8 grid grid-cols-4 gap-2 sm:gap-3">
              {cells.map((cell) => (
                <div key={cell.label} className="min-w-0 bg-white/8 border border-gold/30 text-center py-3 sm:py-5">
                  <p className="font-display text-2xl sm:text-4xl text-gold-light">{cell.value}</p>
                  <p className="text-[9px] sm:text-[10px] tracking-[0.18em] uppercase text-cream/60 mt-1">
                    {cell.label}
                  </p>
                </div>
              ))}
            </div>
            <Link
              to="/shop"
              className="btn-gold mt-8 inline-flex w-fit px-8 py-3.5 text-xs tracking-[0.22em] uppercase font-medium"
            >
              Claim the offer
            </Link>
          </div>
        </div>
      </ScrollReveal>
    </section>
  )
}
