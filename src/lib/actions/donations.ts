'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { requireRole } from './helpers';
import { canAdd, canEdit, canDelete, type Role } from '@/lib/rbac';

export interface DonationInput {
  id?: number; donor_id?: number | null; tipe: string; custom_type?: string;
  jumlah: number; tanggal: string; keterangan?: string;
}

export async function saveDonation(input: DonationInput) {
  const { denied } = await requireRole((r: Role) => (input.id ? canEdit(r) : canAdd(r)));
  if (denied) return { ok: false, error: denied };
  const supabase = await createClient();
  const payload = { ...input, id: undefined };
  delete (payload as any).id;
  let error;
  if (input.id) ({ error } = await supabase.from('donations').update(payload).eq('id', input.id));
  else ({ error } = await supabase.from('donations').insert(payload));
  if (error) return { ok: false, error: error.message };

  // update agregat donatur (seperti base-code)
  if (input.donor_id) {
    const { data: sums } = await supabase.from('donations').select('jumlah, tanggal')
      .eq('donor_id', input.donor_id);
    const total = (sums || []).reduce((s, d) => s + Number(d.jumlah), 0);
    const last = (sums || []).map((d) => d.tanggal).sort().pop();
    await supabase.from('donors').update({ total_donasi: total, terakhir_donasi: last })
      .eq('id', input.donor_id);
  }
  revalidatePath('/dashboard/donations');
  return { ok: true };
}

export async function deleteDonation(id: number) {
  const { denied } = await requireRole((r: Role) => canDelete(r), 'Hanya Superadmin yang dapat menghapus data');
  if (denied) return { ok: false, error: denied };
  const supabase = await createClient();
  const { error } = await supabase.from('donations').delete().eq('id', id);
  if (error) return { ok: false, error: error.message };
  revalidatePath('/dashboard/donations');
  return { ok: true };
}

export async function saveDonor(input: { id?: number; nama: string; email?: string; telepon?: string }) {
  const { denied } = await requireRole((r: Role) => canAdd(r));
  if (denied) return { ok: false, error: denied };
  const supabase = await createClient();
  const payload = { nama: input.nama, email: input.email, telepon: input.telepon };
  let error;
  if (input.id) ({ error } = await supabase.from('donors').update(payload).eq('id', input.id));
  else ({ error } = await supabase.from('donors').insert(payload));
  if (error) return { ok: false, error: error.message };
  revalidatePath('/dashboard/donations');
  return { ok: true };
}
