type PhotoProps = {
  src?: string
  alt?: string
  /** Titik fokus gradien placeholder, 0-100 */
  fx?: number
  fy?: number
  className?: string
}

/**
 * Foto monokrom yang mengisi wadah `relative`.
 * Tanpa `src` memakai placeholder gradien; dengan `src` memaksa grayscale.
 */
export function Photo({ src, alt = '', fx = 70, fy = 20, className = '' }: PhotoProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={`absolute inset-0 h-full w-full object-cover grayscale contrast-110 ${className}`}
      />
    )
  }
  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 ${className}`}
      style={{
        backgroundImage: `radial-gradient(90% 70% at ${fx}% ${fy}%, #4A505C 0%, #252933 42%, #101218 100%)`,
      }}
    />
  )
}
