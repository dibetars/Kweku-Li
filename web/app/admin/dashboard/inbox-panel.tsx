'use client';

import { useCallback, useEffect, useState } from 'react';
import { deleteSubmissionAction, listSubmissionsAction, setSubmissionStatusAction, type SubmissionRow } from '../actions';

const STATUSES = ['new', 'read', 'replied', 'archived'] as const;
type Status = (typeof STATUSES)[number];
type Filter = 'active' | Status | 'all';

const FILTERS: Array<[Filter, string]> = [
  ['active', 'Active'],
  ['new', 'New'],
  ['replied', 'Replied'],
  ['archived', 'Archived'],
  ['all', 'All'],
];

export function InboxPanel({ isAdmin, onChange }: { isAdmin: boolean; onChange?: () => void }) {
  const [rows, setRows] = useState<SubmissionRow[]>([]);
  const [filter, setFilter] = useState<Filter>('active');
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    return listSubmissionsAction().then((r) => {
      setRows(r);
      setLoading(false);
      onChange?.();
    });
  }, [onChange]);

  useEffect(() => {
    let active = true;
    listSubmissionsAction().then((r) => {
      if (!active) return;
      setRows(r);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const visible = rows.filter((r) => {
    if (filter === 'all') return true;
    if (filter === 'active') return r.status === 'new' || r.status === 'read';
    return r.status === filter;
  });

  async function changeStatus(id: number, status: Status) {
    const res = await setSubmissionStatusAction(id, status);
    if (res.ok) refresh();
  }

  async function remove(id: number) {
    if (!confirm('Delete this message permanently?')) return;
    const res = await deleteSubmissionAction(id);
    if (res.ok) refresh();
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          {FILTERS.map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`rounded-full border px-3 py-1 text-sm ${
                filter === key ? 'border-black bg-black text-white' : 'border-neutral-300 text-neutral-600 hover:border-black'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <span className="text-sm text-neutral-500">
          {loading ? 'Loading…' : `${visible.length} of ${rows.length} messages`}
        </span>
      </div>

      {!loading && visible.length === 0 && <p className="text-sm text-neutral-500">No messages here.</p>}

      <div className="space-y-4">
        {visible.map((s) => {
          const meta = [
            ['Phone', s.phone],
            ['Company', s.company],
            ['Timeline', s.timeline],
            ['Budget', s.budget],
            ['Location', s.location],
          ].filter(([, v]) => v) as Array<[string, string]>;
          return (
            <article
              key={s.id}
              className={`rounded-xl border border-neutral-200 p-4 ${s.status === 'new' ? 'border-l-4 border-l-black' : ''} ${
                s.status === 'archived' ? 'opacity-60' : ''
              }`}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-neutral-100 pb-2">
                <div className="flex flex-wrap items-baseline gap-2">
                  <strong>{s.name}</strong>
                  <a
                    className="text-sm text-neutral-500 hover:text-black"
                    href={`mailto:${s.email}?subject=${encodeURIComponent('Re: ' + (s.service || 'your enquiry'))}`}
                  >
                    {s.email}
                  </a>
                  <span className="rounded bg-neutral-100 px-2 py-0.5 text-[10px] uppercase tracking-wide text-neutral-600">
                    {s.status}
                  </span>
                  {s.emailStatus &&
                    (s.emailStatus === 'sent' ? (
                      <span className="text-xs text-green-600">✓ Emailed</span>
                    ) : (
                      <span className="text-xs text-red-600" title={s.emailStatus}>
                        ⚠ Email not sent
                      </span>
                    ))}
                </div>
                <span className="text-xs text-neutral-400">{new Date(s.createdAt).toLocaleString()}</span>
              </div>

              <div className="mt-3 font-medium">{s.service}</div>
              {meta.length > 0 && (
                <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-neutral-500">
                  {meta.map(([k, v]) => (
                    <span key={k}>
                      <span className="font-medium text-neutral-700">{k}:</span> {v}
                    </span>
                  ))}
                </div>
              )}
              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed">{s.message}</p>

              <div className="mt-4 flex items-center justify-end gap-3">
                <select
                  value={s.status}
                  onChange={(e) => changeStatus(s.id, e.target.value as Status)}
                  className="rounded-lg border border-neutral-300 px-2 py-1 text-sm"
                >
                  {STATUSES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
                {isAdmin && (
                  <button onClick={() => remove(s.id)} className="text-sm text-red-600 hover:underline">
                    Delete
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
