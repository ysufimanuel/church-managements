import { createClient, getCurrentProfile } from '@/lib/supabase/server';
import { CommunicationClient } from '@/components/dashboard/communication-client';
import type { Role } from '@/lib/rbac';

export const metadata = { title: 'Communication' };

export default async function CommunicationPage() {
  const supabase = await createClient();
  const profile = await getCurrentProfile();
  const [{ data: users }, { data: groups }, { data: messages }, { data: announcements }] = await Promise.all([
    supabase.from('profiles').select('id, nama, role').eq('status', 'aktif').order('nama'),
    supabase.from('groups').select('id, nama'),
    supabase.from('messages').select('*').or(`sender_id.eq.${profile!.id},receiver_id.eq.${profile!.id}`).order('created_at'),
    supabase.from('announcements').select('*').order('tanggal', { ascending: false }),
  ]);
  return (
    <CommunicationClient
      profile={{ id: profile!.id }} users={users || []} groups={groups || []}
      messages={messages || []} announcements={announcements || []}
      role={profile!.role as Role}
    />
  );
}
