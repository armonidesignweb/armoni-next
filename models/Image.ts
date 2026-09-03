import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IImage extends Document {
  filename: string;
  contentType: string;
  data: Buffer;
  createdAt: Date;
}

const ImageSchema = new Schema<IImage>(
  {
    filename: { type: String, required: true },
    contentType: { type: String, required: true },
    data: { type: Buffer, required: true },
  },
  { timestamps: true }
);

export const ImageModel: Model<IImage> =
  mongoose.models.Image || mongoose.model<IImage>('Image', ImageSchema);
