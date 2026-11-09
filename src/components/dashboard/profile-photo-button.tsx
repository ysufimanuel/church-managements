'use client';

import * as React from 'react';
import { Camera, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { updateProfilePhoto } from '@/lib/actions/profile';
import { InitialsAvatar } from '@/components/ui/initials-avatar';

export function ProfilePhotoButton({ name, avatarUrl }: { name: string; avatarUrl?: string | null }) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [preview, setPreview] = React.useState(avatarUrl || '');
  const [pending, startTransition] = React.useTransition();

  React.useEffect(() => { setPreview(avatarUrl || ''); }, [avatarUrl]);

  function onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);
    const data = new FormData();
    data.set('photo', file);
    startTransition(async () => {
      const result = await updateProfilePhoto(data);
      if (!result.ok) {
        setPreview(avatarUrl || '');
        toast.error(result.error);
      } else {
        setPreview(result.url);
        toast.success('Profile photo updated.');
      }
      URL.revokeObjectURL(localUrl);
      if (inputRef.current) inputRef.current.value = '';
    });
  }

  return (
    <div className="relative">
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={onFileChange} aria-label="Upload profile photo" />
      <button type="button" disabled={pending} onClick={() => inputRef.current?.click()} aria-label="Update profile photo" title="Update profile photo"
        className="group relative grid h-10 w-10 place-items-center overflow-hidden rounded-full ring-2 ring-white/10 transition-[ring-color,transform] hover:ring-primary/70 active:scale-95 disabled:opacity-70">
        {preview ? <img src={preview} alt="" className="h-full w-full object-cover" /> : <InitialsAvatar name={name} className="h-full w-full text-xs" />}
        <span className="absolute inset-0 grid place-items-center bg-black/55 text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
        </span>
      </button>
    </div>
  );
}
