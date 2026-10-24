const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    taskType: { type: String, enum: ['Manga', 'Review', 'Proofreading'], required: true },
    fromLanguage: { type: String, required: true },
    toLanguage: { type: String, required: true },
    level: { type: String, enum: ['Beginner friendly', 'Intermediate'], default: 'Beginner friendly' },
    paid: { type: Boolean, default: true },
    badge: { type: String, enum: ['Popular', 'New', 'Review', 'Flexible', ''], default: '' },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('TranslationProject', projectSchema);