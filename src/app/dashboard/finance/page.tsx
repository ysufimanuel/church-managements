import { createClient, getCurrentProfile } from '@/lib/supabase/server';
import { FinanceClient } from '@/components/dashboard/finance-client';
import type { Role } from '@/lib/rbac';

export const metadata = { title: 'Finance' };

export default async function FinancePage() {
  const supabase = await createClient();
  const profile = await getCurrentProfile();
  const [{ data: transactions }, { data: categories }, { data: settings }, { data: history }, { data: donors }] = await Promise.all([
    supabase.from('finance_transactions').select('*').order('tanggal', { ascending: false }),
    supabase.from('finance_categories').select('*').order('nama'),
    supabase.from('finance_settings').select('*').eq('id', 1).maybeSingle(),
    supabase.from('approval_history').select('*').order('created_at', { ascending: false }).limit(50),
    supabase.from('donors').select('id, nama').order('nama'),
  ]);
  return (
    <FinanceClient
      transactions={transactions || []} categories={categories || []}
      settings={settings} history={history || []} donors={donors || []}
      role={profile!.role as Role}
    />
  );
}
