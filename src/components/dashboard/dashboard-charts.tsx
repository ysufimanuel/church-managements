'use client';

import * as React from 'react';
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import { formatRupiah, formatRupiahCompact } from '@/lib/utils';

/**
 * Chart khusus halaman Dashboard (mobile-first).
 * Sengaja dipisah dari ./charts.tsx karena file itu dipakai juga oleh Attendance & Finance.
 *
 * Aturan mobile:
 * - tinggi ditentukan wrapper (Tailwind), bukan angka tetap di ResponsiveContainer
 * - tidak ada label di luar pie (meluap di layar sempit) -> legend HTML di bawah
 * - tick kecil + tanpa garis sumbu Y supaya area plot lebih lebar
 */

const COLORS = ['#00E5FF', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444'];
const AXIS = '#A0AEC0';
const GRID = 'rgba(255,255,255,0.10)';

const tooltipStyle: React.CSSProperties = {
  background: 'rgba(20,23,30,.85)',
  border: '1px solid rgba(255,255,255,.16)',
  borderRadius: 8,
  fontSize: 12,
  padding: '6px 10px',
};

// Durasi chart dibuat pendek (skills: UI < 300ms; chart data boleh sedikit lebih panjang, tetap < 800ms).
const CHART_ANIM_MS = 700;
// Tunggu kartu induk selesai reveal (GSAP) sebelum chart mulai menggambar.
const CHART_ANIM_DELAY_MS = 250;

/** Baca preferensi reduced-motion sekali saat mount (tanpa re-render per frame). */
function usePrefersReducedMotion() {
  const [reduce] = React.useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  return reduce;
}

function useSafeId() {
  return React.useId().replace(/[^a-zA-Z0-9]/g, '');
}

/**
 * Render chart hanya setelah masuk viewport, supaya animasi gambar chart terlihat user
 * (di mobile chart ada di bawah fold). Placeholder menjaga tinggi -> tidak ada layout shift.
 */
export function ChartInView({ className, children }: { className: string; children: React.ReactNode }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [seen, setSeen] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') { setSeen(true); return; }
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setSeen(true); io.disconnect(); } },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={seen ? undefined : className}>
      {seen ? children : null}
    </div>
  );
}

function ChartEmpty({ label }: { label: string }) {
  return (
    <div className="flex h-[160px] items-center justify-center text-sm text-muted-foreground">{label}</div>
  );
}

/** 'MM-DD' -> 'DD/MM' */
const shortDate = (v: string) => (v.includes('-') ? v.split('-').reverse().join('/') : v);

const compactRupiah = { format: (v: number) => formatRupiahCompact(v).replace('Rp ', '') };

/* ------------------------------------------------------------------ */
/* Kehadiran per hari                                                  */
/* ------------------------------------------------------------------ */
export function DashboardAttendanceChart({
  data, emptyLabel, ariaLabel,
}: {
  data: { label: string; total: number }[];
  emptyLabel: string;
  ariaLabel: string;
}) {
  const reduce = usePrefersReducedMotion();
  const gid = useSafeId();
  if (!data.length) return <ChartEmpty label={emptyLabel} />;

  return (
    <div className="h-[200px] w-full sm:h-[260px]" role="img" aria-label={ariaLabel}>
      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
        <BarChart data={data} margin={{ top: 8, right: 4, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id={`${gid}-bar`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00E5FF" stopOpacity={0.95} />
              <stop offset="100%" stopColor="#00E5FF" stopOpacity={0.25} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke={GRID} strokeDasharray="3 3" />
          <XAxis
            dataKey="label" tickFormatter={shortDate} stroke={AXIS} fontSize={11}
            tickLine={false} axisLine={{ stroke: GRID }} tickMargin={8} interval="preserveStartEnd"
          />
          <YAxis stroke={AXIS} fontSize={11} allowDecimals={false} tickLine={false} axisLine={false} width={40} />
          <Tooltip
            contentStyle={tooltipStyle}
            labelFormatter={(v) => shortDate(String(v))}
            cursor={{ fill: 'rgba(255,255,255,0.04)' }}
            isAnimationActive={false}
          />
          <Bar
            dataKey="total" fill={`url(#${gid}-bar)`} radius={[6, 6, 0, 0]} maxBarSize={36}
            isAnimationActive={!reduce} animationBegin={CHART_ANIM_DELAY_MS}
            animationDuration={CHART_ANIM_MS} animationEasing="ease-out"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Distribusi jemaat (donut + legend HTML)                             */
/* ------------------------------------------------------------------ */
export function DashboardMemberDonut({
  data, centerLabel, emptyLabel,
}: {
  data: { name: string; value: number }[];
  centerLabel: string;
  emptyLabel: string;
}) {
  const reduce = usePrefersReducedMotion();
  const total = data.reduce((s, d) => s + d.value, 0);
  if (!total) return <ChartEmpty label={emptyLabel} />;

  return (
    <div className="flex flex-col gap-4">
      <div
        className="relative mx-auto h-[180px] w-full max-w-[240px] sm:h-[200px]"
        role="img"
        aria-label={`${centerLabel}: ${total}. ${data.map((d) => `${d.name} ${d.value}`).join(', ')}`}
      >
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <PieChart>
            <Pie
              data={data} dataKey="value" nameKey="name"
              innerRadius="62%" outerRadius="92%" paddingAngle={2} cornerRadius={4}
              stroke="none" startAngle={90} endAngle={-270}
              isAnimationActive={!reduce} animationBegin={CHART_ANIM_DELAY_MS}
              animationDuration={CHART_ANIM_MS} animationEasing="ease-out"
            >
              {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} isAnimationActive={false} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold tabular-nums leading-none">{total}</span>
          <span className="mt-1 text-xs text-muted-foreground">{centerLabel}</span>
        </div>
      </div>

      <ul className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm">
        {data.map((d, i) => (
          <li key={d.name} className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
            <span className="text-muted-foreground">{d.name}</span>
            <span className="font-medium tabular-nums">{d.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Tren donasi 6 bulan                                                 */
/* ------------------------------------------------------------------ */
export function DashboardDonationTrendChart({
  data, emptyLabel, ariaLabel,
}: {
  data: { label: string; total: number }[];
  emptyLabel: string;
  ariaLabel: string;
}) {
  const reduce = usePrefersReducedMotion();
  const gid = useSafeId();
  if (!data.length || data.every((d) => d.total === 0)) return <ChartEmpty label={emptyLabel} />;

  return (
    <div className="h-[200px] w-full sm:h-[260px]" role="img" aria-label={ariaLabel}>
      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
          <defs>
            <linearGradient id={`${gid}-area`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke={GRID} strokeDasharray="3 3" />
          <XAxis
            dataKey="label" stroke={AXIS} fontSize={11} tickLine={false}
            axisLine={{ stroke: GRID }} tickMargin={8} padding={{ left: 8, right: 8 }}
          />
          <YAxis
            stroke={AXIS} fontSize={11} tickLine={false} axisLine={false} width={44}
            tickFormatter={(v) => compactRupiah.format(Number(v))}
          />
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(v) => [formatRupiah(Number(v)), '']}
            separator=""
            cursor={{ stroke: GRID }}
            isAnimationActive={false}
          />
          <Area
            type="monotone" dataKey="total" stroke="#10B981" strokeWidth={2}
            fill={`url(#${gid}-area)`} dot={false}
            activeDot={{ r: 5, strokeWidth: 0, fill: '#10B981' }}
            isAnimationActive={!reduce} animationBegin={CHART_ANIM_DELAY_MS}
            animationDuration={CHART_ANIM_MS} animationEasing="ease-out"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
