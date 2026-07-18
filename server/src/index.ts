import 'dotenv/config';
import app from './app';
import { ensureReady } from './bootstrap';

const port = Number(process.env.PORT) || 4000;

ensureReady()
  .then(() => {
    app.listen(port, () => console.log(`[server] Listening on http://localhost:${port}`));
  })
  .catch((err) => {
    console.error('[server] Failed to start:', err);
    process.exit(1);
  });
