import { connectGroups } from '../../content/connect-groups'
import { ConnectCard } from '../cards/ConnectCard'
import { SectionHeader } from '../ui/SectionHeader'

/**
 * Desktop 6 kolom: 3 kartu pertama span 2, 2 kartu terakhir span 3.
 * Tablet 2 kolom: kartu terakhir span 2. Mobile 1 kolom.
 * Kelas ditulis utuh agar terbaca oleh Tailwind.
 */
function spanFor(index: number, total: number): string {
  const isLast = index === total - 1
  if (index < 3) return 'lg:col-span-2'
  return isLast ? 'md:col-span-2 lg:col-span-3' : 'lg:col-span-3'
}

export function Connect() {
  return (
    <section id="connect" className="section">
      <div className="gutter">
        <SectionHeader
          title="Connect"
          description="Dari kelompok mingguan kecil hingga acara komunitas, ada tempat untuk Anda."
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-6">
          {connectGroups.map((g, i) => (
            <ConnectCard key={g.id} group={g} className={spanFor(i, connectGroups.length)} />
          ))}
        </div>
      </div>
    </section>
  )
}
