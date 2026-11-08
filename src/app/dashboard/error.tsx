'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';

/** Batas error per halaman dashboard: shell (sidebar/nav) tetap tampil dan pesan error terlihat. */
export default function DashboardError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  React.useEffect(() => { console.error('[dashboard]', error); }, [error]);
  return (
    <div className="glass mx-auto mt-10 max-w-lg space-y-3 rounded-card p-6 text-center">
      <h2 className="text-lg font-bold">Halaman ini gagal dimuat</h2>
      <p className="break-words text-sm text-muted-foreground">{error.message || 'Terjadi kesalahan di sisi klien.'}{error.digest ? ` (${error.digest})` : ''}</p>
      <Button onClick={reset}>Coba lagi</Button>
    </div>
  );
}
