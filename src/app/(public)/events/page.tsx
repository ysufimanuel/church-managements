import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { SectionRenderer } from '@/components/public/section-renderer';
import { formatDateTime } from '@/lib/utils';
import { MapPin } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Events & Kegiatan',
  description: 'Jadwal ibadah, seminar, retret, dan kegiatan sosial terbaru.',
};
export const revalidate = 60;

export default async function PublicEventsPage() {
  const supabase = await createClient();
  const { data: events } = await supabase.from('events').select('*')
    .in('status', ['upcoming', 'ongoing']).order('start_at');

  return (
    <main className="container py-16">
      <h1 className="mb-8 text-4xl font-bold">Events</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {(events || []).map((e) => {
          const d = new Date(e.start_at);
          return (
            <article key={e.id} className="rounded-lg border bg-card p-6 transition-colors hover:border-primary">
              <div className="mb-4 inline-flex flex-col items-center rounded-lg bg-primary/10 px-4 py-2 text-primary">
                <span className="text-2xl font-bold">{d.getDate()}</span>
                <span className="text-xs uppercase">{d.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })}</span>
              </div>
              <h2 className="text-lg font-medium">{e.nama}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{e.deskripsi}</p>
              <p className="mt-3 text-xs text-muted-foreground">{formatDateTime(e.start_at)}</p>
              <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" /> {e.lokasi}</p>
            </article>
          );
        })}
        {(events || []).length === 0 && <p className="text-muted-foreground">Belum ada event mendatang.</p>}
      </div>
      <SectionRenderer page="events" />
    </main>
  );
}
