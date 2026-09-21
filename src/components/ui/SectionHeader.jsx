export default function SectionHeader({ eyebrow, title, copy, align = 'center' }) {
  const alignment = align === 'left' ? 'text-left items-start' : 'text-center items-center'

  return (
    <div className={`flex flex-col ${alignment} gap-3 mb-10 md:mb-14`}>
      {eyebrow && (
        <p className="text-[11px] tracking-[0.32em] uppercase text-gold-deep font-medium">
          {eyebrow}
        </p>
      )}
      <h2 className="font-display text-4xl sm:text-5xl md:text-[3.4rem] leading-none text-ink">
        {title}
      </h2>
      <span className="block w-12 h-px bg-gold" />
      {copy && <p className="max-w-xl text-muted text-sm sm:text-base leading-relaxed">{copy}</p>}
    </div>
  )
}
