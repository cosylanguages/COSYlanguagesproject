const User = require('../models/user');

// This is a mock authentication middleware.
// In a real application, this would be replaced with a proper JWT or session-based authentication middleware.
const mockAuth = async (req, res, next) => {
  try {
    // Check if a user exists in the database.
    let testUser = await User.findOne({ username: 'testuser' });

    // If no user is found, create one.
    if (!testUser) {
      testUser = new User({
        username: 'testuser',
        password: 'password', // In a real app, this would be hashed
      });
      await testUser.save();
    }

    // Attach the user to the request object.
    req.user = testUser;
    next();
  } catch (error) {
    console.error('Mock auth middleware error:', error);
    res.status(500).json({ message: 'Internal server error in auth middleware.' });
  }
};

module.exports = mockAuth;
