'use client';

import { useState, useTransition, useActionState, useEffect } from 'react';
import type { SessionUser } from '@/lib/session';
import type { ContentMap } from '@/lib/content';
import {
  setContentBatchAction,
  logoutAction,
  listUsersAction,
  createUserAction,
  resetPasswordAction,
  listAuditLogsAction,
  uploadImageAction,
  listImagesAction,
  deleteImageAction,
} from '../actions';

type Section =
  | 'hero'
  | 'services'
  | 'work'
  | 'portfolio'
  | 'about'
  | 'testimonials'
  | 'contact'
  | 'layout'
  | 'theme'
  | 'users'
  | 'logs'
  | 'media';

const SECTIONS: { id: Section; label: string; keys?: string[] }[] = [
  { id: 'hero', label: 'Hero', keys: ['hero.subtitle', 'hero.title', 'hero.description'] },
  { id: 'services', label: 'Services', keys: ['services.list'] },
  { id: 'work', label: 'Work', keys: ['work.list'] },
  { id: 'portfolio', label: 'Portfolio', keys: ['portfolio.list'] },
  {
    id: 'about',
    label: 'About',
    keys: ['about.intro', 'about.professional', 'about.artist', 'about.philosophy', 'about.mission'],
  },
  { id: 'testimonials', label: 'Testimonials', keys: ['testimonials.list'] },
  {
    id: 'contact',
    label: 'Contact',
    keys: [
      'contact.email',
      'contact.phone',
      'contact.location',
      'social.linkedin',
      'social.instagram',
      'social.twitter',
      'social.youtube',
      'social.tiktok',
      'social.soundcloud',
    ],
  },
  { id: 'layout', label: 'Layout & Navigation', keys: ['layout.order', 'header.logo', 'header.cta', 'footer.quote', 'footer.copyright'] },
  { id: 'theme', label: 'Theme Settings', keys: ['theme.config'] },
  { id: 'users', label: 'Users' },
  { id: 'logs', label: 'Audit Logs' },
  { id: 'media', label: 'Media Library' },
];

const LABELS: Record<string, string> = {
  'hero.subtitle': 'Subtitle',
  'hero.title': 'Title (JSON: { "text": "..." }, supports <span class="italic-text">)',
  'hero.description': 'Description',
  'services.list': 'Services (JSON array of { icon, title, description })',
  'work.list': 'Case studies (JSON array of { icon, tag, title, description, stats })',
  'portfolio.list': 'Portfolio items (JSON array of { icon, title, description })',
  'about.intro': 'Intro',
  'about.professional': 'Professional',
  'about.artist': 'Artist',
  'about.philosophy': 'Philosophy',
  'about.mission': 'Mission',
  'testimonials.list': 'Testimonials (JSON array of { text, author })',
  'contact.email': 'Email',
  'contact.phone': 'Phone',
  'contact.location': 'Location',
  'social.linkedin': 'LinkedIn URL',
  'social.instagram': 'Instagram URL',
  'social.twitter': 'X/Twitter URL',
  'social.youtube': 'YouTube URL',
  'social.tiktok': 'TikTok URL',
  'social.soundcloud': 'SoundCloud URL',
  'layout.order': 'Section order (JSON array of ids, e.g. ["hero","services",...])',
  'header.logo': 'Logo text',
  'header.cta': 'Header CTA (JSON: { text, href })',
  'footer.quote': 'Footer quote',
  'footer.copyright': 'Footer copyright',
  'theme.config': 'Theme config (JSON: { mode, variables })',
};

const MULTILINE_KEYS = new Set([
  'hero.description',
  'services.list',
  'work.list',
  'portfolio.list',
  'testimonials.list',
  'about.professional',
  'about.artist',
  'about.philosophy',
  'about.mission',
  'layout.order',
  'header.cta',
  'theme.config',
]);

export function Dashboard({ user, initialContent }: { user: SessionUser; initialContent: ContentMap }) {
  const [active, setActive] = useState<Section>('hero');
  const [values, setValues] = useState<ContentMap>(initialContent);
  const [status, setStatus] = useState('');
  const [pending, startTransition] = useTransition();

  const activeSection = SECTIONS.find((s) => s.id === active)!;

  function save() {
    if (!activeSection.keys) return;
    const entries = activeSection.keys.map((key) => ({ key, value: values[key] ?? '' }));
    startTransition(async () => {
      setStatus('Saving…');
      const res = await setContentBatchAction(entries);
      setStatus(res.ok ? 'Saved' : `Error: ${res.error}`);
      setTimeout(() => setStatus(''), 2000);
    });
  }

  return (
    <div className="flex min-h-screen bg-white text-neutral-900">
      <aside className="w-64 flex-shrink-0 border-r border-neutral-200 p-4">
        <div className="mb-6">
          <h2 className="font-bold">Kweku Li</h2>
          <span className="text-xs text-neutral-500">Admin</span>
        </div>
        <nav className="space-y-1">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => setActive(s.id)}
              className={`block w-full rounded-lg px-3 py-2 text-left text-sm ${
                active === s.id ? 'bg-black text-white' : 'hover:bg-neutral-100'
              }`}
            >
              {s.label}
            </button>
          ))}
        </nav>
        <div className="mt-8 border-t border-neutral-200 pt-4 text-sm">
          <div>{user.username}</div>
          <div className="text-xs text-neutral-500">{user.role}</div>
          <form action={logoutAction}>
            <button className="mt-2 text-xs text-red-600 hover:underline">Log out</button>
          </form>
        </div>
      </aside>

      <main className="flex-1 p-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-bold">{activeSection.label}</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-neutral-500">{status}</span>
            <a href="/" target="_blank" className="text-sm underline">
              View site
            </a>
            {activeSection.keys && (
              <button
                onClick={save}
                disabled={pending}
                className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
              >
                Save changes
              </button>
            )}
          </div>
        </div>

        {activeSection.keys && (
          <div className="max-w-3xl space-y-6">
            {activeSection.keys.map((key) => (
              <div key={key}>
                <label className="mb-1 block text-sm font-medium">{LABELS[key] ?? key}</label>
                {MULTILINE_KEYS.has(key) ? (
                  <textarea
                    value={values[key] ?? ''}
                    onChange={(e) => setValues((v) => ({ ...v, [key]: e.target.value }))}
                    rows={key.endsWith('.list') || key === 'theme.config' ? 12 : 4}
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2 font-mono text-xs"
                  />
                ) : (
                  <input
                    value={values[key] ?? ''}
                    onChange={(e) => setValues((v) => ({ ...v, [key]: e.target.value }))}
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2"
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {active === 'users' && <UsersPanel />}
        {active === 'logs' && <LogsPanel />}
        {active === 'media' && <MediaPanel />}
      </main>
    </div>
  );
}

function UsersPanel() {
  const [users, setUsers] = useState<Array<{ id: number; username: string; role: string; createdAt: string }>>([]);
  const [createState, createFormAction, creating] = useActionState(createUserAction, null);
  const [resetState, resetFormAction, resetting] = useActionState(resetPasswordAction, null);

  useEffect(() => {
    listUsersAction().then(setUsers);
  }, [createState]);

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h2 className="mb-2 font-semibold">Existing users</h2>
        <table className="w-full text-sm">
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-neutral-100">
                <td className="py-2">{u.username}</td>
                <td className="py-2 text-neutral-500">{u.role}</td>
                <td className="py-2 text-neutral-400">{new Date(u.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <form action={createFormAction} className="space-y-2">
        <h2 className="font-semibold">Create user</h2>
        <input name="username" placeholder="Username" required className="w-full rounded-lg border border-neutral-300 px-3 py-2" />
        <input name="password" type="password" placeholder="Password" required className="w-full rounded-lg border border-neutral-300 px-3 py-2" />
        <select name="role" className="w-full rounded-lg border border-neutral-300 px-3 py-2">
          <option value="editor">Editor</option>
          <option value="admin">Admin</option>
        </select>
        {createState && !createState.ok && <p className="text-sm text-red-600">{createState.error}</p>}
        <button disabled={creating} className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white">
          Create
        </button>
      </form>

      <form action={resetFormAction} className="space-y-2">
        <h2 className="font-semibold">Reset password</h2>
        <input name="username" placeholder="Username" required className="w-full rounded-lg border border-neutral-300 px-3 py-2" />
        <input name="password" type="password" placeholder="New password" required className="w-full rounded-lg border border-neutral-300 px-3 py-2" />
        {resetState && !resetState.ok && <p className="text-sm text-red-600">{resetState.error}</p>}
        {resetState?.ok && <p className="text-sm text-green-600">Password updated.</p>}
        <button disabled={resetting} className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white">
          Reset
        </button>
      </form>
    </div>
  );
}

function LogsPanel() {
  const [logs, setLogs] = useState<Array<{ createdAt: string; action: string; key: string | null; username: string }>>([]);

  useEffect(() => {
    listAuditLogsAction().then(setLogs);
  }, []);

  return (
    <table className="w-full max-w-3xl text-sm">
      <thead>
        <tr className="border-b border-neutral-200 text-left text-neutral-500">
          <th className="py-2">Time</th>
          <th>User</th>
          <th>Action</th>
          <th>Key</th>
        </tr>
      </thead>
      <tbody>
        {logs.map((l, i) => (
          <tr key={i} className="border-b border-neutral-100">
            <td className="py-2 text-neutral-500">{new Date(l.createdAt).toLocaleString()}</td>
            <td>{l.username}</td>
            <td>{l.action}</td>
            <td>{l.key}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function MediaPanel() {
  const [images, setImages] = useState<Array<{ url: string; pathname: string }>>([]);
  const [status, setStatus] = useState('');

  function refresh() {
    listImagesAction().then(setImages);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setStatus('Uploading…');
    const formData = new FormData();
    formData.set('image', file);
    const res = await uploadImageAction(formData);
    setStatus(res.ok ? 'Uploaded' : `Error: ${res.error}`);
    refresh();
  }

  async function handleDelete(url: string) {
    await deleteImageAction(url);
    refresh();
  }

  return (
    <div>
      <label className="inline-block cursor-pointer rounded-lg bg-black px-4 py-2 text-sm font-medium text-white">
        Upload image
        <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
      </label>
      <span className="ml-3 text-sm text-neutral-500">{status}</span>

      <div className="mt-6 grid grid-cols-4 gap-4">
        {images.map((img) => (
          // eslint-disable-next-line @next/next/no-img-element
          <div key={img.url} className="group relative overflow-hidden rounded-lg border border-neutral-200">
            <img src={img.url} alt="" className="h-32 w-full object-cover" />
            <button
              onClick={() => handleDelete(img.url)}
              className="absolute right-1 top-1 rounded bg-black/70 px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
