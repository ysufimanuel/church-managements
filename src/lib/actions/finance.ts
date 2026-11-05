'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { requireRole, requireProfile } from './helpers';
import { canAdd, canEdit, canDelete, canApprove, type Role } from '@/lib/rbac';

export interface FinanceTrxInput {
  id?: number; tipe: 'pemasukan' | 'pengeluaran';
  kategori_id?: number | null; jumlah: number; tanggal: string;
  keterangan?: string; donatur_id?: number | null;
}

/** Admin & superadmin: buat transaksi baru.
 *  - superadmin: langsung approved
 *  - admin: status pending, menunggu approval superadmin */
export async function saveFinanceTransaction(input: FinanceTrxInput) {
  const { profile, denied } = await requireRole((r: Role) => canAdd(r));
  if (denied) return { ok: false, error: denied };
  const supabase = await createClient();
  const autoApprove = canApprove(profile.role as Role);
  const payload = {
    tipe: input.tipe, kategori_id: input.kategori_id ?? null, jumlah: input.jumlah,
    tanggal: input.tanggal, keterangan: input.keterangan, donatur_id: input.donatur_id ?? null,
    status: autoApprove ? 'approved' : 'pending',
    approved_by: autoApprove ? profile.id : null,
    approved_at: autoApprove ? new Date().toISOString() : null,
    created_by: profile.id,
  };
  let error;
  if (input.id) {
    // hanya transaksi pending yang bisa diedit admin (ditegakkan RLS)
    ({ error } = await supabase.from('finance_transactions')
      .update({ tipe: payload.tipe, kategori_id: payload.kategori_id, jumlah: payload.jumlah,
        tanggal: payload.tanggal, keterangan: payload.keterangan, donatur_id: payload.donatur_id })
      .eq('id', input.id));
  } else {
    ({ error } = await supabase.from('finance_transactions').insert(payload));
  }
  if (error) return { ok: false, error: error.message };
  revalidatePath('/dashboard/finance');
  return { ok: true };
}

export async function approveTransaction(id: number) {
  const { profile, denied } = await requireRole((r: Role) => canApprove(r), 'Hanya Superadmin yang dapat approve');
  if (denied) return { ok: false, error: denied };
  const supabase = await createClient();
  const { data: updated, error } = await supabase.from('finance_transactions')
    .update({ status: 'approved', approved_by: profile.id, approved_at: new Date().toISOString() })
    .eq('id', id).eq('status', 'pending').select('id').maybeSingle();
  if (error) return { ok: false, error: error.message };
  if (!updated) return { ok: false, error: 'Transaksi tidak ditemukan atau sudah diproses sebelumnya' };
  const { error: historyError } = await supabase.from('approval_history')
    .insert({ transaction_id: id, action: 'approved', by_user: profile.id });
  if (historyError) return { ok: false, error: `Transaksi sudah disetujui, tetapi riwayat gagal disimpan: ${historyError.message}` };
  revalidatePath('/dashboard/finance');
  return { ok: true };
}

export async function rejectTransaction(id: number) {
  const { profile, denied } = await requireRole((r: Role) => canApprove(r), 'Hanya Superadmin yang dapat reject');
  if (denied) return { ok: false, error: denied };
  const supabase = await createClient();
  const { data: updated, error } = await supabase.from('finance_transactions')
    .update({ status: 'rejected', approved_by: profile.id, approved_at: new Date().toISOString() })
    .eq('id', id).eq('status', 'pending').select('id').maybeSingle();
  if (error) return { ok: false, error: error.message };
  if (!updated) return { ok: false, error: 'Transaksi tidak ditemukan atau sudah diproses sebelumnya' };
  const { error: historyError } = await supabase.from('approval_history')
    .insert({ transaction_id: id, action: 'rejected', by_user: profile.id });
  if (historyError) return { ok: false, error: `Transaksi sudah ditolak, tetapi riwayat gagal disimpan: ${historyError.message}` };
  revalidatePath('/dashboard/finance');
  return { ok: true };
}

export async function deleteTransaction(id: number) {
  const { denied } = await requireRole((r: Role) => canDelete(r), 'Hanya Superadmin yang dapat menghapus data');
  if (denied) return { ok: false, error: denied };
  const supabase = await createClient();
  const { error } = await supabase.from('finance_transactions').delete().eq('id', id);
  if (error) return { ok: false, error: error.message };
  revalidatePath('/dashboard/finance');
  return { ok: true };
}

export async function saveFinanceCategory(input: { id?: number; nama: string; tipe: 'pemasukan' | 'pengeluaran'; deskripsi?: string }) {
  const { denied } = await requireRole((r: Role) => (input.id ? canEdit(r) : canAdd(r)));
  if (denied) return { ok: false, error: denied };
  const supabase = await createClient();
  const payload = { nama: input.nama, tipe: input.tipe, deskripsi: input.deskripsi };
  let error;
  if (input.id) ({ error } = await supabase.from('finance_categories').update(payload).eq('id', input.id));
  else ({ error } = await supabase.from('finance_categories').insert(payload));
  if (error) return { ok: false, error: error.message };
  revalidatePath('/dashboard/finance');
  return { ok: true };
}

export async function deleteFinanceCategory(id: number) {
  const { denied } = await requireRole((r: Role) => canDelete(r), 'Hanya Superadmin yang dapat menghapus data');
  if (denied) return { ok: false, error: denied };
  const supabase = await createClient();
  const { error } = await supabase.from('finance_categories').delete().eq('id', id);
  if (error) return { ok: false, error: error.message };
  revalidatePath('/dashboard/finance');
  return { ok: true };
}

export async function updateSaldoAwal(saldo: number) {
  const { denied } = await requireRole((r: Role) => canApprove(r), 'Hanya Superadmin');
  if (denied) return { ok: false, error: denied };
  const supabase = await createClient();
  const { error } = await supabase.from('finance_settings').update({ saldo_awal: saldo }).eq('id', 1);
  if (error) return { ok: false, error: error.message };
  revalidatePath('/dashboard/finance');
  return { ok: true };
}
