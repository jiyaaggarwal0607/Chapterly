const mongoose = require('mongoose');

const mangaSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  genres: [{ type: String }],
  status: { type: String, enum: ['ongoing', 'completed'], default: 'ongoing' },
  rating: { type: Number, default: 0, min: 0, max: 10 },
  views: { type: Number, default: 0 },
  latestChapter: { type: Number, default: 1 },
  featured: { type: Boolean, default: false },
  editorsPick: { type: Boolean, default: false },
  coverImage: { type: String, default: '' },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Manga', mangaSchema);