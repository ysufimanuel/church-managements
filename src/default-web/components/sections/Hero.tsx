import { Button } from '../ui/Button'
import { Photo } from '../ui/Photo'

const facts = [
  { label: 'Berdiri sejak', value: '1995' },
  { label: 'Lokasi', value: 'Jakarta Pusat' },
  { label: 'Ibadah tatap muka', value: 'Ibadah Raya 1 & 2' },
]

export function Hero() {
  return (
    <section id="home" aria-label="Selamat datang" className="relative flex min-h-[560px] items-end overflow-hidden md:min-h-[640px]">
      <Photo fx={68} fy={22} />
      <div className="absolute inset-0 bg-scrim" aria-hidden="true" />

      <div className="gutter relative flex flex-col gap-8 pb-10 pt-24 md:gap-12 md:pb-14 md:pt-[120px]">
        <div className="flex max-w-[640px] flex-col gap-6">
          <h1 className="text-h1">
            Selamat Datang di WKC.
            <br />
            Kami senang Anda di sini.
          </h1>
          <p className="max-w-[520px] text-body text-ink-soft">
            Gereja untuk semua orang. Temukan komunitas, kelas, dan ibadah yang cocok untuk Anda dan keluarga.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button href="#about">Learn More</Button>
            <Button href="#schedule" variant="ghost">
              Lihat jadwal ibadah
            </Button>
          </div>
        </div>

        <dl className="grid grid-cols-1 gap-4 border-t border-ink-muted/30 pt-6 md:grid-cols-3 md:gap-6">
          {facts.map((f) => (
            <div key={f.label}>
              <dt className="text-caption text-ink-faint">{f.label}</dt>
              <dd className="mt-1 text-h3">{f.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
