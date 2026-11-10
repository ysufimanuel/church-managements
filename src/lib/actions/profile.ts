'use server';

import { revalidatePath } from 'next/cache';
import { createClient, getCurrentProfile } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { isDemoEmail } from '@/lib/demo-accounts';
import { t, type Lang } from '@/lib/i18n';

type Result = { ok: boolean; error?: string; avatarUrl?: string | null };

const L = (v: unknown): Lang => (v === 'id' ? 'id' : 'en');

export async function updateProfileAction(input: {
  nama: string;
  username: string;
  avatarUrl?: string | null; // undefined = unchanged, null = remove
  lang?: string;
}): Promise<Result> {
  const lang = L(input.lang);
  try {
    const profile = await getCurrentProfile();
    if (!profile) return { ok: false, error: t(lang, 'login-invalid') };
    if (isDemoEmail(profile.email)) return { ok: false, error: t(lang, 'profile-demo-locked') };

    const nama = input.nama.trim().slice(0, 100);
    const username = input.username.trim().toLowerCase().slice(0, 40);
    if (!nama) return { ok: false, error: t(lang, 'full-name') + ' *' };
    if (username && !/^[a-z0-9._-]{3,40}$/.test(username)) return { ok: false, error: t(lang, 'username') + ' (a-z, 0-9, . _ -)' };

    const patch: Record<string, unknown> = { nama, username: username || null };

    if (input.avatarUrl !== undefined) {
      if (input.avatarUrl === null) {
        patch.avatar_url = null;
      } else {
        const base = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${profile.id}/`;
        if (!input.avatarUrl.startsWith(base)) return { ok: false, error: t(lang, 'upload-failed') };
        patch.avatar_url = input.avatarUrl;
      }
    }

    // Only the signed-in user's own row, and only these whitelisted columns.
    const admin = createAdminClient();
    const { error } = await admin.from('profiles').update(patch).eq('id', profile.id);
    if (error) {
      console.error('[PROFILE] update failed:', error.code);
      return { ok: false, error: error.code === '23505' ? t(lang, 'username') + ' ✕' : t(lang, 'upload-failed') };
    }
    revalidatePath('/dashboard', 'layout');
    return { ok: true, avatarUrl: (patch.avatar_url as string | null | undefined) ?? undefined };
  } catch (e) {
    console.error('[PROFILE] update error:', e);
    return { ok: false, error: t(lang, 'upload-failed') };
  }
}

export async function changePasswordAction(input: {
  current: string;
  next: string;
  lang?: string;
}): Promise<Result> {
  const lang = L(input.lang);
  try {
    const profile = await getCurrentProfile();
    if (!profile) return { ok: false, error: t(lang, 'login-invalid') };
    if (isDemoEmail(profile.email)) return { ok: false, error: t(lang, 'profile-demo-locked') };
    if (input.next.length < 6) return { ok: false, error: t(lang, 'password-min') };

    const supabase = await createClient();
    const { error: verifyError } = await supabase.auth.signInWithPassword({ email: profile.email, password: input.current });
    if (verifyError) return { ok: false, error: t(lang, 'password-wrong') };

    const { error } = await supabase.auth.updateUser({ password: input.next });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (e) {
    console.error('[PROFILE] password error:', e);
    return { ok: false, error: t(lang, 'upload-failed') };
  }
}
