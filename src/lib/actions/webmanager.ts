'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { requireRole } from './helpers';
import { canUseWebManager, canDelete, type Role } from '@/lib/rbac';

async function guardWM() {
  return requireRole((r: Role) => canUseWebManager(r), 'Web Manager hanya untuk Admin/Superadmin');
}
function revalidateWM() { revalidatePath('/dashboard/web-manager'); revalidatePath('/'); revalidatePath('/site/[slug]', 'page'); }

export type NavInput = { id?: number; label: string; href: string; visible: boolean; sort_order: number };

export async function saveNavItem(input: NavInput) {
  const { denied } = await guardWM(); if (denied) return { ok: false, error: denied };
  const supabase = await createClient(); const draft = { label: input.label, href: input.href, visible: input.visible, sort_order: input.sort_order };
  const result = input.id ? await supabase.from('site_nav_items').update({ ...draft, draft, state: 'draft' }).eq('id', input.id) : await supabase.from('site_nav_items').insert({ ...draft, draft, published: null, state: 'draft' });
  if (result.error) return { ok: false, error: result.error.message }; revalidateWM(); return { ok: true };
}

export async function toggleNavVisibility(id: number, visible: boolean) {
  const { denied } = await guardWM(); if (denied) return { ok: false, error: denied };
  const supabase = await createClient(); const { data, error: readError } = await supabase.from('site_nav_items').select('label,href,sort_order,draft').eq('id', id).maybeSingle();
  if (readError || !data) return { ok: false, error: readError?.message || 'Menu tidak ditemukan' };
  const current = (data.draft || { label: data.label, href: data.href, sort_order: data.sort_order }) as NavInput;
  const draft = { label: current.label, href: current.href, visible, sort_order: current.sort_order };
  const { error } = await supabase.from('site_nav_items').update({ ...draft, draft, state: 'draft' }).eq('id', id);
  if (error) return { ok: false, error: error.message }; revalidateWM(); return { ok: true };
}

export async function deleteNavItem(id: number) {
  const { denied } = await requireRole((r: Role) => canDelete(r), 'Hanya Superadmin'); if (denied) return { ok: false, error: denied };
  const supabase = await createClient(); const { data, error: readError } = await supabase.from('site_nav_items').select('published').eq('id', id).maybeSingle();
  if (readError || !data) return { ok: false, error: readError?.message || 'Menu tidak ditemukan' };
  const result = data.published ? await supabase.from('site_nav_items').update({ draft: null, state: 'draft' }).eq('id', id) : await supabase.from('site_nav_items').delete().eq('id', id);
  if (result.error) return { ok: false, error: result.error.message }; revalidateWM(); return { ok: true };
}

export async function publishNav() {
  const { denied } = await guardWM(); if (denied) return { ok: false, error: denied };
  const supabase = await createClient(); const { data: items, error } = await supabase.from('site_nav_items').select('*').order('sort_order').order('id');
  if (error) return { ok: false, error: error.message };
  for (const item of items || []) {
    if (!item.draft) { const r = await supabase.from('site_nav_items').delete().eq('id', item.id); if (r.error) return { ok: false, error: r.error.message }; continue; }
    const draft = item.draft as NavInput;
    const r = await supabase.from('site_nav_items').update({ ...draft, published: draft, state: 'published' }).eq('id', item.id).select('id');
    if (r.error) return { ok: false, error: r.error.message };
    if (!r.data?.length) return { ok: false, error: `Gagal publish menu #${item.id}: tidak ada row yang ter-update` };
  }
  revalidateWM(); return { ok: true };
}

export type ThemeInput = { primary_color: string; secondary_color: string; accent_color: string; font_family: string };
export async function saveThemeDraft(theme: ThemeInput) {
  const { profile, denied } = await guardWM(); if (denied) return { ok: false, error: denied }; const supabase = await createClient();
  const { data: current, error: readError } = await supabase.from('site_theme').select('draft,primary_color,font_family').eq('id', 1).eq('church_id', profile.church_id).maybeSingle();
  if (readError || !current) return { ok: false, error: readError?.message || 'Tema Draft tidak ditemukan' };
  const draft = { ...theme, ...((current.draft && typeof current.draft === 'object') ? { website_theme: current.draft.website_theme } : {}) };
  const { data, error } = await supabase.from('site_theme').update({ primary_color: theme.primary_color, font_family: theme.font_family, draft, state: 'draft' }).eq('id', 1).eq('church_id', profile.church_id).select('id').maybeSingle();
  if (error) return { ok: false, error: error.message };
  if (!data) return { ok: false, error: 'Tema Draft tidak tersimpan untuk gereja ini' };
  revalidateWM(); return { ok: true };
}
export async function publishTheme() {
  const { profile, denied } = await guardWM(); if (denied) return { ok: false, error: denied }; const supabase = await createClient();
  const { data: theme, error: readError } = await supabase.from('site_theme').select('*').eq('id', 1).eq('church_id', profile.church_id).single();
  if (readError || !theme) return { ok: false, error: readError?.message || 'Tema tidak ditemukan' };
  const published = (theme.draft || theme.published || { primary_color: theme.primary_color, secondary_color: '#1F2937', accent_color: '#22C55E', font_family: theme.font_family }) as ThemeInput & { website_theme?: string };
  const result = await supabase.from('site_theme').update({ primary_color: published.primary_color, font_family: published.font_family, published, draft: published, state: 'published' }).eq('id', 1).eq('church_id', profile.church_id).select('id');
  if (result.error) return { ok: false, error: result.error.message };
  if (!result.data?.length) return { ok: false, error: 'Gagal publish tema: tidak ada row yang ter-update' };
  revalidateWM(); return { ok: true };
}

export interface MediaInput { id?: number; kind: 'image' | 'video' | 'map'; url: string; ratio: string; layer: 'front' | 'overlay'; position: string; title?: string; lat?: number | null; lng?: number | null; sort_order?: number; }
export async function saveMedia(input: MediaInput) {
  const { denied } = await guardWM(); if (denied) return { ok: false, error: denied }; const supabase = await createClient();
  const payload = { kind: input.kind, url: input.url, ratio: input.ratio, layer: input.layer, position: input.position, title: input.title, lat: input.lat ?? null, lng: input.lng ?? null, sort_order: input.sort_order ?? 0 };
  const result = input.id ? await supabase.from('site_media').update(payload).eq('id', input.id) : await supabase.from('site_media').insert({ ...payload, state: 'published' });
  if (result.error) return { ok: false, error: result.error.message }; revalidateWM(); return { ok: true };
}
export async function deleteMedia(id: number) { const { denied } = await requireRole((r: Role) => canDelete(r), 'Hanya Superadmin'); if (denied) return { ok: false, error: denied }; const supabase = await createClient(); const { error } = await supabase.from('site_media').delete().eq('id', id); if (error) return { ok: false, error: error.message }; revalidateWM(); return { ok: true }; }

export interface SectionInput { id?: number; page: string; type: string; sort_order: number; content: Record<string, any>; enabled: boolean; }
export async function saveSectionDraft(input: SectionInput) {
  const { profile, denied } = await guardWM();
  if (denied) return { ok: false, error: denied };
  const supabase = await createClient();
  const payload = {
    page: input.page,
    type: input.type,
    sort_order: Math.max(0, Math.trunc(Number(input.sort_order) || 0)),
    content: input.content,
    enabled: input.enabled,
    draft_deleted: false,
    updated_at: new Date().toISOString(),
  };

  if (input.id) {
    const { data, error } = await supabase
      .from('site_sections')
      .update(payload)
      .eq('id', input.id)
      .eq('church_id', profile.church_id)
      .select('id')
      .maybeSingle();
    if (error) return { ok: false, error: error.message };
    if (!data) return { ok: false, error: 'Section tidak ditemukan atau tidak memiliki akses pada gereja ini. Urutan/posisi tidak disimpan.' };
  } else {
    const { data, error } = await supabase
      .from('site_sections')
      .insert({ ...payload, church_id: profile.church_id })
      .select('id')
      .maybeSingle();
    if (error) return { ok: false, error: error.message };
    if (!data) return { ok: false, error: 'Section baru gagal dibuat.' };
  }
  revalidateWM();
  return { ok: true };
}
export async function publishSections(page: string) {
  const { denied } = await guardWM(); if (denied) return { ok: false, error: denied }; const supabase = await createClient();
  const { data: sections, error } = await supabase.from('site_sections').select('id,content,draft_deleted').eq('page', page); if (error) return { ok: false, error: error.message };
  for (const s of sections || []) {
    const result = s.draft_deleted
      ? await supabase.from('site_sections').update({ published: null, enabled: false, draft_deleted: false }).eq('id', s.id).select('id')
      : await supabase.from('site_sections').update({ published: s.content }).eq('id', s.id).select('id');
    if (result.error) return { ok: false, error: result.error.message };
    if (!result.data?.length) return { ok: false, error: `Gagal publish section #${s.id}: tidak ada row yang ter-update` };
  }
  revalidateWM(); return { ok: true };
}
export async function publishAllSections() {
  const { denied } = await guardWM(); if (denied) return { ok: false, error: denied }; const supabase = await createClient();
  const { data: sections, error } = await supabase.from('site_sections').select('id,content,draft_deleted').order('id'); if (error) return { ok: false, error: error.message };
  for (const s of sections || []) {
    const result = s.draft_deleted
      ? await supabase.from('site_sections').update({ published: null, enabled: false, draft_deleted: false }).eq('id', s.id).select('id')
      : await supabase.from('site_sections').update({ published: s.content }).eq('id', s.id).select('id');
    if (result.error) return { ok: false, error: result.error.message };
    if (!result.data?.length) return { ok: false, error: `Gagal publish section #${s.id}: tidak ada row yang ter-update` };
  }
  revalidateWM(); return { ok: true };
}
export async function deleteSection(id: number) {
  const { denied } = await requireRole((r: Role) => canDelete(r), 'Hanya Superadmin'); if (denied) return { ok: false, error: denied }; const supabase = await createClient(); const { data, error: readError } = await supabase.from('site_sections').select('published').eq('id', id).maybeSingle(); if (readError || !data) return { ok: false, error: readError?.message || 'Section tidak ditemukan' };
  const result = data.published ? await supabase.from('site_sections').update({ draft_deleted: true }).eq('id', id) : await supabase.from('site_sections').delete().eq('id', id);
  if (result.error) return { ok: false, error: result.error.message }; revalidateWM(); return { ok: true };
}

export async function publishWebManager() {
  const { denied } = await guardWM(); if (denied) return { ok: false, error: denied };
  const n = await publishNav(); if (!n.ok) return n; const t = await publishTheme(); if (!t.ok) return t; const s = await publishAllSections(); if (!s.ok) return s; revalidateWM(); return { ok: true };
}


export type WebsiteThemePreference = 'cms' | 'default';

export async function saveWebsiteThemePreference(theme: WebsiteThemePreference) {
  const { profile, denied } = await guardWM();
  if (denied) return { ok: false, error: denied };
  if (theme !== 'cms' && theme !== 'default') return { ok: false, error: 'Pilihan tema tidak valid' };

  // Store the presentation preset in the church Draft theme. Preserve all existing palette settings.
  const supabase = await createClient();
  const { data: current, error: readError } = await supabase
    .from('site_theme')
    .select('draft,primary_color,font_family')
    .eq('id', 1)
    .eq('church_id', profile.church_id)
    .maybeSingle();
  if (readError || !current) return { ok: false, error: readError?.message || 'Tema Draft tidak ditemukan' };

  const baseDraft = current.draft && typeof current.draft === 'object'
    ? current.draft as Record<string, unknown>
    : {
        primary_color: current.primary_color,
        secondary_color: '#1F2937',
        accent_color: '#22C55E',
        font_family: current.font_family,
      };
  const draft = { ...baseDraft };
  if (theme === 'default') draft.website_theme = 'default';
  else delete draft.website_theme;

  const { data, error } = await supabase
    .from('site_theme')
    .update({ draft, state: 'draft' })
    .eq('id', 1)
    .eq('church_id', profile.church_id)
    .select('id')
    .maybeSingle();
  if (error) return { ok: false, error: error.message };
  if (!data) return { ok: false, error: 'Preferensi tema Draft tidak tersimpan untuk gereja ini' };

  revalidateWM();
  return { ok: true };
}
