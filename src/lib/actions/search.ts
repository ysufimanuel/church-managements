'use server';

import { createClient, getCurrentProfile } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { canManageUsers, canUseWebManager, type Role } from '@/lib/rbac';
import { collectText, safeLike, score, snippet } from '@/lib/search/text';
import type { SearchHit, SearchResult } from '@/lib/search/types';

const LIMIT = 6;

/** Pencarian dashboard: wajib login, terbatas pada gereja user (RLS + filter church_id). */
export async function searchDashboard(rawQuery: string): Promise<SearchResult> {
  const q = safeLike(String(rawQuery ?? ''));
  if (q.length < 2) return { hits: [] };
  const profile = await getCurrentProfile().catch(() => null);
  if (!profile?.church_id) return { hits: [], error: 'unauthorized' };
  const role = profile.role as Role;
  const supabase = await createClient();
  const like = `%${q}%`;
  const cid = profile.church_id;

  const run = async (group: string, table: string, cols: string, filterCols: string[], map: (r: any) => Omit<SearchHit, 'group'>) => {
    const { data } = await supabase.from(table).select(cols).eq('church_id', cid)
      .or(filterCols.map((c) => `${c}.ilike.${like}`).join(',')).limit(LIMIT);
    return ((data as any[]) || []).map((r) => ({ group, ...map(r) }));
  };

  const jobs: Promise<SearchHit[]>[] = [
    run('members', 'members', 'id,nama,email,alamat,status', ['nama', 'email', 'alamat'], (r) => ({ id: `m${r.id}`, title: r.nama, subtitle: [r.email, r.status].filter(Boolean).join(' · '), href: `/dashboard/members?q=${encodeURIComponent(q)}` })),
    run('families', 'families', 'id,nama,alamat', ['nama', 'alamat'], (r) => ({ id: `f${r.id}`, title: r.nama, subtitle: r.alamat, href: `/dashboard/families?q=${encodeURIComponent(q)}` })),
    run('groups', 'groups', 'id,nama,deskripsi,jadwal', ['nama', 'deskripsi', 'jadwal'], (r) => ({ id: `g${r.id}`, title: r.nama, subtitle: snippet(r.deskripsi || r.jadwal || '', q), href: `/dashboard/groups?q=${encodeURIComponent(q)}` })),
    run('events', 'events', 'id,nama,lokasi,tipe', ['nama', 'lokasi', 'tipe'], (r) => ({ id: `e${r.id}`, title: r.nama, subtitle: [r.tipe, r.lokasi].filter(Boolean).join(' · '), href: `/dashboard/events?q=${encodeURIComponent(q)}` })),
    run('donations', 'donors', 'id,nama', ['nama'], (r) => ({ id: `d${r.id}`, title: r.nama, href: `/dashboard/donations?q=${encodeURIComponent(q)}` })),
    run('finance', 'finance_transactions', 'id,keterangan,tipe,tanggal', ['keterangan', 'tipe', 'tanggal'], (r) => ({ id: `t${r.id}`, title: r.keterangan || r.tipe, subtitle: `${r.tipe} · ${r.tanggal}`, href: `/dashboard/finance?q=${encodeURIComponent(q)}` })),
    run('volunteers', 'volunteers', 'id,external_nama,area', ['external_nama', 'area'], (r) => ({ id: `v${r.id}`, title: r.external_nama || r.area, subtitle: r.area, href: `/dashboard/volunteers?q=${encodeURIComponent(q)}` })),
    run('communication', 'announcements', 'id,judul,konten', ['judul', 'konten'], (r) => ({ id: `a${r.id}`, title: r.judul, subtitle: snippet(r.konten || '', q), href: `/dashboard/communication?q=${encodeURIComponent(q)}` })),
  ];
  // Kontak chat: semua akun aktif yang memang ditampilkan di tab Messages.
  jobs.push((async () => {
    const { data } = await supabase.from('profiles').select('id,nama,role')
      .eq('church_id', cid).eq('status', 'aktif').ilike('nama', like).limit(LIMIT);
    return ((data as any[]) || []).map((r) => ({
      id: `c${r.id}`, group: 'contacts', title: r.nama, subtitle: r.role,
      href: `/dashboard/communication?q=${encodeURIComponent(q)}`,
    }));
  })());
  if (canUseWebManager(role)) {
    jobs.push(run('web-manager', 'site_nav_items', 'id,label', ['label'], (r) => ({ id: `n${r.id}`, title: r.label, href: '/dashboard/web-manager' })));
  }
  if (canManageUsers(role)) {
    jobs.push(run('user-management', 'profiles', 'id,nama,username,email', ['nama', 'username', 'email'], (r) => ({ id: `u${r.id}`, title: r.nama, subtitle: r.username || r.email, href: '/dashboard/users' })));
  }
  const settled = await Promise.allSettled(jobs);
  const hits = settled.flatMap((s) => (s.status === 'fulfilled' ? s.value : []));
  return { hits };
}

/** Pencarian situs publik: hanya konten yang sudah dipublikasikan & aktif milik tenant slug tsb. */
export async function searchPublicSite(slug: string, rawQuery: string): Promise<SearchResult> {
  const q = String(rawQuery ?? '').trim().slice(0, 64);
  if (q.length < 2 || !/^[a-z0-9-]{1,64}$/i.test(String(slug))) return { hits: [] };
  const admin = createAdminClient();
  const { data: church } = await admin.from('churches').select('id,slug').eq('slug', slug).maybeSingle();
  if (!church) return { hits: [] };
  const base = `/site/${church.slug}`;
  const like = `%${safeLike(q)}%`;
  const hits: (SearchHit & { s: number })[] = [];

  const [{ data: sections }, { data: events }, { data: groups }, { data: nav }] = await Promise.all([
    admin.from('site_sections').select('id,page,type,published,enabled,sort_order').eq('church_id', church.id).eq('enabled', true),
    admin.from('events').select('id,nama,lokasi,deskripsi,start_at').eq('church_id', church.id).in('status', ['upcoming', 'ongoing']).or(`nama.ilike.${like},lokasi.ilike.${like},deskripsi.ilike.${like}`).limit(LIMIT),
    admin.from('groups').select('id,nama,deskripsi,jadwal').eq('church_id', church.id).or(`nama.ilike.${like},deskripsi.ilike.${like}`).limit(LIMIT),
    admin.from('site_nav_items').select('id,published').eq('church_id', church.id),
  ]);

  (sections || []).forEach((sec: any) => {
    if (!sec.published) return;
    const texts = collectText(sec.published);
    const joined = texts.join(' ');
    const s = score(q, texts[0], joined);
    if (!s) return;
    const page = String(sec.page || 'home').trim().toLowerCase();
    const anchor = typeof sec.published.anchor_id === 'string' ? sec.published.anchor_id.replace(/[^a-zA-Z0-9_-]/g, '') : '';
    hits.push({ s, id: `s${sec.id}`, group: 'page', title: texts[0] || sec.type, subtitle: snippet(joined, q), href: `${base}${page === 'home' ? '' : `/${page}`}${anchor ? `#${anchor}` : ''}` });
  });
  (events || []).forEach((e: any) => hits.push({ s: score(q, e.nama, e.lokasi, e.deskripsi) || 1, id: `e${e.id}`, group: 'events', title: e.nama, subtitle: e.lokasi || snippet(e.deskripsi || '', q), href: base }));
  (groups || []).forEach((g: any) => hits.push({ s: score(q, g.nama, g.deskripsi) || 1, id: `g${g.id}`, group: 'groups', title: g.nama, subtitle: snippet(g.deskripsi || g.jadwal || '', q), href: base }));
  (nav || []).forEach((n: any) => {
    const v = n.published as any;
    if (!v || v.visible === false || !v.label) return;
    const s = score(q, v.label);
    if (s) hits.push({ s, id: `n${n.id}`, group: 'menu', title: v.label, href: typeof v.href === 'string' && /^\//.test(v.href) ? `${base}${v.href}` : base });
  });
  hits.sort((a, b) => b.s - a.s);
  return { hits: hits.slice(0, 24).map(({ s: _s, ...h }) => h) };
}
