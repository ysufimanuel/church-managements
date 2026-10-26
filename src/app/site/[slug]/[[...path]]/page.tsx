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
  const [{ data: theme }, { data: rawNav }] = await Promise.all([
    admin.from('site_theme').select('*').eq('church_id', church.id).eq('id', 1).maybeSingle(),
    admin.from('site_nav_items').select('*').eq('church_id', church.id).order('sort_order').order('id'),
  ]);

  const navItems = (rawNav || []).map((item) => {
    if (!preview) {
      const p = item.published || { label: item.label, href: item.href, visible: item.visible, sort_order: item.sort_order };
      return { ...item, ...p };
    }
    if (!item.draft) return null;
    return { ...item, ...(item.draft as Record<string, unknown>) };
  }).filter(Boolean).filter((item: any) => item.visible !== false);

  const base = `/site/${church.slug}`;
  const page = params.path?.[0] || 'home';
  const themeValues: any = preview
    ? (theme?.draft || { primary_color: theme?.primary_color, secondary_color: theme?.primary_color, accent_color: theme?.primary_color, font_family: theme?.font_family })
    : (theme?.published || { primary_color: theme?.primary_color, secondary_color: theme?.primary_color, accent_color: theme?.primary_color, font_family: theme?.font_family });
  const primary = themeValues?.primary_color || '#00E5FF';
  const secondary = themeValues?.secondary_color || primary;
  const accent = themeValues?.accent_color || secondary;
  const gradient = `linear-gradient(135deg, ${primary} 0%, ${secondary} 55%, ${accent} 100%)`;

  return (
    <main className="min-h-dvh bg-background" style={{ ['--site-primary' as string]: primary, ['--site-secondary' as string]: secondary, ['--site-accent' as string]: accent, fontFamily: themeValues?.font_family || undefined }}>
      {preview && <div className="sticky top-0 z-[60] border-b bg-amber-500 px-3 py-2 text-center text-xs font-semibold text-black">DRAFT PREVIEW — perubahan belum dipublish</div>}
      <header className="sticky top-0 z-50 border-b bg-background/90 backdrop-blur">
        <div className="container flex min-h-16 items-center gap-3 px-4">
          <Link href={base} className="min-w-0 flex-1">
            <p className="truncate font-bold">{church.nama}</p>
            <p className="text-xs text-muted-foreground">Gereja Digital</p>
          </Link>
          <nav className="hidden items-center gap-4 md:flex">
            {navItems.map((item: any) => <Link key={item.id} href={publicHref(base, item.href)} className="text-sm text-muted-foreground transition-colors hover:text-foreground">{item.label}</Link>)}
          </nav>
          <details className="relative md:hidden">
            <summary aria-label="Buka navigasi" className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-md border bg-background text-lg font-semibold [&::-webkit-details-marker]:hidden">☰</summary>
            <div className="absolute right-0 top-12 z-50 min-w-48 rounded-lg border bg-background p-2 shadow-xl">
              {navItems.map((item: any) => <Link key={item.id} href={publicHref(base, item.href)} className="block rounded-md px-3 py-2 text-sm hover:bg-muted">{item.label}</Link>)}
            </div>
          </details>
        </div>
        <div className="h-1" style={{ background: gradient }} />
      </header>
      <SectionRenderer page={page} churchId={church.id} basePath={base} preview={preview} />
      <footer className="border-t py-8"><div className="container px-4 text-sm text-muted-foreground"><p className="font-medium text-foreground">{church.nama}</p><p>{church.alamat}{church.kota ? `, ${church.kota}` : ''}</p>{church.telepon && <p>{church.telepon}</p>}{church.email && <p>{church.email}</p>}</div></footer>
    </main>
  );
}
