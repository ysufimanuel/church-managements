import { Button } from '../ui/Button'

const steps = [
  {
    title: 'Datang beribadah',
    body: 'Ikut Ibadah Raya 1 atau 2, atau tonton lewat live streaming dari rumah.',
    cta: 'Lihat jadwal',
    href: '#schedule',
  },
  {
    title: 'Temukan komunitas',
    body: 'Bergabung dengan kelompok kecil yang sesuai dengan usia dan tahap hidup Anda.',
    cta: 'Pilih kelompok',
    href: '#connect',
  },
  {
    title: 'Ikut kelas pertama',
    body: 'Mulai dari Kursus Alpha, terbuka untuk siapa saja yang ingin bertanya tentang iman.',
    cta: 'Lihat kelas',
    href: '#grow',
  },
]

export function NewToWkc() {
  return (
    <section id="new" className="border-b border-line bg-bg-deep py-14">
      <div className="gutter">
        <div className="mb-8 flex flex-col gap-2">
          <h2 className="text-h2">Baru di WKC?</h2>
          <p className="text-body text-ink-muted">Tiga langkah kecil untuk mengenal kami.</p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
          {steps.map((s) => (
            <div key={s.title} className="flex flex-col gap-2">
              <h3 className="text-h3">{s.title}</h3>
              <p className="text-body text-ink-muted">{s.body}</p>
              <Button href={s.href} variant="link" className="self-start">
                {s.cta}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
