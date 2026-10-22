'use server';

import { redirect } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';

function slugify(value: string) {
  return value.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'gereja';
}

export async function registerChurchAction(_prevState: { error?: string; success?: string } | null, formData: FormData) {
  const churchName = String(formData.get('church_name') || '').trim(); const address = String(formData.get('church_address') || '').trim(); const city = String(formData.get('church_city') || '').trim(); const phone = String(formData.get('church_phone') || '').trim(); const churchEmail = String(formData.get('church_email') || '').trim().toLowerCase(); const adminName = String(formData.get('admin_name') || '').trim(); const username = String(formData.get('username') || '').trim(); const email = String(formData.get('admin_email') || '').trim().toLowerCase(); const password = String(formData.get('password') || '');
  if (!churchName || !adminName || !username || !email || password.length < 6) return { error: 'Nama gereja, nama admin, username, email, dan password minimal 6 karakter wajib diisi.' };
  const admin = createAdminClient(); let churchId: string | null = null; let createdUserId: string | null = null;
  try {
    const baseSlug = slugify(churchName); let slug = baseSlug;
    for (let i = 0; i < 5; i++) { const { data: existing } = await admin.from('churches').select('id').eq('slug', slug).maybeSingle(); if (!existing) break; slug = `${baseSlug}-${Math.random().toString(36).slice(2, 7)}`; }
    const { data: church, error: churchError } = await admin.from('churches').insert({ slug, nama: churchName, alamat: address || null, kota: city || null, telepon: phone || null, email: churchEmail || null }).select('id, slug').single();
    if (churchError || !church) return { error: churchError?.message || 'Gagal membuat data gereja.' }; churchId = church.id;
    const { error: profileError } = await admin.from('church_profile').insert({ church_id: church.id, id: 1, nama: churchName, alamat: address || null, kota: city || null, telepon: phone || null, email: churchEmail || null });
    if (profileError) throw new Error(profileError.message);
    const { error: financeError } = await admin.from('finance_settings').insert({ church_id: church.id, id: 1, saldo_awal: 0 }); if (financeError) throw new Error(financeError.message);
    const { error: themeError } = await admin.from('site_theme').insert({ church_id: church.id, id: 1, primary_color: '#00E5FF', font_family: 'Inter', state: 'published', draft: { primary_color: '#00E5FF', font_family: 'Inter' }, published: { primary_color: '#00E5FF', font_family: 'Inter' } }); if (themeError) throw new Error(themeError.message);
    const { error: navError } = await admin.from('site_nav_items').insert([{ church_id: church.id, label: 'Home', href: '/', visible: true, sort_order: 0, state: 'published' }, { church_id: church.id, label: 'Events', href: '/events', visible: true, sort_order: 1, state: 'published' }, { church_id: church.id, label: 'Tentang', href: '/tentang', visible: true, sort_order: 2, state: 'published' }, { church_id: church.id, label: 'Kontak', href: '/kontak', visible: true, sort_order: 3, state: 'published' }]); if (navError) throw new Error(navError.message);
    const defaultContent = { title: `Selamat Datang di ${churchName}`, subtitle: 'Website resmi gereja Anda.', cta_label: 'Tentang Kami', cta_href: '/tentang' };
    const { error: sectionError } = await admin.from('site_sections').insert({ church_id: church.id, page: 'home', type: 'hero', sort_order: 0, content: defaultContent, published: defaultContent, enabled: true }); if (sectionError) throw new Error(sectionError.message);
    const { data: createdUser, error: userError } = await admin.auth.admin.createUser({ email, password, email_confirm: true, app_metadata: { church_id: church.id, role: 'superadmin' }, user_metadata: { nama: adminName, username } });
    if (userError || !createdUser.user) throw new Error(userError?.message || 'Gagal membuat akun superadmin.'); createdUserId = createdUser.user.id;
    const { error: updateProfileError } = await admin.from('profiles').update({ nama: adminName, username, email, role: 'superadmin', status: 'aktif', church_id: church.id }).eq('id', createdUser.user.id);
    if (updateProfileError) throw new Error(updateProfileError.message);
    const supabase = await createClient(); const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
    if (loginError) return { success: 'Gereja berhasil didaftarkan. Silakan login dengan akun superadmin Anda.' };
  } catch (error) {
    if (createdUserId) await admin.auth.admin.deleteUser(createdUserId);
    if (churchId) await admin.from('churches').delete().eq('id', churchId);
    return { error: error instanceof Error ? error.message : 'Registrasi gagal.' };
  }
  redirect('/dashboard');
}
