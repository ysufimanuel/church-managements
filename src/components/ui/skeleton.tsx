'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div aria-hidden="true" className={cn('animate-pulse rounded-lg bg-white/[0.07]', className)} {...props} />;
}

export function DashboardLoadingSkeleton() {
  return (
    <div role="status" aria-label="Loading dashboard" className="space-y-6">
      <div className="space-y-2"><Skeleton className="h-7 w-48" /><Skeleton className="h-4 w-64 max-w-full" /></div>
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => <div key={i} className="glass space-y-3 rounded-2xl p-4"><Skeleton className="h-3 w-24" /><Skeleton className="h-8 w-20" /><Skeleton className="h-3 w-32 max-w-full" /></div>)}
      </div>
      <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <div className="glass space-y-4 rounded-2xl p-4"><Skeleton className="h-5 w-40" /><Skeleton className="h-56 w-full rounded-xl" /></div>
        <div className="glass space-y-4 rounded-2xl p-4"><Skeleton className="h-5 w-36" />{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-11 w-full" />)}</div>
      </div>
      <span className="sr-only">Loading content…</span>
    </div>
  );
}

export function FeatureLoadingSkeleton() {
  return (
    <div role="status" aria-label="Loading page" className="space-y-5">
      <div className="space-y-2"><Skeleton className="h-7 w-52" /><Skeleton className="h-4 w-72 max-w-full" /></div>
      <div className="flex flex-wrap gap-2"><Skeleton className="h-10 w-36" /><Skeleton className="h-10 w-28" /><Skeleton className="h-10 w-24" /></div>
      <div className="glass space-y-3 rounded-2xl p-4"><Skeleton className="h-10 w-full" />{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
    </div>
  );
}
