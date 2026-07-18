import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, requireAuth } from '../middleware/auth';

const router = Router();

router.post('/login', (req, res) => {
  const { email, password } = req.body ?? {};
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@digitalatelier.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'change-me';
  if (email !== adminEmail || password !== adminPassword) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  const token = jwt.sign({ sub: email, role: 'admin' }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token });
});

router.get('/me', requireAuth, (_req, res) => {
  res.json({ ok: true });
});

export default router;
