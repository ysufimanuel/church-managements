import { redirect } from 'next/navigation';
import { createClient, getCurrentProfile } from '@/lib/supabase/server';
import { UsersClient } from '@/components/dashboard/users-client';
import { canManageUsers, type Role } from '@/lib/rbac';

export const metadata = { title: 'User Management' };

export default async function UsersPage() {
  const profile = await getCurrentProfile();
  if (!canManageUsers(profile?.role as Role)) redirect('/dashboard');
  const supabase = await createClient();
  const { data: users } = await supabase.from('profiles').select('*').order('nama');
  return <UsersClient users={users || []} selfId={profile!.id} />;
}
