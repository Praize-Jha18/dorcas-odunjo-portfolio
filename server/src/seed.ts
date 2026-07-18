import { randomUUID } from 'crypto';

import { Artwork } from './models/Artwork';
import { Image } from './models/Image';
import { Page, ISection } from './models/Page';
import { Setting } from './models/Setting';

const s = (type: string, data: Record<string, unknown>): ISection => ({
  uid: randomUUID(),
  type,
  data,
});

// Abstract placeholder artworks generated as SVG files so the gallery has imagery
// before real pieces are uploaded through the admin panel.
const placeholderSvgs: Record<string, string> = {
  'art-ember.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#b0552f"/><stop offset="1" stop-color="#33241c"/></linearGradient></defs><rect width="800" height="1000" fill="url(#g)"/><circle cx="560" cy="300" r="180" fill="#e8c8b4" opacity="0.55"/><path d="M0 760 Q200 620 400 760 T800 740 V1000 H0 Z" fill="#7a3d20" opacity="0.8"/></svg>`,
  'art-terrain.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000"><rect width="800" height="1000" fill="#f2e3d8"/><path d="M0 620 Q220 480 430 600 T800 560 V1000 H0 Z" fill="#c98d6b"/><path d="M0 760 Q260 660 520 770 T800 730 V1000 H0 Z" fill="#8a4a2b"/><circle cx="620" cy="230" r="95" fill="#b0552f"/></svg>`,
  'art-graphite.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000"><rect width="800" height="1000" fill="#efe9e2"/><g stroke="#4a3c33" stroke-width="6" fill="none" opacity="0.85"><path d="M160 780 C240 520 340 460 420 300"/><path d="M240 800 C320 580 430 500 520 340"/><path d="M330 820 C420 640 520 560 610 400"/></g><circle cx="560" cy="250" r="60" fill="none" stroke="#4a3c33" stroke-width="5"/></svg>`,
  'art-sage.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000"><rect width="800" height="1000" fill="#c9d4bd"/><rect x="120" y="140" width="560" height="720" fill="#f7f1ea"/><circle cx="400" cy="420" r="150" fill="#a9502b"/><rect x="220" y="640" width="360" height="26" fill="#33241c"/><rect x="220" y="700" width="240" height="26" fill="#33241c" opacity="0.55"/></svg>`,
  'art-dusk.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000"><defs><linearGradient id="d" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#33241c"/><stop offset="1" stop-color="#b0552f"/></linearGradient></defs><rect width="800" height="1000" fill="url(#d)"/><circle cx="400" cy="380" r="140" fill="#f2e3d8" opacity="0.9"/><rect x="0" y="720" width="800" height="280" fill="#241811"/></svg>`,
  'art-signal.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000"><rect width="800" height="1000" fill="#f7f1ea"/><g fill="#33241c"><rect x="140" y="180" width="90" height="640"/><rect x="300" y="320" width="90" height="500"/><rect x="460" y="240" width="90" height="580"/><rect x="620" y="420" width="60" height="400"/></g><circle cx="650" cy="220" r="70" fill="#b0552f"/></svg>`,
  'hero-soul-machine.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900"><defs><linearGradient id="h" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#241811"/><stop offset="0.55" stop-color="#6b3a22"/><stop offset="1" stop-color="#b0552f"/></linearGradient></defs><rect width="1600" height="900" fill="url(#h)"/><g opacity="0.35" stroke="#f2e3d8" stroke-width="2" fill="none"><path d="M0 700 Q400 560 800 690 T1600 650"/><path d="M0 760 Q420 640 820 750 T1600 720"/></g><circle cx="1220" cy="280" r="170" fill="#f2e3d8" opacity="0.25"/></svg>`,
  'portrait.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 850"><rect width="700" height="850" fill="#e6c9b6"/><circle cx="350" cy="300" r="130" fill="#b98a6d"/><path d="M150 850 Q350 560 550 850 Z" fill="#8a4a2b"/><rect x="0" y="0" width="700" height="850" fill="#b0552f" opacity="0.12"/></svg>`,
  'case-finance.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600"><rect width="900" height="600" fill="#efe4da"/><rect x="90" y="330" width="110" height="180" fill="#b0552f"/><rect x="250" y="250" width="110" height="260" fill="#8a4a2b"/><rect x="410" y="180" width="110" height="330" fill="#33241c"/><rect x="570" y="120" width="110" height="390" fill="#b0552f" opacity="0.7"/><circle cx="760" cy="140" r="60" fill="#c9d4bd"/></svg>`,
  'case-logistics.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600"><rect width="900" height="600" fill="#2b2d31"/><g stroke="#b0552f" stroke-width="4" fill="none" opacity="0.9"><path d="M80 480 Q300 200 520 380 T860 220"/></g><g fill="#f2e3d8"><circle cx="80" cy="480" r="12"/><circle cx="520" cy="380" r="12"/><circle cx="860" cy="220" r="12"/></g></svg>`,
};

// Placeholder art lives in MongoDB (served at /uploads/:slug) so it works on
// serverless hosts with no persistent disk.
async function upsertPlaceholderImages(): Promise<void> {
  const existing = new Set(
    (await Image.find({ slug: { $in: Object.keys(placeholderSvgs) } }).select('slug')).map((i) => i.slug)
  );
  const missing = Object.entries(placeholderSvgs).filter(([name]) => !existing.has(name));
  if (missing.length === 0) return;
  await Image.create(
    missing.map(([name, svg]) => ({ slug: name, mime: 'image/svg+xml', data: Buffer.from(svg) }))
  );
  console.log(`[seed] Stored ${missing.length} placeholder images in MongoDB`);
}

export async function seedIfEmpty(): Promise<void> {
  await upsertPlaceholderImages();
  // Ensure unique indexes exist before the emptiness check, so two servers racing the
  // seed can't both insert — the loser hits a duplicate-key error, caught in seed().
  await Promise.all([Page.init(), Setting.init()]);
  if ((await Page.countDocuments()) > 0) return;
  console.log('[seed] Empty database — seeding Digital Atelier content');
  try {
    await seed();
    console.log('[seed] Done — 4 pages, 6 artworks, site settings');
  } catch (err: any) {
    if (err?.code === 11000) {
      console.log('[seed] Another server instance seeded first — skipping.');
      return;
    }
    throw err;
  }
}

async function seed(): Promise<void> {

  await Setting.create({
    key: 'site',
    data: {
      brand: 'Digital Atelier',
      footerTagline: 'Crafting quality, curating beauty.',
      footerNote: `© ${new Date().getFullYear()} Digital Atelier. All rights reserved.`,
      email: 'dorcasodunjo@gmail.com',
      location: 'Lagos · Remote worldwide',
      socials: [
        { label: 'LinkedIn', url: 'https://linkedin.com' },
        { label: 'GitHub', url: 'https://github.com' },
        { label: 'Behance', url: 'https://behance.net' },
        { label: 'Instagram', url: 'https://instagram.com' },
      ],
    },
  });

  await Page.create([
    {
      slug: 'home',
      title: 'Home',
      navLabel: 'Home',
      navOrder: 0,
      showInNav: true,
      sections: [
        s('splitHero', {
          eyebrow: 'ERP SPECIALIST · QA ENGINEER · FINE ARTIST',
          title: 'Technician by day, |Artist by soul.|',
          body: 'Bridging the meticulous precision of ERP systems and QA with the vibrant, expressive freedom of fine art. Welcome to my digital atelier.',
          primaryCta: { label: 'View Works', href: '/gallery' },
          secondaryCta: { label: 'The IT Portfolio', href: '/it-systems' },
          image: '/uploads/portrait.svg',
          imageCaption: 'The maker, at work',
        }),
        s('cardGrid', {
          heading: 'The Dual Essence',
          subheading: 'Two disciplines, one obsession with craft: building dependable systems and creating resonant art.',
          cards: [
            {
              icon: 'settings_ethernet',
              title: 'IT & Systems Management',
              body: 'Specialising in ERP deployment, quality assurance and process optimisation. I ensure that the backbone of your enterprise runs with clockwork reliability.',
              tags: ['ERP Strategy', 'Dynamics 365', 'QA Testing'],
              href: '/it-systems',
            },
            {
              icon: 'draw',
              title: 'The Creative Canvas',
              body: 'Exploring the human condition through traditional and digital media. Each piece is an inquiry into colour, texture and the spaces in between.',
              tags: ['Oil Painting', 'Digital Illustration', 'Mixed Media'],
              href: '/gallery',
            },
          ],
        }),
        s('intersection', {
          heading: 'The Intersection',
          body: 'I don’t see technology and art as opposites — they are the same practice observed from two angles. In ERP systems, I find the beauty of a flawless flow; the satisfaction of a complex problem resolving with the clarity of a finished composition. On canvas, I apply the rigour of the technician: every layer planned, every gesture deliberate.',
          leftStat: { title: 'Logical Rigor', body: 'Every system mapped, tested, and proven before it ships.' },
          rightStat: { title: 'Intuitive Flow', body: 'Every canvas an experiment in colour, chance, and feeling.' },
        }),
        s('ctaBanner', {
          heading: 'Let’s craft something meaningful.',
          body: 'Whether it is an enterprise system that needs a steady hand or a commission for your walls, I would love to hear from you.',
          buttonLabel: 'Get in touch',
          mode: 'email',
        }),
      ],
    },
    {
      slug: 'about',
      title: 'About & Contact',
      navLabel: 'About',
      navOrder: 3,
      showInNav: true,
      sections: [
        s('pageHero', {
          eyebrow: 'THE MAKER’S JOURNEY',
          title: 'Bridging the |Logic| of Systems and the |Soul| of Canvas.',
          body: 'For over a decade, I have lived a double life: navigating the architecture of enterprise ERP systems and Quality Assurance by profession, and chasing light and colour across canvases by vocation. Today, those two selves work side by side — each one sharpening the other.',
          stats: [
            { value: '10+', label: 'Years in IT' },
            { value: '500+', label: 'Gallery Pieces' },
          ],
          image: '/uploads/portrait.svg',
        }),
        s('dualIdentity', {
          heading: 'A Dual Identity',
          left: {
            icon: 'terminal',
            title: 'Technical Integrity',
            body: 'Specialising in ERP deployment and QA methodology, I bring an uncompromising standard of correctness to every implementation — because a system people rely on deserves nothing less.',
            tags: ['Dynamics 365', 'QA Strategy'],
          },
          quote: 'Precision is the bridge between a vision and its manifestation.',
          right: {
            icon: 'palette',
            title: 'Creative Expression',
            body: 'My studio practice is where intuition leads. Oil, ink and pixels — each medium a different dialect of the same language: making the unseen felt.',
            tags: ['Oil & Ink', 'Digital Art'],
          },
        }),
        s('contact', {
          heading: 'Let’s start a |Conversation.|',
          body: 'Whether you are planning a new ERP rollout, need a QA partner, or want to commission a piece for your collection — I am here to bring precision and soul to it.',
          email: 'hello@digitalatelier.com',
          location: 'Lagos · Remote worldwide',
          inquiryTypes: ['ERP / Systems Consulting', 'QA & Testing', 'Art Commission', 'Exhibition / Press', 'Other'],
          buttonLabel: 'Let’s Create Together',
          followHeading: 'FOLLOW THE PROCESS',
        }),
      ],
    },
    {
      slug: 'it-systems',
      title: 'IT & Systems Excellence',
      navLabel: 'IT & Systems',
      navOrder: 1,
      showInNav: true,
      sections: [
        s('pageHero', {
          eyebrow: 'SYSTEMS · QUALITY · PROCESS',
          title: 'Engineering Quality through |Soulful Precision.|',
          body: 'Bridging the gap between rigid ERP logic and human-centred software experiences. Specialist in Dynamics 365, automated testing frameworks, and strategic QA methodology.',
          primaryCta: { label: 'Explore ERP Case Studies', href: '#case-studies' },
          secondaryCta: { label: 'View Methodology', href: '#pillars' },
          stats: [{ value: '99.5%', label: 'Release Success Rate' }],
        }),
        s('pillars', {
          heading: 'Pillars of Practice',
          subheading: 'A harmonious blend of technical rigour and strategic oversight.',
          items: [
            {
              icon: 'draw',
              title: 'Manual & Automated Testing',
              body: 'Crafting resilient test suites that catch the failures humans miss — and exploratory testing that catches the ones machines never will.',
              tone: 'light',
            },
            {
              icon: 'psychology_alt',
              title: 'Strategic Methodology',
              body: 'Agile-native QA strategy woven into delivery from day one, so quality is designed in — not inspected in at the end.',
              tone: 'sage',
            },
            {
              icon: 'hub',
              title: 'ERP Ecosystems',
              body: 'Deep expertise in Microsoft Dynamics 365, NAV/BC to F&O migrations, and the integrations that hold an enterprise together.',
              tone: 'blush',
            },
            {
              icon: 'memory',
              title: 'Dynamics 365 Mastery',
              body: 'Configuration, extension, and data migration executed with production-grade discipline.',
              tone: 'dark',
            },
          ],
        }),
        s('caseStudies', {
          heading: 'Process Over Performance',
          subheading: 'A selective portfolio of enterprise transformations, told through outcomes.',
          anchor: 'case-studies',
          items: [
            {
              title: 'Financial ERP Overhaul',
              body: 'Led end-to-end QA for a Fortune 500-scale finance platform migration, replacing a legacy stack with Dynamics 365 Finance while the business kept running.',
              image: '/uploads/case-finance.svg',
              stats: [
                { value: '70%', label: 'Fewer production defects' },
                { value: '6 mo', label: 'Delivered ahead of plan' },
                { value: '440+', label: 'Automated test cases' },
              ],
            },
            {
              title: 'Global Logistics Migration',
              body: 'Coordinated a phased, multi-country cutover to Dynamics 365 Supply Chain, harmonising processes across warehouses without a single day of downtime.',
              image: '/uploads/case-logistics.svg',
              stats: [
                { value: '12', label: 'Countries migrated' },
                { value: '150k', label: 'Records validated daily' },
                { value: '100%', label: 'On-time cutovers' },
              ],
            },
          ],
        }),
        s('testimonials', {
          heading: 'Cultivating Quality',
          body: 'Testing is not a checklist — it is an act of care. I believe that a well-tested application is a gesture of respect towards the end user. My philosophy blends the analytical “left brain” requirements of ERP with the “right brain” empathy required for user-centric design.',
          quotes: [
            { text: 'She finds the failure modes no one else even thinks to look for.', author: 'Programme Director, ERP Delivery' },
            { text: 'A rare blend of engineering discipline and genuine artistry.', author: 'Head of Product' },
          ],
          images: ['/uploads/case-finance.svg', '/uploads/case-logistics.svg'],
        }),
        s('ctaBanner', {
          heading: 'Let’s build something |beautifully reliable.|',
          body: 'Currently accepting strategic consulting roles and QA leadership opportunities in ERP and SaaS domains.',
          buttonLabel: 'Start a Conversation',
          mode: 'button',
          href: '/about',
          tone: 'dark',
        }),
      ],
    },
    {
      slug: 'gallery',
      title: 'The Creative Canvas',
      navLabel: 'Art Gallery',
      navOrder: 2,
      showInNav: true,
      sections: [
        s('galleryHero', {
          eyebrow: 'CURRENT EXHIBITION',
          title: 'The Soul of the Machine: A Study in Digital Duality',
          body: 'Exploring the convergence between structured ERP systems and the original chaos of oil on canvas — a collection nightly in the humanity in the logic.',
          buttonLabel: 'View Exhibition',
          image: '/uploads/hero-soul-machine.svg',
        }),
        s('galleryGrid', {
          heading: 'Selected Works',
          intro: 'A living archive — pieces are added, retired and rearranged from the atelier’s admin desk.',
        }),
        s('newsletter', {
          heading: 'Stay Within the Atelier',
          body: 'Receive occasional letters with new pieces, exhibition dates, and notes from the studio — no noise, only work worth showing.',
          buttonLabel: 'Subscribe',
        }),
      ],
    },
  ]);

  await Artwork.create([
    { title: 'Ember Study I', category: 'Paintings', medium: 'Oil on canvas', year: '2025', order: 0, imageUrl: '/uploads/art-ember.svg', description: 'A meditation on warmth held inside dark structure.' },
    { title: 'Terracotta Terrain', category: 'Paintings', medium: 'Oil on panel', year: '2024', order: 1, imageUrl: '/uploads/art-terrain.svg', description: 'Layered ridges of ochre and rust, mapped like a system diagram.' },
    { title: 'Graphite Sequence', category: 'Sketches', medium: 'Graphite on paper', year: '2024', order: 2, imageUrl: '/uploads/art-graphite.svg', description: 'Repetition as ritual — twelve strokes toward a single gesture.' },
    { title: 'Sage Interior', category: 'Mixed Media', medium: 'Acrylic & collage', year: '2025', order: 3, imageUrl: '/uploads/art-sage.svg', description: 'A quiet room rendered in the palette of the atelier itself.' },
    { title: 'Dusk Protocol', category: 'Digital Works', medium: 'Digital painting', year: '2026', order: 4, imageUrl: '/uploads/art-dusk.svg', description: 'The machine dreams in terracotta.' },
    { title: 'Signal & Noise', category: 'Digital Works', medium: 'Generative composition', year: '2026', order: 5, imageUrl: '/uploads/art-signal.svg', description: 'Four channels of order interrupted by one perfect accident.' },
  ]);
}
