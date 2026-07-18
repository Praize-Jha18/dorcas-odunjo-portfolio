export interface Section {
  uid: string;
  type: string;
  data: Record<string, any>;
}

export interface Page {
  _id: string;
  slug: string;
  title: string;
  navLabel: string;
  navOrder: number;
  showInNav: boolean;
  sections: Section[];
}

export interface Artwork {
  _id: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  year: string;
  medium: string;
  order: number;
  published: boolean;
}

export interface SiteSettings {
  brand?: string;
  footerTagline?: string;
  footerNote?: string;
  email?: string;
  location?: string;
  socials?: { label: string; url: string }[];
}
