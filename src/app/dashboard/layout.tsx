import { redirect } from 'next/navigation';
import { getCurrentProfile } from '@/lib/supabase/server';
import { LangProvider } from '@/components/lang-context';
import { DashboardShell } from '@/components/dashboard/shell';
import type { Role } from '@/lib/rbac';
import { isDemoEmail } from '@/lib/demo-accounts';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const profile = await getCurrentProfile();
  if (!profile) redirect('/login');

  return (
    <LangProvider>
      <DashboardShell
        profile={{
          id: profile.id,
          nama: profile.nama,
          role: profile.role as Role,
          email: profile.email ?? '',
          username: profile.username ?? '',
          avatarUrl: profile.avatar_url ?? null,
          isDemo: isDemoEmail(profile.email),
        }}
        notifications={[]}
      >
        {children}
      </DashboardShell>
    </LangProvider>
  );
}
