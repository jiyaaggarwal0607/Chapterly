const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'TranslationProject', required: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    languagePair: { type: String, default: '' },
    experienceLevel: { type: String, default: '' },
    portfolioLink: { type: String, default: '' },
    whyJoin: { type: String, default: '' },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  },
  { timestamps: true }
);

// one user can apply to one project only once
applicationSchema.index({ user: 1, project: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);