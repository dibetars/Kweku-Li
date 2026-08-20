import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { getAllContent } from '@/lib/content';
import { Dashboard } from './dashboard-client';

export default async function DashboardPage() {
  const session = await getSession();
  if (!session.user) redirect('/admin/login');

  const content = await getAllContent();

  return <Dashboard user={session.user} initialContent={content} />;
}
