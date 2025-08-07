const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/user');

// IMPORTANT: In a production application, this secret should be stored in an environment variable.
const JWT_SECRET = 'your_jwt_secret';

// Signup route
router.post('/signup', async (req, res) => {
  const { username, password, language, level } = req.body;

  try {
    let user = await User.findOne({ username });

    if (user && user.isGuest) {
      // Convert guest user to a real user
      user.isGuest = false;
      user.language = language;
      user.level = level;
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();
    } else if (user) {
      return res.status(400).json({ message: 'User already exists' });
    } else {
      // Create a new user
      user = new User({
        username,
        password,
        language,
        level,
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();
    }

    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };

    jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: 3600 }, // Expires in 1 hour
      (err, token) => {
        if (err) throw err;
        res.json({ token, userId: user.id });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    let user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };

    jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;
        res.json({ token, userId: user.id });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Logout route
router.post('/logout', (req, res) => {
  // In a token-based system, the client is responsible for destroying the token.
  // The server can optionally implement a token blacklist.
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;
