const router = require('express').Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const { wrap } = require('../utils');

router.use(auth);

router.get('/', wrap(async (req, res) => {
  const user = await User.findById(req.user._id).populate('wishlist');
  res.json(user.wishlist);
}));

router.post('/:productId', wrap(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { $addToSet: { wishlist: req.params.productId } });
  res.json({ message: 'Added to wishlist' });
}));

router.delete('/:productId', wrap(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { $pull: { wishlist: req.params.productId } });
  res.json({ message: 'Removed from wishlist' });
}));

module.exports = router;