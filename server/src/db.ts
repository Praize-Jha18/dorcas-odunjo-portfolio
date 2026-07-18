import mongoose from 'mongoose';

export async function connectDb(): Promise<{ inMemory: boolean }> {
  const uri = process.env.MONGODB_URI;
  if (uri) {
    const dbName = process.env.DB_NAME || 'digital-atelier';
    try {
      await mongoose.connect(uri, { dbName, serverSelectionTimeoutMS: 10000 });
      console.log(`[db] Connected to MongoDB (database: ${dbName})`);
      return { inMemory: false };
    } catch (err) {
      if (process.env.NODE_ENV === 'production' || process.env.VERCEL) throw err;
      console.error('[db] !!! Could not connect to MONGODB_URI:', err instanceof Error ? err.message : err);
      console.error('[db] !!! Falling back to in-memory MongoDB — YOUR CHANGES WILL NOT PERSIST until the URI is fixed.');
    }
  } else if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
    throw new Error('MONGODB_URI must be set in production');
  }
  // Dev-only fallback. The variable specifier keeps serverless bundlers from
  // trying to include mongodb-memory-server (a devDependency) in production.
  const memPkg = 'mongodb-memory-server';
  const { MongoMemoryServer } = await import(memPkg);
  const mem = await MongoMemoryServer.create();
  await mongoose.connect(mem.getUri('digital-atelier'));
  console.log('[db] Using in-memory MongoDB (data resets on restart)');
  return { inMemory: true };
}
