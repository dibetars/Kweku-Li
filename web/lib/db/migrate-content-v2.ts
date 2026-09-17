// Moves an existing database onto the multi-page site content (September 2026).
// Overwrites the keys in CONTENT_V2 and leaves everything else (contact details, socials,
// footer text, retired keys) untouched. Writes a JSON backup of the whole content table first.
//
//   npm run db:content-v2 -- ../.backups                      (every key)
//   npm run db:content-v2 -- ../.backups --keys a.b,c.d       (only these keys)
//
import fs from 'node:fs';
import path from 'node:path';
import { eq } from 'drizzle-orm';
import { db } from './client';
import { auditLogs, content } from './schema';
import { CONTENT_V2 } from './seed-content';

async function main() {
  const args = process.argv.slice(2);
  const keysAt = args.indexOf('--keys');
  const only = keysAt >= 0 ? new Set(args[keysAt + 1].split(',').map((k) => k.trim())) : null;
  const backupDir = args.find((a, i) => !a.startsWith('--') && (keysAt < 0 || i !== keysAt + 1));
  if (only) {
    const unknown = [...only].filter((k) => !(k in CONTENT_V2));
    if (unknown.length) throw new Error(`Unknown keys: ${unknown.join(', ')}`);
  }
  const rows = await db.select().from(content);

  if (backupDir) {
    fs.mkdirSync(backupDir, { recursive: true });
    const file = path.join(backupDir, `content-before-v2-${new Date().toISOString().replace(/[:.]/g, '-')}.json`);
    fs.writeFileSync(file, JSON.stringify(rows, null, 2));
    console.log(`Backed up ${rows.length} rows to ${file}`);
  }

  const existing = new Map(rows.map((r) => [r.key, r.value]));
  const now = new Date().toISOString();
  let created = 0;
  let updated = 0;

  const entries = Object.entries(CONTENT_V2).filter(([key]) => !only || only.has(key));
  for (const [key, value] of entries) {
    const before = existing.get(key);
    if (before === value) continue;
    if (before === undefined) {
      await db.insert(content).values({ key, value, updatedAt: now });
      created++;
    } else {
      await db.update(content).set({ value, updatedAt: now }).where(eq(content.key, key));
      updated++;
    }
    await db.insert(auditLogs).values({
      userId: null,
      action: before === undefined ? 'create' : 'update',
      key,
      before: before ?? null,
      after: value,
      createdAt: now,
      ip: 'migrate-content-v2',
    });
  }

  console.log(`Content v2: ${created} created, ${updated} updated, ${entries.length - created - updated} unchanged.`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
