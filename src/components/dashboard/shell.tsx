'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Church, UserCog, Globe2, LogOut, Search } from 'lucide-react';
import { useLang, LangSwitcher } from '@/components/lang-context';
import { logoutAction } from '@/lib/actions/auth';
import { roleLabel, canManageUsers, canUseWebManager, type Role } from '@/lib/rbac';
import { NotificationBell, type Notif } from './notification-bell';
import { MobileNav } from './mobile-nav';
import { cn } from '@/lib/utils';
import { NAV } from './nav-items';
import { GlobalSearch } from '@/components/search/global-search';


export function DashboardShell({
  profile, notifications, children,
}: {
  profile: { id: string; nama: string; role: Role };
  notifications: Notif[];
  children: React.ReactNode;
}) {
  const { t } = useLang();
  const pathname = usePathname();

  const items = [...NAV];
  if (canUseWebManager(profile.role)) items.push({ href: '/dashboard/web-manager', key: 'web-manager', icon: Globe2 });
  if (canManageUsers(profile.role)) items.push({ href: '/dashboard/users', key: 'user-management', icon: UserCog });

  const sidebar = (
    <aside className="hidden w-64 flex-col glass m-3 mr-0 rounded-card lg:static lg:flex">
      <div className="flex h-16 items-center gap-3 border-b border-white/10 px-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
          <Church className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <h1 className="text-sm font-bold">{t('cms-title')}</h1>
          <p className="text-xs text-muted-foreground">Gereja Digital</p>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto p-3">
        <ul className="space-y-1">
          {items.map(({ href, key, icon: Icon }) => {
            const active = href === '/dashboard' ? pathname === href : pathname.startsWith(href);
            return (
              <li key={href}>
                <Link href={href}
                  className={cn(
                    'flex min-h-[44px] items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    active ? 'bg-primary/15 text-primary shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.25)]' : 'text-muted-foreground hover:bg-white/10 hover:text-foreground'
                  )}>
                  <Icon className="h-4 w-4" /> {t(key)}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="border-t border-white/10 p-3 space-y-3">
        <LangSwitcher />
        <form action={logoutAction}>
          <button type="submit" className="btn-fx btn-fx-row flex min-h-[44px] w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 cursor-pointer">
            <LogOut className="h-4 w-4" /> {t('logout')}
          </button>
        </form>
      </div>
    </aside>
  );

  return (
    <div className="flex min-h-dvh">
      {sidebar}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="glass-nav sticky top-0 z-20 flex h-14 items-center gap-2 px-3 sm:h-16 sm:gap-3 sm:px-4">
          {/* Mobile: sidebar diganti bottom tab bar, brand pindah ke header */}
          <Link href="/dashboard" className="flex min-w-0 items-center gap-2 lg:hidden">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <Church className="h-5 w-5 text-primary" />
            </span>
            <span className="truncate text-sm font-bold">{t('cms-title')}</span>
          </Link>
          <div className="flex-1" />
          <button type="button" aria-label={t('nav-search')} onClick={() => window.dispatchEvent(new Event('wkc:open-search'))}
            className="btn-fx btn-fx-row glass-input hidden h-10 min-w-[220px] items-center gap-2 rounded-lg px-3 text-sm text-muted-foreground cursor-pointer md:flex">
            <Search className="h-4 w-4" /> <span className="flex-1 text-left">{t('search-feature')}</span>
            <kbd className="rounded border border-white/20 px-1.5 text-[10px]">Ctrl K</kbd>
          </button>
          <NotificationBell initial={notifications} userId={profile.id} />
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">{profile.nama}</p>
              <p className="text-xs text-muted-foreground">{roleLabel(profile.role)}</p>
            </div>
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(profile.nama)}&background=00e5ff&color=0F1117`}
              alt="Avatar" className="h-9 w-9 rounded-full"
            />
          </div>
        </header>
        <main className="dash-compact flex-1 p-3 sm:p-4 md:p-6">
          {children}
          {/* ruang untuk bottom tab bar (mobile) */}
          <div className="h-[calc(4.5rem+env(safe-area-inset-bottom))] lg:hidden" aria-hidden />
        </main>
      </div>
      <GlobalSearch mode="dashboard" features={items.map((i) => ({ href: i.href, key: i.key }))} />
      <MobileNav
        items={items}
        canWebManager={canUseWebManager(profile.role)}
        profile={{ nama: profile.nama }}
        roleText={roleLabel(profile.role)}
      />
    </div>
  );
}
