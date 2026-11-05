'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { requireRole } from './helpers';
import { canAdd, canEdit, canDelete, type Role } from '@/lib/rbac';

export interface EventInput {
  id?: number; nama: string; tipe: string; custom_type?: string;
  start_at: string; end_at?: string; lokasi?: string; deskripsi?: string;
  kapasitas?: number; status: 'upcoming' | 'ongoing' | 'completed'; image_url?: string;
}

export async function saveEvent(input: EventInput) {
  const { denied } = await requireRole((r: Role) => (input.id ? canEdit(r) : canAdd(r)));
  if (denied) return { ok: false, error: denied };
  const supabase = await createClient();
  const payload = { ...input, id: undefined };
  delete (payload as any).id;
  let error;
  if (input.id) ({ error } = await supabase.from('events').update(payload).eq('id', input.id));
  else ({ error } = await supabase.from('events').insert(payload));
  if (error) return { ok: false, error: error.message };
  revalidatePath('/dashboard/events');
  return { ok: true };
}

export async function deleteEvent(id: number) {
  const { denied } = await requireRole((r: Role) => canDelete(r), 'Hanya Superadmin yang dapat menghapus data');
  if (denied) return { ok: false, error: denied };
  const supabase = await createClient();
  const { error } = await supabase.from('events').delete().eq('id', id);
  if (error) return { ok: false, error: error.message };
  revalidatePath('/dashboard/events');
  return { ok: true };
}

export async function addParticipant(eventId: number, memberId?: number, namaManual?: string) {
  const { denied } = await requireRole((r: Role) => canEdit(r));
  if (denied) return { ok: false, error: denied };
  const supabase = await createClient();
  const { error } = await supabase.from('event_participants')
    .insert({ event_id: eventId, member_id: memberId ?? null, nama_manual: namaManual ?? null });
  if (error) return { ok: false, error: error.message };
  revalidatePath('/dashboard/events');
  return { ok: true };
}

export async function removeParticipant(id: number) {
  const { denied } = await requireRole((r: Role) => canDelete(r), 'Hanya Superadmin yang dapat menghapus peserta event');
  if (denied) return { ok: false, error: denied };
  const supabase = await createClient();
  const { error } = await supabase.from('event_participants').delete().eq('id', id);
  if (error) return { ok: false, error: error.message };
  revalidatePath('/dashboard/events');
  return { ok: true };
}
