import './site.css';
import { SiteNav } from '@/components/site/site-nav';
import { SiteFooter } from '@/components/site/site-footer';
import { getSiteContent } from '@/lib/site-content';

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const s = await getSiteContent();
  return (
    <div className="site">
      <SiteNav logo={s.logo} cta={s.headerCta} />
      <main>{children}</main>
      <SiteFooter email={s.contact.email} quote={s.footerQuote} copyright={s.footerCopyright} />
    </div>
  );
}
