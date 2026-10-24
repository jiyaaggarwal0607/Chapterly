const User = require('../models/User');

exports.getMe = (req, res) => res.json(req.user);

exports.updateMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { name, avatar, password } = req.body;
    if (name) user.name = name;
    if (avatar !== undefined) user.avatar = avatar;
    if (password) user.password = password;
    await user.save();
    const { password: _, ...safe } = user.toObject();
    res.json(safe);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};