import { SkeletonHeading, SkeletonPage, SkeletonStatCard, SkeletonTable, SkeletonToolbar } from '@/components/ui/skeleton';

export default function DonationsLoading() {
  return (
    <SkeletonPage className="space-y-4">
      <SkeletonHeading subWidth="w-60" />
      <div aria-hidden="true" className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((i) => <SkeletonStatCard key={i} />)}
      </div>
      <SkeletonToolbar selects={['w-36', 'w-40']} buttons={['w-20', 'w-20', 'w-20', 'w-40']} className="items-stretch" />
      <SkeletonTable columns={['w-24', 'w-32', 'w-20', 'w-40', 'w-24', 'w-24']} rows={8} />
    </SkeletonPage>
  );
}
