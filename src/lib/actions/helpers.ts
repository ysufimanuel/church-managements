'use server';

import { createClient, getCurrentProfile } from '@/lib/supabase/server';
import { canAdd, canDelete, canEdit, canApprove, canManageUsers, type Role } from '@/lib/rbac';
import { revalidatePath } from 'next/cache';

export type ActionResult = { ok: boolean; error?: string };

export async function requireProfile() {
  const profile = await getCurrentProfile();
  if (!profile) throw new Error('Unauthorized');
  return profile;
}

export async function requireRole(check: (r: Role) => boolean, msg = 'Akses ditolak') {
  const profile = await requireProfile();
  if (!check(profile.role as Role)) return { profile, denied: msg };
  return { profile, denied: null };
}

export const guard = { canAdd, canEdit, canDelete, canApprove, canManageUsers };
export { revalidatePath, createClient };
export type { Role };
