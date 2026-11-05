import { dayMonth } from '../../lib/format-date'

export function DateBadge({ iso }: { iso: string }) {
  const { day, month } = dayMonth(iso)
  return (
    <div className="flex w-16 flex-none flex-col items-center rounded-badge border border-line bg-surface-raised pb-2 pt-2.5">
      <b className="text-2xl font-bold leading-[1.1]">{day}</b>
      <i className="text-caption font-bold not-italic tracking-[0.08em] text-accent">{month}</i>
    </div>
  )
}
