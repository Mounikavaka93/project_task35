import { useEffect, useRef, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import SafeImage from '../ui/SafeImage'

const LETTERS = ['F', 'A', 'N', 'C', 'Y']

const STILLS = [
  {
    src: '/images/photo-1483985988355-763728e1935b.jpg',
    label: 'Atelier',
    className: 'intro-still-1',
  },
  {
    src: '/images/photo-1469334031218-e382a71b716b.jpg',
    label: 'Mayfair',
    className: 'intro-still-2',
  },
  {
    src: '/images/photo-1515562141207-7a88fb7ce338.jpg',
    label: 'No. 18',
    className: 'intro-still-3',
  },
  {
    src: '/images/photo-1548036328-c9fa89d128fa.jpg',
    label: 'Autumn',
    className: 'intro-still-4',
  },
]

const RING = 2 * Math.PI * 54

export default function Intro({ onEnter }) {
  const [progress, setProgress] = useState(0)
  const [ready, setReady] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const screenRef = useRef(null)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setProgress(100)
      setReady(true)
      return () => {
        document.body.style.overflow = ''
      }
    }

    const start = performance.now()
    const duration = 3400
    let frame = 0

    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setProgress(Math.round(eased * 100))
      if (t < 1) {
        frame = requestAnimationFrame(tick)
      } else {
        setReady(true)
      }
    }

    frame = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(frame)
      document.body.style.overflow = ''
    }
  }, [])

  const onMove = (e) => {
    const node = screenRef.current
    if (!node || leaving) return
    const x = (e.clientX / window.innerWidth - 0.5) * 2
    const y = (e.clientY / window.innerHeight - 0.5) * 2
    node.style.setProperty('--mx', x.toFixed(3))
    node.style.setProperty('--my', y.toFixed(3))
  }

  const enter = () => {
    if (leaving) return
    setLeaving(true)
    window.setTimeout(onEnter, 1150)
  }

  return (
    <div
      ref={screenRef}
      className={`intro-screen ${ready ? 'is-ready' : ''} ${leaving ? 'is-leaving' : ''}`}
      role="dialog"
      aria-label="Welcome to Fancy Store"
      onMouseMove={onMove}
    >
      <div className="intro-grain" aria-hidden="true" />

      <div className="intro-stills" aria-hidden="true">
        {STILLS.map((still) => (
          <figure key={still.label} className={`intro-still ${still.className}`}>
            <SafeImage src={still.src} alt="" loading="eager" />
            <figcaption>{still.label}</figcaption>
          </figure>
        ))}
      </div>

      <div className="intro-aperture" aria-hidden="true">
        <SafeImage src="/images/photo-1483985988355-763728e1935b.jpg" alt="" loading="eager" />
      </div>

      <svg className="intro-rings" viewBox="0 0 600 600" aria-hidden="true">
        <circle className="intro-ring-track" cx="300" cy="300" r="262" />
        <circle className="intro-ring-draw" cx="300" cy="300" r="262" />
        <circle className="intro-ring-spin" cx="300" cy="300" r="238" />
        <circle className="intro-ring-spin intro-ring-spin-slow" cx="300" cy="300" r="214" />
      </svg>

      <div className="intro-dust" aria-hidden="true">
        {Array.from({ length: 22 }, (_, i) => (
          <span
            key={i}
            className="intro-speck"
            style={{
              left: `${(i * 19 + 7) % 100}%`,
              animationDelay: `${(i % 9) * 0.4}s`,
              animationDuration: `${7 + (i % 6)}s`,
            }}
          />
        ))}
      </div>

      <div className="intro-content">
        <p className="intro-kicker">Maison · London · MMXXVI</p>
        <h1 className="intro-word" aria-label="Fancy">
          {LETTERS.map((letter, i) => (
            <span className="intro-letter" key={letter} style={{ '--i': i }}>
              <span>{letter}</span>
            </span>
          ))}
        </h1>
        <svg className="intro-flourish" viewBox="0 0 240 36" aria-hidden="true">
          <path d="M8 22 C 42 6, 78 34, 118 16 S 186 4, 232 20" />
        </svg>
        <p className="intro-tag">Jewellery · Bags · Watches · Beauty · Footwear</p>

        <div className="intro-dial" aria-hidden="true">
          <svg viewBox="0 0 120 120">
            <circle className="intro-dial-track" cx="60" cy="60" r="54" />
            <circle
              className="intro-dial-bar"
              cx="60"
              cy="60"
              r="54"
              style={{ strokeDashoffset: RING * (1 - progress / 100) }}
            />
          </svg>
          <span className="intro-count">{String(progress).padStart(2, '0')}</span>
        </div>

        <button
          type="button"
          className={`intro-enter ${ready ? 'is-ready' : ''}`}
          onClick={enter}
          disabled={!ready}
        >
          Enter the maison <ArrowRight size={16} />
        </button>
        <button type="button" className="intro-skip" onClick={enter}>
          Skip intro
        </button>
      </div>
    </div>
  )
}
