'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { Button } from './button';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(CustomEase);
  if (!CustomEase.get('outStrong')) CustomEase.create('outStrong', '0.23, 1, 0.32, 1');
}

/** Modal ringan ala shadcn Dialog (tanpa radix dependency) */
export function Modal({
  open, onClose, title, children, wide,
}: {
  open: boolean; onClose: () => void; title: string; children: React.ReactNode; wide?: boolean;
}) {
  React.useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    if (open) document.addEventListener('keydown', esc);
    return () => document.removeEventListener('keydown', esc);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <div
        role="dialog" aria-modal="true"
        className={cn('glass-strong relative z-10 w-full rounded-card p-5 sm:p-6 max-h-[90vh] overflow-y-auto', wide ? 'max-w-2xl' : 'max-w-md')}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{title}</h2>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Tutup">
            <X className="h-4 w-4" />
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Switch({
  checked, onCheckedChange, disabled,
}: { checked: boolean; onCheckedChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <button
      type="button" role="switch" aria-checked={checked} disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 cursor-pointer',
        checked ? 'bg-primary' : 'bg-secondary'
      )}
    >
      <span className={cn('inline-block h-4 w-4 transform rounded-full bg-white transition-transform', checked ? 'translate-x-6' : 'translate-x-1')} />
    </button>
  );
}

export function Tabs({
  tabs, active, onChange,
}: { tabs: { id: string; label: string }[]; active: string; onChange: (id: string) => void }) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const indRef = React.useRef<HTMLDivElement>(null);
  const btnEls = React.useRef<Record<string, HTMLButtonElement | null>>({});
  const prevIndex = React.useRef<number | null>(null);
  const placed = React.useRef(false);
  // false = belum ada indikator (SSR / sebelum hydrate): tab aktif pakai background sendiri
  const [ready, setReady] = React.useState(false);

  const activeIndex = tabs.findIndex((x) => x.id === active);

  const place = React.useCallback((animate: boolean) => {
    const ind = indRef.current;
    const el = btnEls.current[active];
    if (!ind || !el) return;
    const pos = { x: el.offsetLeft, y: el.offsetTop, width: el.offsetWidth, height: el.offsetHeight };
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!animate || !placed.current || reduce) gsap.set(ind, { ...pos, opacity: 1 });
    else gsap.to(ind, { ...pos, opacity: 1, duration: 0.4, ease: 'outStrong', overwrite: 'auto' });
    placed.current = true;
    // tab aktif selalu terlihat saat daftar tab bisa di-scroll (mobile)
    const root = rootRef.current;
    if (root && root.scrollWidth > root.clientWidth) {
      root.scrollTo({ left: el.offsetLeft - (root.clientWidth - el.offsetWidth) / 2, behavior: animate && !reduce ? 'smooth' : 'auto' });
    }
  }, [active]);

  React.useLayoutEffect(() => { place(true); setReady(true); }, [place, tabs.length]);

  React.useEffect(() => {
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => place(false));
    if (rootRef.current) ro.observe(rootRef.current);
    Object.values(btnEls.current).forEach((b) => b && ro.observe(b));
    return () => ro.disconnect();
  }, [place, tabs.length]);

  // Konten sub-tab (elemen setelah <Tabs>) meluncur masuk sesuai arah perpindahan tab.
  // Berlaku otomatis untuk semua fitur yang memakai <Tabs>.
  React.useLayoutEffect(() => {
    const prev = prevIndex.current;
    prevIndex.current = activeIndex;
    const root = rootRef.current;
    if (prev === null || prev === activeIndex || !root) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Animasi hanya panel konten tepat setelah Tabs, bukan semua sibling di halaman.
    const content = root.nextElementSibling as HTMLElement | null;
    if (!content || getComputedStyle(content).position === 'fixed') return;

    const host = root.parentElement;
    const prevClip = host?.style.overflowX ?? '';
    if (host) host.style.overflowX = 'clip'; // cegah scroll horizontal sesaat di mobile
    const dir = activeIndex > prev ? 1 : -1;
    gsap.fromTo(content, { x: dir * 28, opacity: 0 }, {
      x: 0, opacity: 1, duration: 0.4, ease: 'outStrong', overwrite: 'auto',
      clearProps: 'transform,opacity',
      onComplete: () => { if (host) host.style.overflowX = prevClip; },
      onInterrupt: () => { if (host) host.style.overflowX = prevClip; },
    });
  }, [activeIndex]);

  return (
    <div
      ref={rootRef}
      className="relative flex gap-1 overflow-x-auto rounded-lg glass-subtle p-1 [scrollbar-width:none] md:flex-wrap md:overflow-visible [&::-webkit-scrollbar]:hidden"
    >
      <div
        ref={indRef} aria-hidden
        className="pointer-events-none absolute left-0 top-0 rounded-md bg-primary opacity-0 shadow-sm"
      />
      {tabs.map((x) => (
        <button
          key={x.id}
          ref={(el) => { btnEls.current[x.id] = el; }}
          onClick={() => onChange(x.id)}
          aria-pressed={active === x.id}
          className={cn(
            'btn-fx btn-fx-row relative z-10 shrink-0 rounded-md px-4 py-2 text-sm font-medium min-h-[44px] md:min-h-0 cursor-pointer',
            'transition-colors duration-200',
            active === x.id
              ? cn('text-primary-foreground', !ready && 'bg-primary')
              : 'text-muted-foreground [@media(hover:hover)]:hover:text-foreground'
          )}
        >
          {x.label}
        </button>
      ))}
    </div>
  );
}
