import { Router } from 'express';
import { Artwork } from '../models/Artwork';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/', async (req, res) => {
  const filter = req.query.all === '1' ? {} : { published: true };
  const artworks = await Artwork.find(filter).sort({ order: 1, createdAt: -1 });
  res.json(artworks);
});

router.post('/', requireAuth, async (req, res) => {
  const { title } = req.body ?? {};
  if (!title) return res.status(400).json({ error: 'title is required' });
  const artwork = await Artwork.create(req.body);
  res.status(201).json(artwork);
});

router.put('/:id', requireAuth, async (req, res) => {
  const artwork = await Artwork.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!artwork) return res.status(404).json({ error: 'Artwork not found' });
  res.json(artwork);
});

router.delete('/:id', requireAuth, async (req, res) => {
  const artwork = await Artwork.findByIdAndDelete(req.params.id);
  if (!artwork) return res.status(404).json({ error: 'Artwork not found' });
  res.json({ ok: true });
});

export default router;
