import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISupportMessage {
  sender: 'customer' | 'admin';
  message: string;
  attachment?: string;
  createdAt: Date;
}

export interface ISupportTicket extends Document {
  userId: mongoose.Types.ObjectId;
  subject: string;
  status: 'new' | 'investigating' | 'answered' | 'closed';
  messages: ISupportMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const SupportMessageSchema = new Schema({
  sender: { type: String, enum: ['customer', 'admin'], required: true },
  message: { type: String, required: true },
  attachment: { type: String },
  createdAt: { type: Date, default: Date.now },
}, { _id: true });

const SupportTicketSchema = new Schema<ISupportTicket>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    subject: { type: String, required: true },
    status: { type: String, enum: ['new', 'investigating', 'answered', 'closed'], default: 'new' },
    messages: [SupportMessageSchema],
  },
  { timestamps: true }
);

export const SupportTicket: Model<ISupportTicket> =
  mongoose.models.SupportTicket || mongoose.model<ISupportTicket>('SupportTicket', SupportTicketSchema);
