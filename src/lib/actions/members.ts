'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { requireRole } from './helpers';
import { canAdd, canEdit, canDelete, type Role } from '@/lib/rbac';

export interface MemberInput {
  id?: number;
  nama: string; email?: string; telepon?: string;
  jk?: 'Laki-laki' | 'Perempuan';
  tempat_lahir?: string; tgl_lahir?: string;
  alamat?: string; kota?: string; kodepos?: string;
  status?: 'aktif' | 'tidak-aktif';
  group_id?: number | null; join_date?: string;
}

export async function saveMember(input: MemberInput) {
  const { denied } = await requireRole((r: Role) => (input.id ? canEdit(r) : canAdd(r)));
  if (denied) return { ok: false, error: denied };
  const supabase = await createClient();
  const payload = { ...input, id: undefined };
  delete (payload as any).id;
  let error;
  if (input.id) {
    ({ error } = await supabase.from('members').update(payload).eq('id', input.id));
  } else {
    ({ error } = await supabase.from('members').insert(payload));
  }
  if (error) return { ok: false, error: error.message };
  revalidatePath('/dashboard/members');
  return { ok: true };
}

export async function deleteMember(id: number) {
  const { denied } = await requireRole((r: Role) => canDelete(r), 'Hanya Superadmin yang dapat menghapus data');
  if (denied) return { ok: false, error: denied };
  const supabase = await createClient();
  const { error } = await supabase.from('members').delete().eq('id', id);
  if (error) return { ok: false, error: error.message };
  revalidatePath('/dashboard/members');
  return { ok: true };
}
