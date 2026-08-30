import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ILocalizedField {
  tr: string;
  en?: string;
  de?: string;
  ru?: string;
  ar?: string;
}

export interface IProductTranslation {
  name: string;
  description?: string;
  features?: string[];
}

export interface IProductTranslations {
  tr?: IProductTranslation;
  en?: IProductTranslation;
  de?: IProductTranslation;
  ar?: IProductTranslation;
}

export interface IProduct extends Document {
  // Legacy fields
  title: ILocalizedField;
  description?: ILocalizedField;
  features?: ILocalizedField[];
  
  // New CMS fields
  slug: string;
  categorySlug: string;
  translations?: IProductTranslations;
  
  images: string[];
  dimensions?: {
    width?: number;
    depth?: number;
    height?: number;
    seatHeight?: number;
  };
  materials?: string[];
  price?: number;
  isFeatured: boolean;
  isActive: boolean;
  order: number;
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

const ProductSchema = new Schema<IProduct>(
  {
    title: { type: LocalizedSchema, required: true }, // Legacy
    description: { type: LocalizedSchema }, // Legacy
    features: [LocalizedSchema], // Legacy
    
    slug: { type: String, required: true, unique: true, index: true },
    categorySlug: { type: String, required: true, index: true },
    translations: { type: ProductTranslationsSchema },
    
    images: [{ type: String, required: true }],
    dimensions: {
      width: Number,
      depth: Number,
      height: Number,
      seatHeight: Number,
    },
    materials: [String],
    price: { type: Number },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
