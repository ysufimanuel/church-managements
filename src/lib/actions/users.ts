'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { requireRole } from './helpers';
import { canManageUsers, type Role } from '@/lib/rbac';

export interface UserInput {
  id?: string; nama: string; username: string; email: string;
  password?: string; role: 'user' | 'admin' | 'superadmin'; status?: string;
}

/** Manajemen user — khusus superadmin.
 *  Catatan: pembuatan user auth memakai admin API butuh service role key
 *  (SUPABASE_SERVICE_ROLE_KEY di env server). */
export async function saveUser(input: UserInput) {
  const { denied } = await requireRole((r: Role) => canManageUsers(r), 'Hanya Superadmin');
  if (denied) return { ok: false, error: denied };

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!serviceKey || !url) return { ok: false, error: 'SUPABASE_SERVICE_ROLE_KEY belum diset' };

  const { createClient: createAdmin } = await import('@supabase/supabase-js');
  const admin = createAdmin(url, serviceKey, { auth: { persistSession: false } });

  if (!input.id) {
    if (!input.password) return { ok: false, error: 'Password wajib untuk user baru' };
    const { error } = await admin.auth.admin.createUser({
      email: input.email, password: input.password, email_confirm: true,
      user_metadata: { nama: input.nama, username: input.username, role: input.role },
    });
    if (error) return { ok: false, error: error.message };
  } else {
    const { error } = await admin.from('profiles').update({
      nama: input.nama, username: input.username, email: input.email,
      role: input.role, status: input.status ?? 'aktif',
    }).eq('id', input.id);
    if (error) return { ok: false, error: error.message };
    if (input.password) {
      await admin.auth.admin.updateUserById(input.id, { password: input.password });
    }
  }
  revalidatePath('/dashboard/users');
  return { ok: true };
}

export async function deleteUser(id: string) {
  const { denied } = await requireRole((r: Role) => canManageUsers(r), 'Hanya Superadmin');
  if (denied) return { ok: false, error: denied };
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!serviceKey || !url) return { ok: false, error: 'SUPABASE_SERVICE_ROLE_KEY belum diset' };
  const { createClient: createAdmin } = await import('@supabase/supabase-js');
  const admin = createAdmin(url, serviceKey, { auth: { persistSession: false } });
  const { error } = await admin.auth.admin.deleteUser(id);
  if (error) return { ok: false, error: error.message };
  revalidatePath('/dashboard/users');
  return { ok: true };
}
