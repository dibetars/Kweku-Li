// Field definitions for the admin dashboard. Each content key maps to an editor so the dashboard
// shows real form fields instead of raw JSON. Values are still stored as strings in the `content`
// table (JSON for objects and lists), exactly as the public pages read them.

export type FieldType =
  | 'text'
  | 'textarea'
  | 'image'
  | 'images' // any number of images
  | 'lines' // list of strings, one per line
  | 'list'; // nested list of objects, described by `fields`

export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  help?: string;
  full?: boolean; // span the whole row
  fields?: FieldDef[]; // for type 'list'
  itemLabel?: string; // for type 'list'
  titleField?: string; // for type 'list'
}

export type EditorDef =
  | { kind: 'text'; label: string; multiline?: boolean; help?: string }
  | { kind: 'image'; label: string; help?: string }
  | { kind: 'object'; label: string; help?: string; fields: FieldDef[] }
  | { kind: 'list'; label: string; help?: string; itemLabel: string; titleField: string; fields: FieldDef[] };

const t = (key: string, label: string, extra: Partial<FieldDef> = {}): FieldDef => ({ key, label, type: 'text', ...extra });
const ta = (key: string, label: string, extra: Partial<FieldDef> = {}): FieldDef => ({ key, label, type: 'textarea', full: true, ...extra });
const img = (key: string, label: string, extra: Partial<FieldDef> = {}): FieldDef => ({ key, label, type: 'image', full: true, ...extra });
const lines = (key: string, label: string, extra: Partial<FieldDef> = {}): FieldDef => ({ key, label, type: 'lines', full: true, ...extra });

const PARAS = 'Leave a blank line between paragraphs.';
const YT = 'A YouTube link.';

// A card on the homepage (featured case studies and featured work).
const CARD_FIELDS: FieldDef[] = [
  t('title', 'Title', { full: true }),
  t('category', 'Label', { help: 'Small text on the card' }),
  t('year', 'Year'),
  img('image', 'Photo', { help: 'Leave empty for a text tile.' }),
  t('video', 'Video', { full: true, help: `${YT} Plays inside the card and replaces the photo.` }),
  t('caseStudy', 'Case study slug', { help: 'e.g. lalovavi. Links the card to that case study.' }),
  t('url', 'External link', { help: 'Used only when there is no case study.' }),
];

export const EDITORS: Record<string, EditorDef> = {
  // ---------- Home ----------
  'hero.subtitle': { kind: 'text', label: 'Roles', help: 'Shown down the left edge of the hero.' },
  'hero.title': { kind: 'object', label: 'Tagline', fields: [ta('text', 'The line under "Hello"')] },
  'hero.description': { kind: 'text', label: 'Description', multiline: true, help: 'Shown under the tagline.' },
  'hero.stats': { kind: 'list', label: 'Hero stats', itemLabel: 'Stat', titleField: 'number', fields: [t('number', 'Number', { help: 'Shown with a + in front' }), t('label', 'Label')] },
  'hero.image': { kind: 'image', label: 'Portrait', help: 'A cut-out PNG with a transparent background looks best.' },
  'home.films': { kind: 'list', label: 'Films under the hero', itemLabel: 'Film', titleField: 'title', fields: [t('title', 'Title'), t('video', 'Video', { help: YT })] },
  'services.description': { kind: 'text', label: 'Services intro line' },
  'services.list': {
    kind: 'list',
    label: 'Services',
    itemLabel: 'Service',
    titleField: 'title',
    fields: [t('icon', 'Icon (emoji)'), t('title', 'Title'), ta('description', 'Description')],
  },
  'featured.cases': { kind: 'list', label: 'Featured case studies', itemLabel: 'Card', titleField: 'title', fields: CARD_FIELDS },
  'featured.work': { kind: 'list', label: 'Featured work', itemLabel: 'Card', titleField: 'title', fields: CARD_FIELDS },
  'home.about': {
    kind: 'object',
    label: 'About teaser',
    fields: [ta('lead', 'Lead paragraph'), ta('body', 'Second paragraph'), t('statNumber', 'Card number'), t('statLabel', 'Card text')],
  },
  'skills.list': {
    kind: 'list',
    label: 'Skills',
    itemLabel: 'Group',
    titleField: 'title',
    fields: [t('title', 'Group title', { full: true }), lines('items', 'Skills', { help: 'One per line.' })],
  },
  'contact.intro': { kind: 'text', label: 'Closing call-to-action text', multiline: true, help: 'Shown in "Got a Vision?" and on the Contact page.' },

  // ---------- Case studies ----------
  'casestudies.list': {
    kind: 'list',
    label: 'Case studies',
    help: 'Each one gets its own page at /work/<slug>.',
    itemLabel: 'Case study',
    titleField: 'title',
    fields: [
      t('title', 'Title', { full: true }),
      t('slug', 'Slug', { help: 'Lowercase words and dashes. Changing it changes the page address.' }),
      t('year', 'Year'),
      t('category', 'Discipline'),
      t('client', 'Client'),
      t('role', 'Role', { full: true }),
      ta('summary', 'Summary', { help: 'One or two sentences, shown under the title.' }),
      img('cover', 'Cover photo'),
      {
        key: 'stats',
        label: 'Stats',
        type: 'list',
        full: true,
        itemLabel: 'Stat',
        titleField: 'number',
        fields: [t('number', 'Number'), t('label', 'Label')],
      },
      {
        key: 'sections',
        label: 'Sections',
        type: 'list',
        full: true,
        itemLabel: 'Section',
        titleField: 'heading',
        fields: [t('heading', 'Heading', { full: true }), ta('body', 'Text', { help: PARAS }), lines('bullets', 'Bullet points', { help: 'One per line.' })],
      },
      { key: 'gallery', label: 'Gallery', type: 'images', full: true },
      lines('videos', 'Videos', { help: 'YouTube links, one per line.' }),
      {
        key: 'links',
        label: 'Links',
        type: 'list',
        full: true,
        help: 'Public links only. Each becomes a button.',
        itemLabel: 'Link',
        titleField: 'label',
        fields: [t('label', 'Label'), t('url', 'URL')],
      },
    ],
  },

  // ---------- Portfolio ----------
  'portfolio.intro': { kind: 'text', label: 'Intro', multiline: true },
  'portfolio.groups': {
    kind: 'list',
    label: 'Portfolio groups',
    itemLabel: 'Group',
    titleField: 'title',
    fields: [
      t('title', 'Group title', { full: true, help: 'Becomes a filter chip.' }),
      {
        key: 'entries',
        label: 'Entries',
        type: 'list',
        full: true,
        itemLabel: 'Entry',
        titleField: 'title',
        fields: [
          t('title', 'Title', { full: true }),
          t('year', 'Year'),
          t('outlet', 'Publication or client', { help: 'Entries in a row with the same value share a heading.' }),
          t('caseStudy', 'Case study slug', { help: 'Shows a "Case study" button.' }),
          t('url', 'External link', { help: 'Shows a "View" button. Leave empty if the link is not public.' }),
          img('image', 'Thumbnail (optional)'),
        ],
      },
    ],
  },

  // ---------- About ----------
  'about.page': {
    kind: 'object',
    label: 'About page',
    fields: [
      t('name', 'Name line'),
      t('origin', 'Origin'),
      t('meaning', 'Meaning', { full: true }),
      t('intro', 'Intro line', { full: true }),
      t('wordsTitle', '"Words I Live By" heading'),
      ta('words', 'Words I Live By', { help: PARAS }),
      ta('professional', 'The Professional'),
      ta('mission', 'The Mission'),
      ta('portfolioBlurb', 'Portfolio paragraph', { help: PARAS }),
      t('artistTitle', 'The Artist heading'),
      t('artistVideo', 'The Artist video', { help: YT }),
      ta('artist', 'The Artist text'),
      t('philosophyQuote', 'Philosophy quote', { full: true }),
      t('philosophyVideo', 'Philosophy video', { help: YT }),
      t('artistryVideo', 'Artistry video', { help: YT }),
      ta('artistry', 'Artistry text'),
      t('artistPortfolioUrl', 'Artist portfolio link', { full: true }),
      ta('lifeCoach', 'Life Coach teaser'),
    ],
  },
  'testimonials.list': {
    kind: 'list',
    label: 'Testimonials',
    help: 'All show on the About page; the first three also show on the homepage.',
    itemLabel: 'Testimonial',
    titleField: 'author',
    fields: [t('author', 'Name'), t('role', 'Role or company (optional)'), ta('text', 'Quote')],
  },

  // ---------- Sensei-Hood ----------
  'sensei.page': {
    kind: 'object',
    label: 'Sensei-Hood page',
    fields: [t('quote', 'Opening quote', { full: true }), t('quoteSource', 'Quote source'), ta('origins', 'Origins', { help: PARAS }), lines('roles', 'Roles', { help: 'One per line.' })],
  },
  'mentors.list': {
    kind: 'list',
    label: 'Proud Mentor Moments',
    itemLabel: 'Story',
    titleField: 'name',
    fields: [
      t('name', 'Name', { full: true }),
      ta('bio', 'Bio'),
      ta('guidance', "Kweku's guidance", { help: PARAS }),
      ta('goals', 'Goals & aspirations'),
      ta('challenges', 'Challenges & roadblocks'),
      ta('strategies', 'Strategies & resources', { help: PARAS }),
      ta('milestones', 'Milestones'),
      ta('outcome', 'Outcome & growth', { help: PARAS }),
      ta('present', 'Present day'),
      ta('recommendation', 'Recommendation'),
    ],
  },

  // ---------- Contact ----------
  'contact.email': { kind: 'text', label: 'Email' },
  'contact.phone': { kind: 'text', label: 'Phone' },
  'contact.location': { kind: 'text', label: 'Location' },
  'social.linkedin': { kind: 'text', label: 'LinkedIn URL' },
  'social.instagram': { kind: 'text', label: 'Instagram URL' },
  'social.twitter': { kind: 'text', label: 'X/Twitter URL' },
  'social.youtube': { kind: 'text', label: 'YouTube URL' },
  'social.tiktok': { kind: 'text', label: 'TikTok URL' },
  'social.soundcloud': { kind: 'text', label: 'SoundCloud URL' },

  // ---------- Navigation & footer ----------
  'header.logo': { kind: 'text', label: 'Logo text', help: 'Short, shown in a square badge. "Kweku Diaw" displays as KD.' },
  'header.cta': { kind: 'object', label: 'Header button', fields: [t('text', 'Text'), t('href', 'Link', { help: 'e.g. /contact' })] },
  'footer.quote': { kind: 'text', label: 'Footer quote' },
  'footer.copyright': { kind: 'text', label: 'Copyright line' },
};

// Photos shipped with the site, offered in the image picker alongside uploads.
export const BUNDLED_IMAGES = [
  '/img/about-hero-red.jpg',
  '/img/cs-next-cover.jpg',
  '/img/cs-next-2.jpg',
  '/img/cs-next-3.jpg',
  '/img/cs-next-4.jpg',
  '/img/cs-launchpad-cover.jpg',
  '/img/cs-launchpad-2.jpg',
  '/img/cs-launchpad-3.jpg',
  '/img/cs-ananse-cover.jpg',
  '/img/cs-ananse-2.jpg',
  '/img/cs-ananse-3.jpg',
  '/img/cs-afrotakus-cover.jpg',
  '/img/cs-afrotakus-1.jpg',
  '/img/cs-afrotakus-2.jpg',
  '/img/cs-afrotakus-3.jpg',
  '/img/cs-afrotakus-4.jpg',
  '/img/cs-afrotakus-5.jpg',
  '/img/cs-afrotakus-6.jpg',
  '/img/cs-afrotakus-7.jpg',
  '/img/cs-afrotakus-8.jpg',
  '/img/cs-afrotakus-9.jpg',
  '/img/hero-portrait.png',
  '/img/about-portrait-tall.png',
  '/img/about-thumb.png',
  '/img/portrait-garden.jpg',
  '/img/li-chronicles-mic.jpg',
  '/img/case-greetings-from-abroad.jpg',
  '/img/case-5foot3.jpg',
  '/img/case-afrotakus.jpg',
  '/img/cs-lalovavi-stage.jpg',
  '/img/cs-lalovavi-scene.jpg',
  '/img/cs-lalovavi-duet.jpg',
  '/img/cs-lalovavi-finale.jpg',
  '/img/cs-lalovavi-ensemble.jpg',
  '/img/cs-lalovavi-rise-of-titan.jpg',
  '/img/cs-lalovavi-cybp.jpg',
  '/img/cs-lalovavi-cinsei.jpg',
  '/img/cs-lalovavi-cinsei-2.jpg',
  '/img/cs-lalovavi-bop-logo.jpg',
  '/img/cs-this-ability-cover.jpg',
  '/img/cs-this-ability-tracklist.jpg',
  '/img/cs-this-ability-230.jpg',
  '/img/cs-scripps-schedule.jpg',
  '/img/cs-scripps-panel.jpg',
  '/img/cs-gfa-back-cover.jpg',
  '/img/cs-5foot3-card.jpg',
  '/img/cs-5foot3-tracklist.jpg',
];
