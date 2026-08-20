import { db } from './db/client';
import { auditLogs } from './db/schema';

export async function logAudit(params: {
  userId: number;
  action: 'create' | 'update';
  key?: string;
  before?: string | null;
  after?: string | null;
}) {
  await db.insert(auditLogs).values({
    userId: params.userId,
    action: params.action,
    key: params.key ?? null,
    before: params.before ?? null,
    after: params.after ?? null,
    createdAt: new Date().toISOString(),
  });
}
