import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IReference extends Document {
  companyName: string;
  logo: string;
  link?: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const ReferenceSchema = new Schema<IReference>(
  {
    companyName: { type: String, required: true },
    logo: { type: String, required: true },
    link: { type: String },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Reference: Model<IReference> =
  mongoose.models.Reference || mongoose.model<IReference>('Reference', ReferenceSchema);
