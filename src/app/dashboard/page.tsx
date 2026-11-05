import { createClient, getCurrentProfile } from '@/lib/supabase/server';
import { DashboardHome } from '@/components/dashboard/dashboard-home';

export const metadata = { title: 'Dashboard' };

export default async function DashboardPage() {
  const supabase = await createClient();
  const profile = await getCurrentProfile();

  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 864e5).toISOString().slice(0, 10);
  const monthStart = now.toISOString().slice(0, 8) + '01';
  // awal bulan, 5 bulan lalu (total 6 bulan termasuk bulan ini) — untuk chart tren donasi
  const trendStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 5, 1)).toISOString().slice(0, 10);

  const [members, attendanceWeek, donationsMonth, events, groups, volunteers, activities, upcoming, recentDonations, attendanceAll, donationsTrend] = await Promise.all([
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
    supabase.from('donations').select('jumlah, tanggal').gte('tanggal', trendStart),
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

  // tren donasi: 6 bulan terakhir, bulan tanpa donasi tetap tampil (0)
  const byMonth: Record<string, number> = {};
  (donationsTrend.data || []).forEach((d) => {
    const ym = String(d.tanggal).slice(0, 7);
    byMonth[ym] = (byMonth[ym] || 0) + Number(d.jumlah);
  });
  const donationTrend = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 5 + i, 1));
    const ym = d.toISOString().slice(0, 7);
    return { ym, total: byMonth[ym] || 0 };
  });

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
      donationTrend={donationTrend}
    />
  );
}
