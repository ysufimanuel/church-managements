'use client';

import * as React from 'react';
import Link from 'next/link';
import { Church, UserCog, Globe2 } from 'lucide-react';
import { useLang } from '@/components/lang-context';
import { logoutAction } from '@/lib/actions/auth';
import { roleLabel, canManageUsers, canUseWebManager, type Role } from '@/lib/rbac';
import { NotificationBell, type Notif } from './notification-bell';
import { MobileNav } from './mobile-nav';
import { Sidebar } from './sidebar';
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

  const items = [...NAV];
  if (canUseWebManager(profile.role)) items.push({ href: '/dashboard/web-manager', key: 'web-manager', icon: Globe2 });
  if (canManageUsers(profile.role)) items.push({ href: '/dashboard/users', key: 'user-management', icon: UserCog });

  const sidebar = <Sidebar items={items} role={profile.role} />;

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
