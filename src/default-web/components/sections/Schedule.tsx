import type { ReactNode } from 'react'
import { address, email, services, whatsapp } from '../../content/services'
import { Button } from '../ui/Button'
import { ChatIcon, MailIcon, PinIcon } from '../ui/Icon'
import { SectionHeader } from '../ui/SectionHeader'

function ContactRow({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-4 border-b border-line py-4 last:border-b-0">
      <span className="mt-0.5 flex-none text-accent">{icon}</span>
      <div>
        <p className="text-caption text-ink-faint">{label}</p>
        <p>{value}</p>
      </div>
    </div>
  )
}

export function Schedule() {
  return (
    <section id="schedule" className="section bg-bg-deep">
      <div className="gutter">
        <SectionHeader title="Jadwal ibadah dan lokasi" description="Datang langsung atau ikuti dari mana saja." />

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
          <div className="flex flex-col gap-4">
            <div className="rounded-card border border-line bg-surface">
              {services.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between gap-4 border-b border-line px-6 py-[18px] last:border-b-0"
                >
                  <div>
                    <h3 className="flex items-center text-h3">
                      {s.kind === 'live' ? (
                        <span className="mr-2.5 inline-block h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
                      ) : null}
                      {s.name}
                    </h3>
                    <p className={`mt-0.5 text-caption text-ink-faint ${s.kind === 'live' ? 'pl-[18px]' : ''}`}>
                      {s.note}
                    </p>
                  </div>
                  <p className="text-right text-ink">{s.schedule}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3 rounded-card border border-line bg-surface p-6">
              <p className="text-caption text-ink-faint">Renungan mingguan</p>
              <h3 className="text-h3">[Judul renungan]</h3>
              <p className="text-body text-ink-muted">[Ayat dan ringkasan renungan minggu ini]</p>
              <Button href="#schedule" variant="link" className="self-start">
                Baca renungan
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {/* Placeholder peta. Ganti dengan facade peta interaktif tema gelap saat implementasi. */}
            <div
              className="relative aspect-[16/10] overflow-hidden rounded-card border border-line bg-[#12151C]"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(45,55,72,0.55) 1px, transparent 1px), linear-gradient(90deg, rgba(45,55,72,0.55) 1px, transparent 1px)',
                backgroundSize: '48px 48px',
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center text-accent">
                <PinIcon size={40} />
              </div>
              <p className="absolute bottom-4 left-5 text-caption text-ink-faint">Peta interaktif tema gelap</p>
            </div>

            <div className="rounded-card border border-line bg-surface px-6 py-2">
              <ContactRow icon={<PinIcon />} label="Alamat" value={address} />
              <ContactRow icon={<ChatIcon />} label="WhatsApp" value={whatsapp} />
              <ContactRow icon={<MailIcon />} label="Email support" value={email} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
