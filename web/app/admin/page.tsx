import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';

export default async function AdminIndexPage() {
  const session = await getSession();
  redirect(session.user ? '/admin/dashboard' : '/admin/login');
}
