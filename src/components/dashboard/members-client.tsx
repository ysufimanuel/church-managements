'use client';

import { useUrlQuery } from '@/lib/search/use-url-query';
import * as React from 'react';
import { useLang } from '@/components/lang-context';
import { Button } from '@/components/ui/button';
import { Input, Label, Select } from '@/components/ui/input';
import { Table, THead, TBody, TR, TH, TD } from '@/components/ui/table';
import { Modal } from '@/components/ui/modal';
import { Badge } from '@/components/ui/card';
import { Plus, Download, Pencil, Trash2, Search, Eye } from 'lucide-react';
import { saveMember, deleteMember, type MemberInput } from '@/lib/actions/members';
import { toast } from 'sonner';
import { formatDate, calculateAge } from '@/lib/utils';
import { exportCSV, exportXLS, exportTXT, printPDF } from '@/lib/export';
import { canAdd, canEdit, canDelete, type Role } from '@/lib/rbac';

export function MembersClient({ members, groups, role }: { members: any[]; groups: any[]; role: Role }) {
  const { t } = useLang();
  const [search, setSearch] = useUrlQuery();
  const [filterStatus, setFilterStatus] = React.useState('');
  const [filterGender, setFilterGender] = React.useState('');
  const [modal, setModal] = React.useState(false);
  const [detail, setDetail] = React.useState<any>(null);
  const [editing, setEditing] = React.useState<Partial<MemberInput>>({});
  const [exportOpen, setExportOpen] = React.useState(false);

  const filtered = members.filter((m) => m.nama.toLowerCase().includes(search.toLowerCase()) && (!filterStatus || m.status === filterStatus) && (!filterGender || m.jk === filterGender));
  const groupName = (id: number | null) => groups.find((g) => g.id === id)?.nama || '-';

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const res = await saveMember({ id: editing.id, nama: String(fd.get('nama')), email: String(fd.get('email') || ''), telepon: String(fd.get('telepon') || ''), jk: (fd.get('jk') as any) || undefined, tempat_lahir: String(fd.get('tempat_lahir') || ''), tgl_lahir: String(fd.get('tgl_lahir') || '') || undefined, alamat: String(fd.get('alamat') || ''), kota: String(fd.get('kota') || ''), kodepos: String(fd.get('kodepos') || ''), status: (fd.get('status') as any) || 'aktif', group_id: fd.get('group_id') ? Number(fd.get('group_id')) : null, join_date: String(fd.get('join_date') || '') || undefined });
    if (res.ok) { toast.success(t('save')); setModal(false); setEditing({}); } else toast.error(res.error);
  }

  function doExport(fmt: string) {
    const rows = filtered.map((m) => ({ Nama: m.nama, Email: m.email, Telepon: m.telepon, Gender: m.jk, Status: m.status, Group: groupName(m.group_id) }));
    if (fmt === 'csv') exportCSV(rows, 'members'); else if (fmt === 'xls') exportXLS(rows, 'members'); else if (fmt === 'txt') exportTXT(rows, 'members'); else printPDF(t('members-report'), rows);
    setExportOpen(false);
  }

  return (
    <div className="space-y-4">
      <div><h1 className="text-2xl font-bold">{t('members')}</h1><p className="text-muted-foreground">{t('manage-members')}</p></div>
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px]"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input className="pl-9" placeholder={t('search-members')} value={search} onChange={(e) => setSearch(e.target.value)} /></div>
        <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-auto"><option value="">{t('all-status')}</option><option value="aktif">{t('active')}</option><option value="tidak-aktif">{t('inactive')}</option></Select>
        <Select value={filterGender} onChange={(e) => setFilterGender(e.target.value)} className="w-auto"><option value="">{t('all-gender')}</option><option value="Laki-laki">{t('male')}</option><option value="Perempuan">{t('female')}</option></Select>
        {role !== 'user' && <div className="relative"><Button variant="secondary" onClick={() => setExportOpen(!exportOpen)}><Download className="h-4 w-4" /> {t('export')}</Button>{exportOpen && <div className="absolute right-0 z-20 mt-1 w-36 glass-strong rounded-md p-1 shadow-lg">{['csv', 'xls', 'txt', 'pdf'].map((f) => <button key={f} onClick={() => doExport(f)} className="btn-fx btn-fx-row block w-full rounded px-3 py-2 text-left text-sm hover:bg-secondary cursor-pointer uppercase">{f}</button>)}</div>}</div>}
        {canAdd(role) && <Button onClick={() => { setEditing({}); setModal(true); }}><Plus className="h-4 w-4" /> {t('add-member')}</Button>}
      </div>
      <Table><THead><TR><TH>{t('photo')}</TH><TH>{t('name')}</TH><TH>{t('email')}</TH><TH>{t('phone')}</TH><TH>{t('gender')}</TH><TH>{t('status')}</TH><TH>{t('group')}</TH><TH>{t('action')}</TH></TR></THead><TBody>
        {filtered.map((m) => <TR key={m.id}><TD><img src={m.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(m.nama)}&background=1A1D24&color=00e5ff`} alt="" className="h-8 w-8 rounded-full" /></TD><TD className="font-medium">{m.nama}</TD><TD>{m.email}</TD><TD>{m.telepon}</TD><TD>{m.jk}</TD><TD><Badge variant={m.status === 'aktif' ? 'success' : 'secondary'}>{m.status}</Badge></TD><TD>{groupName(m.group_id)}</TD><TD><div className="flex gap-1"><Button variant="ghost" size="icon" onClick={() => setDetail(m)} aria-label="Detail"><Eye className="h-4 w-4" /></Button>{canEdit(role) && <Button variant="ghost" size="icon" onClick={() => { setEditing(m); setModal(true); }} aria-label="Edit"><Pencil className="h-4 w-4" /></Button>}{canDelete(role) && <Button variant="ghost" size="icon" aria-label="Hapus" onClick={async () => { if (confirm(t('confirmation'))) { const r = await deleteMember(m.id); r.ok ? toast.success(t('save')) : toast.error(r.error); } }}><Trash2 className="h-4 w-4 text-destructive" /></Button>}</div></TD></TR>)}
        {filtered.length === 0 && <TR><TD colSpan={8} className="text-center text-muted-foreground">{t('none')}</TD></TR>}
      </TBody></Table>
      <Modal open={modal} onClose={() => setModal(false)} title={editing.id ? t('edit') || 'Edit' : t('add-new-member')} wide><form onSubmit={handleSave} className="grid grid-cols-1 gap-4 md:grid-cols-2"><div className="space-y-2 md:col-span-2"><Label>{t('full-name')}</Label><Input name="nama" defaultValue={editing.nama} required /></div><div className="space-y-2"><Label>{t('email')}</Label><Input name="email" type="email" defaultValue={editing.email || ''} /></div><div className="space-y-2"><Label>{t('phone')}</Label><Input name="telepon" defaultValue={editing.telepon || ''} /></div><div className="space-y-2"><Label>{t('gender')}</Label><Select name="jk" defaultValue={editing.jk || ''}><option value="">{t('select')}</option><option value="Laki-laki">{t('male')}</option><option value="Perempuan">{t('female')}</option></Select></div><div className="space-y-2"><Label>{t('birth-place')}</Label><Input name="tempat_lahir" defaultValue={editing.tempat_lahir || ''} /></div><div className="space-y-2"><Label>{t('birth-date')}</Label><Input name="tgl_lahir" type="date" defaultValue={editing.tgl_lahir || ''} /></div><div className="space-y-2 md:col-span-2"><Label>{t('full-address')}</Label><Input name="alamat" defaultValue={editing.alamat || ''} /></div><div className="space-y-2"><Label>{t('city')}</Label><Input name="kota" defaultValue={editing.kota || ''} /></div><div className="space-y-2"><Label>{t('postal-code')}</Label><Input name="kodepos" defaultValue={editing.kodepos || ''} /></div><div className="space-y-2"><Label>{t('group-ministry')}</Label><Select name="group_id" defaultValue={editing.group_id || ''}><option value="">{t('none')}</option>{groups.map((g) => <option key={g.id} value={g.id}>{g.nama}</option>)}</Select></div><div className="space-y-2"><Label>{t('join-date')}</Label><Input name="join_date" type="date" defaultValue={editing.join_date || ''} /></div><div className="space-y-2"><Label>{t('status')}</Label><Select name="status" defaultValue={editing.status || 'aktif'}><option value="aktif">{t('active')}</option><option value="tidak-aktif">{t('inactive')}</option></Select></div><div className="flex justify-end gap-2 md:col-span-2"><Button type="button" variant="secondary" onClick={() => setModal(false)}>{t('cancel')}</Button><Button type="submit">{t('save')}</Button></div></form></Modal>
      <Modal open={!!detail} onClose={() => setDetail(null)} title={detail?.nama || ''}>{detail && <dl className="grid grid-cols-2 gap-3 text-sm"><dt className="text-muted-foreground">{t('email')}</dt><dd>{detail.email || '-'}</dd><dt className="text-muted-foreground">{t('phone')}</dt><dd>{detail.telepon || '-'}</dd><dt className="text-muted-foreground">{t('gender')}</dt><dd>{detail.jk || '-'}</dd><dt className="text-muted-foreground">{t('birth-date')}</dt><dd>{formatDate(detail.tgl_lahir)} ({calculateAge(detail.tgl_lahir)})</dd><dt className="text-muted-foreground">{t('address')}</dt><dd>{detail.alamat || '-'}, {detail.kota || ''}</dd><dt className="text-muted-foreground">{t('join-date')}</dt><dd>{formatDate(detail.join_date)}</dd><dt className="text-muted-foreground">{t('group')}</dt><dd>{groupName(detail.group_id)}</dd></dl>}</Modal>
    </div>
  );
}