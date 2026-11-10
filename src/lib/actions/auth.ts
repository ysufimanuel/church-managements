'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { redirect } from 'next/navigation';
import { t, type Lang } from '@/lib/i18n';

export async function loginAction(prevState: any, formData: FormData) {
  const usernameOrEmail = String(formData.get('username') || '').trim();
  const password = String(formData.get('password') || '');
  const lang: Lang = formData.get('lang') === 'id' ? 'id' : 'en';

  if (!usernameOrEmail || !password) {
    return { error: t(lang, 'login-required') };
  }

  const supabase = await createClient();
  let email = usernameOrEmail.includes('@') ? usernameOrEmail : null;

  // Username lookup must bypass profile RLS only on the server. Never expose
  // a public RPC that returns email addresses to unauthenticated callers.
  if (!email) {
    try {
      const admin = createAdminClient();
      const { data: profile, error: lookupError } = await admin
        .from('profiles')
        .select('email')
        .eq('username', usernameOrEmail)
        .maybeSingle();

      if (lookupError) {
        console.error('[AUTH] Username lookup failed:', lookupError.code);
        return { error: t(lang, 'login-unavailable') };
      }
      email = profile?.email || null;
    } catch {
      // A missing service-role key should not crash the Server Action.
      return { error: t(lang, 'login-username-unconfigured') };
    }
  }

  if (!email) return { error: t(lang, 'login-invalid') };

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError) return { error: t(lang, 'login-invalid') };

  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    const { error: profileUpdateError } = await supabase
      .from('profiles')
      .update({ last_login: new Date().toISOString() })
      .eq('id', user.id);

    if (profileUpdateError) {
      // Login has succeeded; a last-login timestamp must not block access.
      console.error('[AUTH] Failed to update last_login:', profileUpdateError.code);
    }
  }

  redirect('/dashboard');
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}
