import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISiteContentTranslation {
  title?: string;
  subtitle?: string;
  content?: string;
  ctaText?: string;
  metaTitle?: string;
  metaDescription?: string;
  // Dynamic key-value pairs for other text fields
  additionalTexts?: Map<string, string>;
}

export interface ISiteContentTranslations {
  tr?: ISiteContentTranslation;
  en?: ISiteContentTranslation;
  de?: ISiteContentTranslation;
  ar?: ISiteContentTranslation;
}

export interface ISiteContent extends Document {
  key: string; // e.g., 'home_hero', 'about_section', 'footer'
  type: string; // 'section', 'page', 'global'
  image?: string;
  translations?: ISiteContentTranslations;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SiteContentTranslationSchema = new Schema({
  title: { type: String },
  subtitle: { type: String },
  content: { type: String },
  ctaText: { type: String },
  metaTitle: { type: String },
  metaDescription: { type: String },
  additionalTexts: { type: Map, of: String }
}, { _id: false });

const SiteContentTranslationsSchema = new Schema({
  tr: { type: SiteContentTranslationSchema },
  en: { type: SiteContentTranslationSchema },
  de: { type: SiteContentTranslationSchema },
  ar: { type: SiteContentTranslationSchema },
}, { _id: false });

const SiteContentSchema = new Schema<ISiteContent>(
  {
    key: { type: String, required: true, unique: true, index: true },
    type: { type: String, required: true, index: true },
    image: { type: String },
    translations: { type: SiteContentTranslationsSchema },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const SiteContent: Model<ISiteContent> =
  mongoose.models.SiteContent || mongoose.model<ISiteContent>('SiteContent', SiteContentSchema);
