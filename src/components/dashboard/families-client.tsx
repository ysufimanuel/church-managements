'use client';

import * as React from 'react';
import { useLang } from '@/components/lang-context';
import { Button } from '@/components/ui/button';
import { Input, Label, Select } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Pencil, Trash2, Search, Users } from 'lucide-react';
import { saveFamily, deleteFamily } from '@/lib/actions/families';
import { toast } from 'sonner';
import { canAdd, canEdit, canDelete, type Role } from '@/lib/rbac';

export function FamiliesClient({ families, members, familyMembers, role }: { families: any[]; members: any[]; familyMembers: any[]; role: Role }) {
  const { t } = useLang();
  const [search, setSearch] = React.useState('');
  const [modal, setModal] = React.useState(false);
  const [editing, setEditing] = React.useState<any>(null);

  const filtered = families.filter((f) => f.nama.toLowerCase().includes(search.toLowerCase()));
  const anggotaOf = (fid: number) => familyMembers.filter((fm) => fm.family_id === fid).map((fm) => fm.member_id);
  const memberName = (id: number | null) => members.find((m) => m.id === id)?.nama || '-';

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const anggota = fd.getAll('anggota').map(Number);
    const res = await saveFamily({
      id: editing?.id,
      nama: String(fd.get('nama')),
      kepala_id: fd.get('kepala_id') ? Number(fd.get('kepala_id')) : null,
      alamat: String(fd.get('alamat') || ''), kota: String(fd.get('kota') || ''),
      anggota,
    });
    if (res.ok) { toast.success(t('save')); setModal(false); } else toast.error(res.error);
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">{t('families')}</h1>
        <p className="text-muted-foreground">{t('manage-families')}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" placeholder={t('search-families')} value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        {canAdd(role) && <Button onClick={() => { setEditing(null); setModal(true); }}><Plus className="h-4 w-4" /> {t('add-family')}</Button>}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((f) => (
          <Card key={f.id}>
            <CardHeader className="flex-row items-start justify-between">
              <CardTitle className="text-base">{f.nama}</CardTitle>
              <div className="flex gap-1">
                {canEdit(role) && <Button variant="ghost" size="icon" onClick={() => { setEditing(f); setModal(true); }} aria-label="Edit"><Pencil className="h-4 w-4" /></Button>}
                {canDelete(role) && <Button variant="ghost" size="icon" aria-label="Hapus" onClick={async () => { if (confirm(t('confirmation'))) { const r = await deleteFamily(f.id); r.ok ? toast.success(t('save')) : toast.error(r.error); } }}><Trash2 className="h-4 w-4 text-destructive" /></Button>}
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p><span className="text-muted-foreground">{t('head-family')}:</span> {memberName(f.kepala_id)}</p>
              <p><span className="text-muted-foreground">{t('address')}:</span> {f.alamat}, {f.kota}</p>
              <p className="flex items-center gap-1"><Users className="h-3 w-3" /> {anggotaOf(f.id).length} {t('family-members')}</p>
              <p className="text-xs text-muted-foreground">{anggotaOf(f.id).map((id) => memberName(id)).join(', ') || '-'}</p>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && <p className="text-muted-foreground">{t('none')}</p>}
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title={t('add-family')} wide>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-2"><Label>{t('family-name')}</Label><Input name="nama" defaultValue={editing?.nama} required /></div>
          <div className="space-y-2"><Label>{t('head-family')}</Label>
            <Select name="kepala_id" defaultValue={editing?.kepala_id || ''}><option value="">{t('select')}</option>{members.map((m) => <option key={m.id} value={m.id}>{m.nama}</option>)}</Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>{t('address')}</Label><Input name="alamat" defaultValue={editing?.alamat || ''} /></div>
            <div className="space-y-2"><Label>{t('city')}</Label><Input name="kota" defaultValue={editing?.kota || ''} /></div>
          </div>
          <div className="space-y-2">
            <Label>{t('family-members')}</Label>
            <div className="max-h-40 space-y-1 overflow-y-auto rounded-md border p-2">
              {members.map((m) => (
                <label key={m.id} className="flex min-h-[36px] items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    name="anggota"
                    value={m.id}
                    defaultChecked={editing ? anggotaOf(editing.id).includes(m.id) : false}
                    disabled={role !== 'superadmin' && Boolean(editing && anggotaOf(editing.id).includes(m.id))}
                  />
                  {m.nama}
                </label>
              ))}
            </div>
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
