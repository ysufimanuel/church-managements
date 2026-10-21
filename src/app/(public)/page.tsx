import type { Metadata } from 'next';
import { SectionRenderer } from '@/components/public/section-renderer';
import { createClient } from '@/lib/supabase/server';

export async function generateMetadata(): Promise<Metadata> {
  const supabase = await createClient();
  const { data: church } = await supabase.from('church_profile').select('*').eq('id', 1).maybeSingle();
  return {
    title: `${church?.nama || 'WKC Church'} — Selamat Datang`,
    description: 'Selamat datang di WKC. Kami senang Anda di sini — membangun komunitas yang terhubung, bertumbuh, dan melayani sejak 1995.',
  };
}

export const revalidate = 60; // ISR: SEO-friendly + konten segar

export default function HomePage() {
  return (
    <main>
      <SectionRenderer page="home" />
    </main>
  );
}
