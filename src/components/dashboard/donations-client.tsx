'use client';

import * as React from 'react';
import { useLang } from '@/components/lang-context';
import { Button } from '@/components/ui/button';
import { Input, Label, Select, Textarea } from '@/components/ui/input';
import { Table, THead, TBody, TR, TH, TD } from '@/components/ui/table';
import { Modal } from '@/components/ui/modal';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Download, Pencil, Trash2 } from 'lucide-react';
import { saveDonation, deleteDonation } from '@/lib/actions/donations';
import { toast } from 'sonner';
import { formatRupiah, formatDate } from '@/lib/utils';
import { exportCSV, exportXLS, printPDF } from '@/lib/export';
import { canAdd, canEdit, canDelete, type Role } from '@/lib/rbac';

const TYPES = ['perpuluhan', 'persembahan', 'pembangunan', 'sosial'];

export function DonationsClient({ donations, donors, role }: { donations: any[]; donors: any[]; role: Role }) {
  const { t } = useLang();
  const [modal, setModal] = React.useState(false);
  const [editing, setEditing] = React.useState<any>(null);
  const [filterType, setFilterType] = React.useState('');
  const [filterMonth, setFilterMonth] = React.useState('');

  const filtered = donations.filter((d) =>
    (!filterType || d.tipe === filterType) && (!filterMonth || d.tanggal.startsWith(filterMonth))
  );
  const total = filtered.reduce((s, d) => s + Number(d.jumlah), 0);
  const donorName = (id: number | null) => donors.find((d) => d.id === id)?.nama || '-';
  const uniqueDonors = new Set(donations.map((d) => d.donor_id).filter(Boolean)).size;

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const res = await saveDonation({
      id: editing?.id,
      donor_id: fd.get('donor_id') ? Number(fd.get('donor_id')) : null,
      tipe: String(fd.get('tipe')),
      jumlah: Number(fd.get('jumlah')),
      tanggal: String(fd.get('tanggal')),
      keterangan: String(fd.get('keterangan') || ''),
    });
    if (res.ok) { toast.success(t('save')); setModal(false); } else toast.error(res.error);
  }

  function doExport(fmt: string) {
    const rows = filtered.map((d) => ({ Tanggal: d.tanggal, Donatur: donorName(d.donor_id), Tipe: d.tipe, Keterangan: d.keterangan, Jumlah: d.jumlah }));
    if (fmt === 'csv') exportCSV(rows, 'donations');
    else if (fmt === 'xls') exportXLS(rows, 'donations');
    else printPDF(t('donations-report'), rows);
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">{t('donations')}</h1>
        <p className="text-muted-foreground">{t('manage-donations')}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">{t('total-donations')}</p><p className="text-2xl font-bold text-emerald-400">{formatRupiah(total)}</p></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">{t('total-donors')}</p><p className="text-2xl font-bold">{uniqueDonors}</p></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">{t('average-donation')}</p><p className="text-2xl font-bold">{formatRupiah(filtered.length ? Math.round(total / filtered.length) : 0)}</p></CardContent></Card>
      </div>

      <div className="flex flex-wrap gap-2">
        <Select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="w-auto">
          <option value="">{t('all-types')}</option>
          {TYPES.map((ty) => <option key={ty} value={ty}>{t(ty === 'perpuluhan' ? 'tithe' : ty === 'persembahan' ? 'offering' : ty === 'pembangunan' ? 'building' : 'social')}</option>)}
        </Select>
        <Input type="month" value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)} className="w-auto" />
        {(['csv', 'xls', 'pdf'] as const).map((f) => (
          <Button key={f} variant="secondary" onClick={() => doExport(f)}><Download className="h-4 w-4" /> {f.toUpperCase()}</Button>
        ))}
        {canAdd(role) && <Button onClick={() => { setEditing(null); setModal(true); }}><Plus className="h-4 w-4" /> {t('add-donation')}</Button>}
      </div>

      <Table>
        <THead><TR><TH>{t('date')}</TH><TH>{t('donor')}</TH><TH>{t('type')}</TH><TH>{t('description')}</TH><TH>{t('amount')}</TH><TH>{t('action')}</TH></TR></THead>
        <TBody>
          {filtered.map((d) => (
            <TR key={d.id}>
              <TD>{formatDate(d.tanggal)}</TD><TD>{donorName(d.donor_id)}</TD><TD className="capitalize">{d.tipe}</TD>
              <TD>{d.keterangan}</TD><TD className="font-semibold text-emerald-400">{formatRupiah(d.jumlah)}</TD>
              <TD>
                <div className="flex gap-1">
                  {canEdit(role) && <Button variant="ghost" size="icon" onClick={() => { setEditing(d); setModal(true); }} aria-label="Edit"><Pencil className="h-4 w-4" /></Button>}
                  {canDelete(role) && <Button variant="ghost" size="icon" aria-label="Hapus" onClick={async () => { if (confirm(t('confirmation'))) { const r = await deleteDonation(d.id); r.ok ? toast.success(t('save')) : toast.error(r.error); } }}><Trash2 className="h-4 w-4 text-destructive" /></Button>}
                </div>
              </TD>
            </TR>
          ))}
          {filtered.length === 0 && <TR><TD colSpan={6} className="text-center text-muted-foreground">{t('none')}</TD></TR>}
        </TBody>
      </Table>

      <Modal open={modal} onClose={() => setModal(false)} title={t('add-donation')}>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-2"><Label>{t('select-donor')}</Label>
            <Select name="donor_id" defaultValue={editing?.donor_id || ''}><option value="">{t('select')}</option>{donors.map((d) => <option key={d.id} value={d.id}>{d.nama}</option>)}</Select>
          </div>
          <div className="space-y-2"><Label>{t('donation-type')}</Label>
            <Select name="tipe" defaultValue={editing?.tipe || 'persembahan'}>
              {TYPES.map((ty) => <option key={ty} value={ty} className="capitalize">{ty}</option>)}
            </Select>
          </div>
          <div className="space-y-2"><Label>{t('amount')}</Label><Input name="jumlah" type="number" defaultValue={editing?.jumlah} required min={1} /></div>
          <div className="space-y-2"><Label>{t('date')}</Label><Input name="tanggal" type="date" defaultValue={editing?.tanggal || new Date().toISOString().slice(0, 10)} required /></div>
          <div className="space-y-2"><Label>{t('description')}</Label><Textarea name="keterangan" defaultValue={editing?.keterangan || ''} /></div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setModal(false)}>{t('cancel')}</Button>
            <Button type="submit">{t('save')}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
