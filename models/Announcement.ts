import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ILocalizedField {
  tr: string;
  en?: string;
  de?: string;
  ar?: string;
}

export interface IAnnouncement extends Document {
  title: ILocalizedField;
  content: ILocalizedField;
  image?: string;
  target: 'all' | 'specific';
  targetUsers?: mongoose.Types.ObjectId[];
  publishDate: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const LocalizedSchema = new Schema({
  tr: { type: String, required: true },
  en: { type: String, default: '' },
  de: { type: String, default: '' },
  ar: { type: String, default: '' },
}, { _id: false });

const AnnouncementSchema = new Schema<IAnnouncement>(
  {
    title: { type: LocalizedSchema, required: true },
    content: { type: LocalizedSchema, required: true },
    image: { type: String },
    target: { type: String, enum: ['all', 'specific'], default: 'all' },
    targetUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    publishDate: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Announcement: Model<IAnnouncement> =
  mongoose.models.Announcement || mongoose.model<IAnnouncement>('Announcement', AnnouncementSchema);
