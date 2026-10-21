'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function loginAction(prevState: any, formData: FormData) {
  const username = String(formData.get('username') || '').trim();
  const password = String(formData.get('password') || '');
  const supabase = await createClient();

  // username -> email lookup via profiles
  const { data: profile } = await supabase
    .from('profiles').select('email').eq('username', username).maybeSingle();
  const email = profile?.email || (username.includes('@') ? username : null);
  if (!email) return { error: 'Username tidak ditemukan' };

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: 'Username atau password salah' };

  await supabase.from('profiles').update({ last_login: new Date().toISOString() })
    .eq('username', username);
  redirect('/dashboard');
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}
