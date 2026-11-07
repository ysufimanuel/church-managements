import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { unstable_noStore } from 'next/cache';
import { createAdminClient } from '@/lib/supabase/admin';
import { getCurrentProfile } from '@/lib/supabase/server';
import { canUseWebManager, type Role } from '@/lib/rbac';
import { SectionRenderer } from '@/components/public/section-renderer';
import { PreviewBridge } from '@/components/public/preview-bridge';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';
type Props = { params: { slug: string; path?: string[] }; searchParams?: { preview?: string; edit?: string; theme?: string; v?: string } };
function publicHref(base: string, href: string) {
  if (!href || href === '/' || href === '#home') return base;
  if (/^(https?:\/\/|mailto:|tel:)/i.test(href)) return href;
  if (/^[a-z][a-z\d+.-]*:/i.test(href) || href.startsWith('//')) return base;
  if (href.startsWith('#')) return `${base}${href}`;
  const route = href;
  return `${base}${route.startsWith('/') ? route : `/${route}`}`;
}
async function getChurch(slug: string) { const admin = createAdminClient(); const { data } = await admin.from('churches').select('id,slug,nama,alamat,kota,telepon,email').eq('slug', slug).maybeSingle(); return data; }
export async function generateMetadata({ params }: Props): Promise<Metadata> { const church = await getChurch(params.slug); if (!church) return { title: 'Gereja tidak ditemukan' }; return { title: church.nama, description: `Website resmi ${church.nama}` }; }

export default async function PublicChurchPage({ params, searchParams }: Props) {
  unstable_noStore();
  const church = await getChurch(params.slug); if (!church) notFound();
  const previewRequested = searchParams?.preview === 'draft'; let preview = false;
  if (previewRequested) { const profile = await getCurrentProfile(); if (!profile || profile.church_id !== church.id || !canUseWebManager(profile.role as Role)) notFound(); preview = true; }
  const admin = createAdminClient();
  const [{ data: theme }, { data: rawNav }] = await Promise.all([admin.from('site_theme').select('*').eq('church_id', church.id).eq('id', 1).maybeSingle(), admin.from('site_nav_items').select('*').eq('church_id', church.id).order('sort_order').order('id')]);
  const navItems = (rawNav || []).map((item) => {
    const version = preview ? item.draft : item.published;
    if (!version) return null;
    return { ...item, ...(version as Record<string, unknown>) };
  }).filter(Boolean).filter((item: any) => item.visible !== false);
  const base = `/site/${church.slug}`; const page = (params.path?.[0] || 'home').trim().toLowerCase();
  const themeValues: any = preview ? (theme?.draft || theme || {}) : (theme?.published || theme || {});
  const defaultTheme = themeValues?.website_theme === 'default';
  const primary = defaultTheme ? '#0F1117' : (themeValues?.primary_color || '#FFFFFF');
  const secondary = defaultTheme ? '#FFFFFF' : (themeValues?.secondary_color || '#1F2937');
  const accent = defaultTheme ? '#00E5FF' : (themeValues?.accent_color || '#22C55E');
  const headerText = defaultTheme ? '#FFFFFF' : primary;
  const pageStyle = { ['--site-primary' as string]: primary, ['--site-secondary' as string]: secondary, ['--site-accent' as string]: accent, background: primary, color: secondary, fontFamily: defaultTheme ? '"Plus Jakarta Sans", Inter, sans-serif' : (themeValues?.font_family || undefined) } as CSSProperties;
  return <main className={defaultTheme ? "min-h-dvh default-theme-site default-web-site" : "min-h-dvh"} data-theme-preset={defaultTheme ? "default" : "cms"} style={pageStyle}>
    {preview && <div className="sticky top-0 z-[70] border-b px-3 py-2 text-center text-xs font-semibold" style={{ background: defaultTheme ? '#1A1D24' : secondary, color: defaultTheme ? '#FFFFFF' : primary, borderColor: defaultTheme ? '#2D3748' : `${primary}33` }}>DRAFT PREVIEW — perubahan belum dipublish</div>}
    <header className={defaultTheme ? "glass-nav pt-safe sticky top-0 z-50 border-b border-line" : "sticky top-0 z-50 border-b shadow-sm"} style={{ background: defaultTheme ? "rgba(15,17,23,.88)" : secondary, color: defaultTheme ? secondary : primary, borderColor: defaultTheme ? "#2D3748" : `${primary}33` }}><div className={`container flex ${defaultTheme ? "min-h-[72px]" : "min-h-16"} items-center gap-3 px-4`}><Link href={base} className="min-w-0 flex-1"><p className="truncate font-bold" style={{ color: headerText }}>{church.nama}</p><p className="text-xs opacity-70" style={{ color: headerText }}>Gereja Digital</p></Link><nav className={defaultTheme ? "hidden items-center gap-7 md:flex" : "hidden items-center gap-5 md:flex"}>{navItems.map((item: any) => <Link key={item.id} href={publicHref(base, item.href)} className={defaultTheme ? "text-nav uppercase transition-colors hover:text-[#00E5FF]" : "text-sm font-medium transition-opacity hover:opacity-70"} style={{ color: headerText }}>{item.label}</Link>)}{defaultTheme && <Link href={publicHref(base, '#schedule')} className="rounded-badge bg-[#00E5FF] px-5 py-3 text-sm font-semibold text-[#0F1117]">Jadwal ibadah</Link>}<Link href="/login" className="rounded-md border px-4 py-2 text-sm font-semibold" style={{ borderColor: `${headerText}66`, color: headerText }}>Login</Link></nav><details className="relative md:hidden"><summary aria-label="Buka navigasi" className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-md border text-lg font-semibold [&::-webkit-details-marker]:hidden" style={{ borderColor: `${headerText}66`, color: headerText }}>☰</summary><div className="absolute right-0 top-12 z-50 min-w-52 rounded-lg border p-2 shadow-xl" style={{ background: defaultTheme ? '#1A1D24' : secondary, borderColor: defaultTheme ? '#2D3748' : `${primary}33` }}>{navItems.map((item: any) => <Link key={item.id} href={publicHref(base, item.href)} className="block rounded-md px-3 py-3 text-sm font-medium hover:opacity-70" style={{ color: headerText }}>{item.label}</Link>)}{defaultTheme && <Link href={publicHref(base, '#schedule')} className="mt-1 block rounded-md bg-[#00E5FF] px-3 py-3 text-center text-sm font-semibold text-[#0F1117]">Jadwal ibadah</Link>}<Link href="/login" className="mt-1 block rounded-md border px-3 py-3 text-center text-sm font-semibold" style={{ borderColor: `${headerText}66`, color: headerText }}>Login</Link></div></details></div></header>
    {preview && searchParams?.edit === '1' && <PreviewBridge />}
    <SectionRenderer page={page} churchId={church.id} basePath={base} preview={preview} themePreset={defaultTheme ? "default" : "cms"} />
    <footer className={defaultTheme ? "border-t border-line pt-10 pb-10" : "border-t py-8"} style={{ background: primary, color: secondary, borderColor: defaultTheme ? "#2D3748" : `${secondary}22` }}><div className={defaultTheme ? "gutter flex flex-wrap items-center justify-between gap-6 px-4" : "container px-4 text-sm"}><div className="min-w-0"><p className="font-semibold">{church.nama}</p><p className={defaultTheme ? "mt-2 text-body-sm text-ink-muted" : ""}>{church.alamat}{church.kota ? `, ${church.kota}` : ''}</p>{church.telepon && <p className={defaultTheme ? "text-body-sm text-ink-muted" : ""}>{church.telepon}</p>}{church.email && <p className={defaultTheme ? "text-body-sm text-ink-muted" : ""}>{church.email}</p>}</div>{defaultTheme && <nav aria-label="Navigasi footer" className="flex flex-wrap gap-x-6 gap-y-2">{navItems.map((item: any) => <Link key={item.id} href={publicHref(base, item.href)} className="inline-flex min-h-11 items-center text-body-sm font-semibold text-ink-muted transition-colors hover:text-ink">{item.label}</Link>)}</nav>}<p className={defaultTheme ? "w-full border-t border-line pt-6 text-caption text-ink-faint" : "mt-2"}>© {new Date().getFullYear()} {church.nama}. Semua hak dilindungi.</p></div></footer>
  </main>;
}
