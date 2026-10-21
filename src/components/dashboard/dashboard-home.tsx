'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLang } from '@/components/lang-context';
import { formatRupiah, formatDate, timeAgo } from '@/lib/utils';
import { Users, ClipboardCheck, HandHeart, CalendarDays, Boxes, HandHelping, History, Calendar, Donate } from 'lucide-react';
import { AttendanceBarChart, MemberPieChart } from './charts';
import Link from 'next/link';

export function DashboardHome({ userName, stats, activities, upcomingEvents, recentDonations, attendanceChart, memberChart }: any) {
  const { t } = useLang();
  const cards = [
    { label: t('total-members'), value: stats.totalMembers, icon: Users, color: 'text-orange-400 bg-orange-400/10' },
    { label: t('attendance-this-week'), value: stats.attendanceWeek, icon: ClipboardCheck, color: 'text-blue-400 bg-blue-400/10' },
    { label: t('donations-this-month'), value: formatRupiah(stats.donationsMonth), icon: HandHeart, color: 'text-emerald-400 bg-emerald-400/10' },
    { label: t('active-events'), value: stats.activeEvents, icon: CalendarDays, color: 'text-purple-400 bg-purple-400/10' },
    { label: t('total-groups'), value: stats.totalGroups, icon: Boxes, color: 'text-red-400 bg-red-400/10' },
    { label: t('active-volunteers'), value: stats.activeVolunteers, icon: HandHelping, color: 'text-amber-400 bg-amber-400/10' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t('dashboard')}</h1>
        <p className="text-muted-foreground">{t('welcome-back')}, {userName}!</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((c) => (
          <Card key={c.label}>
            <CardContent className="flex items-center gap-4 p-5">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${c.color}`}>
                <c.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xl font-bold">{c.value}</p>
                <p className="text-sm text-muted-foreground">{c.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2"><History className="h-4 w-4" /> {t('recent-activity')}</CardTitle>
            <Link href="/dashboard/reports" className="text-sm text-primary hover:underline">{t('view-all')}</Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {activities.length === 0 && <p className="text-sm text-muted-foreground">{t('none')}</p>}
            {activities.map((a: any) => (
              <div key={a.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                <div>
                  <p className="text-sm font-medium">{a.action}</p>
                  <p className="text-xs text-muted-foreground">{a.detail}</p>
                </div>
                <span className="text-xs text-muted-foreground">{timeAgo(a.created_at)}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2"><Calendar className="h-4 w-4" /> {t('upcoming-events')}</CardTitle>
            <Link href="/dashboard/events" className="text-sm text-primary hover:underline">{t('view-all')}</Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingEvents.length === 0 && <p className="text-sm text-muted-foreground">{t('none')}</p>}
            {upcomingEvents.map((e: any) => (
              <div key={e.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                <div>
                  <p className="text-sm font-medium">{e.nama}</p>
                  <p className="text-xs text-muted-foreground">{e.lokasi}</p>
                </div>
                <span className="text-xs text-primary">{formatDate(e.start_at)}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>{t('attendance-stats')}</CardTitle></CardHeader>
          <CardContent><AttendanceBarChart data={attendanceChart} /></CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>{t('member-distribution')}</CardTitle></CardHeader>
          <CardContent><MemberPieChart data={memberChart} /></CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2"><HandHeart className="h-4 w-4" /> {t('recent-donations')}</CardTitle>
            <Link href="/dashboard/donations" className="text-sm text-primary hover:underline">{t('view-all')}</Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentDonations.map((d: any) => (
              <div key={d.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                <div>
                  <p className="text-sm font-medium">{d.donors?.nama || '-'}</p>
                  <p className="text-xs text-muted-foreground">{d.tipe} · {formatDate(d.tanggal)}</p>
                </div>
                <span className="text-sm font-semibold text-emerald-400">{formatRupiah(d.jumlah)}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
