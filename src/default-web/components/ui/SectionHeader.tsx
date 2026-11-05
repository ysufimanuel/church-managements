type Props = { title: string; description?: string }

export function SectionHeader({ title, description }: Props) {
  return (
    <div className="mb-12 flex max-w-[620px] flex-col gap-3">
      <h2 className="text-h2">{title}</h2>
      {description ? <p className="text-body text-ink-muted">{description}</p> : null}
    </div>
  )
}
