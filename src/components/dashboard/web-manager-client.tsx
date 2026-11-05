/* Web Manager editor */
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import ColorPicker from 'react-best-gradient-color-picker';
import { useLang } from '@/components/lang-context';
import { Button } from '@/components/ui/button';
import { Input, Label, Select } from '@/components/ui/input';
import { Modal, Tabs, Switch } from '@/components/ui/modal';
import { Badge, Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Pencil, Trash2, Rocket, Eye, Image as ImageIcon, X, GripVertical, ChevronDown } from 'lucide-react';
import { saveNavItem, toggleNavVisibility, deleteNavItem, publishNav, saveThemeDraft, publishTheme, saveSectionDraft, publishSections, publishWebManager, deleteSection, saveWebsiteThemePreference, type ThemeInput, type WebsiteThemePreference } from '@/lib/actions/webmanager';
import { toast } from 'sonner';
import { MediaFrame } from '@/components/public/media-frame';
import { canDelete, type Role } from '@/lib/rbac';

const RATIOS = ['19:9', '16:9', '1:1', '4:3', '4:5', '2:3', '9:16', '2:9', '32:9'];
const FONTS = ['Poppins', 'Inter', 'Roboto', 'Montserrat'];
const SECTION_TYPES = ['hero', 'card_grid', 'event_feed', 'group_feed', 'info_lokasi', 'media', 'map', 'richtext'];

type SectionCardItem = { id: string; title: string; body: string; image_url: string; href: string };
const POSITIONS = ['center', 'top', 'bottom', 'left', 'right'];

type SectionMediaItem = {
  id: string;
  kind: 'image' | 'video';
  url: string;
  ratio: string;
  size: number;
  radius: number;
  position: string;
  layer: 'front' | 'overlay';
  autoplay: boolean;
  muted: boolean;
  title?: string;
};

const DEFAULT_COLORS = {
  background_color: '', text_color: '', title_color: '', subtitle_color: '', body_color: '',
  card_background_color: '', card_title_color: '', card_text_color: '', card_border_color: '',
  date_color: '', cta_color: '', cta_text_color: '', overlay_color: '', overlay_opacity: 70,
};

function pageFromHref(href: unknown) {
  const value = String(href || '').trim();
  if (!value || value.startsWith('#') || /^(https?:\/\/|mailto:|tel:)/i.test(value) || /^[a-z][a-z\d+.-]*:/i.test(value) || value.startsWith('//')) return '';
  return value.replace(/^\/+/, '').split(/[?#/]/)[0].toLowerCase();
}

function normalizeCards(content: any): SectionCardItem[] {
  return Array.isArray(content?.cards) ? content.cards.map((card: any, index: number) => ({
    id: String(card.id || `card-${index + 1}`),
    title: card.title || '',
    body: card.body || '',
    image_url: card.image_url || '',
    href: card.href || '',
  })) : [];
}

function normalizeMediaItems(content: any): SectionMediaItem[] {
  if (Array.isArray(content?.media_items)) return content.media_items.map((m: any, i: number) => ({
    id: String(m.id || `media-${i + 1}`), kind: m.kind === 'video' ? 'video' : 'image', url: m.url || '', ratio: m.ratio || '16:9',
    size: Number(m.size ?? 100), radius: Number(m.radius ?? 16), position: m.position || 'center', layer: m.layer === 'overlay' ? 'overlay' : 'front',
    autoplay: Boolean(m.autoplay), muted: m.muted === undefined ? true : Boolean(m.muted), title: m.title || '',
  }));
  if (content?.media_url) return [{ id: 'media-1', kind: content.media_kind === 'video' ? 'video' : 'image', url: content.media_url, ratio: content.ratio || '16:9', size: Number(content.media_size ?? 100), radius: Number(content.media_radius ?? 16), position: content.media_position || 'center', layer: content.media_layer === 'overlay' ? 'overlay' : 'front', autoplay: Boolean(content.media_autoplay), muted: content.media_muted === undefined ? true : Boolean(content.media_muted), title: content.title || '' }];
  return [];
}

function toRgba(value: string | undefined, fallback: string) {
  const v = String(value || fallback).trim();
  if (/^rgba?\(/i.test(v) || /^linear-gradient\(/i.test(v) || /^radial-gradient\(/i.test(v)) return v;
  if (/^#[0-9a-f]{6}$/i.test(v)) { const r = parseInt(v.slice(1, 3), 16), g = parseInt(v.slice(3, 5), 16), b = parseInt(v.slice(5, 7), 16); return `rgba(${r},${g},${b},1)`; }
  if (/^#[0-9a-f]{3}$/i.test(v)) { const r = parseInt(v[1] + v[1], 16), g = parseInt(v[2] + v[2], 16), b = parseInt(v[3] + v[3], 16); return `rgba(${r},${g},${b},1)`; }
  return fallback;
}

function ColorField({ label, value, onChange, id, hint }: { label: string; value?: string; onChange: (v: string) => void; id: string; hint?: string }) {
  const pickerValue = toRgba(value, 'rgba(255,255,255,1)');
  return <details className="rounded-xl border">
    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-3">
      <span className="min-w-0"><span className="font-medium">{label}</span>{hint && <span className="mt-0.5 block text-[11px] text-muted-foreground">{hint}</span>}</span>
      <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 [[open]>&]:rotate-180" />
    </summary>
    <div className="space-y-2 border-t p-3">
      <div className="overflow-hidden rounded-lg border bg-background p-2">
        <ColorPicker value={pickerValue} onChange={onChange} width={250} height={190} showHexAlpha idSuffix={id} />
      </div>
      <Input value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder="Kosong = gunakan warna tema" />
    </div>
  </details>;
}

export function WebManagerClient({ navItems, theme, sections, role, publicPath, websiteThemePreference }: { navItems: any[]; theme: any; media?: any[]; sections: any[]; role: Role; publicPath: string | null; websiteThemePreference: WebsiteThemePreference }) {
  const { t } = useLang();
  const router = useRouter();
  const [tab, setTab] = React.useState('nav');
  const [navModal, setNavModal] = React.useState(false);
  const [navEditing, setNavEditing] = React.useState<any>(null);
  const [themeValues, setThemeValues] = React.useState<ThemeInput>(() => theme?.draft || theme?.published || { primary_color: '#FFFFFF', secondary_color: '#1F2937', accent_color: '#22C55E', font_family: 'Inter' });
  const [page, setPage] = React.useState('home');
  const [secModal, setSecModal] = React.useState(false);
  const [secEditing, setSecEditing] = React.useState<any>(null);
  const [previewKey, setPreviewKey] = React.useState(0);
  const [defaultThemeEnabled, setDefaultThemeEnabled] = React.useState(websiteThemePreference === 'default');

  React.useEffect(() => { setDefaultThemeEnabled(websiteThemePreference === 'default'); }, [websiteThemePreference]);
  async function updateDefaultThemePreference(enabled: boolean) {
    const previous = defaultThemeEnabled;
    setDefaultThemeEnabled(enabled);
    const result = await saveWebsiteThemePreference(enabled ? 'default' : 'cms');
    if (!result.ok) {
      setDefaultThemeEnabled(previous);
      toast.error(result.error || 'Gagal menyimpan preferensi tema');
      return;
    }
    setPreviewKey((k) => k + 1);
    toast.success(enabled ? 'Default Theme aktif pada Draft gereja' : 'Tampilan Draft CMS dipulihkan');
  }

  React.useEffect(() => { setThemeValues(theme?.draft || theme?.published || { primary_color: '#FFFFFF', secondary_color: '#1F2937', accent_color: '#22C55E', font_family: 'Inter' }); }, [theme]);
  const pages = React.useMemo(() => {
    const set = new Set(['home', 'new', 'connect', 'grow', 'ministries', 'events', 'worship', 'tentang', 'kontak']);
    navItems.forEach((n) => {
      const href = pageFromHref(n.draft?.href || n.href);
      if (href) set.add(href);
    });
    sections.forEach((s) => { const draftPage = s.draft_page || s.page; if (draftPage) set.add(String(draftPage).toLowerCase()); });
    return Array.from(set);
  }, [navItems, sections]);
  const pageSections = sections.filter((s) => (s.draft_page || s.page) === page).sort((a, b) => (a.draft_sort_order ?? a.sort_order) - (b.draft_sort_order ?? b.sort_order));
  const previewPath = publicPath ? `${publicPath}${page === 'home' ? '' : `/${page}`}?preview=draft` : null;
  async function run(p: Promise<{ ok: boolean; error?: string }>, okMsg?: string) { const r = await p; if (r.ok) { toast.success(okMsg || t('save')); setPreviewKey((k) => k + 1); router.refresh(); } else toast.error(r.error || 'Gagal menyimpan'); return r; }

  return <div className="space-y-4">
    <div className="flex flex-wrap items-start justify-between gap-2"><div><h1 className="text-2xl font-bold">{t('web-manager')}</h1><p className="text-muted-foreground">Kelola header, tema, halaman, draft, dan preview website publik.</p></div><Button onClick={() => run(publishWebManager(), t('publish'))}><Rocket className="h-4 w-4" /> {t('wm-publish')}</Button></div>
    <Tabs active={tab} onChange={setTab} tabs={[{ id: 'nav', label: t('wm-header-nav') }, { id: 'theme', label: t('wm-theming') }, { id: 'sections', label: t('wm-sections') }]} />

    {tab === 'nav' && <Card><CardHeader className="flex-row items-center justify-between"><CardTitle>Header & Navigasi</CardTitle><div className="flex gap-2"><Button variant="secondary" onClick={() => run(publishNav(), t('publish'))}><Rocket className="h-4 w-4" /> Publish Menu</Button><Button onClick={() => { setNavEditing(null); setNavModal(true); }}><Plus className="h-4 w-4" /> Menu Baru</Button></div></CardHeader><CardContent className="space-y-2">{navItems.slice().sort((a, b) => a.sort_order - b.sort_order).map((n) => <div key={n.id} className="flex flex-wrap items-center gap-3 rounded-md border p-3"><div className="min-w-0 flex-1"><p className="font-medium">{n.draft?.label || n.label}</p><p className="truncate text-xs text-muted-foreground">{n.draft?.href || n.href} · order #{n.draft?.sort_order ?? n.sort_order}</p></div><Badge variant={n.state === 'draft' ? 'warning' : 'success'}>{n.state === 'draft' ? 'Draft' : 'Published'}</Badge><div className="flex items-center gap-2"><span className="text-xs text-muted-foreground">{(n.draft?.visible ?? n.visible) ? 'On' : 'Off'}</span><Switch checked={Boolean(n.draft?.visible ?? n.visible)} onCheckedChange={(v) => run(toggleNavVisibility(n.id, v))} /></div><Button variant="ghost" size="icon" onClick={() => { setNavEditing(n); setNavModal(true); }}><Pencil className="h-4 w-4" /></Button>{canDelete(role) && <Button variant="ghost" size="icon" onClick={() => confirm(t('confirmation')) && run(deleteNavItem(n.id))}><Trash2 className="h-4 w-4 text-destructive" /></Button>}</div>)}{navItems.length === 0 && <p className="text-sm text-muted-foreground">Belum ada menu.</p>}</CardContent></Card>}

    {tab === 'theme' && <Card><CardHeader><CardTitle>Tampilan & Tema</CardTitle></CardHeader><CardContent className="space-y-4"><details className="rounded-xl border"><summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4"><span><span className="font-semibold">Palette Global</span><span className="mt-1 block text-xs text-muted-foreground">Primary, Secondary, Accent, preview palette, dan font. Klik untuk membuka pengaturan.</span></span><ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground" /></summary><div className="space-y-5 border-t p-4"><div className="rounded-xl border p-4"><p className="font-semibold">Palette 60 / 30 / 10</p><p className="mt-1 text-sm text-muted-foreground"><b>Primary</b>, <b>Secondary</b>, dan <b>Accent</b> adalah palette global. Rasio 60/30/10 menjadi panduan visual, bukan pembatas. Setiap section dan elemen dapat memakai warna/gradient sendiri.</p></div><div className="grid gap-4 lg:grid-cols-3"><ColorField id="primary" label="Primary · 60%" value={themeValues.primary_color} onChange={(v) => setThemeValues((x) => ({ ...x, primary_color: v }))} hint="Default background / ruang utama" /><ColorField id="secondary" label="Secondary · 30%" value={themeValues.secondary_color} onChange={(v) => setThemeValues((x) => ({ ...x, secondary_color: v }))} hint="Default text / navigation" /><ColorField id="accent" label="Accent · 10%" value={themeValues.accent_color} onChange={(v) => setThemeValues((x) => ({ ...x, accent_color: v }))} hint="Default highlight / CTA / detail" /></div><div className="grid grid-cols-[3fr_1.5fr_0.5fr] overflow-hidden rounded-xl border"><div className="min-h-20 p-4" style={{ background: themeValues.primary_color, color: themeValues.secondary_color }}>Primary</div><div className="min-h-20 p-4" style={{ background: themeValues.secondary_color, color: themeValues.primary_color }}>Secondary</div><div className="min-h-20 p-4" style={{ background: themeValues.accent_color, color: '#fff' }}>Accent</div></div><Select value={themeValues.font_family} onChange={(e) => setThemeValues((v) => ({ ...v, font_family: e.target.value }))}>{FONTS.map((f) => <option key={f} value={f}>{f}</option>)}</Select><div className="flex flex-wrap gap-2"><Button variant="secondary" onClick={() => run(saveThemeDraft(themeValues), t('wm-draft'))}>{t('wm-draft')}</Button><Button onClick={() => run(publishTheme(), t('publish'))}><Rocket className="h-4 w-4" /> Publish Tema</Button></div></div></details>
      <div className="space-y-3 rounded-xl border p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="font-semibold">Default Theme · Tema Draft Gereja</p>
            <p className="mt-1 text-xs text-muted-foreground">Saat diaktifkan, Default Theme mengubah warna, tipografi, header, dan layout Draft gereja tanpa mengganti konten, halaman, atau media. Saat dinonaktifkan, pengaturan visual CMS sebelumnya dipakai kembali. Website publik mengikuti tema ini setelah Publish.</p>
          </div>
          <div className="flex items-center gap-2"><span className="text-xs text-muted-foreground">{defaultThemeEnabled ? 'Aktif' : 'Nonaktif'}</span><Switch checked={defaultThemeEnabled} onCheckedChange={(checked) => void updateDefaultThemePreference(checked)} /></div>
        </div>
        {defaultThemeEnabled ? <div className="space-y-2">
          <div className="flex items-center justify-between gap-2"><p className="text-sm font-medium">Preview Draft Default Theme</p><a href={previewPath || '/default-web'} target="_blank" rel="noreferrer" className="text-xs font-medium text-primary underline underline-offset-4">Buka preview Draft</a></div>
          <iframe key={`default-draft-${previewKey}`} src={previewPath || '/default-web'} title="Preview Draft Default Theme" className="h-[620px] w-full rounded-lg border bg-[#0F1117]" loading="lazy" />
        </div> : <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">Default Theme sedang nonaktif untuk akun ini. Aktifkan toggle untuk membuka preview.</div>}
      </div>
    </CardContent></Card>}

    {tab === 'sections' && <div className="grid grid-cols-1 gap-4 xl:grid-cols-2"><Card><CardHeader className="flex-row items-center justify-between"><div className="flex items-center gap-2"><CardTitle>Editor Halaman</CardTitle><Select value={page} onChange={(e) => setPage(e.target.value)} className="w-auto">{pages.map((p) => <option key={p} value={p}>{p}</option>)}</Select></div><div className="flex gap-2"><Button variant="secondary" onClick={() => run(publishSections(page), t('publish'))}><Rocket className="h-4 w-4" /></Button><Button onClick={() => { setSecEditing(null); setSecModal(true); }}><Plus className="h-4 w-4" /></Button></div></CardHeader><CardContent className="space-y-2">{pageSections.map((s) => <div key={s.id} className="flex flex-wrap items-center gap-3 rounded-md border p-3"><div className="min-w-0 flex-1"><p className="font-medium capitalize">{(s.draft_type || s.type).replace('_', ' ')}</p><p className="text-xs text-muted-foreground">order #{s.draft_sort_order ?? s.sort_order} · {s.draft_deleted ? 'deleted draft' : s.published ? 'published' : 'draft'}</p></div><Switch checked={Boolean((s.draft_enabled ?? s.enabled) && !s.draft_deleted)} onCheckedChange={(v) => run(saveSectionDraft({ id: s.id, page: s.draft_page || s.page, type: s.draft_type || s.type, sort_order: s.draft_sort_order ?? s.sort_order, content: s.content, enabled: v }))} /><Button variant="ghost" size="icon" onClick={() => { setSecEditing(s); setSecModal(true); }}><Pencil className="h-4 w-4" /></Button>{canDelete(role) && <Button variant="ghost" size="icon" onClick={() => confirm(t('confirmation')) && run(deleteSection(s.id))}><Trash2 className="h-4 w-4 text-destructive" /></Button>}</div>)}{pageSections.length === 0 && <p className="text-sm text-muted-foreground">Belum ada section.</p>}</CardContent></Card><Card className="sticky top-20 self-start"><CardHeader className="flex-row items-center justify-between"><CardTitle className="flex items-center gap-2"><Eye className="h-4 w-4" /> Preview Draft</CardTitle><Button variant="ghost" size="icon" onClick={() => setPreviewKey((k) => k + 1)}><Eye className="h-4 w-4" /></Button></CardHeader><CardContent>{previewPath ? <iframe key={`${previewPath}-${previewKey}`} src={previewPath} className="h-[620px] w-full rounded-lg border bg-white" title="Preview Draft" /> : <div className="flex h-[620px] items-center justify-center rounded-lg border text-sm text-muted-foreground">Website publik belum tersedia.</div>}<p className="mt-2 text-xs text-muted-foreground">Preview selalu membaca draft terbaru. Publish diperlukan untuk website publik.</p></CardContent></Card></div>}

    <Modal open={navModal} onClose={() => setNavModal(false)} title="Menu Header"><form className="space-y-4" onSubmit={async (e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); const r = await run(saveNavItem({ id: navEditing?.id, label: String(fd.get('label')), href: String(fd.get('href')), visible: fd.get('visible') === 'on', sort_order: Number(fd.get('sort_order') || 0) })); if (r.ok) setNavModal(false); }}><Label>Label<Input name="label" defaultValue={navEditing?.draft?.label || navEditing?.label} required /></Label><Label>URL<Input name="href" defaultValue={navEditing?.draft?.href || navEditing?.href || '/'} required /></Label><Label>Urutan<Input name="sort_order" type="number" defaultValue={navEditing?.draft?.sort_order ?? navEditing?.sort_order ?? 0} /></Label><label className="flex items-center gap-2 text-sm"><input name="visible" type="checkbox" defaultChecked={navEditing?.draft?.visible ?? navEditing?.visible ?? true} /> Tampilkan di navigasi</label><div className="flex justify-end gap-2"><Button type="button" variant="secondary" onClick={() => setNavModal(false)}>{t('cancel')}</Button><Button type="submit">{t('save')}</Button></div></form></Modal>
    <Modal open={secModal} onClose={() => setSecModal(false)} title="Edit Section" wide><SectionForm initial={secEditing} page={page} pages={pages} onCancel={() => setSecModal(false)} onSave={async (v) => { const r = await run(saveSectionDraft(v), t('wm-draft')); if (r.ok) setSecModal(false); }} /></Modal>
  </div>;
}

function SectionForm({ initial, page, pages, onSave, onCancel }: { initial: any; page: string; pages: string[]; onSave: (v: any) => void; onCancel: () => void }) {
  const c = initial?.content || {};
  const [sectionPage, setSectionPage] = React.useState(initial?.draft_page || initial?.page || page);
  const [type, setType] = React.useState(initial?.draft_type || initial?.type || 'hero');
  const [title, setTitle] = React.useState(c.title || ''); const [subtitle, setSubtitle] = React.useState(c.subtitle || ''); const [body, setBody] = React.useState(c.body || '');
  const [ctaLabel, setCtaLabel] = React.useState(c.cta_label || ''); const [ctaHref, setCtaHref] = React.useState(c.cta_href || '/tentang');
  const [mediaItems, setMediaItems] = React.useState<SectionMediaItem[]>(() => normalizeMediaItems(c)); const [bgImage, setBgImage] = React.useState(c.bg_image || '');
  const [cards, setCards] = React.useState<SectionCardItem[]>(() => normalizeCards(c));
  const [gridColumns, setGridColumns] = React.useState(String(c.grid_columns || 3));
  const [titleSize, setTitleSize] = React.useState(Number(c.title_font_size || 40)); const [subtitleSize, setSubtitleSize] = React.useState(Number(c.subtitle_font_size || 20)); const [bodySize, setBodySize] = React.useState(Number(c.body_font_size || 16)); const [ctaSize, setCtaSize] = React.useState(Number(c.cta_font_size || 16));
  const [contentWidth, setContentWidth] = React.useState(String(c.content_width || '1200'));
  const [mediaLayout, setMediaLayout] = React.useState(c.media_layout || 'stack');
  const [sortOrder, setSortOrder] = React.useState(initial?.draft_sort_order ?? initial?.sort_order ?? 0); const [enabled, setEnabled] = React.useState(initial?.draft_enabled ?? initial?.enabled ?? true); const [limit, setLimit] = React.useState(c.limit || 3);
  const [address, setAddress] = React.useState(c.address || ''); const [hours, setHours] = React.useState(c.hours || ''); const [lat, setLat] = React.useState(c.lat ?? ''); const [lng, setLng] = React.useState(c.lng ?? ''); const [mapsEmbed, setMapsEmbed] = React.useState(c.maps_embed || '');
  const [colors, setColors] = React.useState({ ...DEFAULT_COLORS, ...Object.fromEntries(Object.keys(DEFAULT_COLORS).map((k) => [k, c[k] ?? DEFAULT_COLORS[k as keyof typeof DEFAULT_COLORS]])) });
  function updateMedia(id: string, patch: Partial<SectionMediaItem>) { setMediaItems((items) => items.map((m) => m.id === id ? { ...m, ...patch } : m)); }
  function addMedia() { setMediaItems((items) => [...items, { id: `media-${Date.now()}-${items.length + 1}`, kind: 'image', url: '', ratio: '16:9', size: 100, radius: 16, position: 'center', layer: 'front', autoplay: false, muted: true, title: '' }]); }
  function removeMedia(id: string) { setMediaItems((items) => items.filter((m) => m.id !== id)); }
  function updateCard(id: string, patch: Partial<SectionCardItem>) { setCards((items) => items.map((card) => card.id === id ? { ...card, ...patch } : card)); }
  function addCard() { setCards((items) => [...items, { id: `card-${Date.now()}-${items.length + 1}`, title: '', body: '', image_url: '', href: '' }]); }
  function removeCard(id: string) { setCards((items) => items.filter((card) => card.id !== id)); }
  function setColor(key: string, value: string) { setColors((x) => ({ ...x, [key]: value })); }
  const content = { ...c, title, subtitle, body, cta_label: ctaLabel, cta_href: ctaHref, media_items: mediaItems.map(({ id, ...m }) => m), bg_image: bgImage, title_font_size: titleSize, subtitle_font_size: subtitleSize, body_font_size: bodySize, cta_font_size: ctaSize, content_width: contentWidth, media_layout: mediaLayout, grid_columns: Number(gridColumns), cards: cards.map(({ id, ...card }) => card), limit, address, hours, maps_embed: mapsEmbed, lat: lat === '' ? null : Number(lat), lng: lng === '' ? null : Number(lng), ...colors };

  return <div className="grid gap-6 md:grid-cols-2">
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3"><Label>Halaman tujuan<Select value={sectionPage} onChange={(e) => setSectionPage(e.target.value)}>{pages.map((p) => <option key={p} value={p}>{p}</option>)}</Select></Label><Label>Tipe<Select value={type} onChange={(e) => setType(e.target.value)}>{SECTION_TYPES.map((x) => <option key={x} value={x}>{x}</option>)}</Select></Label><Label>Urutan<Input type="number" value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} /></Label></div>
      {type !== 'map' && type !== 'event_feed' && <Label>Judul<Input value={title} onChange={(e) => setTitle(e.target.value)} /></Label>}
      {(type === 'hero' || type === 'card_grid') && <Label>Subtitle<Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} /></Label>}
      {type === 'hero' && <><div className="grid grid-cols-2 gap-2"><Input value={ctaLabel} onChange={(e) => setCtaLabel(e.target.value)} placeholder="CTA label" /><Input value={ctaHref} onChange={(e) => setCtaHref(e.target.value)} placeholder="/tentang" /></div><Label>Background image URL<Input value={bgImage} onChange={(e) => setBgImage(e.target.value)} /></Label></>}
      {type === 'card_grid' && <div className="space-y-3 rounded-xl border p-4"><div className="flex items-center justify-between gap-3"><p className="font-semibold">Konten kartu</p><Button type="button" size="sm" onClick={addCard}><Plus className="h-4 w-4" /> Tambah kartu</Button></div><Label>Jumlah kolom<Select value={gridColumns} onChange={(e) => setGridColumns(e.target.value)}><option value="2">2 kolom</option><option value="3">3 kolom</option><option value="4">4 kolom</option></Select></Label>{cards.length === 0 && <p className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">Belum ada kartu.</p>}{cards.map((card, index) => <div key={card.id} className="space-y-2 rounded-lg border p-3"><div className="flex items-center justify-between"><b className="text-sm">Kartu #{index + 1}</b><Button type="button" size="icon" variant="ghost" onClick={() => removeCard(card.id)}><X className="h-4 w-4 text-destructive" /></Button></div><Label>Judul<Input value={card.title} onChange={(e) => updateCard(card.id, { title: e.target.value })} /></Label><Label>Deskripsi<textarea className="min-h-20 w-full rounded-md border bg-background p-3 text-sm" value={card.body} onChange={(e) => updateCard(card.id, { body: e.target.value })} /></Label><Label>URL gambar (opsional)<Input value={card.image_url} onChange={(e) => updateCard(card.id, { image_url: e.target.value })} placeholder="https://..." /></Label><Label>Link tujuan (opsional)<Input value={card.href} onChange={(e) => updateCard(card.id, { href: e.target.value })} placeholder="/connect" /></Label></div>)}</div>}
      {type === 'richtext' && <Label>Isi<textarea className="min-h-40 w-full rounded-md border bg-background p-3 text-sm" value={body} onChange={(e) => setBody(e.target.value)} /></Label>}
      {(type === 'event_feed' || type === 'group_feed') && <Label>{type === 'event_feed' ? 'Jumlah event' : 'Jumlah komunitas'}<Input type="number" min="1" max={type === 'event_feed' ? '12' : '24'} value={limit} onChange={(e) => setLimit(Number(e.target.value))} /></Label>}
      {type === 'info_lokasi' && <><Label>Alamat<Input value={address} onChange={(e) => setAddress(e.target.value)} /></Label><Label>Jam ibadah<Input value={hours} onChange={(e) => setHours(e.target.value)} /></Label><div className="grid grid-cols-2 gap-2"><Input value={lat} onChange={(e) => setLat(e.target.value)} placeholder="Latitude" /><Input value={lng} onChange={(e) => setLng(e.target.value)} placeholder="Longitude" /></div></>}
      {type === 'map' && <><Label>Judul<Input value={title} onChange={(e) => setTitle(e.target.value)} /></Label><Label>Google Maps URL / Embed<Input value={mapsEmbed} onChange={(e) => setMapsEmbed(e.target.value)} /></Label><div className="grid grid-cols-2 gap-2"><Input value={lat} onChange={(e) => setLat(e.target.value)} placeholder="Latitude" /><Input value={lng} onChange={(e) => setLng(e.target.value)} placeholder="Longitude" /></div></>}

      <details className="rounded-xl border"><summary className="flex cursor-pointer list-none items-center justify-between gap-2 p-4"><div className="flex items-center gap-2 font-semibold"><ImageIcon className="h-4 w-4" /> Media Section <span className="text-xs font-normal text-muted-foreground">({mediaItems.length} media)</span></div><div className="flex items-center gap-2"><Button type="button" size="sm" onClick={(e) => { e.preventDefault(); addMedia(); }}><Plus className="h-4 w-4" /> Tambah Media</Button><ChevronDown className="h-4 w-4 text-muted-foreground" /></div></summary><div className="space-y-3 border-t p-4"><p className="text-xs text-muted-foreground">Setiap section dapat memiliki beberapa media. Foto dan video punya ukuran, rasio, posisi, layer, radius, autoplay, dan suara sendiri.</p>{mediaItems.length === 0 && <div className="rounded-lg border border-dashed p-5 text-center text-sm text-muted-foreground">Belum ada media. Klik “Tambah Media”.</div>}{mediaItems.map((m, index) => <details key={m.id} className="rounded-xl border bg-muted/10"><summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-3"><div className="flex min-w-0 items-center gap-2 text-sm font-medium"><GripVertical className="h-4 w-4 shrink-0 text-muted-foreground" /><span>Media #{index + 1}</span><span className="text-xs font-normal text-muted-foreground">· {m.kind === 'video' ? 'Video' : 'Foto'}{m.url ? ' · terisi' : ' · belum diisi'}</span></div><div className="flex items-center gap-2"><Button type="button" variant="ghost" size="icon" onClick={(e) => { e.preventDefault(); removeMedia(m.id); }}><X className="h-4 w-4 text-destructive" /></Button><ChevronDown className="h-4 w-4 text-muted-foreground" /></div></summary><div className="space-y-3 border-t p-3"><div className="grid grid-cols-2 gap-3"><Label>Jenis<Select value={m.kind} onChange={(e) => updateMedia(m.id, { kind: e.target.value as 'image' | 'video', autoplay: e.target.value === 'video' ? m.autoplay : false, muted: e.target.value === 'video' ? m.muted : true })}><option value="image">Foto</option><option value="video">Video</option></Select></Label><Label>Rasio<Select value={m.ratio} onChange={(e) => updateMedia(m.id, { ratio: e.target.value })}>{RATIOS.map((x) => <option key={x}>{x}</option>)}</Select></Label></div><Label>URL Media<Input value={m.url} onChange={(e) => updateMedia(m.id, { url: e.target.value })} placeholder="https://..." /></Label><div className="grid grid-cols-2 gap-3"><Label>Ukuran %<Input type="number" min="1" max="100" value={m.size} onChange={(e) => updateMedia(m.id, { size: Number(e.target.value) })} /></Label><Label>Radius px<Input type="number" min="0" max="100" value={m.radius} onChange={(e) => updateMedia(m.id, { radius: Number(e.target.value) })} /></Label></div><div className="grid grid-cols-2 gap-3"><Label>Posisi<Select value={m.position} onChange={(e) => updateMedia(m.id, { position: e.target.value })}>{POSITIONS.map((x) => <option key={x}>{x}</option>)}</Select></Label><Label>Layer<Select value={m.layer} onChange={(e) => updateMedia(m.id, { layer: e.target.value as 'front' | 'overlay' })}><option value="front">Di depan konten</option><option value="overlay">Overlay di belakang konten</option></Select></Label></div>{m.kind === 'video' && <div className="space-y-2"><label className="flex items-center gap-2 rounded-lg border p-3 text-sm"><Switch checked={m.autoplay} onCheckedChange={(v) => updateMedia(m.id, { autoplay: v })} /><span><b>Autoplay</b><span className="block text-xs text-muted-foreground">Video mencoba play otomatis.</span></span></label><label className="flex items-center gap-2 rounded-lg border p-3 text-sm"><Switch checked={m.muted} onCheckedChange={(v) => updateMedia(m.id, { muted: v })} /><span><b>Mute saat mulai</b><span className="block text-xs text-muted-foreground">Browser dapat memblokir autoplay bersuara. User tetap bisa menyalakan suara dari kontrol video.</span></span></label></div>}</div></details>)}</div></details>

      <details className="rounded-xl border"><summary className="flex cursor-pointer list-none items-center justify-between gap-2 p-4 font-semibold">Layout & Ukuran Konten<ChevronDown className="h-4 w-4 text-muted-foreground" /></summary><div className="grid gap-3 border-t p-4 sm:grid-cols-2"><Label>Lebar maksimum konten<Select value={contentWidth} onChange={(e) => setContentWidth(e.target.value)}><option value="720">720 px · Compact</option><option value="960">960 px · Medium</option><option value="1200">1200 px · Default</option><option value="1440">1440 px · Wide</option><option value="full">Full width</option></Select></Label><Label>Susunan beberapa media<Select value={mediaLayout} onChange={(e) => setMediaLayout(e.target.value)}><option value="stack">Vertikal · satu per baris</option><option value="grid-2">Grid · 2 kolom</option><option value="grid-3">Grid · 3 kolom</option></Select></Label><p className="text-xs text-muted-foreground sm:col-span-2">Pengaturan ini berlaku untuk section ini saja. Setiap media tetap bisa punya rasio, ukuran, posisi, dan radius sendiri.</p></div></details>

      <details className="rounded-xl border"><summary className="flex cursor-pointer list-none items-center justify-between gap-2 p-4 font-semibold">Warna & Tampilan Section<ChevronDown className="h-4 w-4 text-muted-foreground" /></summary><div className="grid gap-3 border-t p-4 sm:grid-cols-2"><ColorField id="section-bg" label="Background" value={colors.background_color} onChange={(v) => setColor('background_color', v)} /><ColorField id="section-text" label="Text umum" value={colors.text_color} onChange={(v) => setColor('text_color', v)} /><ColorField id="section-title" label="Judul" value={colors.title_color} onChange={(v) => setColor('title_color', v)} /><ColorField id="section-subtitle" label="Subtitle" value={colors.subtitle_color} onChange={(v) => setColor('subtitle_color', v)} /><ColorField id="section-body" label="Body" value={colors.body_color} onChange={(v) => setColor('body_color', v)} /><ColorField id="section-cta" label="CTA background" value={colors.cta_color} onChange={(v) => setColor('cta_color', v)} /><ColorField id="section-cta-text" label="CTA text" value={colors.cta_text_color} onChange={(v) => setColor('cta_text_color', v)} /><ColorField id="section-card-bg" label="Card background" value={colors.card_background_color} onChange={(v) => setColor('card_background_color', v)} /><ColorField id="section-card-title" label="Card title" value={colors.card_title_color} onChange={(v) => setColor('card_title_color', v)} /><ColorField id="section-card-text" label="Card text" value={colors.card_text_color} onChange={(v) => setColor('card_text_color', v)} /><ColorField id="section-card-border" label="Card border" value={colors.card_border_color} onChange={(v) => setColor('card_border_color', v)} /><ColorField id="section-date" label="Date / badge" value={colors.date_color} onChange={(v) => setColor('date_color', v)} /><ColorField id="section-overlay" label="Overlay media" value={colors.overlay_color} onChange={(v) => setColor('overlay_color', v)} /><Label>Opacity Overlay %<Input type="number" min="0" max="100" value={colors.overlay_opacity} onChange={(e) => setColors((x) => ({ ...x, overlay_opacity: Number(e.target.value) }))} /></Label></div></details>

      <details className="rounded-xl border"><summary className="flex cursor-pointer list-none items-center justify-between gap-2 p-4 font-semibold">Tipografi<ChevronDown className="h-4 w-4 text-muted-foreground" /></summary><div className="grid grid-cols-2 gap-3 border-t p-4"><Label>Ukuran Judul px<Input type="number" min="12" max="96" value={titleSize} onChange={(e) => setTitleSize(Number(e.target.value))} /></Label><Label>Ukuran Subtitle px<Input type="number" min="10" max="48" value={subtitleSize} onChange={(e) => setSubtitleSize(Number(e.target.value))} /></Label><Label>Ukuran Isi px<Input type="number" min="10" max="36" value={bodySize} onChange={(e) => setBodySize(Number(e.target.value))} /></Label><Label>Ukuran CTA px<Input type="number" min="10" max="32" value={ctaSize} onChange={(e) => setCtaSize(Number(e.target.value))} /></Label></div></details>
      <div className="flex items-center justify-between rounded-lg border p-3"><span className="text-sm">Section aktif</span><Switch checked={enabled} onCheckedChange={setEnabled} /></div><div className="flex justify-end gap-2"><Button type="button" variant="secondary" onClick={onCancel}>Batal</Button><Button type="button" onClick={() => onSave({ id: initial?.id, page: sectionPage, type, sort_order: sortOrder, content, enabled })}>Simpan Draft</Button></div>
    </div>
    <div className="rounded-xl border bg-muted/20 p-4"><p className="mb-3 text-sm font-semibold">Preview Media</p>{mediaItems.filter((m) => m.url).length ? <div className="space-y-4">{mediaItems.filter((m) => m.url).map((m) => <MediaFrame key={m.id} item={{ id: m.id, kind: m.kind, url: m.url, ratio: m.ratio, layer: m.layer, position: m.position, title: m.title, autoplay: m.autoplay, muted: m.muted } as any} />)}</div> : <div className="flex aspect-video items-center justify-center rounded-lg border text-sm text-muted-foreground">Tambahkan URL media untuk preview</div>}<p className="mt-3 text-xs text-muted-foreground">Media melekat pada section yang sedang diedit, bukan gallery global.</p></div>
  </div>;
}
