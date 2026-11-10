'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Camera, Loader2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input, Label } from '@/components/ui/input';
import { InitialsAvatar } from '@/components/ui/initials-avatar';
import { useLang } from '@/components/lang-context';
import { createClient } from '@/lib/supabase/client';
import { changePasswordAction, updateProfileAction } from '@/lib/actions/profile';
import { roleLabel, type Role } from '@/lib/rbac';

export type ProfileData = {
  id: string; nama: string; role: Role; email: string; username: string; avatarUrl: string | null; isDemo: boolean;
};

const MAX_INPUT = 5 * 1024 * 1024;
const TYPES = ['image/jpeg', 'image/png', 'image/webp'];

/** Resize to <=512px and re-encode so uploads stay small (also avoids server-action body limits). */
async function resizeImage(file: File, max = 512): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, w, h);
  bitmap.close?.();
  return await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('encode'))), 'image/jpeg', 0.85));
}

export function ProfileModal({ open, onClose, profile }: { open: boolean; onClose: () => void; profile: ProfileData }) {
  const { t, lang } = useLang();
  const router = useRouter();
  const fileRef = React.useRef<HTMLInputElement>(null);
  const [nama, setNama] = React.useState(profile.nama);
  const [username, setUsername] = React.useState(profile.username);
  const [avatar, setAvatar] = React.useState<string | null>(profile.avatarUrl);
  const [busy, setBusy] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);
  const [curPw, setCurPw] = React.useState('');
  const [newPw, setNewPw] = React.useState('');

  React.useEffect(() => {
    if (open) { setNama(profile.nama); setUsername(profile.username); setAvatar(profile.avatarUrl); setCurPw(''); setNewPw(''); }
  }, [open, profile.nama, profile.username, profile.avatarUrl]);

  const locked = profile.isDemo;

  const removeOldFiles = async (keep?: string) => {
    try {
      const supabase = createClient();
      const { data } = await supabase.storage.from('avatars').list(profile.id);
      const old = (data ?? []).map((f) => `${profile.id}/${f.name}`).filter((p) => p !== keep);
      if (old.length) await supabase.storage.from('avatars').remove(old);
    } catch {}
  };

  const onPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || locked) return;
    if (!TYPES.includes(file.type)) return void toast.error(t('photo-invalid'));
    if (file.size > MAX_INPUT) return void toast.error(t('photo-too-large'));
    setUploading(true);
    try {
      const blob = await resizeImage(file);
      const path = `${profile.id}/avatar-${Date.now()}.jpg`;
      const supabase = createClient();
      const { error } = await supabase.storage.from('avatars').upload(path, blob, { contentType: 'image/jpeg', upsert: false });
      if (error) throw error;
      const url = supabase.storage.from('avatars').getPublicUrl(path).data.publicUrl;
      const res = await updateProfileAction({ nama: profile.nama, username: profile.username, avatarUrl: url, lang });
      if (!res.ok) throw new Error(res.error);
      setAvatar(url);
      void removeOldFiles(path);
      toast.success(t('profile-saved'));
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error && err.message ? err.message : t('upload-failed'));
    } finally {
      setUploading(false);
    }
  };

  const onRemove = async () => {
    if (locked) return;
    setUploading(true);
    const res = await updateProfileAction({ nama: profile.nama, username: profile.username, avatarUrl: null, lang });
    setUploading(false);
    if (!res.ok) return void toast.error(res.error ?? t('upload-failed'));
    setAvatar(null);
    void removeOldFiles();
    toast.success(t('profile-saved'));
    router.refresh();
  };

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (locked) return;
    setBusy(true);
    const res = await updateProfileAction({ nama, username, lang });
    if (res.ok && (curPw || newPw)) {
      const pw = await changePasswordAction({ current: curPw, next: newPw, lang });
      if (!pw.ok) { setBusy(false); return void toast.error(pw.error ?? t('upload-failed')); }
    }
    setBusy(false);
    if (!res.ok) return void toast.error(res.error ?? t('upload-failed'));
    toast.success(t('profile-saved'));
    router.refresh();
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={t('my-profile')}>
      <form onSubmit={onSave} className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <InitialsAvatar name={nama} src={avatar} className="h-20 w-20 text-2xl" />
            {uploading && (
              <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
                <Loader2 className="h-5 w-5 animate-spin" />
              </span>
            )}
          </div>
          <div className="min-w-0 space-y-2">
            <p className="truncate text-sm font-medium">{profile.nama}</p>
            <p className="text-xs text-muted-foreground">{roleLabel(profile.role)}</p>
            {!locked && (
              <div className="flex flex-wrap gap-2">
                <Button type="button" size="sm" variant="secondary" onClick={() => fileRef.current?.click()} disabled={uploading}>
                  <Camera className="h-4 w-4" />{t('change-photo')}
                </Button>
                {avatar && (
                  <Button type="button" size="sm" variant="ghost" onClick={onRemove} disabled={uploading} aria-label={t('remove-photo')}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
            <input ref={fileRef} type="file" accept={TYPES.join(',')} className="hidden" onChange={onPick} />
            {!locked && <p className="text-[11px] text-muted-foreground">{t('photo-hint')}</p>}
          </div>
        </div>

        {locked && (
          <p role="status" className="rounded-lg border border-amber-400/20 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
            {t('profile-demo-locked')}
          </p>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="pf-nama">{t('full-name')}</Label>
          <Input id="pf-nama" value={nama} onChange={(e) => setNama(e.target.value)} disabled={locked} required maxLength={100} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="pf-user">{t('username')}</Label>
          <Input id="pf-user" value={username} onChange={(e) => setUsername(e.target.value)} disabled={locked} maxLength={40} autoComplete="username" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="pf-email">{t('email')}</Label>
          <Input id="pf-email" value={profile.email} disabled readOnly />
        </div>

        {!locked && (
          <fieldset className="space-y-3 rounded-lg border border-white/10 p-3">
            <legend className="px-1 text-xs font-medium text-muted-foreground">{t('change-password')}</legend>
            <Input type="password" placeholder={t('current-password')} aria-label={t('current-password')} value={curPw} onChange={(e) => setCurPw(e.target.value)} autoComplete="current-password" />
            <Input type="password" placeholder={t('new-password')} aria-label={t('new-password')} value={newPw} onChange={(e) => setNewPw(e.target.value)} autoComplete="new-password" minLength={newPw ? 6 : undefined} />
          </fieldset>
        )}

        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="ghost" onClick={onClose}>{t('close')}</Button>
          {!locked && (
            <Button type="submit" disabled={busy || uploading}>
              {busy && <Loader2 className="h-4 w-4 animate-spin" />}
              {busy ? t('saving') : t('save-changes')}
            </Button>
          )}
        </div>
      </form>
    </Modal>
  );
}
