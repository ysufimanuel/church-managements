'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ArrowDown, ArrowUp, Copy, ExternalLink, Eye, EyeOff, GripVertical, Monitor, MousePointerClick, Plus, Rocket, Smartphone, Tablet, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { cn } from '@/lib/utils';
import { canDelete, type Role } from '@/lib/rbac';
import { deleteSection, publishSections, reorderSections, saveSectionContent, saveSectionDraft, setSectionEnabled } from '@/lib/actions/webmanager';
import { SectionPanel, type PageOption } from './visual-editor-panel';
import { SECTION_META, SECTION_ORDER, effective, hasUnpublished, pageLabel, sectionMeta, sectionSummary, type SectionTypeId } from './visual-editor-config';

type ActionRes = { ok: boolean; error?: string; id?: number };
type SaveState = 'idle' | 'dirty' | 'saving' | 'saved' | 'error';
type Device = 'mobile' | 'tablet' | 'desktop';
type MobileView = 'list' | 'preview' | 'edit';
type ConfirmState = { title: string; body: string; confirmLabel: string; danger?: boolean; onConfirm: () => void } | null;

const DEVICE_WIDTH: Record<Device, number | null> = { mobile: 390, tablet: 820, desktop: null };
const AUTOSAVE_MS = 900;
const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value ?? {}));

export function VisualEditor({ sections, pages, theme, role, publicPath }: { sections: any[]; pages: string[]; theme: any; role: Role; publicPath: string | null }) {
  const router = useRouter();
  const [page, setPage] = React.useState('home');
  const [selectedId, setSelectedId] = React.useState<number | null>(null);
  const [content, setContent] = React.useState<Record<string, any>>({});
  const [saveState, setSaveState] = React.useState<SaveState>('idle');
  const [device, setDevice] = React.useState<Device>('desktop');
  const [mobileView, setMobileView] = React.useState<MobileView>('preview');
  const [override, setOverride] = React.useState<number[] | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [addOpen, setAddOpen] = React.useState(false);
  const [confirm, setConfirm] = React.useState<ConfirmState>(null);
  const [previewEnabled, setPreviewEnabled] = React.useState(false);
  const [frameLoading, setFrameLoading] = React.useState(false);
  const [frameKey, setFrameKey] = React.useState(0);
  const [dragId, setDragId] = React.useState<number | null>(null);
  const [overId, setOverId] = React.useState<number | null>(null);

  const iframeRef = React.useRef<HTMLIFrameElement>(null);
  const sectionsRef = React.useRef(sections);
  const selectedIdRef = React.useRef<number | null>(null);
  const contentRef = React.useRef<Record<string, any>>({});
  const cacheRef = React.useRef(new Map<number, Record<string, any>>());
  const pendingRef = React.useRef<{ id: number; content: Record<string, any> } | null>(null);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const chainRef = React.useRef<Promise<void>>(Promise.resolve());
  const pendingSelectRef = React.useRef<number | null>(null);
  sectionsRef.current = sections;

  const pageOptions: PageOption[] = React.useMemo(() => pages.map((slug) => ({ slug, label: pageLabel(slug) })), [pages]);
  const palette = React.useMemo(() => {
    const t = theme?.draft || theme?.published || {};
    const list = [t.primary_color, t.secondary_color, t.accent_color, '#FFFFFF', '#111827'].filter((c) => typeof c === 'string' && /^#[0-9a-f]{6}$/i.test(c)) as string[];
    return Array.from(new Set(list.map((c) => c.toUpperCase())));
  }, [theme]);

  /* ───────── daftar bagian untuk halaman aktif ───────── */
  const baseList = React.useMemo(
    () => sections
      .filter((s) => { const e = effective(s); return e.page === page && !e.deleted; })
      .sort((a, b) => effective(a).sort - effective(b).sort || a.id - b.id),
    [sections, page],
  );
  const baseKey = baseList.map((s) => s.id).join(',');
  const ordered = React.useMemo(() => {
    if (!override) return baseList;
    const byId = new Map(baseList.map((s) => [s.id as number, s]));
    const out = override.map((id) => byId.get(id)).filter(Boolean) as any[];
    baseList.forEach((s) => { if (!override.includes(s.id)) out.push(s); });
    return out;
  }, [baseList, override]);

  React.useEffect(() => {
    if (override && override.length === baseList.length && override.every((id, i) => id === baseList[i].id)) setOverride(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseKey, override]);

  const selected = selectedId == null ? null : sections.find((s) => s.id === selectedId && !effective(s).deleted) || null;
  const localHas = (s: any) => hasUnpublished(s.id === selectedId ? { ...s, content } : s);
  const unpublishedCount = sections.filter((s) => effective(s).page === page && localHas(s)).length;
  const previewSrc = publicPath ? `${publicPath}${page === 'home' ? '' : `/${page}`}?preview=draft&edit=1` : null;

  /* ───────── pratinjau (iframe) ───────── */
  const postFocus = React.useCallback((id: number | null, scroll = true) => {
    iframeRef.current?.contentWindow?.postMessage({ type: 'wm:focus', id, scroll }, window.location.origin);
  }, []);
  const reloadPreview = React.useCallback(() => {
    if (!previewEnabled) return;
    setFrameLoading(true);
    try { iframeRef.current?.contentWindow?.location.reload(); } catch { setFrameKey((k) => k + 1); }
  }, [previewEnabled]);

  /* ───────── autosave ───────── */
  const flush = React.useCallback(async () => {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
    const pending = pendingRef.current;
    if (pending) {
      pendingRef.current = null;
      setSaveState('saving');
      chainRef.current = chainRef.current.then(async () => {
        try {
          const res: ActionRes = await saveSectionContent(pending.id, pending.content);
          if (res.ok) {
            setSaveState(pendingRef.current ? 'dirty' : 'saved');
            reloadPreview();
          } else {
            if (!pendingRef.current) pendingRef.current = pending;
            setSaveState('error');
            toast.error(res.error || 'Gagal menyimpan perubahan');
          }
        } catch (error) {
          if (!pendingRef.current) pendingRef.current = pending;
          setSaveState('error');
          toast.error(error instanceof Error ? error.message : 'Gagal menghubungi server');
        }
      });
    }
    await chainRef.current;
  }, [reloadPreview]);

  const queueSave = React.useCallback((id: number, next: Record<string, any>) => {
    pendingRef.current = { id, content: next };
    setSaveState('dirty');
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => { void flush(); }, AUTOSAVE_MS);
  }, [flush]);

  // If a custom page disappears from Draft navigation and has no active sections,
  // move the editor back to a valid page instead of leaving a dead select value.
  React.useEffect(() => {
    if (pages.includes(page)) return;
    let cancelled = false;
    void (async () => {
      await flush();
      if (cancelled) return;
      selectedIdRef.current = null;
      setSelectedId(null);
      setSaveState('idle');
      setOverride(null);
      setFrameLoading(true);
      setPage(pages.includes('home') ? 'home' : (pages[0] || 'home'));
    })();
    return () => { cancelled = true; };
  }, [pages, page, flush]);

  const updateContent = React.useCallback((patch: Record<string, any>) => {
    const id = selectedIdRef.current;
    if (id == null) return;
    const next = { ...contentRef.current, ...patch };
    contentRef.current = next;
    cacheRef.current.set(id, next);
    setContent(next);
    queueSave(id, next);
  }, [queueSave]);

  React.useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => { if (pendingRef.current) { e.preventDefault(); e.returnValue = ''; } };
    window.addEventListener('beforeunload', warn);
    return () => { window.removeEventListener('beforeunload', warn); void flush(); };
  }, [flush]);

  /* ───────── pilih / tutup bagian ───────── */
  const selectSection = React.useCallback(async (id: number) => {
    setMobileView('edit');
    if (id === selectedIdRef.current) return;
    await flush();
    const s = sectionsRef.current.find((x) => x.id === id && !effective(x).deleted);
    if (!s) return;
    const next = clone(cacheRef.current.get(id) ?? s.content ?? {});
    selectedIdRef.current = id;
    contentRef.current = next;
    setSelectedId(id);
    setContent(next);
    setSaveState('idle');
  }, [flush]);
  const selectRef = React.useRef(selectSection);
  selectRef.current = selectSection;

  const deselect = React.useCallback(async () => {
    await flush();
    selectedIdRef.current = null;
    setSelectedId(null);
    setSaveState('idle');
    setMobileView('preview');
  }, [flush]);

  React.useEffect(() => { postFocus(selectedId, true); }, [selectedId, postFocus]);

  React.useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== iframeRef.current?.contentWindow) return;
      const data = event.data as { type?: string; id?: number } | null;
      if (!data || typeof data !== 'object') return;
      if (data.type === 'wm:select' && Number.isSafeInteger(data.id)) void selectRef.current(Number(data.id));
      if (data.type === 'wm:ready') postFocus(selectedIdRef.current, false);
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [postFocus]);

  React.useEffect(() => {
    const id = pendingSelectRef.current;
    if (id != null && sections.some((s) => s.id === id && !effective(s).deleted)) { pendingSelectRef.current = null; void selectSection(id); }
  }, [sections, selectSection]);

  React.useEffect(() => {
    if (selectedId != null && !sections.some((s) => s.id === selectedId && !effective(s).deleted)) { selectedIdRef.current = null; setSelectedId(null); }
  }, [sections, selectedId]);

  async function changePage(slug: string) {
    if (slug === page) return;
    await flush();
    selectedIdRef.current = null;
    setSelectedId(null);
    setSaveState('idle');
    setOverride(null);
    setFrameLoading(previewEnabled);
    setPage(slug);
  }

  /* ───────── aksi pada bagian ───────── */
  const maxSort = () => baseList.reduce((m, s) => Math.max(m, effective(s).sort), 0);

  async function addSection(type: SectionTypeId) {
    setAddOpen(false);
    await flush();
    setBusy(true);
    const defaults = SECTION_META[type].defaults();
    const res: ActionRes = await saveSectionDraft({ page, type, sort_order: maxSort() + 10, content: defaults, enabled: true });
    setBusy(false);
    if (!res.ok || res.id == null) { toast.error(res.error || 'Gagal menambah bagian'); return; }
    cacheRef.current.set(res.id, defaults);
    pendingSelectRef.current = res.id;
    toast.success(`${SECTION_META[type].label} ditambahkan di bagian paling bawah`);
    router.refresh();
    reloadPreview();
  }

  async function duplicateSection(s: any) {
    await flush();
    setBusy(true);
    const e = effective(s);
    const source = clone(cacheRef.current.get(s.id) ?? s.content ?? {});
    const res: ActionRes = await saveSectionDraft({ page, type: e.type, sort_order: maxSort() + 10, content: source, enabled: e.enabled });
    if (!res.ok || res.id == null) { setBusy(false); toast.error(res.error || 'Gagal menggandakan bagian'); return; }
    const ids = ordered.map((x) => x.id as number);
    ids.splice(ids.indexOf(s.id) + 1, 0, res.id);
    const moved: ActionRes = await reorderSections(ids);
    setBusy(false);
    if (!moved.ok) toast.error(moved.error || 'Bagian digandakan, tetapi urutannya belum bisa dipindah');
    else toast.success('Bagian digandakan tepat di bawah aslinya');
    cacheRef.current.set(res.id, source);
    pendingSelectRef.current = res.id;
    router.refresh();
    reloadPreview();
  }

  async function toggleEnabled(s: any) {
    await flush();
    setBusy(true);
    const res: ActionRes = await setSectionEnabled(s.id, !effective(s).enabled);
    setBusy(false);
    if (!res.ok) { toast.error(res.error || 'Gagal mengubah tampilan'); return; }
    router.refresh();
    reloadPreview();
  }

  async function applyOrder(ids: number[]) {
    if (ids.length === ordered.length && ids.every((id, i) => id === ordered[i].id)) return;
    setOverride(ids);
    await flush();
    const res: ActionRes = await reorderSections(ids);
    if (!res.ok) { setOverride(null); toast.error(res.error || 'Gagal mengubah urutan'); return; }
    router.refresh();
    reloadPreview();
  }

  function moveSection(id: number, delta: number) {
    const ids = ordered.map((s) => s.id as number);
    const from = ids.indexOf(id);
    const to = from + delta;
    if (from < 0 || to < 0 || to >= ids.length) return;
    [ids[from], ids[to]] = [ids[to], ids[from]];
    void applyOrder(ids);
  }

  function askDelete(s: any) {
    const label = sectionMeta(effective(s).type).label;
    setConfirm({
      title: `Hapus “${label}”?`,
      body: 'Bagian ini akan dihapus dari halaman. Jika halaman sudah pernah dipublikasikan, bagian ini baru hilang dari website setelah kamu menekan Publikasikan.',
      confirmLabel: 'Ya, hapus',
      danger: true,
      onConfirm: async () => {
        setConfirm(null);
        await flush();
        setBusy(true);
        const res: ActionRes = await deleteSection(s.id);
        setBusy(false);
        if (!res.ok) { toast.error(res.error || 'Gagal menghapus'); return; }
        if (selectedIdRef.current === s.id) { selectedIdRef.current = null; setSelectedId(null); setMobileView('preview'); }
        cacheRef.current.delete(s.id);
        toast.success('Bagian dihapus');
        router.refresh();
        reloadPreview();
      },
    });
  }

  function askPublish() {
    setConfirm({
      title: `Publikasikan halaman ${pageLabel(page)}?`,
      body: 'Semua perubahan pada halaman ini akan langsung tampil di website publik gereja.',
      confirmLabel: 'Publikasikan sekarang',
      onConfirm: async () => {
        setConfirm(null);
        setBusy(true);
        await flush();
        const res: ActionRes = await publishSections(page);
        setBusy(false);
        if (!res.ok) { toast.error(res.error || 'Gagal mempublikasikan'); return; }
        toast.success('Halaman sudah tayang di website publik');
        router.refresh();
      },
    });
  }

  /* ───────── tampilan ───────── */
  const statusChip = (() => {
    if (saveState === 'dirty') return <span className="text-xs text-muted-foreground">Belum tersimpan…</span>;
    if (saveState === 'saving') return <span className="text-xs text-muted-foreground">Menyimpan…</span>;
    if (saveState === 'saved') return <span className="text-xs font-medium text-emerald-400">✓ Tersimpan sebagai draf</span>;
    if (saveState === 'error') return <button type="button" onClick={() => void flush()} className="text-xs font-semibold text-destructive underline underline-offset-4">Gagal menyimpan · Coba lagi</button>;
    return <span className="hidden text-xs text-muted-foreground xl:inline">Perubahan tersimpan otomatis sebagai draf</span>;
  })();

  const selectedMeta = selected ? sectionMeta(effective(selected).type) : null;
  const deviceWidth = DEVICE_WIDTH[device];

  return (
    <div className="space-y-3">
      {/* Bilah atas */}
      <div className="flex flex-wrap items-center gap-2 glass rounded-xl p-3">
        <div className="min-w-[10rem] flex-1 sm:flex-none">
          <Select aria-label="Pilih halaman" value={page} onChange={(e) => void changePage(e.target.value)} className="font-medium">
            {pageOptions.map((p) => <option key={p.slug} value={p.slug}>Halaman: {p.label}</option>)}
          </Select>
        </div>
        <div className="hidden items-center gap-1 rounded-lg bg-secondary/60 p-1 lg:flex" role="group" aria-label="Ukuran layar pratinjau">
          {([['mobile', Smartphone, 'HP'], ['tablet', Tablet, 'Tablet'], ['desktop', Monitor, 'Komputer']] as const).map(([id, Icon, label]) => (
            <button key={id} type="button" aria-pressed={device === id} aria-label={`Pratinjau ${label}`} title={label} onClick={() => setDevice(id)} className={cn('flex h-9 w-9 items-center justify-center rounded-md transition-colors', device === id ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary')}>
              <Icon className="h-4 w-4" />
            </button>
          ))}
        </div>
        <div className="ml-auto flex flex-wrap items-center gap-3">
          {statusChip}
          {previewSrc && (
            <a href={previewSrc.replace('&edit=1', '')} target="_blank" rel="noreferrer" className="hidden items-center gap-1 text-xs font-medium text-primary underline underline-offset-4 sm:inline-flex">
              <ExternalLink className="h-3.5 w-3.5" /> Buka pratinjau
            </a>
          )}
          <Button onClick={askPublish} disabled={busy || (unpublishedCount === 0 && saveState !== 'dirty')}>
            <Rocket className="h-4 w-4" /> {unpublishedCount > 0 ? `Publikasikan (${unpublishedCount})` : 'Sudah tayang'}
          </Button>
        </div>
      </div>

      {/* Pilihan tampilan di layar kecil */}
      <div className="grid grid-cols-3 gap-1 rounded-lg bg-secondary/60 p-1 lg:hidden" role="tablist">
        {([['list', 'Bagian'], ['preview', 'Pratinjau'], ['edit', 'Edit']] as const).map(([id, label]) => (
          <button key={id} type="button" role="tab" aria-selected={mobileView === id} onClick={() => setMobileView(id)} className={cn('min-h-10 rounded-md text-sm font-medium transition-colors', mobileView === id ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary')}>{label}</button>
        ))}
      </div>

      <div className="grid gap-3 lg:h-[calc(100vh-17rem)] lg:min-h-[620px] lg:grid-cols-[290px_minmax(0,1fr)_380px]">
        {/* Daftar bagian */}
        <aside className={cn('flex-col overflow-hidden glass rounded-xl', mobileView === 'list' ? 'flex' : 'hidden', 'lg:flex')}>
          <div className="flex items-center justify-between gap-2 border-b p-3">
            <div><p className="text-sm font-semibold">Isi Halaman</p><p className="text-xs text-muted-foreground">Seret untuk mengubah urutan</p></div>
            <Button size="sm" onClick={() => setAddOpen(true)} disabled={busy}><Plus className="h-4 w-4" /> Tambah</Button>
          </div>
          <div className="flex-1 space-y-2 overflow-y-auto p-3">
            {ordered.length === 0 && (
              <div className="rounded-xl border border-dashed p-6 text-center">
                <p className="text-sm font-medium">Halaman ini masih kosong</p>
                <p className="mt-1 text-xs text-muted-foreground">Mulai dengan menambahkan bagian pertama, misalnya Banner Utama.</p>
                <Button className="mt-4" onClick={() => setAddOpen(true)}><Plus className="h-4 w-4" /> Tambah bagian pertama</Button>
              </div>
            )}
            {ordered.map((s, index) => {
              const e = effective(s);
              const meta = sectionMeta(e.type);
              const Icon = meta.icon;
              const isSelected = s.id === selectedId;
              const text = isSelected ? content : s.content;
              return (
                <div
                  key={s.id}
                  draggable
                  onDragStart={(ev) => { setDragId(s.id); ev.dataTransfer.effectAllowed = 'move'; ev.dataTransfer.setData('text/plain', String(s.id)); }}
                  onDragOver={(ev) => { if (dragId == null) return; ev.preventDefault(); setOverId(s.id); }}
                  onDrop={(ev) => {
                    ev.preventDefault();
                    if (dragId != null && dragId !== s.id) {
                      const ids = ordered.map((x) => x.id as number);
                      ids.splice(ids.indexOf(dragId), 1);
                      ids.splice(ids.indexOf(s.id), 0, dragId);
                      void applyOrder(ids);
                    }
                    setDragId(null); setOverId(null);
                  }}
                  onDragEnd={() => { setDragId(null); setOverId(null); }}
                  className={cn('rounded-xl border transition-colors', isSelected ? 'border-primary bg-primary/5' : 'hover:border-primary/50', overId === s.id && dragId !== s.id && 'border-primary border-dashed', dragId === s.id && 'opacity-50', !e.enabled && 'opacity-60')}
                >
                  <div className="flex items-center gap-2 p-2">
                    <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-muted-foreground" aria-hidden />
                    <button type="button" onClick={() => void selectSection(s.id)} className="flex min-w-0 flex-1 items-center gap-2 text-left" aria-current={isSelected}>
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary"><Icon className="h-4 w-4" /></span>
                      <span className="min-w-0">
                        <span className="flex items-center gap-1.5 text-sm font-medium">
                          {meta.label}
                          {localHas(s) && <span className="h-2 w-2 rounded-full bg-amber-400" title="Belum dipublikasikan" />}
                        </span>
                        <span className="block truncate text-xs text-muted-foreground">{e.enabled ? sectionSummary(e.type, text) : 'Disembunyikan dari website'}</span>
                      </span>
                    </button>
                    <button type="button" onClick={() => void toggleEnabled(s)} disabled={busy} aria-label={e.enabled ? 'Sembunyikan bagian ini' : 'Tampilkan bagian ini'} title={e.enabled ? 'Sembunyikan' : 'Tampilkan'} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary disabled:opacity-50">
                      {e.enabled ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </button>
                  </div>
                  {isSelected && (
                    <div className="flex flex-wrap items-center gap-1 border-t px-2 py-1.5">
                      <Button type="button" variant="ghost" size="sm" disabled={busy || index === 0} onClick={() => moveSection(s.id, -1)} aria-label="Naikkan"><ArrowUp className="h-4 w-4" /></Button>
                      <Button type="button" variant="ghost" size="sm" disabled={busy || index === ordered.length - 1} onClick={() => moveSection(s.id, 1)} aria-label="Turunkan"><ArrowDown className="h-4 w-4" /></Button>
                      <Button type="button" variant="ghost" size="sm" disabled={busy} onClick={() => void duplicateSection(s)}><Copy className="h-4 w-4" /> Gandakan</Button>
                      {canDelete(role) && <Button type="button" variant="ghost" size="sm" disabled={busy} onClick={() => askDelete(s)} className="text-destructive"><Trash2 className="h-4 w-4" /> Hapus</Button>}
                    </div>
                  )}
                </div>
              );
            })}
            {!canDelete(role) && ordered.length > 0 && <p className="px-1 text-xs text-muted-foreground">Untuk menyingkirkan bagian, gunakan ikon mata agar disembunyikan. Menghapus permanen hanya bisa dilakukan Superadmin.</p>}
          </div>
        </aside>

        {/* Pratinjau */}
        <section className={cn('min-h-0 flex-col overflow-hidden rounded-xl border bg-muted/30', mobileView === 'preview' ? 'flex' : 'hidden', 'lg:flex')}>
          <div className="flex items-center justify-between gap-2 border-b border-white/10 px-3 py-2">
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground"><MousePointerClick className="h-3.5 w-3.5" /> {selected ? 'Bagian yang sedang diedit ditandai dengan garis biru.' : 'Klik bagian mana pun di pratinjau untuk mengeditnya.'}</p>
            {frameLoading && previewSrc && <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><span className="h-3 w-3 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" /> Memperbarui…</span>}
          </div>
          <div className="flex min-h-0 flex-1 justify-center overflow-auto p-2 sm:p-3">
            {previewSrc && previewEnabled ? (
              <iframe
                key={page + '-' + frameKey}
                ref={iframeRef}
                src={previewSrc}
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                title={'Pratinjau halaman ' + pageLabel(page)}
                onLoad={() => { setFrameLoading(false); postFocus(selectedIdRef.current, false); }}
                className={cn('h-[70vh] rounded-lg border bg-white shadow-lg lg:h-full', deviceWidth ? 'shrink-0' : 'w-full')}
                style={deviceWidth ? { width: deviceWidth, maxWidth: '100%' } : undefined}
              />
            ) : previewSrc ? (
              <div className="flex h-full min-h-[320px] w-full flex-col items-center justify-center gap-3 rounded-lg border border-dashed p-6 text-center">
                <span className="text-sm text-muted-foreground">Preview website dimuat saat diminta agar resource situs publik tidak membebani editor.</span>
                <Button type="button" onClick={() => { setFrameLoading(true); setPreviewEnabled(true); }}>Muat preview website</Button>
              </div>
            ) : (
              <div className="flex h-full min-h-[320px] w-full items-center justify-center rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">Website publik belum tersedia untuk gereja ini.</div>
            )}
          </div>
        </section>

        {/* Panel edit */}
        <aside className={cn('min-h-0 flex-col overflow-hidden glass rounded-xl', mobileView === 'edit' ? 'flex' : 'hidden', 'lg:flex')}>
          {selected && selectedMeta ? (
            <>
              <div className="flex items-start justify-between gap-2 border-b p-3">
                <div className="flex min-w-0 items-start gap-2">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary"><selectedMeta.icon className="h-4 w-4" /></span>
                  <div className="min-w-0"><p className="text-sm font-semibold">{selectedMeta.label}</p><p className="text-xs text-muted-foreground">{selectedMeta.hint}</p></div>
                </div>
                <Button type="button" variant="ghost" size="icon" onClick={() => void deselect()} aria-label="Tutup panel edit"><X className="h-4 w-4" /></Button>
              </div>
              <div className="flex-1 overflow-y-auto p-3">
                <SectionPanel key={selected.id} type={effective(selected).type as SectionTypeId} content={content} onChange={updateContent} pages={pageOptions} palette={palette} />
              </div>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary"><MousePointerClick className="h-5 w-5 text-primary" /></span>
              <p className="text-sm font-semibold">Pilih bagian untuk diedit</p>
              <ol className="space-y-1.5 text-left text-xs text-muted-foreground">
                <li>1. Klik bagian di pratinjau, atau pilih dari daftar.</li>
                <li>2. Ubah tulisan, foto, dan warna di sini.</li>
                <li>3. Perubahan tersimpan otomatis sebagai draf.</li>
                <li>4. Tekan <b>Publikasikan</b> jika sudah siap tayang.</li>
              </ol>
            </div>
          )}
        </aside>
      </div>

      {/* Tambah bagian */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Tambah bagian baru" wide>
        <p className="mb-3 text-sm text-muted-foreground">Pilih jenis bagian. Bagian baru muncul di paling bawah halaman dan bisa dipindah kapan saja.</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {SECTION_ORDER.map((type) => {
            const meta = SECTION_META[type];
            return (
              <button key={type} type="button" onClick={() => void addSection(type)} className="flex items-start gap-3 rounded-xl border p-3 text-left transition-colors hover:border-primary hover:bg-primary/5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary"><meta.icon className="h-5 w-5" /></span>
                <span><span className="block text-sm font-semibold">{meta.label}</span><span className="mt-0.5 block text-xs text-muted-foreground">{meta.hint}</span></span>
              </button>
            );
          })}
        </div>
      </Modal>

      {/* Konfirmasi */}
      <Modal open={confirm !== null} onClose={() => setConfirm(null)} title={confirm?.title || ''}>
        <p className="text-sm text-muted-foreground">{confirm?.body}</p>
        <div className="mt-5 flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={() => setConfirm(null)}>Batal</Button>
          <Button type="button" variant={confirm?.danger ? 'destructive' : 'default'} onClick={() => confirm?.onConfirm()}>{confirm?.confirmLabel}</Button>
        </div>
      </Modal>
    </div>
  );
}
