import type { ReactNode } from 'react';
import { createAdminClient } from '@/lib/supabase/admin';
import { MediaFrame } from '@/components/public/media-frame';
import Link from 'next/link';
import { MapPin, Clock } from 'lucide-react';

type SectionMedia = { id: string | number; kind: 'image' | 'video'; url: string; ratio: string; size: number; radius: number; position: string; layer: 'front' | 'overlay'; autoplay?: boolean; title?: string };

function resolveHref(basePath: string, href?: string) { if (!href || href === '/') return basePath; if (/^https?:\/\//i.test(href)) return href; return `${basePath}${href.startsWith('/') ? href : `/${href}`}`; }
function mediaPositionClass(position: string) { if (position === 'left') return 'items-center justify-start'; if (position === 'right') return 'items-center justify-end'; if (position === 'top') return 'items-start justify-center'; if (position === 'bottom') return 'items-end justify-center'; return 'items-center justify-center'; }
function px(value: unknown, fallback: number, min: number, max: number) { return Math.min(max, Math.max(min, Number(value ?? fallback))); }
function normalizeMediaItems(content: any): SectionMedia[] {
  if (Array.isArray(content?.media_items)) return content.media_items.map((m: any, i: number) => ({ id: m.id || `media-${i}`, kind: m.kind === 'video' ? 'video' : 'image', url: m.url || '', ratio: m.ratio || '16:9', size: px(m.size, 100, 1, 100), radius: px(m.radius, 16, 0, 100), position: m.position || 'center', layer: m.layer === 'overlay' ? 'overlay' : 'front', autoplay: Boolean(m.autoplay), title: m.title || '' })).filter((m: SectionMedia) => m.url);
  if (content?.media_url) return [{ id: 'legacy-media', kind: content.media_kind === 'video' ? 'video' : 'image', url: content.media_url, ratio: content.ratio || '16:9', size: px(content.media_size, 100, 1, 100), radius: px(content.media_radius, 16, 0, 100), position: content.media_position || 'center', layer: content.media_layer === 'overlay' ? 'overlay' : 'front', autoplay: Boolean(content.media_autoplay), title: content.title || '' }];
  return [];
}
function SectionMedia({ content }: { content: any }) {
  const items = normalizeMediaItems(content);
  const front = items.filter((m) => m.layer === 'front');
  const overlay = items.filter((m) => m.layer === 'overlay');
  if (!items.length) return null;
  const frame = (m: SectionMedia) => <div key={m.id} style={{ width: `${m.size}%`, borderRadius: `${m.radius}px`, overflow: 'hidden' }}><MediaFrame item={{ id: m.id, kind: m.kind, url: m.url, ratio: m.ratio, layer: m.layer, position: m.position, autoplay: m.autoplay, title: m.title }} /></div>;
  return <>
    {overlay.length > 0 && <div className="pointer-events-none absolute inset-0 flex flex-col gap-3 px-4 py-8" style={{ zIndex: 0 }}>{overlay.map((m) => <div key={m.id} className={`flex h-full w-full ${mediaPositionClass(m.position)}`}>{frame(m)}</div>)}</div>}
    {front.length > 0 && <div className="relative z-10 flex w-full flex-col gap-5">{front.map(frame)}</div>}
  </>;
}
function SectionShell({ content, children, className = '' }: { content: any; children: ReactNode; className?: string }) {
  const hasOverlay = normalizeMediaItems(content).some((m) => m.layer === 'overlay');
  return <section className={`relative overflow-hidden ${className}`}><SectionMedia content={content} /><div className={`relative z-10 ${hasOverlay ? 'bg-[var(--site-primary)]/70' : ''}`}>{children}</div></section>;
}

export async function SectionRenderer({ page, churchId, basePath, preview = false }: { page: string; churchId: string; basePath: string; preview?: boolean }) {
  const supabase = createAdminClient();
  const { data: sections } = await supabase.from('site_sections').select('*').eq('church_id', churchId).eq('page', page).eq('enabled', true).order('sort_order');
  const { data: media } = await supabase.from('site_media').select('*').eq('church_id', churchId).eq('state', 'published').order('sort_order');
  const out: ReactNode[] = [];
  for (const s of sections || []) {
    if (preview && s.draft_deleted) continue;
    const c = (preview ? s.content : s.published) as any; if (!c) continue;
    const titleStyle = { fontSize: `${px(c.title_font_size, 32, 12, 96)}px`, color: 'var(--site-secondary)' };
    const subtitleStyle = { fontSize: `${px(c.subtitle_font_size, 18, 10, 48)}px`, color: 'var(--site-secondary)' };
    const bodyStyle = { fontSize: `${px(c.body_font_size, 16, 10, 36)}px`, color: 'var(--site-secondary)' };
    const ctaStyle = { fontSize: `${px(c.cta_font_size, 16, 10, 32)}px`, background: 'var(--site-accent)', color: '#fff' };
    if (s.type === 'hero') out.push(<SectionShell key={s.id} content={c} className="min-h-[520px] py-24 md:py-36">{c.bg_image && <img src={c.bg_image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-15" />}<div className="container px-4 text-center"><h1 className="font-bold leading-tight" style={titleStyle}>{c.title}</h1>{c.subtitle && <p className="mx-auto mt-4 max-w-2xl" style={subtitleStyle}>{c.subtitle}</p>}{c.cta_label && <Link href={resolveHref(basePath, c.cta_href || '/tentang')} className="mt-8 inline-block rounded-lg px-8 py-3 font-semibold shadow-sm" style={ctaStyle}>{c.cta_label}</Link>}</div></SectionShell>);
    else if (s.type === 'event_feed') { const { data: events } = await supabase.from('events').select('*').eq('church_id', churchId).in('status', ['upcoming', 'ongoing']).order('start_at').limit(c.limit || 3); out.push(<SectionShell key={s.id} content={c} className="container px-4 py-16"><h2 className="mb-8 font-semibold" style={titleStyle}>{c.title || 'Event Mendatang'}</h2><div className="grid gap-6 md:grid-cols-3">{(events || []).map((e) => { const d = new Date(e.start_at); return <article key={e.id} className="rounded-xl border p-6" style={{ background: 'var(--site-primary)', color: 'var(--site-secondary)' }}><div className="mb-4 inline-flex flex-col items-center rounded-lg px-4 py-2" style={{ border: '1px solid var(--site-secondary)' }}><span className="text-2xl font-bold">{d.getDate()}</span><span className="text-xs uppercase">{d.toLocaleDateString('id-ID', { month: 'short' })}</span></div><h3 className="font-medium" style={{ fontSize: `${px(c.body_font_size, 18, 10, 36)}px` }}>{e.nama}</h3><p className="mt-1" style={bodyStyle}>{e.deskripsi}</p><p className="mt-3 flex items-center gap-1" style={{ fontSize: `${Math.max(12, px(c.body_font_size, 16, 10, 36) - 2)}px` }}><MapPin className="h-3 w-3" /> {e.lokasi}</p></article>; })}{(events || []).length === 0 && <p style={bodyStyle}>Belum ada event.</p>}</div></SectionShell>); }
    else if (s.type === 'info_lokasi') out.push(<SectionShell key={s.id} content={c} className="container px-4 py-16"><h2 className="mb-8 font-semibold" style={titleStyle}>{c.title || 'Info & Lokasi'}</h2><div className="grid gap-8 md:grid-cols-2"><div className="space-y-4"><p className="flex items-start gap-2" style={bodyStyle}><MapPin className="mt-1 h-5 w-5" /> {c.address}</p><p className="flex items-start gap-2" style={bodyStyle}><Clock className="mt-1 h-5 w-5" /> {c.hours}</p></div>{(c.lat || c.maps_embed) && <MediaFrame item={{ id: s.id, kind: 'map', url: c.maps_embed || '', ratio: '1:1', layer: 'front', position: 'center', lat: c.lat, lng: c.lng, title: c.title }} />}</div></SectionShell>);
    else if (s.type === 'media') { const overlayClass = normalizeMediaItems(c).some((m) => m.layer === 'overlay') ? 'min-h-[360px]' : ''; out.push(<SectionShell key={s.id} content={c} className={`container px-4 py-16 ${overlayClass}`}>{c.title && <div className="mt-6 text-center"><h2 className="font-semibold" style={titleStyle}>{c.title}</h2></div>}</SectionShell>); }
    else if (s.type === 'map') out.push(<SectionShell key={s.id} content={c} className="container px-4 py-16"><div className="mx-auto max-w-xl"><h2 className="mb-8 text-center font-semibold" style={titleStyle}>{c.title || 'Lokasi'}</h2><MediaFrame item={{ id: s.id, kind: 'map', url: '', ratio: c.ratio || '1:1', layer: 'front', position: 'center', lat: c.lat, lng: c.lng, title: c.title }} /><p className="mt-2 text-center" style={bodyStyle}>Koordinat: {c.lat}, {c.lng}</p></div></SectionShell>);
    else if (s.type === 'richtext') out.push(<SectionShell key={s.id} content={c} className="container px-4 py-16"><div className="mx-auto max-w-3xl">{c.title && <h2 className="mb-4 font-semibold" style={titleStyle}>{c.title}</h2>}<div className="whitespace-pre-wrap leading-relaxed" style={bodyStyle}>{c.body}</div></div></SectionShell>);
  }
  if (!preview) { const mediaItems = (media || []).filter((m) => m.layer === 'front'); if (mediaItems.length) out.push(<section key="media-gallery" className="container px-4 py-16"><div className="grid gap-6 md:grid-cols-2">{mediaItems.map((m) => <MediaFrame key={m.id} item={m as any} />)}</div></section>); }
  return <>{out}</>;
}
