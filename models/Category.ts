import mongoose, { Schema, Document, Model } from 'mongoose';
import { ILocalizedField } from './Product';

export interface ICategoryTranslation {
  name: string;
  description?: string;
}

export interface ICategoryTranslations {
  tr?: ICategoryTranslation;
  en?: ICategoryTranslation;
  de?: ICategoryTranslation;
  ar?: ICategoryTranslation;
}

export interface ICategory extends Document {
  // Legacy fields
  title: ILocalizedField;
  description?: ILocalizedField;
  
  // New CMS fields
  slug: string;
  translations?: ICategoryTranslations;
  
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

const CategoryTranslationSchema = new Schema({
  name: { type: String },
  description: { type: String },
}, { _id: false });

const CategoryTranslationsSchema = new Schema({
  tr: { type: CategoryTranslationSchema },
  en: { type: CategoryTranslationSchema },
  de: { type: CategoryTranslationSchema },
  ar: { type: CategoryTranslationSchema },
}, { _id: false });

const CategorySchema = new Schema<ICategory>(
  {
    title: { type: LocalizedSchema, required: true }, // Legacy
    description: { type: LocalizedSchema }, // Legacy
    
    slug: { type: String, required: true, unique: true, index: true },
    translations: { type: CategoryTranslationsSchema },
    
    image: { type: String, required: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Category: Model<ICategory> =
  mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);
