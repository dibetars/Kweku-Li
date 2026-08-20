import { db } from './db/client';
import { content } from './db/schema';

export type ContentMap = Record<string, string>;

export async function getAllContent(): Promise<ContentMap> {
  const rows = await db.select().from(content);
  const map: ContentMap = {};
  for (const row of rows) map[row.key] = row.value;
  return map;
}

export function parseJson<T>(value: string | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}
