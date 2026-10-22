import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';
import { SectionRenderer } from '@/components/public/section-renderer';

export const revalidate = 60;
type Props = { params: { slug: string; path?: string[] } };

function publicHref(base: string, href: string) {
  if (!href || href === '/') return base;
  if (/^https?:\/\//i.test(href)) return href;
  return `${base}${href.startsWith('/') ? href : `/${href}`}`;
}

async function getChurch(slug: string) {
  const admin = createAdminClient();
  const { data } = await admin.from('churches').select('id,slug,nama,alamat,kota,telepon,email').eq('slug', slug).maybeSingle();
  return data;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const church = await getChurch(params.slug);
  if (!church) return { title: 'Gereja tidak ditemukan' };
  return { title: church.nama, description: `Website resmi ${church.nama}` };
}

export default async function PublicChurchPage({ params }: Props) {
  const church = await getChurch(params.slug);
  if (!church) notFound();
  const admin = createAdminClient();
  const [{ data: theme }, { data: navItems }] = await Promise.all([
    admin.from('site_theme').select('*').eq('church_id', church.id).eq('id', 1).maybeSingle(),
    admin.from('site_nav_items').select('*').eq('church_id', church.id).eq('state', 'published').eq('visible', true).order('sort_order'),
  ]);
  const base = `/site/${church.slug}`;
  const page = params.path?.[0] || 'home';
  return <main className="min-h-dvh bg-background" style={{ ['--site-primary' as string]: theme?.primary_color || '#00E5FF' }}>
    <header className="sticky top-0 z-30 border-b bg-background/90 backdrop-blur"><div className="container flex min-h-16 items-center gap-5 px-4"><Link href={base} className="min-w-0 flex-1"><p className="truncate font-bold">{church.nama}</p><p className="text-xs text-muted-foreground">Gereja Digital</p></Link><nav className="hidden items-center gap-4 md:flex">{(navItems || []).map((item) => <Link key={item.id} href={publicHref(base, item.href)} className="text-sm text-muted-foreground hover:text-foreground">{item.label}</Link>)}</nav></div></header>
    <SectionRenderer page={page} churchId={church.id} basePath={base} />
    <footer className="border-t py-8"><div className="container px-4 text-sm text-muted-foreground"><p className="font-medium text-foreground">{church.nama}</p><p>{church.alamat}{church.kota ? `, ${church.kota}` : ''}</p>{church.telepon && <p>{church.telepon}</p>}{church.email && <p>{church.email}</p>}</div></footer>
  </main>;
}
