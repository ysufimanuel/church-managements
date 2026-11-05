import type { ConnectGroup } from '../../content/types'
import { Photo } from '../ui/Photo'

type Props = { group: ConnectGroup; className?: string }

export function ConnectCard({ group, className = '' }: Props) {
  return (
    <a
      href={group.href}
      className={`group relative flex min-h-[300px] flex-col justify-end overflow-hidden rounded-card border border-line bg-surface transition-colors duration-hover ease-out-strong hover:border-[#43506A] ${className}`}
    >
      <Photo
        src={group.image}
        alt=""
        fx={group.fx}
        fy={group.fy}
        className="transition-transform duration-media ease-out-strong group-hover:scale-[1.03]"
      />
      <div className="absolute inset-0 bg-scrim" aria-hidden="true" />
      <div className="relative flex flex-col gap-2 p-6">
        <h3 className="text-h3">{group.title}</h3>
        <p className="text-body text-ink-soft">{group.description}</p>
      </div>
    </a>
  )
}
