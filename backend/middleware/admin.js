module.exports = function (req, res, next) {
  // Check if user is authenticated and has a role
  if (!req.user || !req.user.role) {
    return res.status(401).json({ message: 'Authentication required with user role' });
  }

  const { role } = req.user;

  if (role !== 'admin' && role !== 'teacher') {
    return res.status(403).json({ message: 'Forbidden: You do not have the required permissions' });
  }

  next();
};
