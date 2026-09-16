import bcrypt from 'bcryptjs';
import { db } from './client';
import { users, content } from './schema';
import { SEED_CONTENT } from './seed-content';

async function main() {
  const existingUsers = await db.select().from(users);
  if (existingUsers.length === 0) {
    const password = process.env.ADMIN_PASSWORD;
    if (!password) {
      throw new Error(
        'ADMIN_PASSWORD must be set to seed the first admin user (no insecure default is provided).'
      );
    }
    const hash = await bcrypt.hash(password, 12);
    await db.insert(users).values({
      username: 'admin',
      passwordHash: hash,
      role: 'admin',
      createdAt: new Date().toISOString(),
    });
    console.log('Seeded admin user.');
  } else {
    console.log('Users table already has data, skipping admin seed.');
  }

  const existingContent = await db.select().from(content);
  if (existingContent.length === 0) {
    const now = new Date().toISOString();
    const rows = Object.entries(SEED_CONTENT).map(([key, value]) => ({
      key,
      value,
      updatedAt: now,
    }));
    await db.insert(content).values(rows);
    console.log(`Seeded ${rows.length} content rows.`);
  } else {
    // Existing database: add any keys introduced since it was seeded, never overwrite edits.
    const have = new Set(existingContent.map((r) => r.key));
    const now = new Date().toISOString();
    const missing = Object.entries(SEED_CONTENT)
      .filter(([key]) => !have.has(key))
      .map(([key, value]) => ({ key, value, updatedAt: now }));
    if (missing.length) {
      await db.insert(content).values(missing);
      console.log(`Added ${missing.length} new content keys: ${missing.map((m) => m.key).join(', ')}`);
    } else {
      console.log('Content table already has every key, nothing to add.');
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
