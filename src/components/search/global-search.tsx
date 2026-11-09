'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { Search, X, CornerDownLeft, LayoutGrid, FileText, Users, CalendarDays, Wallet, HeartHandshake, MessageSquare, Globe2, Settings, ChartNoAxesCombined, UserCog, HandCoins, ClipboardCheck, UsersRound } from 'lucide-react';
import { useLang } from '@/components/lang-context';
import { searchDashboard, searchPublicSite } from '@/lib/actions/search';
import { highlightParts, score } from '@/lib/search/text';
import type { SearchHit } from '@/lib/search/types';
import { cn } from '@/lib/utils';

type Props = {
  mode: 'dashboard' | 'public' | 'static';
  /** dashboard: daftar fitur (href + key i18n) yang selalu ikut dicari */
  features?: { href: string; key: string }[];
  /** public: slug tenant */
  slug?: string;
  /** static / public: indeks lokal (menu, section default-web, dsb.) */
  items?: SearchHit[];
  /** tampilkan tombol pemicu bawaan (untuk halaman publik) */
  showTrigger?: boolean;
  /** baca teks halaman yang sedang tampil (section ber-id) saat dibuka, sehingga seluruh isi halaman ikut dicari */
  scanDom?: boolean;
  className?: string;
};

const TEXT = {
  id: { ph: 'Cari apa saja di web ini...', phDash: 'Cari anggota, acara, donasi, fitur...', none: 'Tidak ada hasil', hint: 'Ketik minimal 2 huruf', open: 'Cari', close: 'Tutup', features: 'Fitur', error: 'Pencarian gagal, coba lagi', searching: 'Mencari…',
    g: { page: 'Halaman', menu: 'Menu', members: 'Jemaat', families: 'Keluarga', groups: 'Kelompok', events: 'Acara', donations: 'Donasi', finance: 'Keuangan', volunteers: 'Relawan', communication: 'Komunikasi', messages: 'Pesan chat', 'web-manager': 'Web Manager', 'user-management': 'Pengguna', contacts: 'Kontak chat' } as Record<string, string> },
  en: { ph: 'Search everything on this site...', phDash: 'Search members, events, donations, features...', none: 'No results', hint: 'Type at least 2 characters', open: 'Search', close: 'Close', features: 'Features', error: 'Search failed, try again', searching: 'Searching…',
    g: { page: 'Pages', menu: 'Menu', members: 'Members', families: 'Families', groups: 'Groups', events: 'Events', donations: 'Donations', finance: 'Finance', volunteers: 'Volunteers', communication: 'Communication', messages: 'Chat messages', 'web-manager': 'Web Manager', 'user-management': 'Users', contacts: 'Chat contacts' } as Record<string, string> },
};

const featureIcon = (href: string) => {
  if (href.includes('/members')) return Users;
  if (href.includes('/families')) return UsersRound;
  if (href.includes('/groups')) return HeartHandshake;
  if (href.includes('/events')) return CalendarDays;
  if (href.includes('/attendance')) return ClipboardCheck;
  if (href.includes('/donations')) return HandCoins;
  if (href.includes('/finance')) return Wallet;
  if (href.includes('/volunteers')) return HeartHandshake;
  if (href.includes('/communication')) return MessageSquare;
  if (href.includes('/reports')) return ChartNoAxesCombined;
  if (href.includes('/users')) return UserCog;
  if (href.includes('/web-manager')) return Globe2;
  if (href === '/dashboard') return LayoutGrid;
  return Settings;
};

const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function Hl({ text, q }: { text: string; q: string }) {
  return <>{highlightParts(text, q).map((p, i) => (p.hit ? <mark key={i} className="sx-hit">{p.t}</mark> : <React.Fragment key={i}>{p.t}</React.Fragment>))}</>;
}

export function GlobalSearch({ mode, features = [], slug, items = [], showTrigger, scanDom, className }: Props) {
  const { t, lang } = useLang();
  const L = TEXT[lang] ?? TEXT.id;
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [q, setQ] = React.useState('');
  const [remote, setRemote] = React.useState<SearchHit[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [failed, setFailed] = React.useState(false);
  const [active, setActive] = React.useState(0);
  const [domItems, setDomItems] = React.useState<SearchHit[]>([]);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const lastFocus = React.useRef<HTMLElement | null>(null);

  const close = React.useCallback(() => setOpen(false), []);

  // Pemicu: event kustom (header/bottom-nav), Ctrl/Cmd+K, dan "/"
  React.useEffect(() => {
    const openIt = () => { lastFocus.current = document.activeElement as HTMLElement | null; setOpen(true); };
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      const typing = !!el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || el.isContentEditable);
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openIt(); }
      else if (e.key === '/' && !typing && !e.ctrlKey && !e.metaKey) { e.preventDefault(); openIt(); }
    };
    window.addEventListener('wkc:open-search', openIt);
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('wkc:open-search', openIt); window.removeEventListener('keydown', onKey); };
  }, []);

  // Buka: animasi panel kiri→kanan, kunci scroll, fokus input. Tutup: pulihkan fokus.
  React.useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const id = requestAnimationFrame(() => inputRef.current?.focus());
    return () => {
      cancelAnimationFrame(id);
      document.body.style.overflow = prevOverflow;
      lastFocus.current?.isConnected && lastFocus.current.focus();
      setQ(''); setRemote([]); setActive(0); setFailed(false);
    };
  }, [open]);

  // Pindai teks halaman: tiap <section id> -> judul + paragraf/list/heading sebagai hasil yang bisa dilompati
  React.useEffect(() => {
    if (!open || !scanDom) return;
    const out: SearchHit[] = [];
    const seen = new Set<string>();
    document.querySelectorAll<HTMLElement>('section[id]').forEach((sec) => {
      const head = sec.querySelector('h1,h2')?.textContent?.trim() || sec.getAttribute('aria-label') || sec.id;
      sec.querySelectorAll<HTMLElement>('h1,h2,h3,h4,p,li,figcaption,summary,dt,dd').forEach((el, n) => {
        const text = (el.textContent || '').replace(/\s+/g, ' ').trim();
        if (text.length < 3 || text.length > 400 || seen.has(sec.id + text)) return;
        seen.add(sec.id + text);
        const isHead = /^H[1-4]$/.test(el.tagName);
        out.push({ id: `d${sec.id}-${n}`, group: head, title: isHead ? text : text.slice(0, 80), subtitle: isHead ? undefined : (text.length > 80 ? text : undefined), href: `#${sec.id}` });
      });
    });
    setDomItems(out);
  }, [open, scanDom]);

  // Pencarian jarak jauh (debounce) — hanya untuk dashboard & public
  React.useEffect(() => {
    if (!open || mode === 'static') return;
    const query = q.trim();
    if (query.length < 2) { setRemote([]); setLoading(false); return; }
    setLoading(true);
    let cancelled = false;
    const h = setTimeout(async () => {
      try {
        const res = mode === 'dashboard' ? await searchDashboard(query) : await searchPublicSite(slug || '', query);
        if (cancelled) return;
        setRemote(res.hits); setFailed(!!res.error);
      } catch { if (!cancelled) { setRemote([]); setFailed(true); } }
      finally { if (!cancelled) setLoading(false); }
    }, 220);
    return () => { cancelled = true; clearTimeout(h); };
  }, [q, open, mode, slug]);

  const results = React.useMemo(() => {
    const query = q.trim();
    if (query.length < 2) {
      return mode === 'dashboard'
        ? features.map((f) => ({ id: `f${f.href}`, group: 'features', title: t(f.key), href: f.href } as SearchHit))
        : [];
    }
    const local: SearchHit[] = (mode === 'dashboard'
      ? features.map((f): SearchHit => ({ id: `f${f.href}`, group: 'features', title: t(f.key), href: f.href }))
      : [...items, ...domItems])
      .map((it) => ({ it, s: score(query, it.title, it.subtitle) }))
      .filter((x) => x.s > 0).sort((a, b) => b.s - a.s).map((x) => x.it);
    const seen = new Set<string>();
    return [...local, ...remote].filter((h) => (seen.has(h.id) ? false : (seen.add(h.id), true)));
  }, [q, mode, features, items, domItems, remote, t]);

  // Kelompokkan, pertahankan urutan kemunculan grup
  const groups = React.useMemo(() => {
    const m = new Map<string, SearchHit[]>();
    results.forEach((h) => { const a = m.get(h.group) || []; a.push(h); m.set(h.group, a); });
    return Array.from(m.entries());
  }, [results]);
  const flat = React.useMemo(() => groups.flatMap(([, hs]) => hs), [groups]);
  React.useEffect(() => { setActive(0); }, [q, remote.length]);

  // Animasi: panel menyapu kiri→kanan; baris hasil menyapu kiri→kanan, berurutan atas→bawah
  React.useLayoutEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    if (!panel || reduced()) return;
    gsap.fromTo(panel, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 0.55, ease: 'power4.out', clearProps: 'clipPath' });
  }, [open]);

  const animKey = flat.map((h) => h.id).join('|');
  React.useLayoutEffect(() => {
    const list = listRef.current;
    if (!open || !list) return;
    const rows = Array.from(list.querySelectorAll<HTMLElement>('.sx-row'));
    if (!rows.length || reduced()) return;
    const tw = gsap.fromTo(rows,
      { clipPath: 'inset(0 100% 0 0)', x: -10, opacity: 0.2 },
      { clipPath: 'inset(0 0% 0 0)', x: 0, opacity: 1, duration: 0.42, ease: 'power3.out', stagger: 0.045, delay: 0.12, clearProps: 'clipPath,transform,opacity' });
    return () => { tw.kill(); rows.forEach((r) => gsap.set(r, { clearProps: 'clipPath,transform,opacity' })); };
  }, [open, animKey]);

  const go = (h: SearchHit | undefined) => {
    if (!h) return;
    close();
    if (/^https?:\/\//i.test(h.href)) window.location.href = h.href;
    else if (h.href.startsWith('#')) {
      const target = document.getElementById(h.href.slice(1));
      if (target) { target.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth' }); history.replaceState(null, '', h.href); }
    } else router.push(h.href);
  };

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { e.preventDefault(); close(); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); setActive((i) => Math.min(flat.length - 1, i + 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((i) => Math.max(0, i - 1)); }
    else if (e.key === 'Enter') { e.preventDefault(); go(flat[active]); }
  };
  React.useEffect(() => {
    listRef.current?.querySelector<HTMLElement>(`[data-idx="${active}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  const groupTitle = (g: string) => (g === 'features' ? L.features : L.g[g] ?? g);
  const query = q.trim();
  let idx = -1;

  return (
    <>
      {showTrigger && (
        <button type="button" onClick={() => window.dispatchEvent(new Event('wkc:open-search'))} aria-label={L.open}
          className={cn('btn-fx btn-fx-row inline-flex h-10 items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 text-sm text-white backdrop-blur cursor-pointer', className)}>
          <Search className="h-4 w-4" /> <span className="hidden sm:inline">{L.open}</span>
        </button>
      )}
      {open && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto px-3 py-[max(1rem,env(safe-area-inset-top))] sm:px-5 sm:pt-[9vh] lg:px-6 lg:pt-[8vh]" role="presentation">
          <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" onClick={close} aria-hidden />
          <div ref={panelRef} role="dialog" aria-modal="true" aria-label={L.open}
            className="glass-strong relative flex max-h-[min(82dvh,760px)] w-full max-w-[720px] min-w-0 flex-col overflow-hidden rounded-2xl border border-white/10 text-white shadow-[0_24px_90px_rgb(0_0_0/.55)]">
            <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2.5 sm:px-4">
              <Search className="h-5 w-5 shrink-0 text-white/70" />
              <input ref={inputRef} value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={onInputKey}
                placeholder={mode === 'dashboard' ? L.phDash : L.ph} enterKeyHint="go" autoComplete="off" spellCheck={false}
                role="combobox" aria-expanded="true" aria-controls="sx-list"
                aria-activedescendant={flat[active] ? `sx-opt-${active}` : undefined}
                className="h-11 min-w-0 flex-1 bg-transparent text-base text-white outline-none placeholder:text-white/50" />
              <button type="button" onClick={close} aria-label={L.close} className="btn-fx btn-fx-row grid h-10 w-10 place-items-center rounded-lg text-white/80 hover:bg-white/10 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div ref={listRef} id="sx-list" role="listbox" className="min-h-0 flex-1 overflow-y-auto p-2">
              {query.length < 2 && flat.length === 0 && <p className="px-3 py-6 text-center text-sm text-white/60">{L.hint}</p>}
              {query.length >= 2 && !loading && flat.length === 0 && <p className="px-3 py-6 text-center text-sm text-white/60">{failed ? L.error : L.none}</p>}
              {loading && flat.length === 0 && query.length >= 2 && <p className="px-3 py-6 text-center text-sm text-white/60">{L.searching}</p>}
              {groups.map(([g, hs]) => (
                <div key={g} className="mb-1">
                  <p className="sx-row px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-white/50">{groupTitle(g)}</p>
                  {hs.map((h) => {
                    idx += 1;
                    const i = idx;
                    return (
                      <button key={h.id} type="button" id={`sx-opt-${i}`} data-idx={i} role="option" aria-selected={i === active}
                        onMouseMove={() => setActive(i)} onClick={() => go(h)}
                        className={cn('sx-row flex min-h-[48px] w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors cursor-pointer',
                          i === active ? 'bg-white/15' : 'hover:bg-white/10')}>
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/15 text-primary">
                          {g === 'features' ? React.createElement(featureIcon(h.href), { className: 'h-4 w-4' }) : g === 'page' || g === 'menu' ? <FileText className="h-4 w-4" /> : <LayoutGrid className="h-4 w-4" />}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium"><Hl text={h.title} q={query} /></span>
                          {h.subtitle && <span className="block truncate text-xs text-white/60"><Hl text={h.subtitle} q={query} /></span>}
                        </span>
                        {i === active && <CornerDownLeft className="hidden h-4 w-4 shrink-0 text-white/60 sm:block" />}
                      </button>
                    );
                  })}
                </div>
              ))}
              {loading && flat.length > 0 && <p className="px-3 py-2 text-xs text-white/50">{L.searching}</p>}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
