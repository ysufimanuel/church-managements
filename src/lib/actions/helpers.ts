import 'server-only';

import { revalidatePath } from 'next/cache';
import { createClient, getCurrentProfile } from '@/lib/supabase/server';
import { canAdd, canDelete, canEdit, canApprove, canManageUsers, type Role } from '@/lib/rbac';

export type ActionResult = { ok: boolean; error?: string };

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  try {
    return JSON.stringify(error);
  } catch {
    return 'Unknown server error';
  }
}

export async function requireProfile() {
  try {
    const profile = await getCurrentProfile();
    if (!profile) throw new Error('Unauthorized: session/profile tidak ditemukan');
    return profile;
  } catch (error) {
    console.error('[SERVER ACTION] requireProfile failed:', error);
    throw new Error(`Authorization failed: ${getErrorMessage(error)}`);
  }
}

export async function requireRole(check: (r: Role) => boolean, msg = 'Akses ditolak') {
  const profile = await requireProfile();
  if (!check(profile.role as Role)) return { profile, denied: msg };
  return { profile, denied: null };
}

export async function runAction<T>(actionName: string, action: () => Promise<T>): Promise<T | ActionResult> {
  try {
    return await action();
  } catch (error) {
    console.error(`[SERVER ACTION] ${actionName} failed:`, error);
    return { ok: false, error: getErrorMessage(error) };
  }
}

export const guard = { canAdd, canEdit, canDelete, canApprove, canManageUsers };
export { revalidatePath, createClient };
export type { Role };
