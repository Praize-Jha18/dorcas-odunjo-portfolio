import { connectDb } from './db';
import { seedIfEmpty } from './seed';

let ready: Promise<void> | null = null;

/**
 * Connects to MongoDB and seeds an empty database, exactly once per process.
 * Safe to call on every request in a serverless environment — after the first
 * call it just awaits the cached promise.
 */
export function ensureReady(): Promise<void> {
  if (!ready) {
    ready = (async () => {
      await connectDb();
      await seedIfEmpty();
    })().catch((err) => {
      ready = null; // allow retry on next invocation
      throw err;
    });
  }
  return ready;
}
