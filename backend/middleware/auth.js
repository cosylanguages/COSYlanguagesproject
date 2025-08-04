const jwt = require('jsonwebtoken');

// IMPORTANT: In a production application, this secret should be stored in an environment variable.
const JWT_SECRET = 'your_jwt_secret';

module.exports = function (req, res, next) {
  // Get token from header
  const authHeader = req.header('Authorization');

  // Check if not token
  if (!authHeader) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  // The token is expected to be in the format "Bearer <token>"
  const token = authHeader.split(' ')[1];

  // Check if token is not valid
  if (!token) {
    return res.status(401).json({ message: 'Token is not valid' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};
