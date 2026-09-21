import { forwardRef, useEffect, useState } from 'react'

const FALLBACK = '/images/fallback.svg'

const SafeImage = forwardRef(function SafeImage(
  { src, alt = '', className = '', loading = 'eager', ...props },
  ref,
) {
  const [current, setCurrent] = useState(src || FALLBACK)

  useEffect(() => {
    setCurrent(src || FALLBACK)
  }, [src])

  return (
    <img
      ref={ref}
      src={current}
      alt={alt}
      className={className}
      loading={loading}
      decoding="async"
      onError={() => {
        if (current !== FALLBACK) setCurrent(FALLBACK)
      }}
      {...props}
    />
  )
})

export default SafeImage
