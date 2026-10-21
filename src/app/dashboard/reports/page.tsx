import { createClient } from '@/lib/supabase/server';
import { ReportsClient } from '@/components/dashboard/reports-client';

export const metadata = { title: 'Reports' };

export default async function ReportsPage() {
  const supabase = await createClient();
  const [members, attendance, donations, events, groups, volunteers] = await Promise.all([
    supabase.from('members').select('*'),
    supabase.from('attendance').select('*'),
    supabase.from('donations').select('*'),
    supabase.from('events').select('*'),
    supabase.from('groups').select('*'),
    supabase.from('volunteers').select('*'),
  ]);
  return (
    <ReportsClient
      members={members.data || []} attendance={attendance.data || []}
      donations={donations.data || []} events={events.data || []}
      groups={groups.data || []} volunteers={volunteers.data || []}
    />
  );
}
