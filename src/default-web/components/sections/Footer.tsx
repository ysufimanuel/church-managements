import { Logo } from '../ui/Logo'

const links = [
  { href: '#about', label: 'Tentang' },
  { href: '#leadership', label: 'Kepemimpinan' },
  { href: '#connect', label: 'Connect' },
  { href: '#grow', label: 'Grow' },
  { href: '#schedule', label: 'Jadwal' },
]

export function Footer() {
  return (
    <footer className="border-t border-line pt-10 pb-[calc(2.5rem+env(safe-area-inset-bottom,0px))]">
      <div className="gutter flex flex-wrap items-center justify-between gap-6">
        <Logo />
        <nav aria-label="Navigasi footer" className="flex flex-wrap gap-x-6 gap-y-2">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="inline-flex min-h-11 items-center text-body-sm font-semibold text-ink-muted transition-colors duration-hover ease-out-strong hover:text-ink"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <p className="w-full border-t border-line pt-6 text-caption text-ink-faint">
          © 2026 WKC Church. Gereja No. 123, Jakarta Pusat.
        </p>
      </div>
    </footer>
  )
}
