import { SkeletonEntityCard, SkeletonHeading, SkeletonPage, SkeletonToolbar } from '@/components/ui/skeleton';

export default function EventsLoading() {
  return (
    <SkeletonPage className="space-y-4">
      <SkeletonHeading subWidth="w-56" />
      <SkeletonToolbar selects={['w-36']} buttons={['w-36']} className="items-stretch" />
      <div aria-hidden="true" className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <SkeletonEntityCard key={i} icons={3} badge lines={['h-5', 'h-5', 'h-5', 'h-4']} contentClass="space-y-1" />
        ))}
      </div>
    </SkeletonPage>
  );
}
