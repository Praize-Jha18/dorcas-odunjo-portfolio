// Vercel serverless entry: wraps the whole Express API in one function.
// vercel.json rewrites /api/* and /uploads/* here.
import type { IncomingMessage, ServerResponse } from 'http';
import app from '../server/src/app';
import { ensureReady } from '../server/src/bootstrap';

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  await ensureReady();
  return app(req, res);
}
