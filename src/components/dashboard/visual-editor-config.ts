import { LayoutTemplate, LayoutGrid, CalendarDays, Users, MapPin, Images, Map as MapIcon, Type, type LucideIcon } from 'lucide-react';

export type SectionTypeId = 'hero' | 'card_grid' | 'event_feed' | 'group_feed' | 'info_lokasi' | 'media' | 'map' | 'richtext';

export type SectionMeta = {
  label: string;
  hint: string;
  icon: LucideIcon;
  defaults: () => Record<string, any>;
};

const uid = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

export const SECTION_META: Record<SectionTypeId, SectionMeta> = {
  hero: {
    label: 'Banner Utama',
    hint: 'Bagian paling atas: judul besar, kalimat sambutan, tombol, dan foto latar.',
    icon: LayoutTemplate,
    defaults: () => ({ title: 'Selamat Datang', subtitle: 'Tulis kalimat sambutan singkat di sini.', cta_label: 'Kenali Kami', cta_href: '/tentang', bg_image: '', title_font_size: 40 }),
  },
  card_grid: {
    label: 'Kartu Informasi',
    hint: 'Beberapa kartu berisi foto, judul, dan penjelasan. Cocok untuk pelayanan atau program.',
    icon: LayoutGrid,
    defaults: () => ({
      title: 'Pelayanan Kami', subtitle: '', grid_columns: 3,
      cards: [1, 2, 3].map((n) => ({ id: uid('card'), title: `Kartu ${n}`, body: 'Tulis penjelasan singkat di sini.', image_url: '', href: '' })),
    }),
  },
  event_feed: {
    label: 'Acara Mendatang',
    hint: 'Otomatis menampilkan acara yang sudah kamu buat di menu Event. Tidak perlu diisi ulang.',
    icon: CalendarDays,
    defaults: () => ({ title: 'Acara Mendatang', limit: 3 }),
  },
  group_feed: {
    label: 'Komunitas',
    hint: 'Otomatis menampilkan daftar komunitas/kelompok dari menu Groups.',
    icon: Users,
    defaults: () => ({ title: 'Komunitas & Kelompok', subtitle: '', limit: 6 }),
  },
  info_lokasi: {
    label: 'Alamat & Jam Ibadah',
    hint: 'Alamat gereja, jadwal ibadah, dan peta kecil.',
    icon: MapPin,
    defaults: () => ({ title: 'Info & Lokasi', address: '', hours: '', lat: null, lng: null }),
  },
  media: {
    label: 'Galeri Foto / Video',
    hint: 'Tampilkan satu atau beberapa foto atau video.',
    icon: Images,
    defaults: () => ({ title: 'Galeri', media_items: [], media_layout: 'stack' }),
  },
  map: {
    label: 'Peta Lokasi',
    hint: 'Peta besar dengan titik lokasi gereja.',
    icon: MapIcon,
    defaults: () => ({ title: 'Lokasi Kami', lat: null, lng: null, maps_embed: '', ratio: '1:1' }),
  },
  richtext: {
    label: 'Teks',
    hint: 'Judul dan paragraf bebas. Cocok untuk sejarah, visi misi, atau pengumuman.',
    icon: Type,
    defaults: () => ({ title: 'Judul', body: 'Tulis isi di sini.' }),
  },
};

export const SECTION_ORDER: SectionTypeId[] = ['hero', 'card_grid', 'event_feed', 'group_feed', 'info_lokasi', 'media', 'map', 'richtext'];

export function sectionMeta(type: string): SectionMeta {
  return SECTION_META[type as SectionTypeId] || { label: type, hint: '', icon: Type, defaults: () => ({}) };
}

const PAGE_LABELS: Record<string, string> = {
  home: 'Beranda', new: 'Pengunjung Baru', connect: 'Komunitas', grow: 'Bertumbuh', ministries: 'Pelayanan',
  events: 'Acara', worship: 'Ibadah', tentang: 'Tentang Kami', kontak: 'Kontak',
};

export function pageLabel(slug: string) {
  return PAGE_LABELS[slug] || slug.charAt(0).toUpperCase() + slug.slice(1).replace(/[-_]/g, ' ');
}

/** Nilai Draft yang berlaku untuk sebuah baris site_sections. */
export function effective(s: any) {
  return {
    page: String(s.draft_page || s.page || '').trim().toLowerCase(),
    type: String(s.draft_type || s.type || ''),
    sort: Number(s.draft_sort_order ?? s.sort_order ?? 0),
    enabled: Boolean(s.draft_enabled ?? s.enabled),
    deleted: Boolean(s.draft_deleted),
  };
}

/** True jika Draft berbeda dari versi yang sedang tayang di website publik. */
export function hasUnpublished(s: any) {
  if (s.draft_deleted || !s.published) return true;
  const e = effective(s);
  if (e.page !== String(s.page || '').trim().toLowerCase()) return true;
  if (e.type !== String(s.type || '')) return true;
  if (e.sort !== Number(s.sort_order ?? 0)) return true;
  if (e.enabled !== Boolean(s.enabled)) return true;
  return JSON.stringify(s.content ?? null) !== JSON.stringify(s.published ?? null);
}

/** Ringkasan satu baris untuk daftar bagian halaman. */
export function sectionSummary(type: string, content: any) {
  const c = content || {};
  const text = String(c.title || c.address || c.body || c.subtitle || '').trim();
  if (text) return text.length > 48 ? `${text.slice(0, 47)}…` : text;
  return sectionMeta(type).hint.split('.')[0];
}

export const RATIO_OPTIONS: { value: string; label: string }[] = [
  { value: '16:9', label: 'Lebar (16:9)' },
  { value: '19:9', label: 'Panorama (19:9)' },
  { value: '4:3', label: 'Standar (4:3)' },
  { value: '1:1', label: 'Kotak (1:1)' },
  { value: '4:5', label: 'Potret (4:5)' },
  { value: '2:3', label: 'Potret tinggi (2:3)' },
  { value: '9:16', label: 'Vertikal HP (9:16)' },
  { value: '2:9', label: 'Banner tipis (2:9)' },
  { value: '32:9', label: 'Ultra lebar (32:9)' },
];

export const TITLE_SIZES = [
  { label: 'Kecil', value: 28 },
  { label: 'Sedang', value: 40 },
  { label: 'Besar', value: 56 },
  { label: 'Sangat besar', value: 72 },
];

export const WIDTH_OPTIONS = [
  { value: '720', label: 'Sempit' },
  { value: '960', label: 'Sedang' },
  { value: '1200', label: 'Standar' },
  { value: '1440', label: 'Lebar' },
  { value: 'full', label: 'Penuh layar' },
];

export function newId(prefix: string) {
  return uid(prefix);
}
