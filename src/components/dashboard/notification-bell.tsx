'use client';

import * as React from 'react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { Bell, Check, CheckCheck, MessageSquare, Database } from 'lucide-react';
import { timeAgo } from '@/lib/utils';
import { markAllNotificationsRead, markNotificationRead } from '@/lib/actions/communication';
import { useLang } from '@/components/lang-context';

export type Notif = {
  id: number; title: string; message: string; type: string; read: boolean; created_at: string;
};

/** Bell notifikasi dengan Supabase Realtime:
 *  - pesan chat baru / perubahan data -> toast + update badge real-time */
export function NotificationBell({ initial, userId }: { initial: Notif[]; userId: string }) {
  const { t } = useLang();
  const [items, setItems] = React.useState<Notif[]>(initial);
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    let active = true;
    const supabase = createClient();
    void supabase
      .from('notifications')
      .select('id, title, message, type, read, created_at')
      .or(`user_id.is.null,user_id.eq.${userId}`)
      .order('created_at', { ascending: false })
      .limit(30)
      .then(({ data, error }) => {
        if (!active || error || !data) return;
        setItems(data as Notif[]);
      });
    return () => { active = false; };
  }, [userId]);

  React.useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel('notif-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' }, (payload) => {
        const n = payload.new as Notif & { user_id: string | null };
        if (n.user_id && n.user_id !== userId) return;
        setItems((prev) => [{ id: n.id, title: n.title, message: n.message, type: n.type, read: n.read, created_at: n.created_at }, ...prev]);
        toast(n.title, { description: n.message, icon: n.type === 'message' ? <MessageSquare className="h-4 w-4" /> : <Database className="h-4 w-4" /> });
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [userId]);

  React.useEffect(() => {
    const close = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const unread = items.filter((i) => !i.read).length;

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(!open)} aria-label={t('notifications')}
        className="btn-fx btn-fx-ghost relative flex h-11 w-11 items-center justify-center rounded-md hover:bg-secondary cursor-pointer">
        <Bell className="h-5 w-5" />
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-white">
            {unread > 99 ? '99+' : unread}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 max-w-[90vw] glass-strong rounded-lg shadow-xl">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <h3 className="font-semibold">{t('notifications')}</h3>
            <button onClick={async () => { await markAllNotificationsRead(); setItems((p) => p.map((i) => ({ ...i, read: true }))); }}
              className="btn-fx btn-fx-row flex items-center gap-1 text-xs text-primary hover:underline cursor-pointer">
              <CheckCheck className="h-3 w-3" /> {t('mark-read')}
            </button>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {items.length === 0 && <p className="p-4 text-sm text-muted-foreground">{t('none')}</p>}
            {items.map((n) => (
              <button key={n.id}
                onClick={async () => { await markNotificationRead(n.id); setItems((p) => p.map((i) => i.id === n.id ? { ...i, read: true } : i)); }}
                className={`btn-fx btn-fx-row flex w-full items-start gap-3 border-b px-4 py-3 text-left hover:bg-secondary/40 cursor-pointer ${n.read ? 'opacity-60' : ''}`}>
                <span className="mt-1">{n.type === 'message' ? <MessageSquare className="h-4 w-4 text-primary" /> : <Bell className="h-4 w-4 text-muted-foreground" />}</span>
                <span className="flex-1">
                  <span className="block text-sm font-medium">{n.title}</span>
                  <span className="block text-xs text-muted-foreground">{n.message}</span>
                  <span className="mt-1 block text-[10px] text-muted-foreground">{timeAgo(n.created_at)}</span>
                </span>
                {!n.read && <span className="mt-1 h-2 w-2 rounded-full bg-primary" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
