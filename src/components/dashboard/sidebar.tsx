'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';
import type { LucideIcon } from 'lucide-react';
import { Church, Search, LogOut, ChevronRight } from 'lucide-react';
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

function SidebarLink({ item, active, label }: {
  item: SidebarItem; active: boolean; label: string;
}) {
  const Icon = item.icon;
  const { ref, run } = useScramble(label);
  return (
    <li data-sidebar-item data-active={active ? 'true' : 'false'} style={{ opacity: 1 }}>
      <Link href={item.href} aria-current={active ? 'page' : undefined}
        onMouseEnter={run} onFocus={run}
        className={cn(
          'group relative flex min-h-[44px] w-full items-center gap-3 overflow-hidden rounded-xl px-3 py-2 text-sm transition-colors',
          active
            ? 'bg-primary/15 text-primary shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.25),0_0_24px_-6px_hsl(var(--primary)/0.35)]'
            : 'text-muted-foreground hover:bg-white/[0.07] hover:text-foreground',
        )}>
        <span aria-hidden className={cn(
          'absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-primary transition-all',
          active ? 'opacity-100 shadow-[0_0_12px_hsl(var(--primary))]' : 'opacity-0 group-hover:opacity-60',
        )}/>
        <Icon className={cn('h-[18px] w-[18px] shrink-0 transition-transform duration-200 group-hover:scale-110', active && 'drop-shadow-[0_0_7px_hsl(var(--primary)/.7)]')} />
        <span ref={ref} className={cn('min-w-0 flex-1 truncate font-mono text-[12px] tracking-wide', active && 'font-semibold')} />
        {typeof item.badge === 'number' && item.badge > 0 && (
          <span className="rounded-full bg-[#7C5CFF] px-2 py-0.5 text-[10px] font-semibold leading-4 text-white shadow-[0_0_12px_rgb(124_92_255/.35)]">{item.badge}</span>
        )}
        <ChevronRight className="h-3.5 w-3.5 shrink-0 -translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-60" />
      </Link>
    </li>
  );
}

export function Sidebar({ items, role }: { items: SidebarItem[]; role: Role }) {
  const { t } = useLang();
  const pathname = usePathname();
  const asideRef = React.useRef<HTMLElement>(null);
  const previousPath = React.useRef(pathname);
  void role;

  React.useLayoutEffect(() => {
    const root = asideRef.current;
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(root, { x: -24, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, ease: 'power3.out', clearProps: 'transform,opacity' });
      gsap.fromTo(root.querySelectorAll('[data-sidebar-item]'),
        { x: -16, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.45, ease: 'power2.out', stagger: 0.045, delay: 0.15, clearProps: 'transform,opacity' });
    }, root);
    return () => ctx.revert();
  }, []);

  React.useEffect(() => {
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;
    const active = asideRef.current?.querySelector<HTMLElement>('[data-sidebar-item][data-active="true"] a');
    if (!active || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.fromTo(active, { backgroundColor: 'hsl(var(--primary) / .35)' }, {
      backgroundColor: 'hsl(var(--primary) / .15)', duration: 0.9, ease: 'power2.out', clearProps: 'backgroundColor',
    });
  }, [pathname]);

  return (
    <aside ref={asideRef} className="sticky top-3 m-3 mr-0 hidden h-[calc(100dvh-1.5rem)] w-[264px] shrink-0 flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[#12141B]/90 shadow-[0_8px_32px_rgb(0_0_0/.45),inset_0_1px_0_rgb(255_255_255/.06)] backdrop-blur-2xl lg:flex">
      <div className="flex h-16 shrink-0 items-center gap-3 border-b border-white/[0.07] px-4">
        <span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10">
          <span className="absolute inset-2 rounded-full bg-primary/30 blur-lg" />
          <Church className="relative h-5 w-5 text-primary" />
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-sm font-bold">{t('cms-title')}</h1>
          <p className="text-[11px] text-muted-foreground">Gereja Digital</p>
        </div>
      </div>

      <div className="shrink-0 px-3 pb-1 pt-3">
        <button type="button" onClick={() => window.dispatchEvent(new Event('wkc:open-search'))}
          className="btn-fx btn-fx-row glass-input flex h-10 w-full items-center gap-2 rounded-xl px-3 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:bg-white/[0.08]">
          <Search className="h-4 w-4 shrink-0" />
          <span className="flex-1 truncate text-left">{t('search-feature')}</span>
          <kbd className="rounded-md border border-white/10 bg-white/[0.04] px-1.5 py-0.5 font-mono text-[10px]">Ctrl K</kbd>
        </button>
      </div>

      <p className="px-5 pb-1 pt-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/70">Menu</p>
      <nav aria-label="Navigasi utama" className="min-h-0 flex-1 overflow-y-auto px-3 pb-3">
        <ul className="space-y-1">
          {items.map((item) => {
            const active = item.href === '/dashboard' ? pathname === item.href : pathname.startsWith(item.href);
            return <SidebarLink key={item.href} item={item} active={active} label={t(item.key)} />;
          })}
        </ul>
      </nav>

      <div className="shrink-0 space-y-3 border-t border-white/[0.07] p-3">
        <LangSwitcher />
        <form action={logoutAction}>
          <button type="submit" className="btn-fx btn-fx-row flex min-h-[44px] w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10">
            <LogOut className="h-4 w-4" /> {t('logout')}
          </button>
        </form>
      </div>
    </aside>
  );
}
