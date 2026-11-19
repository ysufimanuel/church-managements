import {
  LayoutDashboard, Users, Home, Boxes, CalendarDays, ClipboardCheck,
  HandHeart, Wallet, HandHelping, MessagesSquare, BarChart3, type LucideIcon,
} from 'lucide-react';

export const NAV: { href: string; key: string; icon: LucideIcon }[] = [
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
