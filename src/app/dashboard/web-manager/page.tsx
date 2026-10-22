import { redirect } from 'next/navigation';
import { createClient, getCurrentProfile } from '@/lib/supabase/server';
import { WebManagerClient } from '@/components/dashboard/web-manager-client';
import { canUseWebManager, type Role } from '@/lib/rbac';

export const metadata = { title: 'Web Manager' };

export default async function WebManagerPage() {
  const profile = await getCurrentProfile();
  if (!canUseWebManager(profile?.role as Role)) redirect('/dashboard');
  const supabase = await createClient();
  const [{ data: navItems }, { data: theme }, { data: media }, { data: sections }, { data: church }] = await Promise.all([
    supabase.from('site_nav_items').select('*').order('sort_order'),
    supabase.from('site_theme').select('*').eq('id', 1).maybeSingle(),
    supabase.from('site_media').select('*').order('sort_order'),
    supabase.from('site_sections').select('*').order('sort_order'),
    supabase.from('churches').select('slug').eq('id', profile!.church_id).maybeSingle(),
  ]);
  return (
    <WebManagerClient
      navItems={navItems || []} theme={theme} media={media || []}
      sections={sections || []} role={profile!.role as Role}
      publicUrl={church ? `/site/${church.slug}` : null}
    />
  );
}
