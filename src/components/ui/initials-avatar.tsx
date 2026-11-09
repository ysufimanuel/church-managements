import { cn } from '@/lib/utils';

export function InitialsAvatar({
  name,
  className,
}: {
  name: string | null | undefined;
  className?: string;
}) {
  const initials = (name ?? '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => Array.from(part)[0] ?? '')
    .join('')
    .toLocaleUpperCase('id-ID') || '?';

  return (
    <span
      role="img"
      aria-label={`Avatar ${name?.trim() || 'pengguna'}`}
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full bg-primary/15 font-semibold text-primary',
        className,
      )}
    >
      {initials}
    </span>
  );
}
