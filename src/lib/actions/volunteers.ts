'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { requireRole } from './helpers';
import { canAdd, canEdit, canDelete, type Role } from '@/lib/rbac';

export interface VolunteerInput {
  id?: number; member_id?: number | null;
  external_nama?: string; external_email?: string; external_telepon?: string;
  area: string; jadwal: string[]; status?: string;
}

export async function saveVolunteer(input: VolunteerInput) {
  const { profile, denied } = await requireRole((r: Role) => (input.id ? canEdit(r) : canAdd(r)));
  if (denied) return { ok: false, error: denied };
  const supabase = await createClient();
  const payload = {
    member_id: input.member_id ?? null,
    external_nama: input.external_nama ?? null,
    external_email: input.external_email ?? null,
    external_telepon: input.external_telepon ?? null,
    area: input.area, jadwal: input.jadwal, status: input.status ?? 'aktif',
  };
  let error;
  if (input.id) ({ error } = await supabase.from('volunteers').update(payload).eq('id', input.id).eq('church_id', profile.church_id));
  else ({ error } = await supabase.from('volunteers').insert({ ...payload, church_id: profile.church_id }));
  if (error) return { ok: false, error: error.message };
  revalidatePath('/dashboard/volunteers');
  return { ok: true };
}

export async function deleteVolunteer(id: number) {
  const { profile, denied } = await requireRole((r: Role) => canDelete(r), 'Hanya Superadmin yang dapat menghapus data');
  if (denied) return { ok: false, error: denied };
  const supabase = await createClient();
  const { error } = await supabase.from('volunteers').delete().eq('id', id).eq('church_id', profile.church_id);
  if (error) return { ok: false, error: error.message };
  revalidatePath('/dashboard/volunteers');
  return { ok: true };
}

export interface AssignmentInput {
  id?: number; volunteer_id: number; event_id?: number | null;
  tanggal: string; waktu?: string; tempat?: string; tugas?: string; catatan?: string; status?: string;
}

export async function saveAssignment(input: AssignmentInput) {
  const { denied } = await requireRole((r: Role) => (input.id ? canEdit(r) : canAdd(r)));
  if (denied) return { ok: false, error: denied };
  const supabase = await createClient();
  const payload = {
    volunteer_id: input.volunteer_id, event_id: input.event_id ?? null,
    tanggal: input.tanggal, waktu: input.waktu || null, tempat: input.tempat,
    tugas: input.tugas, catatan: input.catatan, status: input.status ?? 'assigned',
  };
  let error;
  if (input.id) ({ error } = await supabase.from('volunteer_assignments').update(payload).eq('id', input.id));
  else ({ error } = await supabase.from('volunteer_assignments').insert(payload));
  if (error) return { ok: false, error: error.message };
  revalidatePath('/dashboard/volunteers');
  return { ok: true };
}

export async function deleteAssignment(id: number) {
  const { denied } = await requireRole((r: Role) => canDelete(r), 'Hanya Superadmin yang dapat menghapus data');
  if (denied) return { ok: false, error: denied };
  const supabase = await createClient();
  const { error } = await supabase.from('volunteer_assignments').delete().eq('id', id);
  if (error) return { ok: false, error: error.message };
  revalidatePath('/dashboard/volunteers');
  return { ok: true };
}
