'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { requireRole, requireProfile } from './helpers';
import { canAdd, canEdit, canDelete, type Role } from '@/lib/rbac';

// ---------- PESAN (CHAT) ----------
export async function sendMessage(receiverId: string, content: string) {
  const profile = await requireProfile();
  if (!content.trim()) return { ok: false, error: 'Pesan kosong' };
  const supabase = await createClient();
  const { error } = await supabase.from('messages')
    .insert({ sender_id: profile.id, receiver_id: receiverId, content });
  if (error) return { ok: false, error: error.message };
  revalidatePath('/dashboard/communication');
  return { ok: true };
}

export async function markMessageRead(messageId: number) {
  const supabase = await createClient();
  await supabase.from('messages').update({ read: true }).eq('id', messageId);
  return { ok: true };
}

// ---------- PENGUMUMAN ----------
export interface AnnouncementInput {
  id?: number; judul: string; konten: string; expiry?: string; important?: boolean;
}

export async function saveAnnouncement(input: AnnouncementInput) {
  const { profile, denied } = await requireRole((r: Role) => (input.id ? canEdit(r) : canAdd(r)));
  if (denied) return { ok: false, error: denied };
  const supabase = await createClient();
  const payload = {
    judul: input.judul, konten: input.konten,
    expiry: input.expiry || null, important: input.important ?? false,
  };
  let error;
  if (input.id) {
    ({ error } = await supabase.from('announcements').update(payload).eq('id', input.id));
  } else {
    ({ error } = await supabase.from('announcements')
      .insert({ ...payload, author_id: profile.id }));
  }
  if (error) return { ok: false, error: error.message };
  revalidatePath('/dashboard/communication');
  return { ok: true };
}

export async function deleteAnnouncement(id: number) {
  const { denied } = await requireRole((r: Role) => canDelete(r), 'Hanya Superadmin yang dapat menghapus data');
  if (denied) return { ok: false, error: denied };
  const supabase = await createClient();
  const { error } = await supabase.from('announcements').delete().eq('id', id);
  if (error) return { ok: false, error: error.message };
  revalidatePath('/dashboard/communication');
  return { ok: true };
}

// ---------- BROADCAST ----------
export async function saveBroadcast(input: {
  id?: number; subject: string; message: string; recipients: string; groupIds?: number[]; send?: boolean;
}) {
  const { denied } = await requireRole((r: Role) => canAdd(r));
  if (denied) return { ok: false, error: denied };
  const supabase = await createClient();
  const payload = {
    subject: input.subject, message: input.message, recipients: input.recipients,
    group_ids: input.groupIds ?? null,
    status: input.send ? 'sent' : 'draft',
    sent_at: input.send ? new Date().toISOString() : null,
  };
  let error;
  if (input.id) ({ error } = await supabase.from('broadcasts').update(payload).eq('id', input.id));
  else ({ error } = await supabase.from('broadcasts').insert(payload));
  if (error) return { ok: false, error: error.message };

  if (input.send) {
    // Buat notifikasi broadcast ke semua user (in-app). Pengiriman email nyata
    // dapat dihubungkan ke provider (Resend/SMTP) di titik ini.
    await supabase.from('notifications').insert({
      title: input.subject, message: input.message.slice(0, 120), type: 'broadcast',
    });
  }
  revalidatePath('/dashboard/communication');
  return { ok: true };
}

// ---------- NOTIFIKASI ----------
export async function markNotificationRead(id: number) {
  const supabase = await createClient();
  await supabase.from('notifications').update({ read: true }).eq('id', id);
  return { ok: true };
}

export async function markAllNotificationsRead() {
  const profile = await requireProfile();
  const supabase = await createClient();
  await supabase.from('notifications').update({ read: true })
    .or(`user_id.is.null,user_id.eq.${profile.id}`).eq('read', false);
  revalidatePath('/dashboard');
  return { ok: true };
}
