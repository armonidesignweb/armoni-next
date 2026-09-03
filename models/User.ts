import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  passwordSalt: string;
  role: 'admin' | 'customer';
  company?: string;
  phone?: string;
  isActive: boolean;
  locale?: string;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    passwordSalt: { type: String, required: true },
    role: { type: String, enum: ['admin', 'customer'], default: 'customer' },
    company: { type: String },
    phone: { type: String },
    isActive: { type: Boolean, default: true },
    locale: { type: String, default: 'tr' },
    lastLogin: { type: Date },
  },
  { timestamps: true }
);

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
