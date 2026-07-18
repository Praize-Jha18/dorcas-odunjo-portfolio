import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { randomUUID } from 'crypto';
import { Image } from '../models/Image';
import { requireAuth } from '../middleware/auth';

// Legacy dev uploads dir — kept only as a read fallback for files uploaded
// before images moved into MongoDB.
export const UPLOADS_DIR = path.join(__dirname, '..', '..', 'uploads');

const EXT_BY_MIME: Record<string, string> = {
  'image/png': '.png',
  'image/jpeg': '.jpg',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'image/svg+xml': '.svg',
  'image/avif': '.avif',
};

// Memory storage + 4MB cap: Vercel serverless bodies are limited to ~4.5MB.
// The client compresses large photos before uploading.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 4 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => cb(null, file.mimetype in EXT_BY_MIME),
});

export const uploadsApi = Router();

uploadsApi.post('/', requireAuth, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No image received (max 4MB, images only)' });
  const slug = `${randomUUID()}${EXT_BY_MIME[req.file.mimetype]}`;
  await Image.create({ slug, mime: req.file.mimetype, data: req.file.buffer });
  res.status(201).json({ url: `/uploads/${slug}` });
});

// Serves images by slug from MongoDB, falling back to the legacy disk folder.
export const uploadsServe = Router();

uploadsServe.get('/:slug', async (req, res) => {
  const { slug } = req.params;
  if (slug.includes('/') || slug.includes('..')) return res.status(400).end();
  const image = await Image.findOne({ slug });
  if (image) {
    res.setHeader('Content-Type', image.mime);
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    return res.send(image.data);
  }
  const legacy = path.join(UPLOADS_DIR, slug);
  if (fs.existsSync(legacy)) return res.sendFile(legacy);
  res.status(404).json({ error: 'Image not found' });
});
