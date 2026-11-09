'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

const BUCKET = 'profile-photos';
const MAX_BYTES = 5 * 1024 * 1024;
const MIME_EXT: Record<string, string> = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };

export async function updateProfilePhoto(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false as const, error: 'Please sign in again.' };

  const file = formData.get('photo');
  if (!(file instanceof File) || file.size === 0) return { ok: false as const, error: 'Choose an image first.' };
  const ext = MIME_EXT[file.type];
  if (!ext) return { ok: false as const, error: 'Use a JPG, PNG, or WebP image.' };
  if (file.size > MAX_BYTES) return { ok: false as const, error: 'Image size must be 5 MB or less.' };

  const admin = createAdminClient();
  const { data: buckets } = await admin.storage.listBuckets();
  if (!buckets?.some((bucket) => bucket.name === BUCKET)) {
    const { error: bucketError } = await admin.storage.createBucket(BUCKET, { public: true, fileSizeLimit: MAX_BYTES, allowedMimeTypes: Object.keys(MIME_EXT) });
    if (bucketError && !/already exists/i.test(bucketError.message)) return { ok: false as const, error: bucketError.message };
  }

  const path = user.id + '/' + Date.now() + '.' + ext;
  const { error: uploadError } = await admin.storage.from(BUCKET).upload(path, file, { contentType: file.type, cacheControl: '31536000', upsert: true });
  if (uploadError) return { ok: false as const, error: uploadError.message };

  const { data: publicUrl } = admin.storage.from(BUCKET).getPublicUrl(path);
  const { error: updateError } = await admin.from('profiles').update({ avatar_url: publicUrl.publicUrl }).eq('id', user.id);
  if (updateError) {
    await admin.storage.from(BUCKET).remove([path]);
    return { ok: false as const, error: updateError.message };
  }

  revalidatePath('/dashboard');
  return { ok: true as const, url: publicUrl.publicUrl };
}
