const esc = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// "contains" search, ignores capital/small letters
exports.like = (s) => new RegExp(esc(s), 'i');
// exact match, ignores capital/small letters
exports.exact = (s) => new RegExp(`^${esc(s)}$`, 'i');
// catches errors so the server never crashes
exports.wrap = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch((err) =>
    res.status(500).json({ message: err.message })
  );