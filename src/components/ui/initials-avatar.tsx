import { cn } from '@/lib/utils';

// Initials by default; shows a photo when `src` is provided (own profile only).

export function InitialsAvatar({
  name,
  className,
  src,
}: {
  name: string | null | undefined;
  className?: string;
  src?: string | null;
}) {
  const initials = (name ?? '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => Array.from(part)[0] ?? '')
    .join('')
    .toLocaleUpperCase() || '?';

  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={name?.trim() || ''}
        loading="lazy"
        decoding="async"
        className={cn('inline-block shrink-0 rounded-full bg-primary/15 object-cover', className)}
      />
    );
  }

  return (
    <span
      role="img"
      aria-label={name?.trim() || '?'}
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full bg-primary/15 font-semibold text-primary',
        className,
      )}
    >
      {initials}
    </span>
  );
}
