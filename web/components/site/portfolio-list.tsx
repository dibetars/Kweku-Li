'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import type { PortfolioGroup } from '@/lib/types';

// The full portfolio, grouped by discipline, with filter chips.
export function PortfolioList({ groups }: { groups: PortfolioGroup[] }) {
  const [filter, setFilter] = useState('all');
  const visible = groups.filter((g) => filter === 'all' || g.title === filter);

  return (
    <>
      <div className="filter-chips" role="tablist" aria-label="Filter portfolio">
        {['all', ...groups.map((g) => g.title)].map((t) => (
          <button key={t} type="button" role="tab" aria-selected={filter === t} className={`chip${filter === t ? ' is-active' : ''}`} onClick={() => setFilter(t)}>
            {t === 'all' ? 'All' : t}
          </button>
        ))}
      </div>

      {visible.map((g) => {
        // Consecutive entries from the same outlet sit under one sub-heading.
        let lastOutlet = '';
        const thumbs = g.entries.some((e) => e.image);
        return (
          <section className="portfolio-group" key={g.title}>
            <h2 className="portfolio-group-title">{g.title}</h2>
            {g.description && <p className="section-description">{g.description}</p>}
            <ol className="portfolio-entries">
              {g.entries.map((e, i) => {
                const showOutlet = !!e.outlet && e.outlet !== lastOutlet;
                lastOutlet = e.outlet;
                return (
                  <li key={`${e.title}-${i}`} className="portfolio-entry-wrap">
                    {showOutlet && <p className="portfolio-outlet">{e.outlet}</p>}
                    <div className={`portfolio-entry${thumbs ? ' has-thumb' : ''}`}>
                      <span className="portfolio-year">{e.year}</span>
                      {thumbs && (
                        <span className={`portfolio-thumb${e.image ? '' : ' is-empty'}`}>
                          {e.image && <Image src={e.image} alt="" fill sizes="96px" />}
                        </span>
                      )}
                      <span className="portfolio-title">{e.title}</span>
                      <span className="portfolio-action">
                        {e.caseStudy ? (
                          <Link href={`/work/${e.caseStudy}`} className="tag tag-dark">
                            Case study ↗
                          </Link>
                        ) : e.url ? (
                          <a href={e.url} className="tag" target="_blank" rel="noopener">
                            View ↗
                          </a>
                        ) : null}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>
        );
      })}
    </>
  );
}
