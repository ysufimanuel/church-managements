import { Skeleton, SkeletonCard, SkeletonHeading, SkeletonPage } from '@/components/ui/skeleton';

/** Skeleton halaman utama dashboard (mirror dashboard-home.tsx). Tiap rute lain punya loading.tsx sendiri. */
export default function DashboardLoading() {
  return (
    <SkeletonPage className="space-y-5 sm:space-y-6">
      <SkeletonHeading responsive subWidth="w-56" />

      {/* 6 kartu statistik: mobile 3 kolom ubin, desktop 2/3 kolom */}
      <div aria-hidden="true" className="grid grid-cols-3 gap-2 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <SkeletonCard key={i}>
            <div className="flex flex-col items-start gap-1.5 p-2.5 sm:flex-row sm:items-center sm:gap-4 sm:p-5">
              <Skeleton className="h-7 w-7 shrink-0 rounded-lg sm:h-12 sm:w-12 sm:rounded-xl" />
              <div className="min-w-0 max-w-full space-y-1.5">
                <Skeleton className="h-4 w-12 sm:h-6 sm:w-20" />
                <Skeleton className="h-2.5 w-14 sm:h-3.5 sm:w-28" />
              </div>
            </div>
          </SkeletonCard>
        ))}
      </div>

      {/* 3 grafik (carousel di mobile, grid di desktop) */}
      <div aria-hidden="true" className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="snap-row sm:contents">
          {[0, 1, 2].map((i) => (
            <SkeletonCard key={i}>
              <div className="flex flex-col space-y-1.5 p-4 sm:p-6">
                <div className="flex h-[18px] items-center"><Skeleton className="h-4 w-40" /></div>
              </div>
              <div className="p-4 pt-0 sm:p-6 sm:pt-0">
                <Skeleton className={i === 2 ? 'h-[200px] w-full rounded-lg sm:h-[280px]' : 'h-[150px] w-full rounded-lg sm:h-[260px]'} />
              </div>
            </SkeletonCard>
          ))}
        </div>

        {/* Desktop: tiga daftar */}
        <div className="hidden sm:contents">
          {[0, 1, 2].map((i) => (
            <SkeletonCard key={i}>
              <div className="flex flex-row items-center justify-between space-y-0 p-4 sm:p-6">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-4 w-14" />
              </div>
              <div className="space-y-3 p-4 pt-0 sm:p-6 sm:pt-0">
                {Array.from({ length: 5 }, (_, j) => (
                  <div key={j} className="flex items-center justify-between gap-3 border-b pb-2 last:border-0">
                    <div className="min-w-0 flex-1 space-y-1.5">
                      <Skeleton className="h-3.5 w-2/5" />
                      <Skeleton className="h-3 w-1/3" />
                    </div>
                    <Skeleton className="h-4 w-20" />
                  </div>
                ))}
              </div>
            </SkeletonCard>
          ))}
        </div>

        {/* Mobile: satu kartu bertab */}
        <SkeletonCard className="sm:hidden">
          <div className="flex gap-1 overflow-hidden p-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex min-h-[40px] shrink-0 items-center px-3"><Skeleton className="h-4 w-20" /></div>
            ))}
          </div>
          <div className="space-y-2 p-3 pt-0">
            {Array.from({ length: 4 }, (_, j) => (
              <div key={j} className="flex items-center justify-between gap-3 border-b border-white/10 pb-2 last:border-0">
                <div className="min-w-0 flex-1 space-y-1.5">
                  <Skeleton className="h-3.5 w-2/5" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
                <Skeleton className="h-3 w-14" />
              </div>
            ))}
            <div className="flex min-h-[44px] items-center px-1"><Skeleton className="h-4 w-16" /></div>
          </div>
        </SkeletonCard>
      </div>
    </SkeletonPage>
  );
}
