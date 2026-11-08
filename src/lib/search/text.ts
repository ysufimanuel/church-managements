/** Normalisasi: huruf kecil, tanpa aksen, spasi dirapatkan. */
export function norm(s: unknown): string {
  return String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\s+/g, ' ').trim();
}

/** Sanitasi untuk pola ilike PostgREST: buang karakter yang bisa mengubah filter .or(). */
export function safeLike(q: string): string {
  return q.replace(/[%_\\,()*:"'`]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 64);
}

/** Skor kecocokan sederhana; 0 = tidak cocok. Semua kata kueri harus muncul. */
export function score(query: string, ...fields: (string | undefined | null)[]): number {
  const words = norm(query).split(' ').filter(Boolean);
  if (!words.length) return 0;
  const hay = fields.map(norm);
  let total = 0;
  for (const w of words) {
    let best = 0;
    hay.forEach((h, i) => {
      const at = h.indexOf(w);
      if (at < 0) return;
      const s = (i === 0 ? 10 : 4) + (at === 0 ? 5 : 0) + (h.split(' ').includes(w) ? 3 : 0);
      if (s > best) best = s;
    });
    if (!best) return 0;
    total += best;
  }
  return total;
}

/** Kumpulkan semua teks dari JSON (konten section), abaikan url/warna/ukuran. */
export function collectText(value: unknown, out: string[] = [], key = ''): string[] {
  if (out.length > 200) return out;
  if (typeof value === 'string') {
    const skip = /(url|href|src|color|style|font|image|id$|anchor|align|width|height|position|link)/i.test(key);
    const v = value.trim();
    if (!skip && v && !/^(https?:|\/|#)/i.test(v)) out.push(v);
  } else if (Array.isArray(value)) value.forEach((v) => collectText(v, out, key));
  else if (value && typeof value === 'object') Object.entries(value as Record<string, unknown>).forEach(([k, v]) => collectText(v, out, k));
  return out;
}

/** Pecah teks menjadi segmen [teks, cocok?] untuk highlight tanpa dangerouslySetInnerHTML. */
export function highlightParts(text: string, query: string): { t: string; hit: boolean }[] {
  const words = Array.from(new Set(query.trim().split(/\s+/).filter((w) => w.length > 0))).slice(0, 6);
  if (!words.length) return [{ t: text, hit: false }];
  const re = new RegExp(`(${words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
  // split dengan capture group: indeks ganjil = bagian yang cocok
  return text.split(re).map((t, i) => ({ t, hit: i % 2 === 1 })).filter((p) => p.t);
}

export function snippet(text: string, query: string, len = 110): string {
  const n = norm(text);
  const w = norm(query).split(' ')[0] || '';
  const at = w ? n.indexOf(w) : -1;
  if (text.length <= len || at < 0) return text.slice(0, len);
  const start = Math.max(0, at - 30);
  return (start ? '…' : '') + text.slice(start, start + len) + '…';
}
