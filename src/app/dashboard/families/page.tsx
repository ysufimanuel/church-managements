import { createClient, getCurrentProfile } from '@/lib/supabase/server';
import { FamiliesClient } from '@/components/dashboard/families-client';
import type { Role } from '@/lib/rbac';

export const metadata = { title: 'Families' };

export default async function FamiliesPage() {
  const supabase = await createClient();
  const profile = await getCurrentProfile();
  const [{ data: families }, { data: members }, { data: familyMembers }] = await Promise.all([
    supabase.from('families').select('*').order('nama'),
    supabase.from('members').select('id, nama').order('nama'),
    supabase.from('family_members').select('*'),
  ]);
  return <FamiliesClient families={families || []} members={members || []} familyMembers={familyMembers || []} role={profile!.role as Role} />;
}
