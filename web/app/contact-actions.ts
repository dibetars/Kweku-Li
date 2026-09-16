'use server';

import { headers } from 'next/headers';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db/client';
import { submissions } from '@/lib/db/schema';
import { contactSchema, isRateLimited, sendContactNotification } from '@/lib/contact';

export type ContactResult =
  | { ok: true }
  | { ok: false; error: string; fields?: Record<string, string> };

export async function submitContactAction(_prev: ContactResult | null, formData: FormData): Promise<ContactResult> {
  // Honeypot: real visitors never see or fill this field.
  if (String(formData.get('website') ?? '').trim()) return { ok: true };

  const h = await headers();
  const ip = (h.get('x-forwarded-for') ?? '').split(',')[0].trim() || h.get('x-real-ip') || '';
  const userAgent = (h.get('user-agent') ?? '').slice(0, 300);

  if (ip && isRateLimited(ip)) {
    return { ok: false, error: 'Too many messages from this connection. Please try again in a few minutes.' };
  }

  const raw = Object.fromEntries(
    ['name', 'email', 'phone', 'company', 'service', 'timeline', 'budget', 'location', 'message'].map((k) => [
      k,
      String(formData.get(k) ?? ''),
    ])
  );
  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? '');
      if (key && !fields[key]) fields[key] = issue.message;
    }
    return { ok: false, error: 'Please check the highlighted fields.', fields };
  }
  const data = parsed.data;

  let id: number;
  try {
    const [row] = await db
      .insert(submissions)
      .values({
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company,
        service: data.service,
        timeline: data.timeline,
        budget: data.budget,
        location: data.location,
        message: data.message,
        ip,
        userAgent,
        status: 'new',
        createdAt: new Date().toISOString(),
      })
      .returning({ id: submissions.id });
    id = row.id;
  } catch (err) {
    console.error('Failed to store contact submission', err);
    return { ok: false, error: 'Something went wrong saving your message. Please email me directly instead.' };
  }

  // The message is safe in the database at this point; email is a notification, not the record.
  const mail = await sendContactNotification(data);
  await db
    .update(submissions)
    .set({
      emailStatus: mail.ok ? 'sent' : `failed: ${mail.error}`,
      emailSentAt: mail.ok ? new Date().toISOString() : null,
    })
    .where(eq(submissions.id, id));
  if (!mail.ok) console.error(`Contact email for submission #${id} not sent: ${mail.error}`);

  return { ok: true };
}
