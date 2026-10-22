import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';
import { getCurrentProfile } from '@/lib/supabase/server';
import { canUseWebManager, type Role } from '@/lib/rbac';
import { SectionRenderer } from '@/components/public/section-renderer';

export const dynamic = 'force-dynamic';
type Props = { params: { slug: string; path?: string[] }; searchParams?: { preview?: string } };

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

export default async function PublicChurchPage({ params, searchParams }: Props) {
  const church = await getChurch(params.slug);
  if (!church) notFound();

  const previewRequested = searchParams?.preview === 'draft';
  let preview = false;
  if (previewRequested) {
    const profile = await getCurrentProfile();
    if (!profile || profile.church_id !== church.id || !canUseWebManager(profile.role as Role)) notFound();
    preview = true;
  }

  const admin = createAdminClient();
  const [{ data: theme }, { data: navItems }] = await Promise.all([
    admin.from('site_theme').select('*').eq('church_id', church.id).eq('id', 1).maybeSingle(),
    admin.from('site_nav_items').select('*').eq('church_id', church.id).eq('state', 'published').eq('visible', true).order('sort_order'),
  ]);
  const base = `/site/${church.slug}`;
  const page = params.path?.[0] || 'home';
  const themeValues = preview ? (theme?.draft || { primary_color: theme?.primary_color }) : (theme?.published || {});

  return <main className="min-h-dvh bg-background" style={{ ['--site-primary' as string]: themeValues?.primary_color || '#00E5FF' }}>
    {preview && <div className="sticky top-0 z-50 border-b bg-amber-500 px-3 py-2 text-center text-xs font-semibold text-black">DRAFT PREVIEW — perubahan belum dipublish</div>}
    <header className="sticky top-0 z-30 border-b bg-background/90 backdrop-blur"><div className="container flex min-h-16 items-center gap-5 px-4"><Link href={base} className="min-w-0 flex-1"><p className="truncate font-bold">{church.nama}</p><p className="text-xs text-muted-foreground">Gereja Digital</p></Link><nav className="hidden items-center gap-4 md:flex">{(navItems || []).map((item) => <Link key={item.id} href={publicHref(base, item.href)} className="text-sm text-muted-foreground hover:text-foreground">{item.label}</Link>)}</nav></div></header>
    <SectionRenderer page={page} churchId={church.id} basePath={base} preview={preview} />
    <footer className="border-t py-8"><div className="container px-4 text-sm text-muted-foreground"><p className="font-medium text-foreground">{church.nama}</p><p>{church.alamat}{church.kota ? `, ${church.kota}` : ''}</p>{church.telepon && <p>{church.telepon}</p>}{church.email && <p>{church.email}</p>}</div></div></footer>
  </main>;
}
