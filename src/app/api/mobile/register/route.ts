import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export const runtime = 'nodejs';

const clean = (value: unknown, max = 160) => String(value ?? '').trim().slice(0, max);
const slugify = (value: string) =>
  value.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'gereja';

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ ok: false, error: 'Format data tidak valid.' }, { status: 400 }); }

  const churchName = clean(body.church_name, 120);
  const address = clean(body.church_address, 240);
  const city = clean(body.church_city, 100);
  const phone = clean(body.church_phone, 40);
  const churchEmail = clean(body.church_email, 160).toLowerCase();
  const adminName = clean(body.admin_name, 120);
  const username = clean(body.username, 40).toLowerCase();
  const email = clean(body.admin_email, 160).toLowerCase();
  const password = String(body.password ?? '');

  if (!churchName || !adminName || !username || !email || password.length < 6) {
    return NextResponse.json({ ok: false, error: 'Nama gereja, nama admin, username, email, dan password minimal 6 karakter wajib diisi.' }, { status: 400 });
  }
  if (!/^[a-z0-9._-]{3,40}$/.test(username) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: 'Username atau email tidak valid.' }, { status: 400 });
  }

  const admin = createAdminClient();
  let churchId: string | null = null;
  let userId: string | null = null;
  try {
    const baseSlug = slugify(churchName);
    let slug = baseSlug;
    for (let i = 0; i < 8; i++) {
      const { data: existing, error } = await admin.from('churches').select('id').eq('slug', slug).maybeSingle();
      if (error) throw error;
      if (!existing) break;
      slug = `${baseSlug}-${crypto.randomUUID().slice(0, 5)}`;
    }

    const { data: church, error: churchError } = await admin.from('churches')
      .insert({ slug, nama: churchName, alamat: address || null, kota: city || null, telepon: phone || null, email: churchEmail || null })
      .select('id').single();
    if (churchError || !church) throw churchError ?? new Error('Gagal membuat data gereja.');
    churchId = church.id;

    const setup = await Promise.all([
      admin.from('church_profile').insert({ church_id: churchId, id: 1, nama: churchName, alamat: address || null, kota: city || null, telepon: phone || null, email: churchEmail || null }),
      admin.from('finance_settings').insert({ church_id: churchId, id: 1, saldo_awal: 0 }),
      admin.from('site_theme').insert({ church_id: churchId, id: 1, primary_color: '#00E5FF', font_family: 'Inter', state: 'published', draft: { primary_color: '#00E5FF', font_family: 'Inter' }, published: { primary_color: '#00E5FF', font_family: 'Inter' } }),
      admin.from('site_nav_items').insert([
        { church_id: churchId, label: 'Home', href: '/', visible: true, sort_order: 0, state: 'published' },
        { church_id: churchId, label: 'Events', href: '/events', visible: true, sort_order: 1, state: 'published' },
        { church_id: churchId, label: 'Tentang', href: '/tentang', visible: true, sort_order: 2, state: 'published' },
        { church_id: churchId, label: 'Kontak', href: '/kontak', visible: true, sort_order: 3, state: 'published' },
      ]),
      admin.from('site_sections').insert({
        church_id: churchId, page: 'home', type: 'hero', sort_order: 0,
        content: { title: `Selamat Datang di ${churchName}`, subtitle: 'Website resmi gereja Anda.', cta_label: 'Tentang Kami', cta_href: '/tentang' },
        published: { title: `Selamat Datang di ${churchName}`, subtitle: 'Website resmi gereja Anda.', cta_label: 'Tentang Kami', cta_href: '/tentang' },
        enabled: true,
      }),
    ]);
    const failedSetup = setup.find(result => result.error);
    if (failedSetup?.error) throw failedSetup.error;

    const { data: created, error: createError } = await admin.auth.admin.createUser({
      email, password, email_confirm: true,
      app_metadata: { church_id: churchId, role: 'superadmin' },
      user_metadata: { nama: adminName, username },
    });
    if (createError || !created.user) throw createError ?? new Error('Gagal membuat akun superadmin.');
    userId = created.user.id;

    const { data: profile, error: profileError } = await admin.from('profiles').update({
      nama: adminName, username, email, role: 'superadmin', status: 'aktif', church_id: churchId,
    }).eq('id', userId).select('id').maybeSingle();
    if (profileError || !profile) throw profileError ?? new Error('Profil superadmin gagal dibuat.');

    return NextResponse.json({ ok: true, message: 'Gereja berhasil didaftarkan. Silakan login dengan akun superadmin.' }, { status: 201 });
  } catch (error) {
    if (userId) { try { await admin.auth.admin.deleteUser(userId); } catch { /* best-effort rollback */ } }
    if (churchId) { try { await admin.from('churches').delete().eq('id', churchId); } catch { /* best-effort rollback */ } }
    console.error('[MOBILE_REGISTER]', error);
    const message = error instanceof Error ? error.message : 'Registrasi gagal.';
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
