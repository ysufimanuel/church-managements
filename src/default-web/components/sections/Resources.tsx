import { latestSermon } from '../../content/sermons'
import { Button } from '../ui/Button'
import { DocIcon } from '../ui/Icon'
import { Photo } from '../ui/Photo'
import { SectionHeader } from '../ui/SectionHeader'
import { SermonPlayer } from './SermonPlayer'

const gallery = [
  { fx: 30, fy: 30 },
  { fx: 70, fy: 20 },
  { fx: 50, fy: 40 },
  { fx: 20, fy: 15 },
]

export function Resources() {
  return (
    <section id="resources" className="section">
      <div className="gutter">
        <SectionHeader
          title="Ministries / Resources"
          description="Tonton ulang khotbah, baca warta jemaat, dan lihat kegiatan terbaru kami."
        />

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1.6fr_1fr]">
          <div className="flex flex-col gap-5">
            <SermonPlayer sermon={latestSermon} />
            <div className="flex flex-col gap-1">
              <p className="text-caption text-ink-faint">Khotbah terbaru</p>
              <h3 className="text-h3">{latestSermon.title}</h3>
              <p className="text-body-sm text-ink-muted">
                {latestSermon.speaker}, {latestSermon.date}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 rounded-card border border-line bg-surface p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 flex-none items-center justify-center rounded-badge border border-line bg-surface-raised text-accent">
                  <DocIcon />
                </div>
                <div>
                  <h3 className="text-h3">Warta Jemaat Digital</h3>
                  <p className="text-caption text-ink-faint">Format PDF</p>
                </div>
              </div>
              <Button href="#resources" variant="ghost" className="self-start">
                Unduh PDF
              </Button>
            </div>

            <div className="flex flex-col gap-4 rounded-card border border-line bg-surface p-6">
              <h3 className="text-h3">Galeri kegiatan</h3>
              <div className="grid grid-cols-2 gap-2">
                {gallery.map((g, i) => (
                  <div key={i} className="relative aspect-square overflow-hidden rounded-chip">
                    <Photo fx={g.fx} fy={g.fy} />
                  </div>
                ))}
              </div>
              <Button href="#resources" variant="link" className="self-start">
                Lihat semua foto
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
