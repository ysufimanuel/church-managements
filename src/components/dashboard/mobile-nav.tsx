'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { Globe2, LayoutDashboard, LogOut, Search, Settings, Wallet, type LucideIcon } from 'lucide-react';
import { useLang, LangSwitcher } from '@/components/lang-context';
import { logoutAction } from '@/lib/actions/auth';
import { cn } from '@/lib/utils';
import { InitialsAvatar } from '@/components/ui/initials-avatar';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(CustomEase);
  if (!CustomEase.get('outStrong')) CustomEase.create('outStrong', '0.23, 1, 0.32, 1');
}

export type NavItem = { href: string; key: string; icon: LucideIcon };

type TabId = 'dashboard' | 'finance' | 'search' | 'web' | 'menu';
type Tab = { id: TabId; icon: LucideIcon; label: string; href?: string };

const prefersReduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Gerak ikon saat tab jadi aktif — masing-masing ikon beda karakter. */
const ICON_FX: Record<TabId, { from: gsap.TweenVars; to: gsap.TweenVars }> = {
  dashboard: { from: { scale: 0.6, rotate: -20 }, to: { scale: 1, rotate: 0, duration: 0.55, ease: 'back.out(2.5)' } },
  finance: { from: { y: -8, scale: 0.85 }, to: { y: 0, scale: 1, duration: 0.7, ease: 'bounce.out' } },
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
  const restoreFocusRef = React.useRef<HTMLElement | null>(null);

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

  // Kunci scroll, pindahkan fokus ke sheet, jaga fokus di dalamnya, lalu pulihkan fokus.
  React.useEffect(() => {
    if (!mounted) return;
    const panel = panelRef.current;
    if (!panel) return;
    const previousOverflow = document.body.style.overflow;
    restoreFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    document.body.style.overflow = 'hidden';

    const getFocusable = () => Array.from(panel.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )).filter((element) => element.getAttribute('aria-hidden') !== 'true');

    const firstFocusable = getFocusable()[0];
    (firstFocusable || panel).focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;
      const focusable = getFocusable();
      if (!focusable.length) {
        event.preventDefault();
        panel.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && (document.activeElement === first || !panel.contains(document.activeElement))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !panel.contains(document.activeElement))) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKey);
      const previous = restoreFocusRef.current;
      if (previous?.isConnected) previous.focus();
      restoreFocusRef.current = null;
    };
  }, [mounted, onClose]);

  if (!mounted) return null;
  return (
    <div className="fixed inset-0 z-40 lg:hidden">
      <div ref={overlayRef} className="absolute inset-0 bg-black/60" onClick={onClose} aria-hidden />
      <div
        ref={panelRef} role="dialog" aria-modal="true" aria-label={label} tabIndex={-1}
        className={cn(
          'glass-strong absolute inset-x-0',
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
  profile: { nama: string; avatarUrl?: string | null; onOpenProfile?: () => void };
  roleText: string;
}) {
  const { t } = useLang();
  const pathname = usePathname();
  const router = useRouter();
  const [sheet, setSheet] = React.useState<null | 'menu'>(null);

  const tabs: Tab[] = [
    { id: 'dashboard', icon: LayoutDashboard, label: t('dashboard'), href: '/dashboard' },
    { id: 'finance', icon: Wallet, label: t('finance'), href: '/dashboard/finance' },
    { id: 'search', icon: Search, label: t('nav-search') },
    ...(canWebManager ? [{ id: 'web' as const, icon: Globe2, label: t('web-manager'), href: '/dashboard/web-manager' }] : []),
    { id: 'menu', icon: Settings, label: t('nav-menu') },
  ];

  // Tab aktif: sheet yang terbuka > rute saat ini. Fitur yang tidak punya tab sendiri
  // (members, events, groups, dst) dianggap bagian dari tab Menu.
  const routeTab: TabId =
    pathname === '/dashboard' ? 'dashboard'
    : pathname.startsWith('/dashboard/finance') ? 'finance'
    : pathname.startsWith('/dashboard/web-manager') && canWebManager ? 'web'
    : 'menu';
  const activeId: TabId | null = sheet ?? routeTab;

  const closeSheet = React.useCallback(() => setSheet(null), []);
  React.useEffect(() => { setSheet(null); }, [pathname]);

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

  /* ---- geser sambil ditahan: efek kaca pembesar (dock magnify) ---- */
  const [lensId, setLensId] = React.useState<TabId | null>(null);
  const lensRef = React.useRef<HTMLDivElement>(null);
  const scrub = React.useRef({ down: false, active: false, startX: 0, pointerId: -1, hover: null as TabId | null, lastX: 0, timer: 0 as unknown as ReturnType<typeof setTimeout>, suppress: false });

  const tabAt = (clientX: number): TabId | null => {
    let best: TabId | null = null; let bestD = Infinity;
    for (const tb of tabs) {
      const el = tabEls.current[tb.id];
      if (!el) continue;
      const r = el.getBoundingClientRect();
      const d = Math.abs(clientX - (r.left + r.width / 2));
      if (d < bestD) { bestD = d; best = tb.id; }
    }
    return best;
  };

  const magnify = (clientX: number) => {
    scrub.current.lastX = clientX;
    const bar = barRef.current;
    if (!bar) return;
    const barRect = bar.getBoundingClientRect();
    const lens = lensRef.current;
    if (lens) {
      const half = lens.offsetWidth / 2;
      const x = Math.min(Math.max(clientX - barRect.left, half), barRect.width - half);
      gsap.set(lens, { x: x - half });
    }
    if (prefersReduced()) return;
    for (const tb of tabs) {
      const el = tabEls.current[tb.id];
      const icon = el?.querySelector('[data-icon]');
      if (!el || !icon) continue;
      const r = el.getBoundingClientRect();
      const dist = Math.abs(clientX - (r.left + r.width / 2));
      const k = Math.max(0, 1 - dist / (r.width * 1.1));
      gsap.set(icon, { scale: 1 + 0.55 * k, y: -10 * k });
    }
  };

  const endScrub = (activate: boolean) => {
    const st = scrub.current;
    clearTimeout(st.timer);
    const wasActive = st.active;
    const target = st.hover;
    st.down = false; st.active = false; st.hover = null;
    setLensId(null);
    for (const tb of tabs) {
      const icon = tabEls.current[tb.id]?.querySelector('[data-icon]');
      if (icon) gsap.to(icon, { scale: 1, y: 0, duration: prefersReduced() ? 0 : 0.28, ease: 'outStrong', overwrite: 'auto', clearProps: 'transform' });
    }
    if (!wasActive) return;
    st.suppress = true;
    setTimeout(() => { st.suppress = false; }, 0);
    if (!activate || !target) return;
    const tb = tabs.find((x) => x.id === target);
    if (!tb) return;
    if (tb.href) router.push(tb.href);
    else if (tb.id === 'search') window.dispatchEvent(new Event('wkc:open-search'));
    else setSheet((cur) => (cur === 'menu' ? null : 'menu'));
  };

  const enterScrub = (clientX: number) => {
    const st = scrub.current;
    if (!st.down || st.active) return;
    st.active = true;
    try { barRef.current?.setPointerCapture(st.pointerId); } catch {}
    st.hover = tabAt(clientX);
    setLensId(st.hover);
    navigator.vibrate?.(8);
    magnify(clientX);
  };

  const onBarPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    const st = scrub.current;
    st.down = true; st.active = false; st.startX = e.clientX; st.pointerId = e.pointerId;
    const x = e.clientX;
    clearTimeout(st.timer);
    st.timer = setTimeout(() => enterScrub(x), 220);
  };
  const onBarPointerMove = (e: React.PointerEvent) => {
    const st = scrub.current;
    if (!st.down) return;
    if (!st.active) {
      if (Math.abs(e.clientX - st.startX) > 10) enterScrub(e.clientX);
      return;
    }
    const hover = tabAt(e.clientX);
    if (hover !== st.hover) { st.hover = hover; setLensId(hover); navigator.vibrate?.(5); }
    magnify(e.clientX);
  };

  // Animasi muncul lensa
  React.useLayoutEffect(() => {
    const lens = lensRef.current;
    if (!lensId || !lens) return;
    magnify(scrub.current.lastX);
    if (prefersReduced()) return;
    if (!lens.dataset.shown) {
      lens.dataset.shown = '1';
      gsap.fromTo(lens, { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.22, ease: 'outStrong', overwrite: 'auto' });
    }
  }, [lensId]);
  const lensTab = lensId ? tabs.find((x) => x.id === lensId) : null;

  const tabClass = (id: TabId) => cn(
    'relative z-10 flex min-h-[52px] flex-col items-center justify-center gap-0.5 py-1.5 text-[10px] font-medium',
    'transition-colors duration-200 active:scale-[0.92] [transition-property:color,transform]',
    activeId === id ? 'text-primary' : 'text-muted-foreground',
  );

  return (
    <>
      <Sheet open={sheet === 'menu'} onClose={closeSheet} side="bottom" label={t('all-features')}
        className="max-h-[85dvh] overflow-y-auto pb-[calc(4.75rem+env(safe-area-inset-bottom))]">
        <div className="space-y-4 p-4">
          <div data-sheet-item className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => { closeSheet(); profile.onOpenProfile?.(); }}
              aria-label={t('my-profile')}
              className="btn-fx btn-fx-row flex min-w-0 flex-1 items-center gap-3 rounded-xl text-left"
            >
              <InitialsAvatar name={profile.nama} src={profile.avatarUrl} className="h-10 w-10 text-xs" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold">{profile.nama}</span>
                <span className="block text-xs text-muted-foreground">{roleText}</span>
              </span>
            </button>
            <LangSwitcher />
          </div>
          <p data-sheet-item className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{t('all-features')}</p>
          <ul className="grid grid-cols-3 gap-2">
            {items.map(({ href, key, icon: Icon }) => {
              const active = isActiveRoute(pathname, href);
              return (
                <li key={href} data-sheet-item>
                  <Link href={href} className={cn(
                    'flex min-h-[68px] flex-col items-center justify-center gap-1.5 rounded-2xl border px-1 py-2 text-center text-xs font-medium',
                    'transition-colors active:scale-[0.95] [transition-property:color,background-color,transform]',
                    active ? 'border-primary/40 bg-primary/15 text-primary' : 'border-white/10 bg-white/5 text-foreground',
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

      <nav
        aria-label={t('main-navigation')}
        className="glass-strong fixed inset-x-3 bottom-[max(0.5rem,env(safe-area-inset-bottom))] z-50 touch-none select-none rounded-3xl [-webkit-touch-callout:none] lg:hidden"
      >
        <div
          ref={barRef}
          className="relative grid auto-cols-fr grid-flow-col px-1"
          onPointerDown={onBarPointerDown}
          onPointerMove={onBarPointerMove}
          onPointerUp={() => endScrub(true)}
          onPointerCancel={() => endScrub(false)}
          onContextMenu={(e) => { if (scrub.current.down || scrub.current.active) e.preventDefault(); }}
          onClickCapture={(e) => { if (scrub.current.suppress) { e.preventDefault(); e.stopPropagation(); } }}
        >
          {lensTab && (
            <div
              ref={lensRef}
              aria-hidden
              data-lens
              className="pointer-events-none absolute bottom-[calc(100%+10px)] left-0 z-20 flex w-[76px] flex-col items-center gap-1 rounded-full border border-white/25 bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.28),rgba(0,229,255,0.12)_55%,rgba(10,14,22,0.85))] px-2 py-3 text-primary shadow-[0_8px_28px_rgba(0,0,0,0.45),inset_0_0_14px_rgba(255,255,255,0.12)] will-change-transform"
            >
              <lensTab.icon className="h-7 w-7" strokeWidth={2.2} />
              <span className="max-w-full truncate text-[10px] font-semibold text-foreground">{lensTab.label}</span>
            </div>
          )}
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
              <Link key={id} ref={ref} href={href} draggable={false} aria-current={routeTab === id && !sheet ? 'page' : undefined} className={tabClass(id)}>{inner}</Link>
            ) : (
              <button
                key={id} ref={ref} type="button" aria-expanded={id === 'menu' ? sheet === 'menu' : undefined} aria-haspopup="dialog"
                onClick={() => (id === 'search' ? window.dispatchEvent(new Event('wkc:open-search')) : setSheet((s) => (s === id ? null : 'menu')))}
                className={tabClass(id)}
              >{inner}</button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
