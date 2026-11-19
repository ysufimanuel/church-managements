'use client';

import { useUrlQuery } from '@/lib/search/use-url-query';
import * as React from 'react';
import { useLang, tm } from '@/components/lang-context';
import { Button } from '@/components/ui/button';
import { Input, Label, Select, Textarea } from '@/components/ui/input';
import { Table, THead, TBody, TR, TH, TD } from '@/components/ui/table';
import { Modal, Tabs } from '@/components/ui/modal';
import { Badge, Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Pencil, Trash2, Check, X, Download } from 'lucide-react';
import { saveFinanceTransaction, approveTransaction, rejectTransaction, deleteTransaction, saveFinanceCategory, deleteFinanceCategory, updateSaldoAwal } from '@/lib/actions/finance';
import { toast } from 'sonner';
import { formatRupiahCompact, formatRupiah, formatDate } from '@/lib/utils';
import { exportCSV, printPDF } from '@/lib/export';
import { FinanceLineChart, CategoryPieChart } from './charts';
import { canAdd, canEdit, canDelete, canApprove, type Role } from '@/lib/rbac';

export function FinanceClient({ transactions, categories, settings, history, donors, role }: {
  transactions: any[]; categories: any[]; settings: any; history: any[]; donors: any[]; role: Role;
}) {
  const { t } = useLang();
  const [tab, setTab] = React.useState('dashboard');
  const [modal, setModal] = React.useState<null | { tipe: 'pemasukan' | 'pengeluaran'; editing?: any }>(null);
  const [catModal, setCatModal] = React.useState<null | any>(null);
  const [saldoModal, setSaldoModal] = React.useState(false);
  const [search, setSearch] = useUrlQuery();
  const [filterCat, setFilterCat] = React.useState('');
  const [filterMonth, setFilterMonth] = React.useState('');

  const approved = transactions.filter((x) => x.status === 'approved');
  const totalIn = approved.filter((x) => x.tipe === 'pemasukan').reduce((s, x) => s + Number(x.jumlah), 0);
  const totalOut = approved.filter((x) => x.tipe === 'pengeluaran').reduce((s, x) => s + Number(x.jumlah), 0);
  const saldo = Number(settings?.saldo_awal || 0) + totalIn - totalOut;
  const pending = transactions.filter((x) => x.status === 'pending');
  const catName = (id: number | null) => categories.find((c) => c.id === id)?.nama || '-';
  const donorName = (id: number | null) => donors.find((d) => d.id === id)?.nama || '-';

  // chart per bulan
  const byMonth: Record<string, { pemasukan: number; pengeluaran: number }> = {};
  approved.forEach((x) => {
    const m = x.tanggal.slice(0, 7);
    byMonth[m] = byMonth[m] || { pemasukan: 0, pengeluaran: 0 };
    byMonth[m][x.tipe as 'pemasukan'] += Number(x.jumlah);
  });
  const chartData = Object.entries(byMonth).sort().map(([label, v]) => ({ label, ...v }));
  const catChart = (tipe: string) => {
    const agg: Record<string, number> = {};
    approved.filter((x) => x.tipe === tipe).forEach((x) => { const n = catName(x.kategori_id); agg[n] = (agg[n] || 0) + Number(x.jumlah); });
    return Object.entries(agg).map(([name, value]) => ({ name, value }));
  };

  async function handleSaveTrx(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const res = await saveFinanceTransaction({
      id: modal?.editing?.id,
      tipe: modal!.tipe,
      kategori_id: fd.get('kategori_id') ? Number(fd.get('kategori_id')) : null,
      jumlah: Number(fd.get('jumlah')),
      tanggal: String(fd.get('tanggal')),
      keterangan: String(fd.get('keterangan') || ''),
      donatur_id: fd.get('donatur_id') ? Number(fd.get('donatur_id')) : null,
    });
    if (res.ok) {
      toast.success(modal?.editing ? t('save') : canApprove(role) ? t('approved') : t('pending-approval'));
      setModal(null);
    } else toast.error(tm(res.error));
  }

  async function handleSaveCat(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const res = await saveFinanceCategory({
      id: catModal?.id, nama: String(fd.get('nama')),
      tipe: String(fd.get('tipe')) as any, deskripsi: String(fd.get('deskripsi') || ''),
    });
    if (res.ok) { toast.success(t('save')); setCatModal(null); } else toast.error(tm(res.error));
  }

  function trxTable(tipe: 'pemasukan' | 'pengeluaran') {
    const rows = transactions.filter((x) => x.tipe === tipe &&
      (!filterCat || x.kategori_id === Number(filterCat)) &&
      (!filterMonth || x.tanggal.startsWith(filterMonth)) &&
      (!search || [x.keterangan,catName(x.kategori_id)].some((v) => String(v || '').toLocaleLowerCase('id-ID').includes(search.trim().toLocaleLowerCase('id-ID')))));
    return (
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
          <Input placeholder={t('search-members')} value={search} onChange={(e) => setSearch(e.target.value)} className="col-span-2 sm:max-w-xs" />
          <Select value={filterCat} onChange={(e) => setFilterCat(e.target.value)} className="w-full sm:w-auto">
            <option value="">{t('all-categories')}</option>
            {categories.filter((c) => c.tipe === tipe).map((c) => <option key={c.id} value={c.id}>{c.nama}</option>)}
          </Select>
          <Input type="month" value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)} className="w-full sm:w-auto" />
          {(
            <Button variant="secondary" onClick={() => exportCSV(rows.map((x) => ({ [t('date')]: x.tanggal, [t('category')]: catName(x.kategori_id), [t('description')]: x.keterangan, [t('amount')]: x.jumlah, [t('status')]: x.status })), tipe)}>
              <Download className="h-4 w-4" /> {t('export')}
            </Button>
          )}
          {canAdd(role) && <Button onClick={() => setModal({ tipe })}><Plus className="h-4 w-4" /> {tipe === 'pemasukan' ? t('add-income') : t('add-expense')}</Button>}
        </div>
        <Table>
          <THead><TR><TH>{t('date')}</TH><TH>{t('category')}</TH><TH>{t('description')}</TH><TH>{t('donor')}</TH><TH>{t('amount')}</TH><TH>{t('status')}</TH><TH>{t('action')}</TH></TR></THead>
          <TBody>
            {rows.map((x) => (
              <TR key={x.id}>
                <TD>{formatDate(x.tanggal)}</TD><TD>{catName(x.kategori_id)}</TD><TD>{x.keterangan}</TD>
                <TD className="mobile-hide">{donorName(x.donatur_id)}</TD>
                <TD className={x.tipe === 'pemasukan' ? 'text-emerald-400 font-semibold' : 'text-red-400 font-semibold'}>{formatRupiah(x.jumlah)}</TD>
                <TD><Badge variant={x.status === 'approved' ? 'success' : x.status === 'rejected' ? 'destructive' : 'warning'}>{t(x.status)}</Badge></TD>
                <TD>
                  <div className="flex gap-1">
                    {canApprove(role) && x.status === 'pending' && (
                      <>
                        <Button variant="ghost" size="icon" aria-label={t('approve')} onClick={async () => { const r = await approveTransaction(x.id); r.ok ? toast.success(t('approved')) : toast.error(tm(r.error)); }}><Check className="h-4 w-4 text-emerald-400" /></Button>
                        <Button variant="ghost" size="icon" aria-label={t('reject')} onClick={async () => { const r = await rejectTransaction(x.id); r.ok ? toast.success(t('rejected')) : toast.error(tm(r.error)); }}><X className="h-4 w-4 text-destructive" /></Button>
                      </>
                    )}
                    {canEdit(role) && x.status === 'pending' && <Button variant="ghost" size="icon" aria-label={t('act-edit')} onClick={() => setModal({ tipe, editing: x })}><Pencil className="h-4 w-4" /></Button>}
                    {canDelete(role) && <Button variant="ghost" size="icon" aria-label={t('act-delete')} onClick={async () => { if (confirm(t('confirmation'))) { const r = await deleteTransaction(x.id); r.ok ? toast.success(t('save')) : toast.error(tm(r.error)); } }}><Trash2 className="h-4 w-4 text-destructive" /></Button>}
                  </div>
                </TD>
              </TR>
            ))}
            {rows.length === 0 && <TR><TD colSpan={7} className="text-center text-muted-foreground">{t('none')}</TD></TR>}
          </TBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      <div>
        <h1 className="text-xl font-bold sm:text-2xl">{t('finance')}</h1>
        <p className="hidden text-muted-foreground sm:block">{t('manage-finance')}</p>
      </div>
      <Tabs active={tab} onChange={setTab} tabs={[
        { id: 'dashboard', label: t('finance-dashboard') },
        { id: 'pemasukan', label: t('income') },
        { id: 'pengeluaran', label: t('expense') },
        { id: 'kategori', label: t('categories') },
        { id: 'laporan', label: t('finance-report') },
        { id: 'approval', label: `${t('approval')} (${pending.length})` },
      ]} />

      {tab === 'dashboard' && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
            <Card className="col-span-3 sm:col-span-1"><CardContent className="p-3 sm:p-5"><p className="text-xs text-muted-foreground sm:text-sm">{t('current-balance')}</p><p className="text-xl font-bold text-primary sm:text-2xl">{formatRupiah(saldo)}</p>
              {canApprove(role) && <Button variant="ghost" size="sm" className="mt-1" onClick={() => setSaldoModal(true)}>{t('saldo-awal')}: {formatRupiah(Number(settings?.saldo_awal || 0))}</Button>}
            </CardContent></Card>
            <Card><CardContent className="p-2.5 sm:p-5"><p className="truncate text-[11px] text-muted-foreground sm:text-sm">{t('total-income')}</p><p className="truncate text-sm font-bold text-emerald-400 sm:text-2xl"><span className="sm:hidden">{formatRupiahCompact(totalIn)}</span><span className="hidden sm:inline">{formatRupiah(totalIn)}</span></p></CardContent></Card>
            <Card><CardContent className="p-2.5 sm:p-5"><p className="truncate text-[11px] text-muted-foreground sm:text-sm">{t('total-expense')}</p><p className="truncate text-sm font-bold text-red-400 sm:text-2xl"><span className="sm:hidden">{formatRupiahCompact(totalOut)}</span><span className="hidden sm:inline">{formatRupiah(totalOut)}</span></p></CardContent></Card>
            <Card><CardContent className="p-2.5 sm:p-5"><p className="truncate text-[11px] text-muted-foreground sm:text-sm">{t('total-donors')}</p><p className="text-sm font-bold sm:text-2xl">{donors.length}</p></CardContent></Card>
          </div>
          <Card><CardHeader><CardTitle>{t('income-expense-chart')}</CardTitle></CardHeader><CardContent><FinanceLineChart data={chartData} /></CardContent></Card>
          <div className="snap-row grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card><CardHeader><CardTitle>{t('income-by-category')}</CardTitle></CardHeader><CardContent><CategoryPieChart data={catChart('pemasukan')} /></CardContent></Card>
            <Card><CardHeader><CardTitle>{t('expense-by-category')}</CardTitle></CardHeader><CardContent><CategoryPieChart data={catChart('pengeluaran')} /></CardContent></Card>
          </div>
        </div>
      )}

      {tab === 'pemasukan' && trxTable('pemasukan')}
      {tab === 'pengeluaran' && trxTable('pengeluaran')}

      {tab === 'kategori' && (
        <div className="space-y-3">
          {canAdd(role) && <Button onClick={() => setCatModal({})}><Plus className="h-4 w-4" /> {t('add-category')}</Button>}
          <Table>
            <THead><TR><TH>{t('category-name')}</TH><TH>{t('category-type')}</TH><TH>{t('description')}</TH><TH>{t('action')}</TH></TR></THead>
            <TBody>
              {categories.map((c) => (
                <TR key={c.id}>
                  <TD className="font-medium">{c.nama}</TD>
                  <TD><Badge variant={c.tipe === 'pemasukan' ? 'success' : 'destructive'}>{t(c.tipe === 'pemasukan' ? 'income' : 'expense')}</Badge></TD>
                  <TD>{c.deskripsi}</TD>
                  <TD><div className="flex gap-1">
                    {canEdit(role) && <Button variant="ghost" size="icon" onClick={() => setCatModal(c)} aria-label={t('act-edit')}><Pencil className="h-4 w-4" /></Button>}
                    {canDelete(role) && <Button variant="ghost" size="icon" aria-label={t('act-delete')} onClick={async () => { if (confirm(t('confirmation'))) { const r = await deleteFinanceCategory(c.id); r.ok ? toast.success(t('save')) : toast.error(tm(r.error)); } }}><Trash2 className="h-4 w-4 text-destructive" /></Button>}
                  </div></TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </div>
      )}

      {tab === 'laporan' && (
        <div className="space-y-3">
          {(
            <Button variant="secondary" onClick={() => printPDF(t('laporan-keuangan'), transactions.map((x) => ({ [t('date')]: x.tanggal, [t('type')]: x.tipe, [t('category')]: catName(x.kategori_id), [t('description')]: x.keterangan, [t('amount')]: x.jumlah, [t('status')]: x.status })))}>
              <Download className="h-4 w-4" /> {t('export-report')}
            </Button>
          )}
          <Card><CardContent className="space-y-1.5 p-3 text-sm sm:space-y-2 sm:p-6 sm:text-base">
            <h3 className="text-base font-bold sm:text-lg">{t('laporan-keuangan')}</h3>
            <p className="flex justify-between gap-3 border-b border-white/10 pb-1.5"><span>{t('saldo-awal')}</span><b className="tabular-nums">{formatRupiah(Number(settings?.saldo_awal || 0))}</b></p>
            <p className="flex justify-between gap-3 border-b border-white/10 pb-1.5"><span>{t('total-income')}</span><b className="tabular-nums text-emerald-400">{formatRupiah(totalIn)}</b></p>
            <p className="flex justify-between gap-3 border-b border-white/10 pb-1.5"><span>{t('total-expense')}</span><b className="tabular-nums text-red-400">{formatRupiah(totalOut)}</b></p>
            <p className="flex justify-between gap-3 text-base sm:text-xl"><span>{t('current-balance')}</span><b className="tabular-nums text-primary">{formatRupiah(saldo)}</b></p>
          </CardContent></Card>
        </div>
      )}

      {tab === 'approval' && (
        <div className="space-y-4 sm:space-y-6">
          <div>
            <h3 className="mb-2 font-semibold">{t('pending-approval')}</h3>
            <Table>
              <THead><TR><TH>{t('date')}</TH><TH>{t('type')}</TH><TH>{t('category')}</TH><TH>{t('amount')}</TH><TH>{t('action')}</TH></TR></THead>
              <TBody>
                {pending.map((x) => (
                  <TR key={x.id}>
                    <TD>{formatDate(x.tanggal)}</TD><TD className="capitalize">{x.tipe}</TD><TD>{catName(x.kategori_id)}</TD>
                    <TD>{formatRupiah(x.jumlah)}</TD>
                    <TD>{canApprove(role) ? (
                      <div className="flex gap-1">
                        <Button size="sm" onClick={async () => { const r = await approveTransaction(x.id); r.ok ? toast.success(t('approved')) : toast.error(tm(r.error)); }}><Check className="h-3 w-3" /> {t('approve')}</Button>
                        <Button size="sm" variant="destructive" onClick={async () => { const r = await rejectTransaction(x.id); r.ok ? toast.success(t('rejected')) : toast.error(tm(r.error)); }}><X className="h-3 w-3" /> {t('reject')}</Button>
                      </div>
                    ) : <Badge variant="warning">{t('pending')}</Badge>}</TD>
                  </TR>
                ))}
                {pending.length === 0 && <TR><TD colSpan={5} className="text-center text-muted-foreground">{t('none')}</TD></TR>}
              </TBody>
            </Table>
          </div>
          <div>
            <h3 className="mb-2 font-semibold">{t('approval-history')}</h3>
            <Table>
              <THead><TR><TH>{t('date')}</TH><TH>ID Trx</TH><TH>{t('action')}</TH></TR></THead>
              <TBody>
                {history.map((h) => (
                  <TR key={h.id}><TD>{formatDate(h.created_at)}</TD><TD>#{h.transaction_id}</TD>
                    <TD><Badge variant={h.action === 'approved' ? 'success' : 'destructive'}>{t(h.action)}</Badge></TD></TR>
                ))}
                {history.length === 0 && <TR><TD colSpan={3} className="text-center text-muted-foreground">{t('none')}</TD></TR>}
              </TBody>
            </Table>
          </div>
        </div>
      )}

      {/* Modal transaksi */}
      <Modal open={!!modal} onClose={() => setModal(null)} title={modal?.tipe === 'pemasukan' ? t('add-income') : t('add-expense')}>
        {modal && (
          <form onSubmit={handleSaveTrx} className="space-y-4">
            <div className="space-y-2"><Label>{t('select-category')}</Label>
              <Select name="kategori_id" defaultValue={modal.editing?.kategori_id || ''}>
                <option value="">{t('select')}</option>
                {categories.filter((c) => c.tipe === modal.tipe).map((c) => <option key={c.id} value={c.id}>{c.nama}</option>)}
              </Select>
            </div>
            <div className="space-y-2"><Label>{t('amount')}</Label><Input name="jumlah" type="number" min={1} defaultValue={modal.editing?.jumlah} required /></div>
            <div className="space-y-2"><Label>{t('date')}</Label><Input name="tanggal" type="date" defaultValue={modal.editing?.tanggal || new Date().toISOString().slice(0, 10)} required /></div>
            <div className="space-y-2"><Label>{t('select-donor')}</Label>
              <Select name="donatur_id" defaultValue={modal.editing?.donatur_id || ''}><option value="">{t('none')}</option>{donors.map((d) => <option key={d.id} value={d.id}>{d.nama}</option>)}</Select>
            </div>
            <div className="space-y-2"><Label>{t('description')}</Label><Textarea name="keterangan" defaultValue={modal.editing?.keterangan || ''} /></div>
            {!canApprove(role) && <p className="text-xs text-amber-400">{t('pending-approval')}: transaksi admin menunggu approval superadmin.</p>}
            <div className="flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={() => setModal(null)}>{t('cancel')}</Button>
              <Button type="submit">{t('save')}</Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Modal kategori */}
      <Modal open={!!catModal} onClose={() => setCatModal(null)} title={t('add-category')}>
        {catModal && (
          <form onSubmit={handleSaveCat} className="space-y-4">
            <div className="space-y-2"><Label>{t('category-name')}</Label><Input name="nama" defaultValue={catModal.nama || ''} required /></div>
            <div className="space-y-2"><Label>{t('category-type')}</Label>
              <Select name="tipe" defaultValue={catModal.tipe || 'pemasukan'}><option value="pemasukan">{t('income')}</option><option value="pengeluaran">{t('expense')}</option></Select>
            </div>
            <div className="space-y-2"><Label>{t('description')}</Label><Input name="deskripsi" defaultValue={catModal.deskripsi || ''} /></div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={() => setCatModal(null)}>{t('cancel')}</Button>
              <Button type="submit">{t('save')}</Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Modal saldo awal */}
      <Modal open={saldoModal} onClose={() => setSaldoModal(false)} title={t('saldo-awal')}>
        <form className="space-y-4" onSubmit={async (e) => {
          e.preventDefault();
          const v = Number(new FormData(e.currentTarget).get('saldo'));
          const r = await updateSaldoAwal(v);
          r.ok ? (toast.success(t('save')), setSaldoModal(false)) : toast.error(tm(r.error));
        }}>
          <Input name="saldo" type="number" defaultValue={Number(settings?.saldo_awal || 0)} required />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setSaldoModal(false)}>{t('cancel')}</Button>
            <Button type="submit">{t('save')}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
