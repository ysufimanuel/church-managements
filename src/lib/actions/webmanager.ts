'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { requireRole } from './helpers';
import { canUseWebManager, canDelete, type Role } from '@/lib/rbac';

async function guardWM() {
  return requireRole((r: Role) => canUseWebManager(r), 'Web Manager hanya untuk Admin/Superadmin');
}
function isSafeMediaUrl(value: unknown) {
  const url = String(value || '').trim();
  if (!url) return true;
  if (url.startsWith('/') && !url.startsWith('//')) return true;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}
function revalidateWM() { revalidatePath('/dashboard/web-manager'); revalidatePath('/'); revalidatePath('/site/[slug]', 'page'); }

export type NavInput = { id?: number; label: string; href: string; visible: boolean; sort_order: number };

export async function saveNavItem(input: NavInput) {
  const { profile, denied } = await guardWM(); if (denied) return { ok: false, error: denied };
  const supabase = await createClient();
  const draft = { label: input.label, href: input.href, visible: input.visible, sort_order: input.sort_order };
  const result = input.id
    ? await supabase.from('site_nav_items').update({ ...draft, draft, state: 'draft' }).eq('id', input.id).eq('church_id', profile.church_id).select('id').maybeSingle()
    : await supabase.from('site_nav_items').insert({ ...draft, draft, published: null, state: 'draft', church_id: profile.church_id }).select('id').maybeSingle();
  if (result.error) return { ok: false, error: result.error.message };
  if (!result.data) return { ok: false, error: 'Menu tidak ditemukan atau tidak memiliki akses pada gereja ini' };
  revalidateWM(); return { ok: true };
}

export async function toggleNavVisibility(id: number, visible: boolean) {
  const { profile, denied } = await guardWM(); if (denied) return { ok: false, error: denied };
  const supabase = await createClient();
  const { data, error: readError } = await supabase.from('site_nav_items').select('label,href,sort_order,draft').eq('id', id).eq('church_id', profile.church_id).maybeSingle();
  if (readError || !data) return { ok: false, error: readError?.message || 'Menu tidak ditemukan' };
  const current = (data.draft || { label: data.label, href: data.href, sort_order: data.sort_order }) as NavInput;
  const draft = { label: current.label, href: current.href, visible, sort_order: current.sort_order };
  const { data: updated, error } = await supabase.from('site_nav_items').update({ ...draft, draft, state: 'draft' }).eq('id', id).eq('church_id', profile.church_id).select('id').maybeSingle();
  if (error) return { ok: false, error: error.message };
  if (!updated) return { ok: false, error: 'Menu tidak ditemukan atau tidak memiliki akses pada gereja ini' };
  revalidateWM(); return { ok: true };
}

export async function deleteNavItem(id: number) {
  const { profile, denied } = await requireRole((r: Role) => canDelete(r), 'Hanya Superadmin'); if (denied) return { ok: false, error: denied };
  const supabase = await createClient();
  const { data, error: readError } = await supabase.from('site_nav_items').select('published').eq('id', id).eq('church_id', profile.church_id).maybeSingle();
  if (readError || !data) return { ok: false, error: readError?.message || 'Menu tidak ditemukan' };
  const result = data.published
    ? await supabase.from('site_nav_items').update({ draft: null, state: 'draft' }).eq('id', id).eq('church_id', profile.church_id)
    : await supabase.from('site_nav_items').delete().eq('id', id).eq('church_id', profile.church_id);
  if (result.error) return { ok: false, error: result.error.message };
  revalidateWM(); return { ok: true };
}

export async function publishNav() {
  const { denied } = await guardWM();
  if (denied) return { ok: false, error: denied };
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('publish_site_navigation');
  if (error) return { ok: false, error: error.message };
  revalidateWM();
  return { ok: true, data };
}

export type ThemeInput = { primary_color: string; secondary_color: string; accent_color: string; font_family: string };
export async function saveThemeDraft(theme: ThemeInput) {
  const { profile, denied } = await guardWM(); if (denied) return { ok: false, error: denied }; const supabase = await createClient();
  const { data: current, error: readError } = await supabase.from('site_theme').select('draft,primary_color,font_family').eq('id', 1).eq('church_id', profile.church_id).maybeSingle();
  if (readError || !current) return { ok: false, error: readError?.message || 'Tema Draft tidak ditemukan' };
  const currentDraft = current.draft && typeof current.draft === 'object' ? current.draft as Record<string, unknown> : {};
  // Preserve preset and any future Draft metadata when palette values are edited.
  const draft = { ...currentDraft, ...theme };
  // Keep canonical columns unchanged while editing Draft. Public rendering falls back to these columns
  // when no published JSON snapshot exists, so updating them here can leak unpublished changes.
  const { data, error } = await supabase.from('site_theme').update({ draft, state: 'draft' }).eq('id', 1).eq('church_id', profile.church_id).select('id').maybeSingle();
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
  const { profile, denied } = await guardWM(); if (denied) return { ok: false, error: denied };
  const supabase = await createClient();
  const payload = { kind: input.kind, url: input.url, ratio: input.ratio, layer: input.layer, position: input.position, title: input.title, lat: input.lat ?? null, lng: input.lng ?? null, sort_order: input.sort_order ?? 0 };
  const result = input.id
    ? await supabase.from('site_media').update(payload).eq('id', input.id).eq('church_id', profile.church_id).select('id').maybeSingle()
    : await supabase.from('site_media').insert({ ...payload, state: 'published', church_id: profile.church_id }).select('id').maybeSingle();
  if (result.error) return { ok: false, error: result.error.message };
  if (!result.data) return { ok: false, error: 'Media tidak ditemukan atau tidak memiliki akses pada gereja ini' };
  revalidateWM(); return { ok: true };
}
export async function deleteMedia(id: number) {
  const { profile, denied } = await requireRole((r: Role) => canDelete(r), 'Hanya Superadmin');
  if (denied) return { ok: false, error: denied };
  const supabase = await createClient();
  const { data, error } = await supabase.from('site_media').delete().eq('id', id).eq('church_id', profile.church_id).select('id').maybeSingle();
  if (error) return { ok: false, error: error.message };
  if (!data) return { ok: false, error: 'Media tidak ditemukan atau tidak memiliki akses pada gereja ini' };
  revalidateWM(); return { ok: true };
}

export interface SectionInput { id?: number; page: string; type: string; sort_order: number; content: Record<string, any>; enabled: boolean; }
export async function saveSectionDraft(input: SectionInput) {
  const { profile, denied } = await guardWM();
  if (denied) return { ok: false, error: denied };

  // Validate editor input at the server boundary; client-side controls are not a trust boundary.
  const page = String(input.page || '').trim().toLowerCase();
  const allowedTypes = new Set(['hero', 'card_grid', 'event_feed', 'group_feed', 'info_lokasi', 'media', 'map', 'richtext']);
  if (!/^[a-z0-9][a-z0-9_-]{0,79}$/.test(page)) return { ok: false, error: 'Slug halaman tidak valid' };
  if (!allowedTypes.has(input.type)) return { ok: false, error: 'Tipe section tidak valid' };
  if (!input.content || typeof input.content !== 'object' || Array.isArray(input.content)) return { ok: false, error: 'Konten section tidak valid' };
  if (JSON.stringify(input.content).length > 262144) return { ok: false, error: 'Konten section terlalu besar (maksimal 256 KB)' };

  const supabase = await createClient();
  const mediaItems = Array.isArray(input.content.media_items) ? input.content.media_items : [];
  const cardItems = Array.isArray(input.content.cards) ? input.content.cards : [];
  const mediaUrls = [
    input.content.bg_image,
    input.content.media_url,
    input.content.maps_embed,
    ...mediaItems.map((item: any) => item?.url),
    ...cardItems.map((item: any) => item?.image_url),
  ];
  if (mediaUrls.some((url) => !isSafeMediaUrl(url))) return { ok: false, error: 'URL media harus menggunakan HTTP/HTTPS atau path lokal yang valid.' };
  const eventIds = new Set<number>();
  const groupIds = new Set<number>();
  for (const item of mediaItems) {
    const resourceType = item?.resource_type;
    const rawResourceId = item?.resource_id;
    if (!resourceType) {
      if (rawResourceId !== undefined && rawResourceId !== null && rawResourceId !== '') return { ok: false, error: 'Jenis resource media belum dipilih.' };
      continue;
    }
    const resourceId = Number(rawResourceId);
    if ((resourceType !== 'event' && resourceType !== 'group') || !Number.isSafeInteger(resourceId) || resourceId <= 0) {
      return { ok: false, error: 'Resource media tidak valid.' };
    }
    (resourceType === 'event' ? eventIds : groupIds).add(resourceId);
  }
  if (eventIds.size && input.type !== 'event_feed') return { ok: false, error: 'Media event hanya dapat ditautkan pada section Event.' };
  if (groupIds.size && input.type !== 'group_feed') return { ok: false, error: 'Media komunitas hanya dapat ditautkan pada section Komunitas.' };
  if (eventIds.size) {
    const { data, error } = await supabase.from('events').select('id').eq('church_id', profile.church_id).in('id', Array.from(eventIds));
    if (error) return { ok: false, error: error.message };
    if ((data || []).length !== eventIds.size) return { ok: false, error: 'Event media tidak ditemukan pada gereja ini.' };
  }
  if (groupIds.size) {
    const { data, error } = await supabase.from('groups').select('id').eq('church_id', profile.church_id).in('id', Array.from(groupIds));
    if (error) return { ok: false, error: error.message };
    if ((data || []).length !== groupIds.size) return { ok: false, error: 'Komunitas media tidak ditemukan pada gereja ini.' };
  }

  const sortOrder = Math.min(10000, Math.max(0, Math.trunc(Number(input.sort_order) || 0)));
  const payload = {
    draft_page: page,
    draft_type: input.type,
    draft_sort_order: sortOrder,
    content: input.content,
    draft_enabled: Boolean(input.enabled),
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
      .insert({ ...payload, page, type: input.type, sort_order: payload.draft_sort_order, enabled: false, church_id: profile.church_id })
      .select('id')
      .maybeSingle();
    if (error) return { ok: false, error: error.message };
    if (!data) return { ok: false, error: 'Section baru gagal dibuat.' };
  }
  revalidateWM();
  return { ok: true };
}
export async function publishSections(page: string) {
  const { denied } = await guardWM(); if (denied) return { ok: false, error: denied };
  const normalizedPage = String(page || '').trim().toLowerCase();
  if (!/^[a-z0-9][a-z0-9_-]{0,79}$/.test(normalizedPage)) return { ok: false, error: 'Page tidak valid' };
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('publish_site_sections', { p_page: normalizedPage });
  if (error) return { ok: false, error: error.message };
  revalidateWM(); return { ok: true, data };
}
export async function publishAllSections() {
  const { denied } = await guardWM(); if (denied) return { ok: false, error: denied };
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('publish_site_sections', { p_page: null });
  if (error) return { ok: false, error: error.message };
  revalidateWM(); return { ok: true, data };
}
export async function deleteSection(id: number) {
  const { profile, denied } = await requireRole((r: Role) => canDelete(r), 'Hanya Superadmin');
  if (denied) return { ok: false, error: denied };
  const supabase = await createClient();
  const { data, error: readError } = await supabase.from('site_sections').select('published').eq('id', id).eq('church_id', profile.church_id).maybeSingle();
  if (readError || !data) return { ok: false, error: readError?.message || 'Section tidak ditemukan' };
  const result = data.published
    ? await supabase.from('site_sections').update({ draft_deleted: true }).eq('id', id).eq('church_id', profile.church_id)
    : await supabase.from('site_sections').delete().eq('id', id).eq('church_id', profile.church_id);
  if (result.error) return { ok: false, error: result.error.message };
  revalidateWM(); return { ok: true };
}

export async function publishWebManager() {
  const { denied } = await guardWM();
  if (denied) return { ok: false, error: denied };
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('publish_web_manager');
  if (error) return { ok: false, error: error.message };
  revalidateWM();
  return { ok: true, data };
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

  const baseDraft: Record<string, unknown> = current.draft && typeof current.draft === 'object'
    ? current.draft as Record<string, unknown>
    : {
        primary_color: current.primary_color,
        secondary_color: '#1F2937',
        accent_color: '#22C55E',
        font_family: current.font_family,
      };
  const draft: Record<string, unknown> = { ...baseDraft };
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
