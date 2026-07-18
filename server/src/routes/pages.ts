import { Router } from 'express';
import { randomUUID } from 'crypto';
import { Page } from '../models/Page';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/', async (_req, res) => {
  const pages = await Page.find().sort({ navOrder: 1 });
  res.json(pages);
});

router.get('/:slug', async (req, res) => {
  const page = await Page.findOne({ slug: req.params.slug });
  if (!page) return res.status(404).json({ error: 'Page not found' });
  res.json(page);
});

router.post('/', requireAuth, async (req, res) => {
  const { slug, title, navLabel, navOrder, showInNav, sections } = req.body ?? {};
  if (!slug || !title) return res.status(400).json({ error: 'slug and title are required' });
  const existing = await Page.findOne({ slug });
  if (existing) return res.status(409).json({ error: 'A page with that slug already exists' });
  const page = await Page.create({
    slug,
    title,
    navLabel: navLabel || title,
    navOrder: navOrder ?? 99,
    showInNav: showInNav ?? true,
    sections: sections ?? [],
  });
  res.status(201).json(page);
});

router.put('/:slug', requireAuth, async (req, res) => {
  const { title, navLabel, navOrder, showInNav, sections } = req.body ?? {};
  const page = await Page.findOne({ slug: req.params.slug });
  if (!page) return res.status(404).json({ error: 'Page not found' });
  if (title !== undefined) page.title = title;
  if (navLabel !== undefined) page.navLabel = navLabel;
  if (navOrder !== undefined) page.navOrder = navOrder;
  if (showInNav !== undefined) page.showInNav = showInNav;
  if (sections !== undefined) {
    page.sections = sections.map((s: { uid?: string; type: string; data?: object }) => ({
      uid: s.uid || randomUUID(),
      type: s.type,
      data: s.data ?? {},
    }));
    page.markModified('sections');
  }
  await page.save();
  res.json(page);
});

router.delete('/:slug', requireAuth, async (req, res) => {
  const page = await Page.findOneAndDelete({ slug: req.params.slug });
  if (!page) return res.status(404).json({ error: 'Page not found' });
  res.json({ ok: true });
});

export default router;
