import { useState, type ReactNode } from 'react';
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
  const [embedActive, setEmbedActive] = useState(false);
  const padding = ratioToPadding(item.kind === 'map' ? '1:1' : item.ratio || '16:9');
  const posClass = `pos-${item.position || 'center'}`;
  let inner: ReactNode = null;
  if (item.kind === 'image') inner = <img src={normalizeMediaUrl(item.url, 'image')} alt={item.title || ''} className={posClass} loading="lazy" decoding="async" />;
  else if (item.kind === 'video') {
    const normalized = normalizeMediaUrl(item.url, 'video');
    const directVideo = /\.(mp4|webm|ogg)(?:\?|#|$)/i.test(normalized);
    if (directVideo) {
      inner = <video src={normalized} title={item.title || 'video'} className="h-full w-full object-cover" controls playsInline preload="none" autoPlay={Boolean(item.autoplay)} muted={item.muted !== false} />;
    } else {
      if (embedActive) {
        inner = <iframe src={withVideoParams(normalized, false, item.muted)} title={item.title || 'video'} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen className="h-full w-full" loading="lazy" referrerPolicy="strict-origin-when-cross-origin" />;
      } else {
        const youtubeId = normalized.match(/(?:youtube(?:-nocookie)?\\.com\\/(?:embed\\/|watch\\?v=)|youtu\\.be\\/)([\\w-]{6,})/)?.[1];
        inner = <button type="button" onClick={() => setEmbedActive(true)} aria-label={`Muat video ${item.title || 'YouTube'}`} className="absolute inset-0 flex h-full w-full items-center justify-center overflow-hidden bg-black text-white">
          {youtubeId && <img src={`https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover opacity-80" />}
          <span className="relative rounded-full bg-red-600 px-5 py-3 text-sm font-semibold shadow-lg">▶ Putar video</span>
        </button>;
      }
    }
  } else if (item.kind === 'map') {
    const src = item.lat != null && item.lng != null ? `https://www.google.com/maps?q=${item.lat},${item.lng}&z=15&output=embed` : normalizeMediaUrl(item.url, 'map');
    inner = embedActive
      ? <iframe src={src} title={item.title || 'map'} className="h-full w-full" loading="lazy" referrerPolicy="strict-origin-when-cross-origin" />
      : <button type="button" onClick={() => setEmbedActive(true)} className="absolute inset-0 flex h-full w-full flex-col items-center justify-center gap-2 bg-muted text-sm text-foreground" aria-label="Muat Google Maps"><span className="text-2xl">📍</span><span className="font-semibold">Muat peta</span><span className="text-xs text-muted-foreground">Google Maps dimuat setelah diklik</span></button>;
  }
  return <div className={`media-frame relative overflow-hidden ${className || ''}`} style={{ paddingTop: padding }}>{inner}</div>;
}
