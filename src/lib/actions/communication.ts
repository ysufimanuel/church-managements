'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { requireRole, requireProfile } from './helpers';
import { canAdd, canEdit, canDelete, type Role } from '@/lib/rbac';

// ---------- PESAN (CHAT) ----------
export async function sendMessage(receiverId: string, content: string) {
  const profile = await requireProfile();
  const trimmedContent = content.trim();
  if (!trimmedContent) return { ok: false, error: 'Pesan kosong' };
  if (!receiverId || receiverId === profile.id) return { ok: false, error: 'Penerima pesan tidak valid' };

  const supabase = await createClient();
  const { error } = await supabase.from('messages').insert({
    sender_id: profile.id,
    receiver_id: receiverId,
    church_id: profile.church_id,
    content: trimmedContent,
  });
  if (error) return { ok: false, error: error.message };
  revalidatePath('/dashboard/communication');
  return { ok: true };
}

export async function markMessageRead(messageId: number) {
  const profile = await requireProfile();
  const supabase = await createClient();
  const { error } = await supabase.from('messages')
    .update({ read: true })
    .eq('id', messageId)
    .eq('receiver_id', profile.id)
    .eq('church_id', profile.church_id);
  if (error) return { ok: false, error: error.message };
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
    ({ error } = await supabase.from('announcements').update(payload)
      .eq('id', input.id).eq('church_id', profile.church_id));
  } else {
    ({ error } = await supabase.from('announcements')
      .insert({ ...payload, author_id: profile.id, church_id: profile.church_id }));
  }
  if (error) return { ok: false, error: error.message };
  revalidatePath('/dashboard/communication');
  return { ok: true };
}

export async function deleteAnnouncement(id: number) {
  const { profile, denied } = await requireRole((r: Role) => canDelete(r), 'Hanya Superadmin yang dapat menghapus data');
  if (denied) return { ok: false, error: denied };
  const supabase = await createClient();
  const { error } = await supabase.from('announcements').delete()
    .eq('id', id).eq('church_id', profile.church_id);
  if (error) return { ok: false, error: error.message };
  revalidatePath('/dashboard/communication');
  return { ok: true };
}

// ---------- BROADCAST ----------
export async function saveBroadcast(input: {
  subject: string; message: string; recipients: string; groupIds?: number[]; send?: boolean;
}) {
  const { denied } = await requireRole((r: Role) => canAdd(r));
  if (denied) return { ok: false, error: denied };
  if (input.recipients !== 'all') {
    return { ok: false, error: 'Pengiriman ke grup atau penerima khusus belum didukung karena akun CMS belum terhubung ke data anggota.' };
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc('create_broadcast_with_notifications', {
    p_subject: input.subject.trim(),
    p_message: input.message.trim(),
    p_recipients: 'all',
    p_send: Boolean(input.send),
  });
  if (error) return { ok: false, error: error.message };
  revalidatePath('/dashboard/communication');
  revalidatePath('/dashboard');
  return { ok: true };
}

// ---------- NOTIFIKASI ----------
export async function markNotificationRead(id: number) {
  const profile = await requireProfile();
  const supabase = await createClient();
  const { error } = await supabase.from('notifications').update({ read: true })
    .eq('id', id).eq('user_id', profile.id).eq('church_id', profile.church_id);
  if (error) return { ok: false, error: error.message };
  revalidatePath('/dashboard');
  return { ok: true };
}

export async function markAllNotificationsRead() {
  const profile = await requireProfile();
  const supabase = await createClient();
  const { error } = await supabase.from('notifications').update({ read: true })
    .eq('user_id', profile.id).eq('church_id', profile.church_id).eq('read', false);
  if (error) return { ok: false, error: error.message };
  revalidatePath('/dashboard');
  return { ok: true };
}
