import { redirect } from 'next/navigation';
import { getCurrentProfile } from '@/lib/supabase/server';
import { LangProvider } from '@/components/lang-context';
import { DashboardShell } from '@/components/dashboard/shell';
import type { Role } from '@/lib/rbac';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const profile = await getCurrentProfile();
  if (!profile) redirect('/login');

  return (
    <LangProvider>
      <DashboardShell
        profile={{ id: profile.id, nama: profile.nama, role: profile.role as Role, avatar_url: profile.avatar_url }}
        notifications={[]}
      >
        {children}
      </DashboardShell>
    </LangProvider>
  );
}
