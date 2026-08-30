import mongoose, { Schema, Document, Model } from 'mongoose';
import { ILocalizedField, IProductTranslations } from './Product';

export interface IProductOverride extends Document {
  legacyProductId: string; // The ID from lib/products-data.ts
  price?: number;
  isActive?: boolean;
  order?: number;
  image?: string;
  images?: string[];
  
  // Overridable content
  title?: ILocalizedField;
  description?: ILocalizedField;
  categorySlug?: string;
  translations?: IProductTranslations;
  
  createdAt: Date;
  updatedAt: Date;
}

const LocalizedSchema = new Schema({
  tr: { type: String },
  en: { type: String },
  de: { type: String },
  ru: { type: String },
  ar: { type: String },
}, { _id: false });

const ProductTranslationSchema = new Schema({
  name: { type: String },
  description: { type: String },
  features: [{ type: String }],
}, { _id: false });

const ProductTranslationsSchema = new Schema({
  tr: { type: ProductTranslationSchema },
  en: { type: ProductTranslationSchema },
  de: { type: ProductTranslationSchema },
  ar: { type: ProductTranslationSchema },
}, { _id: false });

const ProductOverrideSchema = new Schema<IProductOverride>(
  {
    legacyProductId: { type: String, required: true, unique: true, index: true },
    price: { type: Number },
    isActive: { type: Boolean },
    order: { type: Number },
    image: { type: String },
    images: [{ type: String }],
    
    title: { type: LocalizedSchema },
    description: { type: LocalizedSchema },
    categorySlug: { type: String },
    translations: { type: ProductTranslationsSchema },
  },
  { timestamps: true }
);

export const ProductOverride: Model<IProductOverride> =
  mongoose.models.ProductOverride || mongoose.model<IProductOverride>('ProductOverride', ProductOverrideSchema);
