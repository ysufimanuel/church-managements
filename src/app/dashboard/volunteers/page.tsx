import { createClient, getCurrentProfile } from '@/lib/supabase/server';
import { VolunteersClient } from '@/components/dashboard/volunteers-client';
import type { Role } from '@/lib/rbac';

export const metadata = { title: 'Volunteers' };

export default async function VolunteersPage() {
  const supabase = await createClient();
  const profile = await getCurrentProfile();
  const [{ data: volunteers }, { data: members }, { data: events }, { data: assignments }] = await Promise.all([
    supabase.from('volunteers').select('*').order('created_at', { ascending: false }),
    supabase.from('members').select('id, nama').order('nama'),
    supabase.from('events').select('id, nama').order('start_at', { ascending: false }),
    supabase.from('volunteer_assignments').select('*').order('tanggal', { ascending: false }),
  ]);
  return <VolunteersClient volunteers={volunteers || []} members={members || []} events={events || []} assignments={assignments || []} role={profile!.role as Role} />;
}
