import { createClient, getCurrentProfile } from '@/lib/supabase/server';
import { GroupsClient } from '@/components/dashboard/groups-client';
import type { Role } from '@/lib/rbac';

export const metadata = { title: 'Groups' };

export default async function GroupsPage() {
  const supabase = await createClient();
  const profile = await getCurrentProfile();
  const [{ data: groups }, { data: members }, { data: groupMembers }] = await Promise.all([
    supabase.from('groups').select('*').order('nama'),
    supabase.from('members').select('id, nama').order('nama'),
    supabase.from('group_members').select('*'),
  ]);
  return <GroupsClient groups={groups || []} members={members || []} groupMembers={groupMembers || []} role={profile!.role as Role} />;
}
