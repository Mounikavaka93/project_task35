export default function Marquee() {
  const items = [
    'Jewellery',
    'Handbags',
    'Watches',
    'Cosmetics',
    'Footwear',
    'Accessories',
    'New Arrivals',
    'Autumn Edit',
    'Quiet Luxury',
  ]
  const row = [...items, ...items]

  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {row.map((item, i) => (
          <span key={`${item}-${i}`} className="marquee-item">
            {item}
            <span className="marquee-dot" />
          </span>
        ))}
      </div>
    </div>
  )
}
