'use client';

/* eslint-disable @next/next/no-img-element */

import { useState } from 'react';
import { BUNDLED_IMAGES, EDITORS, type EditorDef, type FieldDef } from '@/lib/admin-schema';
import { listImagesAction, uploadImageAction } from '../actions';

type Item = Record<string, unknown>;

const INPUT = 'w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm';
const BTN = 'rounded-lg border border-neutral-300 px-3 py-1.5 text-xs hover:border-black disabled:opacity-40';

function parseJson<T>(value: string, fallback: T): T {
  try {
    const v = JSON.parse(value) as T;
    return v == null ? fallback : v;
  } catch {
    return fallback;
  }
}

// ---------- Entry point: one editor per content key ----------

export function KeyEditor({ contentKey, value, onChange }: { contentKey: string; value: string; onChange: (v: string) => void }) {
  const def: EditorDef = EDITORS[contentKey] ?? { kind: 'text', label: contentKey };

  return (
    <section className="rounded-xl border border-neutral-200 p-4">
      <h2 className="mb-3 text-sm font-semibold">{def.label}</h2>
      {'help' in def && def.help && <p className="-mt-2 mb-3 text-xs text-neutral-500">{def.help}</p>}

      {def.kind === 'text' &&
        (def.multiline ? (
          <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={4} className={INPUT} />
        ) : (
          <input value={value} onChange={(e) => onChange(e.target.value)} className={INPUT} />
        ))}

      {def.kind === 'image' && <ImageField value={value} onChange={onChange} />}

      {def.kind === 'object' && (
        <ObjectEditor fields={def.fields} item={parseJson<Item>(value, {})} onChange={(item) => onChange(JSON.stringify(item))} />
      )}

      {def.kind === 'list' && (
        <ListEditor
          def={def}
          items={parseJson<Item[]>(value, [])}
          onChange={(items) => onChange(JSON.stringify(items))}
        />
      )}
    </section>
  );
}

// ---------- Object (a fixed set of fields) ----------

function ObjectEditor({ fields, item, onChange }: { fields: FieldDef[]; item: Item; onChange: (item: Item) => void }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {fields.map((f) => (
        <Field key={f.key} def={f} value={item[f.key]} onChange={(v) => onChange({ ...item, [f.key]: v })} />
      ))}
    </div>
  );
}

// ---------- List (add / remove / reorder items) ----------

function ListEditor({
  def,
  items,
  onChange,
}: {
  def: Extract<EditorDef, { kind: 'list' }>;
  items: Item[];
  onChange: (items: Item[]) => void;
}) {
  const [open, setOpen] = useState<number | null>(items.length ? 0 : null);

  function update(i: number, item: Item) {
    onChange(items.map((it, idx) => (idx === i ? item : it)));
  }
  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
    setOpen(j);
  }
  function remove(i: number) {
    if (!confirm(`Remove this ${def.itemLabel.toLowerCase()}?`)) return;
    onChange(items.filter((_, idx) => idx !== i));
    setOpen(null);
  }
  function add() {
    const blank: Item = {};
    for (const f of def.fields) blank[f.key] = f.type === 'tags' || f.type === 'images' ? [] : f.type === 'stats' ? '[]' : '';
    onChange([...items, blank]);
    setOpen(items.length);
  }

  return (
    <div className="space-y-2">
      {items.map((item, i) => {
        const title = String(item[def.titleField] ?? '').trim() || `${def.itemLabel} ${i + 1}`;
        const isOpen = open === i;
        return (
          <div key={i} className="rounded-lg border border-neutral-200">
            <div className="flex items-center gap-2 px-3 py-2">
              <button type="button" onClick={() => setOpen(isOpen ? null : i)} className="flex-1 text-left text-sm">
                <span className="mr-2 text-neutral-400">{i + 1}.</span>
                <span className="font-medium">{title}</span>
              </button>
              <button type="button" className={BTN} onClick={() => move(i, -1)} disabled={i === 0} title="Move up">
                ↑
              </button>
              <button type="button" className={BTN} onClick={() => move(i, 1)} disabled={i === items.length - 1} title="Move down">
                ↓
              </button>
              <button type="button" className={`${BTN} text-red-600`} onClick={() => remove(i)} title="Remove">
                ✕
              </button>
            </div>
            {isOpen && (
              <div className="border-t border-neutral-100 p-3">
                <ObjectEditor fields={def.fields} item={item} onChange={(it) => update(i, it)} />
              </div>
            )}
          </div>
        );
      })}
      <button type="button" onClick={add} className="rounded-lg bg-neutral-100 px-3 py-2 text-sm font-medium hover:bg-neutral-200">
        + Add {def.itemLabel.toLowerCase()}
      </button>
    </div>
  );
}

// ---------- Single field, by type ----------

function Field({ def, value, onChange }: { def: FieldDef; value: unknown; onChange: (v: unknown) => void }) {
  const wrap = def.full ? 'sm:col-span-2' : '';
  const label = (
    <label className="mb-1 block text-xs font-medium text-neutral-600">
      {def.label}
      {def.help && <span className="ml-1 font-normal text-neutral-400">— {def.help}</span>}
    </label>
  );

  switch (def.type) {
    case 'textarea':
      return (
        <div className={wrap}>
          {label}
          <textarea value={String(value ?? '')} onChange={(e) => onChange(e.target.value)} rows={3} className={INPUT} />
        </div>
      );
    case 'image':
      return (
        <div className={wrap}>
          {label}
          <ImageField value={String(value ?? '')} onChange={onChange} />
        </div>
      );
    case 'tags': {
      const tags = Array.isArray(value) ? (value as string[]) : String(value ?? '').split(',');
      return (
        <div className={wrap}>
          {label}
          <input
            value={tags.join(', ')}
            onChange={(e) => onChange(e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
            className={INPUT}
            placeholder="Tag one, Tag two"
          />
        </div>
      );
    }
    case 'images': {
      const imgs = Array.isArray(value) ? (value as string[]) : [];
      const slots = [0, 1, 2];
      return (
        <div className={wrap}>
          {label}
          <div className="grid gap-2 sm:grid-cols-3">
            {slots.map((i) => (
              <ImageField
                key={i}
                value={imgs[i] ?? ''}
                compact
                onChange={(v) => {
                  const next = slots.map((j) => (j === i ? v : imgs[j] ?? ''));
                  while (next.length && !next[next.length - 1]) next.pop();
                  onChange(next);
                }}
              />
            ))}
          </div>
        </div>
      );
    }
    case 'stats':
      return (
        <div className={wrap}>
          {label}
          <StatsEditor value={String(value ?? '[]')} onChange={onChange} />
        </div>
      );
    default:
      return (
        <div className={wrap}>
          {label}
          <input value={String(value ?? '')} onChange={(e) => onChange(e.target.value)} className={INPUT} />
        </div>
      );
  }
}

// ---------- Stats (a JSON string of { number, label }[] inside a case study) ----------

function StatsEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const stats = parseJson<Array<{ number: string; label: string }>>(value, []);
  const set = (next: typeof stats) => onChange(JSON.stringify(next));
  return (
    <div className="space-y-2">
      {stats.map((s, i) => (
        <div key={i} className="flex gap-2">
          <input
            value={s.number}
            placeholder="21.7K"
            onChange={(e) => set(stats.map((x, j) => (j === i ? { ...x, number: e.target.value } : x)))}
            className={`${INPUT} w-32 flex-none`}
          />
          <input
            value={s.label}
            placeholder="First Week Streams"
            onChange={(e) => set(stats.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))}
            className={INPUT}
          />
          <button type="button" className={`${BTN} text-red-600`} onClick={() => set(stats.filter((_, j) => j !== i))}>
            ✕
          </button>
        </div>
      ))}
      <button type="button" className={BTN} onClick={() => set([...stats, { number: '', label: '' }])}>
        + Add stat
      </button>
    </div>
  );
}

// ---------- Image (URL + upload + picker) ----------

function ImageField({ value, onChange, compact = false }: { value: string; onChange: (v: string) => void; compact?: boolean }) {
  const [status, setStatus] = useState('');
  const [picker, setPicker] = useState(false);
  const [uploads, setUploads] = useState<string[] | null>(null);

  async function upload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setStatus('Uploading…');
    const fd = new FormData();
    fd.set('image', file);
    const res = await uploadImageAction(fd);
    if (res.ok && res.url) {
      onChange(res.url);
      setStatus('');
    } else {
      setStatus(res.ok ? 'Upload failed' : res.error);
    }
    e.target.value = '';
  }

  async function openPicker() {
    setPicker(true);
    if (uploads === null) {
      try {
        const list = await listImagesAction();
        setUploads(list.map((b) => b.url));
      } catch {
        setUploads([]);
      }
    }
  }

  return (
    <div>
      <div className="flex items-start gap-2">
        {value ? (
          <img src={value} alt="" className={`${compact ? 'h-14 w-14' : 'h-20 w-20'} flex-none rounded-md border border-neutral-200 bg-neutral-100 object-cover`} />
        ) : (
          <div className={`${compact ? 'h-14 w-14' : 'h-20 w-20'} flex flex-none items-center justify-center rounded-md border border-dashed border-neutral-300 text-xs text-neutral-400`}>
            none
          </div>
        )}
        <div className="min-w-0 flex-1 space-y-1">
          {!compact && <input value={value} onChange={(e) => onChange(e.target.value)} placeholder="/img/… or https://…" className={INPUT} />}
          <div className="flex flex-wrap items-center gap-1">
            <label className={`${BTN} cursor-pointer`}>
              Upload
              <input type="file" accept="image/*" onChange={upload} className="hidden" />
            </label>
            <button type="button" className={BTN} onClick={picker ? () => setPicker(false) : openPicker}>
              {picker ? 'Close' : 'Choose'}
            </button>
            {value && (
              <button type="button" className={BTN} onClick={() => onChange('')}>
                Clear
              </button>
            )}
            {status && <span className="text-xs text-neutral-500">{status}</span>}
          </div>
        </div>
      </div>

      {picker && (
        <div className="mt-2 max-h-56 overflow-y-auto rounded-lg border border-neutral-200 p-2">
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
            {[...(uploads ?? []), ...BUNDLED_IMAGES].map((src) => (
              <button
                key={src}
                type="button"
                onClick={() => {
                  onChange(src);
                  setPicker(false);
                }}
                className={`overflow-hidden rounded-md border ${src === value ? 'border-black' : 'border-neutral-200'} hover:border-black`}
                title={src}
              >
                <img src={src} alt="" className="h-16 w-full object-cover" />
              </button>
            ))}
          </div>
          {uploads === null && <p className="mt-2 text-xs text-neutral-500">Loading uploads…</p>}
        </div>
      )}
    </div>
  );
}
