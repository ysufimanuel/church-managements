import { clsx, type ClassValue } from 'clsx';
import { getCurrentLang, localeOf } from '@/lib/lang-state';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRupiah(amount: number) {
  return 'Rp ' + new Intl.NumberFormat('id-ID').format(amount);
}

/** Rupiah ringkas untuk layar kecil: Rp 1,2 jt / Rp 350 rb / Rp 2,5 M */
export function formatRupiahCompact(amount: number) {
  const n = Math.abs(amount);
  const id = getCurrentLang() === 'id';
  const f = (v: number) => new Intl.NumberFormat(localeOf(), { maximumFractionDigits: 1 }).format(v);
  const sign = amount < 0 ? '-' : '';
  if (n >= 1e9) return `${sign}Rp ${f(n / 1e9)} ${id ? 'M' : 'B'}`;
  if (n >= 1e6) return `${sign}Rp ${f(n / 1e6)} ${id ? 'jt' : 'M'}`;
  if (n >= 1e3) return `${sign}Rp ${f(n / 1e3)} ${id ? 'rb' : 'K'}`;
  return `${sign}Rp ${f(n)}`;
}

export function formatDate(d?: string | Date | null) {
  if (!d) return '-';
  return new Date(d).toLocaleDateString(localeOf(), { day: 'numeric', month: 'long', year: 'numeric' });
}

export function formatDateTime(d?: string | Date | null) {
  if (!d) return '-';
  return new Date(d).toLocaleString(localeOf(), { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function timeAgo(ts?: string | Date | null) {
  if (!ts) return '-';
  const en = getCurrentLang() === 'en';
  const diff = Date.now() - new Date(ts).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return en ? 'just now' : 'baru saja';
  if (m < 60) return en ? `${m} min ago` : `${m} menit lalu`;
  const h = Math.floor(m / 60);
  if (h < 24) return en ? `${h} hr ago` : `${h} jam lalu`;
  const d = Math.floor(h / 24);
  return en ? `${d} day${d === 1 ? '' : 's'} ago` : `${d} hari lalu`;
}

export function calculateAge(birthDate?: string | null) {
  if (!birthDate) return '-';
  const b = new Date(birthDate);
  const now = new Date();
  let age = now.getFullYear() - b.getFullYear();
  if (now.getMonth() < b.getMonth() || (now.getMonth() === b.getMonth() && now.getDate() < b.getDate())) age--;
  return age;
}

/** Konversi rasio string "16:9" ke padding-top % untuk aspect box */
export function ratioToPadding(ratio: string) {
  const [w, h] = ratio.split(':').map(Number);
  if (!w || !h) return '56.25%';
  return `${(h / w) * 100}%`;
}

/** Auto-render URL: normalisasi Google Drive / YouTube / Vimeo jadi embed-able */
export function normalizeMediaUrl(url: string, kind: string) {
  const candidate = String(url || '').trim();
  if (!candidate) return '';
  // CMS media may be rendered in iframe src attributes; reject executable and non-web schemes.
  if (candidate.startsWith('/') && !candidate.startsWith('//')) return candidate;
  let parsed: URL;
  try {
    parsed = new URL(candidate);
  } catch {
    return '';
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return '';
  url = parsed.toString();
  if (kind === 'video') {
    const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{6,})/);
    if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
    const vm = url.match(/vimeo\.com\/(\d+)/);
    if (vm) return `https://player.vimeo.com/video/${vm[1]}`;
    return url;
  }
  if (kind === 'image') {
    const drive = url.match(/drive\.google\.com\/file\/d\/([\w-]+)/);
    if (drive) return `https://drive.google.com/uc?export=view&id=${drive[1]}`;
    const open = url.match(/drive\.google\.com\/open\?id=([\w-]+)/);
    if (open) return `https://drive.google.com/uc?export=view&id=${open[1]}`;
    return url;
  }
  if (kind === 'map') {
    if (url.includes('google.com/maps') && !url.includes('output=embed')) {
      return url.includes('/embed') ? url : url;
    }
    return url;
  }
  return url;
}
