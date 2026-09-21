import { useState } from 'react'
import { Mail, MapPin, Phone } from 'lucide-react'
import { useStore } from '../context/StoreContext'
import SectionHeader from '../components/ui/SectionHeader'
import SafeImage from '../components/ui/SafeImage'

export default function Contact() {
  const { showToast } = useStore()
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  const onSubmit = (e) => {
    e.preventDefault()
    showToast('Message received. We’ll write back shortly.')
    setForm({ name: '', email: '', message: '' })
  }

  return (
    <main className="w-full">
      <div className="shell py-12 md:py-16">
        <SectionHeader
          eyebrow="Atelier desk"
          title="Contact"
          copy="Questions about a piece, a size, or a gift? Write to us — we still answer like a boutique, not a queue."
        />
      </div>
      <div className="grid lg:grid-cols-2 w-full border-t border-line">
        <form onSubmit={onSubmit} className="space-y-4 p-5 md:p-10 lg:p-14 border-b lg:border-b-0 lg:border-r border-line">
          <input
            required
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="input-line w-full px-4 py-3.5 text-sm"
          />
          <input
            required
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="input-line w-full px-4 py-3.5 text-sm"
          />
          <textarea
            required
            rows={7}
            placeholder="How can we help?"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="input-line w-full px-4 py-3.5 text-sm resize-y"
          />
          <button type="submit" className="btn-gold px-8 py-3.5 text-xs tracking-[0.2em] uppercase font-medium">
            Send message
          </button>
        </form>

        <div className="flex flex-col">
          <div className="space-y-4 text-sm p-5 md:p-10 lg:p-14">
            <p className="flex gap-3">
              <MapPin size={18} className="text-gold-deep mt-0.5 shrink-0" />
              18 Atelier Lane, Mayfair, London W1K
            </p>
            <p className="flex gap-3">
              <Phone size={18} className="text-gold-deep mt-0.5 shrink-0" />
              +44 20 7946 0188
            </p>
            <p className="flex gap-3">
              <Mail size={18} className="text-gold-deep mt-0.5 shrink-0" />
              hello@fancystore.com
            </p>
          </div>
          <div className="flex-1 min-h-[280px] bg-cream overflow-hidden">
            <SafeImage
              src="/images/photo-1528909514045-2fa4ac7a08ba.jpg"
              alt="Boutique exterior"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </main>
  )
}
