import { ratioToPadding, normalizeMediaUrl } from '@/lib/utils';

export interface MediaItem {
  id: number | string; kind: 'image' | 'video' | 'map'; url: string; ratio: string;
  layer: 'front' | 'overlay'; position: string; title?: string | null;
  lat?: number | null; lng?: number | null; autoplay?: boolean;
}

function withVideoAutoplay(src: string, autoplay?: boolean) {
  if (!autoplay) return src;
  try {
    const url = new URL(src, 'https://example.com');
    const host = url.hostname.toLowerCase();
    if (host.includes('youtube.com') || host.includes('youtu.be')) {
      url.searchParams.set('autoplay', '1');
      url.searchParams.set('mute', '1');
      return src.startsWith('http') ? url.toString() : src;
    }
    if (host.includes('vimeo.com')) {
      url.searchParams.set('autoplay', '1');
      url.searchParams.set('muted', '1');
      return src.startsWith('http') ? url.toString() : src;
    }
  } catch {}
  return src;
}

/** Universal media renderer for images, videos and maps. */
export function MediaFrame({ item, className }: { item: MediaItem; className?: string }) {
  const padding = ratioToPadding(item.kind === 'map' ? '1:1' : item.ratio || '16:9');
  const posClass = `pos-${item.position || 'center'}`;

  let inner: React.ReactNode = null;
  if (item.kind === 'image') {
    inner = <img src={normalizeMediaUrl(item.url, 'image')} alt={item.title || ''} className={posClass} loading="lazy" />;
  } else if (item.kind === 'video') {
    const src = withVideoAutoplay(normalizeMediaUrl(item.url, 'video'), item.autoplay);
    inner = <iframe src={src} title={item.title || 'video'} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen className="h-full w-full" loading="lazy" />;
  } else if (item.kind === 'map') {
    const src = item.lat != null && item.lng != null
      ? `https://www.google.com/maps?q=${item.lat},${item.lng}&z=15&output=embed`
      : normalizeMediaUrl(item.url, 'map');
    inner = <iframe src={src} title={item.title || 'map'} className="h-full w-full" loading="lazy" />;
  }

  return <div className={`media-frame ${className || ''}`} style={{ paddingTop: padding }}>{inner}</div>;
}
