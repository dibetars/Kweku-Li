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
      {def.help && <p className="-mt-2 mb-3 text-xs text-neutral-500">{def.help}</p>}

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

type ListDef = { itemLabel: string; titleField: string; fields: FieldDef[] };

function blankFor(fields: FieldDef[]): Item {
  const blank: Item = {};
  for (const f of fields) blank[f.key] = f.type === 'lines' || f.type === 'images' || f.type === 'list' ? [] : '';
  return blank;
}

function ListEditor({
  def,
  items,
  onChange,
  nested = false,
}: {
  def: ListDef;
  items: Item[];
  onChange: (items: Item[]) => void;
  nested?: boolean;
}) {
  const [open, setOpen] = useState<number | null>(!nested && items.length ? 0 : null);

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
    onChange([...items, blankFor(def.fields)]);
    setOpen(items.length);
  }

  return (
    <div className="space-y-2">
      {items.map((item, i) => {
        const title = String(item[def.titleField] ?? '').trim() || `${def.itemLabel} ${i + 1}`;
        const isOpen = open === i;
        return (
          <div key={i} className={`rounded-lg border border-neutral-200 ${nested ? 'bg-neutral-50' : ''}`}>
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
      <button type="button" onClick={add} className={nested ? BTN : 'rounded-lg bg-neutral-100 px-3 py-2 text-sm font-medium hover:bg-neutral-200'}>
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
    case 'lines': {
      const arr = Array.isArray(value) ? (value as string[]) : String(value ?? '').split('\n').filter(Boolean);
      return (
        <div className={wrap}>
          {label}
          <LinesField value={arr} onChange={onChange} />
        </div>
      );
    }
    case 'images': {
      const imgs = Array.isArray(value) ? (value as string[]) : [];
      const set = (next: string[]) => onChange(next);
      return (
        <div className={wrap}>
          {label}
          <div className="space-y-2">
            {imgs.map((src, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className="flex-1">
                  <ImageField value={src} compact onChange={(v) => set(imgs.map((x, j) => (j === i ? v : x)))} />
                </div>
                <button type="button" className={BTN} disabled={i === 0} onClick={() => set(swap(imgs, i, i - 1))} title="Move up">
                  ↑
                </button>
                <button type="button" className={`${BTN} text-red-600`} onClick={() => set(imgs.filter((_, j) => j !== i))} title="Remove">
                  ✕
                </button>
              </div>
            ))}
            <button type="button" className={BTN} onClick={() => set([...imgs, ''])}>
              + Add image
            </button>
          </div>
        </div>
      );
    }
    case 'list':
      return (
        <div className={wrap}>
          {label}
          <ListEditor
            nested
            def={{ itemLabel: def.itemLabel ?? 'Item', titleField: def.titleField ?? '', fields: def.fields ?? [] }}
            items={Array.isArray(value) ? (value as Item[]) : parseJson<Item[]>(String(value ?? '[]'), [])}
            onChange={onChange}
          />
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

// ---------- Lines (a list of strings, one per line) ----------

// Keeps the raw text while typing so blank lines and trailing spaces are not eaten mid-edit.
function LinesField({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const [draft, setDraft] = useState(value.join('\n'));
  const normalize = (text: string) => text.split('\n').map((l) => l.trim()).filter(Boolean);
  // Resync only when the value changed from outside (e.g. items were reordered).
  if (normalize(draft).join('\n') !== value.join('\n')) setDraft(value.join('\n'));
  return (
    <textarea
      value={draft}
      rows={Math.min(10, Math.max(3, value.length + 1))}
      onChange={(e) => {
        setDraft(e.target.value);
        onChange(normalize(e.target.value));
      }}
      className={INPUT}
    />
  );
}

function swap<T>(arr: T[], i: number, j: number): T[] {
  if (j < 0 || j >= arr.length) return arr;
  const next = [...arr];
  [next[i], next[j]] = [next[j], next[i]];
  return next;
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
