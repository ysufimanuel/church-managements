import { Skeleton, SkeletonHeading, SkeletonPage, SkeletonTabs } from '@/components/ui/skeleton';

// Tab default = broadcast (admin) atau pesan; skeleton memakai panel obrolan split-pane (h-[600px]).
export default function CommunicationLoading() {
  return (
    <SkeletonPage className="space-y-4">
      <SkeletonHeading subWidth="w-64" />
      <SkeletonTabs count={3} widths={['w-28', 'w-28', 'w-32']} />
      <div aria-hidden="true" className="grid h-[600px] grid-cols-1 overflow-hidden rounded-lg border md:grid-cols-[280px_1fr]">
        <div className="flex flex-col border-r">
          <div className="flex items-center justify-between border-b p-3">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-10 w-10 rounded-md" />
          </div>
          <div className="border-b p-2"><Skeleton className="h-10 w-full rounded-lg" /></div>
          <div className="flex-1 overflow-hidden">
            {Array.from({ length: 7 }, (_, i) => (
              <div key={i} className="flex min-h-[56px] items-center gap-3 px-3 py-3">
                <Skeleton className="h-9 w-9 shrink-0 rounded-full" />
                <div className="min-w-0 flex-1 space-y-1.5">
                  <Skeleton className="h-3.5 w-3/5" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="hidden flex-col md:flex">
          <div className="flex items-center border-b p-3"><Skeleton className="h-5 w-40" /></div>
          <div className="flex-1 space-y-3 overflow-hidden p-4">
            <div className="flex justify-start"><Skeleton className="h-12 w-[45%] rounded-2xl" /></div>
            <div className="flex justify-end"><Skeleton className="h-10 w-[35%] rounded-2xl" /></div>
            <div className="flex justify-start"><Skeleton className="h-16 w-[55%] rounded-2xl" /></div>
            <div className="flex justify-end"><Skeleton className="h-12 w-[40%] rounded-2xl" /></div>
          </div>
        </div>
      </div>
    </SkeletonPage>
  );
}
