'use client';

import * as React from 'react';
import { useLang } from '@/components/lang-context';
import { Button } from '@/components/ui/button';
import { Input, Label, Select } from '@/components/ui/input';
import { Modal, Tabs, Switch } from '@/components/ui/modal';
import { Badge, Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Pencil, Trash2, Rocket, Eye } from 'lucide-react';
import { saveNavItem, toggleNavVisibility, deleteNavItem, saveThemeDraft, publishTheme, saveMedia, deleteMedia, saveSectionDraft, publishSections, deleteSection, type MediaInput } from '@/lib/actions/webmanager';
import { toast } from 'sonner';
import { MediaFrame } from '@/components/public/media-frame';
import { canDelete, type Role } from '@/lib/rbac';

const RATIOS = ['16:9', '19:9', '1:1', '4:3', '4:5', '2:3', '9:16', '2:9', '32:91'];
const FONTS = ['Poppins', 'Inter', 'Roboto', 'Montserrat'];
const SECTION_TYPES = ['hero', 'event_feed', 'info_lokasi', 'media', 'map', 'richtext'];

export function WebManagerClient({ navItems, theme, media, sections, role, publicPath }: {
  navItems: any[]; theme: any; media: any[]; sections: any[]; role: Role; publicPath: string | null;
}) {
  const { t } = useLang();
  const [tab, setTab] = React.useState('nav');
  const [navModal, setNavModal] = React.useState(false);
  const [navEditing, setNavEditing] = React.useState<any>(null);
  const [color, setColor] = React.useState(theme?.primary_color || '#00E5FF');
  const [font, setFont] = React.useState(theme?.font_family || 'Inter');
  const [mediaModal, setMediaModal] = React.useState(false);
  const [mediaEditing, setMediaEditing] = React.useState<any>(null);
  const [page, setPage] = React.useState('home');
  const [secModal, setSecModal] = React.useState(false);
  const [secEditing, setSecEditing] = React.useState<any>(null);
  const [previewKey, setPreviewKey] = React.useState(0);

  const pageSections = sections.filter((s) => s.page === page).sort((a, b) => a.sort_order - b.sort_order);
  const previewPath = publicPath ? `${publicPath}${page === 'home' ? '' : `/${page}`}?preview=draft` : null;

  async function run(p: Promise<{ ok: boolean; error?: string }>, okMsg?: string) {
    const r = await p;
    if (r.ok) { toast.success(okMsg || t('save')); setPreviewKey((k) => k + 1); }
    else toast.error(r.error);
    return r;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div><h1 className="text-2xl font-bold">{t('web-manager')}</h1><p className="text-muted-foreground">Kelola konten situs publik tanpa menyentuh kode</p></div>
        <Button onClick={async () => { await run(publishTheme(), t('publish')); await run(publishSections(page), t('publish')); }}><Rocket className="h-4 w-4" /> {t('wm-publish')}</Button>
      </div>

      <Tabs active={tab} onChange={setTab} tabs={[{ id: 'nav', label: t('wm-header-nav') }, { id: 'theme', label: t('wm-theming') }, { id: 'sections', label: t('wm-sections') }]} />

      {tab === 'nav' && <Card><CardHeader className="flex-row items-center justify-between"><CardTitle>Daftar Menu Header</CardTitle><Button onClick={() => { setNavEditing(null); setNavModal(true); }}><Plus className="h-4 w-4" /> Menu</Button></CardHeader><CardContent className="space-y-2">{navItems.sort((a, b) => a.sort_order - b.sort_order).map((n) => <div key={n.id} className="flex flex-wrap items-center gap-3 rounded-md border p-3"><span className="font-medium flex-1">{n.label}</span><span className="text-sm text-muted-foreground">{n.href}</span><span className="text-xs text-muted-foreground">#{n.sort_order}</span><div className="flex items-center gap-2"><span className="text-xs text-muted-foreground">{n.visible ? 'Visible' : 'Hidden'}</span><Switch checked={n.visible} onCheckedChange={(v) => run(toggleNavVisibility(n.id, v))} /></div><Button variant="ghost" size="icon" onClick={() => { setNavEditing(n); setNavModal(true); }} aria-label="Edit"><Pencil className="h-4 w-4" /></Button>{canDelete(role) && <Button variant="ghost" size="icon" aria-label="Hapus" onClick={() => confirm(t('confirmation')) && run(deleteNavItem(n.id))}><Trash2 className="h-4 w-4 text-destructive" /></Button>}</div>)}</CardContent></Card>}

      {tab === 'theme' && <div className="grid grid-cols-1 gap-4 lg:grid-cols-2"><Card><CardHeader><CardTitle>Tema</CardTitle></CardHeader><CardContent className="space-y-4"><div className="space-y-2"><Label>Primary Color</Label><div className="flex items-center gap-3"><input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-10 w-16 cursor-pointer rounded border" /><Input value={color} onChange={(e) => setColor(e.target.value)} className="w-32" /><div className="h-10 flex-1 rounded-md" style={{ background: color }} /></div></div><div className="space-y-2"><Label>Font</Label><Select value={font} onChange={(e) => setFont(e.target.value)}>{FONTS.map((f) => <option key={f} value={f}>{f}</option>)}</Select><p className="rounded-md border p-3" style={{ fontFamily: font }}>The quick brown fox — Jemaat yang bertumbuh 123</p></div><div className="flex gap-2"><Button variant="secondary" onClick={() => run(saveThemeDraft({ primary_color: color, font_family: font }), t('wm-draft'))}>{t('wm-draft')}</Button><Badge variant={theme?.state === 'published' ? 'success' : 'warning'} className="self-center">{theme?.state || 'draft'}</Badge></div></CardContent></Card><Card><CardHeader className="flex-row items-center justify-between"><CardTitle>Media Link Manager</CardTitle><Button onClick={() => { setMediaEditing(null); setMediaModal(true); }}><Plus className="h-4 w-4" /> {t('wm-add-media')}</Button></CardHeader><CardContent className="space-y-3">{media.map((m) => <div key={m.id} className="space-y-2 rounded-md border p-3"><div className="flex items-center justify-between text-sm"><span className="font-medium">{m.title || m.kind} <Badge variant="secondary">{m.kind}</Badge> <Badge variant="outline">{m.ratio}</Badge></span><div className="flex gap-1"><Button variant="ghost" size="icon" onClick={() => { setMediaEditing(m); setMediaModal(true); }} aria-label="Edit"><Pencil className="h-4 w-4" /></Button>{canDelete(role) && <Button variant="ghost" size="icon" aria-label="Hapus" onClick={() => confirm(t('confirmation')) && run(deleteMedia(m.id))}><Trash2 className="h-4 w-4 text-destructive" /></Button>}</div></div><MediaFrame item={m} /><p className="truncate text-xs text-muted-foreground">{m.url}</p></div>)}{media.length === 0 && <p className="text-sm text-muted-foreground">{t('none')}</p>}</CardContent></Card></div>}

      {tab === 'sections' && <div className="grid grid-cols-1 gap-4 xl:grid-cols-2"><Card><CardHeader className="flex-row items-center justify-between"><div className="flex items-center gap-2"><CardTitle>Sections</CardTitle><Select value={page} onChange={(e) => setPage(e.target.value)} className="w-auto"><option value="home">Home</option><option value="events">Events</option><option value="tentang">About Us</option><option value="kontak">Contact</option></Select></div><div className="flex gap-2"><Button variant="secondary" onClick={() => run(publishSections(page), t('publish'))}><Rocket className="h-4 w-4" /> {t('wm-publish')}</Button><Button onClick={() => { setSecEditing(null); setSecModal(true); }}><Plus className="h-4 w-4" /></Button></div></CardHeader><CardContent className="space-y-2">{pageSections.map((s) => <div key={s.id} className="flex flex-wrap items-center gap-3 rounded-md border p-3"><div className="flex-1"><p className="font-medium capitalize">{s.type.replace('_', ' ')}</p><p className="text-xs text-muted-foreground">order #{s.sort_order} · {s.published ? 'published' : 'draft'}</p></div><Switch checked={s.enabled} onCheckedChange={(v) => run(saveSectionDraft({ id: s.id, page: s.page, type: s.type, sort_order: s.sort_order, content: s.content, enabled: v }))} /><Button variant="ghost" size="icon" onClick={() => { setSecEditing(s); setSecModal(true); }} aria-label="Edit"><Pencil className="h-4 w-4" /></Button>{canDelete(role) && <Button variant="ghost" size="icon" aria-label="Hapus" onClick={() => confirm(t('confirmation')) && run(deleteSection(s.id))}><Trash2 className="h-4 w-4 text-destructive" /></Button>}</div>)}{pageSections.length === 0 && <p className="text-sm text-muted-foreground">{t('none')}</p>}</CardContent></Card>

        <Card className="sticky top-20 self-start"><CardHeader className="flex-row items-center justify-between"><CardTitle className="flex items-center gap-2"><Eye className="h-4 w-4" /> {t('wm-preview')}</CardTitle><Button variant="ghost" size="icon" onClick={() => setPreviewKey((k) => k + 1)} aria-label="Refresh"><Eye className="h-4 w-4" /></Button></CardHeader><CardContent>{previewPath ? <iframe key={`${previewPath}-${previewKey}`} src={previewPath} className="h-[560px] w-full rounded-lg border bg-white" title="Live Preview" /> : <div className="flex h-[560px] items-center justify-center rounded-lg border text-sm text-muted-foreground">Website publik belum tersedia untuk gereja ini.</div>}<p className="mt-2 text-xs text-muted-foreground">Preview menampilkan <strong>draft terbaru</strong>. Perubahan belum tampil ke publik sampai tombol Publish ditekan.</p></CardContent></Card></div>}

      <Modal open={navModal} onClose={() => setNavModal(false)} title="Menu Header"><form className="space-y-4" onSubmit={async (e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); const r = await run(saveNavItem({ id: navEditing?.id, label: String(fd.get('label')), href: String(fd.get('href')), visible: true, sort_order: Number(fd.get('sort_order') || 0) })); if (r.ok) setNavModal(false); }}><div className="space-y-2"><Label>Custom Label</Label><Input name="label" defaultValue={navEditing?.label} required placeholder='mis. "Jadwal Kegiatan"' /></div><div className="space-y-2"><Label>URL</Label><Input name="href" defaultValue={navEditing?.href || '/'} required /></div><div className="space-y-2"><Label>Urutan</Label><Input name="sort_order" type="number" defaultValue={navEditing?.sort_order || 0} /></div><div className="flex justify-end gap-2"><Button type="button" variant="secondary" onClick={() => setNavModal(false)}>{t('cancel')}</Button><Button type="submit">{t('save')}</Button></div></form></Modal>
      <Modal open={mediaModal} onClose={() => setMediaModal(false)} title={t('wm-add-media')} wide><MediaForm initial={mediaEditing} onCancel={() => setMediaModal(false)} onSave={async (v) => { const r = await run(saveMedia(v)); if (r.ok) setMediaModal(false); }} /></Modal>
      <Modal open={secModal} onClose={() => setSecModal(false)} title="Section" wide><SectionForm initial={secEditing} page={page} onCancel={() => setSecModal(false)} onSave={async (v) => { const r = await run(saveSectionDraft(v), t('wm-draft')); if (r.ok) setSecModal(false); }} /></Modal>
    </div>
  );
}

function MediaForm({ initial, onSave, onCancel }: { initial: any; onSave: (v: MediaInput) => void; onCancel: () => void }) {
  const { t } = useLang();
  const [kind, setKind] = React.useState(initial?.kind || 'image');
  const [url, setUrl] = React.useState(initial?.url || '');
  const [ratio, setRatio] = React.useState(initial?.ratio || '16:9');
  const [layer, setLayer] = React.useState(initial?.layer || 'front');
  const [position, setPosition] = React.useState(initial?.position || 'center');
  const [lat, setLat] = React.useState(initial?.lat ?? '');
  const [lng, setLng] = React.useState(initial?.lng ?? '');
  const [title, setTitle] = React.useState(initial?.title || '');
  const preview = { id: 0, kind, url, ratio: kind === 'map' ? '1:1' : ratio, layer, position, title, lat: lat === '' ? null : Number(lat), lng: lng === '' ? null : Number(lng) };
  return <div className="grid grid-cols-1 gap-4 md:grid-cols-2"><div className="space-y-3"><div className="space-y-2"><Label>Tipe Media</Label><Select value={kind} onChange={(e) => setKind(e.target.value as any)}><option value="image">Gambar (Drive / Cloudinary / Unsplash)</option><option value="video">Video (YouTube / Vimeo)</option><option value="map">Map (Google Maps / Koordinat)</option></Select></div><div className="space-y-2"><Label>URL</Label><Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." /></div>{kind === 'map' && <div className="grid grid-cols-2 gap-2"><div className="space-y-2"><Label>Latitude</Label><Input value={lat} onChange={(e) => setLat(e.target.value)} placeholder="-6.1754" /></div><div className="space-y-2"><Label>Longitude</Label><Input value={lng} onChange={(e) => setLng(e.target.value)} placeholder="106.8272" /></div></div>}{kind !== 'map' && <div className="space-y-2"><Label>Rasio</Label><Select value={ratio} onChange={(e) => setRatio(e.target.value)}>{RATIOS.map((r) => <option key={r} value={r}>{r}</option>)}</Select></div>}<div className="grid grid-cols-2 gap-2"><div className="space-y-2"><Label>Layer</Label><Select value={layer} onChange={(e) => setLayer(e.target.value as any)}><option value="front">Depan (front)</option><option value="overlay">Belakang (overlay)</option></Select></div><div className="space-y-2"><Label>Posisi</Label><Select value={position} onChange={(e) => setPosition(e.target.value)}>{['center', 'top', 'bottom', 'left', 'right'].map((p) => <option key={p} value={p}>{p}</option>)}</Select></div></div><div className="space-y-2"><Label>{t('title')}</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} /></div><div className="flex gap-2"><Button type="button" variant="secondary" onClick={onCancel}>{t('cancel')}</Button><Button type="button" onClick={() => onSave({ id: initial?.id, kind, url, ratio: kind === 'map' ? '1:1' : ratio, layer, position, title, lat: preview.lat, lng: preview.lng })}>{t('save')}</Button></div></div><div><Label>Auto-Preview</Label><div className="mt-2">{url || kind === 'map' ? <MediaFrame item={preview} /> : <p className="text-sm text-muted-foreground">Masukkan URL untuk pratinjau</p>}</div></div></div>;
}

function SectionForm({ initial, page, onSave, onCancel }: { initial: any; page: string; onSave: (v: any) => void; onCancel: () => void }) {
  const { t } = useLang();
  const [type, setType] = React.useState(initial?.type || 'hero');
  const c = initial?.content || {};
  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); const fd = new FormData(e.currentTarget); let content: Record<string, any> = {};
    if (type === 'hero') content = { title: fd.get('title'), subtitle: fd.get('subtitle'), cta_label: fd.get('cta_label'), cta_href: fd.get('cta_href'), bg_image: fd.get('bg_image') };
    else if (type === 'event_feed') content = { title: fd.get('title'), limit: Number(fd.get('limit') || 3) };
    else if (type === 'info_lokasi') content = { title: fd.get('title'), address: fd.get('address'), hours: fd.get('hours'), maps_embed: fd.get('maps_embed'), lat: Number(fd.get('lat') || 0), lng: Number(fd.get('lng') || 0) };
    else if (type === 'media') content = { media_url: fd.get('media_url'), ratio: fd.get('ratio') || '16:9', title: fd.get('title') };
    else if (type === 'map') content = { lat: Number(fd.get('lat') || 0), lng: Number(fd.get('lng') || 0), title: fd.get('title') };
    else content = { title: fd.get('title'), body: fd.get('body') };
    onSave({ id: initial?.id, page: initial?.page || page, type, sort_order: Number(fd.get('sort_order') || 0), content, enabled: initial?.enabled ?? true });
  }
  return <form onSubmit={submit} className="space-y-4"><div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label>Tipe Section</Label><Select value={type} onChange={(e) => setType(e.target.value)}><option value="hero">Hero Banner</option><option value="event_feed">Event Feed (otomatis upcoming/ongoing)</option><option value="info_lokasi">Info & Lokasi</option><option value="media">Media</option><option value="map">Map 1:1 + Koordinat</option><option value="richtext">Rich Text</option></Select></div><div className="space-y-2"><Label>Urutan</Label><Input name="sort_order" type="number" defaultValue={initial?.sort_order || 0} /></div></div><div className="space-y-2"><Label>{t('title')}</Label><Input name="title" defaultValue={c.title || ''} /></div>{type === 'hero' && <><div className="space-y-2"><Label>Sub-judul</Label><Input name="subtitle" defaultValue={c.subtitle || ''} /></div><div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label>Label Tombol CTA</Label><Input name="cta_label" defaultValue={c.cta_label || 'Learn More'} /></div><div className="space-y-2"><Label>Link CTA</Label><Input name="cta_href" defaultValue={c.cta_href || '/tentang'} /></div></div><div className="space-y-2"><Label>URL Gambar Latar</Label><Input name="bg_image" defaultValue={c.bg_image || ''} /></div></>}{type === 'event_feed' && <div className="space-y-2"><Label>Jumlah event ditampilkan</Label><Input name="limit" type="number" defaultValue={c.limit || 3} /></div>}{type === 'info_lokasi' && <><div className="space-y-2"><Label>{t('address')}</Label><Input name="address" defaultValue={c.address || ''} /></div><div className="space-y-2"><Label>Jam Operasional</Label><Input name="hours" defaultValue={c.hours || ''} /></div><div className="space-y-2"><Label>Google Maps Embed URL</Label><Input name="maps_embed" defaultValue={c.maps_embed || ''} /></div><div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label>Latitude</Label><Input name="lat" defaultValue={c.lat ?? ''} /></div><div className="space-y-2"><Label>Longitude</Label><Input name="lng" defaultValue={c.lng ?? ''} /></div></div></>}{type === 'media' && <><div className="space-y-2"><Label>URL Media</Label><Input name="media_url" defaultValue={c.media_url || ''} /></div><div className="space-y-2"><Label>Rasio</Label><Select name="ratio" defaultValue={c.ratio || '16:9'}>{RATIOS.map((r) => <option key={r} value={r}>{r}</option>)}</Select></div></>}{type === 'map' && <div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label>Latitude</Label><Input name="lat" defaultValue={c.lat ?? ''} required /></div><div className="space-y-2"><Label>Longitude</Label><Input name="lng" defaultValue={c.lng ?? ''} required /></div></div>}{type === 'richtext' && <div className="space-y-2"><Label>{t('content')}</Label><textarea name="body" rows={5} defaultValue={c.body || ''} className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm" /></div>}<div className="flex justify-end gap-2"><Button type="button" variant="secondary" onClick={onCancel}>{t('cancel')}</Button><Button type="submit">{t('wm-draft')}</Button></div></form>;
}
