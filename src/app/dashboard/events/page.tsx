import { createClient, getCurrentProfile } from '@/lib/supabase/server';
import { EventsClient } from '@/components/dashboard/events-client';
import type { Role } from '@/lib/rbac';

export const metadata = { title: 'Events' };

export default async function EventsPage() {
  const supabase = await createClient();
  const profile = await getCurrentProfile();
  const [{ data: events }, { data: members }, { data: participants }] = await Promise.all([
    supabase.from('events').select('*').order('start_at', { ascending: false }),
    supabase.from('members').select('id, nama').order('nama'),
    supabase.from('event_participants').select('*'),
  ]);
  return <EventsClient events={events || []} members={members || []} participants={participants || []} role={profile!.role as Role} />;
}
