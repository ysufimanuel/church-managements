import { createClient, getCurrentProfile } from '@/lib/supabase/server';
import { MembersClient } from '@/components/dashboard/members-client';
import type { Role } from '@/lib/rbac';

export const metadata = { title: 'Members' };

export default async function MembersPage() {
  const supabase = await createClient();
  const profile = await getCurrentProfile();
  const [{ data: members }, { data: groups }] = await Promise.all([
    supabase.from('members').select('*').order('nama'),
    supabase.from('groups').select('id, nama').order('nama'),
  ]);
  return <MembersClient members={members || []} groups={groups || []} role={profile!.role as Role} />;
}
