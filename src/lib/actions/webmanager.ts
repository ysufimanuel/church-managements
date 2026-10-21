'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { requireRole } from './helpers';
import { canUseWebManager, canDelete, type Role } from '@/lib/rbac';

async function guardWM() {
  return requireRole((r: Role) => canUseWebManager(r), 'Web Manager hanya untuk Admin/Superadmin');
}

// ---------- TAB 1: HEADER & NAVIGASI ----------
export async function saveNavItem(input: { id?: number; label: string; href: string; visible: boolean; sort_order: number }) {
  const { denied } = await guardWM();
  if (denied) return { ok: false, error: denied };
  const supabase = await createClient();
  const payload = { label: input.label, href: input.href, visible: input.visible, sort_order: input.sort_order };
  let error;
  if (input.id) ({ error } = await supabase.from('site_nav_items').update(payload).eq('id', input.id));
  else ({ error } = await supabase.from('site_nav_items').insert({ ...payload, state: 'published' }));
  if (error) return { ok: false, error: error.message };
  revalidatePath('/dashboard/web-manager');
  revalidatePath('/');
  return { ok: true };
}

export async function toggleNavVisibility(id: number, visible: boolean) {
  const { denied } = await guardWM();
  if (denied) return { ok: false, error: denied };
  const supabase = await createClient();
  const { error } = await supabase.from('site_nav_items').update({ visible }).eq('id', id);
  if (error) return { ok: false, error: error.message };
  revalidatePath('/dashboard/web-manager');
  revalidatePath('/');
  return { ok: true };
}

export async function deleteNavItem(id: number) {
  const { denied } = await requireRole((r: Role) => canDelete(r), 'Hanya Superadmin');
  if (denied) return { ok: false, error: denied };
  const supabase = await createClient();
  const { error } = await supabase.from('site_nav_items').delete().eq('id', id);
  if (error) return { ok: false, error: error.message };
  revalidatePath('/dashboard/web-manager');
  revalidatePath('/');
  return { ok: true };
}

// ---------- TAB 2: TEMA & MEDIA ----------
export async function saveThemeDraft(theme: { primary_color: string; font_family: string }) {
  const { denied } = await guardWM();
  if (denied) return { ok: false, error: denied };
  const supabase = await createClient();
  const { error } = await supabase.from('site_theme')
    .update({ ...theme, draft: theme, state: 'draft' }).eq('id', 1);
  if (error) return { ok: false, error: error.message };
  revalidatePath('/dashboard/web-manager');
  return { ok: true };
}

export async function publishTheme() {
  const { denied } = await guardWM();
  if (denied) return { ok: false, error: denied };
  const supabase = await createClient();
  const { data: theme } = await supabase.from('site_theme').select('*').eq('id', 1).single();
  if (!theme) return { ok: false, error: 'Tema tidak ditemukan' };
  const published = { primary_color: theme.primary_color, font_family: theme.font_family };
  const { error } = await supabase.from('site_theme')
    .update({ published, state: 'published' }).eq('id', 1);
  if (error) return { ok: false, error: error.message };
  revalidatePath('/dashboard/web-manager');
  revalidatePath('/');
  return { ok: true };
}

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
  revalidatePath('/dashboard/web-manager');
  revalidatePath('/');
  return { ok: true };
}

export async function deleteMedia(id: number) {
  const { denied } = await requireRole((r: Role) => canDelete(r), 'Hanya Superadmin');
  if (denied) return { ok: false, error: denied };
  const supabase = await createClient();
  const { error } = await supabase.from('site_media').delete().eq('id', id);
  if (error) return { ok: false, error: error.message };
  revalidatePath('/dashboard/web-manager');
  revalidatePath('/');
  return { ok: true };
}

// ---------- TAB 3: SECTION BUILDER ----------
export interface SectionInput {
  id?: number; page: string; type: string; sort_order: number;
  content: Record<string, any>; enabled: boolean;
}

/** Simpan sebagai DRAFT — publik tidak berubah sampai Publish */
export async function saveSectionDraft(input: SectionInput) {
  const { denied } = await guardWM();
  if (denied) return { ok: false, error: denied };
  const supabase = await createClient();
  const payload = {
    page: input.page, type: input.type, sort_order: input.sort_order,
    content: input.content, enabled: input.enabled, updated_at: new Date().toISOString(),
  };
  let error;
  if (input.id) ({ error } = await supabase.from('site_sections').update(payload).eq('id', input.id));
  else ({ error } = await supabase.from('site_sections').insert(payload));
  if (error) return { ok: false, error: error.message };
  revalidatePath('/dashboard/web-manager');
  return { ok: true };
}

/** Publish semua draft section pada satu halaman */
export async function publishSections(page: string) {
  const { denied } = await guardWM();
  if (denied) return { ok: false, error: denied };
  const supabase = await createClient();
  const { data: sections } = await supabase.from('site_sections').select('*').eq('page', page);
  for (const s of sections || []) {
    await supabase.from('site_sections').update({ published: s.content }).eq('id', s.id);
  }
  revalidatePath('/dashboard/web-manager');
  revalidatePath('/');
  revalidatePath(`/${page === 'home' ? '' : page}`);
  return { ok: true };
}

export async function deleteSection(id: number) {
  const { denied } = await requireRole((r: Role) => canDelete(r), 'Hanya Superadmin');
  if (denied) return { ok: false, error: denied };
  const supabase = await createClient();
  const { error } = await supabase.from('site_sections').delete().eq('id', id);
  if (error) return { ok: false, error: error.message };
  revalidatePath('/dashboard/web-manager');
  return { ok: true };
}
