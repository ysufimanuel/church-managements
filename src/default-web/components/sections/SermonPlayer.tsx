import { useState } from 'react'
import type { Sermon } from '../../content/types'
import { PlayIcon } from '../ui/Icon'
import { Photo } from '../ui/Photo'

/**
 * Facade: hanya gambar sampai ditekan. Iframe pemutar baru dimuat setelah itu,
 * sehingga skrip pihak ketiga tidak ikut memperlambat muat halaman.
 */
export function SermonPlayer({ sermon }: { sermon: Sermon }) {
  const [loaded, setLoaded] = useState(false)
  const playable = sermon.videoId !== ''

  return (
    <div className="relative aspect-video overflow-hidden rounded-card border border-line bg-surface">
      {loaded && playable ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${sermon.videoId}?autoplay=1&rel=0`}
          title={`Khotbah: ${sermon.title}`}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <>
          <Photo src={sermon.thumbnail} alt="" fx={55} fy={30} />
          <div className="absolute inset-0 bg-scrim opacity-60" aria-hidden="true" />
          <button
            type="button"
            disabled={!playable}
            onClick={() => setLoaded(true)}
            aria-label={`Putar khotbah: ${sermon.title}`}
            className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-accent text-accent-ink transition-transform duration-press ease-out-strong active:scale-95 disabled:opacity-60"
          >
            <PlayIcon className="ml-[3px]" />
          </button>
          {!playable ? (
            <p className="absolute bottom-4 left-5 text-caption text-ink-faint">Video akan tersedia segera</p>
          ) : null}
        </>
      )}
    </div>
  )
}
