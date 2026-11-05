import { leaders } from '../../content/leaders'
import { LeaderCard } from '../cards/LeaderCard'
import { SectionHeader } from '../ui/SectionHeader'

export function Leadership() {
  return (
    <section id="leadership" className="section bg-bg-deep">
      <div className="gutter">
        <SectionHeader title="Kepemimpinan kami" description="Para pendeta dan pemimpin yang melayani jemaat WKC." />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {leaders.map((l) => (
            <LeaderCard key={l.id} leader={l} />
          ))}
        </div>
      </div>
    </section>
  )
}
