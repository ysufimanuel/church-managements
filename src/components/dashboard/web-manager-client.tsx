/* Web Manager editor */
'use client';

import * as React from 'react';
import { useLang } from '@/components/lang-context';
import { Button } from '@/components/ui/button';
import { Input, Label, Select } from '@/components/ui/input';
import { Modal, Tabs, Switch } from '@/components/ui/modal';
import { Badge, Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Pencil, Trash2, Rocket, Eye, Image as ImageIcon } from 'lucide-react';
import { saveNavItem, toggleNavVisibility, deleteNavItem, publishNav, saveThemeDraft, publishTheme, saveSectionDraft, publishSections, publishWebManager, deleteSection, type ThemeInput } from '@/lib/actions/webmanager';
import { toast } from 'sonner';
import { MediaFrame } from '@/components/public/media-frame';
import { canDelete, type Role } from '@/lib/rbac';

const RATIOS = ['19:9', '16:9', '1:1', '4:3', '4:5', '2:3', '9:16', '2:9', '32:9'];
const FONTS = ['Poppins', 'Inter', 'Roboto', 'Montserrat'];
const SECTION_TYPES = ['hero', 'event_feed', 'info_lokasi', 'media', 'map', 'richtext'];
const POSITIONS = ['center', 'top', 'bottom', 'left', 'right'];

export function WebManagerClient({ navItems, theme, sections, role, publicPath }: { navItems: any[]; theme: any; media?: any[]; sections: any[]; role: Role; publicPath: string | null }) {
  const { t } = useLang();
  const [tab, setTab] = React.useState('nav');
  const [navModal, setNavModal] = React.useState(false);
  const [navEditing, setNavEditing] = React.useState<any>(null);
  const [themeValues, setThemeValues] = React.useState<ThemeInput>(() => theme?.draft || theme?.published || { primary_color: '#FFFFFF', secondary_color: '#1F2937', accent_color: '#22C55E', font_family: 'Inter' });
  const [page, setPage] = React.useState('home');
  const [secModal, setSecModal] = React.useState(false);
  const [secEditing, setSecEditing] = React.useState<any>(null);
  const [previewKey, setPreviewKey] = React.useState(0);

  React.useEffect(() => {
    setThemeValues(theme?.draft || theme?.published || { primary_color: '#FFFFFF', secondary_color: '#1F2937', accent_color: '#22C55E', font_family: 'Inter' });
  }, [theme]);

  const pages = React.useMemo(() => {
    const set = new Set(['home', 'events', 'tentang', 'kontak']);
    navItems.forEach((n) => { const href = String(n.draft?.href || n.href || '').replace(/^\//, '').split('/')[0]; if (href) set.add(href); });
    sections.forEach((s) => s.page && set.add(s.page));
    return Array.from(set);
  }, [navItems, sections]);
  const pageSections = sections.filter((s) => s.page === page).sort((a, b) => a.sort_order - b.sort_order);
  const previewPath = publicPath ? `${publicPath}${page === 'home' ? '' : `/${page}`}?preview=draft` : null;

  async function run(p: Promise<{ ok: boolean; error?: string }>, okMsg?: string) {
    const r = await p;
    if (r.ok) { toast.success(okMsg || t('save')); setPreviewKey((k) => k + 1); }
    else toast.error(r.error || 'Gagal menyimpan');
    return r;
  }

  return <div className="space-y-4">
    <div className="flex flex-wrap items-start justify-between gap-2">
      <div><h1 className="text-2xl font-bold">{t('web-manager')}</h1><p className="text-muted-foreground">Kelola header, tema, halaman, draft, dan preview website publik.</p></div>
      <Button onClick={() => run(publishWebManager(), t('publish'))}><Rocket className="h-4 w-4" /> {t('wm-publish')}</Button>
    </div>
    <Tabs active={tab} onChange={setTab} tabs={[{ id: 'nav', label: t('wm-header-nav') }, { id: 'theme', label: t('wm-theming') }, { id: 'sections', label: t('wm-sections') }]} />

    {tab === 'nav' && <Card><CardHeader className="flex-row items-center justify-between"><CardTitle>Header & Navigasi</CardTitle><div className="flex gap-2"><Button variant="secondary" onClick={() => run(publishNav(), t('publish'))}><Rocket className="h-4 w-4" /> Publish Menu</Button><Button onClick={() => { setNavEditing(null); setNavModal(true); }}><Plus className="h-4 w-4" /> Menu Baru</Button></div></CardHeader><CardContent className="space-y-2">{navItems.slice().sort((a, b) => a.sort_order - b.sort_order).map((n) => <div key={n.id} className="flex flex-wrap items-center gap-3 rounded-md border p-3"><div className="min-w-0 flex-1"><p className="font-medium">{n.draft?.label || n.label}</p><p className="truncate text-xs text-muted-foreground">{n.draft?.href || n.href} · order #{n.draft?.sort_order ?? n.sort_order}</p></div><Badge variant={n.state === 'draft' ? 'warning' : 'success'}>{n.state === 'draft' ? 'Draft' : 'Published'}</Badge><div className="flex items-center gap-2"><span className="text-xs text-muted-foreground">{(n.draft?.visible ?? n.visible) ? 'On' : 'Off'}</span><Switch checked={Boolean(n.draft?.visible ?? n.visible)} onCheckedChange={(v) => run(toggleNavVisibility(n.id, v))} /></div><Button variant="ghost" size="icon" onClick={() => { setNavEditing(n); setNavModal(true); }}><Pencil className="h-4 w-4" /></Button>{canDelete(role) && <Button variant="ghost" size="icon" onClick={() => confirm(t('confirmation')) && run(deleteNavItem(n.id))}><Trash2 className="h-4 w-4 text-destructive" /></Button>}</div>)}{navItems.length === 0 && <p className="text-sm text-muted-foreground">Belum ada menu.</p>}</CardContent></Card>}

    {tab === 'theme' && <Card><CardHeader><CardTitle>Tampilan & Tema</CardTitle></CardHeader><CardContent className="space-y-5"><p className="text-sm text-muted-foreground">Aturan warna website: <b>60% Primary</b> untuk latar utama, <b>30% Secondary</b> untuk teks artikel dan navigasi, <b>10% Accent</b> khusus CTA utama seperti “Mulai Uji Coba Gratis”.</p><div className="grid gap-4 md:grid-cols-3">{(['primary_color', 'secondary_color', 'accent_color'] as const).map((key) => <div key={key} className="space-y-2"><Label>{key === 'primary_color' ? 'Primary · 60%' : key === 'secondary_color' ? 'Secondary · 30%' : 'Accent · 10%'}</Label><div className="flex gap-2"><input type="color" value={themeValues[key]} onChange={(e) => setThemeValues((v) => ({ ...v, [key]: e.target.value }))} className="h-10 w-12 cursor-pointer rounded border" /><Input value={themeValues[key]} onChange={(e) => setThemeValues((v) => ({ ...v, [key]: e.target.value }))} /></div></div>)}</div><div className="grid grid-cols-[3fr_1.5fr_0.5fr] overflow-hidden rounded-xl border"><div className="min-h-20 p-4" style={{ background: themeValues.primary_color, color: themeValues.secondary_color }}>60% Primary</div><div className="min-h-20 p-4" style={{ background: themeValues.secondary_color, color: themeValues.primary_color }}>30% Secondary</div><div className="min-h-20 p-4" style={{ background: themeValues.accent_color, color: '#fff' }}>10%</div></div><Select value={themeValues.font_family} onChange={(e) => setThemeValues((v) => ({ ...v, font_family: e.target.value }))}>{FONTS.map((f) => <option key={f} value={f}>{f}</option>)}</Select><div className="flex flex-wrap gap-2"><Button variant="secondary" onClick={() => run(saveThemeDraft(themeValues), t('wm-draft'))}>{t('wm-draft')}</Button><Button onClick={() => run(publishTheme(), t('publish'))}><Rocket className="h-4 w-4" /> Publish Tema</Button></div></CardContent></Card>}

    {tab === 'sections' && <div className="grid grid-cols-1 gap-4 xl:grid-cols-2"><Card><CardHeader className="flex-row items-center justify-between"><div className="flex items-center gap-2"><CardTitle>Editor Halaman</CardTitle><Select value={page} onChange={(e) => setPage(e.target.value)} className="w-auto">{pages.map((p) => <option key={p} value={p}>{p}</option>)}</Select></div><div className="flex gap-2"><Button variant="secondary" onClick={() => run(publishSections(page), t('publish'))}><Rocket className="h-4 w-4" /></Button><Button onClick={() => { setSecEditing(null); setSecModal(true); }}><Plus className="h-4 w-4" /></Button></div></CardHeader><CardContent className="space-y-2">{pageSections.map((s) => <div key={s.id} className="flex flex-wrap items-center gap-3 rounded-md border p-3"><div className="min-w-0 flex-1"><p className="font-medium capitalize">{s.type.replace('_', ' ')}</p><p className="text-xs text-muted-foreground">order #{s.sort_order} · {s.draft_deleted ? 'deleted draft' : s.published ? 'published' : 'draft'}</p></div><Switch checked={s.enabled && !s.draft_deleted} onCheckedChange={(v) => run(saveSectionDraft({ id: s.id, page: s.page, type: s.type, sort_order: s.sort_order, content: s.content, enabled: v }))} /><Button variant="ghost" size="icon" onClick={() => { setSecEditing(s); setSecModal(true); }}><Pencil className="h-4 w-4" /></Button>{canDelete(role) && <Button variant="ghost" size="icon" onClick={() => confirm(t('confirmation')) && run(deleteSection(s.id))}><Trash2 className="h-4 w-4 text-destructive" /></Button>}</div>)}{pageSections.length === 0 && <p className="text-sm text-muted-foreground">Belum ada section.</p>}</CardContent></Card><Card className="sticky top-20 self-start"><CardHeader className="flex-row items-center justify-between"><CardTitle className="flex items-center gap-2"><Eye className="h-4 w-4" /> Preview Draft</CardTitle><Button variant="ghost" size="icon" onClick={() => setPreviewKey((k) => k + 1)}><Eye className="h-4 w-4" /></Button></CardHeader><CardContent>{previewPath ? <iframe key={`${previewPath}-${previewKey}`} src={previewPath} className="h-[620px] w-full rounded-lg border bg-white" title="Preview Draft" /> : <div className="flex h-[620px] items-center justify-center rounded-lg border text-sm text-muted-foreground">Website publik belum tersedia.</div>}<p className="mt-2 text-xs text-muted-foreground">Preview selalu membaca draft terbaru. Publish diperlukan untuk website publik.</p></CardContent></Card></div>}

    <Modal open={navModal} onClose={() => setNavModal(false)} title="Menu Header"><form className="space-y-4" onSubmit={async (e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); const r = await run(saveNavItem({ id: navEditing?.id, label: String(fd.get('label')), href: String(fd.get('href')), visible: fd.get('visible') === 'on', sort_order: Number(fd.get('sort_order') || 0) })); if (r.ok) setNavModal(false); }}><Label>Label<Input name="label" defaultValue={navEditing?.draft?.label || navEditing?.label} required /></Label><Label>URL<Input name="href" defaultValue={navEditing?.draft?.href || navEditing?.href || '/'} required /></Label><Label>Urutan<Input name="sort_order" type="number" defaultValue={navEditing?.draft?.sort_order ?? navEditing?.sort_order ?? 0} /></Label><label className="flex items-center gap-2 text-sm"><input name="visible" type="checkbox" defaultChecked={navEditing?.draft?.visible ?? navEditing?.visible ?? true} /> Tampilkan di navigasi</label><div className="flex justify-end gap-2"><Button type="button" variant="secondary" onClick={() => setNavModal(false)}>{t('cancel')}</Button><Button type="submit">{t('save')}</Button></div></form></Modal>
    <Modal open={secModal} onClose={() => setSecModal(false)} title="Edit Section" wide><SectionForm initial={secEditing} page={page} onCancel={() => setSecModal(false)} onSave={async (v) => { const r = await run(saveSectionDraft(v), t('wm-draft')); if (r.ok) setSecModal(false); }} /></Modal>
  </div>;
}

function SectionForm({ initial, page, onSave, onCancel }: { initial: any; page: string; onSave: (v: any) => void; onCancel: () => void }) {
  const c = initial?.content || {};
  const [type, setType] = React.useState(initial?.type || 'hero');
  const [title, setTitle] = React.useState(c.title || '');
  const [subtitle, setSubtitle] = React.useState(c.subtitle || '');
  const [body, setBody] = React.useState(c.body || '');
  const [ctaLabel, setCtaLabel] = React.useState(c.cta_label || '');
  const [ctaHref, setCtaHref] = React.useState(c.cta_href || '/tentang');
  const [mediaKind, setMediaKind] = React.useState(c.media_kind || 'image');
  const [mediaUrl, setMediaUrl] = React.useState(c.media_url || '');
  const [ratio, setRatio] = React.useState(c.ratio || '16:9');
  const [mediaSize, setMediaSize] = React.useState(Number(c.media_size || 100));
  const [mediaRadius, setMediaRadius] = React.useState(Number(c.media_radius ?? 16));
  const [mediaPosition, setMediaPosition] = React.useState(c.media_position || 'center');
  const [mediaLayer, setMediaLayer] = React.useState(c.media_layer || 'front');
  const [bgImage, setBgImage] = React.useState(c.bg_image || '');
  const [titleSize, setTitleSize] = React.useState(Number(c.title_font_size || 40));
  const [subtitleSize, setSubtitleSize] = React.useState(Number(c.subtitle_font_size || 20));
  const [bodySize, setBodySize] = React.useState(Number(c.body_font_size || 16));
  const [ctaSize, setCtaSize] = React.useState(Number(c.cta_font_size || 16));
  const [sortOrder, setSortOrder] = React.useState(initial?.sort_order ?? 0);
  const [enabled, setEnabled] = React.useState(initial?.enabled ?? true);
  const [limit, setLimit] = React.useState(c.limit || 3);
  const [address, setAddress] = React.useState(c.address || '');
  const [hours, setHours] = React.useState(c.hours || '');
  const [lat, setLat] = React.useState(c.lat ?? '');
  const [lng, setLng] = React.useState(c.lng ?? '');
  const [mapsEmbed, setMapsEmbed] = React.useState(c.maps_embed || '');

  const content = {
    ...c, title, subtitle, body, cta_label: ctaLabel, cta_href: ctaHref,
    media_kind: mediaKind, media_url: mediaUrl, ratio, media_size: mediaSize,
    media_radius: mediaRadius, media_position: mediaPosition, media_layer: mediaLayer,
    bg_image: bgImage, title_font_size: titleSize, subtitle_font_size: subtitleSize,
    body_font_size: bodySize, cta_font_size: ctaSize, limit, address, hours,
    maps_embed: mapsEmbed, lat: lat === '' ? null : Number(lat), lng: lng === '' ? null : Number(lng),
  };

  return <div className="grid gap-6 md:grid-cols-2">
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3"><Label>Tipe<Select value={type} onChange={(e) => setType(e.target.value)}>{SECTION_TYPES.map((x) => <option key={x} value={x}>{x}</option>)}</Select></Label><Label>Urutan<Input type="number" value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} /></Label></div>
      {type !== 'map' && type !== 'event_feed' && <Label>Judul<Input value={title} onChange={(e) => setTitle(e.target.value)} /></Label>}
      {type === 'hero' && <><Label>Subtitle<Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} /></Label><div className="grid grid-cols-2 gap-2"><Input value={ctaLabel} onChange={(e) => setCtaLabel(e.target.value)} placeholder="CTA label" /><Input value={ctaHref} onChange={(e) => setCtaHref(e.target.value)} placeholder="/tentang" /></div><Label>Background image URL<Input value={bgImage} onChange={(e) => setBgImage(e.target.value)} /></Label></>}
      {type === 'richtext' && <Label>Isi<textarea className="min-h-40 w-full rounded-md border bg-background p-3 text-sm" value={body} onChange={(e) => setBody(e.target.value)} /></Label>}
      {type === 'event_feed' && <Label>Jumlah event<Input type="number" min="1" max="12" value={limit} onChange={(e) => setLimit(Number(e.target.value))} /></Label>}
      {type === 'info_lokasi' && <><Label>Alamat<Input value={address} onChange={(e) => setAddress(e.target.value)} /></Label><Label>Jam ibadah<Input value={hours} onChange={(e) => setHours(e.target.value)} /></Label><div className="grid grid-cols-2 gap-2"><Input value={lat} onChange={(e) => setLat(e.target.value)} placeholder="Latitude" /><Input value={lng} onChange={(e) => setLng(e.target.value)} placeholder="Longitude" /></div></>}
      {type === 'map' && <><Label>Judul<Input value={title} onChange={(e) => setTitle(e.target.value)} /></Label><Label>Google Maps URL / Embed<Input value={mapsEmbed} onChange={(e) => setMapsEmbed(e.target.value)} /></Label><div className="grid grid-cols-2 gap-2"><Input value={lat} onChange={(e) => setLat(e.target.value)} placeholder="Latitude" /><Input value={lng} onChange={(e) => setLng(e.target.value)} placeholder="Longitude" /></div></>}

      <div className="rounded-xl border p-4 space-y-4"><div className="flex items-center gap-2 font-semibold"><ImageIcon className="h-4 w-4" /> Media Section <span className="text-xs font-normal text-muted-foreground">(tersedia di semua tipe section)</span></div><div className="grid grid-cols-2 gap-3"><Label>Jenis<Select value={mediaKind} onChange={(e) => setMediaKind(e.target.value)}><option value="image">Foto</option><option value="video">Video</option></Select></Label><Label>Rasio<Select value={ratio} onChange={(e) => setRatio(e.target.value)}>{RATIOS.map((x) => <option key={x}>{x}</option>)}</Select></Label></div><Label>URL Media<Input value={mediaUrl} onChange={(e) => setMediaUrl(e.target.value)} placeholder="https://..." /></Label><div className="grid grid-cols-2 gap-3"><Label>Ukuran %<Input type="number" min="1" max="100" value={mediaSize} onChange={(e) => setMediaSize(Number(e.target.value))} /></Label><Label>Radius px<Input type="number" min="0" max="100" value={mediaRadius} onChange={(e) => setMediaRadius(Number(e.target.value))} /></Label></div><div className="grid grid-cols-2 gap-3"><Label>Posisi<Select value={mediaPosition} onChange={(e) => setMediaPosition(e.target.value)}>{POSITIONS.map((x) => <option key={x}>{x}</option>)}</Select></Label><Label>Layer<Select value={mediaLayer} onChange={(e) => setMediaLayer(e.target.value)}><option value="front">Di depan konten</option><option value="overlay">Overlay di belakang konten</option></Select></Label></div></div>

      <div className="rounded-xl border p-4 space-y-4"><p className="font-semibold">Tipografi</p><div className="grid grid-cols-2 gap-3"><Label>Ukuran Judul px<Input type="number" min="12" max="96" value={titleSize} onChange={(e) => setTitleSize(Number(e.target.value))} /></Label><Label>Ukuran Subtitle px<Input type="number" min="10" max="48" value={subtitleSize} onChange={(e) => setSubtitleSize(Number(e.target.value))} /></Label><Label>Ukuran Isi px<Input type="number" min="10" max="36" value={bodySize} onChange={(e) => setBodySize(Number(e.target.value))} /></Label><Label>Ukuran CTA px<Input type="number" min="10" max="32" value={ctaSize} onChange={(e) => setCtaSize(Number(e.target.value))} /></Label></div></div>

      <div className="flex items-center justify-between rounded-lg border p-3"><span className="text-sm">Section aktif</span><Switch checked={enabled} onCheckedChange={setEnabled} /></div>
      <div className="flex justify-end gap-2"><Button type="button" variant="secondary" onClick={onCancel}>{'Batal'}</Button><Button type="button" onClick={() => onSave({ id: initial?.id, page, type, sort_order: sortOrder, content, enabled })}>{'Simpan Draft'}</Button></div>
    </div>
    <div className="rounded-xl border bg-muted/20 p-4"><p className="mb-3 text-sm font-semibold">Preview Media</p>{mediaUrl ? <MediaFrame item={{ id: 0, kind: mediaKind, url: mediaUrl, ratio, layer: mediaLayer, position: mediaPosition, title } as any} /> : <div className="flex aspect-video items-center justify-center rounded-lg border text-sm text-muted-foreground">Masukkan URL media untuk preview</div>}<p className="mt-3 text-xs text-muted-foreground">Media ini melekat pada section yang sedang diedit, bukan gallery global.</p></div>
  </div>;
}
