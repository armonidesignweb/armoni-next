import mongoose from 'mongoose';
const { Schema } = mongoose;

const LocalizedSchema = new Schema({
  tr: { type: String, required: true },
  en: { type: String, default: '' },
  de: { type: String, default: '' },
  ar: { type: String, default: '' },
  ru: { type: String, default: '' },
}, { _id: false });

const AnnouncementSchema = new Schema(
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

const Announcement = mongoose.models.Announcement || mongoose.model('Announcement', AnnouncementSchema);

async function run() {
  try {
    const announcement = new Announcement({
      title: { tr: 'test', en: '', de: '', ru: '', ar: '' },
      content: { tr: 'duyusudur şimdi', en: '', de: '', ru: '', ar: '' },
      image: '',
      isActive: true,
    });
    await announcement.validate();
    console.log("Validation passed!");
  } catch(e) {
    console.log("Validation Error:", e.message);
  }
}
run();
