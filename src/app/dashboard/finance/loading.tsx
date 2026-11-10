import {
  Skeleton, SkeletonCard, SkeletonHeading, SkeletonPage, SkeletonPanel, SkeletonTabs,
} from '@/components/ui/skeleton';

// Tab default = dashboard keuangan: kartu saldo/ringkasan, grafik garis, dua grafik kategori.
export default function FinanceLoading() {
  return (
    <SkeletonPage className="space-y-3 sm:space-y-4">
      <SkeletonHeading responsive subWidth="w-64" />
      <SkeletonTabs count={6} widths={['w-32', 'w-20', 'w-24', 'w-20', 'w-28', 'w-24']} />
      <div aria-hidden="true" className="space-y-4">
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
          <SkeletonCard className="col-span-3 sm:col-span-1">
            <div className="p-3 sm:p-5">
              <div className="flex h-4 items-center sm:h-5"><Skeleton className="h-3 w-24 sm:h-3.5" /></div>
              <div className="flex h-7 items-center sm:h-8"><Skeleton className="h-5 w-36 sm:h-6" /></div>
              <Skeleton className="mt-1 h-9 w-40 rounded-md" />
            </div>
          </SkeletonCard>
          {[0, 1, 2].map((i) => (
            <SkeletonCard key={i}>
              <div className="p-2.5 sm:p-5">
                <div className="flex h-4 items-center sm:h-5"><Skeleton className="h-2.5 w-14 sm:h-3.5 sm:w-24" /></div>
                <div className="flex h-5 items-center sm:h-8"><Skeleton className="h-4 w-12 sm:h-6 sm:w-28" /></div>
              </div>
            </SkeletonCard>
          ))}
        </div>
        <SkeletonPanel bodyClass="h-[300px]" />
        <div className="snap-row grid grid-cols-1 gap-4 lg:grid-cols-2">
          <SkeletonPanel bodyClass="h-[300px]" />
          <SkeletonPanel bodyClass="h-[300px]" />
        </div>
      </div>
    </SkeletonPage>
  );
}
