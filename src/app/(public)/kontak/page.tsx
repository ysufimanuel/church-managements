import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Kontak & Lokasi',
  description: 'Alamat, jam ibadah, dan kontak gereja.',
};

/**
 * Public contact content is tenant-scoped under /site/[slug].
 * Keeping this legacy route out of the tenant renderer prevents
 * accidentally exposing another church's contact data without a church context.
 */
export default function KontakPage() {
  redirect('/login');
}
