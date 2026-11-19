import { events } from '../../content/events'
import { EventCard } from '../cards/EventCard'
import { SectionHeader } from '../ui/SectionHeader'

export function Grow() {
  return (
    <section id="grow" className="section bg-bg-deep">
      <div className="gutter">
        <SectionHeader
          title="Grow"
          description="Kelas dan lokakarya untuk memperdalam pemahaman Alkitab dan menata hidup sehari-hari."
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {events.map((e, i) => (
            <EventCard
              key={e.id}
              event={e}
              className={i === events.length - 1 ? 'md:col-span-2 lg:col-span-1' : ''}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
