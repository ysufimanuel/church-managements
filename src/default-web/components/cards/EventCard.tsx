import type { WkcEvent } from '../../content/types'
import { Button } from '../ui/Button'
import { DateBadge } from '../ui/DateBadge'

type Props = { event: WkcEvent; className?: string }

export function EventCard({ event, className = '' }: Props) {
  return (
    <article className={`flex flex-col gap-5 rounded-card border border-line bg-surface p-6 ${className}`}>
      <div className="flex items-center gap-4">
        <DateBadge iso={event.startsAt} />
        <h3 className="text-h3">{event.title}</h3>
      </div>
      <p className="text-body text-ink-muted">{event.description}</p>
      <Button href={event.registerUrl} variant="link" className="self-start">
        Daftar
      </Button>
    </article>
  )
}
