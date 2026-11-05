'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { requireRole } from './helpers';
import { canAdd, canEdit, canDelete, type Role } from '@/lib/rbac';

export interface GroupInput {
  id?: number; nama: string; deskripsi?: string;
  leader_id?: number | null; jadwal?: string; show_phone?: boolean;
}

export async function saveGroup(input: GroupInput) {
  const { profile, denied } = await requireRole((r: Role) => (input.id ? canEdit(r) : canAdd(r)));
  if (denied) return { ok: false, error: denied };
  const supabase = await createClient();
  const payload = {
    nama: input.nama, deskripsi: input.deskripsi, leader_id: input.leader_id ?? null,
    jadwal: input.jadwal, show_phone: input.show_phone ?? true,
  };
  let error;
  if (input.id) ({ error } = await supabase.from('groups').update(payload).eq('id', input.id).eq('church_id', profile.church_id));
  else ({ error } = await supabase.from('groups').insert({ ...payload, church_id: profile.church_id }));
  if (error) return { ok: false, error: error.message };
  revalidatePath('/dashboard/groups');
  return { ok: true };
}

export async function deleteGroup(id: number) {
  const { profile, denied } = await requireRole((r: Role) => canDelete(r), 'Hanya Superadmin yang dapat menghapus data');
  if (denied) return { ok: false, error: denied };
  const supabase = await createClient();
  const { error } = await supabase.from('groups').delete().eq('id', id).eq('church_id', profile.church_id);
  if (error) return { ok: false, error: error.message };
  revalidatePath('/dashboard/groups');
  return { ok: true };
}

export async function addGroupMember(groupId: number, memberId: number) {
  const { profile, denied } = await requireRole((r: Role) => canEdit(r));
  if (denied) return { ok: false, error: denied };
  const supabase = await createClient();
  const { error } = await supabase.from('group_members').upsert({ group_id: groupId, member_id: memberId, church_id: profile.church_id });
  if (error) return { ok: false, error: error.message };
  revalidatePath('/dashboard/groups');
  return { ok: true };
}

export async function removeGroupMember(groupId: number, memberId: number) {
  const { profile, denied } = await requireRole((r: Role) => canDelete(r), 'Hanya Superadmin yang dapat menghapus anggota komunitas');
  if (denied) return { ok: false, error: denied };
  const supabase = await createClient();
  const { error } = await supabase.from('group_members').delete()
    .eq('group_id', groupId).eq('member_id', memberId).eq('church_id', profile.church_id);
  if (error) return { ok: false, error: error.message };
  revalidatePath('/dashboard/groups');
  return { ok: true };
}
