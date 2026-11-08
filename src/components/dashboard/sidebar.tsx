'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';
import type { LucideIcon } from 'lucide-react';
import { Church, Search, LogOut, ChevronRight, ChevronLeft } from 'lucide-react';
import { useLang, LangSwitcher } from '@/components/lang-context';
import { logoutAction } from '@/lib/actions/auth';
import type { Role } from '@/lib/rbac';
import { cn } from '@/lib/utils';

type SidebarItem = { href: string; key: string; icon: LucideIcon; badge?: number };

const GLYPHS = '!<>-_\\/[]{}—=+*^?#________';

function useScramble(label: string) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const frame = React.useRef<number | null>(null);
  const run = React.useCallback(() => {
    const el = ref.current;
    if (!el) return;
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.textContent = label;
      return;
    }
    let iteration = 0;
    const tick = () => {
      const count = Math.floor(iteration);
      el.textContent = Array.from(label).map((char, i) => {
        if (char === ' ' || i < count) return char;
        return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }).join('');
      iteration += 1 / 2.2;
      if (iteration <= label.length) frame.current = requestAnimationFrame(tick);
      else { el.textContent = label; frame.current = null; }
    };
    frame.current = requestAnimationFrame(tick);
  }, [label]);
  React.useEffect(() => () => {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
  }, []);
  React.useEffect(() => {
    if (ref.current) ref.current.textContent = label;
  }, [label]);
  return { ref, run };
}

function SidebarLink({ item, active, label, open, index, onNavigate }: {
  item: SidebarItem; active: boolean; label: string; open: boolean; index: number; onNavigate: () => void;
}) {
  const Icon = item.icon;
  const { ref, run } = useScramble(label);
  // Saat sidebar dibuka, nama fitur muncul dengan animasi scramble berurutan dari atas ke bawah
  React.useEffect(() => {
    if (!open) return;
    const id = window.setTimeout(run, 60 + index * 45);
    return () => window.clearTimeout(id);
  }, [open, index, run]);
  return (
    <li data-sidebar-item data-active={active ? 'true' : 'false'}>
      <Link href={item.href} aria-current={active ? 'page' : undefined} aria-label={label} title={open ? undefined : label}
        onMouseEnter={open ? run : undefined} onFocus={open ? run : undefined} onClick={onNavigate}
        className={cn(
          'group relative flex min-h-[44px] w-full items-center gap-3 overflow-hidden rounded-xl px-[15px] py-2 text-sm transition-colors',
          active
            ? 'bg-primary/15 text-primary shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.25)]'
            : 'text-muted-foreground hover:bg-white/10 hover:text-foreground',
        )}>
        <span aria-hidden className={cn(
          'absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-primary transition-all',
          active ? 'opacity-100' : 'opacity-0 group-hover:opacity-60',
        )}/>
        <Icon className={cn('h-[18px] w-[18px] shrink-0 transition-transform duration-200 group-hover:scale-110', active && 'drop-shadow-[0_0_7px_hsl(var(--primary)/.7)]')} />
        <span ref={ref} aria-hidden className={cn(
          'min-w-0 flex-1 overflow-hidden whitespace-nowrap text-[13px] tracking-wide transition-[max-width,opacity] duration-300',
          open ? 'max-w-[180px] opacity-100' : 'max-w-0 opacity-0', active && 'font-semibold',
        )} />
        {open && typeof item.badge === 'number' && item.badge > 0 && (
          <span className="rounded-full bg-[#7C5CFF] px-2 py-0.5 text-[10px] font-semibold leading-4 text-white">{item.badge}</span>
        )}
        {open && <ChevronRight className="h-3.5 w-3.5 shrink-0 -translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-60" />}
      </Link>
    </li>
  );
}

const STORE_KEY = 'wkcSidebarOpen';

export function Sidebar({ items, role }: { items: SidebarItem[]; role: Role }) {
  const { t } = useLang();
  const pathname = usePathname();
  const asideRef = React.useRef<HTMLElement>(null);
  const previousPath = React.useRef(pathname);
  // Default: hanya ikon. Klik fitur membuka nama fitur; panah kecil membuka/menutup manual.
  const [open, setOpen] = React.useState(false);
  void role;

  React.useEffect(() => {
    try { if (localStorage.getItem(STORE_KEY) === '1') setOpen(true); } catch { /* storage tidak tersedia */ }
  }, []);
  const setOpenPersist = React.useCallback((v: boolean) => {
    setOpen(v);
    try { localStorage.setItem(STORE_KEY, v ? '1' : '0'); } catch { /* abaikan */ }
  }, []);

  React.useLayoutEffect(() => {
    const root = asideRef.current;
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(root.querySelectorAll('[data-sidebar-item]'),
        { x: -16, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.45, ease: 'power2.out', stagger: 0.045, delay: 0.1, clearProps: 'transform,opacity' });
    }, root);
    return () => ctx.revert();
  }, []);

  // Kilau singkat pada item aktif setelah pindah halaman (warna literal: GSAP tidak bisa mem-parse hsl(var(--x)))
  React.useEffect(() => {
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;
    const el = asideRef.current?.querySelector<HTMLElement>('[data-sidebar-item][data-active="true"] a');
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    try {
      gsap.fromTo(el, { backgroundColor: 'rgba(0,229,255,0.35)' }, {
        backgroundColor: 'rgba(0,229,255,0.15)', duration: 0.9, ease: 'power2.out', clearProps: 'backgroundColor',
      });
    } catch { /* animasi opsional */ }
  }, [pathname]);

  return (
    <div className={cn(
      'sticky top-3 m-3 mr-0 hidden h-[calc(100dvh-1.5rem)] shrink-0 transition-[width] duration-300 ease-out-strong lg:block',
      open ? 'w-[264px]' : 'w-[72px]',
    )}>
      <aside ref={asideRef} className="glass flex h-full w-full flex-col overflow-hidden rounded-card">
        <div className="flex h-16 shrink-0 items-center gap-3 border-b border-white/10 px-[15px]">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10">
            <Church className="h-5 w-5 text-primary" />
          </span>
          <div className={cn('min-w-0 flex-1 overflow-hidden whitespace-nowrap transition-opacity duration-200', open ? 'opacity-100' : 'pointer-events-none opacity-0')} aria-hidden={!open}>
            <h1 className="truncate text-sm font-bold">{t('cms-title')}</h1>
            <p className="text-[11px] text-muted-foreground">Gereja Digital</p>
          </div>
        </div>

        <div className="shrink-0 px-3 pb-1 pt-3">
          <button type="button" aria-label={t('search-feature')} title={open ? undefined : t('search-feature')}
            onClick={() => window.dispatchEvent(new Event('wkc:open-search'))}
            className="btn-fx btn-fx-row glass-input flex h-10 w-full items-center gap-2 overflow-hidden rounded-xl px-[15px] text-sm text-muted-foreground transition-colors hover:border-primary/40 cursor-pointer">
            <Search className="h-4 w-4 shrink-0" />
            {open && <span className="flex-1 truncate text-left">{t('search-feature')}</span>}
            {open && <kbd className="rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[10px]">Ctrl K</kbd>}
          </button>
        </div>

        <nav aria-label="Navigasi utama" className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-3 pb-3 pt-2">
          <ul className="space-y-1">
            {items.map((item, i) => {
              const active = item.href === '/dashboard' ? pathname === item.href : pathname.startsWith(item.href);
              return <SidebarLink key={item.href} item={item} active={active} label={t(item.key)} open={open} index={i}
                onNavigate={() => { if (!open) setOpenPersist(true); }} />;
            })}
          </ul>
        </nav>

        <div className="shrink-0 space-y-3 overflow-hidden border-t border-white/10 p-3">
          {open && <LangSwitcher />}
          <form action={logoutAction}>
            <button type="submit" aria-label={t('logout')} title={open ? undefined : t('logout')}
              className="btn-fx btn-fx-row flex min-h-[44px] w-full items-center gap-3 overflow-hidden rounded-xl px-[15px] py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10 cursor-pointer">
              <LogOut className="h-4 w-4 shrink-0" /> {open && <span className="truncate">{t('logout')}</span>}
            </button>
          </form>
        </div>
      </aside>

      <button type="button" onClick={() => setOpenPersist(!open)} aria-expanded={open}
        aria-label={open ? 'Tutup sidebar' : 'Buka sidebar'} title={open ? 'Tutup sidebar' : 'Buka sidebar'}
        className="btn-fx glass-strong absolute -right-3 top-[72px] z-10 grid h-6 w-6 place-items-center rounded-full cursor-pointer">
        {open ? <ChevronLeft className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
      </button>
    </div>
  );
}
