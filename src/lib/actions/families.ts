'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { requireRole } from './helpers';
import { canAdd, canEdit, canDelete, type Role } from '@/lib/rbac';

export interface FamilyInput {
  id?: number; nama: string; kepala_id?: number | null;
  alamat?: string; kota?: string; anggota?: number[];
}

export async function saveFamily(input: FamilyInput) {
  const { denied } = await requireRole((r: Role) => (input.id ? canEdit(r) : canAdd(r)));
  if (denied) return { ok: false, error: denied };
  const supabase = await createClient();
  const { anggota = [], ...rest } = input;
  let familyId = input.id;
  if (familyId) {
    const { error } = await supabase.from('families')
      .update({ nama: rest.nama, kepala_id: rest.kepala_id, alamat: rest.alamat, kota: rest.kota })
      .eq('id', familyId);
    if (error) return { ok: false, error: error.message };
  } else {
    const { data, error } = await supabase.from('families')
      .insert({ nama: rest.nama, kepala_id: rest.kepala_id, alamat: rest.alamat, kota: rest.kota })
      .select('id').single();
    if (error) return { ok: false, error: error.message };
    familyId = data.id;
  }
  // sync anggota
  await supabase.from('family_members').delete().eq('family_id', familyId!);
  if (anggota.length) {
    await supabase.from('family_members').insert(
      anggota.map((m) => ({ family_id: familyId!, member_id: m }))
    );
  }
  revalidatePath('/dashboard/families');
  return { ok: true };
}

export async function deleteFamily(id: number) {
  const { denied } = await requireRole((r: Role) => canDelete(r), 'Hanya Superadmin yang dapat menghapus data');
  if (denied) return { ok: false, error: denied };
  const supabase = await createClient();
  const { error } = await supabase.from('families').delete().eq('id', id);
  if (error) return { ok: false, error: error.message };
  revalidatePath('/dashboard/families');
  return { ok: true };
}
