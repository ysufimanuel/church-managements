import { SkeletonHeading, SkeletonPage, SkeletonTable, SkeletonToolbar } from '@/components/ui/skeleton';

export default function MembersLoading() {
  return (
    <SkeletonPage className="space-y-4">
      <SkeletonHeading subWidth="w-64" />
      <SkeletonToolbar selects={['w-32', 'w-32']} buttons={['w-28', 'w-36']} />
      <SkeletonTable columns={['w-8', 'w-32', 'w-40', 'w-28', 'w-20', 'w-16', 'w-24', 'w-20']} rows={10} />
    </SkeletonPage>
  );
}
