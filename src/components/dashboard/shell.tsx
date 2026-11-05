'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Church, LayoutDashboard, Users, Home, Boxes, CalendarDays, ClipboardCheck,
  HandHeart, Wallet, HandHelping, MessagesSquare, BarChart3, UserCog,
  Globe2, LogOut, Menu, X,
} from 'lucide-react';
import { useLang, LangSwitcher } from '@/components/lang-context';
import { logoutAction } from '@/lib/actions/auth';
import { roleLabel, canManageUsers, canUseWebManager, type Role } from '@/lib/rbac';
import { NotificationBell, type Notif } from './notification-bell';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/dashboard', key: 'dashboard', icon: LayoutDashboard },
  { href: '/dashboard/members', key: 'members', icon: Users },
  { href: '/dashboard/families', key: 'families', icon: Home },
  { href: '/dashboard/groups', key: 'groups', icon: Boxes },
  { href: '/dashboard/events', key: 'events', icon: CalendarDays },
  { href: '/dashboard/attendance', key: 'attendance', icon: ClipboardCheck },
  { href: '/dashboard/donations', key: 'donations', icon: HandHeart },
  { href: '/dashboard/finance', key: 'finance', icon: Wallet },
  { href: '/dashboard/volunteers', key: 'volunteers', icon: HandHelping },
  { href: '/dashboard/communication', key: 'communication', icon: MessagesSquare },
  { href: '/dashboard/reports', key: 'reports', icon: BarChart3 },
];

export function DashboardShell({
  profile, notifications, children,
}: {
  profile: { id: string; nama: string; role: Role };
  notifications: Notif[];
  children: React.ReactNode;
}) {
  const { t } = useLang();
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  const items = [...NAV];
  if (canUseWebManager(profile.role)) items.push({ href: '/dashboard/web-manager', key: 'web-manager', icon: Globe2 });
  if (canManageUsers(profile.role)) items.push({ href: '/dashboard/users', key: 'user-management', icon: UserCog });

  const sidebar = (
    <aside className={cn(
      'fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r bg-card transition-transform lg:static lg:translate-x-0',
      open ? 'translate-x-0' : '-translate-x-full'
    )}>
      <div className="flex h-16 items-center gap-3 border-b px-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
          <Church className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <h1 className="text-sm font-bold">{t('cms-title')}</h1>
          <p className="text-xs text-muted-foreground">Gereja Digital</p>
        </div>
        <button className="btn-fx btn-fx-ghost lg:hidden cursor-pointer p-2 rounded-md" onClick={() => setOpen(false)} aria-label="Tutup menu">
          <X className="h-5 w-5" />
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto p-3">
        <ul className="space-y-1">
          {items.map(({ href, key, icon: Icon }) => {
            const active = href === '/dashboard' ? pathname === href : pathname.startsWith(href);
            return (
              <li key={href}>
                <Link href={href} onClick={() => setOpen(false)}
                  className={cn(
                    'flex min-h-[44px] items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    active ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                  )}>
                  <Icon className="h-4 w-4" /> {t(key)}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="border-t p-3 space-y-3">
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
      {open && <div className="fixed inset-0 z-30 bg-black/60 lg:hidden" onClick={() => setOpen(false)} />}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur">
          <button className="btn-fx btn-fx-ghost lg:hidden cursor-pointer p-2 rounded-md" onClick={() => setOpen(true)} aria-label="Buka menu">
            <Menu className="h-5 w-5" />
          </button>
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
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
