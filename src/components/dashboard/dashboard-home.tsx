'use client';

import * as React from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomEase } from 'gsap/CustomEase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLang } from '@/components/lang-context';
import { cn, formatRupiah, formatRupiahCompact, formatDate, timeAgo } from '@/lib/utils';
import {
  Users, ClipboardCheck, HandHeart, CalendarDays, Boxes, HandHelping, History, Calendar, TrendingUp,
} from 'lucide-react';
import {
  ChartInView, DashboardAttendanceChart, DashboardDonationTrendChart, DashboardMemberDonut,
} from './dashboard-charts';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, CustomEase);
  // ease-out kuat (skills: jangan pakai ease bawaan yang lemah) — cubic-bezier(0.23, 1, 0.32, 1)
  if (!CustomEase.get('outStrong')) CustomEase.create('outStrong', '0.23, 1, 0.32, 1');
}

type CountKind = 'int' | 'rupiah';
const formatCount = (kind: CountKind, n: number, narrow = false) =>
  kind === 'rupiah' ? (narrow ? formatRupiahCompact(Math.round(n)) : formatRupiah(Math.round(n))) : String(Math.round(n));

/**
 * Angka naik dari 0. Nilai akhir selalu dirender oleh React (SSR/no-JS/reduced-motion aman);
 * GSAP hanya mengubah nodeValue text node yang sama, tanpa setState per frame.
 */
function CountUp({ value, kind = 'int' }: { value: number; kind?: CountKind }) {
  const ref = React.useRef<HTMLSpanElement>(null);
  // Render awal (SSR & hydrasi) selalu format penuh; format ringkas dipakai setelah mount di layar kecil
  const [narrow, setNarrow] = React.useState(false);
  React.useEffect(() => { setNarrow(window.matchMedia('(max-width: 639px)').matches); }, []);

  React.useEffect(() => {
    const node = ref.current?.firstChild;
    if (!node || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const state = { v: 0 };
    node.nodeValue = formatCount(kind, 0, narrow);
    const tween = gsap.to(state, {
      v: value, duration: 0.9, delay: 0.25, ease: 'power3.out',
      onUpdate: () => { node.nodeValue = formatCount(kind, state.v, narrow); },
      onComplete: () => { node.nodeValue = formatCount(kind, value, narrow); },
    });
    return () => { tween.kill(); node.nodeValue = formatCount(kind, value, narrow); };
  }, [value, kind, narrow]);

  return <span ref={ref} className="tabular-nums">{formatCount(kind, value, narrow)}</span>;
}

// Target sentuh >= 44px untuk link "Lihat semua" di mobile.
const viewAllClass =
  'btn-fx btn-fx-row inline-flex min-h-[44px] items-center rounded-md px-1 text-sm text-primary [@media(hover:hover)]:hover:underline';

// Awalnya tersembunyi lewat CSS; GSAP yang memunculkan. motion-reduce: langsung tampil.
const animClass = 'motion-reduce:opacity-100';

const cardPad = 'p-4 sm:p-6';
const contentPad = 'p-4 pt-0 sm:p-6 sm:pt-0';

export function DashboardHome({
  userName, stats, activities, upcomingEvents, recentDonations, attendanceChart, memberChart, donationTrend,
}: any) {
  const { t, lang } = useLang();
  const rootRef = React.useRef<HTMLDivElement>(null);

  const cards = [
    { label: t('total-members'), value: stats.totalMembers, kind: 'int' as const, icon: Users, color: 'text-orange-400 bg-orange-400/10' },
    { label: t('attendance-this-week'), value: stats.attendanceWeek, kind: 'int' as const, icon: ClipboardCheck, color: 'text-blue-400 bg-blue-400/10' },
    { label: t('donations-this-month'), value: stats.donationsMonth, kind: 'rupiah' as const, icon: HandHeart, color: 'text-emerald-400 bg-emerald-400/10' },
    { label: t('active-events'), value: stats.activeEvents, kind: 'int' as const, icon: CalendarDays, color: 'text-purple-400 bg-purple-400/10' },
    { label: t('total-groups'), value: stats.totalGroups, kind: 'int' as const, icon: Boxes, color: 'text-red-400 bg-red-400/10' },
    { label: t('active-volunteers'), value: stats.activeVolunteers, kind: 'int' as const, icon: HandHelping, color: 'text-amber-400 bg-amber-400/10' },
  ];

  const monthFmt = React.useMemo(
    () => new Intl.DateTimeFormat(lang === 'id' ? 'id-ID' : 'en-US', { month: 'short', timeZone: 'UTC' }),
    [lang],
  );
  const trendData = (donationTrend || []).map((d: { ym: string; total: number }) => ({
    label: monthFmt.format(new Date(`${d.ym}-01T00:00:00Z`)),
    total: d.total,
  }));

  // Entrance + scroll reveal. Satu mekanisme: batch -> elemen yang masuk viewport bersamaan
  // di-stagger, yang di bawah fold muncul saat discroll (sekali saja).
  React.useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const items = gsap.utils.toArray<HTMLElement>('[data-anim]', root);
      gsap.set(items, { y: 14 });
      ScrollTrigger.batch(items, {
        start: 'top 92%',
        once: true,
        interval: 0.08,
        batchMax: 6,
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1, y: 0, duration: 0.45, ease: 'outStrong', stagger: 0.05,
            overwrite: true, clearProps: 'transform', // opacity dibiarkan: class opacity-0 akan menyembunyikan lagi
          }),
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <div ref={rootRef} className="space-y-5 sm:space-y-6">
      <div data-anim className={animClass}>
        <h1 className="text-xl font-bold sm:text-2xl">{t('dashboard')}</h1>
        <p className="text-sm text-muted-foreground sm:text-base">{t('welcome-back')}, {userName}!</p>
      </div>

      {/* Mobile: 3 kolom ubin ringkas; desktop: kartu lebih lega */}
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        {cards.map((c) => (
          <Card key={c.label} data-anim className={cn(animClass, 'transition-colors [@media(hover:hover)]:hover:border-primary/30')}>
            <CardContent className="flex flex-col items-start gap-1.5 p-2.5 sm:flex-row sm:items-center sm:gap-4 sm:p-5">
              <div className={cn('flex h-7 w-7 shrink-0 items-center justify-center rounded-lg sm:h-12 sm:w-12 sm:rounded-xl', c.color)}>
                <c.icon className="h-4 w-4 sm:h-6 sm:w-6" />
              </div>
              <div className="min-w-0 max-w-full">
                <p className="truncate text-sm font-bold leading-tight sm:text-xl">
                  <CountUp value={Number(c.value) || 0} kind={c.kind} />
                </p>
                <p className="line-clamp-2 text-[10px] leading-tight text-muted-foreground sm:text-sm">{c.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Mobile: grafik jadi carousel geser (scroll-snap); desktop: grid biasa */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="snap-row sm:contents">
        <Card data-anim className={animClass}>
          <CardHeader className={cardPad}><CardTitle>{t('attendance-stats')}</CardTitle></CardHeader>
          <CardContent className={contentPad}>
            <ChartInView className="min-h-[150px] sm:min-h-[260px]">
              <DashboardAttendanceChart data={attendanceChart} emptyLabel={t('none')} ariaLabel={t('attendance-stats')} />
            </ChartInView>
          </CardContent>
        </Card>

        <Card data-anim className={animClass}>
          <CardHeader className={cn(cardPad, 'flex-row items-center gap-2 space-y-0')}>
            <TrendingUp className="h-4 w-4 text-emerald-400" />
            <CardTitle>{t('donation-trend')}</CardTitle>
          </CardHeader>
          <CardContent className={contentPad}>
            <ChartInView className="min-h-[150px] sm:min-h-[260px]">
              <DashboardDonationTrendChart data={trendData} emptyLabel={t('none')} ariaLabel={t('donation-trend')} />
            </ChartInView>
          </CardContent>
        </Card>

        <Card data-anim className={animClass}>
          <CardHeader className={cardPad}><CardTitle>{t('member-distribution')}</CardTitle></CardHeader>
          <CardContent className={contentPad}>
            <ChartInView className="min-h-[200px] sm:min-h-[280px]">
              <DashboardMemberDonut data={memberChart} centerLabel={t('members')} emptyLabel={t('none')} />
            </ChartInView>
          </CardContent>
        </Card>

        </div>

        <div className="hidden sm:contents">
        <Card data-anim className={animClass}>
          <CardHeader className={cn(cardPad, 'flex-row items-center justify-between space-y-0')}>
            <CardTitle className="flex items-center gap-2"><HandHeart className="h-4 w-4" /> {t('recent-donations')}</CardTitle>
            <Link href="/dashboard/donations" className={viewAllClass}>{t('view-all')}</Link>
          </CardHeader>
          <CardContent className={cn(contentPad, 'space-y-3')}>
            {recentDonations.length === 0 && <p className="text-sm text-muted-foreground">{t('none')}</p>}
            {recentDonations.map((d: any) => (
              <div key={d.id} className="flex items-center justify-between gap-3 border-b pb-2 last:border-0">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{d.donors?.nama || '-'}</p>
                  <p className="truncate text-xs text-muted-foreground">{d.tipe} · {formatDate(d.tanggal)}</p>
                </div>
                <span className="shrink-0 text-sm font-semibold tabular-nums text-emerald-400">{formatRupiah(d.jumlah)}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card data-anim className={animClass}>
          <CardHeader className={cn(cardPad, 'flex-row items-center justify-between space-y-0')}>
            <CardTitle className="flex items-center gap-2"><Calendar className="h-4 w-4" /> {t('upcoming-events')}</CardTitle>
            <Link href="/dashboard/events" className={viewAllClass}>{t('view-all')}</Link>
          </CardHeader>
          <CardContent className={cn(contentPad, 'space-y-3')}>
            {upcomingEvents.length === 0 && <p className="text-sm text-muted-foreground">{t('none')}</p>}
            {upcomingEvents.map((e: any) => (
              <div key={e.id} className="flex items-center justify-between gap-3 border-b pb-2 last:border-0">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{e.nama}</p>
                  <p className="truncate text-xs text-muted-foreground">{e.lokasi}</p>
                </div>
                <span className="shrink-0 text-xs text-primary">{formatDate(e.start_at)}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card data-anim className={animClass}>
          <CardHeader className={cn(cardPad, 'flex-row items-center justify-between space-y-0')}>
            <CardTitle className="flex items-center gap-2"><History className="h-4 w-4" /> {t('recent-activity')}</CardTitle>
            <Link href="/dashboard/reports" className={viewAllClass}>{t('view-all')}</Link>
          </CardHeader>
          <CardContent className={cn(contentPad, 'space-y-3')}>
            {activities.length === 0 && <p className="text-sm text-muted-foreground">{t('none')}</p>}
            {activities.map((a: any) => (
              <div key={a.id} className="flex items-center justify-between gap-3 border-b pb-2 last:border-0">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{a.action}</p>
                  <p className="truncate text-xs text-muted-foreground">{a.detail}</p>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">{timeAgo(a.created_at)}</span>
              </div>
            ))}
          </CardContent>
        </Card>
        </div>

        <MobileLists
          tabs={[
            { id: 'donations', label: t('recent-donations'), href: '/dashboard/donations', empty: recentDonations.length === 0,
              rows: recentDonations.map((d: any) => ({ id: d.id, title: d.donors?.nama || '-', sub: `${d.tipe} · ${formatDate(d.tanggal)}`, right: formatRupiahCompact(Number(d.jumlah)), rightClass: 'text-emerald-400 font-semibold' })) },
            { id: 'events', label: t('upcoming-events'), href: '/dashboard/events', empty: upcomingEvents.length === 0,
              rows: upcomingEvents.map((e: any) => ({ id: e.id, title: e.nama, sub: e.lokasi, right: formatDate(e.start_at), rightClass: 'text-primary' })) },
            { id: 'activity', label: t('recent-activity'), href: '/dashboard/reports', empty: activities.length === 0,
              rows: activities.map((a: any) => ({ id: a.id, title: a.action, sub: a.detail, right: timeAgo(a.created_at), rightClass: 'text-muted-foreground' })) },
          ]}
          noneLabel={t('none')} viewAll={t('view-all')}
        />
      </div>
    </div>
  );
}

type MobileTab = { id: string; label: string; href: string; empty: boolean; rows: { id: string | number; title: string; sub?: string; right: string; rightClass?: string }[] };

/** Mobile: tiga daftar digabung jadi satu kartu bertab supaya halaman tidak panjang. */
function MobileLists({ tabs, noneLabel, viewAll }: { tabs: MobileTab[]; noneLabel: string; viewAll: string }) {
  const [active, setActive] = React.useState(tabs[0].id);
  const tab = tabs.find((x) => x.id === active) ?? tabs[0];
  return (
    <Card data-anim className={cn(animClass, 'sm:hidden')}>
      <div className="flex gap-1 overflow-x-auto p-2 [scrollbar-width:none]" role="tablist">
        {tabs.map((x) => (
          <button key={x.id} role="tab" aria-selected={active === x.id} onClick={() => setActive(x.id)}
            className={cn('btn-fx btn-fx-row shrink-0 rounded-lg px-3 py-2 text-xs font-medium min-h-[40px] cursor-pointer',
              active === x.id ? 'bg-primary/20 text-primary' : 'text-muted-foreground')}>
            {x.label}
          </button>
        ))}
      </div>
      <CardContent className="space-y-2 p-3 pt-0">
        {tab.empty && <p className="py-2 text-sm text-muted-foreground">{noneLabel}</p>}
        {tab.rows.slice(0, 4).map((r) => (
          <div key={r.id} className="flex items-center justify-between gap-3 border-b border-white/10 pb-2 last:border-0">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{r.title}</p>
              {r.sub && <p className="truncate text-xs text-muted-foreground">{r.sub}</p>}
            </div>
            <span className={cn('shrink-0 text-xs tabular-nums', r.rightClass)}>{r.right}</span>
          </div>
        ))}
        <Link href={tab.href} className={viewAllClass}>{viewAll}</Link>
      </CardContent>
    </Card>
  );
}
