import { createClient, getCurrentProfile } from '@/lib/supabase/server';
import { DashboardHome } from '@/components/dashboard/dashboard-home';

export const metadata = { title: 'Dashboard' };

export default async function DashboardPage() {
  const supabase = await createClient();
  const profile = await getCurrentProfile();

  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 864e5).toISOString().slice(0, 10);
  const monthStart = now.toISOString().slice(0, 8) + '01';

  const [members, attendanceWeek, donationsMonth, events, groups, volunteers, activities, upcoming, recentDonations, attendanceAll] = await Promise.all([
    supabase.from('members').select('id, jk, status', { count: 'exact' }),
    supabase.from('attendance').select('id, tanggal').gte('tanggal', weekAgo),
    supabase.from('donations').select('jumlah').gte('tanggal', monthStart),
    supabase.from('events').select('id, status'),
    supabase.from('groups').select('id'),
    supabase.from('volunteers').select('id').eq('status', 'aktif'),
    supabase.from('activities').select('*').order('created_at', { ascending: false }).limit(8),
    supabase.from('events').select('*').in('status', ['upcoming', 'ongoing']).order('start_at').limit(5),
    supabase.from('donations').select('*, donors(nama)').order('tanggal', { ascending: false }).limit(5),
    supabase.from('attendance').select('tanggal'),
  ]);

  // chart kehadiran per hari (7 hari)
  const byDay: Record<string, number> = {};
  (attendanceAll.data || []).forEach((a) => {
    byDay[a.tanggal] = (byDay[a.tanggal] || 0) + 1;
  });
  const attendanceChart = Object.entries(byDay).sort().slice(-7)
    .map(([label, total]) => ({ label: label.slice(5), total }));

  // distribusi jemaat per gender
  const gender: Record<string, number> = {};
  (members.data || []).forEach((m: any) => { gender[m.jk || 'Lainnya'] = (gender[m.jk || 'Lainnya'] || 0) + 1; });
  const memberChart = Object.entries(gender).map(([name, value]) => ({ name, value }));

  return (
    <DashboardHome
      userName={profile?.nama || 'User'}
      stats={{
        totalMembers: members.count || 0,
        attendanceWeek: (attendanceWeek.data || []).length,
        donationsMonth: (donationsMonth.data || []).reduce((s, d) => s + Number(d.jumlah), 0),
        activeEvents: (events.data || []).filter((e) => e.status !== 'completed').length,
        totalGroups: (groups.data || []).length,
        activeVolunteers: (volunteers.data || []).length,
      }}
      activities={activities.data || []}
      upcomingEvents={upcoming.data || []}
      recentDonations={(recentDonations.data || []) as any}
      attendanceChart={attendanceChart}
      memberChart={memberChart}
    />
  );
}
