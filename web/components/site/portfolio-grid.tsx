'use client';

import { useState } from 'react';
import { Media } from './media';
import { slugify } from '@/lib/site-defaults';

export interface PortfolioTile {
  title: string;
  description: string;
  image: string;
  category: string;
  subtitle: string;
}

export function PortfolioGrid({ items }: { items: PortfolioTile[] }) {
  const [filter, setFilter] = useState('all');
  const categories = items.map((i) => i.category).filter((c, i, arr) => c && arr.indexOf(c) === i);

  return (
    <>
      <div className="filter-chips" role="tablist" aria-label="Filter portfolio">
        {['all', ...categories].map((c) => (
          <button
            key={c}
            type="button"
            className={`chip${filter === c ? ' is-active' : ''}`}
            onClick={() => setFilter(c)}
          >
            {c === 'all' ? 'All' : c}
          </button>
        ))}
      </div>

      <div className="portfolio-grid">
        {items.map((item) => (
          <article
            key={item.title}
            className={`portfolio-item${filter === 'all' || item.category === filter ? '' : ' is-hidden'}`}
            data-category={slugify(item.category)}
          >
            <div className="portfolio-visual">
              {item.image ? (
                <Media
                  src={item.image}
                  alt={item.title}
                  className="portfolio-image"
                  sizes="(max-width: 720px) 100vw, (max-width: 1180px) 50vw, 33vw"
                />
              ) : (
                <div className="portfolio-image portfolio-image-fallback">🎨</div>
              )}
              <span className="portfolio-overlay">
                <span>{item.category}</span>
                <span>{item.subtitle}</span>
              </span>
              <span className="portfolio-arrow" aria-hidden="true">
                ↗
              </span>
            </div>
            <div className="portfolio-meta">
              <div className="portfolio-content">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
