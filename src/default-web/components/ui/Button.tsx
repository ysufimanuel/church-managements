import type { ReactNode } from 'react'

type Variant = 'primary' | 'ghost' | 'link'

type ButtonProps = {
  href: string
  variant?: Variant
  className?: string
  children: ReactNode
  onClick?: () => void
}

const base =
  'inline-flex items-center justify-center gap-2 font-semibold transition-[transform,filter,border-color] duration-press ease-out-strong touch-manipulation'

const variants: Record<Variant, string> = {
  primary: 'min-h-12 rounded-full bg-accent px-6 text-accent-ink hover:brightness-110 active:scale-[0.97]',
  ghost: 'min-h-12 rounded-full border border-line px-6 text-ink hover:border-ink-muted active:scale-[0.97]',
  link: 'min-h-11 text-accent',
}

export function Button({ href, variant = 'primary', className = '', children, onClick }: ButtonProps) {
  return (
    <a href={href} onClick={onClick} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </a>
  )
}
