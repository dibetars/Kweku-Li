'use client';

import Image from 'next/image';
import { useState } from 'react';
import { youtubeId } from '@/lib/site-utils';

// Lightweight YouTube embed: shows the thumbnail and only loads the player when clicked.
export function YouTube({ url, title, sizes = '(max-width: 980px) 100vw, 50vw' }: { url: string; title: string; sizes?: string }) {
  const id = youtubeId(url);
  const [playing, setPlaying] = useState(false);
  if (!id) return null;

  return (
    <div className="yt">
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button type="button" className="yt-poster" onClick={() => setPlaying(true)} aria-label={`Play ${title}`}>
          <Image src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" fill sizes={sizes} />
          <span className="yt-play" aria-hidden="true">
            ▶
          </span>
          <span className="yt-title">{title}</span>
        </button>
      )}
    </div>
  );
}
