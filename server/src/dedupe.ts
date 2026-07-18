import 'dotenv/config';
import mongoose from 'mongoose';
import { Page } from './models/Page';
import { Artwork } from './models/Artwork';
import { Setting } from './models/Setting';

// One-off cleanup: removes duplicate documents left by two servers racing the seed.
async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI not set');
  await mongoose.connect(uri, { dbName: process.env.DB_NAME || 'digital-atelier' });

  for (const [model, keyField] of [
    [Page, 'slug'],
    [Artwork, 'title'],
    [Setting, 'key'],
  ] as const) {
    const docs = await (model as mongoose.Model<any>).find().sort({ _id: 1 });
    const seen = new Set<string>();
    let removed = 0;
    for (const doc of docs) {
      const key = String(doc[keyField]);
      if (seen.has(key)) {
        await doc.deleteOne();
        removed++;
      } else {
        seen.add(key);
      }
    }
    console.log(`${(model as mongoose.Model<any>).modelName}: kept ${seen.size}, removed ${removed}`);
  }

  await Page.syncIndexes();
  await Setting.syncIndexes();
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
