import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ILocalizedField {
  tr: string;
  en?: string;
  de?: string;
  ru?: string;
  ar?: string;
}

export interface IProduct extends Document {
  title: ILocalizedField;
  slug: string;
  categorySlug: string;
  description?: ILocalizedField;
  features?: ILocalizedField[];
  images: string[];
  dimensions?: {
    width?: number;
    depth?: number;
    height?: number;
    seatHeight?: number;
  };
  materials?: string[];
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

const ProductSchema = new Schema<IProduct>(
  {
    title: { type: LocalizedSchema, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    categorySlug: { type: String, required: true, index: true },
    description: { type: LocalizedSchema },
    features: [LocalizedSchema],
    images: [{ type: String, required: true }],
    dimensions: {
      width: Number,
      depth: Number,
      height: Number,
      seatHeight: Number,
    },
    materials: [String],
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
