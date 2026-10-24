const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, enum: ['Clothing', 'Collectibles', 'Accessories'], required: true },
    fandom: { type: String, enum: ['Anime', 'Manga', 'Gaming'], required: true },
    emoji: { type: String, default: '' },
    image: { type: String, default: '' },
    rating: { type: Number, default: 4.5, min: 0, max: 5 },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);