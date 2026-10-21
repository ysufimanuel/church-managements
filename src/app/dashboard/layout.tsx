import { redirect } from 'next/navigation';
import { getCurrentProfile, createClient } from '@/lib/supabase/server';
import { LangProvider } from '@/components/lang-context';
import { DashboardShell } from '@/components/dashboard/shell';
import type { Role } from '@/lib/rbac';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const profile = await getCurrentProfile();
  if (!profile) redirect('/login');

  const supabase = await createClient();
  const { data: notifications } = await supabase
    .from('notifications')
    .select('id, title, message, type, read, created_at')
    .or(`user_id.is.null,user_id.eq.${profile.id}`)
    .order('created_at', { ascending: false })
    .limit(30);

  return (
    <LangProvider>
      <DashboardShell
        profile={{ id: profile.id, nama: profile.nama, role: profile.role as Role }}
        notifications={notifications || []}
      >
        {children}
      </DashboardShell>
    </LangProvider>
  );
}
