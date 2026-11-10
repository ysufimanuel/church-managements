import { Skeleton, SkeletonHeading, SkeletonPage, SkeletonTabs } from '@/components/ui/skeleton';

// Tab default = Editor Visual: bilah atas, pemilih tampilan mobile, lalu 3 panel (bagian / pratinjau / editor).
export default function WebManagerLoading() {
  return (
    <SkeletonPage className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <SkeletonHeading subWidth="w-80" />
        <Skeleton aria-hidden="true" className="h-10 w-32 rounded-md" />
      </div>
      <SkeletonTabs count={4} widths={['w-24', 'w-28', 'w-20', 'w-36']} />

      <div aria-hidden="true" className="space-y-3">
        <div className="glass flex flex-wrap items-center gap-2 rounded-xl p-3">
          <Skeleton className="h-10 min-w-[10rem] flex-1 rounded-lg sm:max-w-[14rem] sm:flex-none sm:basis-56" />
          <Skeleton className="hidden h-11 w-32 rounded-lg lg:block" />
          <div className="ml-auto flex items-center gap-3">
            <Skeleton className="hidden h-3.5 w-40 xl:block" />
            <Skeleton className="h-10 w-36 rounded-md" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-1 rounded-lg bg-secondary/60 p-1 lg:hidden">
          {[0, 1, 2].map((i) => <Skeleton key={i} className="h-10 rounded-md" />)}
        </div>

        <div className="grid gap-3 lg:h-[calc(100vh-17rem)] lg:min-h-[620px] lg:grid-cols-[290px_minmax(0,1fr)_380px]">
          <aside className="glass flex flex-col overflow-hidden rounded-xl">
            <div className="flex items-center justify-between gap-2 border-b p-3">
              <div className="space-y-1.5"><Skeleton className="h-4 w-24" /><Skeleton className="h-3 w-36" /></div>
              <Skeleton className="h-9 w-24 rounded-md" />
            </div>
            <div className="flex-1 space-y-2 overflow-hidden p-3">
              {Array.from({ length: 6 }, (_, i) => <Skeleton key={i} className="h-14 w-full rounded-xl" />)}
            </div>
          </aside>
          <div className="glass hidden overflow-hidden rounded-xl lg:block"><Skeleton className="h-full w-full rounded-none" /></div>
          <aside className="glass hidden flex-col gap-3 overflow-hidden rounded-xl p-3 lg:flex">
            <Skeleton className="h-5 w-32" />
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="space-y-2"><Skeleton className="h-3 w-20" /><Skeleton className="h-10 w-full rounded-lg" /></div>
            ))}
            <Skeleton className="h-24 w-full rounded-lg" />
          </aside>
        </div>
      </div>
    </SkeletonPage>
  );
}
