import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export const runtime = 'nodejs';

type Role = 'user' | 'admin' | 'superadmin';
const validRole = (value: unknown): value is Role => value === 'user' || value === 'admin' || value === 'superadmin';
const clean = (value: unknown, max = 160) => String(value ?? '').trim().slice(0, max);

async function authorize(request: Request) {
  const token = request.headers.get('authorization')?.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!token) return { error: 'Unauthorized', status: 401 as const };
  const admin = createAdminClient();
  const { data: authData, error: authError } = await admin.auth.getUser(token);
  if (authError || !authData.user) return { error: 'Sesi tidak valid. Silakan login ulang.', status: 401 as const };
  const { data: profile, error: profileError } = await admin.from('profiles')
    .select('id, church_id, role').eq('id', authData.user.id).maybeSingle();
  if (profileError || !profile || profile.role !== 'superadmin' || !profile.church_id) {
    return { error: 'Hanya Superadmin yang dapat mengelola akun.', status: 403 as const };
  }
  return { admin, actor: profile };
}

export async function GET(request: Request) {
  const auth = await authorize(request);
  if ('error' in auth) return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });
  const { data, error } = await auth.admin.from('profiles')
    .select('id, nama, username, email, role, status, avatar_url, last_login, created_at')
    .eq('church_id', auth.actor.church_id).order('nama');
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true, users: data ?? [] });
}

export async function POST(request: Request) {
  const auth = await authorize(request);
  if ('error' in auth) return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ ok: false, error: 'Format data tidak valid.' }, { status: 400 }); }
  const nama = clean(body.nama, 120), username = clean(body.username, 40).toLowerCase();
  const email = clean(body.email, 160).toLowerCase(), password = String(body.password ?? '');
  const role = body.role;
  const status = body.status === 'nonaktif' ? 'nonaktif' : 'aktif';
  if (!nama || !/^[a-z0-9._-]{3,40}$/.test(username) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 6 || !validRole(role)) {
    return NextResponse.json({ ok: false, error: 'Data user tidak valid. Password minimal 6 karakter.' }, { status: 400 });
  }
  const { data: created, error: createError } = await auth.admin.auth.admin.createUser({
    email, password, email_confirm: true,
    app_metadata: { church_id: auth.actor.church_id, role },
    user_metadata: { nama, username },
  });
  if (createError || !created.user) return NextResponse.json({ ok: false, error: createError?.message ?? 'Gagal membuat user.' }, { status: 400 });
  const { data: profile, error } = await auth.admin.from('profiles').update({
    nama, username, email, role, status, church_id: auth.actor.church_id,
  }).eq('id', created.user.id).select('id').maybeSingle();
  if (error || !profile) {
    await auth.admin.auth.admin.deleteUser(created.user.id);
    return NextResponse.json({ ok: false, error: error?.message ?? 'Profil user gagal dibuat.' }, { status: 400 });
  }
  return NextResponse.json({ ok: true, id: created.user.id }, { status: 201 });
}

export async function PATCH(request: Request) {
  const auth = await authorize(request);
  if ('error' in auth) return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ ok: false, error: 'Format data tidak valid.' }, { status: 400 }); }
  const id = clean(body.id, 64), nama = clean(body.nama, 120);
  const username = clean(body.username, 40).toLowerCase(), email = clean(body.email, 160).toLowerCase();
  const role = body.role, status = body.status === 'nonaktif' ? 'nonaktif' : 'aktif';
  const password = String(body.password ?? '');
  if (!id || !nama || !/^[a-z0-9._-]{3,40}$/.test(username) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !validRole(role) || (password && password.length < 6)) {
    return NextResponse.json({ ok: false, error: 'Data user tidak valid.' }, { status: 400 });
  }
  const { data: target, error: targetError } = await auth.admin.from('profiles')
    .select('id, church_id').eq('id', id).eq('church_id', auth.actor.church_id).maybeSingle();
  if (targetError || !target) return NextResponse.json({ ok: false, error: 'User tidak ditemukan di gereja ini.' }, { status: 404 });
  const { error } = await auth.admin.from('profiles').update({ nama, username, email, role, status })
    .eq('id', id).eq('church_id', auth.actor.church_id);
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
  const { data: authTarget } = await auth.admin.auth.admin.getUserById(id);
  const { error: authUpdateError } = await auth.admin.auth.admin.updateUserById(id, {
    ...(password ? { password } : {}),
    app_metadata: { ...(authTarget.user?.app_metadata ?? {}), church_id: auth.actor.church_id, role },
    user_metadata: { ...(authTarget.user?.user_metadata ?? {}), nama, username },
  });
  if (authUpdateError) return NextResponse.json({ ok: false, error: authUpdateError.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const auth = await authorize(request);
  if ('error' in auth) return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ ok: false, error: 'Format data tidak valid.' }, { status: 400 }); }
  const id = clean(body.id, 64);
  if (!id || id === auth.actor.id) return NextResponse.json({ ok: false, error: 'Akun sendiri tidak dapat dihapus.' }, { status: 400 });
  const { data: target } = await auth.admin.from('profiles')
    .select('id').eq('id', id).eq('church_id', auth.actor.church_id).maybeSingle();
  if (!target) return NextResponse.json({ ok: false, error: 'User tidak ditemukan di gereja ini.' }, { status: 404 });
  const { error } = await auth.admin.auth.admin.deleteUser(id);
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
