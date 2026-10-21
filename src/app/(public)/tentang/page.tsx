import type { Metadata } from 'next';
import { SectionRenderer } from '@/components/public/section-renderer';

export const metadata: Metadata = {
  title: 'Tentang Kami',
  description: 'Sejarah, visi, misi, dan kepemimpinan WKC Church sejak 1995.',
};
export const revalidate = 60;

export default function TentangPage() {
  return (
    <main>
      <section className="container py-16">
        <h1 className="mb-4 text-4xl font-bold">Tentang Kami</h1>
        <p className="max-w-3xl leading-relaxed text-muted-foreground">
          Berdiri sejak 1995, WKC Church berkomitmen membangun komunitas yang terhubung,
          bertumbuh dalam iman, dan melayani dengan kasih. Visi kami: membangun komunitas
          yang terhubung satu sama lain dan dengan Tuhan.
        </p>
      </section>
      <SectionRenderer page="tentang" />
    </main>
  );
}
