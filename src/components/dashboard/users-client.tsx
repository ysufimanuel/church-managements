'use client';

import * as React from 'react';
import { useLang } from '@/components/lang-context';
import { Button } from '@/components/ui/button';
import { Input, Label, Select } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { Badge, Card, CardContent } from '@/components/ui/card';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { saveUser, deleteUser } from '@/lib/actions/users';
import { toast } from 'sonner';
import { roleLabel } from '@/lib/rbac';

export function UsersClient({ users, selfId }: { users: any[]; selfId: string }) {
  const { t } = useLang();
  const [search, setSearch] = React.useState('');
  const [modal, setModal] = React.useState(false);
  const [editing, setEditing] = React.useState<any>(null);

  const filtered = users.filter((u) => u.nama.toLowerCase().includes(search.toLowerCase()) || u.username.toLowerCase().includes(search.toLowerCase()));

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const res = await saveUser({
      id: editing?.id,
      nama: String(fd.get('nama')), username: String(fd.get('username')),
      email: String(fd.get('email')), password: String(fd.get('password') || '') || undefined,
      role: String(fd.get('role')) as any, status: String(fd.get('status') || 'aktif'),
    });
    if (res.ok) { toast.success(t('save')); setModal(false); } else toast.error(res.error);
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">{t('user-management')}</h1>
        <p className="text-muted-foreground">{t('manage-users')}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" placeholder={t('search-users')} value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Button onClick={() => { setEditing(null); setModal(true); }}><Plus className="h-4 w-4" /> {t('add-user')}</Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((u) => (
          <Card key={u.id}>
            <CardContent className="flex items-center gap-4 p-5">
              <img src={u.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.nama)}&background=1A1D24&color=00e5ff`} alt="" className="h-12 w-12 rounded-full" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{u.nama}</p>
                <p className="truncate text-sm text-muted-foreground">@{u.username}</p>
                <div className="mt-1 flex gap-2">
                  <Badge variant={u.role === 'superadmin' ? 'default' : u.role === 'admin' ? 'warning' : 'secondary'}>{roleLabel(u.role)}</Badge>
                  <Badge variant={u.status === 'aktif' ? 'success' : 'secondary'}>{u.status}</Badge>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <Button variant="ghost" size="icon" onClick={() => { setEditing(u); setModal(true); }} aria-label="Edit"><Pencil className="h-4 w-4" /></Button>
                {u.id !== selfId && (
                  <Button variant="ghost" size="icon" aria-label="Hapus" onClick={async () => { if (confirm(t('confirmation'))) { const r = await deleteUser(u.id); r.ok ? toast.success(t('save')) : toast.error(r.error); } }}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit User' : t('add-user')}>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-2"><Label>{t('full-name')}</Label><Input name="nama" defaultValue={editing?.nama} required /></div>
          <div className="space-y-2"><Label>{t('username')}</Label><Input name="username" defaultValue={editing?.username} required /></div>
          <div className="space-y-2"><Label>{t('email')}</Label><Input name="email" type="email" defaultValue={editing?.email} required /></div>
          <div className="space-y-2"><Label>{t('password')} {editing && <span className="text-xs text-muted-foreground">(kosongkan jika tidak diubah)</span>}</Label>
            <Input name="password" type="password" required={!editing} minLength={6} />
          </div>
          <div className="space-y-2"><Label>Role</Label>
            <Select name="role" defaultValue={editing?.role || 'user'}>
              <option value="user">{t('user-view-only')}</option>
              <option value="admin">{t('admin')}</option>
              <option value="superadmin">{t('superadmin')}</option>
            </Select>
            <p className="text-xs text-muted-foreground">{t('user-role-info')}</p>
          </div>
          <div className="space-y-2"><Label>{t('status')}</Label>
            <Select name="status" defaultValue={editing?.status || 'aktif'}><option value="aktif">{t('active')}</option><option value="nonaktif">{t('inactive')}</option></Select>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setModal(false)}>{t('cancel')}</Button>
            <Button type="submit">{t('save')}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
