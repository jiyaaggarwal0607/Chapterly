const router = require('express').Router();
const Product = require('../models/Product');
const { wrap, like, exact } = require('../utils');

// GET /api/products?search=&category=&fandom=&minPrice=&maxPrice=&sort=featured|price_asc|price_desc|rating
router.get('/', wrap(async (req, res) => {
  const { search, category, fandom, minPrice, maxPrice, sort = 'featured' } = req.query;
  const filter = {};
  if (search) filter.$or = [{ name: like(search) }, { description: like(search) }];
  if (category && category !== 'all') filter.category = exact(category);
  if (fandom && fandom !== 'all') filter.fandom = exact(fandom);
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  const sorts = {
    featured: { featured: -1, createdAt: -1 },
    price_asc: { price: 1 },
    price_desc: { price: -1 },
    rating: { rating: -1 },
  };
  res.json(await Product.find(filter).sort(sorts[sort] || sorts.featured));
}));

router.get('/:id', wrap(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
}));

module.exports = router;