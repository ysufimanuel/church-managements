import { useEffect, useState } from 'react'
import { useScrollSpy } from '../../hooks/useScrollSpy'
import { Button } from '../ui/Button'
import { CloseIcon, MenuIcon } from '../ui/Icon'
import { Logo } from '../ui/Logo'

const items = [
  { id: 'home', label: 'Home' },
  { id: 'new', label: 'New to WKC' },
  { id: 'connect', label: 'Connect' },
  { id: 'grow', label: 'Grow' },
  { id: 'resources', label: 'Ministries / Resources' },
]

const SPY_IDS = ['home', 'new', 'about', 'leadership', 'connect', 'grow', 'resources', 'schedule']

// Seksi yang tidak punya item menu ikut menyalakan item terdekat.
const NAV_OF: Record<string, string> = { about: 'new', leadership: 'new', schedule: 'resources' }

export function Navbar() {
  const [open, setOpen] = useState(false)
  const spy = useScrollSpy(SPY_IDS)
  const active = NAV_OF[spy] ?? spy

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    const mq = window.matchMedia('(min-width: 768px)')
    const onChange = () => {
      if (mq.matches) setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    mq.addEventListener('change', onChange)
    return () => {
      window.removeEventListener('keydown', onKey)
      mq.removeEventListener('change', onChange)
    }
  }, [open])

  return (
    <header className="glass-nav pt-safe sticky top-0 z-nav border-b border-line">
      <div className="gutter flex min-h-[72px] items-center justify-between gap-6">
        <Logo />

        <nav aria-label="Navigasi utama" className="hidden items-center gap-7 md:flex">
          {items.map((item) => {
            const isActive = item.id === active
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                aria-current={isActive ? 'location' : undefined}
                className={`border-b-2 py-2 text-nav uppercase transition-colors duration-hover ease-out-strong ${
                  isActive ? 'border-accent text-ink' : 'border-transparent text-ink-muted hover:text-ink'
                }`}
              >
                {item.label}
              </a>
            )
          })}
        </nav>

        <div className="hidden md:block">
          <Button href="#schedule" className="!min-h-11 !px-5 text-body-sm">
            Jadwal ibadah
          </Button>
        </div>

        <div className="md:hidden">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-drawer"
            aria-label={open ? 'Tutup menu' : 'Buka menu'}
            className="flex h-12 w-12 items-center justify-center rounded-badge border border-line"
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {open ? (
        <div
          id="mobile-drawer"
          className="absolute inset-x-0 top-full z-drawer flex animate-drawer-in flex-col border-b border-line bg-[#151821] px-4 pb-6 pt-2 sm:px-6 md:hidden"
        >
          {items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={() => setOpen(false)}
              aria-current={item.id === active ? 'location' : undefined}
              className={`flex min-h-[52px] items-center border-b border-line text-nav uppercase ${
                item.id === active ? 'text-ink' : 'text-ink-muted'
              }`}
            >
              {item.label}
            </a>
          ))}
          <a
            href="#schedule"
            onClick={() => setOpen(false)}
            className="flex min-h-[52px] items-center text-nav uppercase text-accent"
          >
            Jadwal ibadah
          </a>
        </div>
      ) : null}
    </header>
  )
}
