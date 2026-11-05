'use client';

import * as React from 'react';
import { useLang } from '@/components/lang-context';
import { Button } from '@/components/ui/button';
import { Input, Label, Select, Textarea } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { Badge, Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Pencil, Trash2, Search, Users } from 'lucide-react';
import { saveEvent, deleteEvent, addParticipant, removeParticipant } from '@/lib/actions/events';
import { toast } from 'sonner';
import { formatDateTime } from '@/lib/utils';
import { canAdd, canEdit, canDelete, type Role } from '@/lib/rbac';

const TYPES = ['ibadah', 'seminar', 'retret', 'sosial', 'lainnya'];

export function EventsClient({ events, members, participants, role }: { events: any[]; members: any[]; participants: any[]; role: Role }) {
  const { t } = useLang();
  const [search, setSearch] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState('');
  const [modal, setModal] = React.useState(false);
  const [editing, setEditing] = React.useState<any>(null);
  const [partModal, setPartModal] = React.useState<any>(null);
  const [partMember, setPartMember] = React.useState('');
  const [partManual, setPartManual] = React.useState('');

  const filtered = events.filter((e) =>
    e.nama.toLowerCase().includes(search.toLowerCase()) && (!filterStatus || e.status === filterStatus)
  );
  const partsOf = (eid: number) => participants.filter((p) => p.event_id === eid);
  const memberName = (id: number | null) => members.find((m) => m.id === id)?.nama || '-';

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const res = await saveEvent({
      id: editing?.id, nama: String(fd.get('nama')), tipe: String(fd.get('tipe')),
      custom_type: String(fd.get('custom_type') || '') || undefined,
      start_at: String(fd.get('start_at')), end_at: String(fd.get('end_at') || '') || undefined,
      lokasi: String(fd.get('lokasi') || ''), deskripsi: String(fd.get('deskripsi') || ''),
      kapasitas: fd.get('kapasitas') ? Number(fd.get('kapasitas')) : undefined,
      status: String(fd.get('status')) as any,
    });
    if (res.ok) { toast.success(t('save')); setModal(false); } else toast.error(res.error);
  }

  const statusVariant = (s: string) => s === 'upcoming' ? 'warning' : s === 'ongoing' ? 'success' : 'secondary';

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">{t('events')}</h1>
        <p className="text-muted-foreground">{t('manage-events')}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" placeholder={t('search-events')} value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-auto">
          <option value="">{t('all-status')}</option>
          <option value="upcoming">{t('upcoming')}</option>
          <option value="ongoing">{t('ongoing')}</option>
          <option value="completed">{t('completed')}</option>
        </Select>
        {canAdd(role) && <Button onClick={() => { setEditing(null); setModal(true); }}><Plus className="h-4 w-4" /> {t('add-event')}</Button>}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((e) => (
          <Card key={e.id}>
            <CardHeader className="flex-row items-start justify-between">
              <div>
                <CardTitle className="text-base">{e.nama}</CardTitle>
                <Badge variant={statusVariant(e.status) as any} className="mt-1">{t(e.status)}</Badge>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => setPartModal(e)} aria-label="Peserta"><Users className="h-4 w-4" /></Button>
                {canEdit(role) && <Button variant="ghost" size="icon" onClick={() => { setEditing(e); setModal(true); }} aria-label="Edit"><Pencil className="h-4 w-4" /></Button>}
                {canDelete(role) && <Button variant="ghost" size="icon" aria-label="Hapus" onClick={async () => { if (confirm(t('confirmation'))) { const r = await deleteEvent(e.id); r.ok ? toast.success(t('save')) : toast.error(r.error); } }}><Trash2 className="h-4 w-4 text-destructive" /></Button>}
              </div>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <p className="text-muted-foreground">{e.deskripsi}</p>
              <p>{formatDateTime(e.start_at)} — {formatDateTime(e.end_at)}</p>
              <p className="text-muted-foreground">{e.lokasi} · {t('capacity')}: {e.kapasitas || '-'}</p>
              <p className="text-xs text-muted-foreground">{partsOf(e.id).length} peserta</p>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && <p className="text-muted-foreground">{t('none')}</p>}
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title={t('add-event')} wide>
        <form onSubmit={handleSave} className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2"><Label>{t('event-name')}</Label><Input name="nama" defaultValue={editing?.nama} required /></div>
          <div className="space-y-2"><Label>{t('event-type')}</Label>
            <Select name="tipe" defaultValue={editing?.tipe || 'ibadah'}>
              {TYPES.map((ty) => <option key={ty} value={ty}>{t(ty === 'ibadah' ? 'worship' : ty === 'sosial' ? 'social-activity' : ty === 'lainnya' ? 'other' : ty)}</option>)}
            </Select>
          </div>
          <div className="space-y-2"><Label>{t('custom-type')}</Label><Input name="custom_type" defaultValue={editing?.custom_type || ''} /></div>
          <div className="space-y-2"><Label>{t('start-date')}</Label><Input name="start_at" type="datetime-local" defaultValue={editing?.start_at?.slice(0, 16)} required /></div>
          <div className="space-y-2"><Label>{t('end-date')}</Label><Input name="end_at" type="datetime-local" defaultValue={editing?.end_at?.slice(0, 16) || ''} /></div>
          <div className="space-y-2"><Label>{t('location')}</Label><Input name="lokasi" defaultValue={editing?.lokasi || ''} /></div>
          <div className="space-y-2"><Label>{t('capacity')}</Label><Input name="kapasitas" type="number" defaultValue={editing?.kapasitas || ''} /></div>
          <div className="space-y-2"><Label>{t('event-status')}</Label>
            <Select name="status" defaultValue={editing?.status || 'upcoming'}>
              <option value="upcoming">{t('upcoming')}</option><option value="ongoing">{t('ongoing')}</option><option value="completed">{t('completed')}</option>
            </Select>
          </div>
          <div className="space-y-2 md:col-span-2"><Label>{t('description')}</Label><Textarea name="deskripsi" defaultValue={editing?.deskripsi || ''} /></div>
          <div className="flex justify-end gap-2 md:col-span-2">
            <Button type="button" variant="secondary" onClick={() => setModal(false)}>{t('cancel')}</Button>
            <Button type="submit">{t('save')}</Button>
          </div>
        </form>
      </Modal>

      {/* Peserta */}
      <Modal open={!!partModal} onClose={() => setPartModal(null)} title={`${t('event-participants')} — ${partModal?.nama || ''}`} wide>
        {partModal && (
          <div className="space-y-4">
            {canEdit(role) && (
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                <div className="flex gap-2">
                  <Select value={partMember} onChange={(e) => setPartMember(e.target.value)}>
                    <option value="">{t('select-member')}</option>
                    {members.map((m) => <option key={m.id} value={m.id}>{m.nama}</option>)}
                  </Select>
                  <Button onClick={async () => { if (!partMember) return; const r = await addParticipant(partModal.id, Number(partMember)); r.ok ? toast.success(t('save')) : toast.error(r.error); setPartMember(''); }}>{t('add')}</Button>
                </div>
                <div className="flex gap-2">
                  <Input placeholder={t('add-manual-participant')} value={partManual} onChange={(e) => setPartManual(e.target.value)} />
                  <Button variant="secondary" onClick={async () => { if (!partManual.trim()) return; const r = await addParticipant(partModal.id, undefined, partManual.trim()); r.ok ? toast.success(t('save')) : toast.error(r.error); setPartManual(''); }}>{t('add')}</Button>
                </div>
              </div>
            )}
            <ul className="space-y-2">
              {partsOf(partModal.id).map((p) => (
                <li key={p.id} className="flex items-center justify-between rounded-md border px-3 py-2 text-sm">
                  <span>{p.member_id ? memberName(p.member_id) : p.nama_manual}</span>
                  <span className="flex items-center gap-2 text-xs text-muted-foreground">
                    {formatDateTime(p.registered_at)}
                    {canDelete(role) && <Button variant="ghost" size="sm" onClick={async () => { const r = await removeParticipant(p.id); r.ok ? toast.success(t('save')) : toast.error(r.error); }}><Trash2 className="h-3 w-3 text-destructive" /></Button>}
                  </span>
                </li>
              ))}
              {partsOf(partModal.id).length === 0 && <p className="text-sm text-muted-foreground">{t('none')}</p>}
            </ul>
          </div>
        )}
      </Modal>
    </div>
  );
}
