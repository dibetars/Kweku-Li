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
}

export interface PortfolioItem {
  icon: string;
  title: string;
  description: string;
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
