import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Tentang Kami',
  description: 'Sejarah, visi, misi, dan kepemimpinan gereja.',
};

/**
 * Public church content is tenant-scoped under /site/[slug].
 * This legacy route must not render SectionRenderer without a church context.
 */
export default function TentangPage() {
  redirect('/login');
}
