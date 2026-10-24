const router = require('express').Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const { wrap } = require('../utils');

router.use(auth);

router.get('/', wrap(async (req, res) => {
  const user = await User.findById(req.user._id).populate('favourites');
  res.json(user.favourites);
}));

router.post('/:mangaId', wrap(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { $addToSet: { favourites: req.params.mangaId } });
  res.json({ message: 'Added to favourites' });
}));

router.delete('/:mangaId', wrap(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { $pull: { favourites: req.params.mangaId } });
  res.json({ message: 'Removed from favourites' });
}));

module.exports = router;