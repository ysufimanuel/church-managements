import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Events & Kegiatan',
  description: 'Jadwal ibadah, seminar, retret, dan kegiatan sosial terbaru.',
};

/**
 * Public events are now tenant-scoped under /site/[slug].
 * Keeping this legacy route out of the public tenant renderer prevents
 * accidentally rendering another church's content without a church context.
 */
export default function PublicEventsPage() {
  redirect('/login');
}
