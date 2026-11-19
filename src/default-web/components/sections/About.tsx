const mission = [
  {
    title: 'Terhubung',
    body: 'Menghadirkan kelompok kecil dan acara komunitas di mana tidak ada yang berjalan sendirian.',
  },
  {
    title: 'Bertumbuh',
    body: 'Mendalami Alkitab lewat kelas dan lokakarya yang bisa diikuti semua tahap iman.',
  },
  {
    title: 'Melayani',
    body: 'Mengajak jemaat memakai waktu dan talenta untuk jemaat lain dan kota ini.',
  },
]

export function About() {
  return (
    <section id="about" className="section">
      <div className="gutter grid grid-cols-1 items-start gap-10 lg:grid-cols-[5fr_7fr] lg:gap-16">
        <div className="flex flex-col gap-5">
          <h2 className="text-h2">Tentang kami</h2>
          <p className="max-w-prose text-body text-ink-muted">
            WKC Church berdiri sejak 1995 dan terus bertumbuh sebagai rumah bagi jemaat dari berbagai usia dan latar
            belakang di Jakarta Pusat.
          </p>
          <p className="max-w-prose text-body text-ink-muted">
            Kami percaya gereja adalah keluarga. Di sini setiap orang dikenal, didengar, dan diajak ambil bagian.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 rounded-card border border-line bg-surface p-8">
            <p className="text-caption text-ink-faint">Visi</p>
            <p className="text-2xl font-semibold leading-[1.35] tracking-[-0.015em] [text-wrap:balance]">
              Membangun komunitas yang terhubung, bertumbuh, dan melayani.
            </p>
          </div>

          <div className="rounded-card border border-line bg-surface px-8 pb-4 pt-6">
            <p className="text-caption text-ink-faint">Misi</p>
            <ul className="mt-2 list-none p-0">
              {mission.map((m) => (
                <li key={m.title} className="flex flex-col gap-1 border-b border-line py-4 last:border-b-0">
                  <h3 className="text-h3">{m.title}</h3>
                  <p className="text-body text-ink-muted">{m.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
