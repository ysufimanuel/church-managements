import Link from 'next/link';
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
  const publicPath = church ? `/site/${church.slug}` : null;
  const publicOrigin = process.env.NEXT_PUBLIC_SITE_URL || 'https://church-managements-system.vercel.app';
  const publicUrl = publicPath ? `${publicOrigin}${publicPath}` : null;
  return (
    <div className="space-y-4">
      {publicUrl && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-card px-4 py-3">
          <div className="min-w-0">
            <p className="text-sm font-semibold">Website Publik Gereja</p>
            <p className="truncate text-xs text-muted-foreground">{publicUrl}</p>
          </div>
          <Link href={publicPath!} target="_blank" className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90">
            Buka Website Publik
          </Link>
        </div>
      )}
      <WebManagerClient
        navItems={navItems || []}
        theme={theme}
        media={media || []}
        sections={sections || []}
        role={profile!.role as Role}
        publicPath={publicPath}
        websiteThemePreference={theme?.draft?.website_theme === 'default' ? 'default' : 'cms'}
      />
    </div>
  );
}
