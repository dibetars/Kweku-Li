export interface ServiceItem {
  icon: string;
  title: string;
  description: string;
}

export interface WorkStat {
  number: string;
  label: string;
}

export interface WorkItem {
  icon: string;
  tag: string;
  title: string;
  description: string;
  stats: string; // JSON-encoded WorkStat[]
  image?: string; // /img/... or an uploaded URL
  client?: string;
  year?: string;
  href?: string;
}

export interface PortfolioItem {
  icon: string;
  title: string;
  description: string;
  image?: string;
  category?: string; // filter chip label, e.g. "Copywriting"
  subtitle?: string; // small overlay caption
}

export interface ExperienceItem {
  title: string;
  date: string; // e.g. "2025 · Photography & Exhibition"
  description: string;
  tags: string[];
  images?: string[]; // shown on the last (expanded) row
}

export interface InsightItem {
  category: string;
  meta: string;
  title: string;
  description: string;
  image?: string;
}

export interface PromoBanner {
  kicker: string;
  title: string;
  description: string;
  cta: string;
  image?: string;
}

export interface TestimonialItem {
  text: string;
  author: string;
}

export interface ThemeConfig {
  mode: 'light' | 'dark' | 'system';
  layout?: { hero?: string; cards?: string };
  variables: Record<string, string>;
}

export interface HeaderCta {
  text: string;
  href: string;
}

export interface HeroTitle {
  text: string;
}
