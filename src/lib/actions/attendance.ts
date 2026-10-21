'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { requireRole } from './helpers';
import { canAdd, canDelete, type Role } from '@/lib/rbac';

export async function checkInMember(eventId: number, memberId: number) {
  const { denied } = await requireRole((r: Role) => canAdd(r));
  if (denied) return { ok: false, error: denied };
  const supabase = await createClient();
  const now = new Date();
  const { error } = await supabase.from('attendance').upsert({
    event_id: eventId,
    member_id: memberId,
    tanggal: now.toISOString().slice(0, 10),
    waktu: now.toTimeString().slice(0, 8),
    status: 'hadir',
  }, { onConflict: 'event_id,member_id,tanggal' });
  if (error) return { ok: false, error: error.message };
  revalidatePath('/dashboard/attendance');
  return { ok: true };
}

export async function deleteAttendance(id: number) {
  const { denied } = await requireRole((r: Role) => canDelete(r), 'Hanya Superadmin yang dapat menghapus data');
  if (denied) return { ok: false, error: denied };
  const supabase = await createClient();
  const { error } = await supabase.from('attendance').delete().eq('id', id);
  if (error) return { ok: false, error: error.message };
  revalidatePath('/dashboard/attendance');
  return { ok: true };
}
