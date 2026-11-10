import { Skeleton, SkeletonCard, SkeletonHeading, SkeletonPage } from '@/components/ui/skeleton';

export default function ReportsLoading() {
  return (
    <SkeletonPage className="space-y-3 sm:space-y-4">
      <SkeletonHeading responsive subWidth="w-64" />
      <div aria-hidden="true" className="grid grid-cols-2 gap-2 sm:gap-4 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <SkeletonCard key={i} className="h-full">
            <div className="flex flex-col items-center p-3 text-center sm:p-6">
              <Skeleton className="mb-2 h-9 w-9 rounded-xl sm:mb-3 sm:h-12 sm:w-12" />
              <Skeleton className="h-4 w-24 sm:h-5 sm:w-28" />
              <Skeleton className="mt-1.5 h-3 w-28 sm:h-3.5 sm:w-36" />
            </div>
          </SkeletonCard>
        ))}
      </div>
    </SkeletonPage>
  );
}
