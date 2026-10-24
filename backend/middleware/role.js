module.exports = (role) => (req, res, next) =>
  req.user.role === role
    ? next()
    : res.status(403).json({ message: `Only ${role} accounts can do this` });