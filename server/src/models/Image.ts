import { Schema, model, Document } from 'mongoose';

// Images are stored in MongoDB (not on disk) so they survive serverless deploys,
// where the filesystem is ephemeral. Served at GET /uploads/:slug.
export interface IImage extends Document {
  slug: string;
  mime: string;
  data: Buffer;
}

const ImageSchema = new Schema<IImage>({
  slug: { type: String, required: true, unique: true },
  mime: { type: String, required: true },
  data: { type: Buffer, required: true },
});

export const Image = model<IImage>('Image', ImageSchema);
