const router = require('express').Router();
const auth = require('../middleware/auth');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { wrap } = require('../utils');

router.use(auth);

const loadCart = async (userId) =>
  (await Cart.findOne({ user: userId })) || (await Cart.create({ user: userId }));

const sendCart = async (res, cart) => {
  await cart.populate('items.product');
  const items = cart.items.filter((i) => i.product);
  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);
  res.json({ items, total, count });
};

router.get('/', wrap(async (req, res) => {
  await sendCart(res, await loadCart(req.user._id));
}));

// body: { productId, quantity }
router.post('/', wrap(async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  const cart = await loadCart(req.user._id);
  const item = cart.items.find((i) => i.product.toString() === productId);
  if (item) item.quantity += Number(quantity);
  else cart.items.push({ product: productId, quantity: Number(quantity) });
  await cart.save();
  await sendCart(res, cart);
}));

// body: { quantity }  (0 ya kam = remove)
router.put('/:productId', wrap(async (req, res) => {
  const quantity = Number(req.body.quantity);
  const cart = await loadCart(req.user._id);
  if (quantity < 1) {
    cart.items = cart.items.filter((i) => i.product.toString() !== req.params.productId);
  } else {
    const item = cart.items.find((i) => i.product.toString() === req.params.productId);
    if (!item) return res.status(404).json({ message: 'Item not in cart' });
    item.quantity = quantity;
  }
  await cart.save();
  await sendCart(res, cart);
}));

router.delete('/:productId', wrap(async (req, res) => {
  const cart = await loadCart(req.user._id);
  cart.items = cart.items.filter((i) => i.product.toString() !== req.params.productId);
  await cart.save();
  await sendCart(res, cart);
}));

// poora cart khaali
router.delete('/', wrap(async (req, res) => {
  const cart = await loadCart(req.user._id);
  cart.items = [];
  await cart.save();
  await sendCart(res, cart);
}));

module.exports = router;