import { Schema, model, Document } from 'mongoose';

export interface ISection {
  uid: string;
  type: string;
  data: Record<string, unknown>;
}

export interface IPage extends Document {
  slug: string;
  title: string;
  navLabel: string;
  navOrder: number;
  showInNav: boolean;
  sections: ISection[];
}

const SectionSchema = new Schema<ISection>(
  {
    uid: { type: String, required: true },
    type: { type: String, required: true },
    data: { type: Schema.Types.Mixed, default: {} },
  },
  { _id: false }
);

const PageSchema = new Schema<IPage>(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    navLabel: { type: String, required: true },
    navOrder: { type: Number, default: 0 },
    showInNav: { type: Boolean, default: true },
    sections: { type: [SectionSchema], default: [] },
  },
  { timestamps: true, minimize: false }
);

export const Page = model<IPage>('Page', PageSchema);
