import type { ReactNode } from 'react';
import { ratioToPadding, normalizeMediaUrl } from '@/lib/utils';

export interface MediaItem {
  id: number | string; kind: 'image' | 'video' | 'map'; url: string; ratio: string;
  layer: 'front' | 'overlay'; position: string; title?: string | null;
  lat?: number | null; lng?: number | null; autoplay?: boolean; muted?: boolean;
}

function withVideoParams(src: string, autoplay?: boolean, muted?: boolean) {
  try {
    const url = new URL(src, 'https://example.com');
    const host = url.hostname.toLowerCase();
    if (host.includes('youtube.com') || host.includes('youtu.be')) {
      if (autoplay) url.searchParams.set('autoplay', '1');
      if (muted !== undefined) url.searchParams.set('mute', muted ? '1' : '0');
      url.searchParams.set('playsinline', '1');
      url.searchParams.set('controls', '1');
      return src.startsWith('http') ? url.toString() : src;
    }
    if (host.includes('vimeo.com')) {
      if (autoplay) url.searchParams.set('autoplay', '1');
      if (muted !== undefined) url.searchParams.set('muted', muted ? '1' : '0');
      url.searchParams.set('playsinline', '1');
      return src.startsWith('http') ? url.toString() : src;
    }
  } catch {}
  return src;
}

/** Universal media renderer for images, videos and maps. */
export function MediaFrame({ item, className }: { item: MediaItem; className?: string }) {
  const padding = ratioToPadding(item.kind === 'map' ? '1:1' : item.ratio || '16:9');
  const posClass = `pos-${item.position || 'center'}`;
  let inner: ReactNode = null;
  if (item.kind === 'image') inner = <img src={normalizeMediaUrl(item.url, 'image')} alt={item.title || ''} className={posClass} loading="lazy" />;
  else if (item.kind === 'video') {
    const normalized = normalizeMediaUrl(item.url, 'video');
    const directVideo = /\.(mp4|webm|ogg)(?:\?|#|$)/i.test(normalized);
    if (directVideo) {
      inner = <video src={normalized} title={item.title || 'video'} className="h-full w-full object-cover" controls playsInline autoPlay={Boolean(item.autoplay)} muted={item.muted !== false} />;
    } else {
      inner = <iframe src={withVideoParams(normalized, item.autoplay, item.muted)} title={item.title || 'video'} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen className="h-full w-full" loading="lazy" />;
    }
  } else if (item.kind === 'map') {
    const src = item.lat != null && item.lng != null ? `https://www.google.com/maps?q=${item.lat},${item.lng}&z=15&output=embed` : normalizeMediaUrl(item.url, 'map');
    inner = <iframe src={src} title={item.title || 'map'} className="h-full w-full" loading="lazy" />;
  }
  return <div className={`media-frame ${className || ''}`} style={{ paddingTop: padding }}>{inner}</div>;
}
