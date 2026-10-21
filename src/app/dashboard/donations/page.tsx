import { createClient, getCurrentProfile } from '@/lib/supabase/server';
import { DonationsClient } from '@/components/dashboard/donations-client';
import type { Role } from '@/lib/rbac';

export const metadata = { title: 'Donations' };

export default async function DonationsPage() {
  const supabase = await createClient();
  const profile = await getCurrentProfile();
  const [{ data: donations }, { data: donors }] = await Promise.all([
    supabase.from('donations').select('*').order('tanggal', { ascending: false }),
    supabase.from('donors').select('*').order('nama'),
  ]);
  return <DonationsClient donations={donations || []} donors={donors || []} role={profile!.role as Role} />;
}
