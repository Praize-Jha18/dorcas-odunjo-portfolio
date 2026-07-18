import { Schema, model, Document } from 'mongoose';

export interface IArtwork extends Document {
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  year: string;
  medium: string;
  order: number;
  published: boolean;
}

const ArtworkSchema = new Schema<IArtwork>(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    category: { type: String, default: 'Paintings' },
    imageUrl: { type: String, default: '' },
    year: { type: String, default: '' },
    medium: { type: String, default: '' },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Artwork = model<IArtwork>('Artwork', ArtworkSchema);
