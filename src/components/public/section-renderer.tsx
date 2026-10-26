import { createAdminClient } from '@/lib/supabase/admin';
import { MediaFrame } from '@/components/public/media-frame';
import Link from 'next/link';
import { MapPin, Clock } from 'lucide-react';

function resolveHref(basePath: string, href?: string) { if (!href || href === '/') return basePath; if (/^https?:\/\//i.test(href)) return href; return `${basePath}${href.startsWith('/') ? href : `/${href}`}`; }
function mediaPositionClass(position: string) { if (position === 'left') return 'items-center justify-start'; if (position === 'right') return 'items-center justify-end'; if (position === 'top') return 'items-start justify-center'; if (position === 'bottom') return 'items-end justify-center'; return 'items-center justify-center'; }

function SectionMedia({ content }: { content: any }) {
  if (!content?.media_url) return null;
  const size = Math.min(100, Math.max(1, Number(content.media_size || 100)));
  const radius = Math.min(100, Math.max(0, Number(content.media_radius ?? 16)));
  const item = { id: 0, kind: content.media_kind === 'video' ? 'video' : 'image', url: content.media_url, ratio: content.ratio || '16:9', layer: content.media_layer === 'overlay' ? 'overlay' : 'front', position: content.media_position || 'center', title: content.title } as any;
  const frame = <div style={{ width: `${size}%`, borderRadius: `${radius}px`, overflow: 'hidden' }}><MediaFrame item={item} /></div>;
  return content.media_layer === 'overlay' ? <div className="absolute inset-0 flex px-4 py-8" style={{ zIndex: 0 }}><div className={`flex h-full w-full ${mediaPositionClass(content.media_position || 'center')}`}>{frame}</div></div> : <div className={`flex w-full ${mediaPositionClass(content.media_position || 'center')}`}>{frame}</div>;
}

export async function SectionRenderer({ page, churchId, basePath, preview = false }: { page: string; churchId: string; basePath: string; preview?: boolean }) {
  const supabase = createAdminClient();
  const { data: sections } = await supabase.from('site_sections').select('*').eq('church_id', churchId).eq('page', page).eq('enabled', true).order('sort_order');
  const { data: media } = await supabase.from('site_media').select('*').eq('church_id', churchId).eq('state', 'published').order('sort_order');
  const out: React.ReactNode[] = [];
  for (const s of sections || []) {
    if (preview && s.draft_deleted) continue;
    const c = (preview ? s.content : s.published) as any; if (!c) continue;
    if (s.type === 'hero') out.push(<section key={s.id} className="relative overflow-hidden py-24 md:py-36">{c.bg_image && <img src={c.bg_image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30 grayscale" />}<div className="absolute inset-0 bg-gradient-to-b from-background/60 to-background" /><div className="container relative text-center"><h1 className="text-4xl font-bold leading-tight md:text-5xl">{c.title}</h1><p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">{c.subtitle}</p>{c.cta_label && <Link href={resolveHref(basePath, c.cta_href || '/tentang')} className="mt-8 inline-block rounded-md bg-primary px-8 py-3 font-semibold text-primary-foreground">{c.cta_label}</Link>}</div></section>);
    else if (s.type === 'event_feed') { const { data: events } = await supabase.from('events').select('*').eq('church_id', churchId).in('status', ['upcoming', 'ongoing']).order('start_at').limit(c.limit || 3); out.push(<section key={s.id} className="container py-16"><h2 className="mb-8 text-3xl font-semibold">{c.title || 'Event Mendatang'}</h2><div className="grid gap-6 md:grid-cols-3">{(events || []).map((e) => { const d = new Date(e.start_at); return <article key={e.id} className="rounded-lg border bg-card p-6"><div className="mb-4 inline-flex flex-col items-center rounded-lg bg-primary/10 px-4 py-2 text-primary"><span className="text-2xl font-bold">{d.getDate()}</span><span className="text-xs uppercase">{d.toLocaleDateString('id-ID', { month: 'short' })}</span></div><h3 className="text-lg font-medium">{e.nama}</h3><p className="mt-1 text-sm text-muted-foreground">{e.deskripsi}</p><p className="mt-3 flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" /> {e.lokasi}</p></article>; })}{(events || []).length === 0 && <p className="text-muted-foreground">Belum ada event.</p>}</div></section>); }
    else if (s.type === 'info_lokasi') out.push(<section key={s.id} className="container py-16"><h2 className="mb-8 text-3xl font-semibold">{c.title || 'Info & Lokasi'}</h2><div className="grid gap-8 md:grid-cols-2"><div className="space-y-4"><p className="flex items-start gap-2"><MapPin className="mt-1 h-5 w-5 text-primary" /> {c.address}</p><p className="flex items-start gap-2"><Clock className="mt-1 h-5 w-5 text-primary" /> {c.hours}</p></div>{(c.lat || c.maps_embed) && <MediaFrame item={{ id: s.id, kind: 'map', url: c.maps_embed || '', ratio: '1:1', layer: 'front', position: 'center', lat: c.lat, lng: c.lng, title: c.title }} />}</div></section>);
    else if (s.type === 'media') out.push(<section key={s.id} className={`relative container overflow-hidden py-16 ${c.media_layer === 'overlay' ? 'min-h-[360px]' : ''}`}><div className={c.media_layer === 'overlay' ? 'absolute inset-0 bg-background/40' : ''} />{<SectionMedia content={c} />}{c.title && <div className={c.media_layer === 'overlay' ? 'relative z-10 mt-6 text-center' : 'mt-6'}><h2 className="text-3xl font-semibold">{c.title}</h2></div>}</section>);
    else if (s.type === 'map') out.push(<section key={s.id} className="container py-16"><div className="mx-auto max-w-xl"><h2 className="mb-8 text-3xl font-semibold">{c.title || 'Lokasi'}</h2><MediaFrame item={{ id: s.id, kind: 'map', url: '', ratio: c.ratio || '1:1', layer: 'front', position: 'center', lat: c.lat, lng: c.lng, title: c.title }} /><p className="mt-2 text-center text-sm text-muted-foreground">Koordinat: {c.lat}, {c.lng}</p></div></section>);
    else if (s.type === 'richtext') out.push(<section key={s.id} className="container py-16"><div className="mx-auto max-w-3xl">{c.title && <h2 className="mb-4 text-3xl font-semibold">{c.title}</h2>}<div className="whitespace-pre-wrap leading-relaxed text-muted-foreground">{c.body}</div></div></section>);
  }
  if (!preview) { const mediaItems = (media || []).filter((m) => m.layer === 'front'); if (mediaItems.length) out.push(<section key="media-gallery" className="container py-16"><div className="grid gap-6 md:grid-cols-2">{mediaItems.map((m) => <MediaFrame key={m.id} item={m as any} />)}</div></section>); }
  return <>{out}</>;
}
