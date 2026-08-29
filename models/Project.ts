import mongoose, { Schema, Document, Model } from 'mongoose';
import { ILocalizedField } from './Product';

export interface IProjectTranslation {
  name: string;
  description?: string;
  location?: string;
}

export interface IProjectTranslations {
  tr?: IProjectTranslation;
  en?: IProjectTranslation;
  de?: IProjectTranslation;
  ar?: IProjectTranslation;
}

export interface IProject extends Document {
  // Legacy fields
  title: ILocalizedField;
  description?: ILocalizedField;
  location?: string;
  
  // New CMS fields
  slug: string;
  translations?: IProjectTranslations;
  
  year?: number;
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

const ProjectTranslationSchema = new Schema({
  name: { type: String },
  description: { type: String },
  location: { type: String },
}, { _id: false });

const ProjectTranslationsSchema = new Schema({
  tr: { type: ProjectTranslationSchema },
  en: { type: ProjectTranslationSchema },
  de: { type: ProjectTranslationSchema },
  ar: { type: ProjectTranslationSchema },
}, { _id: false });

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: LocalizedSchema, required: true }, // Legacy
    description: { type: LocalizedSchema }, // Legacy
    location: { type: String }, // Legacy
    
    slug: { type: String, required: true, unique: true, index: true },
    translations: { type: ProjectTranslationsSchema },
    
    year: { type: Number },
    coverImage: { type: String, required: true },
    gallery: [{ type: String }],
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Project: Model<IProject> =
  mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
