import mongoose, { Schema, Document, Model } from 'mongoose';
import { ILocalizedField } from './Product';

export interface IProject extends Document {
  title: ILocalizedField;
  slug: string;
  location?: string;
  year?: number;
  description?: ILocalizedField;
  coverImage: string;
  gallery: string[];
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

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: LocalizedSchema, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    location: { type: String },
    year: { type: Number },
    description: { type: LocalizedSchema },
    coverImage: { type: String, required: true },
    gallery: [{ type: String }],
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Project: Model<IProject> =
  mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
