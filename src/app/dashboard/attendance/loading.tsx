import { Skeleton, SkeletonCard, SkeletonHeading, SkeletonPage, SkeletonTabs } from '@/components/ui/skeleton';

// Tab default = check-in: form (event, cari anggota, tombol) + daftar kehadiran hari ini.
export default function AttendanceLoading() {
  return (
    <SkeletonPage className="space-y-4">
      <SkeletonHeading subWidth="w-64" />
      <SkeletonTabs count={3} widths={['w-20', 'w-28', 'w-16']} />
      <div aria-hidden="true" className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SkeletonCard>
          <div className="flex flex-col space-y-1.5 p-4 sm:p-6">
            <div className="flex h-[18px] items-center"><Skeleton className="h-4 w-44" /></div>
          </div>
          <div className="space-y-4 p-4 pt-0 sm:p-6 sm:pt-0">
            {[0, 1].map((i) => (
              <div key={i} className="space-y-2">
                <div className="flex h-[14px] items-center"><Skeleton className="h-3 w-24" /></div>
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
            ))}
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        </SkeletonCard>
        <SkeletonCard>
          <div className="flex flex-col space-y-1.5 p-4 sm:p-6">
            <div className="flex h-[18px] items-center"><Skeleton className="h-4 w-48" /></div>
          </div>
          <div className="space-y-2 p-4 pt-0 sm:p-6 sm:pt-0">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="flex items-center justify-between rounded-md border px-3 py-2">
                <Skeleton className="h-3.5 w-28" />
                <Skeleton className="h-3.5 w-24" />
              </div>
            ))}
          </div>
        </SkeletonCard>
      </div>
    </SkeletonPage>
  );
}
