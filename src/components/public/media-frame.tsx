import { ratioToPadding, normalizeMediaUrl } from '@/lib/utils';

export interface MediaItem {
  id: number; kind: 'image' | 'video' | 'map'; url: string; ratio: string;
  layer: 'front' | 'overlay'; position: string; title?: string | null;
  lat?: number | null; lng?: number | null;
}

/** Renderer media universal: gambar (Drive/Cloudinary/Unsplash), video (YouTube/Vimeo embed),
 *  dan peta 1:1 dengan titik koordinat — dengan rasio dinamis & posisi objek. */
export function MediaFrame({ item, className }: { item: MediaItem; className?: string }) {
  const padding = ratioToPadding(item.kind === 'map' ? '1:1' : item.ratio || '16:9');
  const posClass = `pos-${item.position || 'center'}`;

  let inner: React.ReactNode = null;
  if (item.kind === 'image') {
    inner = <img src={normalizeMediaUrl(item.url, 'image')} alt={item.title || ''} className={posClass} loading="lazy" />;
  } else if (item.kind === 'video') {
    inner = <iframe src={normalizeMediaUrl(item.url, 'video')} title={item.title || 'video'} allowFullScreen className="h-full w-full" loading="lazy" />;
  } else if (item.kind === 'map') {
    const src = item.lat != null && item.lng != null
      ? `https://www.google.com/maps?q=${item.lat},${item.lng}&z=15&output=embed`
      : normalizeMediaUrl(item.url, 'map');
    inner = <iframe src={src} title={item.title || 'map'} className="h-full w-full" loading="lazy" />;
  }

  return (
    <div className={`media-frame ${className || ''}`} style={{ paddingTop: padding }}>
      {inner}
    </div>
  );
}
