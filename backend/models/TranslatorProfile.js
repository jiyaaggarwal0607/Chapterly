const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    languagePairs: [{ type: String }],
    experienceLevel: { type: String, default: '' },
    bio: { type: String, default: '' },
    portfolioLink: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('TranslatorProfile', profileSchema);