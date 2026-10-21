import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { SectionRenderer } from '@/components/public/section-renderer';
import { MapPin, Phone, Mail } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Kontak & Lokasi',
  description: 'Alamat, jam ibadah, dan kontak WKC Church.',
};
export const revalidate = 60;

export default async function KontakPage() {
  const supabase = await createClient();
  const { data: church } = await supabase.from('church_profile').select('*').eq('id', 1).maybeSingle();

  return (
    <main className="container py-16">
      <h1 className="mb-8 text-4xl font-bold">Kontak</h1>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-6">
          <MapPin className="mb-3 h-6 w-6 text-primary" />
          <h2 className="font-semibold">Alamat</h2>
          <p className="mt-1 text-sm text-muted-foreground">{church?.alamat}, {church?.kota}</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <Phone className="mb-3 h-6 w-6 text-primary" />
          <h2 className="font-semibold">Telepon / WhatsApp</h2>
          <p className="mt-1 text-sm text-muted-foreground">{church?.telepon}</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <Mail className="mb-3 h-6 w-6 text-primary" />
          <h2 className="font-semibold">Email</h2>
          <p className="mt-1 text-sm text-muted-foreground">{church?.email}</p>
        </div>
      </div>
      <SectionRenderer page="kontak" />
    </main>
  );
}
