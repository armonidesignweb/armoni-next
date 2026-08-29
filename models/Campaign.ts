import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ILocalizedField {
  tr: string;
  en?: string;
  de?: string;
  ar?: string;
}

export interface ICampaign extends Document {
  title: ILocalizedField;
  description: ILocalizedField;
  image?: string;
  target: 'all' | 'specific';
  targetUsers?: mongoose.Types.ObjectId[];
  startDate: Date;
  endDate: Date;
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

const CampaignSchema = new Schema<ICampaign>(
  {
    title: { type: LocalizedSchema, required: true },
    description: { type: LocalizedSchema, required: true },
    image: { type: String },
    target: { type: String, enum: ['all', 'specific'], default: 'all' },
    targetUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Campaign: Model<ICampaign> =
  mongoose.models.Campaign || mongoose.model<ICampaign>('Campaign', CampaignSchema);
