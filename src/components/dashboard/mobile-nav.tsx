'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { CalendarDays, Globe2, LogOut, Search, Settings, Users, type LucideIcon } from 'lucide-react';
import { useLang, LangSwitcher } from '@/components/lang-context';
import { logoutAction } from '@/lib/actions/auth';
import { cn } from '@/lib/utils';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(CustomEase);
  if (!CustomEase.get('outStrong')) CustomEase.create('outStrong', '0.23, 1, 0.32, 1');
}

export type NavItem = { href: string; key: string; icon: LucideIcon };

type TabId = 'members' | 'events' | 'search' | 'web' | 'menu';
type Tab = { id: TabId; icon: LucideIcon; label: string; href?: string };

const prefersReduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Gerak ikon saat tab jadi aktif — masing-masing ikon beda karakter. */
const ICON_FX: Record<TabId, { from: gsap.TweenVars; to: gsap.TweenVars }> = {
  members: { from: { scale: 0.6 }, to: { scale: 1, duration: 0.5, ease: 'back.out(2.5)' } },
  events: { from: { rotate: -30, scale: 0.7, y: 2 }, to: { rotate: 0, scale: 1, y: 0, duration: 0.55, ease: 'back.out(2)' } },
  search: { from: { rotate: -60, scale: 0.7, x: -2 }, to: { rotate: 0, scale: 1, x: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' } },
  web: { from: { rotate: -200 }, to: { rotate: 0, duration: 0.7, ease: 'outStrong' } },
  menu: { from: { rotate: -120, scale: 0.8 }, to: { rotate: 0, scale: 1, duration: 0.6, ease: 'outStrong' } },
};

const isActiveRoute = (pathname: string, href: string) =>
  href === '/dashboard' ? pathname === href : pathname.startsWith(href);

/* ------------------------------------------------------------------ */
/* Sheet generik: slide masuk/keluar dengan GSAP                       */
/* ------------------------------------------------------------------ */
function Sheet({
  open, onClose, side, label, className, children,
}: {
  open: boolean; onClose: () => void; side: 'top' | 'bottom'; label: string; className?: string; children: React.ReactNode;
}) {
  const [mounted, setMounted] = React.useState(open);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const overlayRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => { if (open) setMounted(true); }, [open]);

  React.useLayoutEffect(() => {
    const panel = panelRef.current;
    const overlay = overlayRef.current;
    if (!mounted || !panel || !overlay) return;
    const hidden = { yPercent: side === 'bottom' ? 100 : -100 };
    const reduce = prefersReduced();

    if (open) {
      if (reduce) { gsap.set(panel, { yPercent: 0 }); gsap.set(overlay, { opacity: 1 }); return; }
      gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: 'power2.out', overwrite: 'auto' });
      gsap.fromTo(panel, hidden, { yPercent: 0, duration: 0.42, ease: 'outStrong', overwrite: 'auto' });
      gsap.fromTo(
        panel.querySelectorAll('[data-sheet-item]'),
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.35, stagger: 0.03, delay: 0.08, ease: 'outStrong', clearProps: 'transform,opacity' },
      );
    } else if (reduce) {
      setMounted(false);
    } else {
      gsap.to(panel, { ...hidden, duration: 0.28, ease: 'power3.in', overwrite: 'auto' });
      gsap.to(overlay, { opacity: 0, duration: 0.25, overwrite: 'auto', onComplete: () => setMounted(false) });
    }
  }, [open, mounted, side]);

  // Kunci scroll body + Escape selama sheet tampil
  React.useEffect(() => {
    if (!mounted) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', onKey); };
  }, [mounted, onClose]);

  if (!mounted) return null;
  return (
    <div className="fixed inset-0 z-40 lg:hidden">
      <div ref={overlayRef} className="absolute inset-0 bg-black/60" onClick={onClose} aria-hidden />
      <div
        ref={panelRef} role="dialog" aria-modal="true" aria-label={label}
        className={cn(
          'absolute inset-x-0 border bg-card shadow-2xl',
          side === 'bottom' ? 'bottom-0 rounded-t-3xl border-b-0' : 'top-0 rounded-b-3xl border-t-0',
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Bottom tab bar (mobile saja)                                        */
/* ------------------------------------------------------------------ */
export function MobileNav({
  items, canWebManager, profile, roleText,
}: {
  items: NavItem[];
  canWebManager: boolean;
  profile: { nama: string };
  roleText: string;
}) {
  const { t } = useLang();
  const pathname = usePathname();
  const router = useRouter();
  const [sheet, setSheet] = React.useState<null | 'search' | 'menu'>(null);
  const [query, setQuery] = React.useState('');

  const tabs: Tab[] = [
    { id: 'members', icon: Users, label: t('members'), href: '/dashboard/members' },
    { id: 'events', icon: CalendarDays, label: t('events'), href: '/dashboard/events' },
    { id: 'search', icon: Search, label: t('nav-search') },
    ...(canWebManager ? [{ id: 'web' as const, icon: Globe2, label: t('web-manager'), href: '/dashboard/web-manager' }] : []),
    { id: 'menu', icon: Settings, label: t('nav-menu') },
  ];

  // Tab aktif: sheet yang terbuka > rute saat ini. Dashboard home = tidak ada yang aktif,
  // fitur lain (finance, groups, dst) = tab Menu.
  const routeTab: TabId | null =
    pathname.startsWith('/dashboard/members') ? 'members'
    : pathname.startsWith('/dashboard/events') ? 'events'
    : pathname.startsWith('/dashboard/web-manager') && canWebManager ? 'web'
    : pathname === '/dashboard' ? null
    : 'menu';
  const activeId: TabId | null = sheet ?? routeTab;

  const closeSheet = React.useCallback(() => setSheet(null), []);
  React.useEffect(() => { setSheet(null); setQuery(''); }, [pathname]);

  /* ---- indikator geser ---- */
  const barRef = React.useRef<HTMLDivElement>(null);
  const indRef = React.useRef<HTMLDivElement>(null);
  const tabEls = React.useRef<Partial<Record<TabId, HTMLElement | null>>>({});
  const placed = React.useRef(false);

  const place = React.useCallback((animate: boolean) => {
    const ind = indRef.current;
    if (!ind) return;
    const el = activeId ? tabEls.current[activeId] : null;
    if (!el || !el.offsetWidth) { gsap.to(ind, { opacity: 0, duration: 0.2, overwrite: 'auto' }); return; }
    const pos = { x: el.offsetLeft + 4, width: el.offsetWidth - 8 };
    const wasHidden = Number(gsap.getProperty(ind, 'opacity')) < 0.05;
    if (!animate || !placed.current || wasHidden || prefersReduced()) {
      gsap.set(ind, pos);
      gsap.to(ind, { opacity: 1, duration: prefersReduced() ? 0 : 0.2, overwrite: 'auto' });
    } else {
      gsap.to(ind, { ...pos, opacity: 1, duration: 0.42, ease: 'outStrong', overwrite: 'auto' });
    }
    placed.current = true;
  }, [activeId]);

  React.useLayoutEffect(() => { place(true); }, [place, tabs.length]);
  React.useEffect(() => {
    const bar = barRef.current;
    if (!bar || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => place(false));
    ro.observe(bar);
    return () => ro.disconnect();
  }, [place]);

  /* ---- animasi ikon saat tab jadi aktif ---- */
  const prevActive = React.useRef<TabId | null>(null);
  React.useEffect(() => {
    if (!activeId || prevActive.current === activeId) { prevActive.current = activeId; return; }
    prevActive.current = activeId;
    const icon = tabEls.current[activeId]?.querySelector('[data-icon]');
    if (!icon || prefersReduced()) return;
    const fx = ICON_FX[activeId];
    gsap.fromTo(icon, fx.from, { ...fx.to, overwrite: 'auto', clearProps: 'transform' });
  }, [activeId]);

  const q = query.trim().toLowerCase();
  const results = q
    ? items.filter((i) => t(i.key).toLowerCase().includes(q) || i.href.split('/').pop()!.includes(q))
    : items;

  const tabClass = (id: TabId) => cn(
    'relative z-10 flex min-h-[56px] flex-col items-center justify-center gap-0.5 py-1.5 text-[10px] font-medium',
    'transition-colors duration-200 active:scale-[0.92] [transition-property:color,transform]',
    activeId === id ? 'text-primary' : 'text-muted-foreground',
  );

  return (
    <>
      <Sheet open={sheet === 'menu'} onClose={closeSheet} side="bottom" label={t('all-features')}
        className="max-h-[85dvh] overflow-y-auto pb-[calc(4.75rem+env(safe-area-inset-bottom))]">
        <div className="space-y-4 p-4">
          <div data-sheet-item className="flex items-center gap-3">
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(profile.nama)}&background=00e5ff&color=0F1117`}
              alt="" className="h-10 w-10 rounded-full"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{profile.nama}</p>
              <p className="text-xs text-muted-foreground">{roleText}</p>
            </div>
            <LangSwitcher />
          </div>
          <p data-sheet-item className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{t('all-features')}</p>
          <ul className="grid grid-cols-3 gap-2">
            {items.map(({ href, key, icon: Icon }) => {
              const active = isActiveRoute(pathname, href);
              return (
                <li key={href} data-sheet-item>
                  <Link href={href} className={cn(
                    'flex min-h-[80px] flex-col items-center justify-center gap-2 rounded-2xl border px-1 py-3 text-center text-xs font-medium',
                    'transition-colors active:scale-[0.95] [transition-property:color,background-color,transform]',
                    active ? 'border-primary/40 bg-primary/10 text-primary' : 'bg-secondary/40 text-foreground',
                  )}>
                    <Icon className="h-5 w-5" />
                    <span className="line-clamp-2 leading-tight">{t(key)}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
          <form action={logoutAction} data-sheet-item>
            <button type="submit" className="btn-fx btn-fx-row flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl border border-destructive/30 text-sm font-medium text-destructive">
              <LogOut className="h-4 w-4" /> {t('logout')}
            </button>
          </form>
        </div>
      </Sheet>

      <Sheet open={sheet === 'search'} onClose={closeSheet} side="top" label={t('nav-search')}
        className="max-h-[80dvh] overflow-y-auto pt-[env(safe-area-inset-top)]">
        <div className="space-y-3 p-4">
          <div data-sheet-item className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              autoFocus value={query} onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && results[0]) router.push(results[0].href); }}
              placeholder={t('search-feature')} enterKeyHint="go"
              className="h-12 w-full rounded-xl border bg-background pl-10 pr-3 text-base outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <ul className="space-y-1">
            {results.length === 0 && <li className="px-2 py-4 text-sm text-muted-foreground">{t('none')}</li>}
            {results.map(({ href, key, icon: Icon }) => (
              <li key={href} data-sheet-item>
                <Link href={href} className="flex min-h-[48px] items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors active:scale-[0.98] active:bg-secondary [transition-property:background-color,transform]">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary"><Icon className="h-4 w-4" /></span>
                  {t(key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Sheet>

      <nav
        aria-label="Navigasi utama"
        className="fixed inset-x-0 bottom-0 z-50 border-t bg-card/90 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
      >
        <div ref={barRef} className="relative grid auto-cols-fr grid-flow-col px-1">
          <div
            ref={indRef} aria-hidden
            className="pointer-events-none absolute bottom-1 top-1 left-0 rounded-2xl bg-primary/15 opacity-0"
          />
          {tabs.map(({ id, icon: Icon, label, href }) => {
            const inner = (
              <>
                <span data-icon className="grid place-items-center"><Icon className="h-[22px] w-[22px]" strokeWidth={activeId === id ? 2.4 : 2} /></span>
                <span className="max-w-full truncate px-0.5">{label}</span>
              </>
            );
            const ref = (el: HTMLElement | null) => { tabEls.current[id] = el; };
            return href ? (
              <Link key={id} ref={ref} href={href} aria-current={routeTab === id && !sheet ? 'page' : undefined} className={tabClass(id)}>{inner}</Link>
            ) : (
              <button
                key={id} ref={ref} type="button" aria-expanded={sheet === id} aria-haspopup="dialog"
                onClick={() => setSheet((s) => (s === id ? null : (id as 'search' | 'menu')))}
                className={tabClass(id)}
              >{inner}</button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
