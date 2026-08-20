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
    console.log('Content table already has data, skipping content seed.');
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
