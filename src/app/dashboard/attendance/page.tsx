import { createClient, getCurrentProfile } from '@/lib/supabase/server';
import { AttendanceClient } from '@/components/dashboard/attendance-client';
import type { Role } from '@/lib/rbac';

export const metadata = { title: 'Attendance' };

export default async function AttendancePage() {
  const supabase = await createClient();
  const profile = await getCurrentProfile();
  const [{ data: events }, { data: members }, { data: attendance }] = await Promise.all([
    supabase.from('events').select('id, nama, status').order('start_at', { ascending: false }),
    supabase.from('members').select('id, nama').order('nama'),
    supabase.from('attendance').select('*').order('tanggal', { ascending: false }),
  ]);
  return <AttendanceClient events={events || []} members={members || []} attendance={attendance || []} role={profile!.role as Role} />;
}
