'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { requireRole } from './helpers';
import { canUseWebManager, canDelete, type Role } from '@/lib/rbac';

async function guardWM() {
  return requireRole((r: Role) => canUseWebManager(r), 'Web Manager hanya untuk Admin/Superadmin');
}

function revalidateWM() {
  revalidatePath('/dashboard/web-manager');
  revalidatePath('/');
}

// ---------- HEADER & NAVIGASI ----------
export type NavInput = { id?: number; label: string; href: string; visible: boolean; sort_order: number };

export async function saveNavItem(input: NavInput) {
  const { denied } = await guardWM();
  if (denied) return { ok: false, error: denied };
  const supabase = await createClient();
  const draft = { label: input.label, href: input.href, visible: input.visible, sort_order: input.sort_order };
  let error;
  if (input.id) {
    ({ error } = await supabase.from('site_nav_items').update({ ...draft, draft, state: 'draft' }).eq('id', input.id));
  } else {
    ({ error } = await supabase.from('site_nav_items').insert({ ...draft, draft, published: null, state: 'draft' }));
  }
  if (error) return { ok: false, error: error.message };
  revalidateWM();
  return { ok: true };
}

export async function toggleNavVisibility(id: number, visible: boolean) {
  const { denied } = await guardWM();
  if (denied) return { ok: false, error: denied };
  const supabase = await createClient();
  const { data, error: readError } = await supabase.from('site_nav_items').select('label,href,sort_order,draft').eq('id', id).maybeSingle();
  if (readError || !data) return { ok: false, error: readError?.message || 'Menu tidak ditemukan' };
  const current = (data.draft || { label: data.label, href: data.href, sort_order: data.sort_order }) as NavInput;
  const draft = { label: current.label, href: current.href, visible, sort_order: current.sort_order };
  const { error } = await supabase.from('site_nav_items').update({ ...draft, draft, state: 'draft' }).eq('id', id);
  if (error) return { ok: false, error: error.message };
  revalidateWM();
  return { ok: true };
}

export async function deleteNavItem(id: number) {
  const { denied } = await requireRole((r: Role) => canDelete(r), 'Hanya Superadmin');
  if (denied) return { ok: false, error: denied };
  const supabase = await createClient();
  const { data, error: readError } = await supabase.from('site_nav_items').select('published').eq('id', id).maybeSingle();
  if (readError || !data) return { ok: false, error: readError?.message || 'Menu tidak ditemukan' };
  if (!data.published) {
    const { error } = await supabase.from('site_nav_items').delete().eq('id', id);
    if (error) return { ok: false, error: error.message };
  } else {
    const { error } = await supabase.from('site_nav_items').update({ draft: null, state: 'draft' }).eq('id', id);
    if (error) return { ok: false, error: error.message };
  }
  revalidateWM();
  return { ok: true };
}

export async function publishNav() {
  const { denied } = await guardWM();
  if (denied) return { ok: false, error: denied };
  const supabase = await createClient();
  const { data: items, error } = await supabase.from('site_nav_items').select('*').order('sort_order').order('id');
  if (error) return { ok: false, error: error.message };
  for (const item of items || []) {
    if (!item.draft) {
      const { error: deleteError } = await supabase.from('site_nav_items').delete().eq('id', item.id);
      if (deleteError) return { ok: false, error: deleteError.message };
      continue;
    }
    const draft = item.draft as NavInput;
    const { error: updateError } = await supabase.from('site_nav_items').update({ ...draft, published: draft, state: 'published' }).eq('id', item.id);
    if (updateError) return { ok: false, error: updateError.message };
  }
  revalidateWM();
  return { ok: true };
}

// ---------- TEMA ----------
export type ThemeInput = { primary_color: string; secondary_color: string; accent_color: string; font_family: string };

export async function saveThemeDraft(theme: ThemeInput) {
  const { denied } = await guardWM();
  if (denied) return { ok: false, error: denied };
  const supabase = await createClient();
  const { error } = await supabase.from('site_theme').update({
    primary_color: theme.primary_color,
    font_family: theme.font_family,
    draft: theme,
    state: 'draft',
  }).eq('id', 1);
  if (error) return { ok: false, error: error.message };
  revalidateWM();
  return { ok: true };
}

export async function publishTheme() {
  const { denied } = await guardWM();
  if (denied) return { ok: false, error: denied };
  const supabase = await createClient();
  const { data: theme, error: readError } = await supabase.from('site_theme').select('*').eq('id', 1).single();
  if (readError || !theme) return { ok: false, error: readError?.message || 'Tema tidak ditemukan' };
  const published = (theme.draft || theme.published || {
    primary_color: theme.primary_color,
    secondary_color: theme.primary_color,
    accent_color: theme.primary_color,
    font_family: theme.font_family,
  }) as ThemeInput;
  const { error } = await supabase.from('site_theme').update({
    primary_color: published.primary_color,
    font_family: published.font_family,
    published,
    draft: published,
    state: 'published',
  }).eq('id', 1);
  if (error) return { ok: false, error: error.message };
  revalidateWM();
  return { ok: true };
}

// ---------- MEDIA ----------
export interface MediaInput {
  id?: number; kind: 'image' | 'video' | 'map'; url: string; ratio: string;
  layer: 'front' | 'overlay'; position: string; title?: string;
  lat?: number | null; lng?: number | null; sort_order?: number;
}

export async function saveMedia(input: MediaInput) {
  const { denied } = await guardWM();
  if (denied) return { ok: false, error: denied };
  const supabase = await createClient();
  const payload = {
    kind: input.kind, url: input.url, ratio: input.ratio, layer: input.layer,
    position: input.position, title: input.title, lat: input.lat ?? null,
    lng: input.lng ?? null, sort_order: input.sort_order ?? 0,
  };
  let error;
  if (input.id) ({ error } = await supabase.from('site_media').update(payload).eq('id', input.id));
  else ({ error } = await supabase.from('site_media').insert({ ...payload, state: 'published' }));
  if (error) return { ok: false, error: error.message };
  revalidateWM();
  return { ok: true };
}

export async function deleteMedia(id: number) {
  const { denied } = await requireRole((r: Role) => canDelete(r), 'Hanya Superadmin');
  if (denied) return { ok: false, error: denied };
  const supabase = await createClient();
  const { error } = await supabase.from('site_media').delete().eq('id', id);
  if (error) return { ok: false, error: error.message };
  revalidateWM();
  return { ok: true };
}

// ---------- SECTION BUILDER ----------
export interface SectionInput {
  id?: number; page: string; type: string; sort_order: number;
  content: Record<string, any>; enabled: boolean;
}

export async function saveSectionDraft(input: SectionInput) {
  const { denied } = await guardWM();
  if (denied) return { ok: false, error: denied };
  const supabase = await createClient();
  const payload = {
    page: input.page, type: input.type, sort_order: input.sort_order,
    content: input.content, enabled: input.enabled, draft_deleted: false,
    updated_at: new Date().toISOString(),
  };
  let error;
  if (input.id) ({ error } = await supabase.from('site_sections').update(payload).eq('id', input.id));
  else ({ error } = await supabase.from('site_sections').insert(payload));
  if (error) return { ok: false, error: error.message };
  revalidateWM();
  return { ok: true };
}

export async function publishSections(page: string) {
  const { denied } = await guardWM();
  if (denied) return { ok: false, error: denied };
  const supabase = await createClient();
  const { data: sections, error } = await supabase.from('site_sections').select('*').eq('page', page);
  if (error) return { ok: false, error: error.message };
  for (const s of sections || []) {
    if (s.draft_deleted) {
      const { error: updateError } = await supabase.from('site_sections').update({ published: null, enabled: false, draft_deleted: false }).eq('id', s.id);
      if (updateError) return { ok: false, error: updateError.message };
      continue;
    }
    const { error: updateError } = await supabase.from('site_sections').update({ published: s.content }).eq('id', s.id);
    if (updateError) return { ok: false, error: updateError.message };
  }
  revalidatePath('/dashboard/web-manager');
  revalidatePath('/');
  revalidatePath(`/site`, 'layout');
  return { ok: true };
}

export async function deleteSection(id: number) {
  const { denied } = await requireRole((r: Role) => canDelete(r), 'Hanya Superadmin');
  if (denied) return { ok: false, error: denied };
  const supabase = await createClient();
  const { data, error: readError } = await supabase.from('site_sections').select('published').eq('id', id).maybeSingle();
  if (readError || !data) return { ok: false, error: readError?.message || 'Section tidak ditemukan' };
  if (!data.published) {
    const { error } = await supabase.from('site_sections').delete().eq('id', id);
    if (error) return { ok: false, error: error.message };
  } else {
    const { error } = await supabase.from('site_sections').update({ draft_deleted: true }).eq('id', id);
    if (error) return { ok: false, error: error.message };
  }
  revalidateWM();
  return { ok: true };
}
