import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { createAdminClient } from '@/lib/supabase/admin';

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Dipanggil dari Server Component — aman diabaikan
          }
        },
      },
    }
  );
}

/** Ambil profile user yang sedang login (null jika belum login). */
export async function getCurrentProfile() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError) {
    throw new Error(`Auth error: ${authError.message}`);
  }
  if (!user) return null;

  // Jalur normal: baca profile menggunakan session user agar RLS tetap berlaku.
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  if (profile) return profile;

  // Fallback server-only untuk edge-case lookup profile. Ini hanya membaca
  // profile untuk authorization; operasi CRUD tetap memakai client session
  // sehingga RLS database tetap menjadi enforcement terakhir.
  const admin = createAdminClient();
  const { data: adminProfile, error: adminProfileError } = await admin
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  if (adminProfile) return adminProfile;
  if (adminProfileError) {
    throw new Error(`Profile lookup failed: ${adminProfileError.message}`);
  }
  if (profileError) {
    throw new Error(`Profile lookup failed: ${profileError.message}`);
  }

  return null;
}
