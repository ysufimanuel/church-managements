'use server';

import { revalidatePath } from 'next/cache';
import { getCurrentProfile } from '@/lib/supabase/server';
import { requireRole } from './helpers';
import { canManageUsers, type Role } from '@/lib/rbac';

export interface UserInput {
  id?: string; nama: string; username: string; email: string;
  password?: string; role: 'user' | 'admin' | 'superadmin'; status?: string;
}

export async function saveUser(input: UserInput) {
  const { denied } = await requireRole((r: Role) => canManageUsers(r), 'Hanya Superadmin');
  if (denied) return { ok: false, error: denied };
  const profile = await getCurrentProfile();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!serviceKey || !url) return { ok: false, error: 'SUPABASE_SERVICE_ROLE_KEY belum diset' };
  const { createClient: createAdmin } = await import('@supabase/supabase-js');
  const admin = createAdmin(url, serviceKey, { auth: { persistSession: false } });

  if (!input.id) {
    if (!input.password) return { ok: false, error: 'Password wajib untuk user baru' };
    const { error } = await admin.auth.admin.createUser({
      email: input.email, password: input.password, email_confirm: true,
      app_metadata: { church_id: profile!.church_id, role: input.role },
      user_metadata: { nama: input.nama, username: input.username },
    });
    if (error) return { ok: false, error: error.message };
  } else {
    const { data: target } = await admin.from('profiles').select('church_id, role').eq('id', input.id).maybeSingle();
    if (!target || target.church_id !== profile!.church_id) return { ok: false, error: 'User berasal dari gereja lain atau tidak ditemukan' };
    if (input.id === profile!.id && input.role !== 'superadmin') {
      return { ok: false, error: 'Superadmin tidak dapat menurunkan role akunnya sendiri' };
    }
    if (target.role === 'superadmin' && input.role !== 'superadmin') {
      const { count, error: countError } = await admin.from('profiles')
        .select('id', { count: 'exact', head: true })
        .eq('church_id', profile!.church_id).eq('role', 'superadmin');
      if (countError) return { ok: false, error: countError.message };
      if ((count ?? 0) <= 1) return { ok: false, error: 'Tidak dapat menurunkan role Superadmin terakhir di gereja ini' };
    }
    const { error } = await admin.from('profiles').update({
      nama: input.nama, username: input.username, email: input.email,
      role: input.role, status: input.status ?? 'aktif',
    }).eq('id', input.id).eq('church_id', profile!.church_id);
    if (error) return { ok: false, error: error.message };
    if (input.password) {
      const { error: passwordError } = await admin.auth.admin.updateUserById(input.id, { password: input.password });
      if (passwordError) return { ok: false, error: `Profil tersimpan, tetapi password gagal diperbarui: ${passwordError.message}` };
    }
    const { error: metadataError } = await admin.auth.admin.updateUserById(input.id, {
      app_metadata: { church_id: profile!.church_id, role: input.role },
    });
    if (metadataError) return { ok: false, error: `Profil tersimpan, tetapi metadata autentikasi gagal diperbarui: ${metadataError.message}` };
  }
  revalidatePath('/dashboard/users');
  return { ok: true };
}

export async function deleteUser(id: string) {
  const { denied } = await requireRole((r: Role) => canManageUsers(r), 'Hanya Superadmin');
  if (denied) return { ok: false, error: denied };
  const profile = await getCurrentProfile();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!serviceKey || !url) return { ok: false, error: 'SUPABASE_SERVICE_ROLE_KEY belum diset' };
  const { createClient: createAdmin } = await import('@supabase/supabase-js');
  const admin = createAdmin(url, serviceKey, { auth: { persistSession: false } });
  if (id === profile!.id) return { ok: false, error: 'Superadmin tidak dapat menghapus akunnya sendiri' };
  const { data: target } = await admin.from('profiles').select('church_id, role').eq('id', id).maybeSingle();
  if (!target || target.church_id !== profile!.church_id) return { ok: false, error: 'User berasal dari gereja lain atau tidak ditemukan' };
  if (target.role === 'superadmin') {
    const { count, error: countError } = await admin.from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('church_id', profile!.church_id).eq('role', 'superadmin');
    if (countError) return { ok: false, error: countError.message };
    if ((count ?? 0) <= 1) return { ok: false, error: 'Tidak dapat menghapus Superadmin terakhir di gereja ini' };
  }
  const { error } = await admin.auth.admin.deleteUser(id);
  if (error) return { ok: false, error: error.message };
  revalidatePath('/dashboard/users');
  return { ok: true };
}
