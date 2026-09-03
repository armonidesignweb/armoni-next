import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISiteSettings extends Document {
  siteTitle: string;
  metaDescription: string;
  logo: string;
  favicon: string;
  phone: string;
  email: string;
  address: string;
  whatsapp: string;
  instagram: string;
  facebook: string;
  otherUrls: string;
  footerText: string;
  googleAnalytics: string;
  googleTagManager: string;
  googleAds: string;
  createdAt: Date;
  updatedAt: Date;
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    siteTitle: { type: String, default: 'Armoni Design' },
    metaDescription: { type: String, default: '' },
    logo: { type: String, default: '' },
    favicon: { type: String, default: '' },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    address: { type: String, default: '' },
    whatsapp: { type: String, default: '' },
    instagram: { type: String, default: '' },
    facebook: { type: String, default: '' },
    otherUrls: { type: String, default: '' },
    footerText: { type: String, default: '' },
    googleAnalytics: { type: String, default: '' },
    googleTagManager: { type: String, default: '' },
    googleAds: { type: String, default: '' },
  },
  { timestamps: true }
);

export const SiteSettings: Model<ISiteSettings> =
  mongoose.models.SiteSettings || mongoose.model<ISiteSettings>('SiteSettings', SiteSettingsSchema);
