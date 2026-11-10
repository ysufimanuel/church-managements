import { SkeletonEntityCard, SkeletonHeading, SkeletonPage, SkeletonTabs, SkeletonToolbar } from '@/components/ui/skeleton';

// Tab default = daftar relawan: toolbar + grid kartu.
export default function VolunteersLoading() {
  return (
    <SkeletonPage className="space-y-4">
      <SkeletonHeading subWidth="w-60" />
      <SkeletonTabs count={3} widths={['w-28', 'w-32', 'w-24']} />
      <div aria-hidden="true" className="space-y-4">
        <SkeletonToolbar buttons={['w-36']} className="items-stretch" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <SkeletonEntityCard key={i} icons={2} badge lines={['h-5', 'h-[22px]']} contentClass="space-y-1" />
          ))}
        </div>
      </div>
    </SkeletonPage>
  );
}
