// Field definitions for the admin dashboard. Each content key maps to an editor so the dashboard
// can show real form fields instead of raw JSON. Values are still stored as strings in the
// `content` table (JSON for objects and lists), exactly as the public page reads them.

export type FieldType = 'text' | 'textarea' | 'image' | 'tags' | 'images' | 'stats';

export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  help?: string;
  full?: boolean; // span the whole row
}

export type EditorDef =
  | { kind: 'text'; label: string; multiline?: boolean; help?: string }
  | { kind: 'image'; label: string; help?: string }
  | { kind: 'object'; label: string; fields: FieldDef[] }
  | { kind: 'list'; label: string; itemLabel: string; titleField: string; fields: FieldDef[] };

const t = (key: string, label: string, extra: Partial<FieldDef> = {}): FieldDef => ({ key, label, type: 'text', ...extra });
const ta = (key: string, label: string, extra: Partial<FieldDef> = {}): FieldDef => ({ key, label, type: 'textarea', full: true, ...extra });
const img = (key: string, label: string, extra: Partial<FieldDef> = {}): FieldDef => ({ key, label, type: 'image', full: true, ...extra });

export const EDITORS: Record<string, EditorDef> = {
  // Hero
  'hero.subtitle': { kind: 'text', label: 'Vertical label', help: 'Shown down the left edge of the hero.' },
  'hero.title': {
    kind: 'object',
    label: 'Tagline',
    fields: [ta('text', 'Tagline (the line under "Hello")', { help: 'Wrap words in <span class="italic-text">…</span> to italicise them.' })],
  },
  'hero.stats': {
    kind: 'list',
    label: 'Hero stats',
    itemLabel: 'Stat',
    titleField: 'number',
    fields: [t('number', 'Number', { help: 'Shown with a + in front, e.g. 21.7K' }), t('label', 'Label')],
  },
  'hero.image': { kind: 'image', label: 'Portrait', help: 'A cut-out PNG with a transparent background looks best.' },

  // Services
  'services.description': { kind: 'text', label: 'Intro line' },
  'services.list': {
    kind: 'list',
    label: 'Services',
    itemLabel: 'Service',
    titleField: 'title',
    fields: [t('icon', 'Icon (emoji)'), t('title', 'Title'), ta('description', 'Description')],
  },

  // Latest works
  'work.list': {
    kind: 'list',
    label: 'Case studies',
    itemLabel: 'Case study',
    titleField: 'title',
    fields: [
      t('title', 'Title'),
      t('tag', 'Tag', { help: 'Shown on the photo, e.g. Marketing Campaign' }),
      t('client', 'Client', { help: 'Shown as "For …" next to the title' }),
      t('year', 'Year'),
      img('image', 'Photo'),
      ta('description', 'Description'),
      { key: 'stats', label: 'Stats', type: 'stats', full: true },
      t('href', 'Link (optional)', { help: 'Where the card goes when clicked. Defaults to the contact section.' }),
      t('icon', 'Fallback icon (emoji)', { help: 'Only used when there is no photo.' }),
    ],
  },

  // Portfolio
  'portfolio.list': {
    kind: 'list',
    label: 'Portfolio tiles',
    itemLabel: 'Tile',
    titleField: 'title',
    fields: [
      t('title', 'Title'),
      t('category', 'Category', { help: 'Becomes a filter chip, e.g. Copywriting' }),
      t('subtitle', 'Caption', { help: 'Small text on the photo, bottom right' }),
      img('image', 'Photo'),
      ta('description', 'Description'),
      t('icon', 'Fallback icon (emoji)'),
    ],
  },

  // Experiences
  'experience.list': {
    kind: 'list',
    label: 'Timeline',
    itemLabel: 'Entry',
    titleField: 'title',
    fields: [
      t('title', 'Title'),
      t('date', 'Date line', { help: 'e.g. 2025 · Photography & Exhibition' }),
      ta('description', 'Description'),
      { key: 'tags', label: 'Tags', type: 'tags', help: 'Comma separated' },
      { key: 'images', label: 'Photos (last entry only)', type: 'images', full: true, help: 'Up to three, shown when this is the last entry.' },
    ],
  },

  // Promo banner
  'promo.banner': {
    kind: 'object',
    label: 'Banner',
    fields: [t('kicker', 'Small line above the title'), t('title', 'Title', { full: true }), ta('description', 'Description'), t('cta', 'Link text'), img('image', 'Background photo')],
  },

  // Insights
  'insights.list': {
    kind: 'list',
    label: 'Cards',
    itemLabel: 'Card',
    titleField: 'title',
    fields: [t('category', 'Chip label'), t('meta', 'Text next to chip'), t('title', 'Title', { full: true }), img('image', 'Photo'), ta('description', 'Text')],
  },

  // About
  'about.intro': { kind: 'text', label: 'Lead paragraph', multiline: true },
  'about.professional': { kind: 'text', label: 'First bullet', multiline: true },
  'about.artist': { kind: 'text', label: 'The Artist', multiline: true, help: 'Not shown on the page any more; kept for reference.' },
  'about.philosophy': { kind: 'text', label: 'The Philosophy', multiline: true, help: 'Not shown on the page any more; kept for reference.' },
  'about.mission': { kind: 'text', label: 'Second bullet', multiline: true },

  // Testimonials
  'testimonials.list': {
    kind: 'list',
    label: 'Testimonials',
    itemLabel: 'Testimonial',
    titleField: 'author',
    fields: [ta('text', 'Quote'), t('author', 'Author', { full: true })],
  },

  // Contact
  'contact.email': { kind: 'text', label: 'Email' },
  'contact.phone': { kind: 'text', label: 'Phone' },
  'contact.location': { kind: 'text', label: 'Location' },
  'social.linkedin': { kind: 'text', label: 'LinkedIn URL' },
  'social.instagram': { kind: 'text', label: 'Instagram URL' },
  'social.twitter': { kind: 'text', label: 'X/Twitter URL' },
  'social.youtube': { kind: 'text', label: 'YouTube URL' },
  'social.tiktok': { kind: 'text', label: 'TikTok URL' },
  'social.soundcloud': { kind: 'text', label: 'SoundCloud URL' },

  // Navigation & footer
  'header.logo': { kind: 'text', label: 'Logo text', help: 'Short, shown in a square badge. "Kweku Diaw" displays as KD.' },
  'header.cta': { kind: 'object', label: 'Header button', fields: [t('text', 'Text'), t('href', 'Link')] },
  'footer.quote': { kind: 'text', label: 'Footer quote' },
  'footer.copyright': { kind: 'text', label: 'Copyright line' },
};

// Photos shipped with the site, offered in the image picker alongside uploads.
export const BUNDLED_IMAGES = [
  '/img/hero-portrait.png',
  '/img/about-portrait-tall.png',
  '/img/about-thumb.png',
  '/img/case-greetings-from-abroad.jpg',
  '/img/case-5foot3.jpg',
  '/img/case-afrotakus.jpg',
  '/img/portfolio-web-copywriting.jpg',
  '/img/portfolio-video-copywriting.jpg',
  '/img/portfolio-journalism.jpg',
  '/img/portfolio-photography.jpg',
  '/img/portfolio-marketing-campaigns.jpg',
  '/img/portfolio-li-chronicles.jpg',
  '/img/banner-promo.jpg',
  '/img/experience-1.jpg',
  '/img/experience-2.jpg',
];
