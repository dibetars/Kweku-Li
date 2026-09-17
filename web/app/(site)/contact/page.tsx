import type { Metadata } from 'next';
import { getAllContent } from '@/lib/content';
import { buildSiteContent } from '@/lib/site-content';
import { ContactSection } from '@/components/site/contact-section';

export const revalidate = 0;
export const metadata: Metadata = { title: 'Contact | Kweku Diaw' };

export default async function ContactPage() {
  const c = await getAllContent();
  const s = buildSiteContent(c);
  return <ContactSection c={c} intro={s.contactIntro} />;
}
