import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ILocalizedField {
  tr: string;
  en?: string;
  de?: string;
  ar?: string;
}

export interface ISetting extends Document {
  key: string;
  value: string;
  localizedValue?: ILocalizedField;
  createdAt: Date;
  updatedAt: Date;
}

const LocalizedSchema = new Schema({
  tr: { type: String, required: true },
  en: { type: String, default: '' },
  de: { type: String, default: '' },
  ar: { type: String, default: '' },
}, { _id: false });

const SettingSchema = new Schema<ISetting>(
  {
    key: { type: String, required: true, unique: true, index: true },
    value: { type: String },
    localizedValue: { type: LocalizedSchema },
  },
  { timestamps: true }
);

export const Setting: Model<ISetting> =
  mongoose.models.Setting || mongoose.model<ISetting>('Setting', SettingSchema);
