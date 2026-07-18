import { Schema, model, Document } from 'mongoose';

export interface ISetting extends Document {
  key: string;
  data: Record<string, unknown>;
}

const SettingSchema = new Schema<ISetting>(
  {
    key: { type: String, required: true, unique: true },
    data: { type: Schema.Types.Mixed, default: {} },
  },
  { minimize: false }
);

export const Setting = model<ISetting>('Setting', SettingSchema);
