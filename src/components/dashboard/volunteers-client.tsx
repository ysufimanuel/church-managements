'use client';

import { useUrlQuery } from '@/lib/search/use-url-query';
import { useSearchParams } from 'next/navigation';
import * as React from 'react';
import { useLang, tm } from '@/components/lang-context';
import { Button } from '@/components/ui/button';
import { Input, Label, Select, Textarea } from '@/components/ui/input';
import { Modal, Tabs } from '@/components/ui/modal';
import { Badge, Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Pencil, Trash2, Search, CalendarDays } from 'lucide-react';
import { saveVolunteer, deleteVolunteer, saveAssignment, deleteAssignment } from '@/lib/actions/volunteers';
import { toast } from 'sonner';
import { formatDate } from '@/lib/utils';
import { canAdd, canEdit, canDelete, type Role } from '@/lib/rbac';

const AREAS = ['sunday-school-teacher', 'singer', 'worship-leader', 'musician', 'dancer', 'collection', 'intercession', 'speaker', 'multimedia', 'lighting-sound', 'usher'];
const SCHEDULES = ['minggu-pagi', 'minggu-sore', 'sabtu', 'weekday'];
const SCHED_KEYS: Record<string, string> = { 'minggu-pagi': 'sunday-morning', 'minggu-sore': 'sunday-evening', sabtu: 'saturday', weekday: 'weekday' };

export function VolunteersClient({ volunteers, members, events, assignments, role }: {
  volunteers: any[]; members: any[]; events: any[]; assignments: any[]; role: Role;
}) {
  const { t } = useLang();
  const searchParams = useSearchParams();
  const [tab, setTab] = React.useState(() => searchParams.get('tab') === 'assignment' ? 'assignment' : 'list');
  React.useEffect(() => { if (searchParams.get('tab') === 'assignment') setTab('assignment'); }, [searchParams]);
  const [search, setSearch] = useUrlQuery();
  const [modal, setModal] = React.useState(false);
  const [editing, setEditing] = React.useState<any>(null);
  const [source, setSource] = React.useState<'member' | 'external'>('member');
  const [jadwal, setJadwal] = React.useState<string[]>([]);
  const [asgModal, setAsgModal] = React.useState(false);
  const [asgEditing, setAsgEditing] = React.useState<any>(null);

  const memberName = (id: number | null) => members.find((m) => m.id === id)?.nama || null;
  const volName = (v: any) => v.member_id ? memberName(v.member_id) : v.external_nama;
  const volNameById = (id: number) => { const v = volunteers.find((x) => x.id === id); return v ? volName(v) : '-'; };
  const eventName = (id: number | null) => events.find((e) => e.id === id)?.nama || '-';
  const query = search.trim().toLocaleLowerCase('id-ID');
  const filtered = volunteers.filter((v) => [volName(v),v.external_email,v.external_telepon,v.area,v.status,...(v.jadwal || [])].some((x) => String(x || '').toLocaleLowerCase('id-ID').includes(query)));
  const filteredAssignments = assignments.filter((a) => [volNameById(a.volunteer_id),eventName(a.event_id),a.tugas,a.tempat,a.catatan,a.status].some((x) => String(x || '').toLocaleLowerCase('id-ID').includes(query)));

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const res = await saveVolunteer({
      id: editing?.id,
      member_id: source === 'member' && fd.get('member_id') ? Number(fd.get('member_id')) : null,
      external_nama: source === 'external' ? String(fd.get('external_nama') || '') : undefined,
      external_email: source === 'external' ? String(fd.get('external_email') || '') : undefined,
      external_telepon: source === 'external' ? String(fd.get('external_telepon') || '') : undefined,
      area: String(fd.get('area')),
      jadwal,
      status: String(fd.get('status') || 'aktif'),
    });
    if (res.ok) { toast.success(t('save')); setModal(false); } else toast.error(tm(res.error));
  }

  async function handleSaveAsg(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const res = await saveAssignment({
      id: asgEditing?.id,
      volunteer_id: Number(fd.get('volunteer_id')),
      event_id: fd.get('event_id') ? Number(fd.get('event_id')) : null,
      tanggal: String(fd.get('tanggal')),
      waktu: String(fd.get('waktu') || ''),
      tempat: String(fd.get('tempat') || ''),
      tugas: String(fd.get('tugas') || ''),
      catatan: String(fd.get('catatan') || ''),
    });
    if (res.ok) { toast.success(t('save')); setAsgModal(false); } else toast.error(tm(res.error));
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">{t('volunteers')}</h1>
        <p className="text-muted-foreground">{t('manage-volunteers')}</p>
      </div>
      <Tabs active={tab} onChange={setTab} tabs={[
        { id: 'list', label: t('volunteer-list') }, { id: 'schedule', label: t('service-schedule') }, { id: 'assignment', label: t('assignments') },
      ]} />

      {tab === 'list' && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input className="pl-9" placeholder={t('search-volunteers')} value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            {canAdd(role) && <Button onClick={() => { setEditing(null); setSource('member'); setJadwal([]); setModal(true); }}><Plus className="h-4 w-4" /> {t('add-volunteer')}</Button>}
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((v) => (
              <Card key={v.id}>
                <CardHeader className="flex-row items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{volName(v)}</CardTitle>
                    <Badge variant="default" className="mt-1 capitalize">{t(v.area)}</Badge>
                  </div>
                  <div className="flex gap-1">
                    {canEdit(role) && <Button variant="ghost" size="icon" onClick={() => { setEditing(v); setSource(v.member_id ? 'member' : 'external'); setJadwal(v.jadwal || []); setModal(true); }} aria-label={t('act-edit')}><Pencil className="h-4 w-4" /></Button>}
                    {canDelete(role) && <Button variant="ghost" size="icon" aria-label={t('act-delete')} onClick={async () => { if (confirm(t('confirmation'))) { const r = await deleteVolunteer(v.id); r.ok ? toast.success(t('save')) : toast.error(tm(r.error)); } }}><Trash2 className="h-4 w-4 text-destructive" /></Button>}
                  </div>
                </CardHeader>
                <CardContent className="text-sm space-y-1">
                  <p className="text-muted-foreground">{(v.jadwal || []).map((s: string) => t(SCHED_KEYS[s])).join(', ') || '-'}</p>
                  <Badge variant={v.status === 'aktif' ? 'success' : 'secondary'}>{v.status}</Badge>
                </CardContent>
              </Card>
            ))}
            {filtered.length === 0 && <p className="text-muted-foreground">{t('none')}</p>}
          </div>
        </div>
      )}

      {tab === 'schedule' && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SCHEDULES.map((s) => (
            <Card key={s}>
              <CardHeader><CardTitle className="flex items-center gap-2 text-base"><CalendarDays className="h-4 w-4" /> {t(SCHED_KEYS[s])}</CardTitle></CardHeader>
              <CardContent className="space-y-1 text-sm">
                {volunteers.filter((v) => (v.jadwal || []).includes(s)).map((v) => (
                  <p key={v.id} className="rounded border px-2 py-1">{volName(v)} <span className="text-xs text-muted-foreground">· {t(v.area)}</span></p>
                ))}
                {volunteers.filter((v) => (v.jadwal || []).includes(s)).length === 0 && <p className="text-muted-foreground">{t('none')}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {tab === 'assignment' && (
        <div className="space-y-3">
          {canAdd(role) && <Button onClick={() => { setAsgEditing(null); setAsgModal(true); }}><Plus className="h-4 w-4" /> {t('add-assignment')}</Button>}
          <div className="space-y-2">
            {filteredAssignments.map((a) => (
              <div key={a.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border p-3 text-sm">
                <div>
                  <p className="font-medium">{volNameById(a.volunteer_id)} — {a.tugas}</p>
                  <p className="text-xs text-muted-foreground">{eventName(a.event_id)} · {formatDate(a.tanggal)} {a.waktu?.slice(0, 5)} · {a.tempat}</p>
                  {a.catatan && <p className="text-xs text-muted-foreground">{a.catatan}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{a.status}</Badge>
                  {canEdit(role) && <Button variant="ghost" size="icon" onClick={() => { setAsgEditing(a); setAsgModal(true); }} aria-label={t('act-edit')}><Pencil className="h-4 w-4" /></Button>}
                  {canDelete(role) && <Button variant="ghost" size="icon" aria-label={t('act-delete')} onClick={async () => { if (confirm(t('confirmation'))) { const r = await deleteAssignment(a.id); r.ok ? toast.success(t('save')) : toast.error(tm(r.error)); } }}><Trash2 className="h-4 w-4 text-destructive" /></Button>}
                </div>
              </div>
            ))}
            {filteredAssignments.length === 0 && <p className="text-muted-foreground">{t('none')}</p>}
          </div>
        </div>
      )}

      {/* Modal relawan */}
      <Modal open={modal} onClose={() => setModal(false)} title={t('add-volunteer')}>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-2"><Label>{t('volunteer-source')}</Label>
            <Select value={source} onChange={(e) => setSource(e.target.value as any)}>
              <option value="member">{t('from-member')}</option>
              <option value="external">{t('external')}</option>
            </Select>
          </div>
          {source === 'member' ? (
            <div className="space-y-2"><Label>{t('select-member')}</Label>
              <Select name="member_id" defaultValue={editing?.member_id || ''}><option value="">{t('select')}</option>{members.map((m) => <option key={m.id} value={m.id}>{m.nama}</option>)}</Select>
            </div>
          ) : (
            <>
              <div className="space-y-2"><Label>{t('full-name')}</Label><Input name="external_nama" defaultValue={editing?.external_nama || ''} required /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>{t('email')}</Label><Input name="external_email" type="email" defaultValue={editing?.external_email || ''} /></div>
                <div className="space-y-2"><Label>{t('phone')}</Label><Input name="external_telepon" defaultValue={editing?.external_telepon || ''} /></div>
              </div>
            </>
          )}
          <div className="space-y-2"><Label>{t('service-area')}</Label>
            <Select name="area" defaultValue={editing?.area || 'usher'}>{AREAS.map((a) => <option key={a} value={a}>{t(a)}</option>)}</Select>
          </div>
          <div className="space-y-2">
            <Label>{t('available-schedule')}</Label>
            <div className="flex flex-wrap gap-3">
              {SCHEDULES.map((s) => (
                <label key={s} className="flex min-h-[36px] items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={jadwal.includes(s)} onChange={(e) => setJadwal(e.target.checked ? [...jadwal, s] : jadwal.filter((x) => x !== s))} />
                  {t(SCHED_KEYS[s])}
                </label>
              ))}
            </div>
          </div>
          <div className="space-y-2"><Label>{t('status')}</Label>
            <Select name="status" defaultValue={editing?.status || 'aktif'}><option value="aktif">{t('active')}</option><option value="tidak-aktif">{t('inactive')}</option></Select>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setModal(false)}>{t('cancel')}</Button>
            <Button type="submit">{t('save')}</Button>
          </div>
        </form>
      </Modal>

      {/* Modal penugasan */}
      <Modal open={asgModal} onClose={() => setAsgModal(false)} title={t('add-assignment')}>
        <form onSubmit={handleSaveAsg} className="space-y-4">
          <div className="space-y-2"><Label>{t('select-volunteer')}</Label>
            <Select name="volunteer_id" defaultValue={asgEditing?.volunteer_id || ''} required><option value="">{t('select')}</option>{volunteers.map((v) => <option key={v.id} value={v.id}>{volName(v)}</option>)}</Select>
          </div>
          <div className="space-y-2"><Label>{t('select-event')}</Label>
            <Select name="event_id" defaultValue={asgEditing?.event_id || ''}><option value="">{t('none')}</option>{events.map((e) => <option key={e.id} value={e.id}>{e.nama}</option>)}</Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>{t('assignment-date')}</Label><Input name="tanggal" type="date" defaultValue={asgEditing?.tanggal || ''} required /></div>
            <div className="space-y-2"><Label>{t('assignment-time')}</Label><Input name="waktu" type="time" defaultValue={asgEditing?.waktu?.slice(0, 5) || ''} /></div>
          </div>
          <div className="space-y-2"><Label>{t('location')}</Label><Input name="tempat" defaultValue={asgEditing?.tempat || ''} /></div>
          <div className="space-y-2"><Label>{t('task')}</Label><Input name="tugas" defaultValue={asgEditing?.tugas || ''} /></div>
          <div className="space-y-2"><Label>{t('notes')}</Label><Textarea name="catatan" defaultValue={asgEditing?.catatan || ''} /></div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setAsgModal(false)}>{t('cancel')}</Button>
            <Button type="submit">{t('save')}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
