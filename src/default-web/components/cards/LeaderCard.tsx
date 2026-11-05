import type { Leader } from '../../content/types'
import { Photo } from '../ui/Photo'

export function LeaderCard({ leader }: { leader: Leader }) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-card border border-line bg-surface">
      <div className="relative aspect-[4/5] overflow-hidden">
        <Photo
          src={leader.photo}
          alt={leader.photo ? leader.name : ''}
          fx={leader.fx}
          fy={leader.fy}
          className="transition-transform duration-media ease-out-strong group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-col gap-0.5 px-6 pb-6 pt-5">
        <h3 className="text-h3">{leader.name}</h3>
        <p className="text-caption text-ink-faint">{leader.role}</p>
      </div>
    </div>
  )
}
