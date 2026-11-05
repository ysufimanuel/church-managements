'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { requireRole } from './helpers';
import { canAdd, canEdit, canDelete, type Role } from '@/lib/rbac';

export interface DonationInput {
  id?: number; donor_id?: number | null; tipe: string; custom_type?: string;
  jumlah: number; tanggal: string; keterangan?: string;
}

async function refreshDonorTotals(supabase: any, donorId: number, churchId: string) {
  const { data: sums, error: sumsError } = await supabase.from('donations')
    .select('jumlah, tanggal')
    .eq('donor_id', donorId)
    .eq('church_id', churchId);
  if (sumsError) return sumsError.message;

  const total = (sums || []).reduce((sum: number, donation: { jumlah: number | string }) => sum + Number(donation.jumlah), 0);
  const last = (sums || []).map((donation: { tanggal: string }) => donation.tanggal).sort().pop() ?? null;
  const { error: updateError } = await supabase.from('donors')
    .update({ total_donasi: total, terakhir_donasi: last })
    .eq('id', donorId)
    .eq('church_id', churchId);
  return updateError?.message ?? null;
}

export async function saveDonation(input: DonationInput) {
  const { profile, denied } = await requireRole((r: Role) => (input.id ? canEdit(r) : canAdd(r)));
  if (denied) return { ok: false, error: denied };
  const supabase = await createClient();

  let previousDonorId: number | null = null;
  if (input.id) {
    const { data: existing, error: readError } = await supabase.from('donations')
      .select('donor_id')
      .eq('id', input.id)
      .eq('church_id', profile.church_id)
      .maybeSingle();
    if (readError) return { ok: false, error: readError.message };
    previousDonorId = existing?.donor_id ?? null;
  }

  const payload = {
    donor_id: input.donor_id ?? null,
    tipe: input.tipe,
    custom_type: input.custom_type ?? null,
    jumlah: input.jumlah,
    tanggal: input.tanggal,
    keterangan: input.keterangan ?? null,
  };
  let error;
  if (input.id) {
    ({ error } = await supabase.from('donations').update(payload)
      .eq('id', input.id).eq('church_id', profile.church_id));
  } else {
    ({ error } = await supabase.from('donations').insert({ ...payload, church_id: profile.church_id }));
  }
  if (error) return { ok: false, error: error.message };

  const donorIds = new Set([previousDonorId, input.donor_id ?? null]
    .filter((id): id is number => typeof id === 'number'));
  for (const donorId of Array.from(donorIds)) {
    const aggregateError = await refreshDonorTotals(supabase, donorId, profile.church_id);
    if (aggregateError) return { ok: false, error: `Donasi tersimpan, tetapi total donatur gagal diperbarui: ${aggregateError}` };
  }

  revalidatePath('/dashboard/donations');
  return { ok: true };
}

export async function deleteDonation(id: number) {
  const { profile, denied } = await requireRole((r: Role) => canDelete(r), 'Hanya Superadmin yang dapat menghapus data');
  if (denied) return { ok: false, error: denied };
  const supabase = await createClient();
  const { data: existing, error: readError } = await supabase.from('donations')
    .select('donor_id').eq('id', id).eq('church_id', profile.church_id).maybeSingle();
  if (readError) return { ok: false, error: readError.message };

  const { error } = await supabase.from('donations').delete()
    .eq('id', id).eq('church_id', profile.church_id);
  if (error) return { ok: false, error: error.message };

  if (existing?.donor_id) {
    const aggregateError = await refreshDonorTotals(supabase, existing.donor_id, profile.church_id);
    if (aggregateError) return { ok: false, error: `Donasi terhapus, tetapi total donatur gagal diperbarui: ${aggregateError}` };
  }
  revalidatePath('/dashboard/donations');
  return { ok: true };
}

export async function saveDonor(input: { id?: number; nama: string; email?: string; telepon?: string }) {
  const { profile, denied } = await requireRole((r: Role) => (input.id ? canEdit(r) : canAdd(r)));
  if (denied) return { ok: false, error: denied };
  const supabase = await createClient();
  const payload = { nama: input.nama, email: input.email, telepon: input.telepon };
  let error;
  if (input.id) ({ error } = await supabase.from('donors').update(payload)
    .eq('id', input.id).eq('church_id', profile.church_id));
  else ({ error } = await supabase.from('donors').insert({ ...payload, church_id: profile.church_id }));
  if (error) return { ok: false, error: error.message };
  revalidatePath('/dashboard/donations');
  return { ok: true };
}
