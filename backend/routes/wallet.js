const router = require('express').Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { wrap } = require('../utils');

router.use(auth);

router.get('/', wrap(async (req, res) => {
  const transactions = await Transaction.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .limit(50);
  res.json({ balance: req.user.walletBalance, transactions });
}));

// body: { amount }
router.post('/add', wrap(async (req, res) => {
  const amount = Number(req.body.amount);
  if (!Number.isFinite(amount) || amount <= 0 || amount > 50000)
    return res.status(400).json({ message: 'Enter an amount between 1 and 50000' });

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $inc: { walletBalance: amount } },
    { new: true }
  );
  await Transaction.create({ user: user._id, amount, type: 'credit', note: 'Wallet top-up' });
  res.json({ balance: user.walletBalance });
}));

module.exports = router;