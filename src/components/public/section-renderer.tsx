import type { ReactNode } from 'react';
import { createAdminClient } from '@/lib/supabase/admin';
import { MediaFrame } from '@/components/public/media-frame';
import Link from 'next/link';
import { MapPin, Clock } from 'lucide-react';

type SectionMedia = { id: string | number; kind: 'image' | 'video'; url: string; ratio: string; size: number; radius: number; position: string; layer: 'front' | 'overlay'; autoplay?: boolean; muted?: boolean; title?: string; resource_type?: 'event' | 'group'; resource_id?: number | null };

function resolveHref(basePath: string, href?: string) {
  if (!href || href === '/' || href === '#home') return basePath;
  if (/^(https?:\/\/|mailto:|tel:)/i.test(href)) return href;
  if (/^[a-z][a-z\d+.-]*:/i.test(href) || href.startsWith('//')) return basePath;
  if (href.startsWith('#')) return `${basePath}${href}`;
  const route = href;
  return `${basePath}${route.startsWith('/') ? route : `/${route}`}`;
}
function mediaPositionClass(position: string) { if (position === 'left') return 'items-center justify-start'; if (position === 'right') return 'items-center justify-end'; if (position === 'top') return 'items-start justify-center'; if (position === 'bottom') return 'items-end justify-center'; return 'items-center justify-center'; }
function px(value: unknown, fallback: number, min: number, max: number) { return Math.min(max, Math.max(min, Number(value ?? fallback))); }
function normalizeMediaItems(content: any): SectionMedia[] {
  if (Array.isArray(content?.media_items)) return content.media_items.map((m: any, i: number) => ({ id: m.id || `media-${i}`, kind: m.kind === 'video' ? 'video' : 'image', url: m.url || '', ratio: m.ratio || '16:9', size: px(m.size, 100, 1, 100), radius: px(m.radius, 16, 0, 100), position: m.position || 'center', layer: m.layer === 'overlay' ? 'overlay' : 'front', autoplay: Boolean(m.autoplay), muted: m.muted === undefined ? true : Boolean(m.muted), title: m.title || '', resource_type: m.resource_type === 'event' || m.resource_type === 'group' ? m.resource_type : undefined, resource_id: Number.isSafeInteger(Number(m.resource_id)) && Number(m.resource_id) > 0 ? Number(m.resource_id) : null })).filter((m: SectionMedia) => m.url);
  if (content?.media_url) return [{ id: 'legacy-media', kind: content.media_kind === 'video' ? 'video' : 'image', url: content.media_url, ratio: content.ratio || '16:9', size: px(content.media_size, 100, 1, 100), radius: px(content.media_radius, 16, 0, 100), position: content.media_position || 'center', layer: content.media_layer === 'overlay' ? 'overlay' : 'front', autoplay: Boolean(content.media_autoplay), muted: content.media_muted === undefined ? true : Boolean(content.media_muted), title: content.title || '' }];
  return [];
}
function SectionMedia({ content }: { content: any }) {
  const items = normalizeMediaItems(content);
  const sectionItems = items.filter((m) => !m.resource_type);
  const front = sectionItems.filter((m) => m.layer === 'front');
  const overlay = sectionItems.filter((m) => m.layer === 'overlay');
  if (!sectionItems.length) return null;
  const layout = content.media_layout || 'stack';
  const gridClass = layout === 'grid-3' ? 'grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3' : layout === 'grid-2' ? 'grid grid-cols-1 gap-5 sm:grid-cols-2' : 'flex flex-col gap-5';
  const width = content.content_width === 'full' ? '100%' : `${px(content.content_width, 1200, 320, 1800)}px`;
  const frame = (m: SectionMedia) => <div key={m.id} style={{ width: layout === 'stack' ? `${m.size}%` : '100%', borderRadius: `${m.radius}px`, overflow: 'hidden' }}><MediaFrame item={{ id: m.id, kind: m.kind, url: m.url, ratio: m.ratio, layer: m.layer, position: m.position, autoplay: m.autoplay, muted: m.muted, title: m.title }} /></div>;
  return <>
    {overlay.length > 0 && <div className="pointer-events-none absolute inset-0 z-0 flex flex-col gap-3 px-4 py-8">{overlay.map((m) => <div key={m.id} className={`flex min-h-0 flex-1 ${mediaPositionClass(m.position)}`}>{frame(m)}</div>)}</div>}
    {front.length > 0 && <div className={`relative z-10 mx-auto w-full px-4 ${gridClass}`} style={{ maxWidth: width }}>{front.map(frame)}</div>}
  </>;
}
function ResourceMedia({ items }: { items: SectionMedia[] }) {
  if (!items.length) return null;
  return <div className={items.length > 1 ? "mt-4 grid grid-cols-2 gap-2" : "mt-4"}>{items.map((item) => <div key={item.id} className="overflow-hidden rounded-lg" style={{ borderRadius: `${item.radius}px` }}><MediaFrame item={{ id: item.id, kind: item.kind, url: item.url, ratio: item.ratio, layer: 'front', position: item.position, autoplay: item.autoplay, muted: item.muted, title: item.title }} /></div>)}</div>;
}
function resourceMediaFor(content: any, type: 'event' | 'group', id: number) {
  return normalizeMediaItems(content).filter((item) => item.resource_type === type && item.resource_id === id);
}

function SectionShell({ content, children, className = '' }: { content: any; children: ReactNode; className?: string }) {
  const overlayItems = normalizeMediaItems(content).some((m) => m.layer === 'overlay');
  const overlayColor = content.overlay_color || 'var(--site-primary)';
  const overlayOpacity = px(content.overlay_opacity, 70, 0, 100) / 100;
  const contentWidth = content.content_width === 'full' ? '100%' : `${px(content.content_width, 1200, 320, 1800)}px`;
  const anchorId = typeof content.anchor_id === 'string' ? content.anchor_id.trim().replace(/[^a-zA-Z0-9_-]/g, '') : '';
  return <section id={anchorId || undefined} className={`relative overflow-hidden ${className}`}><SectionMedia content={content} />{overlayItems && <div className="pointer-events-none absolute inset-0 z-[1]" style={{ background: overlayColor, opacity: overlayOpacity }} />}<div className="relative z-10 mx-auto w-full" style={{ maxWidth: contentWidth }}>{children}</div></section>;
}

export async function SectionRenderer({ page, churchId, basePath, preview = false, themePreset = 'cms' }: { page: string; churchId: string; basePath: string; preview?: boolean; themePreset?: 'cms' | 'default' }) {
  const useDefaultTheme = themePreset === 'default';
  const supabase = createAdminClient();
  const { data: allSections } = await supabase.from('site_sections').select('*').eq('church_id', churchId);
  const sections = (allSections || [])
    .filter((section) => (preview
      ? (section.draft_page || section.page) === page && (section.draft_enabled ?? section.enabled)
      : section.page === page && section.enabled))
    .sort((a, b) => preview
      ? (a.draft_sort_order ?? a.sort_order) - (b.draft_sort_order ?? b.sort_order)
      : a.sort_order - b.sort_order);
  const out: ReactNode[] = [];
  for (const s of sections || []) {
    if (preview && s.draft_deleted) continue;
    const c = (preview ? s.content : s.published) as any; if (!c) continue;
    const sectionType = preview ? (s.draft_type || s.type) : s.type;
    const titleStyle = { fontSize: `${px(c.title_font_size, 32, 12, 96)}px`, color: useDefaultTheme ? '#FFFFFF' : (c.title_color || 'var(--site-secondary)') };
    const subtitleStyle = { fontSize: `${px(c.subtitle_font_size, 18, 10, 48)}px`, color: useDefaultTheme ? '#CBD5E1' : (c.subtitle_color || c.text_color || 'var(--site-secondary)') };
    const bodyStyle = { fontSize: `${px(c.body_font_size, 16, 10, 36)}px`, color: useDefaultTheme ? '#A0AEC0' : (c.body_color || c.text_color || 'var(--site-secondary)') };
    const ctaStyle = { fontSize: `${px(c.cta_font_size, 16, 10, 32)}px`, background: useDefaultTheme ? '#00E5FF' : (c.cta_color || 'var(--site-accent)'), color: useDefaultTheme ? '#0F1117' : (c.cta_text_color || '#fff') };
    const sectionStyle = useDefaultTheme ? { background: 'transparent', color: '#FFFFFF' } : { background: c.background_color || undefined, color: c.text_color || undefined };
    if (sectionType === 'hero') out.push(<SectionShell key={s.id} content={c} className={useDefaultTheme ? "flex min-h-[560px] items-end py-0 md:min-h-[640px]" : "min-h-[520px] py-24 md:py-36"}>{useDefaultTheme && !c.bg_image && <div className="absolute inset-0 bg-photo-placeholder" aria-hidden="true" />}{c.bg_image && <img src={c.bg_image} alt="" className={useDefaultTheme ? "absolute inset-0 z-0 h-full w-full object-cover grayscale contrast-110" : "absolute inset-0 z-0 h-full w-full object-cover opacity-15"} />}{useDefaultTheme && <div className="absolute inset-0 bg-scrim" aria-hidden="true" />}<div className={useDefaultTheme ? "gutter relative z-10 flex w-full flex-col gap-8 pb-10 pt-24 md:gap-12 md:pb-14 md:pt-[120px]" : "container relative z-10 px-4 text-center"} style={sectionStyle}><div className={useDefaultTheme ? "flex max-w-[640px] flex-col gap-6" : ""}><h1 className={`font-bold leading-tight ${useDefaultTheme ? "max-w-[640px] text-h1" : ""}`} style={titleStyle}>{c.title}</h1>{c.subtitle && <p className={useDefaultTheme ? "max-w-[520px] text-body" : "mx-auto mt-4 max-w-2xl"} style={subtitleStyle}>{c.subtitle}</p>}{c.cta_label && <Link href={resolveHref(basePath, c.cta_href || '/tentang')} className={useDefaultTheme ? "inline-flex min-h-11 items-center self-start rounded-badge px-5 py-3 font-semibold shadow-sm transition-transform duration-press active:scale-95" : "mt-8 inline-block rounded-lg px-8 py-3 font-semibold shadow-sm"} style={ctaStyle}>{c.cta_label}</Link>}</div></div></SectionShell>);
    else if (sectionType === 'card_grid') {
      const cards = Array.isArray(c.cards) ? c.cards : [];
      const columns = Number(c.grid_columns || 3);
      const gridClass = columns >= 4 ? 'grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : columns === 2 ? 'grid grid-cols-1 gap-5 sm:grid-cols-2' : 'grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3';
      out.push(<SectionShell key={s.id} content={c} className={useDefaultTheme ? "w-full px-4 py-20 md:px-8" : "w-full px-4 py-16"}><div style={sectionStyle}>{(c.title || c.subtitle) && <div className="mb-10 max-w-2xl"><h2 className="font-semibold" style={titleStyle}>{c.title}</h2>{c.subtitle && <p className="mt-3" style={subtitleStyle}>{c.subtitle}</p>}</div>}<div className={gridClass}>{cards.map((card: any, index: number) => <article key={card.id || index} className="overflow-hidden rounded-2xl border" style={{ background: useDefaultTheme ? '#1A1D24' : (c.card_background_color || 'var(--site-primary)'), color: useDefaultTheme ? '#CBD5E1' : (c.card_text_color || 'var(--site-secondary)'), borderColor: useDefaultTheme ? '#2D3748' : (c.card_border_color || 'var(--site-secondary)') }}><div>{card.image_url && <img src={card.image_url} alt={card.title || ''} loading="lazy" className="aspect-video w-full object-cover" />}</div><div className="space-y-3 p-5 md:p-6">{card.title && <h3 className="font-semibold" style={{ color: useDefaultTheme ? '#FFFFFF' : (c.card_title_color || c.title_color || 'var(--site-secondary)'), fontSize: '20px' }}>{card.title}</h3>}{card.body && <p className="leading-relaxed" style={bodyStyle}>{card.body}</p>}{card.href && <Link href={resolveHref(basePath, card.href)} className="inline-flex min-h-10 items-center font-semibold" style={{ color: useDefaultTheme ? '#00E5FF' : 'var(--site-accent)' }}>Selengkapnya <span aria-hidden="true" className="ml-2">→</span></Link>}</div></article>)}</div></div></SectionShell>);
    }
    else if (sectionType === 'event_feed') {
      const { data: events } = await supabase.from('events').select('*').eq('church_id', churchId).in('status', ['upcoming', 'ongoing']).order('start_at').limit(px(c.limit, 3, 1, 12));
      out.push(<SectionShell key={s.id} content={c} className={useDefaultTheme ? "w-full px-4 py-20 md:px-8" : "w-full px-4 py-16"}><div style={sectionStyle}><h2 className="mb-8 font-semibold" style={titleStyle}>{c.title || 'Event Mendatang'}</h2><div className="grid gap-6 md:grid-cols-3">{(events || []).map((e) => { const d = new Date(e.start_at); const linkedMedia = resourceMediaFor(c, 'event', Number(e.id)); return <article key={e.id} className={useDefaultTheme ? "overflow-hidden rounded-card border border-line bg-surface shadow-lg" : "overflow-hidden rounded-xl border"} style={{ background: useDefaultTheme ? "#1A1D24" : (c.card_background_color || 'var(--site-primary)'), color: useDefaultTheme ? '#CBD5E1' : (c.card_text_color || c.body_color || 'var(--site-secondary)'), borderColor: useDefaultTheme ? '#2D3748' : (c.card_border_color || undefined) }}>{linkedMedia.length ? <ResourceMedia items={linkedMedia} /> : e.image_url && <img src={e.image_url} alt={e.nama} loading="lazy" className="aspect-video w-full object-cover" />}<div className="p-6"><div className="mb-4 inline-flex flex-col items-center rounded-lg px-4 py-2" style={{ border: `1px solid ${c.date_color || c.card_text_color || 'var(--site-secondary)'}`, color: useDefaultTheme ? '#00E5FF' : (c.date_color || c.card_text_color || 'var(--site-secondary)') }}><span className="text-2xl font-bold">{d.getDate()}</span><span className="text-xs uppercase">{d.toLocaleDateString('id-ID', { month: 'short' })}</span></div><h3 className="font-medium" style={{ fontSize: `${px(c.body_font_size, 18, 10, 36)}px`, color: useDefaultTheme ? '#FFFFFF' : (c.card_title_color || c.card_text_color || 'var(--site-secondary)') }}>{e.nama}</h3><p className="mt-1" style={bodyStyle}>{e.deskripsi}</p><p className="mt-3 flex items-center gap-1" style={{ fontSize: `${Math.max(12, px(c.body_font_size, 16, 10, 36) - 2)}px` }}><MapPin className="h-3 w-3" /> {e.lokasi}</p></div></article>; })}{(events || []).length === 0 && <p style={bodyStyle}>Belum ada event.</p>}</div></div></SectionShell>);
    }
    else if (sectionType === 'group_feed') {
      const { data: groups } = await supabase.from('groups').select('id,nama,deskripsi,jadwal').eq('church_id', churchId).order('nama').limit(px(c.limit, 6, 1, 24));
      out.push(<SectionShell key={s.id} content={c} className={useDefaultTheme ? "w-full px-4 py-20 md:px-8" : "w-full px-4 py-16"}><div style={sectionStyle}><div className="mb-8 max-w-2xl"><h2 className="font-semibold" style={titleStyle}>{c.title || 'Komunitas & Kelompok'}</h2>{c.subtitle && <p className="mt-3" style={subtitleStyle}>{c.subtitle}</p>}</div><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{(groups || []).map((group) => { const linkedMedia = resourceMediaFor(c, 'group', Number(group.id)); return <article key={group.id} className={useDefaultTheme ? "overflow-hidden rounded-card border border-line bg-surface" : "rounded-2xl border p-6"} style={{ background: useDefaultTheme ? '#1A1D24' : (c.card_background_color || 'var(--site-primary)'), color: useDefaultTheme ? '#CBD5E1' : (c.card_text_color || 'var(--site-secondary)'), borderColor: useDefaultTheme ? '#2D3748' : (c.card_border_color || undefined) }}>{linkedMedia.length > 0 && <ResourceMedia items={linkedMedia} />}<div className={useDefaultTheme ? "space-y-2 p-6" : ""}><h3 className="text-lg font-semibold" style={{ color: useDefaultTheme ? '#FFFFFF' : (c.card_title_color || c.title_color || 'var(--site-secondary)') }}>{group.nama}</h3>{group.deskripsi && <p className="mt-2 leading-relaxed" style={bodyStyle}>{group.deskripsi}</p>}{group.jadwal && <p className="mt-4 text-sm" style={{ color: useDefaultTheme ? '#00E5FF' : 'var(--site-accent)' }}>{group.jadwal}</p>}</div></article>; })}</div>{(groups || []).length === 0 && <p style={bodyStyle}>Belum ada komunitas yang tersedia.</p>}</div></SectionShell>);
    }
    else if (sectionType === 'info_lokasi') out.push(<SectionShell key={s.id} content={c} className={useDefaultTheme ? "w-full px-4 py-20 md:px-8" : "w-full px-4 py-16"}><div style={sectionStyle}><h2 className="mb-8 font-semibold" style={titleStyle}>{c.title || 'Info & Lokasi'}</h2><div className="grid gap-8 md:grid-cols-2"><div className="space-y-4"><p className="flex items-start gap-2" style={bodyStyle}><MapPin className="mt-1 h-5 w-5" /> {c.address}</p><p className="flex items-start gap-2" style={bodyStyle}><Clock className="mt-1 h-5 w-5" /> {c.hours}</p></div>{(c.lat || c.maps_embed) && <MediaFrame item={{ id: s.id, kind: 'map', url: c.maps_embed || '', ratio: '1:1', layer: 'front', position: 'center', lat: c.lat, lng: c.lng, title: c.title }} />}</div></div></SectionShell>);
    else if (sectionType === 'media') { const hasOverlay = normalizeMediaItems(c).some((m) => m.layer === 'overlay'); out.push(<SectionShell key={s.id} content={c} className={`${useDefaultTheme ? "w-full px-4 py-20 md:px-8" : "w-full px-4 py-16"} ${hasOverlay ? 'min-h-[360px]' : ''}`}><div style={sectionStyle}>{c.title && <div className="mt-6 text-center"><h2 className="font-semibold" style={titleStyle}>{c.title}</h2></div>}</div></SectionShell>); }
    else if (sectionType === 'map') out.push(<SectionShell key={s.id} content={c} className={useDefaultTheme ? "w-full px-4 py-20 md:px-8" : "w-full px-4 py-16"}><div className="mx-auto max-w-xl" style={sectionStyle}><h2 className="mb-8 text-center font-semibold" style={titleStyle}>{c.title || 'Lokasi'}</h2><MediaFrame item={{ id: s.id, kind: 'map', url: '', ratio: c.ratio || '1:1', layer: 'front', position: 'center', lat: c.lat, lng: c.lng, title: c.title }} /><p className="mt-2 text-center" style={bodyStyle}>Koordinat: {c.lat}, {c.lng}</p></div></SectionShell>);
    else if (sectionType === 'richtext') out.push(<SectionShell key={s.id} content={c} className={useDefaultTheme ? "w-full px-4 py-20 md:px-8" : "w-full px-4 py-16"}><div className="mx-auto w-full" style={sectionStyle}>{c.title && <h2 className="mb-4 font-semibold" style={titleStyle}>{c.title}</h2>}<div className="whitespace-pre-wrap leading-relaxed" style={bodyStyle}>{c.body}</div></div></SectionShell>);
  }
  // Page media is rendered only by media sections assigned to this page.
  return <div className={useDefaultTheme ? "default-theme-content" : undefined} data-page={page}>{out}</div>;
}
