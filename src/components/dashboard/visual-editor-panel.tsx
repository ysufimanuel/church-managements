'use client';

import * as React from 'react';
import { ArrowDown, ArrowUp, ChevronDown, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input, Select, Textarea } from '@/components/ui/input';
import { normalizeMediaUrl, cn } from '@/lib/utils';
import { RATIO_OPTIONS, TITLE_SIZES, WIDTH_OPTIONS, newId, type SectionTypeId } from './visual-editor-config';
import { useLang, tr } from '@/components/lang-context';

export type PageOption = { slug: string; label: string };
type Patch = (patch: Record<string, any>) => void;

/* ───────────── bagian kecil yang dipakai berulang ───────────── */

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium">{label}</span>
      {children}
      {hint && <span className="block text-xs text-muted-foreground">{hint}</span>}
    </label>
  );
}

function Group({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  return (
    <details open={defaultOpen} className="group rounded-xl border">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-4 py-3 text-sm font-semibold [&::-webkit-details-marker]:hidden">
        {title}
        <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-180" />
      </summary>
      <div className="space-y-4 border-t p-4">{children}</div>
    </details>
  );
}

function ImageField({ label, value, onChange, hint }: { label: string; value: string; onChange: (v: string) => void; hint?: string }) {
  const preview = value ? normalizeMediaUrl(value, 'image') : '';
  return (
    <div className="space-y-2">
      <Field label={label} hint={hint || tr('Tempel link foto. Link Google Drive otomatis disesuaikan.')}>
        <Input
          value={value}
          placeholder="https://..."
          onChange={(e) => onChange(e.target.value)}
          onBlur={(e) => {
            const normalized = normalizeMediaUrl(e.target.value, 'image');
            if (normalized && normalized !== e.target.value) onChange(normalized);
          }}
        />
      </Field>
      {preview && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={preview} alt="" className="h-24 w-full rounded-lg border object-cover" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
      )}
    </div>
  );
}

function LinkField({ label, value, onChange, pages }: { label: string; value: string; onChange: (v: string) => void; pages: PageOption[] }) {
  const options = pages.map((p) => ({ value: p.slug === 'home' ? '/' : `/${p.slug}`, label: p.label }));
  const known = options.some((o) => o.value === value);
  const [custom, setCustom] = React.useState(Boolean(value) && !known);
  return (
    <div className="space-y-2">
      <Field label={label}>
        <Select
          value={custom ? '__custom' : value || ''}
          onChange={(e) => {
            const v = e.target.value;
            if (v === '__custom') { setCustom(true); return; }
            setCustom(false);
            onChange(v);
          }}
        >
          <option value="">{tr('Tidak ada link')}</option>
          {options.map((o) => <option key={o.value} value={o.value}>{tr('Halaman')} {tr(o.label)}</option>)}
          <option value="__custom">{tr('Alamat web lain…')}</option>
        </Select>
      </Field>
      {custom && <Input value={value} placeholder="https://..." onChange={(e) => onChange(e.target.value)} />}
    </div>
  );
}

function ColorField({ label, value, onChange, palette }: { label: string; value?: string; onChange: (v: string) => void; palette: string[] }) {
  const hex = /^#[0-9a-f]{6}$/i.test(value || '') ? String(value) : null;
  return (
    <div className="space-y-1.5">
      <span className="text-sm font-medium">{label}</span>
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="color"
          aria-label={label}
          value={hex || '#ffffff'}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-12 cursor-pointer rounded-md border bg-transparent p-0.5"
        />
        {palette.map((c) => (
          <button
            key={c}
            type="button"
            aria-label={`Pakai warna ${c}`}
            onClick={() => onChange(c)}
            className={cn('h-7 w-7 rounded-full border-2', value?.toLowerCase() === c.toLowerCase() ? 'border-primary' : 'border-border')}
            style={{ background: c }}
          />
        ))}
        {value && <button type="button" onClick={() => onChange('')} className="text-xs font-medium text-primary underline underline-offset-4">{tr('Kembalikan ke warna tema')}</button>}
      </div>
      <p className="text-xs text-muted-foreground">{!value ? 'Mengikuti warna tema website.' : hex ? hex.toUpperCase() : tr('Warna khusus (gradasi) dari editor lanjutan.')}</p>
    </div>
  );
}

function Segmented<T extends string | number>({ value, options, onChange }: { value: T; options: { label: string; value: T }[]; onChange: (v: T) => void }) {
  return (
    <div className="flex flex-wrap gap-1 rounded-lg bg-secondary/60 p-1">
      {options.map((o) => (
        <button
          key={String(o.value)}
          type="button"
          onClick={() => onChange(o.value)}
          className={cn('min-h-9 flex-1 rounded-md px-3 text-sm font-medium transition-colors', o.value === value ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary')}
        >
          {tr(o.label)}
        </button>
      ))}
    </div>
  );
}

function move<T>(list: T[], index: number, delta: number) {
  const target = index + delta;
  if (target < 0 || target >= list.length) return list;
  const next = list.slice();
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

/* ───────────── daftar kartu & daftar media ───────────── */

function CardsEditor({ content, patch, pages }: { content: any; patch: Patch; pages: PageOption[] }) {
  const cards: any[] = Array.isArray(content.cards) ? content.cards : [];
  const update = (index: number, p: Record<string, any>) => patch({ cards: cards.map((c, i) => (i === index ? { ...c, ...p } : c)) });
  return (
    <div className="space-y-3">
      <Field label={tr('Jumlah kartu per baris')}>
        <Segmented value={String(content.grid_columns || 3)} onChange={(v) => patch({ grid_columns: Number(v) })} options={[{ label: '2', value: '2' }, { label: '3', value: '3' }, { label: '4', value: '4' }]} />
      </Field>
      {cards.length === 0 && <p className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">{tr('Belum ada kartu. Klik “Tambah kartu”.')}</p>}
      {cards.map((card, index) => (
        <div key={card.id || index} className="space-y-3 rounded-xl border bg-muted/10 p-3">
          <div className="flex items-center justify-between gap-2">
            <b className="text-sm">Kartu {index + 1}</b>
            <div className="flex items-center">
              <Button type="button" variant="ghost" size="icon" aria-label={tr('Geser ke atas')} disabled={index === 0} onClick={() => patch({ cards: move(cards, index, -1) })}><ArrowUp className="h-4 w-4" /></Button>
              <Button type="button" variant="ghost" size="icon" aria-label={tr('Geser ke bawah')} disabled={index === cards.length - 1} onClick={() => patch({ cards: move(cards, index, 1) })}><ArrowDown className="h-4 w-4" /></Button>
              <Button type="button" variant="ghost" size="icon" aria-label={tr('Hapus kartu')} onClick={() => patch({ cards: cards.filter((_, i) => i !== index) })}><X className="h-4 w-4 text-destructive" /></Button>
            </div>
          </div>
          <Field label={tr('Judul')}><Input value={card.title || ''} onChange={(e) => update(index, { title: e.target.value })} /></Field>
          <Field label="Penjelasan"><Textarea rows={3} value={card.body || ''} onChange={(e) => update(index, { body: e.target.value })} /></Field>
          <ImageField label={tr('Foto (opsional)')} value={card.image_url || ''} onChange={(v) => update(index, { image_url: v })} />
          <LinkField label={tr('Tombol “Selengkapnya” menuju (opsional)')} value={card.href || ''} onChange={(v) => update(index, { href: v })} pages={pages} />
        </div>
      ))}
      <Button type="button" variant="secondary" className="w-full" onClick={() => patch({ cards: [...cards, { id: newId('card'), title: '', body: '', image_url: '', href: '' }] })}>
        <Plus className="h-4 w-4" /> {tr('Tambah kartu')}
      </Button>
    </div>
  );
}

function MediaEditor({ content, patch }: { content: any; patch: Patch }) {
  const items: any[] = Array.isArray(content.media_items) ? content.media_items : [];
  const update = (index: number, p: Record<string, any>) => patch({ media_items: items.map((m, i) => (i === index ? { ...m, ...p } : m)) });
  return (
    <div className="space-y-3">
      <Field label="Susunan">
        <Segmented value={String(content.media_layout || 'stack')} onChange={(v) => patch({ media_layout: v })} options={[{ label: tr('Satu per baris'), value: 'stack' }, { label: tr('2 kolom'), value: 'grid-2' }, { label: tr('3 kolom'), value: 'grid-3' }]} />
      </Field>
      {items.length === 0 && <p className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">{tr('Belum ada foto atau video.')}</p>}
      {items.map((m, index) => (
        <div key={m.id || index} className="space-y-3 rounded-xl border bg-muted/10 p-3">
          <div className="flex items-center justify-between gap-2">
            <b className="text-sm">{m.kind === 'video' ? 'Video' : 'Foto'} {index + 1}</b>
            <div className="flex items-center">
              <Button type="button" variant="ghost" size="icon" aria-label={tr('Geser ke atas')} disabled={index === 0} onClick={() => patch({ media_items: move(items, index, -1) })}><ArrowUp className="h-4 w-4" /></Button>
              <Button type="button" variant="ghost" size="icon" aria-label={tr('Geser ke bawah')} disabled={index === items.length - 1} onClick={() => patch({ media_items: move(items, index, 1) })}><ArrowDown className="h-4 w-4" /></Button>
              <Button type="button" variant="ghost" size="icon" aria-label={tr('Hapus')} onClick={() => patch({ media_items: items.filter((_, i) => i !== index) })}><X className="h-4 w-4 text-destructive" /></Button>
            </div>
          </div>
          <Segmented value={m.kind === 'video' ? 'video' : 'image'} onChange={(v) => update(index, { kind: v, ...(v === 'image' ? { autoplay: false, muted: true } : {}) })} options={[{ label: 'Foto', value: 'image' }, { label: 'Video', value: 'video' }]} />
          <Field label={m.kind === 'video' ? tr('Link video (YouTube / Vimeo)') : tr('Link foto')} hint={m.kind === 'video' ? tr('Tempel link YouTube atau Vimeo biasa, otomatis dibuat bisa diputar.') : tr('Link Google Drive otomatis disesuaikan.')}>
            <Input value={m.url || ''} placeholder="https://..." onChange={(e) => update(index, { url: e.target.value })} />
          </Field>
          <Field label="Bentuk bingkai">
            <Select value={m.ratio || '16:9'} onChange={(e) => update(index, { ratio: e.target.value })}>
              {RATIO_OPTIONS.map((o) => <option key={o.value} value={o.value}>{tr(o.label)}</option>)}
            </Select>
          </Field>
        </div>
      ))}
      <Button
        type="button"
        variant="secondary"
        className="w-full"
        onClick={() => patch({ media_items: [...items, { id: newId('media'), kind: 'image', url: '', ratio: '16:9', size: 100, radius: 16, position: 'center', layer: 'front', autoplay: false, muted: true, title: '' }] })}
      >
        <Plus className="h-4 w-4" /> {tr('Tambah foto / video')}
      </Button>
    </div>
  );
}

/* ───────────── panel utama ───────────── */

export function SectionPanel({
  type, content, onChange, pages, palette,
}: {
  type: SectionTypeId;
  content: Record<string, any>;
  onChange: Patch;
  pages: PageOption[];
  palette: string[];
}) {
  useLang(); // re-render when the UI language changes
  const num = (v: unknown) => (v === '' || v === null || v === undefined ? null : Number(v));
  const titleSize = Number(content.title_font_size || 40);

  return (
    <div className="space-y-4">
      <Group title={tr('Isi')}>
        <Field label={tr('Judul')}>
          <Input value={content.title || ''} onChange={(e) => onChange({ title: e.target.value })} />
        </Field>

        {(type === 'hero' || type === 'card_grid' || type === 'group_feed') && (
          <Field label={type === 'hero' ? 'Kalimat pendukung' : tr('Keterangan singkat')}>
            <Textarea rows={2} value={content.subtitle || ''} onChange={(e) => onChange({ subtitle: e.target.value })} />
          </Field>
        )}

        {type === 'hero' && (
          <>
            <Field label={tr('Tulisan di tombol')} hint={tr('Kosongkan jika tidak ingin ada tombol.')}>
              <Input value={content.cta_label || ''} onChange={(e) => onChange({ cta_label: e.target.value })} />
            </Field>
            <LinkField label={tr('Tombol menuju')} value={content.cta_href || ''} onChange={(v) => onChange({ cta_href: v })} pages={pages} />
            <ImageField label={tr('Foto latar')} value={content.bg_image || ''} onChange={(v) => onChange({ bg_image: v })} />
          </>
        )}

        {type === 'card_grid' && <CardsEditor content={content} patch={onChange} pages={pages} />}

        {type === 'richtext' && (
          <Field label={tr('Isi tulisan')} hint={tr('Tekan Enter untuk membuat paragraf baru.')}>
            <Textarea rows={8} value={content.body || ''} onChange={(e) => onChange({ body: e.target.value })} />
          </Field>
        )}

        {(type === 'event_feed' || type === 'group_feed') && (
          <>
            <Field label={type === 'event_feed' ? tr('Berapa acara yang ditampilkan') : tr('Berapa komunitas yang ditampilkan')}>
              <Input type="number" min={1} max={type === 'event_feed' ? 12 : 24} value={content.limit ?? (type === 'event_feed' ? 3 : 6)} onChange={(e) => onChange({ limit: Number(e.target.value) })} />
            </Field>
            <p className="rounded-lg bg-secondary/50 p-3 text-xs text-muted-foreground">
              Isi bagian ini diambil otomatis dari menu {type === 'event_feed' ? 'Event' : 'Groups'}. Untuk menautkan foto ke {type === 'event_feed' ? 'acara' : 'komunitas'} tertentu, gunakan tab “Editor Halaman”.
            </p>
          </>
        )}

        {type === 'info_lokasi' && (
          <>
            <Field label={tr('Alamat gereja')}><Textarea rows={2} value={content.address || ''} onChange={(e) => onChange({ address: e.target.value })} /></Field>
            <Field label="Jadwal ibadah" hint="Contoh: Minggu 08.00 & 10.30 WIB"><Textarea rows={2} value={content.hours || ''} onChange={(e) => onChange({ hours: e.target.value })} /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Garis lintang"><Input inputMode="decimal" value={content.lat ?? ''} placeholder="-6.2000" onChange={(e) => onChange({ lat: num(e.target.value) })} /></Field>
              <Field label="Garis bujur"><Input inputMode="decimal" value={content.lng ?? ''} placeholder="106.8166" onChange={(e) => onChange({ lng: num(e.target.value) })} /></Field>
            </div>
            <p className="text-xs text-muted-foreground">{tr('Cara cepat: buka Google Maps, tekan lama pada lokasi gereja, lalu salin dua angka koordinat yang muncul.')}</p>
          </>
        )}

        {type === 'map' && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Garis lintang"><Input inputMode="decimal" value={content.lat ?? ''} placeholder="-6.2000" onChange={(e) => onChange({ lat: num(e.target.value) })} /></Field>
              <Field label="Garis bujur"><Input inputMode="decimal" value={content.lng ?? ''} placeholder="106.8166" onChange={(e) => onChange({ lng: num(e.target.value) })} /></Field>
            </div>
            <p className="text-xs text-muted-foreground">{tr('Buka Google Maps, tekan lama pada lokasi gereja, lalu salin dua angka koordinat yang muncul.')}</p>
          </>
        )}

        {type === 'media' && <MediaEditor content={content} patch={onChange} />}
      </Group>

      <Group title={tr('Tampilan')} defaultOpen={false}>
        <Field label={tr('Ukuran judul')}>
          <Segmented
            value={TITLE_SIZES.reduce((best, o) => (Math.abs(o.value - titleSize) < Math.abs(best - titleSize) ? o.value : best), TITLE_SIZES[1].value)}
            options={TITLE_SIZES}
            onChange={(v) => onChange({ title_font_size: v })}
          />
        </Field>
        <Field label={tr('Lebar isi bagian ini')}>
          <Segmented value={String(content.content_width || '1200')} options={WIDTH_OPTIONS} onChange={(v) => onChange({ content_width: v })} />
        </Field>
        <ColorField label={tr('Warna latar')} value={content.background_color} onChange={(v) => onChange({ background_color: v })} palette={palette} />
        <ColorField label={tr('Warna judul')} value={content.title_color} onChange={(v) => onChange({ title_color: v })} palette={palette} />
        <ColorField label={tr('Warna tulisan')} value={content.body_color} onChange={(v) => onChange({ body_color: v })} palette={palette} />
        {type === 'hero' && (
          <>
            <ColorField label={tr('Warna tombol')} value={content.cta_color} onChange={(v) => onChange({ cta_color: v })} palette={palette} />
            <ColorField label={tr('Warna tulisan tombol')} value={content.cta_text_color} onChange={(v) => onChange({ cta_text_color: v })} palette={palette} />
          </>
        )}
        {(type === 'card_grid' || type === 'event_feed' || type === 'group_feed') && (
          <ColorField label={tr('Warna latar kartu')} value={content.card_background_color} onChange={(v) => onChange({ card_background_color: v })} palette={palette} />
        )}
        <p className="text-xs text-muted-foreground">{tr('Pengaturan warna dan font yang lebih detail tersedia di tab “Editor Halaman”.')}</p>
      </Group>
    </div>
  );
}
