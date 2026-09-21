import { useState } from 'react'
import { useStore } from '../../context/StoreContext'
import ScrollReveal from '../ui/ScrollReveal'

export default function Newsletter() {
  const { showToast } = useStore()
  const [email, setEmail] = useState('')

  const onSubmit = (e) => {
    e.preventDefault()
    showToast('You’re on the list for the next edit.')
    setEmail('')
  }

  return (
    <section className="w-full">
      <ScrollReveal>
        <div className="relative overflow-hidden bg-blush min-h-[300px] flex items-center w-full">
          <div className="absolute -right-8 -top-10 h-48 w-48 rounded-full border border-gold/40 animate-float" />
          <div
            className="absolute left-10 bottom-6 h-20 w-20 rounded-full border border-gold/30 animate-float"
            style={{ animationDelay: '1s' }}
          />
          <div className="relative w-full shell py-16 md:py-20 text-center">
            <p className="text-[11px] tracking-[0.32em] uppercase text-gold-deep">The inner circle</p>
            <h2 className="font-display text-4xl sm:text-5xl mt-3 text-ink">Stay in the gold light</h2>
            <p className="mt-3 text-ink-soft max-w-lg mx-auto text-sm sm:text-base">
              Early access to drops, private previews, and stories from the atelier — never noise.
            </p>
            <form
              onSubmit={onSubmit}
              className="mt-8 mx-auto max-w-xl flex flex-col sm:flex-row gap-2 sm:gap-0"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="input-line flex-1 px-4 py-3.5 text-sm"
              />
              <button
                type="submit"
                className="btn-gold px-8 py-3.5 text-xs tracking-[0.2em] uppercase font-medium"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </ScrollReveal>
    </section>
  )
}
