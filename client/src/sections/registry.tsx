import type { ComponentType } from 'react';
import type { SectionDef, FieldDef } from './fields';
import {
  SplitHero,
  PageHero,
  CardGrid,
  Intersection,
  CtaBanner,
  DualIdentity,
  Contact,
  Pillars,
  CaseStudies,
  Testimonials,
  GalleryHero,
  GalleryGrid,
  Newsletter,
  RichText,
} from './renderers';

const ctaFields = (key: string, label: string): FieldDef => ({
  key,
  label,
  type: 'link',
});

const statList: FieldDef = {
  key: 'stats',
  label: 'Stats',
  type: 'list',
  itemFields: [
    { key: 'value', label: 'Value', type: 'text' },
    { key: 'label', label: 'Label', type: 'text' },
  ],
};

export const RENDERERS: Record<string, ComponentType<{ data: Record<string, any> }>> = {
  splitHero: SplitHero,
  pageHero: PageHero,
  cardGrid: CardGrid,
  intersection: Intersection,
  ctaBanner: CtaBanner,
  dualIdentity: DualIdentity,
  contact: Contact,
  pillars: Pillars,
  caseStudies: CaseStudies,
  testimonials: Testimonials,
  galleryHero: GalleryHero,
  galleryGrid: GalleryGrid,
  newsletter: Newsletter,
  richText: RichText,
};

export const SECTION_DEFS: SectionDef[] = [
  {
    type: 'splitHero',
    label: 'Split Hero',
    description: 'Large heading + portrait image, used at the top of the home page.',
    fields: [
      { key: 'eyebrow', label: 'Eyebrow', type: 'text' },
      { key: 'title', label: 'Title', type: 'text', hint: 'Wrap words in |pipes| for the italic terracotta accent.' },
      { key: 'body', label: 'Body', type: 'textarea' },
      ctaFields('primaryCta', 'Primary button'),
      ctaFields('secondaryCta', 'Secondary button'),
      { key: 'image', label: 'Image', type: 'image' },
      { key: 'imageCaption', label: 'Image caption', type: 'text' },
    ],
    defaultData: {
      eyebrow: 'NEW SECTION',
      title: 'A bold new |statement.|',
      body: 'Describe yourself here.',
      primaryCta: { label: 'View Works', href: '/gallery' },
      secondaryCta: { label: '', href: '' },
      image: '',
      imageCaption: '',
    },
  },
  {
    type: 'pageHero',
    label: 'Page Hero',
    description: 'Heading, intro, optional buttons, stats and side image.',
    fields: [
      { key: 'eyebrow', label: 'Eyebrow', type: 'text' },
      { key: 'title', label: 'Title', type: 'text', hint: 'Use |pipes| for accent words.' },
      { key: 'body', label: 'Body', type: 'textarea' },
      ctaFields('primaryCta', 'Primary button'),
      ctaFields('secondaryCta', 'Secondary button'),
      statList,
      { key: 'image', label: 'Side image', type: 'image' },
    ],
    defaultData: { eyebrow: 'ABOUT', title: 'A new |chapter.|', body: '', stats: [], image: '' },
  },
  {
    type: 'cardGrid',
    label: 'Card Grid',
    description: 'Icon cards with tags (e.g. “The Dual Essence”).',
    fields: [
      { key: 'heading', label: 'Heading', type: 'text' },
      { key: 'subheading', label: 'Subheading', type: 'textarea' },
      {
        key: 'cards',
        label: 'Cards',
        type: 'list',
        itemFields: [
          { key: 'icon', label: 'Icon name', type: 'text', hint: 'Any Material Symbols name, e.g. draw, palette, hub' },
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'body', label: 'Body', type: 'textarea' },
          { key: 'tags', label: 'Tags', type: 'tags' },
          { key: 'href', label: 'Link (optional)', type: 'text' },
        ],
      },
    ],
    defaultData: {
      heading: 'A New Grid',
      subheading: '',
      cards: [{ icon: 'draw', title: 'Card title', body: 'Card text.', tags: [] }],
    },
  },
  {
    type: 'intersection',
    label: 'Intersection',
    description: 'Blush band with orb graphic, copy, and two stat columns.',
    fields: [
      { key: 'heading', label: 'Heading', type: 'text' },
      { key: 'body', label: 'Body', type: 'textarea' },
      { key: 'leftStat.title', label: 'Left column title', type: 'text' },
      { key: 'leftStat.body', label: 'Left column body', type: 'textarea' },
      { key: 'rightStat.title', label: 'Right column title', type: 'text' },
      { key: 'rightStat.body', label: 'Right column body', type: 'textarea' },
    ],
    defaultData: {
      heading: 'The Intersection',
      body: '',
      leftStat: { title: 'Logical Rigor', body: '' },
      rightStat: { title: 'Intuitive Flow', body: '' },
    },
  },
  {
    type: 'ctaBanner',
    label: 'CTA Banner',
    description: 'Sage or dark call-to-action band with email capture or button.',
    fields: [
      { key: 'heading', label: 'Heading', type: 'text' },
      { key: 'body', label: 'Body', type: 'textarea' },
      { key: 'buttonLabel', label: 'Button label', type: 'text' },
      { key: 'mode', label: 'Mode', type: 'select', options: ['email', 'button'] },
      { key: 'href', label: 'Button link (button mode)', type: 'text' },
      { key: 'tone', label: 'Tone', type: 'select', options: ['sage', 'dark'] },
    ],
    defaultData: { heading: 'Let’s craft something meaningful.', body: '', buttonLabel: 'Get in touch', mode: 'email', tone: 'sage' },
  },
  {
    type: 'dualIdentity',
    label: 'Dual Identity',
    description: 'Two identity cards flanking a terracotta quote.',
    fields: [
      { key: 'heading', label: 'Heading', type: 'text' },
      { key: 'left.icon', label: 'Left icon', type: 'text', hint: 'Material Symbols name, e.g. terminal' },
      { key: 'left.title', label: 'Left title', type: 'text' },
      { key: 'left.body', label: 'Left body', type: 'textarea' },
      { key: 'left.tags', label: 'Left tags', type: 'tags' },
      { key: 'quote', label: 'Center quote', type: 'textarea' },
      { key: 'right.icon', label: 'Right icon', type: 'text', hint: 'Material Symbols name, e.g. palette' },
      { key: 'right.title', label: 'Right title', type: 'text' },
      { key: 'right.body', label: 'Right body', type: 'textarea' },
      { key: 'right.tags', label: 'Right tags', type: 'tags' },
    ],
    defaultData: {
      heading: 'A Dual Identity',
      left: { icon: 'terminal', title: 'Technical Integrity', body: '', tags: [] },
      quote: 'Precision is the bridge between a vision and its manifestation.',
      right: { icon: 'palette', title: 'Creative Expression', body: '', tags: [] },
    },
  },
  {
    type: 'contact',
    label: 'Contact',
    description: 'Contact info panel + inquiry form.',
    fields: [
      { key: 'heading', label: 'Heading', type: 'text' },
      { key: 'body', label: 'Body', type: 'textarea' },
      { key: 'email', label: 'Email', type: 'text' },
      { key: 'location', label: 'Location', type: 'text' },
      { key: 'inquiryTypes', label: 'Inquiry types', type: 'tags' },
      { key: 'buttonLabel', label: 'Submit button label', type: 'text' },
      { key: 'followHeading', label: 'Follow heading', type: 'text' },
    ],
    defaultData: {
      heading: 'Let’s start a |Conversation.|',
      body: '',
      email: '',
      location: '',
      inquiryTypes: ['General'],
      buttonLabel: 'Send',
    },
  },
  {
    type: 'pillars',
    label: 'Pillars',
    description: 'Toned expertise cards (light / sage / blush / dark).',
    fields: [
      { key: 'heading', label: 'Heading', type: 'text' },
      { key: 'subheading', label: 'Subheading', type: 'textarea' },
      {
        key: 'items',
        label: 'Pillars',
        type: 'list',
        itemFields: [
          { key: 'icon', label: 'Label', type: 'text', hint: 'Small monospace label, e.g. draw, hub' },
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'body', label: 'Body', type: 'textarea' },
          { key: 'tone', label: 'Tone', type: 'select', options: ['light', 'sage', 'blush', 'dark'] },
        ],
      },
    ],
    defaultData: { heading: 'Pillars of Practice', subheading: '', items: [] },
  },
  {
    type: 'caseStudies',
    label: 'Case Studies',
    description: 'Alternating image + outcome-stat case study cards.',
    fields: [
      { key: 'heading', label: 'Heading', type: 'text' },
      { key: 'subheading', label: 'Subheading', type: 'textarea' },
      {
        key: 'items',
        label: 'Case studies',
        type: 'list',
        itemFields: [
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'body', label: 'Body', type: 'textarea' },
          { key: 'image', label: 'Image', type: 'image' },
          {
            key: 'stats',
            label: 'Stats',
            type: 'list',
            itemFields: [
              { key: 'value', label: 'Value', type: 'text' },
              { key: 'label', label: 'Label', type: 'text' },
            ],
          },
        ],
      },
    ],
    defaultData: { heading: 'Process Over Performance', subheading: '', items: [] },
  },
  {
    type: 'testimonials',
    label: 'Testimonials',
    description: 'Philosophy copy with pull quotes and two images.',
    fields: [
      { key: 'heading', label: 'Heading', type: 'text' },
      { key: 'body', label: 'Body', type: 'textarea' },
      {
        key: 'quotes',
        label: 'Quotes',
        type: 'list',
        itemFields: [
          { key: 'text', label: 'Quote', type: 'textarea' },
          { key: 'author', label: 'Author', type: 'text' },
        ],
      },
      { key: 'images', label: 'Images (up to 2 shown)', type: 'images' },
    ],
    defaultData: { heading: 'Cultivating Quality', body: '', quotes: [], images: [] },
  },
  {
    type: 'galleryHero',
    label: 'Gallery Hero',
    description: 'Full-bleed exhibition banner with image background.',
    fields: [
      { key: 'eyebrow', label: 'Eyebrow', type: 'text' },
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'body', label: 'Body', type: 'textarea' },
      { key: 'buttonLabel', label: 'Button label', type: 'text' },
      { key: 'image', label: 'Background image', type: 'image' },
    ],
    defaultData: { eyebrow: 'CURRENT EXHIBITION', title: 'New Exhibition', body: '', buttonLabel: 'View Exhibition', image: '' },
  },
  {
    type: 'galleryGrid',
    label: 'Gallery Grid',
    description: 'Filterable masonry of artworks — pieces are managed in Admin → Gallery.',
    fields: [
      { key: 'heading', label: 'Heading', type: 'text' },
      { key: 'intro', label: 'Intro', type: 'textarea' },
    ],
    defaultData: { heading: 'Selected Works', intro: '' },
  },
  {
    type: 'newsletter',
    label: 'Newsletter',
    description: 'Centered email sign-up band.',
    fields: [
      { key: 'heading', label: 'Heading', type: 'text' },
      { key: 'body', label: 'Body', type: 'textarea' },
      { key: 'buttonLabel', label: 'Button label', type: 'text' },
    ],
    defaultData: { heading: 'Stay Within the Atelier', body: '', buttonLabel: 'Subscribe' },
  },
  {
    type: 'richText',
    label: 'Text Block',
    description: 'Free-form heading, paragraph and optional image — a blank canvas.',
    fields: [
      { key: 'eyebrow', label: 'Eyebrow', type: 'text' },
      { key: 'heading', label: 'Heading', type: 'text' },
      { key: 'body', label: 'Body', type: 'textarea' },
      { key: 'image', label: 'Image', type: 'image' },
    ],
    defaultData: { eyebrow: '', heading: 'New Section', body: 'Write something…', image: '' },
  },
];

export const defFor = (type: string) => SECTION_DEFS.find((d) => d.type === type);
