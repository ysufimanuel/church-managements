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
  const { profile, denied } = await requireRole((r: Role) => (input.id ? canEdit(r) : canAdd(r)));
  if (denied) return { ok: false, error: denied };
  const supabase = await createClient();
  const { anggota = [], ...rest } = input;
  let familyId = input.id;
  if (familyId) {
    const { error } = await supabase.from('families')
      .update({ nama: rest.nama, kepala_id: rest.kepala_id, alamat: rest.alamat, kota: rest.kota })
      .eq('id', familyId).eq('church_id', profile.church_id);
    if (error) return { ok: false, error: error.message };
  } else {
    const { data, error } = await supabase.from('families')
      .insert({ nama: rest.nama, kepala_id: rest.kepala_id, alamat: rest.alamat, kota: rest.kota, church_id: profile.church_id })
      .select('id').single();
    if (error) return { ok: false, error: error.message };
    familyId = data.id;
  }
  // Admin boleh menambahkan relasi, tetapi penghapusan relasi tetap khusus Superadmin.
  // Jangan menghapus lalu memasukkan ulang: itu melanggar RLS dan dapat meninggalkan data parsial.
  const { data: existing, error: readError } = await supabase
    .from('family_members').select('member_id').eq('family_id', familyId!).eq('church_id', profile.church_id);
  if (readError) return { ok: false, error: readError.message };

  const existingIds = (existing || []).map((row) => row.member_id);
  const requestedIds = anggota.filter((id, index) =>
    Number.isSafeInteger(id) && id > 0 && anggota.indexOf(id) === index
  );

  const additions = requestedIds.filter((memberId) => !existingIds.includes(memberId));
  if (profile.role === 'superadmin') {
    const removals = existingIds.filter((memberId) => !requestedIds.includes(memberId));
    if (removals.length) {
      const { error: deleteError } = await supabase.from('family_members')
        .delete().eq('family_id', familyId!).eq('church_id', profile.church_id).in('member_id', removals);
      if (deleteError) return { ok: false, error: deleteError.message };
    }
  }

  if (additions.length) {
    const { error: insertError } = await supabase.from('family_members').insert(
      additions.map((memberId) => ({ family_id: familyId!, member_id: memberId, church_id: profile.church_id }))
    );
    if (insertError) return { ok: false, error: insertError.message };
  }
  revalidatePath('/dashboard/families');
  return { ok: true };
}

export async function deleteFamily(id: number) {
  const { profile, denied } = await requireRole((r: Role) => canDelete(r), 'Hanya Superadmin yang dapat menghapus data');
  if (denied) return { ok: false, error: denied };
  const supabase = await createClient();
  const { error } = await supabase.from('families').delete().eq('id', id).eq('church_id', profile.church_id);
  if (error) return { ok: false, error: error.message };
  revalidatePath('/dashboard/families');
  return { ok: true };
}
