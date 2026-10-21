'use client';

import * as React from 'react';
import { useLang } from '@/components/lang-context';
import { Button } from '@/components/ui/button';
import { Input, Label, Select, Textarea } from '@/components/ui/input';
import { Modal, Switch, Tabs } from '@/components/ui/modal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Pencil, Trash2, Search, Users, UserPlus } from 'lucide-react';
import { saveGroup, deleteGroup, addGroupMember, removeGroupMember } from '@/lib/actions/groups';
import { toast } from 'sonner';
import { canAdd, canEdit, canDelete, type Role } from '@/lib/rbac';

export function GroupsClient({ groups, members, groupMembers, role }: { groups: any[]; members: any[]; groupMembers: any[]; role: Role }) {
  const { t } = useLang();
  const [search, setSearch] = React.useState('');
  const [modal, setModal] = React.useState(false);
  const [memberModal, setMemberModal] = React.useState<any>(null);
  const [editing, setEditing] = React.useState<any>(null);
  const [showPhone, setShowPhone] = React.useState(true);
  const [selectedMember, setSelectedMember] = React.useState('');

  const filtered = groups.filter((g) => g.nama.toLowerCase().includes(search.toLowerCase()));
  const membersOf = (gid: number) => groupMembers.filter((gm) => gm.group_id === gid).map((gm) => gm.member_id);
  const memberName = (id: number | null) => members.find((m) => m.id === id)?.nama || '-';

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const res = await saveGroup({
      id: editing?.id, nama: String(fd.get('nama')), deskripsi: String(fd.get('deskripsi') || ''),
      leader_id: fd.get('leader_id') ? Number(fd.get('leader_id')) : null,
      jadwal: String(fd.get('jadwal') || ''), show_phone: showPhone,
    });
    if (res.ok) { toast.success(t('save')); setModal(false); } else toast.error(res.error);
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">{t('groups')}</h1>
        <p className="text-muted-foreground">{t('manage-groups')}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" placeholder={t('search-groups')} value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        {canAdd(role) && <Button onClick={() => { setEditing(null); setShowPhone(true); setModal(true); }}><Plus className="h-4 w-4" /> {t('add-group')}</Button>}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((g) => (
          <Card key={g.id}>
            <CardHeader className="flex-row items-start justify-between">
              <CardTitle className="text-base">{g.nama}</CardTitle>
              <div className="flex gap-1">
                {canEdit(role) && <Button variant="ghost" size="icon" onClick={() => setMemberModal(g)} aria-label="Kelola anggota"><UserPlus className="h-4 w-4" /></Button>}
                {canEdit(role) && <Button variant="ghost" size="icon" onClick={() => { setEditing(g); setShowPhone(g.show_phone); setModal(true); }} aria-label="Edit"><Pencil className="h-4 w-4" /></Button>}
                {canDelete(role) && <Button variant="ghost" size="icon" aria-label="Hapus" onClick={async () => { if (confirm(t('confirmation'))) { const r = await deleteGroup(g.id); r.ok ? toast.success(t('save')) : toast.error(r.error); } }}><Trash2 className="h-4 w-4 text-destructive" /></Button>}
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="text-muted-foreground">{g.deskripsi}</p>
              <p><span className="text-muted-foreground">{t('leader')}:</span> {memberName(g.leader_id)}</p>
              <p><span className="text-muted-foreground">{t('meeting-schedule')}:</span> {g.jadwal}</p>
              <p className="flex items-center gap-1"><Users className="h-3 w-3" /> {membersOf(g.id).length} anggota</p>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && <p className="text-muted-foreground">{t('none')}</p>}
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title={t('add-group')}>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-2"><Label>{t('group-name')}</Label><Input name="nama" defaultValue={editing?.nama} required /></div>
          <div className="space-y-2"><Label>{t('description')}</Label><Textarea name="deskripsi" defaultValue={editing?.deskripsi || ''} /></div>
          <div className="space-y-2"><Label>{t('leader')}</Label>
            <Select name="leader_id" defaultValue={editing?.leader_id || ''}><option value="">{t('select')}</option>{members.map((m) => <option key={m.id} value={m.id}>{m.nama}</option>)}</Select>
          </div>
          <div className="space-y-2"><Label>{t('meeting-schedule')}</Label><Input name="jadwal" defaultValue={editing?.jadwal || ''} /></div>
          <label className="flex items-center justify-between text-sm">
            {t('show-phone-to-members')}
            <Switch checked={showPhone} onCheckedChange={setShowPhone} />
          </label>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setModal(false)}>{t('cancel')}</Button>
            <Button type="submit">{t('save')}</Button>
          </div>
        </form>
      </Modal>

      {/* Kelola anggota group */}
      <Modal open={!!memberModal} onClose={() => setMemberModal(null)} title={`${t('current-members')} — ${memberModal?.nama || ''}`}>
        {memberModal && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <Select value={selectedMember} onChange={(e) => setSelectedMember(e.target.value)}>
                <option value="">{t('select-member')}</option>
                {members.filter((m) => !membersOf(memberModal.id).includes(m.id)).map((m) => <option key={m.id} value={m.id}>{m.nama}</option>)}
              </Select>
              <Button onClick={async () => {
                if (!selectedMember) return;
                const r = await addGroupMember(memberModal.id, Number(selectedMember));
                r.ok ? toast.success(t('save')) : toast.error(r.error);
                setSelectedMember('');
              }}><Plus className="h-4 w-4" /> {t('add')}</Button>
            </div>
            <ul className="space-y-2">
              {membersOf(memberModal.id).map((mid) => (
                <li key={mid} className="flex items-center justify-between rounded-md border px-3 py-2 text-sm">
                  {memberName(mid)}
                  {canEdit(role) && (
                    <Button variant="ghost" size="sm" onClick={async () => {
                      const r = await removeGroupMember(memberModal.id, mid);
                      r.ok ? toast.success(t('save')) : toast.error(r.error);
                    }}><Trash2 className="h-3 w-3 text-destructive" /></Button>
                  )}
                </li>
              ))}
              {membersOf(memberModal.id).length === 0 && <p className="text-sm text-muted-foreground">{t('none')}</p>}
            </ul>
          </div>
        )}
      </Modal>
    </div>
  );
}
