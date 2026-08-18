import mongoose, { Schema, Document, Model } from 'mongoose';
import { ILocalizedField } from './Product';

export interface ICategory extends Document {
  title: ILocalizedField;
  slug: string;
  description?: ILocalizedField;
  image: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const LocalizedSchema = new Schema({
  tr: { type: String, required: true },
  en: { type: String, default: '' },
  de: { type: String, default: '' },
  ru: { type: String, default: '' },
  ar: { type: String, default: '' },
}, { _id: false });

const CategorySchema = new Schema<ICategory>(
  {
    title: { type: LocalizedSchema, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: LocalizedSchema },
    image: { type: String, required: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Category: Model<ICategory> =
  mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);
