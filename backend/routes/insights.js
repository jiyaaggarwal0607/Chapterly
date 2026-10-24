const router = require('express').Router();
const auth = require('../middleware/auth');
const requireRole = require('../middleware/role');
const Manga = require('../models/Manga');
const Product = require('../models/Product');
const User = require('../models/User');
const Cart = require('../models/Cart');
const { wrap } = require('../utils');

// sirf login + company role
router.use(auth, requireRole('company'));

// GET /api/insights
router.get('/', wrap(async (req, res) => {
  const mangas = Manga.collection.name;
  const products = Product.collection.name;

  const [viewsByGenre, favouritesByGenre, wishlist, cartByCategory] = await Promise.all([
    // 1. har genre ke total views
    Manga.aggregate([
      { $unwind: '$genres' },
      { $group: { _id: '$genres', views: { $sum: '$views' }, titles: { $sum: 1 } } },
      { $sort: { views: -1 } },
      { $project: { _id: 0, genre: '$_id', views: 1, titles: 1 } },
    ]),

    // 2. har genre ke favourites
    User.aggregate([
      { $unwind: '$favourites' },
      { $lookup: { from: mangas, localField: 'favourites', foreignField: '_id', as: 'manga' } },
      { $unwind: '$manga' },
      { $unwind: '$manga.genres' },
      { $group: { _id: '$manga.genres', favourites: { $sum: 1 } } },
      { $sort: { favourites: -1 } },
      { $project: { _id: 0, genre: '$_id', favourites: 1 } },
    ]),

    // 3. wishlist: category aur fandom ke hisaab se
    User.aggregate([
      { $unwind: '$wishlist' },
      { $lookup: { from: products, localField: 'wishlist', foreignField: '_id', as: 'product' } },
      { $unwind: '$product' },
      {
        $facet: {
          byCategory: [
            { $group: { _id: '$product.category', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $project: { _id: 0, category: '$_id', count: 1 } },
          ],
          byFandom: [
            { $group: { _id: '$product.fandom', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $project: { _id: 0, fandom: '$_id', count: 1 } },
          ],
        },
      },
    ]),

    // 4. cart quantity per category
    Cart.aggregate([
      { $unwind: '$items' },
      { $lookup: { from: products, localField: 'items.product', foreignField: '_id', as: 'product' } },
      { $unwind: '$product' },
      { $group: { _id: '$product.category', quantity: { $sum: '$items.quantity' } } },
      { $sort: { quantity: -1 } },
      { $project: { _id: 0, category: '$_id', quantity: 1 } },
    ]),
  ]);

  const wishlistByCategory = wishlist[0]?.byCategory || [];
  const wishlistByFandom = wishlist[0]?.byFandom || [];

  res.json({
    top: {
      genreByViews: viewsByGenre[0]?.genre || null,
      genreByFavourites: favouritesByGenre[0]?.genre || null,
      categoryByWishlist: wishlistByCategory[0]?.category || null,
      fandomByWishlist: wishlistByFandom[0]?.fandom || null,
      categoryByCart: cartByCategory[0]?.category || null,
    },
    viewsByGenre,
    favouritesByGenre,
    wishlistByCategory,
    wishlistByFandom,
    cartByCategory,
  });
}));

module.exports = router;