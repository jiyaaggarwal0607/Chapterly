const router = require('express').Router();
const Manga = require('../models/Manga');
const { wrap, like, exact } = require('../utils');

// GET /api/manga?search=&genre=&status=&sort=popular|latest|rating&limit=
router.get('/', wrap(async (req, res) => {
  const { search, genre, status, sort = 'popular', limit } = req.query;
  const filter = {};
  if (search) filter.title = like(search);
  if (genre && genre !== 'all') filter.genres = exact(genre);
  if (status && status !== 'all') filter.status = exact(status);

  const sorts = {
    popular: { views: -1 },
    latest: { updatedAt: -1 },
    rating: { rating: -1 },
  };
  let query = Manga.find(filter).sort(sorts[sort] || sorts.popular);
  if (limit) query = query.limit(Number(limit));
  res.json(await query);
}));

// GET /api/manga/featured  -> featured story + editor's pick
router.get('/featured', wrap(async (req, res) => {
  const featured = await Manga.findOne({ featured: true });
  const editorsPick = await Manga.findOne({ editorsPick: true });
  res.json({ featured, editorsPick });
}));

router.get('/:id', wrap(async (req, res) => {
  const manga = await Manga.findById(req.params.id);
  if (!manga) return res.status(404).json({ message: 'Manga not found' });
  res.json(manga);
}));

module.exports = router;