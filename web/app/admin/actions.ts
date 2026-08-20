'use server';

import { eq, desc } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';
import { put, list, del } from '@vercel/blob';
import { db } from '@/lib/db/client';
import { users, content, auditLogs } from '@/lib/db/schema';
import { getSession, requireUser, requireRole } from '@/lib/session';
import { logAudit } from '@/lib/audit';

export type ActionResult = { ok: true } | { ok: false; error: string };

// ---------- Auth ----------

export async function loginAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const username = String(formData.get('username') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  if (!username || !password) return { ok: false, error: 'Username and password are required.' };

  const [user] = await db.select().from(users).where(eq(users.username, username));
  if (!user) return { ok: false, error: 'Invalid username or password.' };

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return { ok: false, error: 'Invalid username or password.' };

  const session = await getSession();
  session.user = { id: user.id, username: user.username, role: user.role as 'admin' | 'editor' };
  await session.save();

  revalidatePath('/admin');
  return { ok: true };
}

export async function logoutAction(): Promise<void> {
  const session = await getSession();
  session.destroy();
  revalidatePath('/admin');
}

// ---------- Content CRUD ----------

export async function setContentAction(key: string, value: string): Promise<ActionResult> {
  try {
    const user = await requireRole('admin', 'editor');

    const [existing] = await db.select().from(content).where(eq(content.key, key));
    const now = new Date().toISOString();

    if (existing) {
      await db
        .update(content)
        .set({ value, updatedBy: user.id, updatedAt: now })
        .where(eq(content.key, key));
      await logAudit({ userId: user.id, action: 'update', key, before: existing.value, after: value });
    } else {
      await db.insert(content).values({ key, value, updatedBy: user.id, updatedAt: now });
      await logAudit({ userId: user.id, action: 'create', key, before: null, after: value });
    }

    revalidatePath('/');
    revalidatePath('/admin');
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Failed to save.' };
  }
}

export async function setContentBatchAction(
  entries: Array<{ key: string; value: string }>
): Promise<ActionResult> {
  try {
    const user = await requireRole('admin', 'editor');
    const now = new Date().toISOString();

    for (const { key, value } of entries) {
      const [existing] = await db.select().from(content).where(eq(content.key, key));
      if (existing) {
        await db.update(content).set({ value, updatedBy: user.id, updatedAt: now }).where(eq(content.key, key));
        await logAudit({ userId: user.id, action: 'update', key, before: existing.value, after: value });
      } else {
        await db.insert(content).values({ key, value, updatedBy: user.id, updatedAt: now });
        await logAudit({ userId: user.id, action: 'create', key, before: null, after: value });
      }
    }

    revalidatePath('/');
    revalidatePath('/admin');
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Failed to save.' };
  }
}

// ---------- Users ----------

export async function listUsersAction() {
  await requireRole('admin');
  return db
    .select({ id: users.id, username: users.username, role: users.role, createdAt: users.createdAt })
    .from(users);
}

export async function createUserAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  try {
    await requireRole('admin');
    const username = String(formData.get('username') ?? '').trim();
    const password = String(formData.get('password') ?? '');
    const role = String(formData.get('role') ?? 'editor');
    if (!username || !password) return { ok: false, error: 'Username and password are required.' };
    if (role !== 'admin' && role !== 'editor') return { ok: false, error: 'Invalid role.' };

    const hash = await bcrypt.hash(password, 12);
    await db.insert(users).values({
      username,
      passwordHash: hash,
      role,
      createdAt: new Date().toISOString(),
    });

    revalidatePath('/admin');
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Failed to create user.' };
  }
}

export async function resetPasswordAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  try {
    await requireRole('admin');
    const username = String(formData.get('username') ?? '').trim();
    const password = String(formData.get('password') ?? '');
    if (!username || !password) return { ok: false, error: 'Username and password are required.' };

    const [user] = await db.select().from(users).where(eq(users.username, username));
    if (!user) return { ok: false, error: 'User not found.' };

    const hash = await bcrypt.hash(password, 12);
    await db.update(users).set({ passwordHash: hash }).where(eq(users.id, user.id));

    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Failed to reset password.' };
  }
}

// ---------- Audit logs ----------

export async function listAuditLogsAction() {
  await requireRole('admin');
  const rows = await db
    .select({
      createdAt: auditLogs.createdAt,
      action: auditLogs.action,
      key: auditLogs.key,
      userId: auditLogs.userId,
    })
    .from(auditLogs)
    .orderBy(desc(auditLogs.createdAt))
    .limit(100);

  const allUsers = await db.select({ id: users.id, username: users.username }).from(users);
  const usernameById = new Map(allUsers.map((u) => [u.id, u.username]));

  return rows.map((r) => ({
    ...r,
    username: r.userId ? usernameById.get(r.userId) ?? 'unknown' : 'unknown',
  }));
}

// ---------- Media ----------

export async function uploadImageAction(formData: FormData): Promise<ActionResult & { url?: string }> {
  try {
    await requireRole('admin', 'editor');
    const file = formData.get('image');
    if (!(file instanceof File)) return { ok: false, error: 'No file provided.' };
    if (!file.type.startsWith('image/')) return { ok: false, error: 'Only image files are allowed.' };

    const blob = await put(`uploads/${crypto.randomUUID()}-${file.name}`, file, {
      access: 'public',
      addRandomSuffix: false,
    });

    revalidatePath('/admin');
    return { ok: true, url: blob.url };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Upload failed.' };
  }
}

export async function listImagesAction() {
  await requireUser();
  const { blobs } = await list({ prefix: 'uploads/' });
  return blobs.map((b) => ({ url: b.url, pathname: b.pathname, uploadedAt: b.uploadedAt }));
}

export async function deleteImageAction(url: string): Promise<ActionResult> {
  try {
    await requireRole('admin', 'editor');
    await del(url);
    revalidatePath('/admin');
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Delete failed.' };
  }
}
