import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRupiah(amount: number) {
  return 'Rp ' + new Intl.NumberFormat('id-ID').format(amount);
}

export function formatDate(d?: string | Date | null) {
  if (!d) return '-';
  return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function formatDateTime(d?: string | Date | null) {
  if (!d) return '-';
  return new Date(d).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function timeAgo(ts?: string | Date | null) {
  if (!ts) return '-';
  const diff = Date.now() - new Date(ts).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'baru saja';
  if (m < 60) return `${m} menit lalu`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} jam lalu`;
  return `${Math.floor(h / 24)} hari lalu`;
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
  if (!url) return url;
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
