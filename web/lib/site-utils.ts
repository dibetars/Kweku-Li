// Pure helpers, safe to import from client components.

export function youtubeId(url: string): string {
  if (!url) return '';
  const m = url.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : '';
}

export function paragraphs(body: string): string[] {
  return (body ?? '')
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '?';
  const first = parts[0][0] ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] ?? '' : '';
  return (first + last).toUpperCase();
}
