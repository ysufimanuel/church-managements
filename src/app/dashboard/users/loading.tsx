import { Skeleton, SkeletonCard, SkeletonHeading, SkeletonPage, SkeletonToolbar } from '@/components/ui/skeleton';

export default function UsersLoading() {
  return (
    <SkeletonPage className="space-y-4">
      <SkeletonHeading subWidth="w-60" />
      <SkeletonToolbar buttons={['w-32']} className="items-stretch" />
      <div aria-hidden="true" className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <SkeletonCard key={i}>
            <div className="flex items-center gap-4 p-5">
              <Skeleton className="h-12 w-12 shrink-0 rounded-full" />
              <div className="min-w-0 flex-1">
                <div className="flex h-6 items-center"><Skeleton className="h-4 w-32 max-w-full" /></div>
                <div className="flex h-5 items-center"><Skeleton className="h-3.5 w-24" /></div>
                <div className="mt-1 flex gap-2">
                  <Skeleton className="h-[22px] w-20 rounded-full" />
                  <Skeleton className="h-[22px] w-14 rounded-full" />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <Skeleton className="h-10 w-10 rounded-md" />
                <Skeleton className="h-10 w-10 rounded-md" />
              </div>
            </div>
          </SkeletonCard>
        ))}
      </div>
    </SkeletonPage>
  );
}
