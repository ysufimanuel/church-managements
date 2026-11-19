import * as React from 'react';
import { cn } from '@/lib/utils';
import { SkeletonLabel } from '@/components/ui/skeleton-label';

export { SkeletonLabel };

/** Blok placeholder. Shimmer = CSS .skeleton (hanya transform). Dekoratif -> aria-hidden. */
export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div aria-hidden="true" className={cn('skeleton rounded-md bg-white/[0.07]', className)} {...props} />;
}

/** Pembungkus halaman loading: aria-busy + label tersembunyi untuk screen reader. */
export function SkeletonPage({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div aria-busy="true" className={className}>
      <SkeletonLabel />
      {children}
    </div>
  );
}

/** Baris teks; tinggi baris dipertahankan (`lineClass`) agar tidak ada layout shift. */
export function SkeletonText({ className, lineClass = 'h-5' }: { className?: string; lineClass?: string }) {
  return (
    <div aria-hidden="true" className={cn('flex items-center', lineClass)}>
      <Skeleton className={cn('h-3.5', className ?? 'w-40')} />
    </div>
  );
}

/** Blok judul h1 + deskripsi (text-2xl + base). `responsive` = text-xl sm:text-2xl, deskripsi disembunyikan di mobile. */
export function SkeletonHeading({ responsive = false, subWidth = 'w-72' }: { responsive?: boolean; subWidth?: string }) {
  return (
    <div aria-hidden="true">
      <div className={cn('flex items-center', responsive ? 'h-7 sm:h-8' : 'h-8')}><Skeleton className="h-6 w-44 max-w-full" /></div>
      <div className={cn('items-center h-6', responsive ? 'hidden sm:flex' : 'flex')}><Skeleton className={cn('h-4 max-w-full', subWidth)} /></div>
    </div>
  );
}

/** Kartu kaca seperti <Card>. */
export function SkeletonCard({ className, children }: { className?: string; children?: React.ReactNode }) {
  return <div aria-hidden="true" className={cn('glass rounded-card', className)}>{children}</div>;
}

/** Toolbar: pencarian (flex-1) + select + tombol. Tinggi kontrol 40px seperti Input/Button. */
export function SkeletonToolbar({
  search = true, selects = [], buttons = [], className,
}: { search?: boolean; selects?: string[]; buttons?: string[]; className?: string }) {
  return (
    <div aria-hidden="true" className={cn('flex flex-wrap items-center gap-2', className)}>
      {search && <Skeleton className="h-10 min-w-[200px] flex-1 rounded-lg" />}
      {selects.map((w, i) => <Skeleton key={`s${i}`} className={cn('h-10 rounded-lg', w)} />)}
      {buttons.map((w, i) => <Skeleton key={`b${i}`} className={cn('h-10 rounded-lg', w)} />)}
    </div>
  );
}

/** Deretan tab (glass-subtle, p-1, tombol min-h 44px mobile / 40px desktop). */
export function SkeletonTabs({ count = 3, widths }: { count?: number; widths?: string[] }) {
  return (
    <div aria-hidden="true" className="flex gap-1 overflow-hidden rounded-lg glass-subtle p-1 md:flex-wrap">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="flex min-h-[44px] shrink-0 items-center px-4 md:min-h-0 md:py-2">
          <Skeleton className={cn('h-5', widths?.[i] ?? 'w-20')} />
        </div>
      ))}
    </div>
  );
}

/**
 * Meniru <Table>: desktop = tabel kaca (header h-11 + baris p-4); mobile (<sm) = kartu bertumpuk
 * (grid 2 kolom, kolom pertama & terakhir penuh) seperti CSS .table-cards.
 */
export function SkeletonTable({
  columns, rows = 8, className,
}: { columns: string[]; rows?: number; className?: string }) {
  const mobileCols = columns.slice(0, 4);
  return (
    <div aria-hidden="true" className={cn('glass relative w-full overflow-hidden rounded-card', className)}>
      <div className="hidden sm:block">
        <div className="flex h-11 items-center gap-4 border-b bg-white/5 px-4">
          {columns.map((w, i) => <Skeleton key={i} className={cn('h-3.5', w)} />)}
        </div>
        {Array.from({ length: rows }, (_, r) => (
          <div key={r} className="flex items-center gap-4 border-b p-4 last:border-0">
            {columns.map((w, i) => <Skeleton key={i} className={cn('h-5', w, i === 0 && r % 2 ? 'opacity-80' : '')} />)}
          </div>
        ))}
      </div>
      <div className="sm:hidden">
        {Array.from({ length: Math.min(rows, 6) }, (_, r) => (
          <div key={r} className="mb-2 grid grid-cols-2 gap-x-3 gap-y-0.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5">
            <div className="col-span-2 flex items-center gap-2"><Skeleton className="h-4 w-1/2" /></div>
            {mobileCols.slice(1).map((_, i) => (
              <div key={i} className={cn(i === mobileCols.length - 2 && 'col-span-2')}>
                <Skeleton className="mb-1 h-2 w-10" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Kartu entitas (families/groups/events/volunteers): header flex-row (judul text-base + `icons` tombol 40px,
 * opsional badge di bawah judul) + konten `lines` (kelas tinggi per baris, mis. 'h-5').
 */
export function SkeletonEntityCard({
  icons = 2, badge = false, lines = ['h-5', 'h-5', 'h-5', 'h-4'], contentClass = 'space-y-2',
}: { icons?: number; badge?: boolean; lines?: string[]; contentClass?: string }) {
  return (
    <SkeletonCard>
      <div className="flex flex-row items-start justify-between space-y-1.5 p-4 sm:p-6">
        <div className="min-w-0 space-y-0">
          <div className="flex h-5 items-center"><Skeleton className="h-4 w-36 max-w-full" /></div>
          {badge && <div className="mt-1 flex h-[22px] items-center"><Skeleton className="h-[22px] w-16 rounded-full" /></div>}
        </div>
        <div className="flex gap-1">
          {Array.from({ length: icons }, (_, i) => <Skeleton key={i} className="h-10 w-10 rounded-md" />)}
        </div>
      </div>
      <div className={cn('p-4 pt-0 sm:p-6 sm:pt-0', contentClass)}>
        {lines.map((h, i) => (
          <div key={i} className={cn('flex items-center', h)}>
            <Skeleton className={cn('h-3.5', i % 2 ? 'w-2/3' : 'w-5/6')} />
          </div>
        ))}
      </div>
    </SkeletonCard>
  );
}

/** Kartu statistik (p-5): label sm + angka 2xl. */
export function SkeletonStatCard({ className }: { className?: string }) {
  return (
    <SkeletonCard>
      <div className={cn('p-5', className)}>
        <div className="flex h-5 items-center"><Skeleton className="h-3.5 w-28 max-w-full" /></div>
        <div className="flex h-8 items-center"><Skeleton className="h-6 w-32 max-w-full" /></div>
      </div>
    </SkeletonCard>
  );
}

/** Kartu dengan judul (CardHeader + CardContent) dan area isi `bodyClass` (mis. grafik). */
export function SkeletonPanel({ bodyClass = 'h-[260px]', className }: { bodyClass?: string; className?: string }) {
  return (
    <SkeletonCard className={className}>
      <div className="flex flex-col space-y-1.5 p-4 sm:p-6">
        <div className="flex h-[18px] items-center"><Skeleton className="h-4 w-40" /></div>
      </div>
      <div className="p-4 pt-0 sm:p-6 sm:pt-0"><Skeleton className={cn('w-full rounded-lg', bodyClass)} /></div>
    </SkeletonCard>
  );
}
