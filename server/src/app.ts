import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import pageRoutes from './routes/pages';
import artworkRoutes from './routes/artworks';
import settingRoutes from './routes/settings';
import { uploadsApi, uploadsServe } from './routes/uploads';

export const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));

app.use('/uploads', uploadsServe);
app.use('/api/auth', authRoutes);
app.use('/api/pages', pageRoutes);
app.use('/api/artworks', artworkRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/uploads', uploadsApi);
app.get('/api/health', (_req, res) => res.json({ ok: true }));

export default app;
