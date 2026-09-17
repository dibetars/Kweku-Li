import { getSiteContent } from '@/lib/site-content';
import { AboutTeaser, ContactStrip, FeaturedCases, FeaturedWork, Films, Hero, Services, TestimonialsStrip } from '@/components/site/home';

export const revalidate = 0; // always read fresh content; admin saves call revalidatePath too

export default async function HomePage() {
  const s = await getSiteContent();
  return (
    <>
      <Hero s={s} />
      <Films s={s} />
      <Services s={s} />
      <FeaturedCases s={s} />
      <FeaturedWork s={s} />
      <AboutTeaser s={s} />
      <TestimonialsStrip s={s} />
      <ContactStrip s={s} />
    </>
  );
}
